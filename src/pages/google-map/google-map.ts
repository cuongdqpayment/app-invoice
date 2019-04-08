import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { DynamicFormWebPage } from '../dynamic-form-web/dynamic-form-web';
import { ApiMapService } from '../../services/apiMapService';
import { ApiStorageService } from '../../services/apiStorageService';
import { DynamicListOrderPage } from '../dynamic-list-order/dynamic-list-order';

declare var google;
let latLng;
let circle;
let direction;
let accuracy;

let trackingPath;
let car;

var interval;

@Component({
  selector: 'page-google-map',
  templateUrl: 'google-map.html'
})
export class GoogleMapPage {
  @ViewChild('map') mapElement: ElementRef;

  map: any;
  isMapLoaded:boolean = false;
  isShowCenter: boolean = false;
  isLocOK: boolean = false;
  className = "icon-center size-md icon-blue";
  classFloatInfo = "text-center size-sm icon-green text-blur";
  
  isSearch: boolean = false;
  shouldShowCancel: boolean = false;

  locationTracking: any;

  //run auto tracking
  isRuningInterval:boolean = false;
  
  view:any = {
    header: {
      title:"Map"
      ,search_bar:{hint:"Tìm địa chỉ hoặc tọa độ", search_string:"", search_result:{}}
      ,buttons:[
         {color:"primary", icon:"notifications", next:"NOTIFY"
          , alerts:[
              "cuong.dq"
              ]
          }
        , {color:"bg-blue", icon:"cog", next:"SETTINGS"}
      ]
    }
    ,
    fix:{
      right:true        //left/center/right
      , bottom:true    //top/middle/bottom
      , mini:true
      , actions:[
        {color:"secondary", name:"60", next:"SPEED"}
        ,{color:"primary", icon:"navigate", next:"CENTER"}
        ,{color:"light", icon:"locate", next:"LOCATE"}
      ]
    }
    ,
    dynamic:{
        left:true       //left/center/right
      , bottom:true     //top/middle/bottom
      , mini:undefined  //true/undefined
      //icon:"md-share"//"arrow-dropright"//"arrow-dropdown"//"arrow-dropup"//"arrow-dropleft"
      , controler:{color:"danger", icon:"md-share"}   
      , directions: [
        {
          side:"top",
          actions: [
            {color:"bg-blue", icon:"contact", next:"NOTHING"}  
           ,{color:"light", icon:"globe", next:"NOTHING"}
            ,{color:"secondary", name:"Trên", next:"NOTHING"}
          ]
        }
        ,
        {
          side:"right",
          actions: [
            {color:"light", icon:"people", next:"NOTHING"}
            ,{color:"danger", name:"Phải", next:"NOTHING"}
          ]
        }
        ,
        {
          side:"bottom",
          actions: [
            {color:"bg-blue", icon:"cog", next:"SEARCH"}
            ,{color:"light", icon:"globe", next:"SEARCH"}
            ,{color:"danger", icon:"contacts", next:"SEARCH"}
            ,{color:"dark", name:"Dưới", next:"SEARCH"}
          ]
        }
        ,
        {
          side:"left",
          actions: [
            {color:"bg-blue", icon:"cog", next:"SEARCH"}
            ,{color:"dark", name:"Trái", next:"SEARCH"}
          ]
        }
      ]
    }
  }

  actionsIdle = [
                  {
                    side:"top",
                    actions: [
                      {color:"bg-blue", name:"Xem", next:"VIEW"}  
                    ]
                  }
                  ,
                  {
                    side:"right",
                    actions: [
                      {color:"light", icon:"people", next:"NOTHING"}
                      ,{color:"danger", name:"Phải", next:"NOTHING"}
                    ]
                  }
                ];

  actionsCenter = [
    {
      side:"top",
      actions: [
        {color:"danger", name:"Reset", next:"RESET"}
      ]
    }
    ,
    {
      side:"right",
      actions: [
        {color:"secondary", icon:"share-alt", url: ApiStorageService.authenticationServer + "/location/share-point", next:"SHARE"}
        ,{color:"danger", icon:"send", url: ApiStorageService.authenticationServer + "/location/live-user", next:"LIVE"}
        ,{color:"light", icon:"archive", next:"SAVE"}
      ]
    }
  ];



  mapSettings = {
    zoom: 15
    ,type: google.maps.MapTypeId.ROADMAP
    ,auto_tracking:false
  }

  trackingPoints = [];
  
  constructor(private navCtrl: NavController
              , private modalCtrl: ModalController
              , private loadingCtrl: LoadingController
              , private geoLocation: Geolocation
              , private apiMap: ApiMapService
              , private toastCtrl: ToastController
    ) {}

