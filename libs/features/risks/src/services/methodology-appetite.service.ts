import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MethodologyAppetiteService {

  constructor(private _HttpClient:HttpClient) { }

  // Appetite Api

  getAppetite(
    payload:any,
    riskMethodologyID: any
  ): Observable<any> {
    const req = {
      ...payload,
      riskMethodologyID: riskMethodologyID,
    };
    return this._HttpClient.post(
      enviroment.API_URL + 'RiskMethodology/SearchRiskAppetites',
      req
    );
  }
  getAppetiteById(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `RiskMethodology/RiskAppetite/${id}`
    );
  }
  deleteAppetite(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + 'RiskMethodology/RiskAppetite/' + id
    );
  }

  createAppetite(data: any): Observable<any> {
  return this._HttpClient.post(
    enviroment.API_URL + 'RiskMethodology/RiskAppetite',
    data
  );
}

updateAppetite(data: any): Observable<any> {
  return this._HttpClient.put(
    enviroment.API_URL + 'RiskMethodology/RiskAppetite',
    data
  );
}
}
