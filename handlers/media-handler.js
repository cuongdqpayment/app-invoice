"use strict"


const fs = require('fs');
const mime = require('mime-types');
const systempath = require('path');

const arrObj = require('../utils/array-object');
const db_service = require('../db/sqlite3/excel-sqlite-service');
const excelFilename = './db/media-setting.xlsx';


/* 
 //1. Tao db - chi chay 1 lan
//du lieu ban dau duoc tao tu manual bang lenh
setTimeout(() => {
    db_service.handler.createDatabase(excelFilename); //ket noi db moi
}, 3000); //doi 1s ket noi db
 */

class ResourceHandler {
    
    getPrivateFile(req, res, next) {
        db_service.handler.db().getRst("select url\
                                        from media_files\
                                        where user = '"+ (req.paramS&&req.paramS.user?req.paramS.user:req.user&&req.user.username?req.user.username:"702418821") + "'\
                                        "+(req.paramS&&req.paramS.func?"and func='" + req.paramS.func+"'":"and func is null")+"\
                                        order by time desc\
                                         LIMIT 1\
                                         OFFSET 0\
                                         ")
        .then(result=>{
            if (result&&result.url){
                req.file_name = result.url;
            }
            next();
        })
        .catch(err=>{
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(JSON.stringify(err));
        })
    }


    getAnyImageFile(req, res, next) {
        
        let fileRead = (req.file_name?req.file_name:"upload_files/noimage.png").replace('/',systempath.sep);
        let contentType = 'image/jpeg';

        if (mime.lookup(fileRead)) contentType = mime.lookup(fileRead);

        fs.readFile(fileRead, { flag: 'r' }, function (error, data) {
                if (!error) {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(data);
                } else {
                    fs.readFile("upload_files/noimage.png".replace('/',systempath.sep), { flag: 'r' }, function (error, data) {
                        if (!error) {
                            res.writeHead(200, { 'Content-Type': contentType });
                            res.end(data);
                        } else {
                            res.writeHead(404, { 'Content-Type': 'text/html' });
                            res.end(JSON.stringify(error));
                        }
                    })
                }
        });
    }

    getMediaFile(req, res, next) {
        let path = req.pathName
        let params = path.substring('/media/db/get-file/'.length);
        
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
    
    
    getMediaList(req, res, next) {
        //doc path hoac param de lay thong tin
        //select csdl, dua ra danh sach file
        //console.log('who',req.user.username);
        //console.log('param limit offset user',req.paramS);
        //bien doi loai file va tra ve duong dan file cho user
        db_service.handler.db().getRsts("select *\
                                         from media_files\
                                         where user = '"+ (req.paramS&&req.paramS.user?req.paramS.user:req.user&&req.user.username?req.user.username:"702418821") + "'\
                                         "+(req.paramS&&req.paramS.func?"and (func="+req.paramS.func+" or func is null)":"")+"\
                                         order by time desc\
                                         LIMIT "+(req.paramS&&req.paramS.limit?req.paramS.limit:10)+"\
                                         OFFSET "+(req.paramS&&req.paramS.offset?req.paramS.offset:0)+"\
                                         ")
        .then(results=>{
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(results
                , (key, value) => {
                    if (value === null) { return undefined; }
                    return value}
                ));
        })
        .catch(err=>{
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(JSON.stringify(err));
        })

    }

