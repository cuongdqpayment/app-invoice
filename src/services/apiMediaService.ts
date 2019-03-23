import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiStorageService } from './apiStorageService';
import { RequestInterceptor } from '../interceptors/requestInterceptor';

@Injectable()
export class ApiMediaService {

    mediaServer = ApiStorageService.mediaServer;

    token:any;

    constructor(private httpClient: HttpClient,
                private reqInterceptor: RequestInterceptor //muon thay doi token gui kem thi ghi token moi
                ) {}

    /**
     * truyen len {token:'...'}
     * @param jsonString 
     */
    authorizeFromResource(token){
        this.reqInterceptor.setRequestToken(token); //neu thanh cong thi cac phien sau se gan them bear
        return this.httpClient.post(this.mediaServer + '/auth/authorize-token', JSON.stringify({check: true}))
            .toPromise()
            .then(data => {
                let rtn:any;
                rtn = data;
                this.token = token;
                return rtn;
            })
            .catch(err=>{
                this.token = null;
                this.reqInterceptor.setRequestToken(null); 
                throw err;
            });
    }

    listFiles(){
        //this.reqInterceptor.setRequestToken(this.token);
        return this.httpClient.get(this.mediaServer + '/db/list-files')
            .toPromise()
            .then(data => {
                let rtn:any;
                rtn = data;
                return rtn;
            })
            .catch(err=>{
                this.token = null;
                this.reqInterceptor.setRequestToken(null); 
                throw err;
            });
    }

}