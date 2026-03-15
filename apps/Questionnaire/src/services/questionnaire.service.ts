import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/Questionnaire/env/env.dev';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionnaireService {
  constructor(
    private _httpClient: HttpClient,
  ) {

  }
  submittion = signal<number>(0)

  getInstanceDetails(externalAccessData: string): Observable<any> {
    return this._httpClient.get(
      enviroment.API_URL +
        `Questionnaire/External/instance/Section/${externalAccessData}`
    );
  }


saveQuestionAnswers(data:{id:number,answer:string}[]):Observable<any>{
  return this._httpClient.post(enviroment.API_URL + 'Questionnaire/update-answers',data)
}

getSectionQuestions(externalAccessData: string, sectionId:number):Observable<any>{

      return this._httpClient.get(
      enviroment.API_URL +
        `Questionnaire/Questionnair/External/instance/${externalAccessData}/Secsion/${sectionId}/Quesions`
    );
}
 closeQuestionnaire(id:string):Observable<unknown>{
    return this._httpClient.post(enviroment.API_URL + `Questionnaire/External/Instance/${id}/Actions/Close`,'')

  }

}
