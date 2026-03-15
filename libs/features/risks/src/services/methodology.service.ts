/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
@Injectable({
  providedIn: 'root',
})
export class MothodologyService {
  private readonly searchEndpoint = 'RiskMethodology/Search';
  private readonly deleteEndpoint = 'RiskMethodology';
  private readonly saveEndpoint = 'RiskMethodology';
  private readonly updateEndpoint = 'RiskMethodology';
  private readonly getByIdEndpoint = 'RiskMethodology';
  private readonly idKey = 'riskMethodologyID';

  constructor(private _http: HttpClient) {}
  viewedData=new BehaviorSubject(null)
  findAll(
    payload:any,
    extraFields: any = {}
  ): Observable<any> {
    const req = {
      ...payload,
      ...extraFields,
    };
    return this._http.post(`${enviroment.API_URL}${this.searchEndpoint}`, req);
  }

  save(data: any, id?: any): Observable<any> {
    const method = id ? 'put' : 'post';
    const endpoint = id ? this.updateEndpoint : this.saveEndpoint;
    if(id){
      data = {...data, [this.idKey]:id}
    }
    return this._http[method](`${enviroment.API_URL}${endpoint}`, data);
  }

  delete(id: any): Observable<any> {
    return this._http.delete(
      `${enviroment.API_URL}${this.deleteEndpoint}/${id}`
    );
  }

  getById(id: any): Observable<any> {
    return this._http.get(`${enviroment.API_URL}${this.getByIdEndpoint}/${id}`);
  }



  getFactorsByMethodologyID(id:any):Observable<any>{
    return this._http.get(enviroment.API_URL + `RiskMethodology/RiskFactor/RiskMethodology/${id}`)
  }
}
