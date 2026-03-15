import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
@Injectable({
  providedIn: 'root',
})
export class EsclationService {
  constructor(private _HttpClient: HttpClient) {}
  currentEsclationDataEntityTypeID = signal(null)
  activeStep: BehaviorSubject<any> = new BehaviorSubject(1);
  private stepsSource = new BehaviorSubject<any[]>([]);
  steps$ = this.stepsSource.asObservable();

  setSteps(steps: any[]) {
    this.stepsSource.next(steps);
  }

  updateStep(index: number, updatedStep: Partial<any>) {
    const current = this.stepsSource.getValue();
    if (!current[index]) return;

    const updated = [...current];
    updated[index] = { ...updated[index], ...updatedStep };
    this.stepsSource.next(updated);
  }

  getEsclationListSearch(
   req:any
  ): Observable<any> {

    return this._HttpClient.post(
      enviroment.API_URL + 'Escalation/EscalationDefinition/Search',
      req
    );
  }

  deleteEscalation(id: any) {
    return this._HttpClient.delete(
      enviroment.API_URL + 'Escalation/Escalatio_Defination/' + id
    );
  }

  saveEsclation(data: any) {
    const url = 'Escalation/EscalationDefination';
    const method = data?.escalationDefinationID ? 'put' : 'post';

    return this._HttpClient[method](enviroment.API_URL + url, {...data});
  }

  getEsclationById(id: any):Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + 'Escalation/EscalationDefination/' + id
    );
  }

  saveLevel(data: any, id: any, escId: any) {
    const url = id
      ? 'Escalation/EscalationLevel_BasicInfo'
      : 'Escalation/EscalationLevel';
    const method = id ? 'put' : 'post';
    if (id) {
      data = { ...data, escalationLevelID: id };
    } else {
      data = { ...data, escalationDefinationID: escId };
    }
    return this._HttpClient[method](enviroment.API_URL + url, data);
  }

  getLevelById(levelId: any) {
    const url = `Escalation/EscalationLevel/${levelId}`;
    return this._HttpClient.get(enviroment.API_URL + url);
  }
  deleteLevel(id: any) {
    return this._HttpClient.delete(
      enviroment.API_URL + 'Escalation/EscalationLevel/' + id
    );
  }

  getLevels(escId: any) {
    const url = `Escalation/Levels/${escId}`;
    return this._HttpClient.get(enviroment.API_URL + url);
  }

  saveNotfication(data: any, levelId: any) {
    const url = 'Escalation/EscalationLevel_Notification';
    data = { ...data, escalationLevelID: levelId };
    return this._HttpClient.put(enviroment.API_URL + url, data);
  }

  saveTargets(data: any,escalationTargetTypeID:any) {
    const url = 'Escalation/EscalationLevel_Targets';
    data = {...data,escalationTargetTypeID}
    return this._HttpClient.put(enviroment.API_URL + url, data);
  }

  getCriteriaSelections(dataEntityTypeId: any) {
    return this._HttpClient.get(
      enviroment.API_URL + `DataEntity/${dataEntityTypeId}/filters`
    );
  }

  getAttributes(id:number){
    const url = `DataEntity/${id}/Attributes/Lookup`
      return this._HttpClient.get(
      enviroment.API_URL + url
    );
  }
  getAttributesRoles(id:number){
    const url = `DataEntity/${id}/Attributes/roles/Lookup`
      return this._HttpClient.get(
      enviroment.API_URL + url
    );
  }

  saveCriteria(criterias: any[], levelId: any) {

    return this._HttpClient.post(
      enviroment.API_URL + `Escalation/Criteria/${levelId}`,
      criterias
    );
  }

  getCriteria(levelId:any){
      return this._HttpClient.get(
      enviroment.API_URL + `Escalation/Critiria/LevelID/${levelId}`
    );
  }
}
