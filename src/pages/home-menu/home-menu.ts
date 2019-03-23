import { Component, } from '@angular/core';
import { ApiStorageService } from '../../services/apiStorageService';
import { ApiAuthService } from '../../services/apiAuthService';
import { LoadingController, ModalController, NavController, Events } from 'ionic-angular';
import { OwnerImagesPage } from '../owner-images/owner-images';
import { HomeChatPage } from '../home-chat/home-chat';
import { Socket } from 'ng-socket-io';

@Component({
  selector: 'page-home-menu',
  templateUrl: 'home-menu.html',
})
export class HomeMenuPage {

  dynamicTree: any;
  
  contacts = {}

  userInfo: any;
  token:any;
  socket: Socket;
  users = [];
  rooms = [];

  isLoaded: boolean = true;

  constructor(
      private apiStorageService: ApiStorageService
    , private auth: ApiAuthService
    , private loadingCtrl: LoadingController
    , private navCtrl: NavController
    , private modalCtrl: ModalController
    , private events: Events
  ) { }

  ngOnInit() {

    //doc tu bo nho len lay danh sach da load truoc day ghi ra 
    this.dynamicTree = this.apiStorageService.getHome();

    
    //setInterval(()=>{this.isLoaded = false},10000); //cu 1 phut la cho doc du lieu moi
    
    this.events.subscribe('event-main-login-checked'
      , (data => {

        this.token = data.token;
        this.userInfo = data.user;
        this.socket = data.socket;

        this.contacts = this.apiStorageService.getUserContacts(this.userInfo);

        if (this.dynamicTree.items.length===0){
          setTimeout(() => {
            this.getHomeNews();
          }, 1000);
        }

      })
    )

    this.events.subscribe('event-main-received-users'
      , (users => {
        //console.log('event-main-received-users-home-menu', users);
        this.users = users;
      })
    )

    this.events.subscribe('event-main-received-rooms'
      , (rooms => {
        //console.log('event-main-received-rooms-home-menu', rooms);
        this.rooms = rooms;
      })
    )

  }

  getHomeNews() {
    if (this.userInfo) {

      let loading = this.loadingCtrl.create({
        content: 'Đợi lấy dữ liệu cá nhân...'
      });
      loading.present();
      //chuyen thu tuc lay thong tin sang keo len, keo xuong
      this.auth.getDynamicUrl(ApiStorageService.mediaServer + "/db/list-groups?limit=12&offset=0", true)
        .then(data => {

          let items = [];
          data.forEach(el => {

            let medias = [];
            if (el.medias) {
              el.medias.forEach(e => {
                e.image = ApiStorageService.mediaServer + "/db/get-file/" + encodeURI(e.url);
                medias.push(e);
              })
            }

            el.medias = medias;
            el.actions = {
              like: { name: "LIKE", color: "primary", icon: "thumbs-up", next: "LIKE" }
              , comment: { name: "COMMENT", color: "primary", icon: "chatbubbles", next: "COMMENT" }
              , share: { name: "SHARE", color: "primary", icon: "share-alt", next: "SHARE" }
            }

            items.push(el);

          });

          this.dynamicTree.items = items;
          this.apiStorageService.saveHome(this.dynamicTree);

          loading.dismiss();
        })
        .catch(err => {
          loading.dismiss();
        })
    } else {
      this.userInfo = undefined;
      this.getPublicNews();
    }
  }

  getPublicNews() {
    let loading = this.loadingCtrl.create({
      content: 'Đợi load dữ liệu chung...'
    });
    loading.present();

    this.auth.getDynamicUrl(ApiStorageService.mediaServer + "/db/public-groups?limit=12&offset=0", true)
      .then(data => {
        loading.dismiss();

        let items = [];
        data.forEach(el => {

          let medias = [];
          if (el.medias) {
            el.medias.forEach(e => {
              e.image = ApiStorageService.mediaServer + "/db/get-file/" + encodeURI(e.url);
              e.note = el.time;
              medias.push(e);
            })
          }

          el.medias = medias;
          el.actions = {
            like: { name: "LIKE", color: "primary", icon: "thumbs-up", next: "LIKE" }
            , comment: { name: "COMMENT", color: "primary", icon: "chatbubbles", next: "COMMENT" }
            , share: { name: "SHARE", color: "primary", icon: "share-alt", next: "SHARE" }
          }

          items.push(el);

        });

        this.dynamicTree.items = items;
      })
      .catch(err => {
        loading.dismiss();
      })
  }

  // Xử lý sự kiện click button theo id
  onClickAdd() {
    this.openModal(OwnerImagesPage,{parent: this});
  }

  onClickChat() {
    this.navCtrl.push(HomeChatPage, {
      token: this.token,
      user: this.userInfo,
      socket: this.socket,
      users: this.users,
      rooms: this.rooms
    });
  }


  doInfinite(infiniteScroll,direction) {
    if (direction==='UP'){
      console.log('UP');

      if (!this.isLoaded){
        this.getHomeNews()
      }
      setTimeout(() => {
        this.isLoaded = true;
        infiniteScroll.complete();
      }, 1000);
    }else{
      console.log('DOWN');

      this.isLoaded = false; //khi keo xuong duoi thi o tren moi cho phep
      setTimeout(() => {
        infiniteScroll.complete();
      }, 1000);
    }

  }

  onClickMedia(idx, item) {
    console.log(idx, item);
  }

  onClickHeader(btn) {
    console.log(btn);
  }

  onClickShortDetails(item) {
    console.log(item);
  }

  onClickActions(btn, item) {
    console.log(btn, item);
  }


  openModal(form, data?: any) {
    let modal = this.modalCtrl.create(form, data);
    modal.present();
  }

}
