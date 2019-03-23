var log = '' //telemetry log
var trackingLog =  (s,o) => { log += Date.now() + ': ' + s + '\n'; if(o)log += JSON.stringify(o)}
var printLog = ()=>{console.log(log)}
var getLog = () =>{return log}
var resetLog = ()=>{log=''}
module.exports = {
    put: trackingLog,
    get: getLog,
    print: printLog,
    reset: resetLog,
}