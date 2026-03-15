/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
@Injectable({
  providedIn: 'root',
})
export class LookupDefinationService {
  constructor(private _HttpClient: HttpClient) {}

  getListLookupByGroupId(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `Lookup/Definition/ByGroup/${id}`
    );
  }

  getDefintionSearch(
    id: any,
    search?: any,
    pageNumber?: any,
    pageSize?: any
  ): Observable<any> {
    const req = {
      lookupId: id,
      search: search,
      pageNumber: pageNumber,
      pageSize: pageSize,
    };
    return this._HttpClient.post(enviroment.API_URL + 'Lookup/Search', req);
  }

  getDefinitionById(id: any): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + 'Lookup/Definition/' + id);
  }
  deleteDef(id: any,type:any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + `Lookup/delete?type=${type}&id=${id}`
    );
  }

  saveDef(payload: any, lookupGroupID: any, lookupDefinitionID?: any) {
    if (lookupDefinitionID) {
      payload = { ...payload, lookupDefinitionID };
    }
    payload = { ...payload };
    const method = lookupDefinitionID ? 'put' : 'post';
    const url =
      method === 'put'
        ? `Lookup/${lookupGroupID}/${lookupDefinitionID}`
        : 'Lookup/create?type=' + lookupGroupID;
    return this._HttpClient[method](enviroment.API_URL + url, payload);
  }
}
