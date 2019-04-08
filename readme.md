1. Cài đặt demo cho Iphone:
- Co tai khoan Apple --
- ionic cordova platform add ios --save
- Mở Xcode chọn file .xproject mở ứng dụng và thực hiện 2 thao tác

1.1. Xcode 10: A valid provisioning profile for this executable was not found

1.1.1 "File" > "Project Settings..." and then select "Legacy Build System" from the "Build System" dropdown.
1.1.2 Sign and verify...
1.1.3 build and run --> iphone --> app demo
1.1.4 rebuild and run --> iphone --> app demo

1.2 Xử lý vấn đề Cors trong IOS mới, nó không cho bộ duyệt truy cập các site không có control cors:

1.2.1 *First, open config.xml and add the following properties

<feature name="CDVWKWebViewEngine">
<param name="ios-package" value="CDVWKWebViewEngine" />
</feature>
<preference name="CordovaWebViewEngine" value="CDVWKWebViewEngine" />

1.2.2 *then run the following commands – I hope you are familiar with this commands

ionic cordova plugin remove cordova cordova-plugin-ionic-webview --save
rm -rf platforms/
rm -rf plugins/
ionic cordova build ios

* Notes:
In iOS, there have been two webviews for a few years now, UIWebView and WKWebView. Historically, Ionic apps have used UIWebView, but no longer. Ionic now uses WKWebview by default when building for iOS.

We strongly believe WKWebview is the best option for any app, as it features many improvements over the older, legacy webview (UIWebView)

1.2.3 * SERVER: Trên máy chủ API cần khai báo cho phép truy cập
res.header('Access-Control-Allow-Origin', '*'); //cho phep truy cap 
//IOS When enabling wkwebview, requests to a webserver are from "null" and therefore rejected even with Access-Control-Allow-Origin set to *


2. Cài đặt demo cho Android:
- Cài Android studio code để nó phát hiện được adb --> android device
- Cài Cordova Tools trên Visual Studio Code để debug
- Mở setting trên android device cho phép nhà phát triển
- Nối thiết bị vào máy
- Chạy debug --> thêm cấu hình --> 
- Run Android on device --> xem debug Console chờ load vào máy là xong


# cai dat QR-BAR-CODE-GENERATOR - danh cho web
npm i ngx-qrcode2 ngx-barcode

import { NgxQRCodeModule } from 'ngx-qrcode2';
import { NgxBarcodeModule } from 'ngx-barcode';

imports: [
    ...
    NgxBarcodeModule,
    NgxQRCodeModule,
    ...
  ],
Su dung:
#BAR:
<ngx-barcode [bc-value]="barCode" [bc-display-value]="true"></ngx-barcode>
#QR:
<ngx-qrcode [qrc-value]="qrCode"></ngx-qrcode>

# cai dat QR-BAR-CODE-SCANNER - danh cho app - cordova
#BAR & QR
ionic cordova plugin add phonegap-plugin-barcodescanner
npm install @ionic-native/barcode-scanner@^4.5.3

ionic cordova plugin add cordova-plugin-camera
npm install @ionic-native/camera


Khai trong provider va trang scan version "^4.5.3" moi chay duoc
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

constructor(private barcodeScanner: BarcodeScanner) { }

this.barcodeScanner.scan().then(barcodeData => {
 console.log('Barcode data', barcodeData);
}).catch(err => {
    console.log('Error', err);
}); 

#QR -- error on ios
ionic cordova plugin add cordova-plugin-qrscanner
npm install @ionic-native/qr-scanner

import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
constructor(private qrScanner: QRScanner) { }

// Optionally request the permission early
this.qrScanner.prepare()
  .then((status: QRScannerStatus) => {
     if (status.authorized) {
       // camera permission was granted


       // start scanning
       let scanSub = this.qrScanner.scan().subscribe((text: string) => {
         console.log('Scanned something', text);

         this.qrScanner.hide(); // hide camera preview
         scanSub.unsubscribe(); // stop scanning
       });

     } else if (status.denied) {
       // camera permission was permanently denied
       // you must use QRScanner.openSettings() method to guide the user to the settings page
       // then they can grant the permission from there
     } else {
       // permission was denied, but not permanently. You can ask for permission again at a later time.
     }
  })
  .catch((e: any) => console.log('Error is', e));