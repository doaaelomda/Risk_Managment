import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComplianceAssessmntService {
  constructor(private _HttpClient: HttpClient) {}

  // getAssessmnet(
  //   sort_data: any = null,
  //   pageNumber: number = 1,
  //   perPage: number = 10,
  //   filters: any[] = []
  // ): Observable<any> {
  //   const req = {
  //     govDocumentContentId: 0,
  //     pageNumber: pageNumber,
  //     pageSize: perPage,
  //     filters: filters,
  //     sortField: sort_data?.field,
  //     sortDirection: sort_data?.direction,
  //   };
  //   return this._HttpClient.post(
  //     enviroment.API_URL + 'ComplianceAssessment/Search',
  //     req
  //   );
  // }

  getAssessmnet(payload: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'ComplianceAssessment/Search',
      payload
    );
  }
  createAssessmnet(data: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'ComplianceAssessment',
      data
    );
  }
  deleteAssessmnet(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + 'ComplianceAssessment/' + id
    );
  }
  getAssessmnetById(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `ComplianceAssessment/${id}`
    );
  }
  updateAssessmnet(data: any): Observable<any> {
    return this._HttpClient.put(
      enviroment.API_URL + 'ComplianceAssessment',
      data
    );
  }

  getPendingAssessmnet(
req :any ): Observable<any> {

    return this._HttpClient.post(
      enviroment.API_URL + 'ComplianceAssessment/Pending',
      req
    );
  }

  // Evidence Api
  deleteEvidenceCompliance(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + 'Evidence/EvidenceType/' + id
    );
  }

  getEvidenceComplianceSearch(
    payload:any
  ): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'Evidence/EvidenceType/Search',
      payload
    );
  }

  getEvidenceComplianceById(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `Evidence/EvidenceType/${id}`
    );
  }
  addEvidenceCompliance(data: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'Evidence/EvidenceType',
      data
    );
  }
  updateEvidenceCompliance(data: any): Observable<any> {
    return this._HttpClient.put(
      enviroment.API_URL + 'Evidence/EvidenceType',
      data
    );
  }

  // Evidence Version Api
  deleteEvidenceVersion(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + 'Evidence/EvidenceTypeVersion/' + id
    );
  }

  getEvidenceVersionSearch(
    payload:any,evidenceTypeID:any
  ): Observable<any> {
    const req = {
      ...payload,
      evidenceTypeID: evidenceTypeID,
    };
    return this._HttpClient.post(
      enviroment.API_URL + 'Evidence/EvidenceTypeVersion/Search',
      req
    );
  }

  getEvidenceVersionById(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `Evidence/EvidenceTypeVersion/${id}`
    );
  }
  addEvidenceVersion(data: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'Evidence/EvidenceTypeVersion',
      data
    );
  }
  updateEvidenceVersion(data: any): Observable<any> {
    return this._HttpClient.put(
      enviroment.API_URL + 'Evidence/EvidenceTypeVersion',
      data
    );
  }

  // api Evidence Controls
  deleteEvidenceControl(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + 'Evidence/EvidenceTypeControl/' + id
    );
  }

  getEvidenceControlSearch(
    payload:any,
    evidenceTypeID: any
  ): Observable<any> {
    const req = {
      ...payload,
      evidenceTypeID: evidenceTypeID,
    };
    return this._HttpClient.post(
      enviroment.API_URL + 'Evidence/EvidenceTypeControl/Search',
      req
    );
  }

  getEvidenceControlById(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `Evidence/EvidenceTypeControl/${id}`
    );
  }
  addEvidenceControl(data: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'Evidence/EvidenceTypeControl',
      data
    );
  }
  updateEvidenceControl(data: any): Observable<any> {
    return this._HttpClient.put(
      enviroment.API_URL + 'Evidence/EvidenceTypeControl',
      data
    );
  }

  // api CompetentAuthorities Controls
  deleteCompetentAuthoritie(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + 'Gov/ComplianceRegulator/' + id
    );
  }

  getCompetentAuthoritieSearch(
    sort_data: any = null,
    pageNumber: number = 1,
    perPage: number = 10,
    filters: any[] = []
  ): Observable<any> {
    const req = {
      sortField: sort_data?.field,
      pageNumber: pageNumber,
      pageSize: perPage,
      filters: filters,
      sortDirection: sort_data?.direction,
    };
    return this._HttpClient.post(
      enviroment.API_URL + 'Gov/ComplianceRegulator/Search',
      req
    );
  }

  getCompetentAuthoritieById(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `Gov/ComplianceRegulator/${id}`
    );
  }
  addCompetentAuthoritie(data: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'Gov/ComplianceRegulator',
      data
    );
  }
  updateCompetentAuthoritie(data: any): Observable<any> {
    return this._HttpClient.put(
      enviroment.API_URL + 'Gov/ComplianceRegulator',
      data
    );
  }

  getAllCompetentAuthoritie(): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + 'Gov/ComplianceRegulator');
  }

  createControlAssessment(
    controlIds: any[],
    complianceAssessmentID: any
  ): Observable<any> {
    const req: any = {
      govControlIDs: controlIds,
      complianceAssessmentID,
    };
    return this._HttpClient.post(
      enviroment.API_URL + `ComplianceAssessment/Create_Control_Assessment`,
      req
    );
  }

  // Gov Control Search
  getControlsGovSearchNew(payload: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'Gov/Control/search',
      payload
    );
  }




  getSelectedControlsIDS(assessmentId:any):Observable<any>{
    return this._HttpClient.get(enviroment.API_URL + `ComplianceAssessment/${assessmentId}/GovControlIds`);
  }

   getComplianceAssessmentDashboardDetails(ComplianceAssessmentID:number,CompliancePhaseID:number):Observable<any>{
   return this._HttpClient.get(enviroment.API_URL + `ComplianceAssessment/Reports/ComplianceAssessmentReportNode?ComplianceAssessmentID=${ComplianceAssessmentID}&CompliancePhaseID=${CompliancePhaseID}`)
   }




   saveAuthorityImage(payload:any):Observable<any>{
    return this._HttpClient.post(enviroment.API_URL + `Gov/ComplianceRegulator/ComplianceRegulatorImage` , payload)
   }
}





