import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormulaFactorsService {
  constructor(private httpClient: HttpClient) {}

  getList(payload?: {
    search?: string | null;
    filters?: unknown[];
    pageNumber?: number;
    pageSize?: number;
    sortField?: string | null;
    sortDirection?: number;
  }): Observable<unknown> {
    return this.httpClient.post(
      enviroment.API_URL + 'RiskMethodology/FormulaFactors/Search',
      payload
    );
  }

  delete(id: number): Observable<unknown> {
    return this.httpClient.delete(
      `${enviroment.API_URL}RiskMethodology/FormulaFactors/${id}`
    );
  }



  getFactorsByFormulaID(id:any):Observable<any>{
    return this.httpClient.get(enviroment.API_URL + `RiskMethodology/Formula/${id}/factors`)
  }
}
