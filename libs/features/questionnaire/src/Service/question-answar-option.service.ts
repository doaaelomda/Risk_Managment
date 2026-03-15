import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionAnswarOptionService {

  constructor(private _HttpClient: HttpClient) {}
   // ========================= QUESTION ANSWERS ========================= //
getDataTable(payload:any,questionnaireQuestionID?:any): Observable<any> {
  const url = `${enviroment.API_URL}Questionnaire/QuestionnaireAnswerOption/search`;
  payload['questionnaireQuestionID']=questionnaireQuestionID
  return this._HttpClient.post(url, payload);
}

  getQuestionAnswerOptionById(answerId: any): Observable<any> {
    return this._HttpClient.get(
      `${enviroment.API_URL}Questionnaire/Question/QuestionnaireAnswerOption/${answerId}`
    );
  }

   save(data: any, id?: any): Observable<any> {
    if (id) {
      return this._HttpClient.put(
        `${enviroment.API_URL}Questionnaire/Question/QuestionnaireAnswerOption`,
        data
      );
    } else {
      return this._HttpClient.post(
        `${enviroment.API_URL}Questionnaire/Question/QuestionnaireAnswerOption`,
        data
      );
    }
  }

  delete(answerId: any): Observable<any> {
    return this._HttpClient.delete(
      `${enviroment.API_URL}Questionnaire/Question/QuestionnaireAnswerOption/${answerId}`
    );
  }
}
