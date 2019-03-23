"use strict"

/**
 * array-object - cuong.dq
 * version 1.3
 * 05/02/2019
 */

 /**
  * Hàm tự thêm vào đối tượng cho trước một giá trị
  * @param {*} obj ex: {}
  * @param {*} key ex: new_key
  * @param {*} value ex: 1
  * return {new_key:1}
  */
const createObjectKey = (obj,key,value)=>{
    Object.defineProperty(obj, key, {value: value, writable: false, enumerable: true, configurable: false});
    return obj;
} 

/**
 * Hàm chuyển đổi các key chữ hoa sang chữ thường (oracle => sqlite phù hợp)
 * @param {*} obj 
 */
const ConvertKeysToLowerCase= (obj) =>{
    var output = {};
    for (let i in obj) {
        if (Object.prototype.toString.apply(obj[i]) === '[object Object]') {
           output[i.toLowerCase()] = ConvertKeysToLowerCase(obj[i]);
        }else if(Object.prototype.toString.apply(obj[i]) === '[object Array]'){
            output[i.toLowerCase()]=[];
             output[i.toLowerCase()].push(ConvertKeysToLowerCase(obj[i][0]));
        } else {
            output[i.toLowerCase()] = obj[i];
        }
    }
    return output;
};


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
  const convertSqlFromJson = (tablename, json, idWheres)=>{
    let jsonInsert = { name: tablename, cols: [], wheres: [] }
    let whereFields = idWheres ? idWheres : ['id'];
    for (let key in json) {
        jsonInsert.cols.push({ name: key, value: json[key] });
        if (whereFields.find(x => x === key)) jsonInsert.wheres.push({ name: key, value: json[key] })
    }
    return jsonInsert;
  }

/**
 * Tao cay quan ly nhu oracle
 * No se tu dong tao ra mang
 * $level, $isleaf, $children 
 * @param {*} arrIn 
 * @param {*} option 
 * @param {*} level 
 */
const createTree = (arrIn,option,level)=>{
    var myLevl = level?level:0;
    var myOption = option?option:{id:'id',parentId:'parentId',startWith:null}

    var roots = arrIn.filter(x=>x[option.parentId]!=x[option.id]&&x[option.parentId]==option.startWith);
    if (roots.length>0){
        myLevl++;
        roots.forEach(el => {
            el.$level= myLevl;
            el.$children= arrIn.filter(x=>x[option.parentId]!=x[option.id]&&x[option.parentId]==el[option.id]);
            if (el.$children.length>0){
                el.$children.forEach(ch=>{
                    ch.$level = myLevl + 1;
                    myOption.startWith = ch[option.id];
                    ch.$children=createTree(arrIn,myOption,ch.$level)
                })
            }else{
                el.$isleaf=1;
                el.$children=undefined;
            }
        });
        return roots;
    }else {
        arrIn.forEach(el => {
            el.$level= myLevl;
            el.$isleaf=1;
        });
        return arrIn //khong tao duoc cay vi khong tim thay
    }
}

/**
 * clone đối tượng thành đối tượng mới (sử dụng để gán đối tượng mới)
 * @param {*} obj 
 */
const clone =(obj) => {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}


const isEquikeylent= (a,b, isSameKey, isSameValue) =>{ //la giong nhau cau truc hoan toan isSame
    let aProps = Object.getOwnPropertyNames(a);
    let bProps = Object.getOwnPropertyNames(b);
    if ((isSameKey||isSameValue)&&aProps.length !== bProps.length)  return false;
    for (let i = 0; i < aProps.length; i++) if (isSameValue&&a[aProps[i]] !== b[aProps[i]]) return false;
    for (let i = 0; i < aProps.length; i++) if (bProps.find(x=>x===aProps[i]) === undefined) return false;
    return true;
}

//const colxrow = {col:0,row:0,width:100,align:'right',color:'red'}; //co the thay doi mat na toa do diem nay them thuoc tinh
const getMatrix = (maskMatrix, data, point)=>{
    var colxrow = point?point:{col:0,row:0};
    var matrix = [];
    var PrintMatrix = (objPrintMatrix, dataObject)=>{
        for (let key of Object.keys(objPrintMatrix)){
            if (Array.isArray(objPrintMatrix[key])){
                objPrintMatrix[key].forEach((x,idx)=>{
                    if (isEquikeylent(colxrow,x)){
                        x.value = dataObject[key][idx];
                        if (x.value!==undefined&&x.value!==null&&x.value!=='')matrix.push(clone(x));
                    }else{
                        if (Array.isArray(x)){
                            console.log('ARRAY KHONG XU LY: ', key , idx , x);
                        }else{
                            if (dataObject[key]&&dataObject[key][idx]) PrintMatrix( x, dataObject[key][idx]);
                        }
                    }
                })
            }else{
                if (isEquikeylent(colxrow,objPrintMatrix[key])){
                    let x = objPrintMatrix[key];
                    x.value = dataObject[key];
                    if (x.value!==undefined&&x.value!==null&&x.value!=='')matrix.push(clone(x));
                        
                }else{
                    if (dataObject[key]) PrintMatrix(objPrintMatrix[key],dataObject[key]);
                }
            }
        }
    
    }
    PrintMatrix(maskMatrix, data);
    return matrix;
}

module.exports = {
    createObjectKey: createObjectKey,
    convertSqlFromJson: convertSqlFromJson,
    ConvertKeysToLowerCase: ConvertKeysToLowerCase,
    clone: clone,
    getMatrix : getMatrix, //tao ma tran in
    compare2Objects:isEquikeylent, //so sanh 2 object
    createTree: createTree,  //tao tree -->children
};