/* eslint-disable @nx/enforce-module-boundaries */
import { enviroment } from './../../../../../apps/gfw-portal/env/dev.env';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class SimpleAssessmentService{
    constructor(private _HttpClient: HttpClient) {}




    updateSimpleRiskAssessment(data:any):Observable<any>{
      return this._HttpClient.put(enviroment.API_URL + `Risks/SimpleRiskAssessment` , data)
    }

}
