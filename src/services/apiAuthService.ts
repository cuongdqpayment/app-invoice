import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiStorageService } from './apiStorageService';

import { RequestInterceptor } from '../interceptors/requestInterceptor';

import 'rxjs/add/operator/map'

import NodeRSA from 'node-rsa';
import jwt from 'jsonwebtoken';

@Injectable()
export class ApiAuthService {

    public authenticationServer = ApiStorageService.authenticationServer;
    public clientKey = new NodeRSA({ b: 512 }, { signingScheme: 'pkcs1-sha256' }); //for decrypte
    public midleKey = new NodeRSA(null, { signingScheme: 'pkcs1-sha256' }); //for test
    public serverKey = new NodeRSA(null, { signingScheme: 'pkcs1-sha256' }); //for crypte
    public publicKey: any;
    public userToken: any;
    public userSetting: any;
    public userInfo: any;


    constructor(private httpClient: HttpClient,
                private apiStorageService: ApiStorageService,
                private reqInterceptor: RequestInterceptor) {
        //key nay de test thu noi bo
        this.midleKey.importKey(this.clientKey.exportKey('public'));
    }

    /**
     * ham nay phai lay sau khi xac thuc token OTP bang dien thoai
     * tranh viec hacker ma hoa du lieu lung tung gui len server
     */
    getServerPublicRSAKey() {
        //console.log('get Public key');
        if (this.publicKey && this.publicKey.public_key) {
            //console.log('Public key from in session');
            return (new Promise((resolve, reject) => {
                try {
                    this.serverKey.importKey(this.publicKey.public_key);
                } catch (err) {
                    reject(err); //bao loi khong import key duoc
                }
                resolve(this.serverKey);
            }));
            
        } else {
            //console.log('get Public key from server');
            return this.httpClient.get(this.authenticationServer + '/key-json')
            .toPromise()
            .then(jsonData => {
                this.publicKey = jsonData;
                    //console.log('Public key: ', jsonData);
                    if (this.publicKey && this.publicKey.public_key) {
                        try {
                            this.serverKey.importKey(this.publicKey.public_key);
                        } catch (err) {
                            throw err;
                        }
                        return this.serverKey;
                    } else {
                        throw new Error('No public_key exists!');
                    }
                })
            ;
        }
    }

    login(formData) {
        this.reqInterceptor.setRequestToken(null); //login nguoi khac
        return this.httpClient.post(this.authenticationServer + '/login', formData)
            .toPromise()
            .then(data => {
                this.userToken = data;
                this.reqInterceptor.setRequestToken(this.userToken.token); //login nguoi khac
                return this.userToken.token;
            });
        }
        
    logout() {

        //xoa bo token luu tru
        this.apiStorageService.deleteToken();

        if (this.userToken && this.userToken.token) {
                //truong hop user co luu tren session thi xoa session di
            this.reqInterceptor.setRequestToken(this.userToken.token); //login nguoi khac
            return this.httpClient.get(this.authenticationServer + '/logout')
                .toPromise()
                .then(data => {
                    //console.log(data);
                    this.userToken = null; //reset token nay
                    this.reqInterceptor.setRequestToken(null);
                    return true; //tra ve nguyen mau data cho noi goi logout xu ly
                })
                .catch(err => {
                    //xem nhu da logout khong cap luu tru
                    //console.log(err);
                    this.reqInterceptor.setRequestToken(null);
                    this.userToken = null; //reset token nay
                    return true; //tra ve nguyen mau data cho noi goi logout xu ly
                });
        } else {
            return (new Promise((resolve, reject) => {
                resolve(true);
            }));

        }
    }

    register(formData) {
        return this.httpClient.post(this.authenticationServer + '/register', formData)
            .toPromise()
            .then(data => {
                console.log(data);
                return true;
            })
            .catch(err=>{
                console.log(err);
                return false;
            });

    }

    editUser(formData) {
        //them token vao truoc khi edit
        this.reqInterceptor.setRequestToken(this.userToken.token);
        return this.httpClient.post(this.authenticationServer + '/edit', formData)
            .toPromise()
            .then(data => {
                console.log(data);
                return true;
            })
            .catch(err=>{
                console.log(err);
                return false;
            });

    }
    //lay thong tin nguoi dung de edit
    getEdit() {
        if (this.userToken && this.userToken.token) {
            //them token vao truoc khi edit
            this.reqInterceptor.setRequestToken(this.userToken.token);
            return this.httpClient.get(this.authenticationServer + '/get-user')
                .toPromise()
                .then(jsonData => {
                    this.userSetting = jsonData;
                    return jsonData;
                });
        } else {
            return (new Promise((resolve, reject) => {
                this.userSetting = null;
                reject({ error: 'No token, please login first' }); //bao loi khong import key duoc
            }));
        }
    }
    
