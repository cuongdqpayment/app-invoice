import { Component, } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Platform, NavParams, ViewController, NavController, LoadingController } from 'ionic-angular';
import { ApiHttpPublicService } from '../../services/apiHttpPublicServices';
import { ApiAuthService } from '../../services/apiAuthService';

@Component({
  selector: 'page-dynamic-range',
  templateUrl: 'dynamic-range.html',
})
export class DynamicRangePage {

  dynamicForm: any = {
    title: "Đánh giá chấm điểm"
    , items: [
      {          name: "Hãy Chấm điểm từng phần này", type: "title"}
      , { type: "range", key:"icon_1", name: "I. CHỌN KIỂU THANH KÉO ICON", 
          details:[
            {
            key:"diem_1",
            name: "Điều chỉnh kéo",
            icon:"contrast", 
            value: 5, 
            min: 0, 
            max: 10}
            ,
            {
            key:"diem_2",
            name: "Chấm sao",
            color:"star",
            icon:"star", 
            value: 4, 
            min: 0, 
            max: 5}
            ]
          }

      , { type: "range-star", key:"star_1", name: "II. CHẤM ĐIỂM SAO+",
          details:[
            {
            key:"diem_x",
            //name: "Chấm điểm sao",
            icon: "star",
            color:"star",
            value: 3, 
            min: 0, 
            max: 5 }
            ,
            {
            key:"diem_x1",
            name: "Mặt cười",
            icon: "happy",
            color:"star",
            value: 5, 
            min: 0, 
            max: 10}
            ]
          } 
      , { type: "range-text", key:"text_1", name: "III. CHỌN KIỂU KÉO TEXT",
          details:[
            {
            key:"diem_3",
            name: "Tường trần",
            hint: "điểm", 
            color:"secondary",
            value: 3, 
            min: 0, 
            max: 5 }
            ,
            {
            key:"diem_4",
            name: "Cửa sổ chính",
            hint: "điểm",
            value: 5, 
            min: 0, 
            max: 10}
            ]
          } 
      , { type: "toggle", key:"toggle_1", name: "IV. CHỌN HAY KHÔNG CHỌN (toggle)",
          details:[
            {
            key:"diem_3",
            name: "Tường trần",
            icon:"star",
            color:"secondary",
            value: 0}
            ,
            {
            key:"diem_4",
            name: "Cửa sổ chính",
            value: 1}
            ]
          } 
      , { type: "check", key:"check_1", name: "V. CHỌN HAY KHÔNG CHỌN (CHECK)",
          details:[
            {
            key:"diem_3",
            name: "Tường trần",
            color:"secondary",
            value: 1}
            ,
            {
            key:"diem_4",
            name: "Cửa sổ chính",
            value: 0}
            ]
          } 
      , { type: "select", key:"select_1", name:"VI. LỰA CHỌN THEO DÃY:",
      details:[
        {
        key:"diem_5",
        name: "Vị trí phòng máy nơi đặt MDF đảm bảo an ninh, an toàn chống ngập lụt"
        , value: 5
        , options: [{ name: "0 Điểm", value: 0 }
                    , { name: "1 Điểm", value: 1 }
                    , { name: "2 Điểm", value: 2 }
                    , { name: "3 Điểm", value: 3 }, { name: "4 Điểm", value: 4 }, { name: "5 Điểm", value: 5 }] }
        ,
        {
        key:"diem_6",
        name: "Vỏ trạm không bị hư hại (lún, nứt, thấm nước hoặc hư hại khác)",
         value: -1
         , options: [{ name: "N/A", value: -1 }
                    , { name: "Đạt", value: 1 }
                    , { name: "Không đạt", value: 0 }] }
        ]
      }
      , { 
          type: "button"
        , options: [
          { name: "Reset", next: "RESET" }
          , { name: "Exit", next: "EXIT" }
          , { name: "Close", next: "CLOSE" }
          , { name: "Back", next: "BACK"}
          , { name: "Callback", next: "CALLBACK"}
          , { name: "Next", next: "NEXT", token: 'true' }
        ]
      }]
};
  initValues = [];
  callback: any; // ham goi lai khai bao o trang root gui (neu co)
  step: any;     // buoc thuc hien xuat phat trang root goi (neu co)
  parent:any;    // Noi goi this

  password_type: string = 'password';
  eye: string = "eye";

  constructor(private platform: Platform
    , private authService: ApiAuthService
    , private pubService: ApiHttpPublicService
    , private viewCtrl: ViewController
    , private navCtrl: NavController
    , private loadingCtrl: LoadingController
    , private navParams: NavParams
  ) { }

