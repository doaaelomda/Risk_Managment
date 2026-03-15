// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from './../../../../../../apps/gfw-portal/env/dev.env';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StandardDocsService {

  private readonly searchEndpoint = 'GovernanceStandard/Search';
  private readonly deleteEndpoint = 'GovernanceStandard';
  private readonly saveEndpoint = 'GovernanceStandard/Create';
  private readonly updateEndpoint = 'GovernanceStandard/Update';
  private readonly getByIdEndpoint = 'GovernanceStandard';
  private readonly idKey = 'governanceStandardID';

  viewingData = new BehaviorSubject<any>(null)

  constructor(private _http: HttpClient) {}


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
    const payload = id ? { ...data, [this.idKey]: id } : data;
    const endpoint = id ? this.updateEndpoint : this.saveEndpoint
    return this._http[method](`${enviroment.API_URL}${endpoint}`, payload);
  }

  delete(
    id: any
  ): Observable<any> {
    return this._http.delete(`${enviroment.API_URL}${this.deleteEndpoint}/${id}`);
  }

  getById(
    id: any
  ): Observable<any> {
    return this._http.get(`${enviroment.API_URL}${this.getByIdEndpoint}/${id}`);
  }


  modifyControl(data: any): Observable<any> {
    const isUpdating = data?.governanceStandardControlID;
    const method = isUpdating ? 'put' : 'post';
    const url = enviroment.API_URL + 'GovernanceStandard/GovernanceStandardElement';

    return this._http[method](url, data);
  }

  deleteControl(id: any): Observable<any> {
    return this._http.delete(
      enviroment.API_URL + `GovernanceStandard/GovernanceStandardElement/${id}`
    );
  }

  getControlById(id: any): Observable<any> {
    return this._http.get(
      enviroment.API_URL + 'GovernanceStandard/GovernanceStandardElement/' + id
    );
  }

  getControlTree(standardId: any): Observable<any> {
    return this._http.get(
      enviroment.API_URL +
        'GovernanceStandard/tree/' +
        standardId
    );
  }



    moveElement(payload:any):Observable<any>{
    return this._http.put(enviroment.API_URL+`GovernanceStandard/GovernanceStandardElement/move`  , payload)
  }
  mergeElement(payload:any):Observable<any>{
    return this._http.put(enviroment.API_URL+`GovernanceStandard/GovernanceStandardElement/merge`  , payload)
  }
  reOrderElement(payload:any):Observable<any>{
        return this._http.put(enviroment.API_URL+`GovernanceStandard/GovernanceStandardElement/reorder`  , payload)

  }

    getElementClassificationsByProfileID(id:number):Observable<unknown>{
    return this._http.get(enviroment.API_URL + 'Gov/GRCDocumentElementClassificationByProfileId/' + id)
  }

}
