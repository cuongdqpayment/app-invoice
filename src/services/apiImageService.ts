
import { Injectable } from '@angular/core';
import * as exif from 'exif-js';

/**
 * ham base64 ma hoa filename de truyen du lieu file khong bi unicode...
 */
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=0,c1=0,c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);let c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}


const orientation_standard = {
    1:0,
    3:180,
    6:90,
    8:270
}

@Injectable()
export class ApiImageService {

    constructor() { }
    
    /**
     * ham nay chuyen doi mot ten file unicode thanh file duoc ma hoa
     * @param filename 
     */
    encodeFilename(filename:string){
        if (filename.lastIndexOf('.')>0){
            return Base64.encode(filename.slice(0,filename.lastIndexOf('.'))) + '.' + filename.replace(/^.*\./, '')
        } else {
            return Base64.encode(filename)
        }
    }

    /**
     * chuyen doi anh tu url sang base64 anh nho hon
     * @param url 
     * @param newSize 
     */
    createBase64Image(url:any,newSize:number){
        return new Promise((resolve, reject) => {
            try {
                let canvas = document.createElement('canvas');
                let context = canvas.getContext('2d');
                let img = document.createElement('img');
                let maxW = newSize;
                let maxH = newSize;
                img.crossOrigin="anonymous"; //quan trong de load image from url
                img.src = url;
                
                img.onload = () => {
                    let iw = img.width;
                    let ih = img.height;
                    let scale = Math.min((maxW / iw), (maxH / ih));
                    let iwScaled = (scale<=0||scale>1)?iw: iw * scale;
                    let ihScaled = (scale<=0||scale>1)?ih: ih * scale;
                    //giam kich thuoc
                    canvas.width = iwScaled;
                    canvas.height = ihScaled;
                    context.drawImage(img, 0, 0, iwScaled, ihScaled);
                    
                    resolve(canvas.toDataURL())
                }
            }catch(err){
                reject(err);
            }
        })
    }

