import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

var token:string;

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   if (token){
     //console.log('request with token interceptor!')
     request = request.clone(
       {
         setHeaders: {
           Authorization: 'Bearer ' + token
         }
       });
   }
    return next.handle(request)
  }
  
  setRequestToken(tk?:string){
    if (tk){
      token = tk;
    }else{
      token = '';
    }
  }

}