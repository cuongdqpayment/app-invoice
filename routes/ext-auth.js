const router = require('express').Router();

const postHandler = require('../utils/post-handler');
const phoneHandler = require('../handlers/phone-handler');
const tokenHandler = require('../utils/token-handler');


//cap key khi co token xac thuc bang isdn
router.get('/key-json', phoneHandler.getPublickeyJson);

//gui len so thue bao --> tra ve token temp -> key --> 1h 
router.post('/request-isdn', postHandler.jsonProcess
                           , phoneHandler.requestIsdn);

//gui len so thue bao --> tra ve token temp -> key --> 1h 
router.post('/send-sms', postHandler.jsonProcess
                       //, tokenHandler.getToken  //tiền xử lý token
                       , phoneHandler.sendSMS);

router.post('/save-user-info', postHandler.jsonProcess
                       //, tokenHandler.getToken  //tiền xử lý token
                       , phoneHandler.saveUserInfo);

router.post('/save-user-avatar'
                      //, tokenHandler.getToken  //tiền xử lý token
                        , postHandler.formProcess
                        , phoneHandler.saveUserAvatar);

//gui len token temp, key xac thuc -- tra ve token 24h
router.post('/confirm-key', postHandler.jsonProcess
                          , tokenHandler.getToken  //tiền xử lý token
                          , phoneHandler.confirmKey);

//xac thuc xem token do co dung la may chu nay cap khong?, tra ve true or false thoi
//chuyen doi data --> req.token (khong chua bear)
router.post('/authorize-token', postHandler.jsonProcess
                              , tokenHandler.getToken  //tiền xử lý token
                              , phoneHandler.authorizeToken);

//lay anh avatar tu may chu nay
router.get('/upload-file/*'
                        //, tokenHandler.getToken  //tiền xử lý token
                        , phoneHandler.getUploadFile);

//chi co quyen admin moi truy van alive-session
router.get('/alive-session'
                           //, tokenHandler.getToken  //tiền xử lý token
                           , phoneHandler.getAliveSession);

module.exports = router;