  ngOnInit() {
    //lay vi tri tracking
    this.getLocation();
  }

  ionViewDidLoad() {
    this.loadMap();
    this.resetMap();
  }

  resetMap() {
    //clear path live
    if (this.isMapLoaded) {
      trackingPath.getPath().clear();
      trackingPath.setMap(null);
    }

    //reset xem toa do dia chi
    this.isShowCenter = false;
    this.view.fix.actions.find(x=>x.next==="CENTER").color = "primary";
    this.clearDrag();

    //reset timer interval
    this.isRuningInterval = false;
    this.mapSettings.auto_tracking = this.isRuningInterval;
    this.view.fix.actions.find(x=>x.next==="LOCATE").color= "light";
    clearInterval(interval);
    
    //....

    
  }

  //load bảng đồ google map như web đã làm
  loadMap() {
    let loading = this.loadingCtrl.create({
      content: 'Loading Map...'
    });
    loading.present();

    let mapStyles = [{
      featureType: "poi",
      elementType: "labels",
      stylers: [{
        visibility: "off"
      }]
    }, {
      featureType: "transit",
      elementType: "labels",
      stylers: [{
        visibility: "off"
      }]
    }];

    latLng = new google.maps.LatLng(16.05, 108.2);

    let mapOptions = {
      center: latLng,
      zoom: this.mapSettings.zoom,
      mapTypeId: this.mapSettings.type,
      disableDefaultUI: true,
      styles: mapStyles
    };

    //lenh nay se load map lan dau tien luon nhe
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    
    circle = new google.maps.Marker({ 
                icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10, //6, 0.7
                        strokeColor: ApiMapService.moveLocations.white,
                        strokeWeight: 3,
                        fillColor: ApiMapService.moveLocations.blue,
                        fillOpacity: 0.8,
                        rotation: 0
                      },
                  position: latLng,
                  map: this.map
              });
    
    accuracy = new google.maps.Circle({
      strokeColor: '#caeaf9',
      strokeOpacity: 0.5,
      strokeWeight: 1,
      fillColor: '#caeaf9',
      fillOpacity: 0.35,
      map: this.map,
      center: latLng,
      radius: 50
    });

    direction = new google.maps.Marker({ 
      icon: {
              path: google.maps.SymbolPath.FORWARD_OPEN_ARROW, 
              scale: 4,
              strokeColor: ApiMapService.moveLocations.light,
              strokeWeight: 1,
              fillColor: ApiMapService.moveLocations.brown,
              fillOpacity: 0.8,
              rotation: 0
            },
        position: latLng,
        map: this.map
    });

    car = new google.maps.Marker({ 
      icon: {
              path: ApiMapService.moveLocations.car,
              scale: 0.6,
              strokeColor: ApiMapService.moveLocations.light,
              strokeWeight: 1,
              fillColor: ApiMapService.moveLocations.yellow,
              fillOpacity: 0.8,
              rotation: 0
            },
        position: latLng,
        map: this.map
    });


    trackingPath = new google.maps.Polyline({
      geodesic: true,
      strokeColor: '#00ff00',
      strokeOpacity: 0.8,
      strokeWeight: 2
    });

    this.isMapLoaded = true;

