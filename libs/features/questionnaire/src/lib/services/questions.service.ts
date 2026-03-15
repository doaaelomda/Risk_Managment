/* eslint-disable @nx/enforce-module-boundaries */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  base = 'Questionnaire/template/question/';
  private readonly searchEndpoint = this.base + 'search';
  // private readonly deleteEndpoint = this.base;
  // private readonly saveEndpoint = this.base;
  // private readonly updateEndpoint = this.base+;
  // private readonly getByIdEndpoint = this.base;
  private readonly idKey = 'questionnaireTemplateQuestionID';

  constructor(private _http: HttpClient) {}

  findAll(sectionId: string): Observable<any> {
    const req = { questionnaireTemplateSectionID: sectionId };
    return this._http.post(`${enviroment.API_URL}${this.searchEndpoint}`, req);
  }

  save(
    data: any,
    templateId: any,
    sectionId: any,
    questionId?: any
  ): Observable<any> {
    const method = questionId ? 'put' : 'post';
    if (!questionId) {
      data = {
        questions: data,
      };
    }

    data = {
      ...data,
      questionnaireTemplateID: templateId,
      questionnaireTemplateSectionID: sectionId,
    };
    const payload = questionId ? { ...data, [this.idKey]: questionId } : data;
    return this._http[method](`${enviroment.API_URL}${this.base}`, payload);
  }

  delete(id: any): Observable<any> {
    return this._http.delete(`${enviroment.API_URL}${this.base}${id}`);
  }

  getById(id: any): Observable<any> {
    return this._http.get(`${enviroment.API_URL}${this.base}${id}`);
  }

  getQuestionsList(
    search: any = '',
    pageNumber: number = 1,
    perPage: number = 10
  ): Observable<any> {
    const req = {
      search,
      pageNumber,
      pageSize: perPage,
    };
    return this._http.post(
      enviroment.API_URL + 'Questionnaire/question/search',
      req
    );
  }
}
