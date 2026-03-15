import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';
export interface IAssessmentCreation {
  controlAssessmentID?: number;
  complianceAssessmentID?: number;
  govControlRequirementID: number;
  assessmentDate: Date;
  assessedByUserID: number;
  govControlRequirementComplianceStatusTypeID: number;
  comments: string;
  govControlRequirementAssessmentID?: number;
  requirementAssessmentID:number;
}
@Injectable({
  providedIn: 'root',
})
export class RequirmentAssessmentService {
  constructor(private httpClient: HttpClient) {}
  activeGovControl = signal<unknown>(null);
  baseURL = 'Gov/Control/RequirementCompliance';
  getRequirmentsControlAssessments(payload: {
    controlAssessmentID: number;
    complianceAssessmentID: number;
    govControlRequirementID?: number;
    govControlRequirementAssessmentID:number;
    pageNumber: number;
    pageSize: number;
  }): Observable<unknown> {
    return this.httpClient.post(
      `${enviroment.API_URL}${this.baseURL}/search`,
      payload
    );
  }
  deleteAssessment(id: number): Observable<unknown> {
    return this.httpClient.delete(`${enviroment.API_URL}${this.baseURL}/${id}`);
  }
  saveAssessment(data: IAssessmentCreation): Observable<unknown> {
    const method = data.requirementAssessmentID ? 'put' : 'post';
    return this.httpClient[method](
      `${enviroment.API_URL}${this.baseURL}`,
      data
    );
  }


  editAssessment(data:any):Observable<unknown>{
    return this.httpClient.put(
      `${enviroment.API_URL}Gov/RequirementCompliance`,
      data
    );
  }





    getRequirementControls(
    pageNumber: number = 1,
    perPage: number = 10,
    GovControlID: any
  ): Observable<any> {
    const req = {
      search: '',
      pageNumber: pageNumber,
      pageSize: perPage,
      GovControlID: GovControlID,
    };
    return this.httpClient.post(
      enviroment.API_URL + 'Gov/Control/Requirement/Search',
      req
    );
  }


  getRequimentsControl(complianceId:any , govControlId:any):Observable<any>{
    return this.httpClient.get(enviroment.API_URL + `Gov/RequirementAssessment/ByGovControl?govControlID=${govControlId}`)
  }
}
