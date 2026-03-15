/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { enviroment } from "apps/gfw-portal/env/dev.env";
@Injectable({
  providedIn:'root'
})

export class MeetingsService{

  constructor(private _HttpClient:HttpClient){}





  current_meeting_data:BehaviorSubject<any> =  new BehaviorSubject<any>(null)


  getMeetingsSearch(
    req:any
  ): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + 'Meeting/Search', req);
  }


  deleteMeeting(id:any):Observable<any>{
    return this._HttpClient.delete(enviroment.API_URL +`Meeting`,{
      body:{
        meetingID:id
      }
    })
  }



  addMeeting(req:any):Observable<any>{
    return this._HttpClient.post(enviroment.API_URL + `Meeting` , req)
  }
  updateMeeting(req:any):Observable<any>{
    return this._HttpClient.put(enviroment.API_URL + `Meeting` , req)
  }


  getMeetingById(id:any):Observable<any>{
    return this._HttpClient.get(enviroment.API_URL + `Meeting/${id}`)
  }
}