  ngOnInit() {

    this.dynamicForm = this.navParams.get("form") ? this.navParams.get("form") : this.dynamicForm;

    if (this.dynamicForm.items) {
      this.dynamicForm.items.forEach((element, idx) => {
        if (element.details){
          let details = [];
          element.details.forEach((el,i)=>{
            details.push({idx:i,value:el.value})
          })
          this.initValues.push({
            idx: idx,
            details: details
          })
        }
      })
    }

    this.callback = this.navParams.get("callback");
    this.step = this.navParams.get("step");
    this.parent = this.navParams.get("parent");

  }

  resetForm() {

    if (this.dynamicForm.items) {
      this.dynamicForm.items.forEach((element, idx) => {
        if (element.details){
          element.details.forEach((el,i) => {
            if (el.value !== undefined) {
              if (this.initValues.find(x => x.idx === idx).details.find(y=>y.idx===i).value === undefined) {
                el.value = '';
              } else {
                el.value = this.initValues.find(x => x.idx == idx).details.find(y=>y.idx===i).value;
              }
            }
          });
        }
      })
    }
  }

  // Xử lý sự kiện click button theo id
  onClick(btn) {

    //console.log('command', btn.url, btn.command);
    
    let valid = false;
    let results = []; //id,value
    
    if (
      btn.next === 'CALLBACK'
      || btn.next === 'NEXT'
    ) {
      this.dynamicForm.items.some((element,idx) => {
        if (element.details){
          let keyResult = {};
          element.details.some(el=>{
            valid = true;
          if (valid && el.key && el.value)  Object.defineProperty(keyResult, el.key, { value: el.value, writable: false, enumerable: true });
          return false;
          })
          results.push({idx:idx, key: element.key, details:keyResult});
        }
        return false;        
      });
    }else{
      this.next(btn);
      return;
    }

    //console.log('ket qua length',btn.token.length);

    if (valid) {

      if (btn.url&&results.length>0) {
        if (btn.token) {
          let loading = this.loadingCtrl.create({
            content: 'Đang xử lý dữ liệu từ máy chủ ....'
          });
          loading.present();

          this.authService.postDynamicForm(btn.url, results, btn.token)
            .then(data => {
              btn.next_data = {
                step: this.step,
                data: data
              }
              this.next(btn);
              loading.dismiss();
            })
            .catch(err => {
              btn.next_data = {
                step: this.step,
                error: err
              }
              this.next(btn);
              loading.dismiss();
            });

        } else {

          let loading = this.loadingCtrl.create({
            content: 'Đang xử lý dữ liệu từ máy chủ ....'
          });
          loading.present();

          this.pubService.postDynamicForm(btn.url, results)
            .then(data => {
              //console.log('data --> next', data, btn.next);
              btn.next_data = {
                step: this.step,
                data: data
              }
              this.next(btn);
              loading.dismiss();
            })
            .catch(err => {
              //console.log('err', err);
              btn.next_data = {
                step: this.step,
                error: err
              }
              this.next(btn);
              loading.dismiss();
            });

        }

      } else {

        btn.next_data = {
          step: this.step,
          button: btn, //chuyen dieu khien nut cho ben ngoai
          data: results
        }
        this.next(btn);

      }
   } 
  }

  next(btn) {
    //console.log(btn.next_data,this.navCtrl.length());
    if (btn) {
      if (btn.next == 'EXIT') {
        this.platform.exitApp();
      } else if (btn.next == 'RESET') {
        this.resetForm();
      } else if (btn.next == 'CLOSE') {
        if (this.parent) this.viewCtrl.dismiss(btn.next_data)
      } else if (btn.next == 'BACK') {
        if (this.parent) this.navCtrl.pop()
        //if (this.navCtrl.length() > 1) this.navCtrl.pop();      //goback 1 step
      } else if (btn.next == 'CALLBACK') {
        if (this.callback) {
          this.callback(btn.next_data,this.parent)
            .then(nextStep => this.next(nextStep));
        } else {
          if (this.parent) this.navCtrl.pop()
        }
      } else if (btn.next == 'NEXT' && btn.next_data && btn.next_data.data) {
        btn.next_data.callback = this.callback; //gan lai cac function object
        btn.next_data.parent = this.parent;     //gan lai cac function object
        btn.next_data.form = btn.next_data.data; //gan du lieu tra ve tu server
        this.navCtrl.push(DynamicRangePage, btn.next_data);
      }
    }

  }

}
