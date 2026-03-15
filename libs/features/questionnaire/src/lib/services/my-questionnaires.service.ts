import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MyQuestionnairesService {
  constructor(private httpClient: HttpClient) {}
  loadingQuestions = signal<boolean>(false)
  submittion = signal<number>(0)
  getInstanceDetails(id: number): Observable<any> {
    return this.httpClient.get(
      enviroment.API_URL +
        `Questionnaire/Instance/${id}/Sections`
    );
  }


  getMyQuestionnaires(payload:unknown):Observable<unknown>{
    // /api/Questionnaire/instance/MyList
    return this.httpClient.post(`${enviroment.API_URL}Questionnaire/instance/MyList`,payload)
  }

  saveQuestionAnswers(data: { id: number; answer: string }[]): Observable<any> {
    return this.httpClient.post(
      enviroment.API_URL + 'Questionnaire/update-answers',
      data
    );
  }

  getSectionQuestions(
    instanceId: number,
    sectionId: number
  ): Observable<any> {
    return this.httpClient.get(
      enviroment.API_URL +
        `Questionnaire/InstanceQuestions?instanceId=${instanceId}&sectionId=${sectionId}`
    );
  }

  closeQuestionnaire(id:number):Observable<unknown>{
    return this.httpClient.post(enviroment.API_URL + `Questionnaire/Instance/${id}/Actions/Close`,'')

  }
}
