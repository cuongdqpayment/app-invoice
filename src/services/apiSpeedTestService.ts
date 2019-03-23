
import { HttpClient, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';

//ung dung cuongdq-upload post any
var speedtestServer:any;

    var speedTestServers = [
    { 
        name: 'Mobifone Hanoi',
        url: 'http://st1.mobifone.vn.prod.hosts.ooklaserver.net:8080', 
        getip : 'https://c3.mobifone.vn/api/ext-public/your-device',
        ping: '/latency.txt',
        download: '/random350x350.jpg',
        upload: '/upload.php',
        description:'May chủ speedtest của Mobifone tại Hà nội',
        location:'16.00,108.00'
    },
    { 
        name: 'VTN 5 (VNPT)',
        url: 'http://speedtest5.vtn.com.vn.prod.hosts.ooklaserver.net:8080', 
        getip : 'https://c3.mobifone.vn/api/ext-public/your-device',
        ping: '/latency.txt',
        download: '/random350x350.jpg',
        upload: '/upload.php',
        description:'May chủ speedtest của Mobifone tại Hà nội',
        location:'16.00,108.00'
    },
    { 
        name: 'Viettel KV2a',
        url: 'http://speedtestkv2a.viettel.vn.prod.hosts.ooklaserver.net:8080', 
        getip : 'https://c3.mobifone.vn/api/ext-public/your-device',
        ping: '/latency.txt',
        download: '/random350x350.jpg',
        upload: '/upload.php',
        description:'May chủ speedtest của Mobifone tại Hà nội',
        location:'16.00,108.00'
    },
    { 
        name: 'VietnamMobile DN',
        url: 'http://vnmdngspt1.vietnamobile.com.vn.prod.hosts.ooklaserver.net:8080', 
        getip : 'https://c3.mobifone.vn/api/ext-public/your-device',
        ping: '/latency.txt',
        download: '/random350x350.jpg',
        upload: '/upload.php',
        description:'May chủ speedtest của Mobifone tại Hà nội',
        location:'16.00,108.00'
    },
    { 
        name: 'HTC-ITC',
        url: 'http://speedtest.htc-itc.vn.prod.hosts.ooklaserver.net:8080', 
        getip : 'https://c3.mobifone.vn/api/ext-public/your-device',
        ping: '/latency.txt',
        download: '/random350x350.jpg',
        upload: '/upload.php',
        description:'May chủ speedtest của Mobifone tại Hà nội',
        location:'16.00,108.00'
    },
    { 
        name: 'ChinaMobile',
        url: 'http://speedtest1.hi.chinamobile.com.prod.hosts.ooklaserver.net:8080', 
        getip : 'https://c3.mobifone.vn/api/ext-public/your-device',
        ping: '/latency.txt',
        download: '/random350x350.jpg',
        upload: '/upload.php',
        description:'May chủ speedtest của Mobifone tại Hà nội',
        location:'16.00,108.00'
    },
    { 
        name: 'Amazone Heroku (USA)',
        url: 'https://cuongdq-speedtest.herokuapp.com', //ngoai internet
        getip : 'https://cuongdq-auth.herokuapp.com/api/ext-public/your-device',
        ping: '/speedtest/empty',
        download: '/speedtest/download',
        upload: '/speedtest/empty',
        description:' Máy chủ test internet Tại Mỹ, herokuapp.com',
        location:'30.0866,-94.1274' 
    },
    {
        name: 'Fpt Danang (100Mbps)',
        url: 'http://210.245.119.136:9235', //ngoai internet
        getip : 'https://cuongdq-auth.herokuapp.com/api/ext-public/your-device',
        ping: '/empty.php',
        download: '/garbage.php?ckSize=20',
        upload: '/empty.php',
        description:'',
        location:'16.00,108.00'
    },
    {
        name: 'Cmc Danang (100Mbps)',
        url: 'http://c3.mobifone.vn', //ngoai internet
        getip : 'https://cuongdq-auth.herokuapp.com/api/ext-public/your-device',
        ping: '/speedtest/latency.txt',
        download: '/speedtest/random1000x1000.jpg',
        upload: '/speedtest/upload.jsp',
        description:'Máy chủ test demo speedtest của kola tại Cty3',
        location:'16.00,108.00'
    }
    ]

var contermet;
var xhr = null; //tao da luong de truy cap server
var interval = null;
var totLoaded = 0.0;
var progress = 0.0;
var BACKGROUD_COLOR = "#e0e0e0";
var PROGRESS_COLOR = "#d44e49";

@Injectable()
export class ApiSpeedTestService {

    private worker;

    constructor(private httpClient: HttpClient) { }

    //bien worker de truyen message giua cac thread voi nhau
    setWorker(worker) {
        this.worker = worker;
    }

    setServer(server) {
        //console.log(server);
        speedtestServer = server;
    }

    //tham tham so cho url ? hoac & theo bien
    url_sep(url) { return url.match(/\?/) ? '&' : '?'; }

    /**
     * Su dung de truyen du lieu online den worker ...
     * @param command 
     * @param work 
     * @param data 
     */
    postCommand(command: 'init' | 'progress' | 'finish'
        , work: 'ip' | 'ping' | 'download' | 'upload'
        , data?:
            any
            | { graphName: string, unit: string, backgroundColor: string, statusColor: string, progressColor: string } //for init
            | { progress: number, contermet: string } //for progress
            | { ip: string, server: string, duration: number } //for work ip 
            | { ping: number, jitter: number } //for work ping
            | { speed: number } //for work dowload|upload
    ) {
        let objData;
        objData = {};
        if (command === 'init') {
            if (work === 'ip') {
                objData.graphName = "Check your IP";
                objData.unit = "ms";
                objData.statusColor = "#AA6060";
                objData.backgroundColor = BACKGROUD_COLOR;
                objData.progressColor = PROGRESS_COLOR
            } else if (work === 'ping') {
                objData.graphName = "Ping";
                objData.unit = "ms";
                objData.statusColor = "#AA6060";
                objData.backgroundColor = BACKGROUD_COLOR;
                objData.progressColor = PROGRESS_COLOR
            } else if (work === 'download') {
                objData.graphName = "Download";
                objData.unit = "Mbps";
                objData.statusColor = "#6060AA";
                objData.backgroundColor = BACKGROUD_COLOR;
                objData.progressColor = PROGRESS_COLOR
            } else if (work === 'upload') {
                objData.graphName = "Upload";
                objData.unit = "Mbps";
                objData.statusColor = "#309030";
                objData.backgroundColor = BACKGROUD_COLOR;
                objData.progressColor = PROGRESS_COLOR
            }
        }
        let objCommand = {
            command: command,
            work: work,
            data: (data) ? data : objData //thay the du lieu data khi khoi tao 
        }
        if (this.worker) {
            this.worker.postMessage(JSON.stringify(objCommand));
        }
    }

    //clear Request khi test vuot qua thoi gian 
    clearRequests() {
        //tlog('stopping pending XHRs')
        //console.log('xoa request di:');
        if (xhr) {
            for (var i = 0; i < xhr.length; i++) {
                try { xhr[i].onprogress = null; xhr[i].onload = null; xhr[i].onerror = null } catch (e) { }
                try { xhr[i].upload.onprogress = null; xhr[i].upload.onload = null; xhr[i].upload.onerror = null } catch (e) { }
                try { xhr[i].abort() } catch (e) { }
                try { xhr[i].cancel() } catch (e) { }
                try { xhr[i].unsubscribe() } catch (e) { }
                try { delete (xhr[i]) } catch (e) { }
            }
            xhr = null;
        }
        clearInterval(interval); //xoa luong thoi gian de chay cua no
    }

    downloadOne(i, step) {
        return new Promise((resolve, reject) => {
            var prevLoaded = 0 // number of bytes loaded last time onprogress was called
            //var garbagePhp_chunkSize = 20;
            var req = new HttpRequest('GET',
                speedtestServer.url + speedtestServer.download + this.url_sep(speedtestServer.download) + "r=" + Math.random(),
                //them chuoi random de khong bi cach
                {
                    reportProgress: true,
                    responseType: 'arraybuffer'
                });
            xhr[i] = this.httpClient.request(req)
                .subscribe((event: HttpEvent<any>) => {
                    switch (event.type) {
                        case HttpEventType.Sent:
                            break;
                        case HttpEventType.ResponseHeader:
                            break;
                        case HttpEventType.UploadProgress:
                            break;
                        case HttpEventType.DownloadProgress:
                            var loadDiff = event.loaded <= 0 ? 0 : (event.loaded - prevLoaded);
                            if (isNaN(loadDiff) || !isFinite(loadDiff) || loadDiff < 0) {
                                reject({
                                    code: 403,
                                    message: 'isNaN(loadDiff) || !isFinite(loadDiff) || loadDiff < 0'
                                });
                            }
                            totLoaded += loadDiff;
                            prevLoaded = event.loaded;
                            break;

                        case HttpEventType.Response:
                            resolve(totLoaded); //da xong mot step tren mot thread tra ve so luong dowload
                            break;
                        default:
                            console.log(event); //tra ve {type:0}
                            break;
                    }
                }, err => {
                    console.log(err);
                    reject(err);
                });

            xhr[i].cancel = function () {
                reject({ code: 403, message: 'Too Slow network!' })
            }

        })
    }

    uploadOne(i, step) {
        var xhr_ul_blob_megabytes = 20;
        return new Promise((resolve, reject) => {
            var prevLoaded = 0 // number of bytes loaded last time onprogress was called
            var isSmallUpload = true; //upload small data

            var r;
            r = new ArrayBuffer(1048576)
            var maxInt = Math.pow(2, 32) - 1;
            try { r = new Uint32Array(r); for (let j = 0; j < r.length; j++)r[j] = Math.random() * maxInt } catch (e) { }
            var reqData = []
            var reqsmall = []
            for (let j = 0; j < xhr_ul_blob_megabytes; j++) reqData.push(r)
            //su dung upload du lieu bigger???
            var reqUL = new Blob(reqData)

            r = new ArrayBuffer(262144)
            try { r = new Uint32Array(r); for (let j = 0; j < r.length; j++)r[i] = Math.random() * maxInt } catch (e) { }
            reqsmall.push(r)
            var reqsmallUL = new Blob(reqsmall)

            //neu muon 
            var file: File;
            if (isSmallUpload) { file = new File([reqsmallUL], 'data.dat') } else { file = new File([reqUL], 'data.dat') }

            var req = new HttpRequest('POST',
                speedtestServer.url + speedtestServer.upload + this.url_sep(speedtestServer.upload) + "r=" + Math.random(),
                file,
                {
                    reportProgress: true
                    , responseType: 'text'
                });
            xhr[i] = this.httpClient.request(req)
                .subscribe((event: HttpEvent<any>) => {
                    switch (event.type) {
                        case HttpEventType.Sent:
                            break;
                        case HttpEventType.ResponseHeader:
                            break;
                        case HttpEventType.UploadProgress:
                            //const percentDone = Math.round(100 * event.loaded / event.total);
                            //console.log(`FileUploading... is ${percentDone}% uploaded`);
                            var loadDiff = event.loaded <= 0 ? 0 : (event.loaded - prevLoaded);
                            if (isNaN(loadDiff) || !isFinite(loadDiff) || loadDiff < 0) {
                                reject({
                                    code: 403,
                                    message: 'isNaN(loadDiff) || !isFinite(loadDiff) || loadDiff < 0'
                                });
                            }
                            totLoaded += loadDiff;
                            prevLoaded = event.loaded;
                            break;
                        case HttpEventType.DownloadProgress:
                            break;
                        case HttpEventType.Response:
                            resolve(totLoaded); //da xong mot step tren mot thread tra ve so luong dowload
                            break;
                        default:
                            console.log(event); //tra ve {type:0}
                            break;
                    }
                }, err => {
                    console.log(err);
                    reject(err);
                });

            xhr[i].cancel = function () {
                reject({ code: 403, message: 'Too Slow network!' })
            }

        })
    }
    /**
     * 
     * @param i mot tien trinh ping goi lenh
     */
    pingOne(i) {
        return new Promise((resolve, reject) => {

            var req = new HttpRequest('GET',
                speedtestServer.url + speedtestServer.ping + this.url_sep(speedtestServer.ping) + 'r=' + Math.random(),
                //them chuoi random de khong bi cach
                {
                    reportProgress: true
                    , responseType: 'text'
                });

            xhr[i] = this.httpClient.request(req)
                .subscribe((event: HttpEvent<any>) => {
                    switch (event.type) {
                        case HttpEventType.Sent:
                            break;
                        case HttpEventType.ResponseHeader:
                            break;
                        case HttpEventType.UploadProgress:
                            break;
                        case HttpEventType.DownloadProgress:
                            break;
                        case HttpEventType.Response:
                            resolve(event); //da xong mot step tra ve event.body nhe
                            break;
                        default:
                            //console.log(event); //tra ve {type:0}
                            break;
                    }
                }, err => {
                    console.log(err);
                    reject(err);
                });

            xhr[i].cancel = function () {
                reject({ code: 403, message: 'Too Slow network!' })
            }

        })
    }
    //1. get-IP

    //cac ham speedtest
    //1. Lay dia chi IP
    getISP() {

        progress = 0;
        contermet = '...';
        var startT = new Date().getTime(); // timestamp when test was started
        var durationGetIpInSecond = 10;

        this.postCommand("init", "ip");

        interval = setInterval(function () {
            //console.log('gui thong bao tien trinh: ' + totLoaded);
            var passTime = new Date().getTime() - startT;
            progress = passTime / (durationGetIpInSecond * 1000);

            this.postCommand("progress", "ip", { progress: progress, contermet: contermet });

            //qua trinh = thoi gian troi qua chia cho thoi gian du dinh chay thu
        }.bind(this), 200); //cu 200ms thi thong bao ket qua cho contermet

        return this.httpClient.get(
            speedtestServer.getip + this.url_sep(speedtestServer.getip) + "r=" + Math.random()
        )
            .toPromise()
            .then(data => {
                clearInterval(interval);//reset interval
                this.postCommand("finish", "ip",
                    {     server: speedtestServer
                        , device: data 
                        , duration: progress * durationGetIpInSecond
                    });
                return data;
            })
            .catch(err => {
                clearInterval(interval);//reset interval
                throw err;
                
            })
    }

    //2. Test dowload
    /**
     * 10 thread x 20 step
     */
    download() {
        totLoaded = 0.0;
        progress = 0;
        contermet = '...';
        xhr = []; //bat dau tao multithread
        var maxThread = 10; //so luong chay 10 thread
        var maxStep = 20; //moi luong chay qua 20 step
        var durationTestInSecond = 15 //so giay chay test thu
        var maxTime_ms = (durationTestInSecond / 2) * 1000; //thoi gian thu 10 s hoac 20 buoc

        var delayThread = 300;
        //var oneThreadFuntion = this.downloadOne; //gan ham de chay download

        var overheadCompensationFactor = 1.06; //can be changed to compensatie for transport overhead. (see doc.md for some other values)
        var useMebibits: false;

        var graceTimeDone = false; //bo thoi gian parse TCP de tinh toc do cho chinh xac 
        var time_dlGraceTime = 1.5 //time to wait in seconds before actually measuring dl speed (wait for TCP window to increase)
        var startT = new Date().getTime(); // timestamp when test was started

        this.postCommand("init", "download");

        interval = setInterval(function () {

            //console.log('gui thong bao tien trinh: ' + totLoaded);
            var passTime = new Date().getTime() - startT;
            if (graceTimeDone) progress = passTime / (durationTestInSecond * 1000);
            //reset thoi gian bat dau tinh toan toc doc
            if (!graceTimeDone) {
                if (passTime > 1000 * time_dlGraceTime) {
                    if (totLoaded > 0) { // if the connection is so slow that we didn't get a single chunk yet, do not reset
                        startT = new Date().getTime(); //bat dau tinh thoi gian download
                        totLoaded = 0.0;               //reset bien lai
                    }
                    graceTimeDone = true;
                }
            } else {
                var speed = totLoaded / (passTime / 1000.0)
                contermet = ((speed * 8 * overheadCompensationFactor) / (useMebibits ? 1048576 : 1000000)).toFixed(1) // speed is multiplied by 8 to go from bytes to bits, overhead compensation is applied, then everything is divided by 1048576 or 1000000 to go to megabits/mebibits

                this.postCommand("progress", "download", { progress: progress, contermet: contermet });

                if (progress >= 1) {
                    console.log('SLOW NETWORK for Download!');
                    this.clearRequests();
                }
            }

            //qua trinh = thoi gian troi qua chia cho thoi gian du dinh chay thu
        }.bind(this), 200); //cu 200ms thi thong bao ket qua cho contermet

        return new Promise((resolve, reject) => {

            startT = new Date().getTime(); // timestamp when test was started

            var testStream = function (i, delay, step, doneThread) {
                //chay 1 lan delay
                setTimeout(function () {
                    let timeout = new Date().getTime() - startT;

                    //console.log("test thread: " + i + ", step: " + step + ', timeout: ' + timeout);

                    this.downloadOne(i, step) //tien trinh nay chay rat cham neu mang cham
                        .then(total => {
                            /* console.log("A Step in a Thread: " + i + " finish Total loaded:");
                            console.log(total); */
                            if (timeout < maxTime_ms && step < maxStep) { //dieu kien nao den truoc 
                                //console.log("progress " + step);
                                //resolve('progress ' + i);
                                try { xhr[i].unsubcriber() } catch (e) { } // reset the stream data to empty ram
                                testStream(i, 0, step + 1, doneThread); //goi tiep bien a
                            } else {
                                //console.log("finish IN thread: " + i);
                                //console.log(doneThread);
                                if (doneThread) doneThread(i) //bao xong thread so i
                                //resolve(total); //ket thuc thread voi n step mang tong so tra ve
                            }
                        })
                        .catch(err => {
                            //truong hop da reset ket qua gui ve sau thi
                            //console.log(err);
                            if (doneThread) doneThread(i)
                        }); //goi ham dowload thread i va step 

                }.bind(this), 1 + delay)
            }.bind(this);

            var countThreadDone = 0;
            var callBackThread = function (threadId) {
                countThreadDone++;
                if (countThreadDone == maxThread) {
                    resolve(totLoaded); //tra ve tong so luong bit nhan duoc
                }
            }

            for (var j = 0; j < maxThread; j++) {
                //console.log("Thread " + j);
                testStream(j, j * delayThread, 1, callBackThread); //chay tu step 1
            }
        })
            .then(data => {
                //reset interval clear no di
                clearInterval(interval);
                //Tra ve chu XONG!
                this.postCommand("progress", "download", { progress: 1, contermet: contermet });

                this.postCommand("finish", "download", { speed: contermet });

                return 'download STOP!'; //tra ve cho phien goi no

            });
    }

    //3. test upload
    upload() {
        totLoaded = 0.0;
        progress = 0;
        contermet = '...';
        xhr = []; //bat dau tao multithread
        var maxThread = 10; //so luong chay 10 thread
        var maxStep = 20; //moi luong chay qua 20 step
        var durationTestInSecond = 15 //so giay chay test thu
        var maxTime_ms = (durationTestInSecond / 2) * 1000; //thoi gian thu 10 s hoac 20 buoc

        var delayThread = 300;

        var overheadCompensationFactor = 1.06; //can be changed to compensatie for transport overhead. (see doc.md for some other values)
        var useMebibits: false;

        var graceTimeDone = false; //bo thoi gian parse TCP de tinh toc do cho chinh xac 
        var time_ulGraceTime = 3 //time to wait in seconds before actually measuring dl speed (wait for TCP window to increase)
        var startT = new Date().getTime(); // timestamp when test was started


        this.postCommand("init", "upload");

        interval = setInterval(function () {

            //console.log('gui thong bao tien trinh: ' + totLoaded);
            var passTime = new Date().getTime() - startT;
            if (graceTimeDone) progress = passTime / (durationTestInSecond * 1000);
            //reset thoi gian bat dau tinh toan toc doc
            if (!graceTimeDone) {
                if (passTime > 1000 * time_ulGraceTime) {
                    if (totLoaded > 0) { // if the connection is so slow that we didn't get a single chunk yet, do not reset
                        startT = new Date().getTime(); //bat dau tinh thoi gian download
                        totLoaded = 0.0;               //reset bien lai
                    }
                    graceTimeDone = true;
                }
            } else {
                var speed = totLoaded / (passTime / 1000.0)
                contermet = ((speed * 8 * overheadCompensationFactor) / (useMebibits ? 1048576 : 1000000)).toFixed(1) // speed is multiplied by 8 to go from bytes to bits, overhead compensation is applied, then everything is divided by 1048576 or 1000000 to go to megabits/mebibits
                //dua ve qua trinh

                this.postCommand("progress", "upload", { progress: progress, contermet: contermet });

                if (progress >= 1) {
                    console.log('SLOW NETWORK for Upload!');
                    this.clearRequests();
                }
            }

            //qua trinh = thoi gian troi qua chia cho thoi gian du dinh chay thu
        }.bind(this), 200); //cu 200ms thi thong bao ket qua cho contermet

        return new Promise((resolve, reject) => {
            startT = new Date().getTime(); // timestamp when test was started
            var testStream = function (i, delay, step, doneThread) {
                //chay 1 lan delay
                setTimeout(function () {
                    let timeout = new Date().getTime() - startT;
                    //console.log("test thread: " + i + ", step: " + step + ', timeout: ' + timeout);
                    this.uploadOne(i, step) //tien trinh nay chay rat cham neu mang cham
                        .then(total => {
                            //console.log("A Step in a Thread: " + i + " finish Total loaded:");
                            if (timeout < maxTime_ms && step < maxStep) { //dieu kien nao den truoc 
                                try { xhr[i].unsubcriber() } catch (e) { } // reset the stream data to empty ram
                                testStream(i, 0, step + 1, doneThread); //goi tiep bien a
                            } else {
                                if (doneThread) doneThread(i) //bao xong thread so i
                            }
                        })
                        .catch(err => {
                            if (doneThread) doneThread(i)
                        });
                }.bind(this), 1 + delay)
            }.bind(this);

            var countThreadDone = 0;
            var callBackThread = function (threadId) {
                countThreadDone++;
                if (countThreadDone == maxThread) {
                    resolve(totLoaded); //tra ve tong so luong bit nhan duoc
                }
            }

            for (var j = 0; j < maxThread; j++) {
                //console.log("Thread " + j);
                testStream(j, j * delayThread, 1, callBackThread); //chay tu step 1
            }
        })
            .then(data => {
                //reset interval clear no di
                clearInterval(interval);
                this.postCommand("progress", "upload", { progress: 1, contermet: contermet });
                this.postCommand("finish", "upload", { speed: contermet });
                return 'upload STOP!'; //tra ve cho phien goi no
            });
    }

    //3. ping and jitter
    ping() {
        var ping = 0.0 // current ping value
        var jitter = 0.0 // current jitter value
        var i = 0 // counter of pongs received
        var prevInstspd = 0 // last ping time, used for jitter calculation
        const count_ping = 10;
        const ping_allowPerformanceApi = true;
        var pingStatus;
        var jitterStatus;

        xhr = [];

        var startT = new Date().getTime(); // timestamp when test was started

        this.postCommand("init", "ping");

        return new Promise((resolve, reject) => {

            // ping function
            var doPing = function () {
                progress = i / count_ping;
                startT = new Date().getTime();

                this.pingOne(0)
                    .then(result => {
                        //console.log("A Step in a Thread: " + i + " finish Total loaded:");
                        //console.log(result);
                        if (i === 0) {
                            startT = new Date().getTime() // first pong
                        } else {
                            var instspd = new Date().getTime() - startT
                            if (ping_allowPerformanceApi) {
                                try {
                                    //try to get accurate performance timing using performance api
                                    var p;
                                    p = performance.getEntries();
                                    p = p[p.length - 1];
                                    var d = p.responseStart - p.requestStart //best precision: chromium-based
                                    if (d <= 0) d = p.duration; //edge: not so good precision because it also considers the overhead and there is no way to avoid it
                                    if (d > 0 && d < instspd) instspd = d;
                                } catch (e) {
                                    console.log('Performance API not supported, using estimate')
                                }
                            }
                            var instjitter = Math.abs(instspd - prevInstspd)
                            if (i === 1) ping = instspd; /* first ping, can't tell jitter yet*/ else {
                                ping = instspd < ping ? instspd : ping * 0.8 + instspd * 0.2 // update ping, weighted average. if the instant ping is lower than the current average, it is set to that value instead of averaging
                                if (i === 2) jitter = instjitter //discard the first jitter measurement because it might be much higher than it should be
                                else
                                    jitter = instjitter > jitter ? (jitter * 0.3 + instjitter * 0.7) : (jitter * 0.8 + instjitter * 0.2) // update jitter, weighted average. spikes in ping values are given more weight.
                            }
                            prevInstspd = instspd
                        }
                        pingStatus = ping.toFixed(0);
                        jitterStatus = jitter.toFixed(0);
                        i++


                        if (i < count_ping) {
                            doPing();
                            //continue .. postMessage
                            this.postCommand("progress", "ping", { progress: progress, contermet: pingStatus });
                        }
                        else {
                            progress = 1;
                            resolve({
                                ping: pingStatus,
                                jitter: jitterStatus
                            })
                        } // more pings to do?
                    })
                    .catch(err => {
                        //truong hop da reset ket qua gui ve sau thi
                        console.log(err);
                        reject({
                            code: 403,
                            message: 'fail!',
                            err: err
                        })
                    });

            }.bind(this);

            doPing() // start first ping

        })
            .then(data => {
                //ping xong roi
                var dataPing;
                dataPing = data;
                //console.log('data:');

                this.postCommand("progress", "ping", { progress: 1, contermet: dataPing.ping });
                this.postCommand("finish", "ping", { ping: dataPing.ping, jitter: dataPing.jitter });


                return data;
            })
            .catch(err => {
                console.log('err');
                console.log(err);
                throw err; //tra ve xu ly o phien toi
            });

    }

    getSpeedtestServerList(){
        return new Promise<any>((resolve,reject)=>{
            resolve(speedTestServers)
        })
    }
}