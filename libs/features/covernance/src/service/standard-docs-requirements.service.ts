// eslint-disable-next-line @nx/enforce-module-boundaries
import { IControlRequirement } from './../../../standard-docs/src/lib/view-standard-doc/controls-standard-doc/view-standard-controls/requirements-standard-controls/view-requirement-standard-control/view-requirement-standard-control.component';
import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StandardDocsRequirementsService {
  constructor(private httpClient: HttpClient) {}
  loadingData = signal<boolean>(false);
  data = signal<IControlRequirement | null>(null);
  getRequirementControls(
    sort_data: any,
    pageNumber: number = 1,
    perPage: number = 10,
    filters: any[] = [],
    GovControlID: any,
    payload?: any,
    isNewTable: boolean = false
  ): Observable<any> {
    let req;
    if (!isNewTable) {
      req = {
        search: '',
        pageNumber: pageNumber,
        pageSize: perPage,
        filters: filters,
        sortField: sort_data?.field,
        sortDirection: sort_data?.direction,
        governanceStandardControlID: GovControlID,
      };
    } else {
      req = {
        ...payload,
        governanceStandardControlID: GovControlID,
      };
    }
    return this.httpClient.post(
      enviroment.API_URL +
        'GovernanceStandard/StandardElementRequirement/Search',
      req
    );
  }

  getRequirementControlsById(id: any): Observable<any> {
    return this.httpClient.get(
      enviroment.API_URL + `GovernanceStandard/StandardElementRequirement/${id}`
    );
  }
  deleteRequirementControls(id: any): Observable<any> {
    return this.httpClient.delete(
      enviroment.API_URL + 'GovernanceStandard/StandardElementRequirement/' + id
    );
  }

  createRequirement(data: any): Observable<any> {
    return this.httpClient.post(
      enviroment.API_URL +
        'GovernanceStandard/StandardElementRequirement/Create',
      data
    );
  }

  updateRequirement(data: any): Observable<any> {
    return this.httpClient.put(
      enviroment.API_URL +
        'GovernanceStandard/StandardElementRequirement/Update',
      data
    );
  }
}
