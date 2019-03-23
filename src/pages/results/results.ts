import { Component } from '@angular/core';
import { NavController, Platform, NavParams } from 'ionic-angular';
import { ApiSqliteService } from '../../services/apiSqliteService';
import { ApiStorageService } from '../../services/apiStorageService';

@Component({
  selector: 'page-results',
  templateUrl: 'results.html'
})
export class ResultsPage {

  results = [];
  dynamicList: any = {
    header: {
      title: "Time"
      , strong: "Server-ISP"
      , p: "Dowload"
      , span: "Upload"
      , label: "Ping"
      , note: "Jitter"
    }
  };

  callback:any;

  constructor(
    private navCtrl: NavController
    , private platform: Platform
    , private apiStorage: ApiStorageService
    , private apiSqlite: ApiSqliteService
    , private navParams: NavParams) { }

  ngOnInit() {

    this.dynamicList = this.navParams.get("form") ? this.navParams.get("form") : this.dynamicList;
    this.results = this.navParams.get("results") ? this.navParams.get("results") : this.results;
    this.dynamicList.items = this.results;
    
    this.callback = this.navParams.get("callback");

    
  }

  onClickResetResults(){
    if (this.platform.is("cordova")){
      
    }else{
      this.apiStorage.deleteResults();
      this.results=[];
    }
    
    if (this.callback){
      this.callback(true);
    }

    this.navCtrl.pop();
  }

}
