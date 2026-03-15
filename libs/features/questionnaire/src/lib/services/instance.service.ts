import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InstanceService {
  private readonly searchEndpoint = 'Questionnaire/instance/search';
  private readonly deleteEndpoint = 'Questionnaire/instance';
  private readonly saveEndpoint = 'Questionnaire/instance';
  private readonly getByIdEndpoint = 'Questionnaire/instance';
  private readonly idKey = 'questionnaireInstanceID';

  constructor(private _http: HttpClient) {}

  findAll(payload: any, dataEntityTypeId?: string, entityId?: string): Observable<any> {
    payload['dataEntityTypeId'] = entityId;
    payload['dataEntityId'] = dataEntityTypeId;
    return this._http.post(
      `${enviroment.API_URL}${this.searchEndpoint}`,
      payload
    );
  }

  save(data: any, id?: any): Observable<any> {
    const method = id ? 'put' : 'post';
    const payload = id ? { ...data, [this.idKey]: id } : data;
    return this._http[method](
      `${enviroment.API_URL}${this.saveEndpoint}`,
      payload
    );
  }

  delete(id: any): Observable<any> {
    return this._http.delete(
      `${enviroment.API_URL}${this.deleteEndpoint}/${id}`
    );
  }

  getById(id: any): Observable<any> {
    return this._http.get(`${enviroment.API_URL}${this.getByIdEndpoint}/${id}`);
  }

  getInstanceAnswers(instanceId:number):Observable<unknown>{
    return this._http.get(`${enviroment.API_URL}Questionnaire/Questionnaire/instance/${instanceId}/answers` )
  }
}
