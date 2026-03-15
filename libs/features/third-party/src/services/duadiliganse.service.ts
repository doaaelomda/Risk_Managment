import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DuadiliganseService {
    private readonly searchEndpoint = 'ThirdParty/DueDiligences/Search';
  private readonly deleteEndpoint = 'ThirdParty/DueDiligences';
  private readonly saveEndpoint = 'ThirdParty/DueDiligences';
private readonly updateEndpoint = 'ThirdParty/DueDiligences';
  private readonly getByIdEndpoint = 'ThirdParty/DueDiligences';
  private readonly idKey = 'ThirdPartyDueDiligenceID';


  constructor(private _http: HttpClient) {}

  viewedData= new BehaviorSubject(null)

  findAll(
    payload:any,
    extraFields: any = {}
  ): Observable<any> {
    const req = {
      ...payload,
      ...extraFields,
    };
    return this._http.post(`${enviroment.API_URL}${this.searchEndpoint}`, req);
  }

  save(
    data: any,
    id?: any
  ): Observable<any> {
    const method = id ? 'put' : 'post';
    if(id){
      data = {...data , ThirdPartyDueDiligenceID:id}
    }
    const endpoint = id ? this.updateEndpoint : this.saveEndpoint
    return this._http[method](`${enviroment.API_URL}${endpoint}`, data);

  }

  delete(
    id: any
  ): Observable<any> {
    return this._http.delete(`${enviroment.API_URL}${this.deleteEndpoint}`, {
      body:{
        thirdPartyDueDiligenceID:id
      }
    });
  }

  getById(
    id: any
  ): Observable<any> {
    return this._http.get(`${enviroment.API_URL}${this.getByIdEndpoint}?ThirdPartyDueDiligenceID=${id}`);
  }

}