    //get userInfo from token
    getUserInfo() {
        //this.userInfo=null;
        try {
            this.userInfo = jwt.decode(this.userToken.token);
            //console.log(this.userInfo);
            //chuyen doi duong dan image de truy cap anh dai dien
            if (this.userInfo.image
                &&
                this.userInfo.image.toLowerCase()
                &&
                this.userInfo.image.toLowerCase().indexOf('http://') < 0
                &&
                this.userInfo.image.toLowerCase().indexOf('https://') < 0) {
                //chuyen doi duong dan lay tai nguyen tai he thong
                this.userInfo.image = this.authenticationServer
                    + '/get-avatar/'
                    + this.userInfo.image
                    + '?token=' + this.userToken.token;
                //console.log(this.userInfo.image);
            }
        } catch (err) {
            this.userInfo = null;
        }
        return this.userInfo;
    }

    getUserInfoSetting() {
        if (this.userSetting.URL_IMAGE
            &&
            this.userSetting.URL_IMAGE.toLowerCase()
            &&
            this.userSetting.URL_IMAGE.toLowerCase().indexOf('http://') < 0
            &&
            this.userSetting.URL_IMAGE.toLowerCase().indexOf('https://') < 0) {
            //chuyen doi duong dan lay tai nguyen tai he thong
            this.userSetting.URL_IMAGE = this.authenticationServer
                + '/get-avatar/'
                + this.userSetting.URL_IMAGE
                + '?token=' + this.userToken.token;
            //console.log(this.userSetting.URL_IMAGE);
        }
        return this.userSetting;
    }

    /**
     * Thiet lap token tu local xem nhu da login
     * @param token 
     */
    /* pushToken(token){
        //gan token cho user de xem nhu da login
        this.userToken={token:token};
    } */


    /**
     * Ham nay luu lai token cho phien lam viec sau do
     * dong thoi luu xuong dia token da login thanh cong
     * @param token 
     */
    saveToken(token){
        this.apiStorageService.saveToken(token);
        this.userToken={token:token};
    }

    /**
     * truong hop logout hoac 
     * token da het hieu luc, 
     * ta se xoa khoi de khong tu dong login duoc nua
     */
    deleteToken(){
        this.apiStorageService.deleteToken();
        this.userToken=null;
    }

    /**
     * Gui len server kiem tra token co verify thi tra ve token, khong thi khong ghi 
     * @param token 
     */
    authorize(token){
        return this.httpClient.post(this.authenticationServer + '/authorize-token',JSON.stringify({
            token: token
        }))
            .toPromise()
            .then(data => {
                this.userToken={token:token};
                let rtn:any;
                    rtn = data;
                    return rtn; 
            })
    }


    //send sms
    sendSMS(isdn,sms){
       return this.httpClient.post(this.authenticationServer + '/send-sms', JSON.stringify({
            isdn:isdn,
            sms:sms
            }))
            .toPromise()
            .then(data => {
                let rtn:any;
                    rtn = data;
                    return rtn;
            });
    }

    /**
     * yeu cau mot OTP tu phone
     * @param jsonString 
     */
    requestIsdn(jsonString){
        //chuyen len bang form co ma hoa
        return this.httpClient.post(this.authenticationServer + '/request-isdn', jsonString)
             .toPromise()
             .then(data => {
                let rtn:any;
                rtn = data;
                return rtn;
             });
     }


     /**
      * confirm OTP key
      * @param jsonString 
      */
    confirmKey(jsonString){
         //chuyen di bang form co ma hoa
        return this.httpClient.post(this.authenticationServer + '/confirm-key', jsonString)
             .toPromise()
             .then(data => {
                 this.userToken = data;
                 if (this.userToken&&this.userToken.token){
                    this.reqInterceptor.setRequestToken(this.userToken.token); //gan token ap dung cho cac phien tiep theo
                    return this.userToken.token;
                }else{
                    //neu ho nhap so dien thoai nhieu lan sai so spam thi ??
                    throw 'Không đúng máy chủ<br>';
                }
             });
     }

     sendUserInfo(jsonString){
         //gui token + userInfo (pass encrypted) --ghi vao csdl
         //tra ket qua cho user
         return true;
     }

     sendImageBase64(jsonString){
         //gui token + userInfo (pass encrypted) --ghi vao csdl
         //tra ket qua cho user
         return true;
     }


     injectToken(){
        this.reqInterceptor.setRequestToken(this.userToken.token);
     }



     postDynamicForm(url:string, json_data:Object, token?:any){
        //lay token cua phien xac thuc
        this.reqInterceptor.setRequestToken(token&&token.length?token:this.userToken?this.userToken.token:'');
        return this.httpClient.post(url,JSON.stringify(json_data))
                .toPromise()
                .then(data => {
                    let rtn:any;
                    rtn = data;
                    return rtn;
                });
    }

    getDynamicUrl(url:string, token?:any){
        //lay token cua phien xac thuc
        this.reqInterceptor.setRequestToken(token&&token.length?token:this.userToken?this.userToken.token:'');
        return this.httpClient.get(url)
                .toPromise()
                .then(data => {
                    let rtn:any;
                    rtn = data;
                    return rtn;
                });
    }

    postDynamicFormData(url:string, form_data:any, token?:any){
        //lay token cua phien xac thuc
        this.reqInterceptor.setRequestToken(token?token:this.userToken?this.userToken.token:'');
        return this.httpClient.post(url,form_data)
                .toPromise()
                .then(data => {
                    let rtn:any;
                    rtn = data;
                    return rtn;
                });
    }

}