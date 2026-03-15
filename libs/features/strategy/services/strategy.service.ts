import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from '../../../../apps/gfw-portal/env/dev.env';
@Injectable({
  providedIn: 'root',
})
export class StrategyService {
  constructor(private _HttpClient: HttpClient) {}
  headTitle: BehaviorSubject<any> = new BehaviorSubject('');
  private postSearch(
    endpoint: string,
    req:any
  ): Observable<any> {

    return this._HttpClient.post(enviroment.API_URL + endpoint, req);
  }
  private saveEntity(
    endpoint: string,
    data: any,
    idKey: string,
    idValue?: any
  ): Observable<any> {
    const method = idValue ? 'put' : 'post';
    const payload = idValue ? { ...data, [idKey]: idValue } : data;
    return this._HttpClient[method](enviroment.API_URL + endpoint, payload);
  }
  private deleteEntity(
    endpoint: string,
    idKey: string,
    idValue: any
  ): Observable<any> {
    return this._HttpClient.delete(enviroment.API_URL + endpoint, {
      body: { [idKey]: idValue },
    });
  }
  private getById(
    endpoint: string,
    queryKey: string,
    id: any
  ): Observable<any> {
    return this._HttpClient.get(
      `${enviroment.API_URL}${endpoint}?${queryKey}=${id}`
    );
  }

  // get search

  getStrategyPlansSearch(
    payload:any
  ) {
    return this.postSearch(
      'StrategicObjective/StrategicPlans/GetAll',payload
    );
  }

  getStrategicFocusAreaSearch(
    payload:any
  ) {
    return this.postSearch(
      'StrategicObjective/StrategicFocusArea/GetAll',
      payload
    );
  }

  getStrategicGoalSearch(
    payload:any
  ) {
    console.log(payload,'payload here');
    
    return this.postSearch(
      'StrategicObjective/StrategicGoal/GetAll',
      payload
    );
  }

  getStrategicObjectiveSearch(
    payload:any
  ) {
    return this.postSearch(
      'StrategicObjective/Search',
      payload
    );
  }

  // save

  savePlan(data: any, planId?: any) {
    return this.saveEntity(
      'StrategicObjective/StrategicPlans',
      data,
      'strategicPlanID',
      planId
    );
  }

  saveFocus(data: any, planId: any, focusId?: any) {
    const endpoint = focusId
      ? 'StrategicObjective/StrategicFocusArea'
      : 'StrategicObjective/CreateStrategicFocusArea';
    const payload = { ...data, strategicPlanID: planId };
    return this.saveEntity(endpoint, payload, 'strategicFocusAreaID', focusId);
  }

  saveGoal(data: any, planId: any, focusId: any, strategicGoalID?: any) {
    const endpoint = strategicGoalID
      ? 'StrategicObjective/StrategicGoal'
      : 'StrategicObjective/CreateStrategicGoal';
    const payload = {
      ...data,
      strategicPlanID: planId,
      strategicFocusAreaID: focusId,
    };
    return this.saveEntity(
      endpoint,
      payload,
      'strategicGoalID',
      strategicGoalID
    );
  }

  saveObjective(
    data: any,
    planId: any,
    focusId: any,
    goalId: any,
    StrategicObjectiveID?: any
  ) {
    const endpoint = StrategicObjectiveID
      ? 'StrategicObjective/id'
      : 'StrategicObjective/StrategicObjective';
    const payload = {
      ...data,
      strategicPlanID: planId,
      strategicFocusAreaID: focusId,
      strategicGoalID: goalId,
    };
    return this.saveEntity(
      endpoint,
      payload,
      'StrategicObjectiveID',
      StrategicObjectiveID
    );
  }

  // delete

  deletePlan(id: any) {
    return this.deleteEntity(
      'StrategicObjective/StrategicPlans',
      'strategicPlanID',
      id
    );
  }

  deleteFocus(id: any) {
    return this.deleteEntity(
      'StrategicObjective/StrategicFocusArea',
      'strategicFocusAreaID',
      id
    );
  }

  deleteGoal(id: any) {
    return this.deleteEntity(
      'StrategicObjective/StrategicGoal',
      'strategicGoalID',
      id
    );
  }

  deleteObjective(id: any) {
    return this.deleteEntity(
      'StrategicObjective/id',
      'strategicObjectiveID',
      id
    );
  }

  // get by id

  getFocusById(id: any) {
    return this.getById(
      'StrategicObjective/StrategicFocusArea',
      'StrategicFocusAreaID',
      id
    );
  }

  getPlanById(id: any) {
    return this.getById(
      'StrategicObjective/StrategicPlans',
      'StrategicPlanID',
      id
    );
  }

  getGoalById(id: any) {
    return this.getById(
      'StrategicObjective/StrategicGoal',
      'StrategicGoalID',
      id
    );
  }

  getObjectiveById(id: any) {
    return this.getById('StrategicObjective/id', 'StrategicObjectiveID', id);
  }
}
