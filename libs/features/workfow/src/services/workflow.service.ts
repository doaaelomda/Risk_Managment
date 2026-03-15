import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
@Injectable({
  providedIn: 'root',
})
export class WorkflowService {
  constructor(private _HttpClient: HttpClient) {}
  dynamic_steps_subject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  getWorlFlowsLists(
    req?:any
  ): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + 'WF/Search', req);
  }

  addWorkflow(req: any): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + `WF`, req);
  }

  updateWorkflow(req: any): Observable<any> {
    return this._HttpClient.put(enviroment.API_URL + `WF`, req);
  }

  getWorkFlowById(id: any): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + `WF/${id}`);
  }

  deleteWorkFlow(id: any) {
    return this._HttpClient.delete(enviroment.API_URL + `WF/${id}`);
  }

  getWorkflowSteps(
    sort_data: any = null,
    pageNumber: number = 1,
    perPage: number = 10,
    filters: any[] = [],
    wfid: any
  ): Observable<any> {
    const req = {
      search: '',
      pageNumber: pageNumber,
      pageSize: perPage,
      filters: filters,
      sortField: sort_data?.field,
      sortDirection: sort_data?.direction,
      wfid,
    };

    return this._HttpClient.post(enviroment.API_URL + `WF/Step/Search`, req);
  }

  getStepDecisions(
    sort_data: any = null,
    pageNumber: number = 1,
    perPage: number = 10,
    filters: any[] = [],
    wfStepID: any
  ): Observable<any> {
    const req = {
      search: '',
      pageNumber: pageNumber,
      pageSize: perPage,
      filters: filters,
      sortField: sort_data?.field,
      sortDirection: sort_data?.direction,
      wfStepID,
    };

    return this._HttpClient.post(
      enviroment.API_URL + `WF/Decision/Search`,
      req
    );
  }

  getStepById(id: any): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + `WF/Step/${id}`);
  }
  getDecisionById(id: any): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + `WF/Decision/${id}`);
  }

  addWFStep(data: any): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + `WF/Step`, data);
  }
  editWFStep(data: any, id: any): Observable<any> {
    return this._HttpClient.put(enviroment.API_URL + `WF/Step/${id}`, data);
  }

  dataEntityLookUp(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `DataEntity/${id}/Attributes`
    );
  }

  deleteStep(id: any): Observable<any> {
    return this._HttpClient.delete(enviroment.API_URL + `WF/Step/${id}`);
  }

  addNewDecision(data: any): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + `WF/Decision`, data);
  }

  addNewDecisions(data: any): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + `WF/Decision`, data);
  }
  updateDecisions(data: any): Observable<any> {
    return this._HttpClient.put(enviroment.API_URL + `WF/Decision`, data);
  }

  delteDecisions(id: any): Observable<any> {
    return this._HttpClient.delete(enviroment.API_URL + `WF/Decision/${id}`);
  }

  createAction(data: any, destId: any, wfActionID?: any): Observable<any> {
    const method = wfActionID ? 'put' : 'post';
    const body = { ...data, wfDecisionID: +destId, wfActionID };
    return this._HttpClient[method](enviroment.API_URL + 'WF/Action', body);
  }

  getActions(
    sort_data: any = null,
    pageNumber: number = 1,
    perPage: number = 10,
    filters: any[] = [],
    wfDecisionID: any
  ): Observable<any> {
    const req = {
      search: null,
      pageNumber: pageNumber,
      pageSize: perPage,
      filters: filters,
      sortField: sort_data?.field,
      sortDirection: sort_data?.direction,
      wfDecisionID,
    };

    return this._HttpClient.post(enviroment.API_URL + `WF/Action/Search`, req);
  }

  deleteAction(id: any): Observable<any> {
    return this._HttpClient.delete(enviroment.API_URL + `WF/Action/${id}`);
  }

  getActionById(id: any) {
    return this._HttpClient.get(enviroment.API_URL + `WF/Action/${id}`);
  }

  changeActionStep(body: any, isMovingStep?: any) {
    const url = isMovingStep
      ? 'WF/ActionChangeStep'
      : 'WF/ExcuteDataEntityTypeAction';
    return this._HttpClient.post(enviroment.API_URL + url, body);
  }

  getDataEntityActions(id: any) {
    return this._HttpClient.get(
      enviroment.API_URL + `DataEntity/Actions/${id}`
    );
  }

  changeActionData(body: any) {
    const url = 'WF/ActionChangeDataEntityTypeData';
    return this._HttpClient.post(enviroment.API_URL + url, body);
  }
}
