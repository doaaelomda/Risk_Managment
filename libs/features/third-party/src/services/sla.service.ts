import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SlaService {

  constructor(private _HttpClient:HttpClient){}

      getSLAListSearch(
        payload:any,
      thirdPartyID?:any,
      thirdPartyContractID?:any
    ): Observable<any> {
      const req = {
        ...payload,
        thirdPartyID,
        thirdPartyContractID
      };
      return this._HttpClient.post(enviroment.API_URL + 'ThirdParty/SLAs/Search', req);
    }



  deleteSLA(id:any):Observable<any>{
    return this._HttpClient.delete(enviroment.API_URL + `ThirdParty/SLAs`,{
      body:{
        thirdPartySLAID:id
      }
    })
  }

    getSLAById(id:any):Observable<any>{
        return this._HttpClient.get(enviroment.API_URL + `ThirdParty/SLAs?ThirdPartySLAID=${id}`,)
  }
  saveSla(
  data: any,
  contractId?: number,
  slaId?: number
): Observable<any> {

  if (contractId) {
    data = { ...data, thirdPartyContractID: contractId };
  }

  // ✅ UPDATE
  if (slaId) {
     data = { ...data, thirdPartySLAID: slaId };
    return this._HttpClient.put(
      `${enviroment.API_URL}ThirdParty/SLAs`,
      data
    );
  }

  // ✅ ADD
  return this._HttpClient.post(
    `${enviroment.API_URL}ThirdParty/SLAs`,
    data
  );
}

}
