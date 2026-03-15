/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { enviroment } from "apps/gfw-portal/env/dev.env";
@Injectable({
  providedIn:'root'
})

export class LinkedModuleService{
  constructor(private _HttpClient:HttpClient){}


  linkedMapByGroupId(id:any):Observable<any>{
    return this._HttpClient.get(enviroment.API_URL + `DataEntityTypeMap/GetByGroup/${id}`)
  }


  entityLink(req:any):Observable<any>{
    return this._HttpClient.post(enviroment.API_URL + `EntityLink/Link` , req)
  }



}
