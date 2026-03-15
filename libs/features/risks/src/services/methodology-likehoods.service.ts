import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MethodologyLikehoodsService {

  private readonly searchEndpoint = 'RiskMethodology/SearchRiskLikelihoods';
  private readonly deleteEndpoint = 'RiskMethodology/RiskLikelihoods';
  private readonly saveEndpoint = 'RiskMethodology/RiskLikelihoods';
  private readonly updateEndpoint = 'RiskMethodology/RiskLikelihoods';
  private readonly getByIdEndpoint = 'RiskMethodology/RiskLikelihoods';
  private readonly idKey = 'riskLikelihoodID';

  constructor(private _http: HttpClient) {}
  viewedData = new BehaviorSubject(null)
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
    if (id) {
      data = { ...data, [this.idKey]: id };
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
}
