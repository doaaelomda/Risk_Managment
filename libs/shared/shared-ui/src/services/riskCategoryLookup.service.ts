/* eslint-disable @nx/enforce-module-boundaries */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RiskCategoryLookupService {
  constructor(private _HttpClient: HttpClient) {}

  getCategoryList(
    pageNumber: number,
    pageSize: number,
    search: string,
    riskMethodologyID: string
  ): Observable<any> {
    const req = {
      search: search,
      pageNumber: pageNumber,
      pageSize: pageSize,
      riskMethodologyID,
    };

    return this._HttpClient.post(
      enviroment.API_URL + `RiskMethodology/SearchRiskCategorys`,
      req
    );
  }

  getDefinitionById(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + 'RiskMethodology/RiskCategory/' + id
    );
  }
  deleteDef(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + `RiskMethodology/RiskCategory/${id}`
    );
  }

  saveDef(payload: any, riskCategoryID?: any) {
    if (riskCategoryID) {
      payload = { ...payload, riskCategoryID };
    }
    payload = { ...payload };
    const method = riskCategoryID ? 'put' : 'post';
    const url =
      method === 'put'
        ? `RiskMethodology/RiskCategorys`
        : 'RiskMethodology/RiskCategory';
    return this._HttpClient[method](enviroment.API_URL + url, payload);
  }
}
