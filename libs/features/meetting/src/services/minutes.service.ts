import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MinutesService {

    constructor(private _HttpClient:HttpClient){}
    baseURL = 'Meeting/MeetingMinutes'
    getMinutesSearch(
      sort_data: any = null,
      pageNumber: number = 1,
      perPage: number = 10,
      filters: any[] = [],
      meetingID:any,
    ): Observable<any> {
      const req = {
        search: '',
        dataViewId: 1,
        pageNumber: pageNumber,
        pageSize: perPage,
        filters: filters,
        sortField: sort_data?.field,
        sortDirection: sort_data?.direction,
        meetingID
      };
      return this._HttpClient.post(enviroment.API_URL + 'Meeting/MeetingMinutes/search', req);
    }


  saveMinutes(data: any, meetingID: any, minuteId: any): Observable<any> {
    const method = minuteId ? 'put':'post'
    if (minuteId) {
      data = { ...data, meetingMinuteID: minuteId };
    }
    const payload = { ...data, meetingID };
    return this._HttpClient[method](
      enviroment.API_URL + this.baseURL,
      payload
    );
  }

    getMinutesById(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `${this.baseURL}/${id}`
    );
  }

  deleteMinutes(meetingMinuteID:any):Observable<any>{
    return this._HttpClient.delete(enviroment.API_URL +this.baseURL,{
      body:{
        meetingMinuteID
      }
    })
  }

}
