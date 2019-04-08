import { Component } from '@angular/core';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-qr-bar-scanner',
  templateUrl: 'qr-bar-scanner.html'
})
export class QrBarScannerPage {

  parent:any;
  codeType:any;
  isShowValue:boolean= false;

  scannedData: any = {};

  constructor(
    private scanner: BarcodeScanner
    , private viewCtrl: ViewController
    , private navParams: NavParams
  ) {}

  ngOnInit(){
    
    this.codeType = this.navParams.get("type");
    this.isShowValue = this.navParams.get("visible");
    this.parent = this.navParams.get("parent");

  }

  onClickScan(){
    this.scanCode();
  }

  onClickClose(){
    if (this.parent) this.viewCtrl.dismiss()
  }

  scanCode() {

    this.scanner.scan()
      .then(data => {
        this.scannedData = data;
      })
      .catch(err => {
        console.log('err', err);
      })
  }

}