    //dua vao doi tuong file image
    //tra ve doi tuong file image co kich co nho hon
    /**
     * ham nay thuc hien giam kich co anh de tiet kiem dung luong truyen
     * 
     * @param filename 
     * @param file 
     * @param newSize 
     */
    resizeImage(filename: string, file: any, newSize: number) {
        return new Promise((resolve, reject) => {

            if (file){

                let allMetaData;
                let originOrientation;
                exif.getData(file, function () {
                    allMetaData = exif.getAllTags(this);
                    originOrientation = allMetaData.Orientation;
                    //console.log("get Tags Orientation",allMetaData);
                });


                try {
                    let canvas = document.createElement('canvas');
                    let context = canvas.getContext('2d');
                    let img = document.createElement('img');
                    let maxW = newSize;
                    let maxH = newSize;
                    img.src = URL.createObjectURL(file);
                    
                    img.onload = () => {
                        let iw = img.width;
                        let ih = img.height;
                        let scale = Math.min((maxW / iw), (maxH / ih));
                        let iwScaled = (scale<=0||scale>1)?iw: iw * scale;
                        let ihScaled = (scale<=0||scale>1)?ih: ih * scale;
                        
                        //giam kich thuoc
                        canvas.width = iwScaled;
                        canvas.height = ihScaled;
                        context.drawImage(img, 0, 0, iwScaled, ihScaled);
                        
                        //quay
                        let imageNew = document.createElement('img');
                        imageNew.src = canvas.toDataURL();

                        imageNew.onload = () => {
                            
                            if (originOrientation>2&&originOrientation<=4){
                                //console.log('rotate 180');
                                canvas.width = imageNew.width;
                                canvas.height = imageNew.height;
                                context.rotate(180 * Math.PI / 180);
                                context.drawImage(imageNew, -imageNew.width, -imageNew.height);
                                
                            } else if (originOrientation>4&&originOrientation<=7){
                                //rotate 90
                                //console.log('rotate 90');
                                canvas.width = imageNew.height;
                                canvas.height = imageNew.width;
                                context.rotate(90 * Math.PI / 180);
                                context.drawImage(imageNew, 0 , -imageNew.height);
                                
                            } else if (originOrientation>7&&originOrientation<=9){
                                //rotate 270
                                //console.log('rotate 270');
                                canvas.width = imageNew.height;
                                canvas.height = imageNew.width;
                                context.rotate(270 * Math.PI / 180);
                                context.drawImage(imageNew, -imageNew.width, 0);
    
                            }
                            
                            canvas.toBlob((blob) => {
                                let reader = new FileReader();
                                reader.readAsArrayBuffer(blob);
                                reader.onload = () => { 
                                    let newFile = new Blob([reader.result], { type: 'image/jpeg' });
                                    resolve({
                                        image: canvas.toDataURL(), //base64 for view and json post
                                        file: (newSize===0?file:newFile) //formData post size=0 get Origin
                                        , filename: this.encodeFilename(filename)
                                        ,h1: this.encodeFilename(filename)
                                        ,p: " ***Kích cỡ cũ: " + file.size 
                                         + "(" + img.width + "x" + img.height + ")"
                                         + " * Kiểu file cũ: " + file.type 
                                         + " * Hướng ảnh chụp: "  + orientation_standard[(originOrientation?originOrientation:1)]
                                         + "(" + (originOrientation?"("+ originOrientation +")":"1") +")"
                                         + " ***Kích cỡ mới: BIN=" + newFile.size 
                                         + "(" + canvas.width + "x" + canvas.height + ") Base64="+ canvas.toDataURL().length+""
                                         + " * Kiểu file mới: " + newFile.type 
                                         + " ***Các tham số tạo ảnh: " 
                                         + (allMetaData&&allMetaData.Make?" * Hãng sx máy ảnh: "+allMetaData.Make:"")
                                         + (allMetaData&&allMetaData.Make?" * Đời máy ảnh: "+allMetaData.Model:"")
                                         + (allMetaData&&allMetaData.Software?" * Phần mềm: "+allMetaData.Software:"")
                                         + (allMetaData&&allMetaData.DateTime?" * Ngày giờ: "+allMetaData.DateTime:"")
                                         + (allMetaData&&allMetaData.DateTimeOriginal?" * Ngày giờ gốc: "+allMetaData.DateTimeOriginal:"")
                                         + (allMetaData&&allMetaData.DateTimeDigitized?" * Ngày giờ số hóa: " + allMetaData.DateTimeDigitized:"")
                                         + (allMetaData&&allMetaData.GPSLatitude?" * Vĩ Độ: " + allMetaData.GPSLatitude + allMetaData.GPSLatitudeRef:"")
                                         + (allMetaData&&allMetaData.GPSLongitude?" * Kinh Độ: " + allMetaData.GPSLongitude + allMetaData.GPSLongitudeRef:"")
                                         + (allMetaData&&allMetaData.GPSDateStamp?" * Ngày giờ tọa độ: " + allMetaData.GPSDateStamp + allMetaData.GPSTimeStamp:"")

                                         ,h3:(file.lastModified?new Date(file.lastModified).toISOString():file.lastModifiedDate)
                                         ,note: JSON.stringify(allMetaData)
                                        ,last_modified: file.lastModified?file.lastModified:file.lastModifiedDate.getTime()
                                        ,subtitle: (file.lastModified?new Date(file.lastModified).toLocaleDateString():file.lastModifiedDate) + (originOrientation?"("+ originOrientation +")":"") 
                                        ,width: canvas.width //cho biet anh nam doc hay nam ngang
                                        ,height: canvas.height 
                                        ,orientation_old: originOrientation
                                        ,size_old: file.size
                                        ,type_old: file.type
                                        ,size: newFile.size
                                        ,type: newFile.type
                                    });
                                }
                            });
                        }
                        
                    }
                } catch (err) { reject(err);}
            }else{
                reject("No file!");
            }

        });
    }

