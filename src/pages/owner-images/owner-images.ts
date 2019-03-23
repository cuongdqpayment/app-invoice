import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, NavParams, ViewController, LoadingController, Slides, AlertController, Events } from 'ionic-angular';
import { ApiAuthService } from '../../services/apiAuthService';
import { ApiHttpPublicService } from '../../services/apiHttpPublicServices';
import { ApiImageService } from '../../services/apiImageService';
import { ApiStorageService } from '../../services/apiStorageService';

@Component({
  selector: 'page-owner-images',
  templateUrl: 'owner-images.html'
})
export class OwnerImagesPage {
  @ViewChild(Slides) slides: Slides;
  slideIndex = 0;

  dynamicMedias: any; 
  dynamicMediasOrigin: any = {
    title:"Quản trị ảnh cá nhân"
    ,buttons: [
        {color:"dark", icon:"close",  next:"CLOSE"}
      ]
    ,medias: [
    ]
    ,actions:{
        open: {key: "down", link_key:"up", name:"Chi tiết", color:"primary", icon:"arrow-dropdown",  next:"DOWN"}
        , close: {key: "up", link_key:"down", name:"Thu gọn", color:"primary", icon:"arrow-dropup", next:"UP"}
        , buttons: [
             {name:"Lưu", icon: "share-alt", color:"primary", url:ApiStorageService.mediaServer + "/db/upload-files", method: "FORM-DATA", token:true , next:"SAVE"}
        ]
    }
};

  func:string;
  callback: any;
  step: any;
  parent:any;
  
  isSearch: boolean = false;
  searchString: string = '';
  shouldShowCancel: boolean = true;

  isMobile: boolean = false;

  isHide:boolean = true;
  showButton:any =  {key: "down", link_key:"up", name:"Mở rộng", color:"primary", icon:"arrow-dropdown-circle",  next:"DOWN"}
  hideButton:any =  {key: "up", link_key:"down", name:"Thu gọn", color:"primary", icon:"arrow-dropup-circle", next:"UP"}
  myShow:any;

  isHideNote = false;

  isContent:boolean = false;
  content:string;

  myImages:any = [];

  constructor(  private platform: Platform
              , private authService: ApiAuthService
              , private apiImageService: ApiImageService
              , private pubService: ApiHttpPublicService
              , private viewCtrl: ViewController
              , private navCtrl: NavController
              , private loadingCtrl: LoadingController
              , private alertCtrl: AlertController
              , private events: Events
              , private navParams: NavParams
             ) {}

  ngOnInit(){

    this.dynamicMediasOrigin = this.navParams.get("list") ? this.navParams.get("list") : this.dynamicMediasOrigin;
    this.refresh();
    this.myShow = this.showButton;
    
    this.func = this.navParams.get("func");

    //console.log(this.func,this.navParams);
    if (this.func) this.getMyImages();

    this.callback = this.navParams.get("callback");
    this.step = this.navParams.get("step");
    this.parent = this.navParams.get("parent");
    let call_waiting_data = this.navParams.get("call_waiting_data");
    
    if (call_waiting_data){
      call_waiting_data()
      .then(list=>{
        this.refresh(list);
        this.myShow = this.showButton;
      })
    }

  }

  refresh(newList?:any){
    if (newList) this.dynamicMediasOrigin = newList;
    this.isMobile = (this.platform.platforms()[0]==='mobile');
    this.dynamicMedias = this.dynamicMediasOrigin;
    this.showButton = (this.dynamicMedias.actions&&this.dynamicMedias.actions.open)?this.dynamicMedias.actions.open:this.showButton;
    this.hideButton = (this.dynamicMedias.actions&&this.dynamicMedias.actions.close)?this.dynamicMedias.actions.close:this.hideButton;
    
    if (this.func) this.getMyImages();
    this.content = "";

  }


  getMyImages(){
    //console.log(this.func);

    this.authService.getDynamicUrl(ApiStorageService.mediaServer + "/db/list-files?limit=12&offset=0", true)
    .then(data=>{
      this.myImages = data;
      this.myImages.forEach(el=>{
        el.image= encodeURI(ApiStorageService.mediaServer + "/db/get-file/" + el.url);
      })

    })
    .catch(err=>{})
  }


