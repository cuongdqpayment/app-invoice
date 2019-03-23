import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, Slides } from 'ionic-angular';

import { FormGroup, FormBuilder } from '@angular/forms';

import { ApiAuthService } from '../../services/apiAuthService';
import { ApiStorageService } from '../../services/apiStorageService';
import { ApiResourceService } from '../../services/apiResourceServices'


@Component({
  selector: 'page-customer',
  templateUrl: 'customer.html'
})
export class CustomerPage {
  @ViewChild(Slides) slides: Slides;
  slideIndex = 0;

  userInfo:any;

  customers:any = [];
  customersOrigin:any = [];
  isSearch: boolean = false;
  searchString:string='';
  maxCurrentId:number=0;
  currentCustomer:any;

  public myFromGroup: FormGroup;

  constructor(
              private navCtrl: NavController,
              private formBuilder: FormBuilder,
              private auth : ApiAuthService,
              private storage: ApiStorageService, 
              private resource: ApiResourceService,
              private loadingCtrl: LoadingController
              ) {

  }

  ngOnInit(){
    //khong cho quet bang tay
    this.slides.lockSwipes(true);

    this.userInfo = this.auth.getUserInfo();
    console.log('Login page ready authorize', this.userInfo);

    this.getCustomers(); //cai nay lay tu load trang dau luon
    

    this.myFromGroup = this.formBuilder.group({
      full_name: '',
      address: '',
      phone: '',
      email: '',
      area: '',
      type: '',
    });
  }

  getCustomers(){
    let loading = this.loadingCtrl.create({
      content: 'Đang lấy danh sách khách hàng...'
    });
    loading.present();

    this.resource.getAllCutomers()
    .then(customers=>{
      this.customersOrigin = customers;
      this.customers = this.customersOrigin;
      //tim gia tri max cua ma khach hang
      this.maxCurrentId = Math.max.apply(Math, this.customersOrigin.map((o)=>{return o.stt}));
      //console.log('MAX Ma khach hang',this.maxCurrentId);
      loading.dismiss();
    })
    .catch(err=>{
      this.customersOrigin = [];
      this.customers =  [];
      loading.dismiss();
    })

  }

  goSearch(){
    this.isSearch = true;
  }

  onInput(e){
    this.customers = this.customersOrigin.filter(x=>(
      x.full_name.toLowerCase().indexOf(this.searchString.toLowerCase())>=0
      ||
      x.cust_id.toLowerCase().indexOf(this.searchString.toLowerCase())>=0
      ||
      x.area.toLowerCase().indexOf(this.searchString.toLowerCase())>=0
      ||
      x.staff.toLowerCase().indexOf(this.searchString.toLowerCase())>=0
      ||
      (x.phone&&x.phone.indexOf(this.searchString)>=0)
      ))
  }

  searchEnter(){
    this.isSearch = false;
  }

  gotoSlideEdit(cus){
    //console.log('cus',cus);
    this.currentCustomer = cus;
    this.myFromGroup = this.formBuilder.group({
      full_name: cus.full_name,
      address: cus.address?cus.address:cus.area,
      phone: cus.phone,
      email: cus.email,
      area: cus.area,
      type: cus.cust_type,
    });
    this.goToSlide(1);
  }
  /**
   * Dieu khien slide
   * @param i 
   */
  goToSlide(i) {
    this.slides.lockSwipes(false);
    this.slides.slideTo(i, 500);
    this.slides.lockSwipes(true);
  }

  /**
   * xac dinh slide
   */
  slideChanged() {
    this.slideIndex = this.slides.getActiveIndex();
  }

  goBack(){
    this.goToSlide(0);
  }

  /**
   * Lay noi dung co thay doi
   * luu vao array customers luu xuong dia, luu csdl
   */
  onSubmit(){
    this.currentCustomer.full_name = this.myFromGroup.get('full_name').value;
    this.currentCustomer.address = this.myFromGroup.get('address').value;
    this.currentCustomer.phone = this.myFromGroup.get('phone').value;
    this.currentCustomer.email = this.myFromGroup.get('email').value;
    this.currentCustomer.change_date = new Date().getTime();

    
    this.goToSlide(0);
  }

  goParameters(){
    
  }

  userAction(){
    //popup menu logout
  }

  newCustomter(){
    
  }

}
