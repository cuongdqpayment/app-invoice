import { Component } from '@angular/core';
import { ModalController, Platform, AlertController } from 'ionic-angular';
import { DynamicFormWebPage } from '../dynamic-form-web/dynamic-form-web';
import { DynamicFormMobilePage } from '../dynamic-form-mobile/dynamic-form-mobile';
import { SpeedTestPage } from '../speed-test/speed-test';
import { GoogleMapPage } from '../google-map/google-map';
import { HomeMenuPage } from '../home-menu/home-menu';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  
  tabs: any = [
    {
      root: SpeedTestPage,
      title: 'SpeedTest',
      icon: 'speedometer'
    },
    {
      root: GoogleMapPage,
      title: 'Map',
      icon: 'globe'
    },
    {
      root: HomeMenuPage,
      title: 'Home',
      icon: 'home'
    }
  ];

  constructor(
              private modalCtrl: ModalController
            , private platform: Platform
            , private alertCtrl: AlertController
  ) {
    //console.log('1. constructor tabs')
  }
  
  ngOnInit(){
    //console.log('2. ngOnInit tabs')
  }

  ionViewDidLoad() {
    //console.log('3. ionViewDidLoad tabs')
  }

  ionViewWillEnter(){
    //console.log('4. ionViewWillEnter tabs')
  }

  callback(){

  }

  callWaiting(){

  }

  
  openModal(data) {

    return new Promise( (resolve, reject) => { 
      let formPopup:any;
     
      if (this.platform.is('core')){
        formPopup = DynamicFormWebPage;
      }else{
        formPopup = DynamicFormMobilePage;
      }

      let modal = this.modalCtrl.create(formPopup, data);
          modal.onDidDismiss(data=>{
            resolve(data);
          })
      modal.present();
    })
    
  }


  presentConfirm(jsonConfirm:{title:string,message:string,cancel_text:string,ok_text:string,ok:any}) {
    let alert = this.alertCtrl.create({
      title: jsonConfirm.title, //'Xác nhận phát hành',
      message: jsonConfirm.message, //'Bạn muốn ',
      buttons: [
        {
          text: jsonConfirm.cancel_text, //Bỏ qua
          role: 'cancel',
          handler: () => {
            if (jsonConfirm.ok) jsonConfirm.ok(false);
          }
        },
        {
          text: jsonConfirm.ok_text,//'Đồng ý',
          handler: () => {
            if (jsonConfirm.ok) jsonConfirm.ok(true);
          }
        }
      ]
    });
    alert.present();
  }

  presentAlert(jsonConfirm:{title:string,message:string,ok_text:string}) {
    let alert = this.alertCtrl.create({
      title: jsonConfirm.title, //'Xác nhận phát hành',
      message: jsonConfirm.message, //'Bạn muốn ',
      buttons: [
        {
          text: jsonConfirm.ok_text,//'Đồng ý',
          handler: () => {}
        }
      ]
    });
    alert.present();
  }

}
