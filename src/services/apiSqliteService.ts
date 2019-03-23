import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiSqliteService {

    dbName:string = 'cuongdq-speedtest.db'
    db:any;

    constructor(private httpClient: HttpClient
                , private sqlite: SQLite) {}

    init(){
        return this.sqlite.create({
            name: this.dbName,
            location: 'default'
          }).then((db: SQLiteObject) => {
              console.log('database init OK!',this.dbName);
              this.db = db;
              return db;
          })
          .catch(e => {
            console.log('database error',e)
            throw e;
          });
    }


    /**
     * tra ve db for execute...
     */
    getDb(){
      return this.db;
    }

    /**
   * Ham chuyen doi mot doi tuong json thanh cau lenh sqlJson 
   * su dung de goi lenh db.insert/update/delete/select
   * vi du: 
   * convertSqlFromJson(dual_table,{x:null,y:1},['y'])
   * return : {name:dual_table,cols:[{name:x,value:null},{name:y,value:1}],wheres:[name:y,value:1]}
   * Cau lenh tren su dung de:
   *  select x,y from dual_table where y=1;
   * hoac:
   *  update dual_table x=null, y=1 where y=1;
   * hoac 
   *  delete
   * hoac
   * insert
   * @param {*} tableName 
   * @param {*} obj 
   * @param {*} wheres 
   */
  convertSqlFromJson(tablename, json, idFields){
    let jsonInsert = { name: tablename, cols: [], wheres: [] }
    let whereFields = idFields ? idFields : ['id'];
    for (let key in json) {
        jsonInsert.cols.push({ name: key, value: json[key] });
        if (whereFields.find(x => x === key)) jsonInsert.wheres.push({ name: key, value: json[key] })
    }
    return jsonInsert;
  }
  
  /**
   * 
   * @param {*} table 
   * var table ={
   *              name: 'LOGIN',
   *              cols: [
   *                      {
   *                        name: 'ID',
   *                        type: dataType.integer,
   *                        option_key: 'PRIMARY KEY AUTOINCREMENT',
   *                        description: 'Key duy nhat quan ly'
   *                        }
   *                      ]
   *            }
   */
  createTable(table) {
    let sql = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (';
    let i = 0;
    for (var col of table.cols) {
      if (i++ == 0) {
        sql += col.name + ' ' + col.type + ' ' + col.option_key;
      } else {
        sql += ', ' + col.name + ' ' + col.type + ' ' + col.option_key;
      }
    }
    sql += ')';
    return this.runSql(sql);
  }


  //insert
  /**
   * 
   * @param {*} insertTable 
   * var insertTable={
   *                  name:'tablename',
   *                  cols:[{
   *                        name:'ID',
   *                        value:'1'
   *                        }]
   *                  }
   * 
   */
  insert(insertTable) {
    
    let sql = 'INSERT INTO ' + insertTable.name
      + ' ('
    let i = 0;
    let sqlNames='';
    let sqlValues='';
    let params = [];
    for (let col of insertTable.cols) {
      if (col.value!=undefined&&col.value!=null){
        params.push(col.value);
        if (i++ == 0) {
          sqlNames += col.name;
          sqlValues += '?';
        } else {
          sqlNames += ', ' + col.name;
          sqlValues += ', ?';
        }
      }
    }

    sql += sqlNames + ') VALUES (';
    sql += sqlValues + ')';

    return this.runSql(sql, params);
  }

  //update 
  /**
   * 
   * @param {*} updateTable
   *  var updateTable={
   *                  name:'tablename',
   *                  cols:[{
   *                        name:'ID',
   *                        value:'1'
   *                        }]
   *                  wheres:[{
   *                         name:'ID',
   *                         value:'1'
   *                         }]
   *                  }
   */
  update(updateTable) {
    let sql = 'UPDATE ' + updateTable.name + ' SET ';
   
    let i = 0;
    let params = [];
    for (let col of updateTable.cols) {
      if (col.value!=undefined&&col.value!=null){
        //neu gia tri khong phai undefined moi duoc thuc thi
        params.push(col.value);
        if (i++ == 0) {
          sql += col.name + '= ?';
        } else {
          sql += ', ' + col.name + '= ?';
        }
      }
    }

    i = 0;
    for (let col of updateTable.wheres) {
      if (col.value!=undefined&&col.value!=null){
        params.push(col.value);
        if (i++ == 0) {
          sql += ' WHERE ' + col.name + '= ?';
        } else {
          sql += ' AND ' + col.name + '= ?';
        }
      }else{
        sql += ' WHERE 1=2'; //menh de where sai thi khong cho update Bao toan du lieu
      }
    }
    return this.runSql(sql, params)
  }

  //delete
  /**
   * Ham xoa bang ghi
   * @param {*} id 
   */
  delete(deleteTable) {
    let sql = 'DELETE FROM ' + deleteTable.name;
    let i = 0;
    let params = [];
    for (let col of deleteTable.wheres) {
      if (col.value!=undefined&&col.value!=null){
        params.push(col.value);
        if (i++ == 0) {
          sql += ' WHERE ' + col.name + '= ?';
        } else {
          sql += ' AND ' + col.name + '= ?';
        }
      }else{
        sql += ' WHERE 1=2'; //dam bao khong bi xoa toan bo so lieu khi khai bao sai
      }
    }
    return this.runSql(sql, params)
  }

  //
  /**
   *lenh select, update, delete su dung keu json 
   * @param {*} selectTable 
   */
  select(selectTable) {
    let sql = 'SELECT * FROM ' + selectTable.name;
    let i = 0;
    let params = [];
    let sqlNames='';
    for (let col of selectTable.cols) {
        if (i++ == 0) {
          sqlNames += col.name;
        } else {
          sqlNames += ', ' + col.name;
        }
    }
    sql = 'SELECT '+sqlNames+' FROM ' + selectTable.name;
    i = 0;
    if (selectTable.wheres){
      for (let col of selectTable.wheres) {
        if (col.value!=undefined&&col.value!=null){
          params.push(col.value);
          if (i++ == 0) {
            sql += ' WHERE ' + col.name + '= ?';
          } else {
            sql += ' AND ' + col.name + '= ?';
          }
        }
      }
    }
    //console.log(sql);
    //console.log(params);
    return this.getRsts(sql, params)
  }
  //
  /**
   *lenh select, update, delete su dung keu json 
   * @param {*} selectTable 
   */
  selectAll(selectTable) {
    let sql = 'SELECT * FROM ' + selectTable.name;
    let i = 0;
    let params = [];
    let sqlNames='';
    for (let col of selectTable.cols) {
        if (i++ == 0) {
          sqlNames += col.name;
        } else {
          sqlNames += ', ' + col.name;
        }
    }
    sql = 'SELECT '+sqlNames+' FROM ' + selectTable.name;
    i = 0;
    if (selectTable.wheres){
      for (let col of selectTable.wheres) {
        if (col.value!=undefined&&col.value!=null){
          params.push(col.value);
          if (i++ == 0) {
            sql += ' WHERE ' + col.name + '= ?';
          } else {
            sql += ' AND ' + col.name + '= ?';
          }
        }
      }
    }

    if (selectTable.order_by){
      sql += ' ORDER BY ' + selectTable.order_by;
    }
    //console.log(sql);
    //console.log(params);
    return this.getRsts(sql, params)
  }
  //lay 1 bang ghi dau tien cua select
  /**
   * lay 1 bang ghi
   * @param {*} sql 
   * @param {*} params 
   */
  getRst(sql, params = []) {
    return this.db.executeSql(sql, params);
  }

  /**
   * Lay tat ca cac bang ghi
   * @param {*} sql 
   * @param {*} params 
   */
  getRsts(sql, params = []) {
    return this.db.executeSql(sql, params);
  }

  //cac ham va thu tuc duoc viet duoi nay
  /**
   * Ham thuc thi lenh sql va cac tham so
   * @param {*} sql 
   * @param {*} params 
   */
  runSql(sql, params = []) {  //Hàm do ta tự đặt tên gồm 2 tham số truyền vào.
    
    console.log('sql save',sql);

    if (this.db) return this.db.executeSql(sql, params);
    return new Promise((resolve,reject)=>{
        reject('Database not Open!');
    })
  }



}