  onClickSlideChange(direction){
    if (direction==='LEFT'){
      if (this.slideIndex>0) this.goToSlide(this.slideIndex-1);
    }
    if (direction==='RIGHT'){
      if (this.slideIndex<3) this.goToSlide(this.slideIndex+1);
    }
  }

  goToSlide(i) {
    this.slides.slideTo(i, 300);
  }

  slideChanged() {
    this.slideIndex = this.slides.getActiveIndex();
  }


  onClickSelected(item){
    const confirm = this.alertCtrl.create({
      title: 'CHỌN ẢNH ĐẠI DIỆN',
      message: 'Có phải bạn muốn chọn ảnh này làm ảnh đại diện?<br><img width="200" height="200" src='+item.image+'></div>',
      buttons: [
        {
          text: 'Bỏ qua',
          handler: () => {}
        },
        {
          text: 'Đồng ý',
          handler: () => {
            //gui 
            this.authService.postDynamicForm(ApiStorageService.mediaServer+"/db/set-function"
            ,{
              id:item.id
              ,func: this.func
            },true)
            .then(data=>{
              if (data&&data.status===1){
                //this.events.publish('user-change-image-ok');
                if (this.callback) {
                  this.callback() //goi thay doi anh dai dien
                    .then(nextStep => this.next(nextStep)); //dong lai
                }
              }
            })
            .catch(err=>{
              console.log('error',err);
            })
            ;
          }
        }
      ]
    });
    confirm.present();
  }

  fileChange(event,action) {

    if (event.target && event.target.files) {

      let size = (action&&action.size!==undefined&&action.size!==null)?action.size:480; //default site anh

      const files: any /* { [key: string]: File } */ = event.target.files;
      const processImages = new Promise((resolve,reject)=>{
        let fileProcessed = [];
        let countFile = Object.keys(files).length, countResize = 0;
       
        if (files.length===0) resolve(); 

        for (let key in files) { //index, length, item
          if (!isNaN(parseInt(key))) {
            this.apiImageService.resizeImage(files[key].name,files[key],size)
            .then(data=>{
              fileProcessed.push(data);
              if (++countResize>=countFile){
                resolve(fileProcessed);
              }
            })
            .catch(err=>{
              reject(err);
            })
          }
        }
        
      });

      let loading = this.loadingCtrl.create({
        content: 'Đang xử lý các ảnh theo định dạng lưu trữ tiết kiệm ....'
      });
      loading.present();

      processImages.then(data=>{
        if (data){
          this.dynamicMediasOrigin.medias = data;
          this.refresh();
        }
        loading.dismiss();
      })
      .catch(err=>{

        loading.dismiss();
      });

      setTimeout(() => {
        //1 phut ma ko x ly duoc thi thoat ra cho cai khac thuc hien
        loading.dismiss();
      }, 60000);

    }
  }

  clickAddMessage(){
    this.isContent = !this.isContent;
  }

  onClickShowNote(){
    this.isHideNote = !this.isHideNote;
  }

  onClickShowHide(btn){
    this.isHide = !this.isHide;
    this.myShow = this.myShow==this.hideButton?this.showButton:this.hideButton;
  }

  onClickHeader(btn){
    console.log(btn);
    this.processCommand(btn); 

  }

  onClickMedia(idx,item){

    console.log(idx,item);

    let btn = {}

    this.processCommand(btn); 
  }


  onClickAction(btn){
    //console.log(btn);
    this.processCommand(btn);
  }

