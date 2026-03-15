import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(private _HttpClient: HttpClient) {}

  // ========================= GET QUESTION LIST ========================= //
  getQuestionSearch(
    payload:any){
    return this._HttpClient.post(
      `${enviroment.API_URL}Questionnaire/question/search`,
      payload
    );
  }

  deleteQuestion(id: any): Observable<any> {
    return this._HttpClient.delete(
      `${enviroment.API_URL}Questionnaire/question/${id}`
    );
  }

  getQuestionById(id: any): Observable<any> {
    return this._HttpClient.get(
      `${enviroment.API_URL}Questionnaire/question/${id}`
    );
  }

  addQuestion(req: any): Observable<any> {
    return this._HttpClient.post(
      `${enviroment.API_URL}Questionnaire/question`,
      req
    );
  }

  updateQuestion(req: any): Observable<any> {
    return this._HttpClient.put(
      `${enviroment.API_URL}Questionnaire/question`,
      req
    );
  }

  // ========================= QUESTION ANSWERS ========================= //
getQuestionAnswer(filters: any = {}): Observable<any> {
  const url = `${enviroment.API_URL}Questionnaire/answer/option/search`;
  return this._HttpClient.post(url, filters);
}

  getQuestionAnswerById(answerId: any): Observable<any> {
    return this._HttpClient.get(
      `${enviroment.API_URL}Questionnaire/answer/option/${answerId}`
    );
  }

  saveQuestionAnswer(data: any, answerId?: any): Observable<any> {
    if (answerId) {
      return this._HttpClient.put(
        `${enviroment.API_URL}Questionnaire/answer/option`,
        data
      );
    } else {
      return this._HttpClient.post(
        `${enviroment.API_URL}Questionnaire/answer/option`,
        data
      );
    }
  }

  deleteQuestionAnswer(answerId: any): Observable<any> {
    return this._HttpClient.delete(
      `${enviroment.API_URL}Questionnaire/answer/option/${answerId}`
    );
  }
}
