import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
@Injectable({
  providedIn: 'root',
})
export class AwarenessService {
  constructor(private _HttpClient: HttpClient) {}
  saveDocsContent(data: {
    campaignId: number;
    govDocumentId: number;
  }): Observable<any> {
    return this._HttpClient.put(
      enviroment.API_URL + 'Awareness/Campaign/Content',
      data
    );
  }
  getAwarenessList(
    sort_data: any = null,
    pageNumber: number = 1,
    perPage: number = 10,
    filters: any[] = []
  ): Observable<any> {
    const req = {
      search: '',
      dataViewId: 1,
      pageNumber: pageNumber,
      pageSize: perPage,
      filters: filters,
      sortField: sort_data?.field,
      sortDirection: sort_data?.direction,
    };
    return this._HttpClient.post(
      enviroment.API_URL + 'Awareness/Campaign/Search',
      req
    );
  }

  deleteAwareness(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + `Awareness/Campaign/${id}`
    );
  }

  addCampaign(req: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + `Awareness/Campaign`,
      req
    );
  }

  updateCampaign(req: any): Observable<any> {
    return this._HttpClient.put(`${enviroment.API_URL}Awareness/Campaign`, req);
  }

  getCampaignById(id: any): Observable<any> {
    return this._HttpClient.get(
      `${enviroment.API_URL}Awareness/Campaign/${id}`
    );
  }

  // Audience Api

  getAduianceList(payload: any, awarenessCampaignID: any): Observable<any> {
    payload['awarenessCampaignID'] = awarenessCampaignID;
    return this._HttpClient.post(
      enviroment.API_URL + 'Awareness/Audience/Search',
      payload
    );
  }

  deleteAduiance(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + `Awareness/Audience/${id}`
    );
  }

  addAduiance(req: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + `Awareness/Audience`,
      req
    );
  }

  updateAduiance(req: any): Observable<any> {
    return this._HttpClient.put(
      `${enviroment.API_URL}Awareness/Audience/`,
      req
    );
  }

  getAduianceById(id: any): Observable<any> {
    return this._HttpClient.get(
      `${enviroment.API_URL}Awareness/Audience/${id}`
    );
  }

  // Quiz Api

  getQuizList(payload?: any, awarenessCampaignID?: any): Observable<any> {
    payload['awarenessCampaignID'] = awarenessCampaignID;
    return this._HttpClient.post(
      enviroment.API_URL + 'Awareness/Quiz/Search',
      payload
    );
  }

  deleteQuiz(id: any): Observable<any> {
    return this._HttpClient.delete(enviroment.API_URL + `Awareness/Quiz/${id}`);
  }

  addQuiz(req: any): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + `Awareness/Quiz`, req);
  }

  updateQuiz(req: any): Observable<any> {
    return this._HttpClient.put(`${enviroment.API_URL}Awareness/Quiz`, req);
  }

  getQuizById(id: any): Observable<any> {
    return this._HttpClient.get(`${enviroment.API_URL}Awareness/Quiz/${id}`);
  }

  // question awarness Quiz

  getQuestionQuizList(
    sort_data: any = null,
    pageNumber: number = 1,
    perPage: number = 10,
    filters: any[] = [],
    awarenessCampaignID: any,
    quizeID: any
  ): Observable<any> {
    const req = {
      search: '',
      dataViewId: 1,
      pageNumber: pageNumber,
      pageSize: perPage,
      filters: filters,
      sortField: sort_data?.field,
      sortDirection: sort_data?.direction,
      awarenessCampaignID: awarenessCampaignID,
      quizeID: quizeID,
    };
    return this._HttpClient.post(
      enviroment.API_URL + 'Awareness/Quiz/Questions/Search',
      req
    );
  }

  deleteQuestionQuiz(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + `Awareness/Quiz/Questions/${id}`
    );
  }

  addQuestionQuiz(req: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + `Awareness/Quiz/Questions`,
      req
    );
  }

  updateQuestionQuiz(req: any): Observable<any> {
    return this._HttpClient.put(
      `${enviroment.API_URL}Awareness/Quiz/Questions`,
      req
    );
  }

  getQuestionQuizById(id: any): Observable<any> {
    return this._HttpClient.get(
      `${enviroment.API_URL}Awareness/Quiz/Questions/${id}`
    );
  }

  // Option question awareness Quiz

  getOptionQuizList(
    payload?:any,
    awarenessCampaignID?: any,
    questionID?: any
  ): Observable<any> {
    payload['awarenessCampaignID']=awarenessCampaignID
    payload['questionID']=questionID
    return this._HttpClient.post(
      enviroment.API_URL + 'Awareness/Quiz/Options/Search',
      payload
    );
  }

  deleteOptionQuiz(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + `Awareness/Quiz/Options/${id}`
    );
  }

  addOptionQuiz(req: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + `Awareness/Quiz/Options`,
      req
    );
  }

  updateOptionQuiz(req: any): Observable<any> {
    return this._HttpClient.put(
      `${enviroment.API_URL}Awareness/Quiz/Options`,
      req
    );
  }

  getOptionQuizById(id: any): Observable<any> {
    return this._HttpClient.get(
      `${enviroment.API_URL}Awareness/Quiz/Options/${id}`
    );
  }

  // messages compagnie api

  updateMessagesCompagnie(req: any): Observable<any> {
    return this._HttpClient.put(
      `${enviroment.API_URL}Awareness/Campaign/Message`,
      req
    );
  }
}
