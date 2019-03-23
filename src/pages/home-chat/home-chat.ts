import { Component, ViewChild } from '@angular/core';
import { NavController, Events, Slides, NavParams, ModalController, ItemSliding, Item } from 'ionic-angular';
import { Socket } from 'ng-socket-io';

import { ApiAuthService } from '../../services/apiAuthService';
import { ApiStorageService } from '../../services/apiStorageService';
import { Observable } from 'rxjs/Observable';
import { DynamicRangePage } from '../dynamic-range/dynamic-range';
import { ChattingPage } from '../chatting/chatting';

@Component({
  selector: 'page-home-chat',
  templateUrl: 'home-chat.html'
})

export class HomeChatPage {
  @ViewChild(Slides) slides: Slides;
  slideIndex = 0;
  token:any;
  userInfo:any;

  socket: Socket;
  //configSocketIo: SocketIoConfig;

  rooms = [];
  users = [];
  last_time:number = new Date().getTime();

  chatManager: any;

  isSearch: boolean = false;
  searchString: string = '';
  shouldShowCancel: boolean = false;

  myNavCtrlLength:number;
  isMobile:boolean = true;

  constructor(private navParams: NavParams, 
              private navCtrl: NavController,
              private modalCtrl: ModalController,
              private events: Events,
              private apiStorage: ApiStorageService) {}
              
  ngOnInit() {
                
      this.token = this.navParams.get('token'); 
      this.userInfo = this.navParams.get('user'); 
      this.socket = this.navParams.get('socket'); 
      this.users = this.navParams.get('users'); 

      let rooms = this.navParams.get('rooms'); 
      //[{roomid:{name:'',...adding+...,users:[{username:[socketonline]}]}}]

      rooms.forEach(room=>{
          room.image = room.image?room.image: ApiStorageService.mediaServer + "/db/get-private?func=avatar&token="+this.token;
          this.rooms.push(room);
      })

      console.log('rooms',this.rooms);

     this.chatManager = {
      title: "Chats - Nhắn tin online"
      , search_bar: {hint: "Tìm nhóm"} 
      , buttons: [
          {color:"primary", icon:"add", next:"ADD"}
        ]
      , items: []
    };

     this.myNavCtrlLength =  this.navCtrl.length();


     //nhan ket qua dong thoi new room?? cung events voi home-menu
     //dang ky room moi
     //nhan tin nhan gui den
    this.events.subscribe('event-main-received-users'
      , (users => {
        //console.log('event-main-received-users-home-chats', users);
        //this.users = users;
        users.forEach(user=>{
        let userExists = this.users.find(u=>u.username===user.username);
          if (!userExists){
            this.users.push(user);
          }
        })
      })

    )

    this.events.subscribe('event-main-received-rooms'
      , (rooms => {
        //console.log('event-main-received-rooms-home-chats', rooms);
        rooms.forEach(room=>{
          let roomExists = this.rooms.find(r=>r.id===room.id);
          if (!roomExists){
            this.rooms.push(room);
          }
        })
        //this.rooms = rooms;
      })
    ) 

  }

  ionViewDidLoad() {
    //console.log('Form load home-chats')
  }

  ionViewDidLeave() {
    if (this.navCtrl.length() <= this.myNavCtrlLength){
      //console.log('Form did Leave disconnect chat');
      //this.socket.disconnect();
    } 
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

  callbackAddRoom = function(res){
    return new Promise((resolve,reject)=>{
      let users = [];
      let groupName;
      res.data.forEach(el=>{
        //el.room_name???
        groupName = el.title?el.title:'new Group';
        for (let key in el.details){
          if (el.details[key]){
            users.push(key)
          }
        }
      })

      console.log('users new room:',users);
      
      if (users.length>0){
        let room_id = this.userInfo.username + "#" + new Date().getTime();
        let roomNew = 
          {
            id: room_id,
            name: groupName,
            image: ApiStorageService.mediaServer + "/db/get-private?func=avatar&token="+this.token,
            admins:[this.userInfo.username],
            users: users,
            created: new Date().getTime(),
            time:  new Date().getTime(),
            messages:[{
              text: (this.userInfo.data?this.userInfo.data.fullname:this.userInfo.username) + " Create group",
              created: new Date().getTime()
            }]
          }
          //6. user create newroom
          this.socket.emit('client-create-new-room',roomNew);  
      }

      resolve({next:'CLOSE'});
    })
  }.bind(this);

  
  callbackChatRoom = function(res){
    return new Promise((resolve,reject)=>{
      resolve();
    })
  }.bind(this);

  onClickItem(room){
    //console.log('goto room',room);
    this.navCtrl.push(ChattingPage, {
                        parent:this,
                        socket: this.socket,
                        user: this.userInfo,
                        token: this.token,
                        callback: this.callbackChatRoom,
                        room: room
                      })
  }

  //onclick....
  onClickHeader(btn){
    if (btn.next==='ADD'){
      
      console.log(this.users);

      let details = [];
      this.users.forEach(el=>{
        details.push({key:el.username,name:el.data&&el.data.fullname?el.data.fullname+'('+el.data.nickname+')':el.username,color:"secondary",value:0})
      })

      let formData={
        parent: this,
        callback: this.callbackAddRoom
        ,form: {title: "Chọn user để liên lạc"
        , items: [
          { type: "check", key:"danh_sach", name: "Danh bạ online",
          details:details
            }
            , { 
              type: "button"
              , options: [
                 { name: "Bỏ qua", next: "CLOSE" }
                , { name: "Chọn", next: "CALLBACK"}
              ]
            }
          ]
        }
      }
      this.openModal(DynamicRangePage,formData);
    }
  }

  // Su dung slide Pages
  //--------------------------
  /**
   * Thay đổi kiểu bấm nút mở lệnh trên item sliding
   * @param slidingItem 
   * @param item 
   */
  openSwipeOptions(slidingItem: ItemSliding, item: Item, room:any ){
    room.visible = !room.visible;
    if (room.visible){
      let _offset =  "translate3d(-168px, 0px, 0px)"
      slidingItem.setElementClass("active-sliding", true);
      slidingItem.setElementClass("active-slide", true);
      slidingItem.setElementClass("active-options-right", true);
      item.setElementStyle("transform",_offset); 
    }else{
      this.closeSwipeOptions(slidingItem);
    }
  }

  /**
   * Thay đổi cách bấm nút đóng lệnh bằng nút trên item sliding
   * @param slidingItem 
   */
  closeSwipeOptions(slidingItem: ItemSliding){
    slidingItem.close();
    slidingItem.setElementClass("active-sliding", false);
    slidingItem.setElementClass("active-slide", false);
    slidingItem.setElementClass("active-options-right", false);
  }

  onClickDetails(slidingItem: ItemSliding, room: any, func: number){
    this.closeSwipeOptions(slidingItem);

  }
  //----------- end of sliding

  openModal(form,data?:any) {
    this.modalCtrl.create(form, data).present();
  }


}