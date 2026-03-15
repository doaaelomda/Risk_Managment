/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class PendingAssessmentService {
  constructor(private _HttpClient: HttpClient) {}

  addComplianceAssessment(data: any) {
    return this._HttpClient.post(
      enviroment.API_URL + `Gov/Control/ComplianceAssessment/Compliance`,
      data
    );
  }

  addMaturityAssessment(data: any) {
    return this._HttpClient.post(
      enviroment.API_URL + `Gov/Control/MaturityAssessment/Compliance`,
      data
    );
  }

  getComplianceAssessmentList(payload: any) {
    return this._HttpClient.post(
      enviroment.API_URL + `Gov/Control/ComplianceAssessment/Compliance/search`,
      payload
    );
  }
  getMaturityAssessmentList(payload: any) {
    return this._HttpClient.post(
      enviroment.API_URL + `Gov/Control/MaturityAssessment/Compliance/search`,
      payload
    );
  }

  deleteComplianceAssessment(assessmentID: any) {
    return this._HttpClient.delete(
      enviroment.API_URL + `Gov/Control/ComplianceAssessment/${assessmentID}`
    );
  }

  deleteMaturityAssessment(assessmentID: any) {
    return this._HttpClient.delete(
      enviroment.API_URL + `Gov/Control/MaturityAssessment/${assessmentID}`
    );
  }

  getMaturityByControlID(controlID: any) {
    return this._HttpClient.get(
      enviroment.API_URL + `Gov/Control/${controlID}/maturityLevel`
    );
  }

  getAssessmentControlsByComplianceAssessmentID(payload: any) {
    return this._HttpClient.post(
      enviroment.API_URL +
        `ComplianceAssessment/control-assessment/by-compliance-assessment`,
      payload
    );
  }

  getAssessmentsTypes(assessmentId: any, govControlId: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL +
        `ComplianceAssessment/ControlAssessment/${assessmentId}/GovControl/${govControlId}`
    );
  }

  getProcedures(id: number): Observable<any> {
    return this._HttpClient.get(
      `${enviroment.API_URL}BPM/BusinessProcedureAssessment/${id}`
    );
  }
  getProcedureAssessments(payload: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'BPM/Procedure/Assessment/search',
      payload
    );
  }
  saveProcedureAssessment(payload: any): Observable<any> {
    const method = payload?.businessProcedureAssessmentID ? 'put' : 'post';

    return this._HttpClient[method](
      enviroment.API_URL + 'BPM/Procedure/Assessment',
      payload
    );
  }
  deleteAssessment(id:number):Observable<any>{
    return this._HttpClient.delete(enviroment.API_URL + `BPM/Procedure/Assessment/${id}`)
  }


  getComplianceAssessmentItemResultById(id:any):Observable<any>{
    return this._HttpClient.get(enviroment.API_URL + `ComplianceAssessment/ComplianceAssessmentItemResult/${id}`)
  }


  updateComplianceAssessmentItemResult(payload:any):Observable<any>{
    return this._HttpClient.put(enviroment.API_URL + `ComplianceAssessment/ComplianceAssessmentItemResult/update`,payload)
  }



  getComplianceAssessmentStatusByItemResultId(id:any):Observable<any>{
    return this._HttpClient.get(enviroment.API_URL + `ComplianceAssessment/ComplianceAssessmentItemResultStatusType/${id}`)
  }

}
