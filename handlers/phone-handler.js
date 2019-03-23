"use strict"

const url = require('url');
const systempath = require('path');
const mime = require('mime-types');
const fs = require('fs');

const tokenHandler = require('../utils/token-handler');

//su dung csdl admin_user
const db = require('../db/oracle/oracle-admin-service');
//const db = require('../db/sqlite3/sqlite-admin-service');


const NodeRSA = require('node-rsa');
const MidlewareRSA = new NodeRSA(null, { signingScheme: 'pkcs1-sha256' });
var public_key;

//chi chay 1 lan ban dau tao csdl
setTimeout(()=>{
  console.log('Tao bang ban dau')
  db.handler.init(); //khoi tao cac bang du lieu admin va rsa_key
},3000); //doi 3 giay de oracle ket noi


var initKey = () => {
    db.handler.
        createServiceKey(db.service_id)
        .then(serverkey => {
          
          MidlewareRSA.importKey(serverkey.private_key);
          public_key = {
            service_id: serverkey.service_id,
            public_key: serverkey.public_key,
            service_name: serverkey.service_name,
            is_active: serverkey.is_active
          };

          console.log('public_key created:',public_key)

        })
        .catch(err => { 
          console.log('Error create key',err)
        })
  }
  //tra key

  setTimeout(()=>{
    console.log('Tao key service')
    initKey(); //5 giay sau khoi tao public key tra cho nguoi dung
  },5000); //doi 3 giay de oracle ket noi


/**
 * phone-handler: 
 * 
 * 
 *  requestIsdn: requestIsdn, //trả token-otp và OTP cho user qua phone-number
    confirmKey: confirmKey,   //user truyền token và OTP nhận được từ phone -- Trả token-login
    authorizeToken: authorizeToken, //xác thực token theo level được cấp -- kiểm tra xem token này do mình cấp hay không
    getPublickeyJson: getPublickeyJson, //trả public-key cho user mã hóa password hoặc thông tin nhạy cảm của user
 * Biến lưu session của hệ thống (không cần lưu Database) 
 * aliveSession = []
 */

//lưu tất cả các session đã sign, verify bởi hệ thống kể từ khi hệ thống khởi động
var aliveSession = []; 
const isVerifyAlive = true;

