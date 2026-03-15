/* eslint-disable @nx/enforce-module-boundaries */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  constructor(private _HttpClient: HttpClient) {}

  getIncidentById(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `Incident/Id?IncidentID=${id}`
    );
  }

  deleteIncident(id: any): Observable<any> {
  return this._HttpClient.delete(enviroment.API_URL + `Incident/Id`, {
  body: { incidentID: id },
});
  }

  getIncidentsSearch(req?:any
  ): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + 'Incident/Search', req);
  }

  addNewIncident(data: any): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + `Incident`, data);
  }

  updateIncident(data: any): Observable<any> {
    return this._HttpClient.put(enviroment.API_URL + `Incident/Id`, data);
  }


    // General LessonLearn Api

  getLessonLearnList(
    payload:any,
    investigatID?: any,
    dataEntityID?: any,
    dataEntityTypeID?: any
  ): Observable<any> {

    payload['investigatID']=investigatID
     payload['dataEntityID']=dataEntityID
      payload['dataEntityTypeID']=dataEntityTypeID
    return this._HttpClient.post(enviroment.API_URL + 'LessonsLearned/Search', payload);
  }

  addLessonLearn(data: any): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + `LessonsLearned`, data);
  }

  updateLessonLearn(data: any, id: any): Observable<any> {
    data.lessonsLearnedID = id;
    return this._HttpClient.put(enviroment.API_URL + `LessonsLearned/Id`, data);
  }

  getLessonLearnById(id: any): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + `LessonsLearned/Id?LessonsLearnedID=${id}`);
  }

  deleteLessonLearn(id: any): Observable<any> {
    return this._HttpClient.delete(enviroment.API_URL + `LessonsLearned/Id`,{
      body:{
        lessonsLearnedID:id
      }
    });
  }


// Route Cause

  getRouteCauseList(
    sort_data: any = null,
    pageNumber: number = 1,
    perPage: number = 10,
    filters: any[] = [],
    dataEntityID?: any,
    dataEntityTypeID?: any
  ): Observable<any> {
    const req = {
      search: '',
      dataViewId: 1,
      pageNumber: pageNumber,
      pageSize: perPage,
      filters: filters,
      sortField: sort_data?.field,
      sortDirection: sort_data?.direction,
      dataEntityID: dataEntityID,
      dataEntityTypeID: dataEntityTypeID,
    };
    return this._HttpClient.post(enviroment.API_URL + 'RootCause/Search', req);
  }

  addRouteCause(data: any): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + `RootCause`, data);
  }

  updateRouteCause(data: any, id: any): Observable<any> {
    data.rootCauseID = id;
    return this._HttpClient.put(enviroment.API_URL + `RootCause/Id`, data);
  }

  getRouteCauseById(id: any): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + `RootCause/${id}`);
  }

  deleteRouteCause(id: any): Observable<any> {
    return this._HttpClient.delete(enviroment.API_URL + `RootCause/Id`,{
      body:{
        rootCauseID:id
      }
    });
  }














}
