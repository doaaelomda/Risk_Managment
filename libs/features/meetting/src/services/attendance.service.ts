/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { HttpClient } from "@angular/common/http";
import { enviroment } from "apps/gfw-portal/env/dev.env";

@Injectable({
  providedIn:'root'
})


export class AttendanceService{

  constructor(private _HttpClient:HttpClient){}
    baseURL = 'Meeting/Attendee'
    getAttendanceSearch(
      payload:any,
      meetingID:any,
    ): Observable<any> {
      const req = {
        ...payload,
        meetingID
      };
      return this._HttpClient.post(enviroment.API_URL + 'Meeting/Attendee/search', req);
    }


  saveAttendance(data: any, meetingID: any, attendanceId: any): Observable<any> {
    const method = attendanceId ? 'put':'post'
    if (attendanceId) {
      data = { ...data, meetingAttendeeID: attendanceId };
    }
    const payload = { ...data, meetingID };
    return this._HttpClient[method](
      enviroment.API_URL + this.baseURL,
      payload
    );
  }

    getAttendanceById(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `Meeting/MeetingAttendee/${id}`
    );
  }

  deleteAttendance(meetingAttendeeID:any):Observable<any>{
    return this._HttpClient.delete(enviroment.API_URL +`Meeting/Attendee`,{
      body:{
        meetingAttendeeID
      }
    })
  }

  getSummary(meetingId:number):Observable<any>{
    return this._HttpClient.get(enviroment.API_URL + `Meeting/api/Meeting/${meetingId}/attendance-summary`)
  }

}