/**
 * trả về danh sách session đang quản lý trên server kể từ khi server khởi động
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getAliveSession = (req, res, next) =>{
  let returnSession = [];

  aliveSession.forEach(el=>{
    
    returnSession.push({
      time: el.time,
      last_time: el.last_time,
      user_info: tokenHandler.getInfoFromToken(el.token),
      status: el.status,
      hacker_online: el.hacker_online,
      current_time: new Date().getTime(),
      token:el.token
    })

    //kiem tra session nao het hieu luc thi xoa di

  })

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(returnSession));

}


const getPublickeyJson = (req, res, next) =>{
          if (public_key) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(public_key));
          } else {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(JSON.stringify({message:'No public_key init on server!'}));
          }
  }


  /**
   * khoi tao key random
   * sign
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
const requestIsdn = (req,res,next)=>{
    let test_phone  = '123456789';
    console.log('req.json_data',req.json_data); //da dich duoc json
    
    if (req.json_data&&req.json_data.phone){
        let keyOTP =  Math.random().toString(36).substring(2,8).toUpperCase();
        req.json_data.key = keyOTP;
        req.json_data.sms = 'Mat khau OTP cua ban la: ' + keyOTP
        //console.log('req.json_data new: ',req.json_data); //da dich duoc json
        db.handler.sendSMS(req)
        .then(data=>{ //data la mot string kieu json
          let jsonDBReturn;
          try{ jsonDBReturn = JSON.parse(data);}catch (e){jsonDBReturn = data}
          if ( jsonDBReturn.status == 1 //so dien thoai thuoc VLR Cty3 hoac MNP thanh cong!
            ||
            (jsonDBReturn.status === 0 // hoặc chỉ cho guest test key
            && req.json_data.phone ===test_phone)) { 
              let token = tokenHandler.tokenSign(req);
              
              let jsonReturn = {
                                database_out: {status:jsonDBReturn.status,message:req.json_data.phone ===test_phone?jsonDBReturn.message:''},
                                token: token
                                };
              
              aliveSession.push({
                time: new Date().getTime(),
                token: token
              })

              console.log('data return',aliveSession.length, jsonReturn); //xen log

              res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
              res.end(JSON.stringify(jsonReturn));

          }else{
            //nem loi sang catch sau
            throw 'Số điện thoại phải bật máy tại Mobifone vùng 3 hoặc Chuyển mạng Mobifone giữ nguyên số thành công';
          }
        })
        .catch(err=>{
          res.writeHead(403, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(JSON.stringify({message:'Oracle Error', error: err}));
        });
    }else{
      res.writeHead(403, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(JSON.stringify({message:'No json_data for Request phone!', error: 'No json_data for Request phone!'}));
    }
  }

const confirmKey = (req,res,next)=>{
    //console.log('req.json_data',req.json_data); //da dich duoc json
    if (req.json_data&&req.json_data.key&&req.token){
      
      let session = aliveSession.find(x=>x.token === req.token);
        //neu session co luu thi moi cho phep verify
        console.log('session confirm Key:',session);
        //luu lai session.last_time

        if (session||!isVerifyAlive){
          //console.log(req.json_data);
          req.keyOTP = req.json_data.key; //user nhap vao khi nhan duoc sms
          
          if (tokenHandler.tokenVerify(req)) { //sau khi 
            
            console.log('req.user', req.user); //sau khi verify no decode thanh user chua phone

  
            let tokenConfirmed = tokenHandler.tokenSign(req,'24h',true); 
            //ghi nhan token moi 24h, xac thuc cho server tu xa

            let jsonReturn = {
                              token:tokenConfirmed,
                              status:1,
                              message:'You are verified!'
                            };
            
            //xoa di session da duoc confirmed truoc do (giai phong bo nho session)
            aliveSession.splice(aliveSession.indexOf(session), 1 );

            //ghi moi mot token 24h
            aliveSession.push({
                                time: new Date().getTime(),
                                token: tokenConfirmed
                                })

            console.log('data return',aliveSession.length, jsonReturn); //xen log
  
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(jsonReturn));
  
          }else{
             res.writeHead(403, {'Content-Type': 'application/json; charset=utf-8' });
             res.end(JSON.stringify({message:'your key/token invalid!'}));
          }
        }else{
          res.writeHead(403, {'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({message:'No Session init in Serer!'}));
        }
        
      
    }else{
      res.writeHead(403, {'Content-Type': 'application/json; charset=utf-8' });          
      res.end(JSON.stringify({message:'No json_data for confirm!'}));
    }
  }

const authorizeToken = (req,res,next)=>{
    
    console.log('authorizeToken req.json_data',req.json_data); //da dich duoc json

    if (req.json_data&&req.token){
        
      let session = aliveSession.find(x=>x.token === req.token);
        //neu session co luu thi moi cho phep verify
        console.log('session authorizeToken:',session);
        //luu lai session.last_time
        //neu co thi verify alive ==> neu restart thi mat
        if (session||!isVerifyAlive){
         
            if (tokenHandler.tokenVerify(req)) { 
                
                if (session){
                  session.last_time = new Date().getTime();
                  session.status = true;
                }
              
                res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({
                    status:true,
                    message:'You are verified!',
                    user_info: req.user
                  }))
            }else{

              if (session){
                session.last_time = new Date().getTime();
                session.status = false; //hacker thu session cua minh
                session.hacker_online = req.clientIp;
              }

                res.writeHead(403, {'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({message:'your key/token invalid!'}));
            }
        }else{
          res.writeHead(403, {'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({message:'No Session init in Serer!'}));
        }
        
    }else{
        res.writeHead(403, {'Content-Type': 'application/json; charset=utf-8' });          
        res.end(JSON.stringify({message:'No json_data for confirm!'}));
    }
}



const sendSMS = (req, res, next) =>{
  if (req.json_data&&req.json_data.phone&&req.json_data.sms) {
    db.handler.sendSMS(req)
    .then(data=>{ //data la mot string kieu json
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    })
    .catch(err=>{
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(JSON.stringify({message:'Error for send sms', error: err}));  
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(JSON.stringify({message:'No json_data for send sms!'}));
  }
}


const saveUserAvatar = (req, res, next) =>{
      console.log(req.form_data);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(req.form_data));
    }
    
const saveUserInfo = (req, res, next) =>{
      console.log(req.json_data);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(req.json_data));
}


const getUploadFile = (req, res, next) =>{
  
  let path = decodeURIComponent(url.parse(req.url, true, false).pathname);
  let params = path.substring('/upload-file/'.length);
  
  let fileRead = params.replace('/',systempath.sep);
  let contentType = 'image/jpeg';

  if (mime.lookup(fileRead)) contentType = mime.lookup(fileRead);

  fs.readFile(fileRead, { flag: 'r' }, function (error, data) {
        if (!error) {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(JSON.stringify(error));
        }
  });

}

module.exports = {
    saveUserAvatar: saveUserAvatar,
    saveUserInfo: saveUserInfo,
    sendSMS: sendSMS,
    requestIsdn: requestIsdn,
    confirmKey: confirmKey,
    getAliveSession: getAliveSession,
    authorizeToken: authorizeToken,
    getPublickeyJson: getPublickeyJson,
    getUploadFile:getUploadFile
};