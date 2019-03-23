import { Component } from '@angular/core';
import { NavController, ItemSliding, Item, Platform, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { ApiAuthService } from '../../services/apiAuthService';
import { ApiHttpPublicService } from '../../services/apiHttpPublicServices';

@Component({
  selector: 'page-dynamic-list',
  templateUrl: 'dynamic-list.html'
})
export class DynamicListPage {

  dynamicList: any; 
  dynamicListOrigin: any = {
    title: "Mạng xã hội"
    , search_bar: {hint: "Tìm cái gì đó"} 
    , buttons: [
        {color:"primary", icon:"add", next:"ADD"}
        , {color:"primary", icon:"contacts", next:"FRIENDS"}
        , {color:"primary", icon:"notifications", next:"NOTIFY"
          , alerts:[
              "cuong.dq"
              ]
          }
        , {color:"royal", icon:"cog", next:"SETTINGS"}
      ]
    , items: [
        {
            //icon:"contact",
            image: "assets/imgs/img_forest.jpg"
            ,h1:"H1 Tieu de"
            ,h2:"H2 Chuong muc"
            ,h3:"H3 Muc luc"
            ,p:"Sau khi đánh cồng khai trương phiên giao dịch đầu xuân Kỷ Hợi 2019 tại Sở Giao dịch chứng khoán Hà Nội vào sáng 12-2, Thủ tướng Chính phủ Nguyễn Xuân Phúc khẳng định tầm quan trọng của thị trường chứng khoán Việt Nam."
            ,note:"13/02/2019"
            ,options:[
                { name: "Xóa", color:"danger", icon:"trash", next:"EXIT"}
              , { name: "Chỉnh sửa", color:"primary", icon:"create", next: "NEXT"}
              , { name: "Xem chi tiết", color:"secondary", icon:"list", next: "CALLBACK"}
            ]
        }
        ,{
            icon:"contact"
            //image: "assets/imgs/img_forest.jpg"
            ,h1:"H1 Tieu de 2"
            ,h2:"H2 Chuong muc 2"
            ,h3:"H3 Muc luc 2"
            ,p:"Trong những ngày đánh bắt đầu năm, 3 ngư dân Quảng Trị đã thu hoạch được mẻ cá bè gần 140 tấn; trong đó một ngư dân trúng mẻ cá siêu khủng nặng hơn 100 tấn."
            ,note:"14/02/2019"
            ,options:[
                { name: "Xóa", color:"danger", icon:"trash", next:"EXIT"}
              , { name: "Chỉnh sửa", color:"primary", icon:"create", next: "NEXT"}
              , { name: "Xem chi tiết", color:"secondary", icon:"list", next: "CALLBACK"}
            ]
        }
    ]
  };
  
  callback: any; 
  step: any;  
  parent:any;
  offset:number; //dich chuyen option command
  
  isSearch: boolean = false;
  searchString: string = '';
  shouldShowCancel: boolean = true;

  isMobile: boolean = false;

  constructor(  private platform: Platform
              , private authService: ApiAuthService
              , private pubService: ApiHttpPublicService
              , private viewCtrl: ViewController
              , private navCtrl: NavController
              , private loadingCtrl: LoadingController
              , private navParams: NavParams
             ) {}

  ngOnInit(){
    this.dynamicListOrigin = this.navParams.get("list") ? this.navParams.get("list") : this.dynamicListOrigin;
    this.refresh();
    
    this.offset = this.navParams.get("offset")?this.navParams.get("offset"):250;
    this.callback = this.navParams.get("callback");
    this.step = this.navParams.get("step");
    
    this.parent = this.navParams.get("parent");

    let call_waiting_data = this.navParams.get("call_waiting_data");
    
    if (call_waiting_data){
      call_waiting_data(this.parent)
      .then(list=>{
        this.refresh(list);
      })
    }
  }

  refresh(newList?:any){
    if (newList) this.dynamicListOrigin = newList;
    this.isMobile = (this.platform.platforms()[0]==='mobile');
    this.dynamicList = this.dynamicListOrigin;
  }

// Su dung slide Pages
  //--------------------------
  /**
   * Thay đổi kiểu bấm nút mở lệnh trên item sliding
   * @param slidingItem 
   * @param item 
   */
  openSwipeOptions(slidingItem: ItemSliding, item: Item, it:any ){
    let _offset =  "translate3d(-"+this.offset+"px, 0px, 0px)"
    it.isSlidingItemOpen=true;
    slidingItem.setElementClass("active-sliding", true);
    slidingItem.setElementClass("active-slide", true);
    slidingItem.setElementClass("active-options-right", true);
    item.setElementStyle("transform",_offset); 
  }

  /**
   * Thay đổi cách bấm nút đóng lệnh bằng nút trên item sliding
   * @param slidingItem 
   */
  closeSwipeOptions(slidingItem: ItemSliding, it:any){
    slidingItem.close();
    slidingItem.setElementClass("active-sliding", false);
    slidingItem.setElementClass("active-slide", false);
    slidingItem.setElementClass("active-options-right", false);
    it.isSlidingItemOpen=false;
  }
  //----------- end of sliding


  //Su dung search
  //---------------------
  goSearch(){
    this.isSearch = true;
  }

  searchEnter(){
    this.isSearch = false;
  }

  onInput(e){
    console.log(this.searchString);
  }

  onClick(btn){
    //console.log(btn);
    this.processCommand(btn); 
  }

  onClickDetails(item: ItemSliding, btn: any, it: any){
    this.closeSwipeOptions(item, it);
    btn.item = it;
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
        if (btn.next === 'PDF') httpOptions = {'responseType'  : 'blob' as 'json'}
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
      } else {
        this.next(btn);
      }

    } else {
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
      } else if (btn.next == 'ADD' || btn.next == 'EDIT' || btn.next == 'PDF' || btn.next == 'LIST' ) {
        if (this.callback) {
          this.callback(btn.next_data, this.parent)
            .then(nextStep => this.next(nextStep));
        }
      } else if (btn.next == 'NEXT' && btn.next_data && btn.next_data.data) {
        btn.next_data.callback = this.callback; //gan lai cac function object
        btn.next_data.parent = this.parent;     //gan lai cac function object
        btn.next_data.list = btn.next_data.data; //gan du lieu tra ve tu server
        this.navCtrl.push(DynamicListPage, btn.next_data);
      }
    }

  }

}
