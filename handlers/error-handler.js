//test thu khong khai bao bien bao loi tra ve xu ly duoi
//const url = require('url');

class ErrorHandler {

    test(req,res,next){
        try{
            let path = decodeURIComponent(url.parse(req.url, true, false).pathname);
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>Trang test : ' + req.clientIp + '</h1><br>' + path);
        }catch(e){
            //console.log(e);
            //ham nem loi ve cuoi cung
            throw 'Loi test gui!:' + e;
        }
    }

    errors(err, req, res, next) {
        if (err&&err.code&&err.message){
            res.writeHead(err.code, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('Error ' + err.message);
        }else{
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('Error unkow: ');
        }
    }
  }
  
  module.exports = {
    ErrorHandler: new ErrorHandler() 
  };