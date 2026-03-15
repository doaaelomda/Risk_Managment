import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MethodologyFormulaService {
  constructor(private httpClient: HttpClient) {}
  viewedData = new BehaviorSubject(null)
  getFactors(id:any): Observable<any> {
    return this.httpClient.get(
      enviroment.API_URL + `RiskMethodology/RiskFactor/RiskMethodology/${id}`
    );
  }

  save(data: any, riskMethodologyFormulaID: string | number) {
    const method = riskMethodologyFormulaID ? 'put' : 'post';
    const url = riskMethodologyFormulaID
      ? 'RiskMethodology/Formulas'
      : 'RiskMethodology/Formula';
    if (riskMethodologyFormulaID) {
      data = { ...data, riskMethodologyFormulaID };
    }
    return this.httpClient[method](enviroment.API_URL + url, data);
  }

  findAll(riskMethodologyID: string | number): Observable<any> {
    return this.httpClient.post(
      `${enviroment.API_URL}RiskMethodology/Formulas`,
      { riskMethodologyID }
    );
  }

  getById(id: string | number): Observable<any> {
    return this.httpClient.get(
      enviroment.API_URL + `RiskMethodology/Formula/${id}`
    );
  }

  delete(id: string | number): Observable<any> {
    return this.httpClient.delete(
      enviroment.API_URL + `RiskMethodology/Formula/${id}`
    );
  }
}
