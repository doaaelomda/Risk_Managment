/* eslint-disable @nx/enforce-module-boundaries */
import { enviroment } from './../../../../../apps/gfw-portal/env/dev.env';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RiskService {
  constructor(private _HttpClient: HttpClient) {}

  getRisksProfile(id: number): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `DataEntity/data-view/${id}/columns`
    );
  }

    createAssessmentControlGov(data: any): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + 'GovControlComplianceAssessment', data);
  }
  deleteRisk(id: any): Observable<any> {
    return this._HttpClient.delete(enviroment.API_URL + 'Risks/id', {
      body: {
        id,
      },
    });
  }

  deleteDocument(id: any): Observable<any> {
    return this._HttpClient.delete(enviroment.API_URL + 'Gov/Document/' + id);
  }
  getRiskData(pageNumber: number = 1, perPage: number = 10): Observable<any> {
    const req = {
      search: '',

      pageNumber: pageNumber,
      pageSize: perPage,
    };

    return this._HttpClient.get(
      enviroment.API_URL +
      `Risk/GetAllRisk?PageNumber=${pageNumber}&PageSize=${perPage}`
    );
  }

  saveRiskData(data: any): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + 'Risks', data);
  }

  savemitigationRisk(data: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'RiskTreatmentPlan',
      data
    );
  }

  updatemitigationRisk(id?: number, data?: any): Observable<any> {
    data.riskID = id;
    return this._HttpClient.put(enviroment.API_URL + `RiskTreatmentPlan`, data);
  }
  updateRiskData(id?: number, data?: any): Observable<any> {
    data.riskID = id;
    return this._HttpClient.put(enviroment.API_URL + `Risks/id`, data);
  }
  getOneRisk(id: number): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + `Risks/id?Id=${id}`);
  }

  getRiskActionLookupData(ids: number[]): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + 'Lookup/multi', ids);
  }

  getAssetsLookUpData(): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + 'BusinessEntityCatalog/LookUp'
    );
  }

  getFrameWorkLists(
    url: any = '',
    sort_data: any = null,
    pageNumber: number = 1,
    perPage: number = 10,
    filters: any[] = []
  ) {
    const req = {
      search: '',
      dataViewId: 1,
      pageNumber: pageNumber,
      pageSize: perPage,
      filters: filters,
      sortField: sort_data?.field,
      sortDirection: sort_data?.direction,
    };
    return this._HttpClient.post(enviroment.API_URL + url, req);
  }

  getRiskSearch(
    sort_data: any = null,
    pageNumber: number = 1,
    perPage: number = 10,
    filters: any[] = []
  ): Observable<any> {
    const req = {
      search: '',
      dataViewId: 1,
      pageNumber: pageNumber,
      pageSize: perPage,
      filters: filters,
      sortField: sort_data?.field,
      sortDirection: sort_data?.direction,
    };
    return this._HttpClient.post(enviroment.API_URL + 'Risks/Search', req);
  }



  searchRisks(req:any):Observable<any>{
    return this._HttpClient.post(enviroment.API_URL + `Risks/Search` , req)
  }

  getRiskAssessmentSearch(
    riskID: any,
    data_sort: any = null,
    pageNumber: number = 1,
    perPage: number = 10,
    filters: any[] = []
  ): Observable<any> {
    const req = {
      search: '',
      pageNumber: pageNumber,
      pageSize: perPage,
      riskId: +riskID,
      filters: filters,
      sortField: data_sort?.field,
      sortDirection: data_sort?.direction,
    };
    return this._HttpClient.post(
      enviroment.API_URL + 'RiskAssesment/Search',
      req
    );
  }

   getRiskAssessmentSearchNew(
    req?:any,
    riskId?:number
  ): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'RiskAssesment/Search',
      {...req,riskId}
    );
  }

  saveRiskAssesment(data: any): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + 'RiskAssesment', data);
  }
  deleteRiskAssesment(riskAssessmentID: number): Observable<any> {
    const url = `${enviroment.API_URL}RiskAssesment/Id`;

    return this._HttpClient.delete(url, {
      body: { riskAssessmentID },
    });
  }

  updateRiskAssesment(id?: number, data?: any): Observable<any> {
    data.riskAssessmentID = id;
    return this._HttpClient.put(enviroment.API_URL + 'RiskAssesment/Id', data);
  }
  getOneRiskAssessment(id: number, RiskId?: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `RiskAssesment/Id?Id=${id}`
    );
  }
  public riskData$ = new BehaviorSubject<any>(null);
  public entityId$ = new BehaviorSubject<any>(null);
  getviewRiskAssessment(id: number, RiskAssId: number) {
    return this._HttpClient.get(
      enviroment.API_URL + `RiskAssesment/Id?Id=${RiskAssId}`
    );
  }

  orgainationalUnitLookUp() {
    return this._HttpClient.get(
      enviroment.API_URL + 'OrganizationalUnit/lookup'
    );
  }
  getUser(id: any) {
    return this._HttpClient.post(enviroment.API_URL + 'Users/lookup', {
      id,
    });
  }

  getRoles() {
    return this._HttpClient.get(enviroment.API_URL + 'Roles/lookup');
  }

  getRiskMitgationSearch(
    riskID: any = '',
    searchTerm: string = '',
    pageNumber: number = 1,
    perPage: number = 10,
    sort_data: any = null,
    filters: any[] = []
  ): Observable<any> {
    const req = {
      search: searchTerm,
      pageNumber: pageNumber,
      pageSize: perPage,
      riskID: +riskID,
      filters: filters,
      sortField: sort_data?.field,
      sortDirection: sort_data?.direction,
    };
    return this._HttpClient.post(
      enviroment.API_URL + 'RiskTreatmentPlan/Search',
      req
    );
  }
    getRiskMitgationSearchNew(
      req?:any,
      riskID?:number
  ): Observable<any> {

    return this._HttpClient.post(
      enviroment.API_URL + 'RiskTreatmentPlan/Search',
      {...req,riskID}
    );
  }

  //   getRiskSearch(
  //   sort_data: any = null,
  //   pageNumber: number = 1,
  //   perPage: number = 10,
  //   filters:any[]=[]
  // ): Observable<any> {
  //   const req = {
  //     search: '',
  //     dataViewId:1,
  //     pageNumber: pageNumber,
  //     pageSize: perPage,
  //     filters:filters,
  //       "sortField": sort_data?.field,
  // "sortDirection": sort_data?.direction
  //   };
  //   return this._HttpClient.post(enviroment.API_URL + 'Risks/Search', req);
  // }

  deleteRiskMitgation(riskMitigationPlanID?: any): Observable<any> {
    return this._HttpClient.delete(enviroment.API_URL + 'RiskTreatmentPlan', {
      body: {
        riskMitigationPlanID,
      },
    });
  }

  getOneRiskMitagation(id: number): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + `RiskTreatmentPlan/${id}`);
  }

  getGovermentSearch(
    sort_data: any = null,
    pageNumber: number = 1,
    perPage: number = 10,
    filters: any[] = []
  ): Observable<any> {
    const req = {
      govDocumentContentId: 0,
      pageNumber: pageNumber,
      pageSize: perPage,
      filters: filters,
      sortField: sort_data?.field,
      sortDirection: sort_data?.direction,
    };
    return this._HttpClient.post(
      enviroment.API_URL + 'GovernanceStandard/Search',
      req
    );
  }

  saveDocument(data: any): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + 'Gov/Document', data);
  }
  getOneDoc(id: number): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + `Gov/Document/${id}`);
  }

  updateDocument(id?: number, data?: any): Observable<any> {
    // data.riskID = id;
    return this._HttpClient.put(enviroment.API_URL + `Gov/Document`, data);
  }
  addPermission(data: any): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + 'Permissions', data);
  }
  deletePerrmission(id: any): Observable<any> {
    return this._HttpClient.delete(enviroment.API_URL + 'Permissions/' + id);
  }

  getOnePermission(id: number): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + `Permissions/${id}`);
  }
  updatePermission(id?: number, data?: any): Observable<any> {
    data.permissionID = id;
    return this._HttpClient.put(enviroment.API_URL + `Permissions`, data);
  }

  getControlsGovSearch(
    sort_data: any = null,
    pageNumber: number = 1,
    perPage: number = 10,
    filters: any[] = []
  ): Observable<any> {
    const req = {
      search: '',
      pageNumber: pageNumber,
      pageSize: perPage,
      filters: filters,
      sortField: sort_data?.field,
      sortDirection: sort_data?.direction,
    };
    return this._HttpClient.post(
      enviroment.API_URL + 'Gov/Control/search',
      req
    );
  }

    getControlsGovSearchNew(payload: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'Gov/Control/search',
      payload
    );
  }

  createControlGov(data: any): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + 'Gov/Control', data);
  }
  deleteControl(id: any): Observable<any> {
    return this._HttpClient.delete(enviroment.API_URL + 'Gov/Control/' + id);
  }

  getOneGovControl(id: number): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + `Gov/Control/${id}`);
  }

  updateControlGov(id?: number, data?: any): Observable<any> {
    data.permissionID = id;
    return this._HttpClient.put(enviroment.API_URL + `Gov/Control`, data);
  }

  getDocumentNames(
    govRegulatorId: any,
    govDocumentTypeId: any
  ): Observable<any> {
    const url = `${enviroment.API_URL}Gov/Control/documents/by-regulator-type?govRegulatorId=${govRegulatorId}&govDocumentTypeId=${govDocumentTypeId}`;
    return this._HttpClient.get(url);
  }

  getFormulas(methodologyId: number): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `RiskMethodology/FormulasNames/${methodologyId}`
    );
  }

  getFactors(formulaId: number): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `RiskMethodology/RiskFactorNames/${formulaId}`
    );
  }
  getFactorsInputs(formulaId: number): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `RiskMethodology/Formula/${formulaId}/inputs`
    );
  }

  getImpactByMethodology(methodologyId: number):Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `RiskMethodology/${methodologyId}/RiskImpacts/Lookup`
    );
  }
  getLikelihoodsByMethodology(methodologyId: number):Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL +
        `RiskMethodology/${methodologyId}/RiskLikelihoods/Lookup`
    );
  }




  getLevelByFactorID(id:any):Observable<any>{
    return this._HttpClient.get(enviroment.API_URL + `RiskMethodology/RiskFactorLevels/${id}/ByFactorId`)
  }


    getControlById(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + 'ComplianceDocument/ComplianceDocumentElement/' + id
    );
  }


}
// {
//   "search": "string",
//   "filters": [
//     {
//       "property": "string",
//       "operator": "string",
//       "value": "string"
//     }
//   ],
//   "pagination": {
//     "pageNumber": 1,
//     "pageSize": 5
//   },
//   "sort": {
//     "sortColumn": "string",
//     "sortOrder": "string"
//   }
// }
