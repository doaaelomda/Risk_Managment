import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MethodologyToleranceService {

  constructor(private _HttpClient:HttpClient) { }

  // tolerance Api

  gettolerance(
    payload:any,
    riskMethodologyID: any
  ): Observable<any> {
    const req = {
      ...payload,
      riskMethodologyID: riskMethodologyID,
    };
    return this._HttpClient.post(
      enviroment.API_URL + 'RiskMethodology/SearchRiskTolerances',
      req
    );
  }
  gettoleranceById(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `RiskMethodology/RiskTolerance/${id}`
    );
  }
  deletetolerance(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + 'RiskMethodology/RiskTolerance/' + id
    );
  }

  createtolerance(data: any): Observable<any> {
  return this._HttpClient.post(
    enviroment.API_URL + 'RiskMethodology/RiskTolerance',
    data
  );
}

updatetolerance(data: any): Observable<any> {
  return this._HttpClient.put(
    enviroment.API_URL + 'RiskMethodology/RiskTolerance',
    data
  );
}
}

