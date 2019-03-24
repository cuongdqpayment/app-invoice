import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, LoadingController, Platform, ItemSliding, Item, ModalController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ApiResourceService } from '../../services/apiResourceServices';
import { ApiStorageService } from '../../services/apiStorageService';
import { DynamicFormWebPage } from '../dynamic-form-web/dynamic-form-web';
import { ApiHttpPublicService } from '../../services/apiHttpPublicServices';


@Component({
  selector: 'page-invoice',
  templateUrl: 'invoice.html'
})
export class InvoicePage {

  billCycles:any=[];
  lastBillCycle: any = {};

  constructor(private navCtrl: NavController,
              private inAppBrowser: InAppBrowser,
              private resource: ApiResourceService,
              private pubService: ApiHttpPublicService,
              private platform: Platform,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private loadingCtrl: LoadingController) {
  }

  ngOnInit(){
   this.getBillCycles()
   .then(data=>{
     console.log('data',data);
     this.billCycles = data.bill_cycles;
     this.lastBillCycle = data.last_bill_cycle;
   })
   .catch(err=>{
     console.log('err',err);
   })
  }

  openModal(form, data?: any) {
    let modal = this.modalCtrl.create(form, data);
        modal.onDidDismiss(data=>{
          console.log('ket qua xu ly popup xong',data);
          if (data){
            this.billCycles = data.bill_cycles;
            this.lastBillCycle = data.last_bill_cycle;
          }
        })
    modal.present();
  }

  getBillCycles(){

    return new Promise<any>((resolve, reject) => {
      let loading = this.loadingCtrl.create({
        content: 'Đang kiểm tra các kỳ hóa đơn đã phát hành...'
      });
      loading.present();
  
      this.resource.getBillCycle()
      .then(billCycles=>{
        billCycles.forEach(el => {
          el.bill_cycle_vn = el.bill_cycle.slice(4,6)+"/"+el.bill_cycle.slice(0,4)
          el.bill_date_vn = el.bill_date.slice(6,8)+"/"+el.bill_date.slice(4,6)+"/"+el.bill_date.slice(0,4)
          el.bill_cycle_value = el.bill_cycle.slice(0,4) +"-"+ el.bill_cycle.slice(4,6)
          el.bill_date_value = el.bill_cycle.slice(0,4) +"-"+ el.bill_cycle.slice(4,6) +"-"+ el.bill_date.slice(6,8)
        });
        let lastBillCycle;
        let maxBillCycle = Math.max.apply(Math, billCycles.map((o)=>{ return o['bill_cycle']}));
        if (typeof maxBillCycle == 'number') lastBillCycle = billCycles.find(x=>x.bill_cycle===maxBillCycle.toString()); 
        
        loading.dismiss();
        resolve({
            last_bill_cycle: lastBillCycle,
            bill_cycles : billCycles
          })
      })
      .catch(err=>{
        loading.dismiss();
        reject(err);
      })
    })
  }

