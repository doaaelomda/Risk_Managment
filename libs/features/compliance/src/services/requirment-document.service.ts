import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequirmentDocumentService {
  constructor(private _HttpClient: HttpClient) {}
  // ControlRequirement Api

  getRequirementControls(payload: any, complianceDocumentElementID: any): Observable<any> {
    payload['complianceDocumentElementID']=complianceDocumentElementID
    return this._HttpClient.post(
      enviroment.API_URL + 'ComplianceDocument/DocumentElementRequirement/Search',
      payload
    );
  }
  getRequirementControlsById(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `ComplianceDocument/DocumentElementRequirement/${id}`
    );
  }
  deleteRequirementControls(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + 'ComplianceDocument/DocumentElementRequirement/' + id
    );
  }

  createRequirement(data: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'ComplianceDocument/DocumentElementRequirement/Create',
      data
    );
  }

  updateRequirement(data: any): Observable<any> {
    return this._HttpClient.put(
      enviroment.API_URL + 'ComplianceDocument/DocumentElementRequirement/Update',
      data
    );
  }
}