    noResizeImage(filename: string, file: any) {
        return new Promise((resolve, reject) => {

            if (file){

                let allMetaData;
                let originOrientation;
                exif.getData(file, function () {
                    allMetaData = exif.getAllTags(this);
                    originOrientation = allMetaData.Orientation;
                });


                try {
                    let canvas = document.createElement('canvas');
                    let context = canvas.getContext('2d');
                    let img = document.createElement('img');
                    img.src = URL.createObjectURL(file);
                    
                    img.onload = () => {
                        canvas.width = img.width;
                        canvas.height = img.height;
                        context.drawImage(img, 0, 0, img.width, img.height);
                        
                        //quay
                        let imageNew = document.createElement('img');
                        imageNew.src = canvas.toDataURL();

                        imageNew.onload = () => {
                            
                            if (originOrientation>2&&originOrientation<=4){
                                //console.log('rotate 180');
                                canvas.width = imageNew.width;
                                canvas.height = imageNew.height;
                                context.rotate(180 * Math.PI / 180);
                                context.drawImage(imageNew, -imageNew.width, -imageNew.height);
                                
                            } else if (originOrientation>4&&originOrientation<=7){
                                //rotate 90
                                //console.log('rotate 90');
                                canvas.width = imageNew.height;
                                canvas.height = imageNew.width;
                                context.rotate(90 * Math.PI / 180);
                                context.drawImage(imageNew, 0 , -imageNew.height);
                                
                            } else if (originOrientation>7&&originOrientation<=9){
                                //rotate 270
                                //console.log('rotate 270');
                                canvas.width = imageNew.height;
                                canvas.height = imageNew.width;
                                context.rotate(270 * Math.PI / 180);
                                context.drawImage(imageNew, -imageNew.width, 0);
    
                            }
                            
                            canvas.toBlob((blob) => {
                                let reader = new FileReader();
                                reader.readAsArrayBuffer(blob);
                                reader.onload = () => { 
                                    let newFile = new Blob([reader.result], { type: 'image/jpeg' });
                                    resolve({
                                        image: canvas.toDataURL() //base64 for view and json post
                                        , file: newFile //formData post size=0 get Origin
                                        , filename: this.encodeFilename(filename)
                                        , h1: this.encodeFilename(filename)
                                        , p: " ***Kích cỡ cũ: " + file.size 
                                         + "(" + img.width + "x" + img.height + ")"
                                         + " * Kiểu file cũ: " + file.type 
                                         + " * Hướng ảnh chụp: "  + orientation_standard[(originOrientation?originOrientation:1)]
                                         + "(" + (originOrientation?"("+ originOrientation +")":"1") +")"
                                         + " ***Kích cỡ mới: BIN=" + newFile.size 
                                         + "(" + canvas.width + "x" + canvas.height + ") Base64="+ canvas.toDataURL().length+""
                                         + " * Kiểu file mới: " + newFile.type 
                                         + " ***Các tham số tạo ảnh: " 
                                         + (allMetaData&&allMetaData.Make?" * Hãng sx máy ảnh: "+allMetaData.Make:"")
                                         + (allMetaData&&allMetaData.Make?" * Đời máy ảnh: "+allMetaData.Model:"")
                                         + (allMetaData&&allMetaData.Software?" * Phần mềm: "+allMetaData.Software:"")
                                         + (allMetaData&&allMetaData.DateTime?" * Ngày giờ: "+allMetaData.DateTime:"")
                                         + (allMetaData&&allMetaData.DateTimeOriginal?" * Ngày giờ gốc: "+allMetaData.DateTimeOriginal:"")
                                         + (allMetaData&&allMetaData.DateTimeDigitized?" * Ngày giờ số hóa: " + allMetaData.DateTimeDigitized:"")
                                         + (allMetaData&&allMetaData.GPSLatitude?" * Vĩ Độ: " + allMetaData.GPSLatitude + allMetaData.GPSLatitudeRef:"")
                                         + (allMetaData&&allMetaData.GPSLongitude?" * Kinh Độ: " + allMetaData.GPSLongitude + allMetaData.GPSLongitudeRef:"")
                                         + (allMetaData&&allMetaData.GPSDateStamp?" * Ngày giờ tọa độ: " + allMetaData.GPSDateStamp + allMetaData.GPSTimeStamp:"")

                                         ,h3:(file.lastModified?new Date(file.lastModified).toISOString():file.lastModifiedDate)
                                         ,note: JSON.stringify(allMetaData)
                                        ,last_modified: file.lastModified?file.lastModified:file.lastModifiedDate.getTime()
                                        ,subtitle: (file.lastModified?new Date(file.lastModified).toLocaleDateString():file.lastModifiedDate) + (originOrientation?"("+ originOrientation +")":"") 
                                        ,width: canvas.width //cho biet anh nam doc hay nam ngang
                                        ,height: canvas.height 
                                        ,orientation_old: originOrientation
                                        ,size_old: file.size
                                        ,type_old: file.type
                                        ,size: newFile.size
                                        ,type: newFile.type
                                    });
                                }
                            });
                        }
                        
                    }
                } catch (err) { reject(err);}
            }else{
                reject("No file!");
            }

        });
    }

}