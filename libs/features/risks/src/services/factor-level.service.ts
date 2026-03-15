import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FactorsService {
  private readonly searchEndpoint = 'RiskMethodology/RiskFactor/Search';
  private readonly deleteEndpoint = 'RiskMethodology/RiskFactor';
  private readonly saveEndpoint = 'RiskMethodology/RiskFactor';
  private readonly updateEndpoint = 'RiskMethodology/RiskFactor';
  private readonly getByIdEndpoint = 'RiskMethodology/RiskFactor';
  private readonly idKey = 'riskLevelID';

  private readonly searchfactorLevelEndpoint =
    'RiskMethodology/RiskFactorLevels/Search';
  private readonly deletefactorLeveEndpoint =
    'RiskMethodology/RiskFactorLevels';
  private readonly savefactorLeveEndpoint = 'RiskMethodology/RiskFactorLevels';
  private readonly updatefactorLeveEndpoint =
    'RiskMethodology/RiskFactorLevels';
  private readonly getByIdfactorLeveEndpoint =
    'RiskMethodology/RiskFactorLevels';
  viewedData = new BehaviorSubject(null);

  constructor(private _http: HttpClient) {}

  findAll(payload: any, riskMethodologyID: any): Observable<any> {
    payload['riskMethodologyID'] = riskMethodologyID;
    return this._http.post(
      `${enviroment.API_URL}${this.searchEndpoint}`,
      payload
    );
  }
  save(data: any, id?: any): Observable<any> {
    const method = id ? 'put' : 'post';
    const endpoint = id ? this.updateEndpoint : this.saveEndpoint;
    if (id) {
      data = { ...data };
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

  findAllFactorLevel(
    payload: any,
    riskMethodologyID: any,
    riskFactorID: any
  ): Observable<any> {
    payload['riskMethodologyID'] = riskMethodologyID;
    payload['riskFactorID'] = riskFactorID;
    return this._http.post(
      `${enviroment.API_URL}${this.searchfactorLevelEndpoint}`,
      payload
    );
  }
  saveFactorLevel(data: any, id?: any): Observable<any> {
    const method = id ? 'put' : 'post';
    const endpoint = id
      ? this.updatefactorLeveEndpoint
      : this.savefactorLeveEndpoint;
    if (id) {
      data = { ...data, [this.idKey]: id };
    }
    return this._http[method](`${enviroment.API_URL}${endpoint}`, data);
  }
  deleteFactorLevel(id: any): Observable<any> {
    return this._http.delete(
      `${enviroment.API_URL}${this.deletefactorLeveEndpoint}/${id}`
    );
  }
  getByIdFactorLevel(id: any): Observable<any> {
    return this._http.get(
      `${enviroment.API_URL}${this.getByIdfactorLeveEndpoint}/${id}`
    );
  }
}
