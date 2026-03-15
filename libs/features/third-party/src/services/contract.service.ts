/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
@Injectable({
  providedIn: 'root',
})
export class ContractsService {
  constructor(private _HttpClient: HttpClient) {}

  getContractsListSearch(
    payload:any,
    thirdPartyID?: any
  ): Observable<any> {
    const req = {
      ...payload,
      thirdPartyID,
    };
    return this._HttpClient.post(
      enviroment.API_URL + 'ThirdParty/Contracts/Search',
      req
    );
  }

  deleteContract(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + `ThirdParty/Contracts`,
      {
        body: {
          thirdPartyContractID: id,
        },
      }
    );
  }

  getContractById(id: any) {
    return this._HttpClient.get(
      enviroment.API_URL + `ThirdParty/Contracts?ThirdPartyContractID=${id}`
    );
  }

  saveContract(data: any, tpId: any, contractId: any): Observable<any> {
    if (contractId) {
      data = { ...data, thirdPartyContractID: contractId };
    }
    if (tpId) {
      data = { ...data, thirdPartyID: tpId };
    }

    const method = contractId ? 'put' : 'post'

    return this._HttpClient[method](
      enviroment.API_URL + 'ThirdParty/Contracts',
      data
    );
  }
}