    getGroupList(req, res, next) {
        db_service.handler.db().getRsts("select *\
                                        from file_groups\
                                        where user = '"+ (req.paramS&&req.paramS.user?req.paramS.user:req.user&&req.user.username?req.user.username:"702418821") + "'\
                                        order by time desc\
                                        LIMIT "+(req.paramS&&req.paramS.limit?req.paramS.limit:10)+"\
                                        OFFSET "+(req.paramS&&req.paramS.offset?req.paramS.offset:0)+"\
                                        ")
        .then(results=>{
            //lay file chi tiet tra cho nhom
            let detailsPromise = new Promise((resolve,reject)=>{
                
                if (!results||results.length===0) {
                    resolve();
                }

                let countDetails = 0;

                for (let idx=0;idx< results.length;idx++) {
                    
                    db_service.handler.db().getRsts("select *\
                                             from media_files\
                                             where group_id = '"+ results[idx].group_id + "'\
                                             ")
                    .then(files=>{
                        
                        countDetails++; //dem ket qua dat duoc (vi query db cham hon for)

                        results[idx].medias = files;
                        if (countDetails>=results.length){ //so luong ket qua bang so luong bang ghi
                            resolve();
                        }

                    })
                    .catch(err=>{
                        reject(err);
                    })
                }
            })

            detailsPromise.then(()=>{
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(results
                    , (key, value) => {
                        if (value === null) { return undefined; }
                        return value}
                    ));
            })
            .catch(err=>{
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(JSON.stringify(err));
            })
           
        })
        .catch(err=>{
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(JSON.stringify(err));
        })
    }


    postSetFunction(req, res, next) {
        let sqlUpdate = arrObj.convertSqlFromJson(
            "media_files",
            {
            id: req.json_data.id
            ,func:req.json_data.func
            ,user: req.user.username
            ,time: new Date().getTime()
            }
            ,["id"]
            );
        db_service.handler.db().update(sqlUpdate)
        .then(data=>{
            console.log(data);
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({status:1,message:"successful"}));
        })
        .catch(err=>{
            console.log(err);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(JSON.stringify(err));
        })
    }

    postMediaFiles(req, res, next) {
        if (req.form_data && req.user && req.form_data.params && req.form_data.files){
            //luu vao csdl 
            //console.log('***>user:',req.user);
            //console.log('***>form params:',req.form_data.params);

            var count_file = 0;
            var count_max = req.form_data.params.count_file;
            let saveDb = new Promise((resolve,reject)=>{

                //chen group vao truoc
                let groupId = req.form_data.params.group_id?req.form_data.params.group_id: req.user.username +'-'+ new Date().getTime();
                let sqlInsertGroup = arrObj.convertSqlFromJson(
                    "file_groups",
                    {
                    group_id: groupId
                    ,ip: req.clientIp
                    ,title: req.form_data.params.title?req.form_data.params.title:""
                    ,content:  req.form_data.params.content?req.form_data.params.content:""
                    ,device: req.clientDevice
                    ,user: req.user.username
                    ,time: new Date().getTime()
                    }
                    ,["user","time"]
                    );
                
                    db_service.handler.db().insert(sqlInsertGroup)
                    .then(data=>{
                        
                        //console.log('-->data',data);

                        for (let key in req.form_data.files){
                        
                            count_file++;
                            
                            let sqlInsert = arrObj.convertSqlFromJson(
                                "media_files",
                                {
                                group_id: groupId
                                ,url: req.form_data.files[key].url
                                ,file_name: req.form_data.files[key].file_name
                                ,file_type: req.form_data.files[key].file_type
                                ,file_date: req.form_data.params['origin_date_'+key]
                                ,file_size: req.form_data.files[key].file_size
                                ,user: req.user.username
                                ,time:new Date().getTime()
                                }
                                ,["url"]
                                );
     
                            db_service.handler.db().insert(sqlInsert)
                            .then(data=>{
                                //console.log('-->data2',data);
                                if (count_file>=count_max){
                                    resolve(data);
                                }
                            })
                            .catch(err=>{
                                //console.log('-->err2',err);
                                if (err.code==="SQLITE_CONSTRAINT"){
                                    db_service.handler.db().update(sqlInsert)
                                    .then(data=>{
                                        if (count_file>=count_max){
                                            resolve(data);
                                        }
                                    })
                                    .catch(err1=>{
                                        reject(err1);
                                    })
                                }else{
                                    reject(err);
                                }
                            });
                        }
                    })
                    .catch(err=>{
                        //console.log('-->err',err);
                    });

                });
            
            if (count_max>0){
                saveDb.then(data=>{
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify(req.form_data));
                })
                .catch(err=>{
                    res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8'  });
                    res.end(JSON.stringify({error:err,message:"error insert db"}));
                })
            }else{
                res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8'  });
                res.end(JSON.stringify({message:"No file for save!"}));
            }
            
        }else{
            res.writeHead(403, { 'Content-Type': 'text/html' });
            res.end("No form data for upload");
        }
    }
}

module.exports = {
    ResourceHandler: new ResourceHandler()
};