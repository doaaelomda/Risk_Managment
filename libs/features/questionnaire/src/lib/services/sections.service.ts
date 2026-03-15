/* eslint-disable @nx/enforce-module-boundaries */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SectionsService {
  base = 'Questionnaire/template/section/';
  private readonly searchEndpoint = this.base + 'search';
  // private readonly deleteEndpoint = this.base;
  // private readonly saveEndpoint = this.base;
  // private readonly updateEndpoint = this.base+;
  // private readonly getByIdEndpoint = this.base;
  private readonly idKey = 'questionnaireTemplateSectionID';

  constructor(private _http: HttpClient) {}

  findAll(templateId:string): Observable<any> {
    const req = {questionnaireTemplateID:templateId};
    return this._http.post(`${enviroment.API_URL}${this.searchEndpoint}`, req);
  }

  save(data: any, templateId: any,sectionId?:any): Observable<any> {
    const method = sectionId ? 'put' : 'post';
    data = {...data, questionnaireTemplateID:templateId}
    const payload = sectionId ? { ...data, [this.idKey]: sectionId } : data;
    return this._http[method](`${enviroment.API_URL}${this.base}`, payload);
  }

  delete(id: any): Observable<any> {
    return this._http.delete(`${enviroment.API_URL}${this.base}${id}`);
  }

  getById(id: any): Observable<any> {
    return this._http.get(`${enviroment.API_URL}${this.base}${id}`);
  }
}
