import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(private _HttpClient: HttpClient) {}

  getContactsListSearch(
    payload:any,
    thirdPartyID?: any
  ): Observable<any> {
    const req = {
      ...payload,
      thirdPartyID,
    };
    return this._HttpClient.post(
      enviroment.API_URL + 'ThirdParty/Contacts/Search',
      req
    );
  }



  getContactById(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `ThirdParty/Contacts?ThirdPartyContactID=${id}`
    );
  }
    deleteContact(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + `ThirdParty/Contacts`,
      {
        body: {
          thirdPartyContactID: id,
        },
      }
    );
  }
  saveContact(data: any, tpId: any, contactId: any): Observable<any> {
    if (contactId) {
      data = { ...data, thirdPartyContactID: contactId };
    }
   const method = contactId ? 'put':'post'
    const payload = { ...data, thirdPartyID: tpId };
    return this._HttpClient[method](
      enviroment.API_URL + 'ThirdParty/Contacts',
      payload
    );
  }
}
