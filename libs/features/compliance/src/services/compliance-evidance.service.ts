/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from "@angular/core";
import { enviroment } from "apps/gfw-portal/env/dev.env";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})



export class ComplianceEvidanceService {
  constructor(private _HttpClient: HttpClient) {
    //
   }



  getComplianceContentElementLinkedEvidances(payload:any): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + `Evidence/EvidenceType/ComplianceDocumentElement/Search` , payload)
  }


  savedLinkedEvidancesComplianceDocumentElement(payload:any): Observable<any> {
    return this._HttpClient.put(enviroment.API_URL + `Evidence/Link/EvidenceType/ComplianceDocumentElement` , payload)
  }



  getLinkedEvidences(itemResult:any):Observable<any>{
    return this._HttpClient.get(enviroment.API_URL + `Evidence/${itemResult}/LinkedEvidenceTypeIds`)
  }


  getEvidencesTypes(payload:any):Observable<any>{
    return this._HttpClient.post(enviroment.API_URL + 'Evidence/EvidenceType/Search',payload)
  }

  linkEvidence(payload:any):Observable<any>{
    return this._HttpClient.put(enviroment.API_URL + 'Evidence/Link/EvidenceType/AssessmentItemResult',payload)
  }






  linkEvidanceVersion(payload:any):Observable<any>{
    return this._HttpClient.put(enviroment.API_URL + 'Evidence/Link/EvidenceTypeVersion/AssessmentItemResult',payload)
  }


  getLinkedEvidencesVersions(itemResult:any,evidenceTypeId:any):Observable<any>{
    return this._HttpClient.get(enviroment.API_URL + `Evidence/LinkedEvidenceTypeVersionIds/${itemResult}/${evidenceTypeId}`)
  }



  getEvidanceVersionData(id:any):Observable<any>{
    return this._HttpClient.get(enviroment.API_URL + `Evidence/EvidenceTypeVersion/${id}`)
  }



  deleteLinkedEvidanceType(itemResultId:any , evidanceTypeId:any):Observable<any>{
    return this._HttpClient.delete(enviroment.API_URL + `Evidence/${itemResultId}/LinkedEvidenceType/${evidanceTypeId}`)
  }



  deleteLinkedVersion(itemResult:any , evidanceType:any , versionId:any):Observable<any>{
    return this._HttpClient.delete(enviroment.API_URL  +  `Evidence/LinkedEvidenceTypeVersion?assessmentItemResultId=${itemResult}&evidenceTypeId=${evidanceType}&evidenceTypeVersionId=${versionId}`)
  }
}
