import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
  } from '@angular/common/http';

import { HttpResponse, HttpErrorResponse } from '@angular/common/http/';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    return next.handle(request).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        //console.log('May chu cho phep va truy cap voi event:');
        //console.log(event);
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        console.log('May chu Khong cho phep hoac loi:');
        console.log(err);
      }
    });
  }
}
