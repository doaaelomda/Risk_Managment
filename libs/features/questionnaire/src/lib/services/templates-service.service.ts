import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// ✅ Correct environment import (make sure the file name is accurate)
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';

@Injectable({
  providedIn: 'root',
})
export class TemplatesService {
  base = 'Questionnaire/template/'
  private readonly searchEndpoint = this.base +'search';
  // private readonly deleteEndpoint = this.base;
  // private readonly saveEndpoint = this.base;
  // private readonly updateEndpoint = this.base+;
  // private readonly getByIdEndpoint = this.base;
  private readonly idKey = 'questionnaireTemplateID';


  constructor(private _http: HttpClient) {}


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

  save(
    data: any,
    id?: any
  ): Observable<any> {
    const method = id ? 'put' : 'post';
    const payload = id ? { ...data, [this.idKey]: id } : data;
    return this._http[method](`${enviroment.API_URL}${this.base}`, payload);
  }

  delete(
    id: any
  ): Observable<any> {
    return this._http.delete(`${enviroment.API_URL}${this.base}${id}`);
  }

  getById(
    id: any
  ): Observable<any> {
    return this._http.get(`${enviroment.API_URL}${this.base}${id}`);
  }
}
