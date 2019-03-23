import { Component } from '@angular/core';
import { NavController, Platform, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { ApiAuthService } from '../../services/apiAuthService';
import { ApiHttpPublicService } from '../../services/apiHttpPublicServices';
import { ApiImageService } from '../../services/apiImageService';

@Component({
  selector: 'page-dynamic-medias',
  templateUrl: 'dynamic-medias.html'
})
export class DynamicMediasPage {

  dynamicMedias: any; 
  dynamicMediasOrigin: any = {
    title:"Đa phương tiện"
    /* ,buttons: [
        {color:"primary", icon:"arrow-dropdown-circle",  next:"DOWN"}
        , {color:"primary", icon:"arrow-dropup-circle", next:"UP"}
      ] */
    ,medias: [
        {image:"assets/imgs/img_forest.jpg"
            ,title:"Miền quê yêu dấu"
            ,h1: "Chốn yên bình"
            ,p: "Là nơi bình yên nhất. Bạn có thể dạo bước trên con đường rợp bóng mát thanh bình đến lạ"}
        /* ,{image:"assets/imgs/anh_vua.png"
            ,h1: "Nội dung bài viết vể cao tốc"
            ,p: "Một bài viết về cao tốc đây nhé"}
        ,{image:"assets/imgs/ca_nau.jpg"
            ,h2: "Cá Nâu ở Quê Mỹ lợi"
            ,p: "Cá ngày mồng 3 tết ở quê"}
        ,{image:"assets/imgs/ca_the.jpg"
            ,h1: "Cá Thệ ở Quê Mỹ lợi"
            ,p: "Cá ngày mồng 3 tết ở quê, Cá thệ kho dưa rất tuyệt vời"}
        ,{image:"assets/imgs/img_forest.jpg"}
        ,{image:"assets/imgs/anh_nho.png"
            ,h1: "Mùa trái cây chín đỏ"
            ,p: "Trái cây vựa, miền quê nhiều cá lắm đó"} */
    ]
    ,actions:{
        file: {name:"Open file", size: 480, color:"primary", icon: "image", next:"FILE"}
        // ,
        //files: {name:"Open files", color:"primary", icon: "images", next:"FILES"}
        , open: {key: "down", link_key:"up", name:"Expand", color:"primary", icon:"arrow-dropdown",  next:"DOWN"}
        , close: {key: "up", link_key:"down", name:"Collapse", color:"primary", icon:"arrow-dropup", next:"UP"}
        , buttons: [
             {name:"Save", icon: "share-alt", color:"primary", url:"https://c3.mobifone.vn/api/ext-auth/save-user-avatar", method: "FORM-DATA", token:true , next:"SAVE"}
        ]
    }
};

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

  constructor(  private platform: Platform
              , private authService: ApiAuthService
              , private apiImageService: ApiImageService
              , private pubService: ApiHttpPublicService
              , private viewCtrl: ViewController
              , private navCtrl: NavController
              , private loadingCtrl: LoadingController
              , private navParams: NavParams
             ) {}

  ngOnInit(){

    this.dynamicMediasOrigin = this.navParams.get("list") ? this.navParams.get("list") : this.dynamicMediasOrigin;
    this.refresh();
    this.myShow = this.showButton;
    
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
    console.log(btn);
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
        
        this.dynamicMedias.medias.forEach((el,idx) => {
          if (el.file && el.filename) form_data.append("image"+idx, el.file, el.filename);
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
      if (btn.next == 'EXIT') {
        this.platform.exitApp();
      } else if (btn.next == 'REFRESH') {
        this.refresh(btn.next_data);
      } else if (btn.next == 'CLOSE') {
        try { this.viewCtrl.dismiss(btn.next_data) } catch (e) { }
      } else if (btn.next == 'BACK') {
        try { this.navCtrl.pop() } catch (e) { }
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
        this.navCtrl.push(DynamicMediasPage, btn.next_data);
      }
    }
  }

}
