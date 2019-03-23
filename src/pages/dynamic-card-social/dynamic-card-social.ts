import { Component } from '@angular/core';
import { NavController, Platform, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { ApiAuthService } from '../../services/apiAuthService';
import { ApiHttpPublicService } from '../../services/apiHttpPublicServices';

@Component({
  selector: 'page-dynamic-card-social',
  templateUrl: 'dynamic-card-social.html'
})
export class DynamicCardSocialPage {

  dynamicCards: any; 
  dynamicCardsOrigin: any = {
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
      //1.
      {   short_detail:{
              avatar: "assets/imgs/ca_nau.jpg"
              ,h1:"Cuong.dq"
              ,p:"Cần thiết là nội dung chi tiết đây, có thể viết tóm lượt nhiều thông tin cũng được"
              ,note:"1h ago"
              ,action: {color:"primary", icon: "more", next:"MORE" }
          }
          ,title:"Chi tiết các ảnh hiển thị"
          ,note:"Bài viết chi tiết kết thúc"
          ,medias: [
              {image:"assets/imgs/img_forest.jpg"
                  ,title:"Miền quê yêu dấu"
                  ,h1: "Chốn yên bình"
                  ,p: "Là nơi bình yên nhất. Bạn có thể dạo bước trên con đường rợp bóng mát thanh bình đến lạ"}
              ,{image:"assets/imgs/anh_vua.png"
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
                  ,p: "Trái cây vựa, miền quê nhiều cá lắm đó"}
          ]
          ,content:{
              title:"Miền quê yêu dấu"
              ,paragraphs:[
                  {
                      h2: "Chốn yên bình"
                      ,p: "Là nơi bình yên nhất. Bạn có thể dạo bước trên con đường rợp bóng mát thanh bình đến lạ"
                      ,medias: [
                          {image:"assets/imgs/img_forest.jpg",title:"Cầu Thê Húc xưa",subtitle:"Đoàn Quốc Cường"}
                          ,{image:"assets/imgs/anh_vua.png",title:"Cao tốc 34 nghìn tỷ mới khai trương đã hỏng",subtitle:"ảnh Mượn trên mạng "}
                      ]
                  }
                  ,
                  {
                      h2: "Chốn bóc mẽ"
                      ,p: "Đây là nơi bóc mẽ thông tin trên mạng. Một sự kiện mà mọi người không thể biết được bằng những phương tiện truyền thông truyền thống"
                      ,medias: [
                          {image:"assets/imgs/anh_vua.png",title:"Cao tốc 34 nghìn tỷ mới khai trương đã hỏng",subtitle:"ảnh Mượn trên mạng "}
                      ]
                  }
              ]
              ,note:"Đoàn Quốc Cường 2019"
          }
          ,results:{ 
              likes:{
                  like:["Cuong.dq","abc","xyz"]
                  ,love:["love"]
                  ,unlike:["dog"]
                  ,sad:["cat"]
                  ,angery:["tiger"]
              }
              ,comments:[
                  {name:"cuong.dq"
                  ,comment:"day la cai gi vay"
                  ,time:new Date().getTime()
                  }
                  ,
                  {name:"cu.dq"
                  ,comment:"la cai nay do nhe"
                  ,time:new Date().getTime()
                  }
              ]
              ,shares:[
                  {name:"cuong.dq"
                  ,comment:"day la cai gi vay"
                  ,time:new Date().getTime()
                  }
                  ,
                  {name:"cu.dq"
                  ,comment:"la cai nay do nhe"
                  ,time:new Date().getTime()
                  }
              ]
              
          }
          ,actions:{
              like: {name:"LIKE", color:"primary", icon: "thumbs-up", next:"LIKE"}
              ,comment: {name:"COMMENT", color:"primary", icon: "chatbubbles", next:"COMMENT"}
              ,share: {name:"SHARE", color:"primary", icon: "share-alt", next:"SHARE"}
          }
      }
      //2.
      , { short_details:{
          }
          ,medias: [
              {image:"assets/imgs/img_forest.jpg",title:"1 Ảnh",subtitle:"Tác giả Đoàn Quốc Cường"}
          ]
          ,results:{ 
              likes:{
                  like:["Cuong.dq","abc","xyz"]
                  ,love:["love"]
              }
              ,shares:[
                  {name:"cu.dq"
                  ,comment:"la cai nay do nhe"
                  ,time:new Date().getTime()
                  }
              ]
              
          }
          ,actions:{
              like: {name:"Thích", color:"primary", icon: "thumbs-up", next:"LIKE"}
              ,comment: {name:"Trò chuyện", color:"primary", icon: "chatbubbles", next:"COMMENT"}
              ,share: {name:"Chia sẻ", color:"primary", icon: "share-alt", next:"SHARE"}
          }
      }
      //3.
      , { short_details:{

          }
          ,medias: [
              {image:"assets/imgs/ca_nau.jpg",title:"Ảnh 1",subtitle:"Tác giả Đoàn Quốc Cường"}
              ,{image:"assets/imgs/img_forest.jpg",title:"Ảnh 2",subtitle:"Tác giả Đoàn Quốc Cường"}
          ]
          ,results:{ 
              likes:{
                  sad:["cat"]
              }
              ,comments:[
                  {name:"cu.dq"
                  ,comment:"la cai nay do nhe"
                  ,time:new Date().getTime()
                  }
              ]
          }
          ,actions:{
              like: {name:"Thích", color:"primary", icon: "thumbs-up", next:"LIKE"}
              ,comment: {name:"Trò chuyện", color:"primary", icon: "chatbubbles", next:"COMMENT"}
              ,share: {name:"Chia sẻ", color:"primary", icon: "share-alt", next:"SHARE"}
          }
      }
      //4.
      , { short_details:{

          }
          ,medias: [
              {image:"assets/imgs/img_forest.jpg",title:"3 Ảnh",subtitle:"Tác giả Đoàn Quốc Cường"}
              ,{image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="}
              ,{image:"data:image/gif;base64,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"}
          ]
          ,results:{ 
              likes:{
                  like:["Cuong.dq","abc","xyz"]
              }
          
          }
          ,actions:{
              like: {name:"Thích", color:"primary", icon: "thumbs-up", next:"LIKE"}
              ,comment: {name:"Trò chuyện", color:"primary", icon: "chatbubbles", next:"COMMENT"}
              ,share: {name:"Chia sẻ", color:"primary", icon: "share-alt", next:"SHARE"}
          }
      }
      //5.
      , { short_details:{

          }
          ,medias: [
              {image:"assets/imgs/img_forest.jpg",title:"4 Ảnh"}
              ,{image:"assets/imgs/ca_the.jpg"}
              ,{image:"assets/imgs/anh_vua.png"}
              ,{image:"assets/imgs/ca_nau.jpg"}
          ]
          ,actions:{
              like: {name:"Thích", color:"primary", icon: "thumbs-up", next:"LIKE"}
              ,comment: {name:"Trò chuyện", color:"primary", icon: "chatbubbles", next:"COMMENT"}
              ,share: {name:"Chia sẻ", color:"primary", icon: "share-alt", next:"SHARE"}
          }
      }
      
      ]
};

  callback: any; 
  step: any;  
  parent:any;
  
  isSearch: boolean = false;
  searchString: string = '';
  shouldShowCancel: boolean = false;

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

    this.dynamicCardsOrigin = this.navParams.get("list") ? this.navParams.get("list") : this.dynamicCardsOrigin;
    this.refresh();
    
    this.callback = this.navParams.get("callback");
    this.step = this.navParams.get("step");
    this.parent = this.navParams.get("parent");
    let call_waiting_data = this.navParams.get("call_waiting_data");
    
    if (call_waiting_data){
      call_waiting_data()
      .then(list=>{
        this.refresh(list);
      })
    }
  }

  refresh(newList?:any){
    if (newList) this.dynamicCardsOrigin = newList;
    this.isMobile = (this.platform.platforms()[0]==='mobile');
    this.dynamicCards = this.dynamicCardsOrigin;

    console.log('cards', this.dynamicCardsOrigin);
  }

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


  onClickMedia(idx,item){

    console.log(idx,item);

    let viewItems = [];
    let itemDetail:any = {
                          short_detail: item.short_detail
                          , results: item.results
                          , actions: item.actions
                          , content:{title: item.title, note: item.note}

                        };

    let paragraphs = [];

    item.medias.forEach(el=>{
      paragraphs.push({
                  h1: el.h1
                  ,h2: el.h2
                  ,p: el.p
                  ,medias: [el]
      })
    });

    itemDetail.content.paragraphs = paragraphs;

    viewItems.push(itemDetail);

    let btn = {next:"NEXT"
              ,next_data:{
                  data:{
                        title: "Tin chi tiết"
                        , buttons: [
                            {color:"primary", icon:"close", next:"CLOSE"}
                          ]
                        , items: viewItems
                        }
              }
        }

    this.processCommand(btn); 
  }

  onClickHeader(btn){
    console.log(btn);
    this.processCommand(btn); 
  }
  
  onClickShortDetails(btn,item){
    console.log(btn, item);
    this.processCommand(btn); 
  }

  onClickActions(btn,item){
    console.log(btn, item);
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
      } else {
        this.next(btn);
      }

    } else {
      console.log('do nothing',btn);
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
        this.navCtrl.push(DynamicCardSocialPage, btn.next_data);
      }
    }
  }

}
