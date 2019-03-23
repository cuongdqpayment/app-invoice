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