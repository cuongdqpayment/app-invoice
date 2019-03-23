
/**
 * Dich vu nay khoi tao mot Database
 * thong qua mot file excel thiet ke csdl
 * ./db/admin-setting.xlsx
 * tables={table_name, field_name, description, data_type, options, order_1}
 * Là nơi chứa định nghĩa các tên bảng (thiết kế chiều dọc)
 * mỗi sheet chứa các cột là (field_name - INPIVOT từ tables sang)
 * Mỗi dòng trong sheet chứa dữ liệu tương ứng cần khởi tạo csdl
 * *** CÁCH SỬ DỤNG ***
 * import hoặc require file này vào thành một biến db_service
 * db_service.db (là DAO sử dụng create table/insert/update/delete/select/getRst/getRsts)
 * db_service.handler (để khởi tạo môt csdl mới 
 * : init(dbFilename) //khởi tạo một db mới, đợi thời gian rồi mới truy vấn được
 * : createDatabase(excelFilename,dbFilename) //tạo các bảng dữ liệu lúc đầu
 * 
 */

// dich vu tao csdl hoa don ban dau
// doc excel, tao db, tao table
const fs = require('fs');
const SQLiteDAO = require('./sqlite-dao');

const config = require('./sqlite-config');
const xlsxtojson1st = require("xlsx-to-json-lc");
const excelToJsonAll = require('convert-excel-to-json');
const dbFile = config.database_name;


// = new SQLiteDAO(dbFile); //mat dinh la khoi tao db moi nay
var db = new SQLiteDAO(dbFile); 
//chua khoi tao, chi khoi tao bang init
//tao bang csdl tu excel config

class HandleDatabase {

    db(){
        return db; //tra ve database duoc khoi tao
    }

    init(dbFileInput){
        let databaseFile = dbFileInput?dbFileInput:dbFile;
        db = new SQLiteDAO(databaseFile); //khoi tao database session file moi
        //console.log('db',db);
    }

    /**
     * su dung de tao lai database ban dau
     * @param {*} excelFileInput 
     * @param {*} dbFileInput 
     */
    createDatabase(excelFileInput,dbFileInput){

        let settingFile = excelFileInput;
        let databaseFile = dbFileInput?dbFileInput:dbFile;
        
        //this.init(databaseFile);

        setTimeout(() => {
            if (fs.existsSync(settingFile)&&fs.existsSync(databaseFile)) {
                this.initTable(settingFile);
                console.log('Database '+ databaseFile + ' ready!');
            }else{
                throw 'No Database Setting xlsx and Database Sqlite'
            }
        }, 1000); //doi 1 giay de ket noi database roi moi tao bang
    }

    
    //khoi tao cac bang luu so lieu
    initTable(excelFileInput){
        //doc excel
        try {
            let settingFile = excelFileInput;
            xlsxtojson1st({
                input: settingFile,
                output: null, //since we don't need output.json
                lowerCaseHeaders:true
            }, (err,results)=>{
                if(err) {
                    console.log(err);
                } 
                //console.log('result :',results);
                let distinct_table_name =[];
                results.forEach(el => {
                    if (!distinct_table_name.find(x=>x==el.table_name)) distinct_table_name.push(el.table_name)
                });

                //console.log(distinct_table_name)
                
                distinct_table_name.forEach(el=>{
                    let table = results.filter(x=>x.table_name==el);
                    //console.log(table);
                    if (table){
                        let tableJson={};
                        tableJson.name = el;
                        tableJson.cols = [];
                        table.forEach(e=>{
                            let col = {};
                            col.name = e.field_name;
                            col.type = e.data_type;
                            col.option_key = e.options;
                            col.description = e.description;
                            tableJson.cols.push(col);
                        })
                        //console.log(tableJson);
                        db.createTable(tableJson)
                        .then(data=>{
                            console.log(data);
                        })
                        .catch(err=>{
                            console.log(err);
                        })
                    }
                })
                //cho tao bang xong moi doc du lieu
                setTimeout(()=>{
                    console.log('table created: ',distinct_table_name)
                    this.initData(distinct_table_name, settingFile);
                },1000);

            });
        } catch (e){
            console.log("Corupted excel file",e);
        }
    } 
    
    initData(tables,excelFileInput){
        try{
            let settingFile = excelFileInput;
            let results = excelToJsonAll({
                sourceFile: settingFile
            });

            tables.forEach(tablename=>{
                let sheet = results[tablename];
                if (sheet!=undefined){
                    console.log('sheet-tablename insert db: ',tablename);
                    //chuyen doi kieu doc dong 1 la header
                    let header=sheet[0];
                    let jsonOut = [];
                    for (let i=1;i<sheet.length;i++){
                        let row = {};
                        for (let col in header){
                            if (sheet[i][col]!=undefined){
                                Object.defineProperty(row, header[col], { //ten thuoc tinh
                                    value: (tablename=='customers'&&header[col]=='start_date')?new Date().getTime():sheet[i][col], //gia tri cua thuoc tinh
                                    writable: false, //khong cho phep sua du lieu sau khi gan gia tri vao
                                    enumerable: true, //cho phep gan thanh thuoc tinh truy van sau khi hoan thanh
                                    //configurable: false default
                                });
                            }
                        }
                        jsonOut.push(row);
                    }
                    //thuc hien insert data vao table da tao
                    for (let i=0;i<jsonOut.length;i++){
                        let row = jsonOut[i];
                        let jsonInsert={ name:tablename,cols:[]}
                        for (let key in row){
                            let col = {name:key,value:row[key]};
                            jsonInsert.cols.push(col);
                        }
                        //`console.log(jsonInsert);
                        db.insert(jsonInsert)
                        .then(data=>{
                            //console.log(data)
                        })
                        .catch(err=>{
                            //console.log(err);
                        })
                    }  
                }
            })

        }catch(e){
            console.log("Corupted excel file",e);
        }
    }
}

module.exports = {
    handler: new HandleDatabase()
};