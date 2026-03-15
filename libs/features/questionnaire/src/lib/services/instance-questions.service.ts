import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InstanceQuestionsService {
  base = 'Questionnaire/InstanceQuestions/';
  private readonly searchEndpoint = this.base + 'search';
  // private readonly deleteEndpoint = this.base;
  // private readonly saveEndpoint = this.base;
  // private readonly updateEndpoint = this.base+;
  // private readonly getByIdEndpoint = this.base;
  private readonly idKey = 'questionnaireInstanceQuestionID';

  constructor(private _http: HttpClient) {}
  viewedData =new BehaviorSubject(null)

  findAll(instanceId: string, sectionId: string): Observable<any> {
    return this._http.get(
      `${enviroment.API_URL}${this.base}?instanceId=${instanceId}&sectionId=${sectionId}`
    );
  }

  save(
    data: any,
    instanceId: any,
    sectionId: any,
    questionId?: any,
    dataEntityTpeId?:any,
    dataEntityId?:any


  ): Observable<any> {
    const method = questionId ? 'put' : 'post';
    if (!questionId) {
      data = {
        questions: data,
      };
    }

    data = {
      ...data,
      questionnaireInstanceID: instanceId,
      questionnaireInstanceSectionID: sectionId,
      dataEntityId:dataEntityId,
      dataEntityTpeId:dataEntityTpeId
    };

    console.log(data,'data from service');

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
