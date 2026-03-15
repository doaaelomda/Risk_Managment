import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProcessListService {
  constructor(private _HttpClient: HttpClient) {}

  getprocessById(id: any): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + `BPM/Process/${id}`);
  }

  deleteprocess(id: any): Observable<any> {
    return this._HttpClient.delete(enviroment.API_URL + `BPM/Process/${id}`);
  }

  getprocesssSearch(
    req:any
  ): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'BPM/Process/Search',
      req
    );
  }

  addNewprocess(data: any): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + `BPM/Process`, data);
  }

  updateprocess(data: any): Observable<any> {
    return this._HttpClient.put(enviroment.API_URL + `BPM/Process`, data);
  }

  // Procedure api

  getprocedureSearch(
    payload?:any,
    businessProcessID?: any
  ): Observable<any> {
    payload['businessProcessID']=businessProcessID
    return this._HttpClient.post(
      enviroment.API_URL + 'BPM/Procedure/Search',
      payload
    );
  }

  deleteProcedure(id: any): Observable<any> {
    return this._HttpClient.delete(`${enviroment.API_URL}BPM/Procedure`, {
      body: {
        businessProcedureID: id,
      },
    });
  }

  getproceduresById(id: any): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + `BPM/Procedure?BusinessProcedureID=${id}`);
  }
  addNewprocedure(data: any): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + `BPM/Procedure`, data);
  }

  updateprocedure(data: any): Observable<any> {
    return this._HttpClient.put(enviroment.API_URL + `BPM/Procedure`, data);
  }
}
