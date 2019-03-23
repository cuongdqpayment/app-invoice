"use strict"

const getResults = (req,res,next)=>{
  let results = [{data:'test'}];
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(results));
}


const postResult = (req, res, next) =>{
  console.log('-->Post Data device:', req.json_data.device); 
  //luu ket qua speedtest vao 
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(req.json_data));
  
}


module.exports = {
    postResult: postResult,
    getResults: getResults
};