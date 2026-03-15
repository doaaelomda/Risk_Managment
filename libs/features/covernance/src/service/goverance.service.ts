import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoveranceService {
  private selectedTypeIdSource = new BehaviorSubject<number | null>(null);
  selectedTypeId$ = this.selectedTypeIdSource.asObservable();

  private MatrityTypeIdSource = new BehaviorSubject<number | null>(null);
  MatrityTypeId$ = this.MatrityTypeIdSource.asObservable();
  constructor(private _HttpClient: HttpClient) {}
  viewedData = new BehaviorSubject(null);
  getOneGovControl(id: number): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + `Gov/Control/${id}`);
  }
  // Compliance Api
  getComplianceControls(
    sort_data: any,
    pageNumber: number = 1,
    perPage: number = 10,
    filters: any[] = [],

    GovControlID: any
  ): Observable<any> {
    const req = {
      search: '',
      pageNumber: pageNumber,
      pageSize: perPage,
      filters: filters,
      sortField: sort_data?.field,
      sortDirection: sort_data?.direction,
      GovControlID: GovControlID,
    };
    return this._HttpClient.post(
      enviroment.API_URL + 'Gov/Control/ComplianceAssessment/search',
      req
    );
  }
  getComplianceControlsNew(req: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'Gov/Control/ComplianceAssessment/search',
      req
    );
  }

  getMaturityByControlID(controlID: any) {
    return this._HttpClient.get(
      enviroment.API_URL + `Gov/Control/${controlID}/maturityLevel`
    );
  }

  createComplianceControls(data: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'Gov/Control/ComplianceAssessment',
      data
    );
  }
  updateComplianceControls(id: any, data: any): Observable<any> {
    const payload = {
      ...data,
      govControlComplianceAssessmentID: id,
    };
    return this._HttpClient.put(
      enviroment.API_URL + 'Gov/Control/ComplianceAssessment',
      payload
    );
  }
  deleteComplianceControls(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + 'Gov/Control/ComplianceAssessment/' + id
    );
  }
  getComplianceControlsById(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `Gov/Control/ComplianceAssessment/${id}`
    );
  }

  // Implementation Api
  getImplementationControls(
    sort_data: any,
    pageNumber: number = 1,
    perPage: number = 10,
    filters: any[] = [],
    GovControlID: any
  ): Observable<any> {
    const req = {
      search: '',
      pageNumber: pageNumber,
      pageSize: perPage,
      filters: filters,
      sortField: sort_data?.field,
      sortDirection: sort_data?.direction,
      GovControlID: GovControlID,
    };
    return this._HttpClient.post(
      enviroment.API_URL + 'Gov/Control/ImplementationAssessment/search',
      req
    );
  }
  getImplementationControlsNew(req: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'Gov/Control/ImplementationAssessment/search',
      req
    );
  }
  getImplementationControlsById(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `Gov/Control/ImplementationAssessment/${id}`
    );
  }
  deleteImplementationControls(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + 'Gov/Control/ImplementationAssessment/' + id
    );
  }

  createImplementationControls(data: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'Gov/Control/ImplementationAssessment',
      data
    );
  }
  updateImplementationControls(controlId: any, data: any): Observable<any> {
    const payload = {
      ...data,
      govControlImplementationAssessmentID: controlId,
    };
    return this._HttpClient.put(
      enviroment.API_URL + 'Gov/Control/ImplementationAssessment',
      payload
    );
  }

  // getGovControlEffective Api
  getGovControlEffective(
    sort_data: any,
    pageNumber: number = 1,
    perPage: number = 10,
    filters: any[] = [],
    GovControlID: any,
  ): Observable<any> {
    const     req = {
        search: '',
        pageNumber: pageNumber,
        pageSize: perPage,
        filters: filters,
        sortField: sort_data?.field,
        sortDirection: sort_data?.direction,
        GovControlID: GovControlID,
      };

    return this._HttpClient.post(
      enviroment.API_URL + 'Gov/Control/EffectivenessAssessment/search',
      req
    );
  }
    getGovControlEffectiveNew(
      req:any
  ): Observable<any> {


    return this._HttpClient.post(
      enviroment.API_URL + 'Gov/Control/EffectivenessAssessment/search',
      req
    );
  }

  getEffectiveControlsById(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `Gov/Control/EffectivenessAssessment/${id}`
    );
  }
  deleteffectiveControls(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + 'Gov/Control/EffectivenessAssessment/' + id
    );
  }

  createeffectiveControls(data: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'Gov/Control/EffectivenessAssessment',
      data
    );
  }
  updateeffectiveControls(id: any, data: any): Observable<any> {
    const payload = { ...data, govControlEffectivenessAssessmentID: id };
    return this._HttpClient.put(
      enviroment.API_URL + 'Gov/Control/EffectivenessAssessment',
      payload
    );
  }
  //Maturity Api

  getGovControlMaturity(
    sort_data: any,
    pageNumber: number = 1,
    perPage: number = 10,
    filters: any[] = [],
    GovControlID: any
  ): Observable<any> {
    const req = {
      search: '',
      pageNumber: pageNumber,
      pageSize: perPage,
      filters: filters,
      sortField: sort_data?.field,
      sortDirection: sort_data?.direction,
      GovControlID: GovControlID,
    };
    return this._HttpClient.post(
      enviroment.API_URL + 'Gov/Control/MaturityAssessment/search',
      req
    );
  }
    getGovControlMaturityNew(
 req:any
  ): Observable<any> {

    return this._HttpClient.post(
      enviroment.API_URL + 'Gov/Control/MaturityAssessment/search',
      req
    );
  }

  deletMaturityControls(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + 'Gov/Control/MaturityAssessment/' + id
    );
  }
  createMaturityControls(data: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'Gov/Control/MaturityAssessment',
      data
    );
  }
  updateMaturityControls(id: any, data: any): Observable<any> {
    const payload = { ...data, govControlMaturityAssessmentID: id };
    return this._HttpClient.put(
      enviroment.API_URL + 'Gov/Control/MaturityAssessment',
      payload
    );
  }

  getMaturityControlsById(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `Gov/Control/MaturityAssessment/${id}`
    );
  }
  setSelectedTypeId(id: number) {
    this.selectedTypeIdSource.next(id);
  }

  setMatrityTypeId(id: number) {
    this.MatrityTypeIdSource.next(id);
  }
  getLookupsMaturityStatus(id: any) {
    return this._HttpClient.get(
      enviroment.API_URL +
        `Gov/Control/MaturityAssessment/by-maturity-level-type/${id}`
    );
  }
  getAssetsLookUpData(): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + 'BusinessEntityCatalog/LookUp'
    );
  }

  getElementContent(docId: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + 'Gov/Element/tree/' + docId
    );
  }
  getElementById(id: any): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + 'Gov/Element/' + id);
  }

  deleteElement(id: any): Observable<any> {
    return this._HttpClient.delete(enviroment.API_URL + `Gov/Element/${id}`);
  }

  modifyElement(data: any): Observable<any> {
    console.log('data', data);

    const isUpdating = data?.id;
    const method = isUpdating ? 'put' : 'post';
    const url = enviroment.API_URL + 'Gov/Element';

    return this._HttpClient[method](url, data);
  }

  // ControlRequirement Api

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
        govControlID: GovControlID,
      };
    } else {
      req = {
        ...payload,
        GovControlID,
      };
    }
    return this._HttpClient.post(
      enviroment.API_URL + 'Gov/Control/Requirement/Search',
      req
    );
  }
  getRequirementControlsById(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `Gov/Control/Requirement/${id}`
    );
  }
  deleteRequirementControls(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + 'Gov/Control/Requirement/' + id
    );
  }

  createRequirement(data: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'Gov/Control/Requirement',
      data
    );
  }

  updateRequirement(data: any): Observable<any> {
    return this._HttpClient.put(
      enviroment.API_URL + 'Gov/Control/Requirement',
      data
    );
  }

  getControlById(id: number, type: string): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `Gov/Control/${type}Assessment/${id}`
    );
  }


  moveElement(payload:any):Observable<any>{
    return this._HttpClient.put(enviroment.API_URL+`Gov/Element/move`  , payload)
  }
  mergeElement(payload:any):Observable<any>{
    return this._HttpClient.put(enviroment.API_URL+`Gov/Element/merge`  , payload)
  }
  reOrderElement(payload:any):Observable<any>{
        return this._HttpClient.put(enviroment.API_URL+`Gov/Element/reorder`  , payload)

  }



  getOneGovernanceDocument(id:any):Observable<any>{
    return this._HttpClient.get(enviroment.API_URL + `Gov/Document/${id}`)
  }


  getClassficationByElementTypeId(id:any):Observable<any>{
    return this._HttpClient.get(enviroment.API_URL + `Gov/GRCDocumentElementClassificationByGovDocumentTypeID/${id}`)
  }
}
