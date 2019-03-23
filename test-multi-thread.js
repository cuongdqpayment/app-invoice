var maxStep = 5; //moi luong chay qua 5 buoc thi dung lai
var maxTime = 1000; //5s //qua thoi gian thi dung lai

var maxThread = 2; //so luong chay 10
var delayThread = 300;

/**
 * thuc nghiem chay da luong trong javascript
 * Qua thoi gian thi dung lai
 * chay theo so luong luong buoc hoac thoi gian troi qua
 * Sau khi hoan thanh thi goi lai ham done() de bao la xong
 */
var test = new Promise((resolve,reject)=>{

    var startT = new Date().getTime(); // timestamp when test was started

    var testStream = function (i, delay, step , doneThread) {
        setTimeout(function () {
            let timeout = new Date().getTime()-startT;

            console.log("test thread: " + i + ", step: " + step + ', timeout: ' + timeout);

            if (timeout<maxTime&&step<maxStep) { //dieu kien nao den truoc 
                console.log("progress " + step);
                //resolve('progress ' + i);
                testStream(i, 0, step + 1, doneThread ); //goi tiep bien a
            } else {
                console.log("finish IN thread: " + i);
                //console.log(doneThread);
                if (doneThread) doneThread(i) //bao xong thread so i
                return;
            }
        }.bind(this), 1 + delay)
    }.bind(this);
    
    
    
    var countThreadDone = 0;
    var callBackThread = function(threadId){
                                console.log("finish thread CALLBACK: " + threadId);
                                countThreadDone++;
                                if (countThreadDone==maxThread){
                                    console.log('XONG ROI NHE:' + countThreadDone);
                                    resolve('XONG!');
                                }
                            }

    for (var j=0;j<maxThread;j++){
        console.log("Thread " + j);
        testStream(j, j * delayThread, 0, callBackThread);
    }  
});


//chay 10 luong, moi luong chay 
test.then(data=>{
    console.log('data');
    console.log(data);
})
.catch(err=>{
    console.log('err');
    console.log(err);
    
});