  onClickItem(cycle){
      let link = ApiStorageService.resourceServer+"/db/pdf-invoices/"+cycle.bill_cycle;
      if (this.platform.is('ios')) {
        this.inAppBrowser.create(link);
      } else {
        window.open(link, '_system');
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

  // cac ham rieng thuc hien chuc nang he thong nay
  /**
   * Goi API de phat hanh hoa don theo thang
   * @param billCycle 
   */
  callCreateInvoices(billCycle){

    console.log('ky cuoc',billCycle);

    return new Promise((resolve, reject) => {

      let loading = this.loadingCtrl.create({
        content: 'Đang phát hành hóa đơn <br>' 
        + 'Tháng: ' + billCycle.bill_cycle.slice(0,7)
      });
      loading.present();

      this.resource.createInvoices(billCycle)
      .then(result=>{
        if (result&&result.status&&result.data){
          //console.log('data',result.data);
          this.presentAlert({
            ok_text: 'Xong',
            title:'ĐÃ PHÁT HÀNH XONG',
            message:'Tháng: ' + (result.data.bill_cycle?result.data.bill_cycle.slice(4,6)+'/'+result.data.bill_cycle.slice(0,4):'') + '<br>'
                    + 'Ngày phát hành: ' + (result.data.bill_date?result.data.bill_date.slice(6,8)+'/'+result.data.bill_date.slice(4,6)+'/'+result.data.bill_date.slice(0,4):'') + '<br>'
                    + 'Số lượng phát hành: ' + result.data.count + '<br>'
                    + 'Số hóa đơn lần tiếp theo: ' + result.data.invoice_no,
          });
          resolve(result);
        }
        loading.dismiss();
      })
      .catch(err=>{
        loading.dismiss();
        reject(err);
      })
    })
  }

  callbackRebuild = function(res) {
    //console.log('phat hanh',res);
    return new Promise((resolve, reject) => {
      let billCycle = {
        bill_cycle: res.data.bill_cycle.replace(/-/g, '').slice(0,6)
        , bill_date: res.data.bill_date.replace(/-/g, '').slice(0,8)
        , invoice_no: res.data.invoice_no
      }
  
      //console.log('billCycle OUT',billCycle);
      this.presentConfirm({
        cancel_text:'Bỏ qua',
        ok_text: 'Đồng ý',
        title:'Xác nhận phát hành hóa đơn',
        message:'Tháng: ' + billCycle.bill_cycle + '<br>'
                + 'Ngày phát hành: ' + billCycle.bill_date + '<br>'
                + 'Với hóa đơn bắt đầu từ số: ' + billCycle.invoice_no,
        ok:(isOK)=>{
          if (isOK){

            this.callCreateInvoices(billCycle)
            .then(rtrn=>{
              //console.log('Tao xong ky cuoc:',rtrn);
              //tro ve home de xem ky cuoc
              this.getBillCycles()
              .then(result=>{
                resolve({
                  next:"CLOSE" //DISMISS that FORM
                  , next_data: result //RETURN PARAM FOR PARENT
                });
              })
              .catch(err=>reject(err)); 
  
            })
            .catch(err=>{
              reject(err);
            });
          }
        }
      })
    })
  }.bind(this);

  onClickHeaders(func){

    //console.log(cycle);
    if (func==='BUILD'){
      
      let loading = this.loadingCtrl.create({
        content: 'Đang đọc dữ liệu ....'
      });
      loading.present();

      this.pubService.getDynamicForm("assets/data/form-add-billcycle.json")
      .then(data=>{
        loading.dismiss();

        let oldDate = new Date(this.lastBillCycle.bill_cycle_value);
                      oldDate.setMonth(oldDate.getMonth()+1);
        
        data.items.find(x=>x.key==='bill_cycle').value = oldDate.toISOString().slice(0,7);
        data.items.find(x=>x.key==='bill_date').value = new Date().toISOString().slice(0,10);
        data.items.find(x=>x.key==='invoice_no').value = (this.lastBillCycle.invoice_no + 1);

        this.openModal(DynamicFormWebPage,{
            parent: this
            , callback: this.callbackRebuild
            , form: data
          })
      })
      .catch(err=>{
        loading.dismiss();
      })
      
    }

  }

  onClickDetails(slidingItem: ItemSliding, cycle: any, func: string){
    this.closeSwipeOptions(slidingItem);

    if (func==='RE-BUILD'){
      
      console.log('RE-BUILD',cycle);

      let loading = this.loadingCtrl.create({
        content: 'Đang đọc dữ liệu ....'
      });
      loading.present();

      this.pubService.getDynamicForm("assets/data/form-add-billcycle.json")
      .then(data=>{
        loading.dismiss();

        data.items.find(x=>x.key==='bill_cycle').value = cycle.bill_cycle_value;
        data.items.find(x=>x.key==='bill_date').value = cycle.bill_date_value;
        data.items.find(x=>x.key==='invoice_no').value = cycle.invoice_no_min;

        this.openModal(DynamicFormWebPage,{
            parent: this
            , callback: this.callbackRebuild
            , form: data
          })
      })
      .catch(err=>{
        loading.dismiss();
      })
      
    }

    if (func==='PRINT-ONE'){
      
    }

    if (func==='RELOAD'){
      
    }

    if (func==='PRINT-ALL'){
      let link = ApiStorageService.resourceServer+"/db/pdf-invoices/"+cycle.bill_cycle;
      //var target = "_blank"; //mo trong inappbrowser
      //var options = "hidden=no,toolbar=yes,location=yes,presentationstyle=fullscreen,clearcache=yes,clearsessioncache=yes";
      //this.inAppBrowser.create(link,target,options);
      this.inAppBrowser.create(link);
    }
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
