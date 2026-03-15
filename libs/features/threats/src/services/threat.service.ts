import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThreatService {
  constructor(private _HttpClient: HttpClient) {}

  getThreatSearch(
    req?:any
  ): Observable<any> {

    return this._HttpClient.post(
      enviroment.API_URL + 'Threat/Search',
      req
    );
  }

  deleteThreat(id: any): Observable<any> {
    return this._HttpClient.delete(enviroment.API_URL + `Threat/${id}`);
  }

  getThreatById(id: any): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + `Threat/${id}`);
  }

  addThreat(req: any): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + `Threat`, req);
  }
  updateThreat(req: any): Observable<any> {
    return this._HttpClient.put(enviroment.API_URL + `Threat`, req);
  }
}
