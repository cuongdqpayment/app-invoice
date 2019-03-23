"use strict"

const request = require('request');
const url = require('url');
const systempath = require('path');
const mime = require('mime-types');
const fs = require('fs');


const returnDevice = (req,res,next)=>{
    let yourDeviceInfo = {
        origin: req.origin
        , device: req.headers["user-agent"]
        , ip: req.clientIp
        , method: req.method
        , url: req.url
        , path: req.pathName
        , params: req.paramS
        , ip_info: req.ip_info
    }

  console.log('-->params', req.paramS);
  if (req.paramS.id=='SPEEDTEST'){
    yourDeviceInfo.share_url = {url:"https://c3.mobifone.vn/api/speedtest/post-result", method:"POST"}
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(yourDeviceInfo));
}


const getYourDevice = (req, res, next) =>{
   //req.ipInfo 
   request('https://ipinfo.io/'+req.clientIp+'/json', 
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        req.ip_info = JSON.parse(body);
                    }  
                    next();
        });
}



module.exports = {
    getYourDevice: getYourDevice,
    returnDevice: returnDevice
};