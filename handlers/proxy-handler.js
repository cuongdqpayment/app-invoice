"use strict"

/**
 * proxy-handler:
 *  
 * verifyProxyToken: verifyProxyToken,
    authorizeToken: authorizeToken,
 */

const jwt = require('jsonwebtoken');
const proxy = require('request'); //doi tuong yeu cau proxy truy van POST/GET
const authServer = 'https://c3.mobifone.vn/api'

const tokenHandler = require('../utils/token-handler')

var tokenSession = []; //luu lai session lam viec
//chi verify --> auth 1 lan --> co thoi gian hieu luc va het hieu luc
//khi do chi can verify expires la duoc
const verifyExpire = (req)=>{
    let userInfo = tokenHandler.getInfoFromToken(req.token);
    if (userInfo){
        if (userInfo.exp>(new Date().getTime()/1000)) return true;
    }
    return false;
}

/**
 * ham nay se gan kiem tra verify proxy, neu thanh cong cho next, neu khong se tra loi
 * du lieu dau vao phai req.token --> next()
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const verifyProxyToken = (req, res, next)=>{
    if (req.token){
        new Promise((resolve, reject) => {

            let aliveToken = tokenSession.find(x=>x.token===req.token)

            //console.log('aliveToken',aliveToken)

            if (aliveToken && verifyExpire(req)){
                //console.log('user_info verifyExpire true: ',req.user_info);
                aliveToken.last_time = new Date().getTime();
                aliveToken.status = true;

                resolve({
                    status: true,
                    user_info:aliveToken.user_info
                });

            }else{
                //neu chua xac thuc server
                proxy.post(authServer + '/ext-auth/authorize-token', { json: {token: req.token} } //du lieu parse tu postProcess
                    , (error, res, body) => {
                        if (error) {
                            reject(error);
                        }
                        if (res.statusCode == 200&&body.status&&body.user_info) {
                            //console.log('user_info',body); //tra ve user_info va trang thai =1
                            //chuyen doi body --> luu lai
                            tokenSession.push({
                                create_time: new Date().getTime(),
                                token: req.token,
                                user_info: body.user_info
                            })
                            resolve(body);
                        } else {
                            reject(body);
                        }
                    })
            }

        }).then(tokenData => {
            //console.log('tokenData.status', tokenData.status, tokenData.user_info);
            if (tokenData.status){
                req.user = tokenData.user_info;  
                next();              
            }else{
                res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ message: 'proxy-handler: verifyProxyToken: server status false!', data: data}));
            }
        })
        .catch(err => {
            res.writeHead(403, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(JSON.stringify({ message: 'proxy-handler: verifyProxyToken:  request to authentication server error!', error: err }));
        })
    }else{
        res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ message: 'proxy-handler: verifyProxyToken: no req.json_data'}));
    }
  }

const authorizeToken = (req, res, next) => {
    if (req.user){
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({status:true,message:'token valid',user_info: req.user, token: req.token}));
    }else{
        res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({status:false,message:'token INVALID'}));
    }
}


module.exports = {
    verifyProxyToken: verifyProxyToken,
    authorizeToken: authorizeToken,
};