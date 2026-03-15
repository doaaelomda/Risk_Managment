import { ComplianceAssessmntService } from './../services/compliance-assessmnt.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComplianceService {
  constructor(private _HttpClient: HttpClient) {}
  private GovControlData = new BehaviorSubject<any>(null);
  GovControlData$ = this.GovControlData.asObservable();

  private controlAssessmentID = new BehaviorSubject<any>(null);
  controlAssessmentID$ = this.controlAssessmentID.asObservable();

  deleteDocument(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + 'ComplianceDocument/' + id
    );
  }
  getProfiles(id: number): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `DataEntity/data-view/${id}/columns`
    );
  }
  getGovermentSearch(
    payload:any
  ): Observable<any> {

    return this._HttpClient.post(
      enviroment.API_URL + 'ComplianceDocument/Search',
      payload
    );
  }
  getAssetsLookUpData(): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + 'BusinessEntityCatalog/LookUp'
    );
  }
  saveRiskData(data: any): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + 'Risks', data);
  }

  getDocumentCompliance(id: number): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `ComplianceDocument/${id}`
    );
  }
  getRiskActionLookupData(ids: number[]): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + 'Lookup/multi', ids);
  }
  getDocumentNames(
    govRegulatorId: any,
    govDocumentTypeId: any
  ): Observable<any> {
    const url = `${enviroment.API_URL}Gov/Control/documents/by-regulator-type?govRegulatorId=${govRegulatorId}&govDocumentTypeId=${govDocumentTypeId}`;
    return this._HttpClient.get(url);
  }

  createDocumentGov(data: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'ComplianceDocument',
      data
    );
  }

  updateDocumentGov(id?: number, data?: any): Observable<any> {
    data.permissionID = id;
    return this._HttpClient.put(
      enviroment.API_URL + `ComplianceDocument`,
      data
    );
  }

  modifyDocumentContent(data: any): Observable<any> {
    const isUpdating = data?.complianceDocumentElementID;
    const method = isUpdating ? 'put' : 'post';
    const url = enviroment.API_URL + 'ComplianceDocument/ComplianceDocumentElement';

    return this._HttpClient[method](url, data);
  }

  deleteDocContent(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + `ComplianceDocument/ComplianceDocumentElement/${id}`
    );
  }

  getDocContentById(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + 'ComplianceDocument/ComplianceDocumentElement/' + id
    );
  }

  getDocsContent(docId: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL +
        'ComplianceDocument/ComplianceDocumentElement/tree/' +
        docId
    );
  }

  setGovControlData(data: any) {
    this.GovControlData.next(data);
  }

  setcontrolAssessmentID(data: any) {
    this.controlAssessmentID.next(data);
  }
  getOneGovControl(id: number): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + `Gov/Control/${id}`);
  }

  getTreePendingAssessment(
    complianceDocumentID: any,
    assessmentId: any
  ): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL +
        'ComplianceAssessment/compliance-document-elements/tree-with-assessment/' +
        complianceDocumentID +
        '/' +
        assessmentId
    );
  }

  // Finding_Api

  createFinding(Data?: any) {
    return this._HttpClient.post(enviroment.API_URL + 'Finding', Data);
  }
  UpdateFinding(Data?: any) {
    return this._HttpClient.put(enviroment.API_URL + 'Finding', Data);
  }
  getByIdFindings(id?: any) {
    return this._HttpClient.get(
      enviroment.API_URL + 'Finding/Id?FindingID=' + id
    );
  }

  deleteFinding(FindingId?: any) {
    return this._HttpClient.delete(enviroment.API_URL + 'Finding/Id', {
      body: { findingID: FindingId },
    });
  }
  getFinding(payload:any,
    dataEntityTypeID?: any,
    dataEntityID?: any,
  ): Observable<any> {
    const req: any = {
      ...payload,
      dataEntityTypeID:dataEntityTypeID,
      dataEntityID:dataEntityID
    };
    return this._HttpClient.post(enviroment.API_URL + 'Finding/Search', req);
  }

  // Get Controls By Assessmnet Control Id

  getControlsByComplianceId(
payload:any,
complianceAssessmentId:any
  ): Observable<any> {
    const req: any = payload;
    req.complianceAssessmentId =complianceAssessmentId
    return this._HttpClient.post(
      enviroment.API_URL +
        'ComplianceAssessment/control-assessment/by-compliance-assessment',
      req
    );
  }

  deleteControlAssessmentComplianceASS(id: any) {
    return this._HttpClient.delete(
      enviroment.API_URL +
        'ComplianceAssessment/Delete_Control_Assessment/' +
        id
    );
  }

  createControlAssessmentByComplianceASS(data: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'ComplianceAssessment/Create_Control_Assessment',
      data
    );
  }

  getByIdControlAssessmentByComplianceASS(id?: any) {
    return this._HttpClient.get(
      enviroment.API_URL + 'ComplianceAssessment/GetControlAssessment' + id
    );
  }


  // dashboard
    ComplianceDocumentDashBoard(
      sort_data: any = null,
    pageNumber: number = 1,
    perPage: number = 10,
    filters?: any,
    regulatorID?:any
  ): Observable<any> {
     const req: any = {
      search: '',
      sortField: sort_data?.field,
      sortDirection: sort_data?.direction,
      dataViewId: 1,
      pageNumber,
      pageSize: perPage,
      filters,
      regulatorID: regulatorID,
    };
    return this._HttpClient.post(
      enviroment.API_URL + 'ComplianceDocument/ComplianceDocumentDashboard' , req )
    }

        moveElement(payload:any):Observable<any>{
    return this._HttpClient.put(enviroment.API_URL+`ComplianceDocument/ComplianceDocumentElementmove`  , payload)
  }
  mergeElement(payload:any):Observable<any>{
    return this._HttpClient.put(enviroment.API_URL+`ComplianceDocument/ComplianceDocumentElementmerge`  , payload)
  }
  reOrderElement(payload:any):Observable<any>{
        return this._HttpClient.put(enviroment.API_URL+`ComplianceDocument/ComplianceDocumentElementreorder`  , payload)

  }


  getElementClassificationsByProfileID(id:number):Observable<unknown>{
    return this._HttpClient.get(enviroment.API_URL + 'Gov/GRCDocumentElementClassificationByProfileId/' + id)
  }
}
