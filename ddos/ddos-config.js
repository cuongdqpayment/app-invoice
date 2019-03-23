const DDDoS = require('dddos');
module.exports = new DDDoS({
                        errorData: "Hãy bình tĩnh, đợi tý đi!",
                        //Data to be passes to the client on DDoS detection. Default: "Not so fast!".
                        errorCode: 429,
                        //HTTP error code to be set on DDoS detection. Default: 429 (Too Many Requests)
                        weight: 1,
                        maxWeight: 40,
                        checkInterval: 1000,
                        rules: [
                            { //cho phep trang chu truy cap 30 yeu cau / 1 giay
                                string: '/',
                                maxWeight: 40
                            },
                            { //cho phep trang chu truy cap 30 yeu cau / 1 giay
                                string: '/api/',
                                maxWeight: 40
                            },
                            {   regexp: "^/api/ext-auth/*",
                                flags: "i",
                                maxWeight: 1,
                                queueSize: 1 // If request limit is exceeded, new requests are added to the queue 
                            },
                            { // Allow up to 16 other requests per check interval.
                                regexp: ".*",
                                maxWeight: 40
                            }
                        ]
                    })
;
  