    loading.dismiss();
  }

  //lấy vị trí hiện tại và theo dõi vị trí nếu có thay đổi
  /**
   * truong hop thoi gian qua tre hon ma chua co location moi thi
   * moi cho phep, con moi qua thi khong thuc hien
   * @param isCenter 
   */
  getLocation(isCenter?:boolean) {

    const TIMEOUT = 5000; //5 giay ma vi tri khong co moi thi moi lam moi 
    let isTimeOut = true;
    if (this.trackingPoints.length>0){
      let old = this.trackingPoints[this.trackingPoints.length-1];
      if (new Date().getTime() - old.time_tracking < TIMEOUT) isTimeOut = false;
    }

    if (isCenter || isTimeOut){
      this.stopTracking();

        this.geoLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 7000
        }).then((pos) => {
          if (pos.coords) {
            this.isLocOK = true;
            this.showLocation({ lat:pos.coords.latitude,
              lng:pos.coords.longitude,
              accuracy: pos.coords.accuracy,
              speed: pos.coords.speed,
              altitude: pos.coords.altitude,
              altitudeAccuracy: pos.coords.altitudeAccuracy,
              heading: pos.coords.heading,
              timestamp:pos.timestamp,
              time_tracking: new Date().getTime()
            }, isCenter);
          } else {
            this.isLocOK = true;
          }
        }).catch((err) => {
          this.isLocOK = false;
          
          this.toastCtrl.create({
            message: "getCurrentPosition() err: " + err.code + " - " + err.message,
            duration: 5000
          }).present();
        });
      
      this.startTracking();
    }
  }

  //Theo dõi thay đổi vị trí
  startTracking() {
    this.locationTracking = this.geoLocation.watchPosition(
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 3000
      }
    )
        .subscribe((pos) => {
          if (pos.coords) {
            this.isLocOK = true;
            this.showLocation({ lat:pos.coords.latitude,
                                lng:pos.coords.longitude,
                                accuracy: pos.coords.accuracy,
                                speed: pos.coords.speed,
                                altitude: pos.coords.altitude,
                                altitudeAccuracy: pos.coords.altitudeAccuracy,
                                heading: pos.coords.heading,
                                timestamp:pos.timestamp,
                                time_tracking: new Date().getTime()
                              });
          } else {
            this.isLocOK = true;
          }
                
        },
        err => {
              this.isLocOK = false;
              this.toastCtrl.create({
                message: "watchPosition() err: " + err.code + " - " + err.message,
                duration: 5000
              }).present();
            }
        )
  }

  stopTracking() {
      try { this.locationTracking.unsubscribe() } catch (e) { };
  }

  //Su dung search
  //---------------------
  goSearch(){
    this.isSearch = true;
  }

  searchEnter(){
    this.apiMap.getLatlngFromAddress(this.view.header.search_bar.search_string)
    .then(data=>{
      //share ? popup temporary, ???
      if (data.status === 'OK' && data.results && data.results.length>0){
        let addresses = []
        data.results.forEach(el => {
          addresses.push({address: el.formatted_address, lat: el.geometry.location.lat, lng: el.geometry.location.lng})
        });
        //console.log('data',addresses);
        if (addresses.length>=1){
          this.view.header.search_bar
          .search_result = {
                          lat: addresses[0].lat,
                          lng: addresses[0].lng,
                          address: addresses[0].address
                        }
          this.map.setCenter(new google.maps.LatLng(addresses[0].lat, addresses[0].lng));
          
          this.isShowCenter = true;
          this.showCenterMode();

        }
      }
    })
    .catch(err=>{
      console.log('err',err);

    });

    this.view.header.search_bar.search_string = '';
    this.isSearch = false;
  }

  searchEnterEsc(){
    this.isSearch = false;
  }

  onInput(e){
    //xu ly filter
    //console.log(this.view.header.search_bar.search_string);
  }

  //thoi gian interval
  startStopInterval() {
    this.isRuningInterval = !this.isRuningInterval;
    this.mapSettings.auto_tracking = this.isRuningInterval;

    this.view.fix.actions.find(x=>x.next==="LOCATE").color=this.isRuningInterval?"danger":"light";
    if (this.isRuningInterval){
        this.autoGetLocation();
    }else{
      clearInterval(interval);
    }
  }

  autoGetLocation(){
    interval = setInterval(function () {
      this.getLocation() //
    }.bind(this), 3000);   //cu 3000ms thi lay vi tri mot lan
  }


  ///////////////////////////////////
  //drag & drop

  startStopShowCenter(){
    this.isShowCenter = !this.isShowCenter;
    this.view.fix.actions.find(x=>x.next==="CENTER").color = this.isShowCenter?"danger":"primary";
    if (this.isShowCenter){
      this.showCenterMode();
    } else{
      this.clearDrag();
    }
  }

  /**
   * 
   * @param isEnd 
   * diem cuoi hay diem dau
   */
  showCenterMode(isEnd?:boolean) {
    
    this.mapDragend();

    google.maps.event.addListener(this.map, 'dragend', () => this.mapDragend());
  
    if (!isEnd) {
      this.className = "icon-center size-md icon-blue";
      this.classFloatInfo = "text-center size-sm icon-green text-blur";
    } else {
      this.className = "icon-center size-md icon-red";
      this.classFloatInfo = "text-center size-sm icon-red text-blur";
    }

    //thay doi nut hanh dong
    this.view.dynamic.directions = this.actionsCenter;
  }

  mapDragend() {
    if (this.map.getCenter()) {
      this.view.header.search_bar.search_result = {
        lat: this.map.getCenter().lat(),
        lng: this.map.getCenter().lng(),
        address: "searching..."
      }

      this.apiMap.getAddressFromLatlng(this.view.header.search_bar.search_result.lat + "," + this.view.header.search_bar.search_result.lng)
        .then(data => {
          if (data.status === 'OK' && data.results && data.results.length>0){
            this.view.header.search_bar.search_result.address = data.results[0].formatted_address;
          }
        })
        .catch(err => {
          this.toastCtrl.create({
            message: "Err getAddressFromLatlng: " + JSON.stringify(err),
            duration: 5000,
            position: 'bottom'
          }).present();
        })
        ;
    }
  }

  /**
   * khong cho hien thi diem, tuc khong co nut chia se
   * chi con cac chuc nang khac thoi
   */
  clearDrag() {
      google.maps.event.clearListeners(this.map, 'dragend');
      this.view.dynamic.directions = this.actionsIdle;
  }
  // end drag
  ///////////////////////////////////


  callbackFunction = function(res){
    return new Promise((resolve, reject) => {
      
      this.mapSettings.type = res.data.type;
      this.mapSettings.zoom = res.data.zoom;
      this.mapSettings.auto_tracking = res.data.auto_tracking;

      this.map.setMapTypeId(this.mapSettings.type);
      this.map.setZoom(this.mapSettings.zoom);
      if (this.mapSettings.auto_tracking){
        if (!this.isRuningInterval){
          this.isRuningInterval = true;
          this.view.fix.actions.find(x=>x.next==="LOCATE").color="danger";
          this.autoGetLocation();
        }
      }else{
        if (this.isRuningInterval){
          this.isRuningInterval = false;
          this.view.fix.actions.find(x=>x.next==="LOCATE").color="light";
          clearInterval(interval);
        }
      }
      resolve({next:"CLOSE"});
    })
  }.bind(this);


  callbackTrackingView = function(res){
    return new Promise((resolve, reject) => {
      resolve({next:"CLOSE"});
    })
  }.bind(this);


  openModal(form, data) {
    let modal = this.modalCtrl.create(form, data);
    modal.present();
  }

  /////////////////////////////

   /**
   * 
   * @param loc 
   * @param isCenter
   * tinh toc do di chuyen  
   */
  showLocation(loc:any,isCenter?:boolean){
    let newLatlng = {lat:loc.lat,lng:loc.lng};
    let newGLatLng = new google.maps.LatLng(loc.lat,loc.lng);
    
    if (this.trackingPoints.length>0){
      loc.old = this.trackingPoints[this.trackingPoints.length-1];
      loc.result = this.apiMap.getSpeed(loc.old,loc);
      this.view.fix.actions.find(x=>x.next==="SPEED").name = ''+loc.result.next_speed;
      
      //chi giu lai 10 diem tnh toc do trung binh
      if (this.trackingPoints.length>50) this.trackingPoints.shift();

      this.trackingPoints.push(loc);
      latLng = new google.maps.LatLng(loc.result.next_point.lat, loc.result.next_point.lng);
      trackingPath.getPath().push(latLng);

    }else{
      this.trackingPoints.push(loc); //luu bang 1
      latLng = new google.maps.LatLng(loc.lat, loc.lng);
      trackingPath.getPath().push(latLng);

    }
    
  
    if (this.isMapLoaded){
      circle.setPosition(newGLatLng);
      direction.setIcon({
        path: google.maps.SymbolPath.FORWARD_OPEN_ARROW, 
        scale: 3,
        strokeColor: ApiMapService.moveLocations.white,
        strokeWeight: 1,
        fillColor: ApiMapService.moveLocations.brown,
        fillOpacity: 0.8,
        rotation: loc.result&&loc.result.angle?loc.result.angle:0
        ,anchor: new google.maps.Point(0,8)
      });
      direction.setPosition(newGLatLng);
      accuracy.setCenter(newLatlng);
      accuracy.setRadius(loc.accuracy);

      
      car.setIcon({
        path: ApiMapService.moveLocations.car,
        scale: 0.6,
        strokeColor: ApiMapService.moveLocations.light,
        strokeWeight: 1,
        fillColor: ApiMapService.moveLocations.yellow,
        fillOpacity: 0.8,
        rotation: loc.result&&loc.result.next_point&&loc.result.next_point.angle?loc.result.next_point.angle:0
        ,anchor:new google.maps.Point(16,32)
      });

      car.setPosition(latLng);
  
      //dua ban do ve vi tri trung tam
      if (this.mapSettings.auto_tracking || isCenter) {
        this.map.setCenter(latLng);
        //neu yeu cau lay dia chi thi goi lay dia chi gui ve
        //truong hop diem cu va diem moi cach nhau 50m thi moi goi dia chi
        if (this.isShowCenter
          &&loc.old
          &&loc.old.result
          &&loc.old.result.next_point
          &&loc.result
          &&loc.result.next_point
          &&this.apiMap.distance(loc.old.result.next_point.lat
                                ,loc.old.result.next_point.lng
                                ,loc.result.next_point.lat
                                ,loc.result.next_point.lng)>200) this.mapDragend();
      }
    }

  }

  /* moveSmoothly = function(){
    position[0] += deltaLat;
    position[1] += deltaLng;
    
    var latlng = new google.maps.LatLng(position[0], position[1]);
    
    taxi.setTitle("("+position[0]+","+position[1]+")");
    
    taxi.setPosition(latlng);
    if(ii!=numDeltas){
        ii++;
        setTimeout(moveSmoothly, delaysmoothly);
    }
  } */


  showTrackingPoints(){
    let items = [];
    this.trackingPoints.forEach(el=>{
        items.push({
            subtitle: el.lat.toFixed(4) + " , " + el.lng.toFixed(2)
            ,strong: el.result?Math.round(el.result.distance*1000) + " : " + Math.round(el.result.angle):""
            ,p: el.result?Math.round(el.result.dtimestamp) + " : " + Math.round(el.result.dtime_tracking):""
            ,span: el.result?Math.round(el.result.old_accuracy) + " : " + Math.round(el.result.new_accuracy):""
            ,note: el.result?el.result.speed + '-' + el.result.next_speed:""
            ,command:{ name: "Chi tiết", color:"secondary", icon:"create", next:"EXIT"}
        })
    })


    let listResults: any = {
      title: "Thông tin tracking"
      , search_bar: {hint: "Tìm cái gì đó"} 
      //, order: {edit:"Sắp xếp", done:"Xong"}
      , is_table: true
      , switch: {table:"Bảng", item:"Liệt kê"}
      , buttons: [
          {color:"primary", icon:"close", next:"CLOSE"}
        ]
      ,header: {
                title:"Tọa độ"
                ,strong:"Khoảng cách - góc"
                ,p:"Thời gian gps - thực" 
                ,span:"Sai số cũ - mới"
                ,label:"Ghi chú"
                ,note:"Tốc độ"
                }
      ,footer: {
                title:"Tọa độ"
                ,strong:"Khoảng cách - góc"
                ,p:"Thời gian gps - thực" 
                ,span:"Sai số cũ - mới"
                ,label:"Ghi chú"
                ,note:"Tốc độ"
                }
      ,items: items
    };

    let formData = {
      parent: this,
      callback: this.callbackTrackingView,
      step: 'view-trackings',
      list: listResults
    };
    this.openModal(DynamicListOrderPage,formData);   

  }

  //thuc hien cac nut lenh theo khau lenh
  onClickAction(btn,fab){
    //console.log('click:',btn);
    if (btn.next==="RESET"){
      this.resetMap();
      if (fab) fab.close();
    }

    if (btn.next==="CENTER"){
      this.startStopShowCenter();
    }
    

    if (btn.next==="TRACKING"){
      this.startStopInterval();
    }
    
    if (btn.next==="LOCATE"){
      this.getLocation(true);
    }

    if (btn.next==="SPEED"){
      trackingPath.setMap(this.map);
    }
    
    if (btn.next==="VIEW"){
      this.showTrackingPoints();
    }

    if (btn.next==="SAVE"){
      //
      console.log('co toa do, co dia chi..',this.view.header.search_bar.search_result)
      //gan toa do nay cho cai gi??
      
    }

    if (btn.next ==="SETTINGS"){

      let formSetting = {
        title: "Settings"
        , items: [
          {  name: "Lựa chọn kiểu hiển thị", color:"primary", type: "title"}
    
          , { key: "type", name: "Kiểu bản đồ", color:"primary", type: "select", value: this.mapSettings.type, options: [
                { name: "Hành chính", value: google.maps.MapTypeId.ROADMAP }
                , { name: "Địa hình", value: google.maps.MapTypeId.TERRAIN }
                , { name: "Vệ tinh", value: google.maps.MapTypeId.HYBRID }
              ] 
            }
          , { key: "zoom", name: "Mức hiển thị", color:"primary", type: "range", icon: "globe", value: this.mapSettings.zoom, min: 1, max: 20 }
          , { key: "auto_tracking", name: "Tự động tracking?", color:"danger", value: this.mapSettings.auto_tracking, icon: "locate", type: "toggle" }
          , 
          { 
              type: "button"
            ,  color:"primary"
            , options: [
              { name: "Bỏ qua", next: "CLOSE" }
              , { name: "Chọn", next: "CALLBACK"}
            ]
          }]
      }


      let formData = {
        parent: this,
        callback: this.callbackFunction,
        step: 'map-settings',
        form: formSetting
      };
      this.openModal(DynamicFormWebPage,formData);      
    }

  }

}
