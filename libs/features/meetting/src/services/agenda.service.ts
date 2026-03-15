import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

   constructor(private _HttpClient:HttpClient){}
    baseURL = 'Meeting/Agenda'
    getAgendaSearch(
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
      return this._HttpClient.post(enviroment.API_URL + 'Meeting/Agenda/search', req);
    }


  saveAgenda(data: any, meetingID: any, agendaId: any): Observable<any> {
    const method = agendaId ? 'put':'post'
    if (agendaId) {
      data = { ...data, meetingAgendaID: agendaId };
    }
    const payload = { ...data, meetingID };
    return this._HttpClient[method](
      enviroment.API_URL + this.baseURL,
      payload
    );
  }

    getAgendaById(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `${this.baseURL}/${id}`
    );
  }

  deleteAgenda(meetingAgendaID:any):Observable<any>{
    return this._HttpClient.delete(enviroment.API_URL +this.baseURL,{
      body:{
        meetingAgendaID
      }
    })
  }

  getAttendeeNames(id:string):Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + 'Meeting/MeetingAttendeeNames/'+id)
  }
}
