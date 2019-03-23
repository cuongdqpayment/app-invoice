import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiStorageService } from './apiStorageService';
import { RequestInterceptor } from '../interceptors/requestInterceptor';

@Injectable()
export class ApiResourceService {

    resourceServer = ApiStorageService.resourceServer;
    token:any;

    constructor(private httpClient: HttpClient,
                private reqInterceptor: RequestInterceptor //muon thay doi token gui kem thi ghi token moi
                ) {}




    /**
     * Tao file pdf de in an
     * trả về danh mục các file hóa đơn đã tạo trên máy chủ
     * [{201901_print_all.pdf}]
     * @param billCycle 
     */    
    createPdfInvoices(billCycle){
        return this.httpClient.post(this.resourceServer+'/db/pdf-invoices'
                                    ,JSON.stringify({
                                        bill_cycle: billCycle.bill_cycle,
                                        cust_id: billCycle.cust_id,
                                        background:billCycle.background
                                    }))
        .toPromise()
        .then(data => {
            let rtn:any;
            rtn = data;
            return rtn;
        });
    }

    /**
     * get hoa don (phai tao truoc, neu khong se không có file)
     * @param yyyymm_cust_id 
     */
    getPdfInvoices(yyyymm_cust_id){
        const httpOptions = {
            'responseType'  : 'arraybuffer' as 'json'
             //'responseType'  : 'blob' as 'json'        //This also worked
          };
        return this.httpClient.get(this.resourceServer+'/db/pdf-invoices/'+yyyymm_cust_id,httpOptions)
        .toPromise()
        .then(data => {
            let rtn:any;
            rtn = data;
            return rtn;
        });
    }

    /**
     * billCycle = 
     * {
     * bill_cycle:
     * bill_date:
     * invoice_no: 
     * cust_id: 
     * }
     */
    createInvoices(billCycle){
        return this.httpClient.post(this.resourceServer+'/db/create-invoices'
        ,JSON.stringify({
            bill_cycle: billCycle.bill_cycle,
            bill_date: billCycle.bill_date,
            invoice_no: billCycle.invoice_no,
            cust_id: billCycle.cust_id
        }))
        .toPromise()
        .then(data => {
            let rtn:any;
            rtn = data;
            return rtn;
        });
    }

    /**
     * yyyymm_custId = 201901 hoac 201901/R000000001
     */
    getInvoices(yyyymm_custId){
        return this.httpClient.get(this.resourceServer+'/db/json-invoices/'+yyyymm_custId)
        .toPromise()
        .then(data => {
            let rtn:any;
            rtn = data;
            return rtn;
        })
    }

    /**
     * lay ky cuoc da tao trong csdl
     */
    getBillCycle(){
        return this.httpClient.get(this.resourceServer+'/db/json-bill-cycles')
        .toPromise()
        .then(data => {
            let rtn:any;
            rtn = data;
            return rtn;
        })
    }

    getAllCutomers(){
        return this.httpClient.get(this.resourceServer+'/db/json-customers')
        .toPromise()
        .then(data => {
            let rtn:any;
            rtn = data;
            return rtn;
        })
    }

    getParamters(){
        return this.httpClient.get(this.resourceServer+'/db/json-parameters')
        .toPromise()
        .then(data => {
            let rtn:any;
            rtn = data;
            return rtn;
        })
    }


    /**
     * truyen len {token:'...'}
     * @param jsonString 
     */
    authorizeFromResource(token){
        this.reqInterceptor.setRequestToken(token); //neu thanh cong thi cac phien sau se gan them bear
        return this.httpClient.post(this.resourceServer + '/auth/authorize-token', JSON.stringify({check: true}))
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

}