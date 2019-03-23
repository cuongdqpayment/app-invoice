import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class ApiHttpPublicService {

    sampleMediasDynamic: any = {
        title:"Đa phương tiện"
        /* ,buttons: [
            {color:"primary", icon:"arrow-dropdown-circle",  next:"DOWN"}
            , {color:"primary", icon:"arrow-dropup-circle", next:"UP"}
          ] */
        ,medias: [
            {image:"assets/imgs/img_forest.jpg"
                ,title:"Miền quê yêu dấu"
                ,h1: "Chốn yên bình"
                ,p: "Là nơi bình yên nhất. Bạn có thể dạo bước trên con đường rợp bóng mát thanh bình đến lạ"}
            ,{image:"assets/imgs/anh_vua.png"
                ,h1: "Nội dung bài viết vể cao tốc"
                ,p: "Một bài viết về cao tốc đây nhé"}
            ,{image:"assets/imgs/ca_nau.jpg"
                ,h2: "Cá Nâu ở Quê Mỹ lợi"
                ,p: "Cá ngày mồng 3 tết ở quê"}
            ,{image:"assets/imgs/ca_the.jpg"
                ,h1: "Cá Thệ ở Quê Mỹ lợi"
                ,p: "Cá ngày mồng 3 tết ở quê, Cá thệ kho dưa rất tuyệt vời"}
            ,{image:"assets/imgs/img_forest.jpg"}
            ,{image:"assets/imgs/anh_nho.png"
                ,h1: "Mùa trái cây chín đỏ"
                ,p: "Trái cây vựa, miền quê nhiều cá lắm đó"}
        ]
        ,actions:{
            //file: {name:"Open file", size: 480, color:"primary", icon: "image", next:"FILE"}
            // ,
            files: {name:"Open files", color:"primary", icon: "images", next:"FILES"}
            , open: {key: "down", link_key:"up", name:"Expand", color:"primary", icon:"arrow-dropdown",  next:"DOWN"}
            , close: {key: "up", link_key:"down", name:"Collapse", color:"primary", icon:"arrow-dropup", next:"UP"}
            , buttons: [
                 {name:"Save", icon: "share-alt", color:"primary", url:"https://c3.mobifone.vn/api/ext-auth/save-user-avatar", method: "FORM-DATA", token:true , next:"SAVE"}
            ]
        }
    }

     sampleFormDynamic: any = {
      title: "Đăng ký"
      , items: [
        {        name: "Thông tin cá nhân avatar", hint: "Avatar", type: "avatar", url: "https://www.w3schools.com/howto/img_forest.jpg" }
        , { id: 1, name: "Check hay không chọn?", type: "check", value: true }
        , { id: 2, name: "Thanh Trượt", type: "range", value: 50, min: 0, max: 100 }
        , { id: 3, name: "Chọn hay không chọn Toggle?", icon: "plane", type: "toggle" }
        , { id: 4, name: "Chọn radio cái nào", type: "radio", icon: "plane", value: 2, options: [{ name: "Tùy chọn 1", value: 1 }, { name: "Tùy chọn 2", value: 2 }] }
        , { id: 5, name: "Chọn 1 cái nào", type: "select", value: 2, options: [{ name: "Tùy chọn 1", value: 1 }, { name: "Tùy chọn 2", value: 2 }] }
        , { id: 6, name: "Chọn nhiều cái nào", type: "select_multiple", value: 2, options: [{ name: "Tùy chọn 1", value: 1 }, { name: "Tùy chọn 2", value: 2 }] }
        , {        name: "Ảnh cá nhân", hint: "image viewer", type: "image", url: "https://www.w3schools.com/howto/img_forest.jpg" }
        , { id: 8, key: "username", name: "username", hint: "Số điện thoại di động 9 số bỏ số 0 ở đầu", type: "text", input_type: "userName", icon: "information-circle", validators: [{ required: true, min: 9, max: 9, pattern: "^[0-9]*$" }]}
        , { id: 9, key: "password", name: "password", hint: "Mật khẩu phải có chữ hoa, chữ thường, ký tự đặc biệt, số", type: "password", input_type: "password", icon: "information-circle", validators: [{ required: true, min: 6, max: 20}]}
        , { id: 10, name: "Họ và tên", type: "text", input_type: "text", icon: "person" }
        , { id: 11, name: "Điện thoại", hint: "Yêu cầu định dạng số điện thoại nhé", type: "text", input_type: "tel", icon: "call", validators: [{ pattern: "^[0-9]*$" }]}
        , { id: 12, name: "email", hint: "Yêu cầu định dạng email nhé", type: "text", input_type: "email", icon: "mail", validators: [{ pattern: "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" }]}
        , { id: 13, name: "Ngày bắt đầu", hint: "Chọn ngày", type: "datetime", display:"DD/MM/YYYY", picker:"DD MM YYYY"}
        , { id: 14, name: "Thời gian bắt đầu", hint: "Chọn thời gian", type: "datetime", display:"HH:mm:ss", picker:"HH:mm:ss"}
        , { id: 15, name: "Nội dung nhập", hint: "Nhập nhiều dòng", type: "text_area"}
        , {          name: "Thông tin cá nhân", type: "title"}
        , { type:"details",
            details: [
                {
                name:"Mã khách hàng",
                value: "R012234949883"
                },
                {
                name:"Tên khách hàng",
                value: "Nguyễn Văn B"
                },
                {
                name:"Địa chỉ",
                value: "263 Nguyễn Văn Linh, Đà nẵng, Việt Nam"
                },
                {
                name:"Hình thức thanh toán",
                value: "Tiền mặt"
                },
            ]
         }
        , 
        { 
            type: "button"
          , options: [
            { name: "Reset", next: "RESET" }
            , { name: "Exit", next: "EXIT" }
            , { name: "Close", next: "CLOSE" }
            , { name: "Back", next: "BACK"}
            , { name: "Continue", next: "CONTINUE"}
            , { name: "Register", next: "BACK", url: "https://chonsoc3.mobifone.vn/ionic/", command: "USER_LOGIN_REDIRECT" }
            , { name: "LOGIN", next: "CONTINUE" , url: "https://chonsoc3.mobifone.vn/ionic/", command: "USER_CHECK_EXISTS", token: true }
          ]
        }]
  };  

  sampleCardDynamic: any = {
      title: "Mạng xã hội"
      , search_bar: {hint: "Tìm cái gì đó"} 
      , buttons: [
          {color:"primary", icon:"add", next:"ADD"}
          , {color:"primary", icon:"contacts", next:"FRIENDS"}
          , {color:"primary", icon:"notifications", next:"NOTIFY"
            , alerts:[
                "cuong.dq"
                ]
            }
          , {color:"royal", icon:"cog", next:"SETTINGS"}
        ]
      , items: [
        {   short_detail:{
                avatar: "assets/imgs/ca_nau.jpg"
                ,h1:"Cuong.dq"
                ,p:"Cần thiết là nội dung chi tiết đây, có thể viết tóm lượt nhiều thông tin cũng được"
                ,note:"1h ago"
                ,action: {color:"primary", icon: "more", next:"MORE" }
            }
            ,title:"Chi tiết các ảnh hiển thị"
            ,note:"Bài viết chi tiết kết thúc"
            ,medias: [
                {image:"assets/imgs/img_forest.jpg"
                    ,title:"Miền quê yêu dấu"
                    ,h1: "Chốn yên bình"
                    ,p: "Là nơi bình yên nhất. Bạn có thể dạo bước trên con đường rợp bóng mát thanh bình đến lạ"}
                ,{image:"assets/imgs/anh_vua.png"
                    ,h1: "Nội dung bài viết vể cao tốc"
                    ,p: "Một bài viết về cao tốc đây nhé"}
                ,{image:"assets/imgs/ca_nau.jpg"
                    ,h2: "Cá Nâu ở Quê Mỹ lợi"
                    ,p: "Cá ngày mồng 3 tết ở quê"}
                ,{image:"assets/imgs/ca_the.jpg"
                    ,h1: "Cá Thệ ở Quê Mỹ lợi"
                    ,p: "Cá ngày mồng 3 tết ở quê, Cá thệ kho dưa rất tuyệt vời"}
                ,{image:"assets/imgs/img_forest.jpg"}
                ,{image:"assets/imgs/anh_nho.png"
                    ,h1: "Mùa trái cây chín đỏ"
                    ,p: "Trái cây vựa, miền quê nhiều cá lắm đó"}
            ]
            ,content:{
                title:"Miền quê yêu dấu"
                ,paragraphs:[
                    {
                        h2: "Chốn yên bình"
                        ,p: "Là nơi bình yên nhất. Bạn có thể dạo bước trên con đường rợp bóng mát thanh bình đến lạ"
                        ,medias: [
                            {image:"assets/imgs/img_forest.jpg",title:"Cầu Thê Húc xưa",subtitle:"Đoàn Quốc Cường"}
                            ,{image:"assets/imgs/anh_vua.png",title:"Cao tốc 34 nghìn tỷ mới khai trương đã hỏng",subtitle:"ảnh Mượn trên mạng "}
                        ]
                    }
                    ,
                    {
                        h2: "Chốn bóc mẽ"
                        ,p: "Đây là nơi bóc mẽ thông tin trên mạng. Một sự kiện mà mọi người không thể biết được bằng những phương tiện truyền thông truyền thống"
                        ,medias: [
                            {image:"assets/imgs/anh_vua.png",title:"Cao tốc 34 nghìn tỷ mới khai trương đã hỏng",subtitle:"ảnh Mượn trên mạng "}
                        ]
                    }
                ]
                ,note:"Đoàn Quốc Cường 2019"
            }
            ,results:{ 
                likes:{
                    like:["Cuong.dq","abc","xyz"]
                    ,love:["love"]
                    ,unlike:["dog"]
                    ,sad:["cat"]
                    ,angery:["tiger"]
                }
                ,comments:[
                    {name:"cuong.dq"
                    ,comment:"day la cai gi vay"
                    ,time:new Date().getTime()
                    }
                    ,
                    {name:"cu.dq"
                    ,comment:"la cai nay do nhe"
                    ,time:new Date().getTime()
                    }
                ]
                ,shares:[
                    {name:"cuong.dq"
                    ,comment:"day la cai gi vay"
                    ,time:new Date().getTime()
                    }
                    ,
                    {name:"cu.dq"
                    ,comment:"la cai nay do nhe"
                    ,time:new Date().getTime()
                    }
                ]
                
            }
            ,actions:{
                like: {name:"LIKE", color:"primary", icon: "thumbs-up", next:"LIKE"}
                ,comment: {name:"COMMENT", color:"primary", icon: "chatbubbles", next:"COMMENT"}
                ,share: {name:"SHARE", color:"primary", icon: "share-alt", next:"SHARE"}
            }

        }
        , { short_details:{

            }
            ,medias: [
                {image:"assets/imgs/img_forest.jpg",title:"1 Ảnh",subtitle:"Tác giả Đoàn Quốc Cường"}
            ]
            ,results:{ 
                likes:{
                    like:["Cuong.dq","abc","xyz"]
                    ,love:["love"]
                }
                ,shares:[
                    {name:"cu.dq"
                    ,comment:"la cai nay do nhe"
                    ,time:new Date().getTime()
                    }
                ]
                
            }
            ,actions:{
                like: {name:"Thích", color:"primary", icon: "thumbs-up", next:"LIKE"}
                ,comment: {name:"Trò chuyện", color:"primary", icon: "chatbubbles", next:"COMMENT"}
                ,share: {name:"Chia sẻ", color:"primary", icon: "share-alt", next:"SHARE"}
            }
        }
        , { short_details:{

            }
            ,medias: [
                {image:"assets/imgs/ca_nau.jpg",title:"Ảnh 1",subtitle:"Tác giả Đoàn Quốc Cường"}
                ,{image:"assets/imgs/img_forest.jpg",title:"Ảnh 2",subtitle:"Tác giả Đoàn Quốc Cường"}
            ]
            ,results:{ 
                likes:{
                    sad:["cat"]
                }
                ,comments:[
                    {name:"cu.dq"
                    ,comment:"la cai nay do nhe"
                    ,time:new Date().getTime()
                    }
                ]
            }
            ,actions:{
                like: {name:"Thích", color:"primary", icon: "thumbs-up", next:"LIKE"}
                ,comment: {name:"Trò chuyện", color:"primary", icon: "chatbubbles", next:"COMMENT"}
                ,share: {name:"Chia sẻ", color:"primary", icon: "share-alt", next:"SHARE"}
            }
        }
        , { short_details:{

            }
            ,medias: [
                {image:"assets/imgs/img_forest.jpg",title:"3 Ảnh",subtitle:"Tác giả Đoàn Quốc Cường"}
                ,{image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="}
                ,{image:"data:image/gif;base64,R0lGODlhPQBEAPeoAJosM//AwO/AwHVYZ/z595kzAP/s7P+goOXMv8+fhw/v739/f+8PD98fH/8mJl+fn/9ZWb8/PzWlwv///6wWGbImAPgTEMImIN9gUFCEm/gDALULDN8PAD6atYdCTX9gUNKlj8wZAKUsAOzZz+UMAOsJAP/Z2ccMDA8PD/95eX5NWvsJCOVNQPtfX/8zM8+QePLl38MGBr8JCP+zs9myn/8GBqwpAP/GxgwJCPny78lzYLgjAJ8vAP9fX/+MjMUcAN8zM/9wcM8ZGcATEL+QePdZWf/29uc/P9cmJu9MTDImIN+/r7+/vz8/P8VNQGNugV8AAF9fX8swMNgTAFlDOICAgPNSUnNWSMQ5MBAQEJE3QPIGAM9AQMqGcG9vb6MhJsEdGM8vLx8fH98AANIWAMuQeL8fABkTEPPQ0OM5OSYdGFl5jo+Pj/+pqcsTE78wMFNGQLYmID4dGPvd3UBAQJmTkP+8vH9QUK+vr8ZWSHpzcJMmILdwcLOGcHRQUHxwcK9PT9DQ0O/v70w5MLypoG8wKOuwsP/g4P/Q0IcwKEswKMl8aJ9fX2xjdOtGRs/Pz+Dg4GImIP8gIH0sKEAwKKmTiKZ8aB/f39Wsl+LFt8dgUE9PT5x5aHBwcP+AgP+WltdgYMyZfyywz78AAAAAAAD///8AAP9mZv///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAKgALAAAAAA9AEQAAAj/AFEJHEiwoMGDCBMqXMiwocAbBww4nEhxoYkUpzJGrMixogkfGUNqlNixJEIDB0SqHGmyJSojM1bKZOmyop0gM3Oe2liTISKMOoPy7GnwY9CjIYcSRYm0aVKSLmE6nfq05QycVLPuhDrxBlCtYJUqNAq2bNWEBj6ZXRuyxZyDRtqwnXvkhACDV+euTeJm1Ki7A73qNWtFiF+/gA95Gly2CJLDhwEHMOUAAuOpLYDEgBxZ4GRTlC1fDnpkM+fOqD6DDj1aZpITp0dtGCDhr+fVuCu3zlg49ijaokTZTo27uG7Gjn2P+hI8+PDPERoUB318bWbfAJ5sUNFcuGRTYUqV/3ogfXp1rWlMc6awJjiAAd2fm4ogXjz56aypOoIde4OE5u/F9x199dlXnnGiHZWEYbGpsAEA3QXYnHwEFliKAgswgJ8LPeiUXGwedCAKABACCN+EA1pYIIYaFlcDhytd51sGAJbo3onOpajiihlO92KHGaUXGwWjUBChjSPiWJuOO/LYIm4v1tXfE6J4gCSJEZ7YgRYUNrkji9P55sF/ogxw5ZkSqIDaZBV6aSGYq/lGZplndkckZ98xoICbTcIJGQAZcNmdmUc210hs35nCyJ58fgmIKX5RQGOZowxaZwYA+JaoKQwswGijBV4C6SiTUmpphMspJx9unX4KaimjDv9aaXOEBteBqmuuxgEHoLX6Kqx+yXqqBANsgCtit4FWQAEkrNbpq7HSOmtwag5w57GrmlJBASEU18ADjUYb3ADTinIttsgSB1oJFfA63bduimuqKB1keqwUhoCSK374wbujvOSu4QG6UvxBRydcpKsav++Ca6G8A6Pr1x2kVMyHwsVxUALDq/krnrhPSOzXG1lUTIoffqGR7Goi2MAxbv6O2kEG56I7CSlRsEFKFVyovDJoIRTg7sugNRDGqCJzJgcKE0ywc0ELm6KBCCJo8DIPFeCWNGcyqNFE06ToAfV0HBRgxsvLThHn1oddQMrXj5DyAQgjEHSAJMWZwS3HPxT/QMbabI/iBCliMLEJKX2EEkomBAUCxRi42VDADxyTYDVogV+wSChqmKxEKCDAYFDFj4OmwbY7bDGdBhtrnTQYOigeChUmc1K3QTnAUfEgGFgAWt88hKA6aCRIXhxnQ1yg3BCayK44EWdkUQcBByEQChFXfCB776aQsG0BIlQgQgE8qO26X1h8cEUep8ngRBnOy74E9QgRgEAC8SvOfQkh7FDBDmS43PmGoIiKUUEGkMEC/PJHgxw0xH74yx/3XnaYRJgMB8obxQW6kL9QYEJ0FIFgByfIL7/IQAlvQwEpnAC7DtLNJCKUoO/w45c44GwCXiAFB/OXAATQryUxdN4LfFiwgjCNYg+kYMIEFkCKDs6PKAIJouyGWMS1FSKJOMRB/BoIxYJIUXFUxNwoIkEKPAgCBZSQHQ1A2EWDfDEUVLyADj5AChSIQW6gu10bE/JG2VnCZGfo4R4d0sdQoBAHhPjhIB94v/wRoRKQWGRHgrhGSQJxCS+0pCZbEhAAOw=="}
            ]
            ,results:{ 
                likes:{
                    like:["Cuong.dq","abc","xyz"]
                }
            
            }
            ,actions:{
                like: {name:"Thích", color:"primary", icon: "thumbs-up", next:"LIKE"}
                ,comment: {name:"Trò chuyện", color:"primary", icon: "chatbubbles", next:"COMMENT"}
                ,share: {name:"Chia sẻ", color:"primary", icon: "share-alt", next:"SHARE"}
            }
        }
        , { short_details:{

            }
            ,medias: [
                {image:"assets/imgs/img_forest.jpg",title:"4 Ảnh"}
                ,{image:"assets/imgs/ca_the.jpg"}
                ,{image:"assets/imgs/anh_vua.png"}
                ,{image:"assets/imgs/ca_nau.jpg"}
            ]
            ,actions:{
                like: {name:"Thích", color:"primary", icon: "thumbs-up", next:"LIKE"}
                ,comment: {name:"Trò chuyện", color:"primary", icon: "chatbubbles", next:"COMMENT"}
                ,share: {name:"Chia sẻ", color:"primary", icon: "share-alt", next:"SHARE"}
            }
        }
        
        ]
  };  


  sampleListDynamic:any = {
    title: "Mạng xã hội"
    , search_bar: {hint: "Tìm cái gì đó"} 
    , buttons: [
        {color:"primary", icon:"add", next:"ADD"}
        , {color:"primary", icon:"contacts", next:"FRIENDS"}
        , {color:"primary", icon:"notifications", next:"NOTIFY"
          , alerts:[
              "cuong.dq"
              ]
          }
        , {color:"royal", icon:"cog", next:"SETTINGS"}
      ]
    , items: [
        {
            //icon:"contact",
            image: "assets/imgs/img_forest.jpg"
            ,h1:"H1 Tieu de"
            ,h2:"H2 Chuong muc"
            ,h3:"H3 Muc luc"
            ,p:"Sau khi đánh cồng khai trương phiên giao dịch đầu xuân Kỷ Hợi 2019 tại Sở Giao dịch chứng khoán Hà Nội vào sáng 12-2, Thủ tướng Chính phủ Nguyễn Xuân Phúc khẳng định tầm quan trọng của thị trường chứng khoán Việt Nam."
            ,note:"13/02/2019"
            ,options:[
                { name: "Xóa", color:"danger", icon:"trash", next:"EXIT"}
              , { name: "Chỉnh sửa", color:"primary", icon:"create", next: "NEXT"}
              , { name: "Xem chi tiết", color:"secondary", icon:"list", next: "CALLBACK"}
            ]
        }
        ,{
            icon:"contact"
            //image: "assets/imgs/img_forest.jpg"
            ,h1:"H1 Tieu de 2"
            ,h2:"H2 Chuong muc 2"
            ,h3:"H3 Muc luc 2"
            ,p:"Trong những ngày đánh bắt đầu năm, 3 ngư dân Quảng Trị đã thu hoạch được mẻ cá bè gần 140 tấn; trong đó một ngư dân trúng mẻ cá siêu khủng nặng hơn 100 tấn."
            ,note:"14/02/2019"
            ,options:[
                { name: "Xóa", color:"danger", icon:"trash", next:"EXIT"}
              , { name: "Chỉnh sửa", color:"primary", icon:"create", next: "NEXT"}
              , { name: "Xem chi tiết", color:"secondary", icon:"list", next: "CALLBACK"}
            ]
        }
    ]
  }


    constructor(private httpClient: HttpClient) {}

    /**
     * Lay danh sach cac quoc gia ve Ma so dien thoai, co, ten, ngon ngu, tien...
     */
    getAllCoutries(){
        return this.httpClient.get('https://restcountries.eu/rest/v2/all')
        .toPromise()                 //kieu chuyen ve promise
        .then(countries=>{
            return countries;
        })
        .catch(err=>{
            throw err;
        })
    }

    /**
     * Lay danh sach user demo phuc vu so lieu demo
     */
    getRandomUser(nRecord: number){
        return this.httpClient.get('https://randomuser.me/api/?results=' + nRecord)
            .map(res => res['results']) //kieu chuyen ve observable
    }


    getMyIp(){
        return this.httpClient.get('https://ipinfo.io/json')
                .toPromise()
                .then(data => {
                let rtn:any;
                rtn = data;
                return rtn;
                });
    }

    getMyDevice(id?:string){
        return this.httpClient.get('https://c3.mobifone.vn/api/ext-public/your-device'+(id?"?id="+id:""))
                .toPromise()
                .then(data => {
                let rtn:any;
                rtn = data;
                return rtn;
                });
    }


    getDataForm(form:string){
        return this.httpClient.get('assets/data/'+ form)
                .toPromise()
                .then(data => {
                let rtn:any;
                rtn = data;
                return rtn;
                });
    }

    getUserInfoForm(){
        return this.httpClient.get('assets/data/form-register.json')
               .toPromise()
               .then(data => {
                let rtn:any;
                rtn = data;
                return rtn;
                });
    }


    getDemoList(){
        return this.sampleListDynamic;
    }

    getDemoForm(){
        return this.sampleFormDynamic;
    }

    getDemoCard(){
        return this.sampleCardDynamic;
    }

    getDemoMedias(){
        return this.sampleMediasDynamic;
    }

    postDynamicForm(url:string,json_data:any){
        return this.httpClient.post(url,JSON.stringify(json_data))
                .toPromise()
                .then(data => {
                    let rtn:any;
                    rtn = data;
                    return rtn;
                });
    }

    postDynamicFormData(url:string, form_data:any){
        return this.httpClient.post(url,form_data)
                .toPromise()
                .then(data => {
                    let rtn:any;
                    rtn = data;
                    return rtn;
                });
    }

    getDynamicForm(url:string, httpOptions?:any){
        return this.httpClient.get(url,httpOptions)
               .toPromise()
               .then(data => {
                    let rtn:any;
                    rtn = data;
                    return rtn;
                });
    }

    getDynamicFile(url:string){
        return this.httpClient.get(url,{'responseType'  : 'blob' as 'json'})
               .toPromise()
               .then(data => {
                    let rtn:any;
                    rtn = data;
                    return rtn;
                });
    }

}