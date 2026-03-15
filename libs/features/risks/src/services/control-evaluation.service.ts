import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { IControlEvalutions } from '../lib/ass-view-container/control-evaluations/evaluation-action/evaluation-action.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';

@Injectable({
  providedIn: 'root',
})
export class ControlEvaluationService {
  url = 'RiskAssesment/ControlEvaluation';
  constructor(private httpClient: HttpClient) {}
  viewedData = signal<unknown>(null)
  loadingData = signal<boolean>(true)
  save(data: IControlEvalutions): Observable<unknown> {
    const method = data?.riskAssessmentControlEvaluationID ? 'put' : 'post';
    return this.httpClient[method](`${enviroment.API_URL}${this.url}`, data);
  }
  delete(id: number): Observable<unknown> {
    return this.httpClient.delete(`${enviroment.API_URL}${this.url}/${id}`);
  }
  getDetails(id: number): Observable<unknown> {
    return this.httpClient.get(`${enviroment.API_URL}${this.url}/${id}`);
  }
   getList(payload:any): Observable<unknown> {
    return this.httpClient.post(`${enviroment.API_URL}${this.url}/Search`,payload);
  }
  getControlById(id:number):Observable<unknown>{
    return this.httpClient.get(`${enviroment.API_URL}Gov/Control/${id}`)
  }
}
