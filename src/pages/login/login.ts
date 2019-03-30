import { Component } from '@angular/core';
import { NavController, ModalController, Platform, LoadingController, AlertController, Events } from 'ionic-angular';

import { DynamicFormMobilePage } from '../dynamic-form-mobile/dynamic-form-mobile';
import { ApiHttpPublicService } from '../../services/apiHttpPublicServices';
import { DynamicFormWebPage } from '../dynamic-form-web/dynamic-form-web';
import { ApiStorageService } from '../../services/apiStorageService';
import { ApiAuthService } from '../../services/apiAuthService';
import { ApiMediaService } from '../../services/apiMediaService';
import { HomeMenuPage } from '../home-menu/home-menu';
import { QrBarScannerPage } from '../qr-bar-scanner/qr-bar-scanner';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  userInfo:any;

  constructor(
    private navCtrl: NavController
    , private pubService: ApiHttpPublicService
    , private auth: ApiAuthService
    , private apiStorageService: ApiStorageService
    , private apiMedia: ApiMediaService //goi trong callback
    , private events: Events    //goi trong callback
    , private platform: Platform
    , private modalCtrl: ModalController
    , private loadingCtrl: LoadingController
    , private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    //console.log('2. ngOnInit Home');
    this.checkTokenLogin();
  }


  checkTokenLogin(){

    if (this.apiStorageService.getToken()) {

      let loading = this.loadingCtrl.create({
        content: 'Đang kiểm tra từ máy chủ xác thực ...'
      });
      loading.present();

      this.auth.authorize
        (this.apiStorageService.getToken())
        .then(data => {
          
          if (data.user_info){
            this.auth.getServerPublicRSAKey()
            .then(pk => {
              let userInfo = this.auth.getUserInfo();
              if (userInfo) this.auth.injectToken(); //Tiêm token cho các phiên làm việc lấy số liệu cần xác thực
              
              this.callLoginOk(data.user_info);
  
              loading.dismiss();
            })
            .catch(err => {
              loading.dismiss();
              throw err;
            });
          }else{
            console.log('no User Info',data);
            loading.dismiss();
            throw "no data.user_info";
          }


        })
        .catch(err => {
          loading.dismiss();
          console.log('Token invalid: ', err);
          this.auth.deleteToken();
          this.ionViewDidLoad_Login();

        });
    } else {
      this.ionViewDidLoad_Login();
    }
  }


  callLoginOk(userInfo) {
    
    //console.log(userInfo);
    //truy van thong tin may chu lay userInfo khong phai user don dieu nhu nay
    //co dia chi, email, nickname,...

    this.userInfo = userInfo;

    let data = {
      title: "Đã Login"
      , buttons: [
        {color:"primary", icon: "barcode", command: "CODE-GENERATOR" , next:"CALLBACK"} 
        ,{color:"primary", icon: "qr-scanner", command: "CODE-SCANNER" , next:"CALLBACK"} 
      ]
      , items: [
        {
          type: "details",
          details: [
            {
              name: "Username(*)",
              value: userInfo.username
            },
            {
              name: "Họ và tên(*)",
              value: userInfo.data?userInfo.data.fullname:""
            },
            {
              name: "Nickname(*)",
              value: userInfo.data?userInfo.data.nickname:""
            },
            {
              name: "Địa chỉ(*)",
              value: userInfo.data?userInfo.data.address:""
            },
            {
              name: "Điện thoại(*)",
              value: userInfo.data?userInfo.data.phone:""
            },
            {
              name: "Email(*)",
              value: userInfo.data?userInfo.data.email:""
            },
            {
              name: "Địa chỉ ip",
              value: userInfo.req_ip
            },
            {
              name: "Địa chỉ nguồn",
              value: userInfo.origin
            },
            {
              name: "Thiết bị",
              value: userInfo.req_device
            },
            {
              name: "Mức xác thực",
              value: userInfo.level
            },
            {
              name: "Thời gian khởi tạo",
              value: userInfo.iat * 1000,
              pipe_date: "HH:mm:ss dd/MM/yyyy"
            },
            {
              name: "Thời gian hết hạn",
              value: userInfo.exp * 1000,
              pipe_date: "HH:mm:ss dd/MM/yyyy"
            },
            {
              name: "Giờ GMT",
              value: userInfo.local_time,
              pipe_date: "HH:mm:ss dd/MM/yyyy"
            }
          ]
        },
        { 
          type: "button"
        , options: [
          { name: "Sửa (*)", command:"EDIT" , next: "CALLBACK"}
          ,{ name: "Logout", command:"EXIT" , next: "CALLBACK"}
          ,{ name: "Quay về", command:"HOME" , next: "CALLBACK"}
        ]
      }
      ]
    }
    
    this.navCtrl.setRoot(DynamicFormWebPage
      , {
        parent: this, //bind this for call
        callback: this.callbackUserInfo,
        step: 'form-user-info',
        form: data
      });
  }


  callEditForm(){
    //truy van thong tin tu may chu boi user nay

    if (this.userInfo){
      let data = {
        title: "Sửa thông tin cá nhân"
        , items: [
           {          name: "THÔNG TIN CHO USER " + this.userInfo.username, type: "title"}
          , { key: "nickname", name: "Tên thường gọi", type: "text", input_type: "text", icon: "heart", value: this.userInfo.data?this.userInfo.data.nickname:""}
          , { key: "name", name: "Họ và tên", type: "text", input_type: "text", icon: "person", value: this.userInfo.data?this.userInfo.data.fullname:""}
          , { key: "address", name: "Địa chỉ", type: "text", input_type: "text", icon: "pin", value: this.userInfo.data?this.userInfo.data.address:""}
          , { key: "phone", name: "Điện thoại", hint: "Yêu cầu định dạng số điện thoại nhé", type: "text", input_type: "tel", icon: "call", validators: [{ pattern: "^[0-9]*$" }], value: this.userInfo.data&&this.userInfo.data.phone?this.userInfo.data.phone:this.userInfo.username}
          , { key: "email", name: "email", hint: "Yêu cầu định dạng email nhé", type: "text", input_type: "email", icon: "mail", validators: [{ pattern: "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" }], value: this.userInfo.data?this.userInfo.data.email:""}
          , { 
            type: "button"
          , options: [
            { name: "Bỏ qua", command:"CLOSE" , next: "CLOSE"}
            , { name: "Cập nhập", command:"UPDATE", url: ApiStorageService.authenticationServer+"/save-user-info", token:true, next: "CALLBACK"}
          ]
        }
        ]
      }

      this.openModal(DynamicFormWebPage
        , {
          parent: this, //bind this for call
          callback: this.callbackUserInfo,
          step: 'form-user-edit',
          form: data
        });
    }

  }

  callbackUserInfo = function (res?: { step?: string, button?: any, data?: any, error?: any }) {
    //console.log('Goi logout',res);
    return new Promise((resolve, reject) => {
      if (res.button&&res.button.command==="EXIT"){
        this.auth.deleteToken();
        this.ionViewDidLoad_Login();
        this.events.publish('user-log-out-ok');
      }

      if (res.button&&res.button.command==="EDIT"){
        this.callEditForm();
      }

      if (res.button&&res.button.command==="HOME"){
        this.navCtrl.setRoot(HomeMenuPage); //vi setRoot nen khong can dong
      }
      
      if (res.button&&res.button.command==="UPDATE"){
          this.events.publish('user-log-in-ok'); //bao hieu refresh userInfo
          this.navCtrl.setRoot(HomeMenuPage);
          resolve({next:"CLOSE"}); //vi dung modal nen phai dong lai
      }else{
        resolve();
      }

      /* if (res.button&&res.button.command==="CODE-GENERATOR"){
        this.openModal(QrBarCodePage
            , {
              parent: this,
              type: 'QR',
              visible: false,
              data: this.apiStorageService.getToken()
              });  
      } */


      if (res.button&&res.button.command==="CODE-SCANNER"){
        this.openModal(QrBarScannerPage
            , {
              parent: this,
              type: 'BAR',
              visible: false
              });  
      }

      
    });

  }.bind(this);


  


  ionViewDidLoad_Login() {
    //console.log('3. ionViewDidLoad Home');

    this.pubService.getDataForm('form-phone.json')
      .then(data => {
        if (this.platform.platforms()[0] === 'core') {

          setTimeout(() => {
            this.navCtrl.push(DynamicFormWebPage
              , {
                parent: this, //bind this for call
                callback: this.callbackFunction,
                step: 'form-phone',
                form: data
              });
          }, 1000);

        } else {

          this.navCtrl.push(DynamicFormMobilePage
            , {
              parent: this, //bind this for call
              callback: this.callbackFunction,
              step: 'form-phone',
              form: data
            });

        }
      })
      .catch(err => console.log("err ngOnInit()", err))
  }


  /**
   *  ham goi lai gui ket qua new button next
   * @param res 
   */
  callbackFunction = function (res?: { step?: string, data?: any, error?: any }) {
      
    return new Promise((resolve, reject) => {

      if (res && res.error && res.error.error) {
        //console.log('callback error:', res.error.error);
        this.presentAlert('Lỗi:<br>' + JSON.stringify(res));
        resolve();
      } else if (res && res.step === 'form-phone' && res.data) {
        // console.log('forward data:', res.data.database_out);
        if (res.data.database_out && res.data.database_out.status === 0) {
          this.presentAlert('Chú ý:<br>' + JSON.stringify(res));
        }
        //gui nhu mot button forward
        resolve({
          next: "NEXT" //mo form tiep theo
          , next_data: {
            step: 'form-key',
            data: //new form 
            {
              items: [
                { name: "Nhập mã OTP", type: "title" }
                , { key: "key", name: "Mã OTP", hint: "Nhập mã OTP gửi đến điện thoại", type: "text", input_type: "text", validators: [{ required: true, min: 6, max: 6, pattern: "^[0-9A-Z]*$" }] }
                , {
                  type: "button"
                  , options: [
                    { name: "Trở về", next: "BACK" }
                    , { name: "Xác nhận OTP", next: "CALLBACK", url: "https://c3.mobifone.vn/api/ext-auth/confirm-key", token: res.data.token }
                  ]
                }]
            }
          }
        });
      } else if (res && res.step === 'form-key' && res.data.token) {
        //lay duoc token
        //ktra token co user, image thi pass new ko thi gui ...
        //console.log('token verified:', res.data.token);
        // neu nhu gai quyet xong
        let loading = this.loadingCtrl.create({
          content: 'Đang xử kiểm tra từ máy chủ Tài nguyên....'
        });
        loading.present();

        this.apiMedia.authorizeFromResource(res.data.token)
          .then(login => {
            //console.log('data', login);
            if (login.status
              && login.user_info
              && login.token
            ) {
              this.apiStorageService.saveToken(res.data.token);
              //da login thanh cong, kiem tra token 
              this.callLoginOk(login.user_info);
              //this.checkTokenLogin();
              this.events.publish('user-log-in-ok');

            } else {
              this.presentAlert('Dữ liệu xác thực không đúng <br>' + JSON.stringify(login))
            }

            loading.dismiss();
            resolve();
          })
          .catch(err => {
            this.presentAlert('Lỗi xác thực - authorizeFromResource'+ JSON.stringify(err))
            loading.dismiss();
            resolve();
          })
      } else {
        resolve();
      }

    });
  }.bind(this);

  openModal(form,data) {
    let modal = this.modalCtrl.create(form, data);
    modal.present();
  }

  presentAlert(msg) {
    this.alertCtrl.create({
      title: 'For Administrator',
      subTitle: msg,
      buttons: ['Dismiss']
    }).present();
  }

}
