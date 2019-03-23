"use strict"

const jwt = require('jsonwebtoken');
const jwtConfig = require('../jwt/jwt-config');
const url = require('url');



/**
 * input: token
 * output: user_info
 * @param {*} token 
 */
var getInfoFromToken = (token)=>{
  let userInfo;
  try{
    userInfo = jwt.decode(token);
  }catch(e){}
  return userInfo; 
}

/**
 * input:  GET/POST
 * return: req.token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
var getToken = (req, res, next)=> {
  let token = req.headers['x-access-token'] || req.headers['authorization'];
   if (!token) token = url.parse(req.url, true, false).query.token;
   if (!token) token = req.json_data?req.json_data.token:''; //lay them tu json_data post
   req.token = req.token?req.token:token; // uu tien token truyen trong json gan truoc do
   if (req.token) {
     req.token = req.token.startsWith('Bearer ')?req.token.slice(7):req.token;      
     next();
   } else {
     res.writeHead(403, { 'Content-Type': 'text/html; charset=utf-8' });
     res.end(JSON.stringify({code:403, message:'token-handler: getToken: Auth token is not supplied or you are unauthorized!'}));
   }
 }

/**
 * 
 * @param {*} req 
 */


 /**
  * req = {user:{username...}} | {json_data:{}} | proxy {user:{},origin} 
  * @param {*} req     biến vào request chứa thông tin tham số xử lý
  * @param {*} expires Thời gian hiệu lực
  * @param {*} isProxy   Tạo token xác thực bất kỳ đâu (cấp cho origin) - authentication server # resource server
  */
var tokenSign = (req,expires,isProxy) => {
  let localTime = new Date().getTime()+7*60*60*1000;
  let secret = jwtConfig.secret + req.clientIp + req.headers["user-agent"] + localTime;

  if (req.user && req.user.username) {
    if (req.origin&&isProxy){
      secret = jwtConfig.secret + localTime;
      console.log('Sign secret for user resource server level 2:', secret);
      return jwt.sign({
        username: req.user.username,
        origin: req.origin, //chung thuc cap cho website nay truy van
        req_device: req.headers["user-agent"], //cap cho user device
        req_ip: req.clientIp, //cap cho user ip nay thoi, neu doi ip se khong xac thuc duoc
        nickname: req.user.nickname?req.user.nickname : undefined,
        image: req.user.image?req.user.image : undefined,
        role: req.user.role?req.user.role:undefined,
        level: 2, //cap do xac thuc
        local_time: localTime
      },
      secret, 
      {
        expiresIn: expires?expires:'24h' // expires in 24 hours
      });
    }else{
      console.log('Sign secret for user device level 1:', secret);
      return jwt.sign({
        username: req.user.username,
        nickname: req.user.nickname?req.user.nickname : undefined,
        image: req.user.image?req.user.image : undefined,
        role: req.user.role?req.user.role:undefined,
        level: 1, //cap do xac thuc
        local_time: localTime
      },
      secret, 
      {
        expiresIn: expires?expires:'24h' // expires in 24 hours
      });
    }
  } else if (req.json_data&&req.json_data.phone&&req.json_data.key) {
    secret += req.json_data.key;
    console.log('Sign secret for phone number level 3:', secret);
    return jwt.sign({
      username: req.json_data.phone,
      req_device: req.headers["user-agent"],
      level: 3, //cap do xac thuc
      local_time: localTime
    },
    secret
      , {
        expiresIn: '1h' // expires in 1 hours
      }
    );
  } else {
    console.log('Sign secret level 4:', secret);
    return jwt.sign({
      req_device: req.headers["user-agent"],
      level: 4, //cap do xac thuc
      local_time: localTime
    },
    secret
      , {
        expiresIn: '1h' // expires in 1 hours
      }
    );
  }
}

/**
 * input: req = {token:'...'}
 * return true or false
 * @param req 
 */

 /**
  * verify token signed with level
  * 
  * @param {*} req 
  */
var tokenVerify = (req) => {

  if (req.token) {
    let token = req.token;
    let userInfo = getInfoFromToken(token);
    //console.log(userInfo);
    let localTime =  userInfo?userInfo.local_time:'';
    let otpKey = req.keyOTP?req.keyOTP:'';
    let level = userInfo?userInfo.level:4;

    var secret =  jwtConfig.secret + req.clientIp + req.headers["user-agent"] + localTime;

    if (level===1){
      secret =  jwtConfig.secret + req.clientIp + req.headers["user-agent"] + localTime;
    }else if (level===2){
      secret = (jwtConfig.secret + localTime);
    }else if (level===3){
      secret += otpKey;
    }else if (level===4){
      secret = (jwtConfig.secret + localTime);
    }

    console.log('Verify secret level '+ (level?level:4) +':',secret);
    return jwt.verify(token
        , secret
        , (err, decoded) => {
          if (err) return false;
          req.user = decoded;
          return true;
        })
  } else {
    return false;
  }
};


module.exports = {
  getInfoFromToken: getInfoFromToken,
  getToken: getToken,
  tokenSign: tokenSign,
  tokenVerify: tokenVerify
};