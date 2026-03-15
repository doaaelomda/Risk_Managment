import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EvidenceLibraryService {
  constructor(private _HttpClient: HttpClient) {}

  // Evidence Api
  deleteEvidenceLibrary(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + 'Evidence/TemplateEvidenceType/' + id
    );
  }

  getEvidenceLibrarySearch(payload: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'Evidence/TemplateEvidenceType/Search',
      payload
    );
  }

  getEvidenceById(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `Evidence/TemplateEvidenceType/${id}`
    );
  }
  addEvidence(data: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'Evidence/TemplateEvidenceType',
      data
    );
  }
  updateEvidence(data: any): Observable<any> {
    return this._HttpClient.put(
      enviroment.API_URL + 'Evidence/TemplateEvidenceType',
      data
    );
  }
}
