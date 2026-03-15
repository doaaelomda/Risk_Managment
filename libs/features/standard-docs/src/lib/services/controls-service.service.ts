import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';
import { IControl } from '../view-standard-doc/controls-standard-doc/view-standard-controls/view-standard-controls.component';

@Injectable({
  providedIn: 'root',
})
export class ControlsService {
  constructor(private httpClient: HttpClient) {}
  data = signal<IControl | null>(null);
  loadingData = signal<boolean>(false);
  getControlById(id: number): Observable<unknown> {
    return this.httpClient.get(
      `${enviroment.API_URL}GovernanceStandard/GovernanceStandardElement/${id}`
    );
  }

  getLinkedEvidenceList(payload: unknown): Observable<unknown> {
    return this.httpClient.post(
      enviroment.API_URL +
        'Evidence/TemplateEvidenceType/GovernanceStandardControl/Search',
      payload
    );
  }

  getTemplateEvidenceTypeList(payload: unknown): Observable<unknown> {
    return this.httpClient.post(
      enviroment.API_URL + 'Evidence/TemplateEvidenceType/Search',
      payload
    );
  }

  saveTemplateEvidenceType(payload: {
    
    id: number;
    linkedIds: number[];
  }): Observable<unknown> {
    return this.httpClient.put(
      enviroment.API_URL +
        'Evidence/GovernanceStandardControl/TemplateEvidenceType',
      payload
    );
  }
}
