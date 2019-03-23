import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ApiSqliteService } from '../../services/apiSqliteService';
import { TabsPage } from '../tabs/tabs';
import { ApiHttpPublicService } from '../../services/apiHttpPublicServices';

/* var dataType = {};

dataType.integer = 'INTEGER';
dataType.text = 'TEXT';
dataType.numeric='NUMERIC';
dataType.real = 'REAL';
dataType.blob = 'BLOB'; */


@Component({
  selector: 'page-home-speedtest',
  templateUrl: 'home-speedtest.html'
})
export class HomeSpeedtestPage {

  app: any = {
    id: "SPEEDTEST",
    name: "Speedtest VN",
    image: "assets/imgs/logo.png"
  }
  constructor(private navCtrl: NavController
    , private apiSqlite: ApiSqliteService
    , private apiPublic: ApiHttpPublicService
  ) { }

  ngOnInit() {

    //lay tu server ve form, version phan mem phuc vu
    this.apiPublic.getMyDevice()
      .then(data => {
        
        if (data.ip_info) try { data.ip_info = JSON.parse(data.ip_info); } catch (e) { }
        this.app.device_details = [];
        this.app.device_details.push({ name: "Your device:", value: data.device });
        this.app.device_details.push({ name: "Your IP:", value: data.ip });
        if (data.ip_info && data.ip_info.org) this.app.device_details.push({ name: "ISP Provider:", value: data.ip_info.org });
        if (data.ip_info && data.ip_info.country) this.app.device_details.push({ name: "Country:", value: data.ip_info.country });

        setTimeout(() => {
          this.callForward();
        }, 5000); //5 giay sau cho chay qua form moi

      })
      .catch(err => {
        //chay o che do offline
        setTimeout(() => {
          this.callForward();
        }, 1000); //5 giay sau cho chay qua form moi
      })

  }

  callForward() {

    this.apiSqlite.init()
      .then(db => {
        //database open ok
      })
      .catch(err => {
        //can not open db
      });
      

    setTimeout(() => {

      if (this.apiSqlite.getDb()) {

        this.apiSqlite.createTable({
          name: "SPEEDTEST"
          , cols: [
            {
              name: 'id',
              type: 'INTEGER',
              option_key: 'PRIMARY KEY AUTOINCREMENT',
              description: 'Mã tự tăng'
            }
            ,
            {
              name: 'time',
              type: 'INTEGER',
              option_key: '',
              description: 'Lưu thời gian test để tìm'
            }
            ,
            {
              name: 'result',
              type: 'TEXT',
              option_key: '',
              description: 'Lưu trữ kết quả test từ máy'
            }
          ]
        })
          .then(data => {
            console.log('Create table OK',JSON.stringify(data))
            //chay theo cordova (app - sqlite database)
            this.navCtrl.setRoot(TabsPage);
          })
          .catch(err => {
            console.log('Error in create table', err)
            //chay theo kieu web (core - storage) 
            this.navCtrl.setRoot(TabsPage);
            //this.navCtrl.setRoot(SpeedTestPage);
          })

      } else {
        //chay web
        this.navCtrl.setRoot(TabsPage);
      }
    }, 5000);

  }

}
