import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private _HttpClient: HttpClient) {}
  getTaskById(taskId: any) {
    return this._HttpClient.get(enviroment.API_URL + `BusinessTask/${taskId}`);
  }

  getBusinessTask() {
    return this._HttpClient.get(enviroment.API_URL + `BusinessTask`);
  }
  getBusinessTasksActions(
    businessTaskTypeID: any,
    BusinessTaskStatusActionID: any,
    forBusinessTaskOwner: boolean,
    forAssignee: boolean,
    forValidator: boolean
  ) {
    const body = {
      businessTaskTypeID,
      businessTaskWFStatusTypeID: BusinessTaskStatusActionID,
      forBusinessTaskOwner,
      forAssignee,
      forValidator,
    };
    return this._HttpClient.post(
      enviroment.API_URL + `BusinessTask/Actions`,
      body
    );
  }

  getEntitiesSearch(
    sort_data: any = null,
    searchTerm: string = '',
    pageNumber: number = 1,
    perPage: number = 10,
    filters: any,
    dataEntityID: any = 0,
    dataEntityTypeID: any = 0,
    BusinessTaskTypeID?: any,
    scopeID: any = 0,
    showDrafts?: any,
    executionStatusTypeID?:any
  ): Observable<any> {
    const req: any = {
      sortField: sort_data?.field,
      sortDirection: sort_data?.direction,
      search: searchTerm,
      pageNumber: pageNumber,
      pageSize: perPage,
      filters: filters,
      // dataEntityID,
      // dataEntityTypeID,
      showDrafts,
    };
    if (BusinessTaskTypeID) {
      req.BusinessTaskTypeID = BusinessTaskTypeID;
    }
    if (scopeID) {
      req.scopeID = scopeID;
    }
    if (executionStatusTypeID) {
      req.executionStatusTypeID = executionStatusTypeID;
    }
    return this._HttpClient.post(
      enviroment.API_URL + 'BusinessTask/Search',
      req
    );
  }

  getCategories() {
    return this._HttpClient.get(
      enviroment.API_URL + 'BusinessTask/BusinessTaskTypes/List'
    );
  }

  getSummary(
        sort_data: any = null,
    searchTerm: string = '',
    pageNumber: number = 1,
    perPage: number = 10,
    filters: any,
    dataEntityID: any = 0,
    dataEntityTypeID: any = 0,
    BusinessTaskTypeID?: any,
    scopeID: any = 0,
    showDrafts?: any,
    executionStatusTypeID?:any
  ): Observable<any> {
     const req: any = {
      sortField: sort_data?.field,
      sortDirection: sort_data?.direction,
      search: searchTerm,
      pageNumber: pageNumber,
      pageSize: perPage,
      filters: filters,
      // dataEntityID,
      // dataEntityTypeID,
      showDrafts,
      executionStatusTypeID
    };
    if (BusinessTaskTypeID) {
      req.BusinessTaskTypeID = BusinessTaskTypeID;
    }
    if (scopeID) {
      req.scopeID = scopeID;
    }
        if (executionStatusTypeID) {
      req.executionStatusTypeID = executionStatusTypeID;
    }

    return this._HttpClient.post(
      enviroment.API_URL + 'BusinessTask/Summary',
      req
    );
  }

  getTasksCategories() {
    return this._HttpClient.get(enviroment.API_URL + 'BusinessTask/TypesNames');
  }

  updateTask(businessTaskID: any, businessTaskStatusActionID: any) {
    const body = {
      businessTaskID,
      businessTaskStatusActionID,
    };
    return this._HttpClient.put(
      enviroment.API_URL + 'BusinessTask/UpdateTask',
      body
    );
  }

  getProjectsSearch(
    req?:any
  ): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + 'Project/Search', req);
  }

  // Orgainzation Api
  getOrgsUnitData(): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + 'OrganizationalUnit/lookup'
    );
  }

  getProjectById(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `Project/id?ProjectID=${id}`
    );
  }

  deleteProject(id: any): Observable<any> {
    return this._HttpClient.delete(enviroment.API_URL + `Project/id`, {
      body: {
        projectID: id,
      },
    });
  }

  addNewProject(data: any): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + `Project`, data);
  }

  updateProject(data: any): Observable<any> {
    return this._HttpClient.put(enviroment.API_URL + `Project/id`, data);
  }
  deleteOrganization(organizationalUnitID: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + 'OrganizationalUnit/id',
      {
        body: {
          organizationalUnitID: organizationalUnitID,
        },
      }
    );
  }

  CreateOrganization(req: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'OrganizationalUnit',
      req
    );
  }
  updateOrganization(req: any): Observable<any> {
    return this._HttpClient.put(
      enviroment.API_URL + 'OrganizationalUnit/id',
      req
    );
  }

  getOrganizationById(taskId: any) {
    return this._HttpClient.get(
      enviroment.API_URL +
        `OrganizationalUnit/Id?OrganizationalUnitID=${taskId}`
    );
  }

  // Initiative Api
  getInitiativesSearch(
    req?:any
  ): Observable<any> {

    return this._HttpClient.post(enviroment.API_URL + 'Initiative/Search', req);
  }

  CreateInitiative(req: any): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + 'Initiative', req);
  }
  updateInitiative(req: any): Observable<any> {
    return this._HttpClient.put(enviroment.API_URL + 'Initiative/id', req);
  }

  getInitiativeById(taskId: any) {
    return this._HttpClient.get(
      enviroment.API_URL + `Initiative/id?InitiativeID=${taskId}`
    );
  }
  deleteinitiative(id: any): Observable<any> {
    return this._HttpClient.delete(enviroment.API_URL + `Initiative/id`, {
      body: {
        initiativeID: id,
      },
    });
  }
}
