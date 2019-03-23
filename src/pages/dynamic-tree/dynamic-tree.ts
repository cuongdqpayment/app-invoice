import { Component, } from '@angular/core';
import { Platform, NavParams, ViewController, NavController, LoadingController } from 'ionic-angular';
import { ApiHttpPublicService } from '../../services/apiHttpPublicServices';
import { ApiAuthService } from '../../services/apiAuthService';

@Component({
  selector: 'page-dynamic-tree',
  templateUrl: 'dynamic-tree.html',
})
export class DynamicTreePage {

  dynamicTree: any = {
                        title: "Cây menu"
                        , buttons: [
                          {color:"primary", icon:"arrow-dropup-circle", next:"COLLAPSE"}
                          ,{color:"primary", icon:"arrow-dropdown-circle", next:"EXPAND"}
                        ]
                        , items: [
                          {
                            name: "1. Nhánh 1 Chủ tịch Triều Tiên rời Hà Nội, lên đường về nước",
                            details: true,
                            subs: [
                              {
                                name: "1.1 Chi 1 của nhánh 1",
                                details: {avatar:"https://icdn.dantri.com.vn/thumb_w/640/2019/03/02/531510014249880849060024764118135794040832-n-1551502898256.jpg"},
                                subs: [{
                                  name: "1.1.1 Nhóm 1 của chi 1 nhánh 1",
                                  details: true, //khai báo ở cả nhánh và lá, cho phép click more xem nhiều thông tin hơn của nhánh hoặc lá cây
                                }]
                              },
                              {
                                name: "1.2 chi 2 của nhánh 1",
                                click: true, //khai ở lá cây, click trên item, gọi hàm như click more
                              }
                            ]
                          }
                          ,
                          {
                            name: "2. Nhánh 2",
                            details: true,
                            subs: [
                              {
                                name: "2.1 Chi 1 của nhánh 2",
                                details: true,
                                subs: [{
                                  name: "2.1.1 Nhóm 1 chi 1 nhánh 2",
                                  details: true,
                                  icon: "leaf"
                                }]
                              },
                              {
                                name: "2.2 Chi 2 Sáng nay (2/3), sau khi vào lăng viếng Chủ tịch Hồ Chí Minh, Chủ tịch Triều Tiên Kim Jong-un kết thúc chuyến thăm hữu nghị chính thức Việt Nam. Trên đường di chuyển rời Hà Nội, ông Kim Jong-un đã hạ kính xe vẫy tay chào người dân. Ông Kim tới ga Đồng Đăng (Lạng Sơn) để trở về nước bằng tàu hỏa. ",
                                details: true,
                                icon: "plane"
                              }
                              ,
                              {
                                name: "2.3 Chi 3 của nhánh 2",
                                details: true,
                                subs: [{
                                  name: "2.3.1 Nhóm 1 chi 3 nhánh 2",
                                  icon: "leaf"
                                }]
                              },
                              {
                                name: "2.4 Chi 4 của nhánh 2",
                                details: true,
                                subs: [{
                                  name: "2.4.1 Nhóm 4 chi 1 nhánh 2",
                                  details: true,
                                  icon: "leaf"
                                }]
                              }
                            ]
                          }
                        ]
                    };

  callback: any; // ham goi lai khai bao o trang root gui (neu co)
  step: any;     // buoc thuc hien xuat phat trang root goi (neu co)
  parent:any;    // Noi goi this

  callbackTreeView:any;

  constructor(private platform: Platform
    , private viewCtrl: ViewController
    , private navCtrl: NavController
    , private navParams: NavParams
  ) { }

  ngOnInit() {

    this.dynamicTree = this.navParams.get("tree") ? this.navParams.get("tree") : this.dynamicTree;

    this.callback = this.navParams.get("callback");
    this.step = this.navParams.get("step");
    this.parent = this.navParams.get("parent");

    this.callbackTreeView = this.callbackTree;
  }

  resetForm() {
    
  }


  callbackTree = function(item, idx, parent, isMore:boolean){
    if (item.visible){
      parent.forEach((el,i)=>{
        if (idx!==i) this.expandCollapseAll(el,false)
      })
    }

    if (isMore){
      console.log(item);
    }

  }.bind(this)

  onClickHeader(btn){
    if (btn.next==="EXPAND")this.dynamicTree.items.forEach(el=>this.expandCollapseAll(el,true))
    if (btn.next==="COLLAPSE")this.dynamicTree.items.forEach(el=>this.expandCollapseAll(el,false))
  }

  expandCollapseAll(el,isExpand:boolean){
    if (el.subs){
      el.visible=isExpand;
      el.subs.forEach(el1=>{
        this.expandCollapseAll(el1,isExpand)
      })
    }
  }

  // Xử lý sự kiện click button theo id
  onClick(btn) {
      this.next(btn);
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
        btn.next_data.tree = btn.next_data.data; //gan du lieu tra ve tu server
        this.navCtrl.push(DynamicTreePage, btn.next_data);
      }
    }

  }

}