  processCommand(btn){

    if (btn.url){
      if (btn.method==='GET'){
        let loading = this.loadingCtrl.create({
          content: 'Đang xử lý dữ liệu từ máy chủ ....'
        });
        loading.present();

        let httpOptions;
        if (btn.next === 'FILE') httpOptions = {'responseType'  : 'blob' as 'json'}
        this.pubService.getDynamicForm(btn.url,httpOptions)
        .then(data=>{
          //console.log(data);
          loading.dismiss();

          btn.next_data = {
            step: this.step,
            data: data,
            next: btn.next,
            item: btn.item
          }
          this.next(btn);

        })
        .catch(err=>{
          console.log('err getDynamicForm',err);
          loading.dismiss();
        })
      }else if (btn.method==='FORM-DATA' 
                && this.dynamicMedias 
                && this.dynamicMedias.medias 
                && this.dynamicMedias.medias.length > 0){

        let loading = this.loadingCtrl.create({
          content: 'Đang xử lý dữ liệu từ máy chủ ....'
        });
        loading.present();

        let form_data: FormData = new FormData();
        form_data.append("count_image", this.dynamicMedias.medias.length);
        form_data.append("content", this.content);  //nhap lieu tu text-area
        //group_id, content, title
        
        this.dynamicMedias.medias.forEach((el,idx) => {
          if (el.file && el.filename) {
            let key = "image"+idx;
            form_data.append(key, el.file, el.filename);
            form_data.append("origin_date_"+key, el.last_modified);
          }
        });

        if (btn.token) {
          this.authService.postDynamicFormData(btn.url, form_data)
          .then(data=>{
            console.log('receive form data:',data);
            loading.dismiss();
            this.next(btn);
  
          })
          .catch(err=>{
            console.log('err postDynamicFormData',err);
    
            this.alertCtrl.create({
              title: 'LỖI UPLOAD FILES',
              message: 'Có thể giới hạn từ máy chủ cho phép load số lượng ảnh đồng thời, vui lòng hạn chế số lượng ảnh hoặc liên hệ Quản trị máy chủ lưu ảnh!',
              buttons: [
                {
                  text: 'Bỏ qua',
                  handler: () => {}
                },
              ]
            }).present();

            loading.dismiss();
          })
        }else{
          this.pubService.postDynamicFormData(btn.url, form_data)
          .then(data=>{
            console.log('receive form data:',data);
            loading.dismiss();
  
            this.next(btn);
  
          })
          .catch(err=>{
            console.log('err postDynamicFormData',err);
            loading.dismiss();
          })
        }

      }else if (btn.method==='POST' 
                && this.dynamicMedias 
                && this.dynamicMedias.medias 
                && this.dynamicMedias.medias.length > 0){

        let loading = this.loadingCtrl.create({
          content: 'Đang xử lý dữ liệu từ máy chủ ....'
        });
        loading.present();

        let json_data = {medias: []}
        this.dynamicMedias.medias.forEach(el => {
          json_data.medias.push({image:el.image})
        });


        if (btn.token) {
          this.authService.postDynamicForm(btn.url, json_data)
          .then(data=>{
            console.log('receive:',data);
            loading.dismiss();
  
            this.next(btn);
  
          })
          .catch(err=>{
            console.log('err postDynamicForm',err);
            loading.dismiss();
          })
        }else{
          this.pubService.postDynamicForm(btn.url, json_data)
          .then(data=>{
            console.log('receive:',data);
            loading.dismiss();
  
            this.next(btn);
  
          })
          .catch(err=>{
            console.log('err postDynamicForm',err);
            loading.dismiss();
          })
        }

      } else {
        this.next(btn);
      }

    } else {
      //console.log('do nothing',btn);
      this.next(btn);
    }
  }

  next(btn) {
    if (btn) {

      if (btn.next==="SAVE"){
        this.dynamicMedias.medias = []
      }

      if (btn.next == 'EXIT') {
        this.platform.exitApp();
      } else if (btn.next == 'REFRESH') {
        this.refresh(btn.next_data);
      } else if (btn.next == 'CLOSE') {
        if (this.parent) this.viewCtrl.dismiss(btn.next_data);
      } else if (btn.next == 'BACK') {
        if (this.parent) this.navCtrl.pop();
      } else if (
        btn.next == 'ADD' 
      || btn.next == 'SETTINGS' 
      || btn.next == 'FRIENDS' 
      || btn.next == 'NOTIFY' 
      || btn.next == 'LIKE' 
      || btn.next == 'COMMENT' 
      || btn.next == 'SHARE' 
      || btn.next == 'MORE' ) {
        if (this.callback) {
          this.callback(btn.next_data)
            .then(nextStep => this.next(nextStep));
        }
      } else if (btn.next == 'NEXT' && btn.next_data && btn.next_data.data) {
        btn.next_data.callback = this.callback; //gan lai cac function object
        btn.next_data.parent = this.parent;     //gan lai cac function object
        btn.next_data.list = btn.next_data.data; //gan du lieu tra ve tu server
        this.navCtrl.push(OwnerImagesPage, btn.next_data);
      }
    }
  }

}
