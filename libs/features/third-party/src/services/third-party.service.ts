/* eslint-disable @nx/enforce-module-boundaries */
import { enviroment } from './../../../../../apps/gfw-portal/env/dev.env';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
  providedIn:'root'
})


export class ThirdPartyService{
  constructor(private _HttpClient:HttpClient){}



    getThirdPartyListSearch(
 req:any
  ): Observable<any> {

    return this._HttpClient.post(enviroment.API_URL + 'ThirdParty/Search', req);
  }


  deleteThirdParty(id:any):Observable<any>{
    return this._HttpClient.delete(enviroment.API_URL + `ThirdParty`,{
      body:{
        thirdPartyID:id
      }
    })
  }

  getThirdPartyById(id:any):Observable<any>{
    return this._HttpClient.get(enviroment.API_URL + `ThirdParty?ThirdPartyID=${id}`)
  }

  addThirdParty(req:any):Observable<any>{
    return this._HttpClient.post(enviroment.API_URL + `ThirdParty` , req)
  }

  updateThirdParty(req:any):Observable<any>{
    return this._HttpClient.put(enviroment.API_URL + `ThirdParty` , req)
  }
}
