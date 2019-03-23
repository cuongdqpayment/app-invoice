
"use strict"

const router = require('express').Router();

const tokenHandler = require('../utils/token-handler');
const postHandler = require('../utils/post-handler');
const proxyHandler = require('../handlers/proxy-handler');

//gui chuoi json nhan duoc len authen server nhan ket qua, tra lai user
router.post('/authorize-token'
            , postHandler.jsonProcess //lay jsonProcess truong hop khong dung interceptor
            , tokenHandler.getToken
            , proxyHandler.verifyProxyToken
            , proxyHandler.authorizeToken
            );

module.exports = router;