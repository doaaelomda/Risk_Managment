/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
@Injectable({
  providedIn: 'root',
})
export class GovDocumentsService {
  constructor(private _HttpClient: HttpClient) {}
  currentContentTypes = signal([])
  getDocumentsSearch(
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
    return this._HttpClient.post(
      enviroment.API_URL + 'Gov/Document/search',
      req
    );
  }
   getDocumentsSearchNew(
  req:any
  ): Observable<any> {

    return this._HttpClient.post(
      enviroment.API_URL + 'Gov/Document/search',
      req
    );
  }

  deleteDocument(id: any): Observable<any> {
    return this._HttpClient.delete(enviroment.API_URL + `Gov/Document/${id}`);
  }


    getOneDoc(id: number): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + `Gov/Document/${id}`);
  }
  // Version Api

  getVersionSearch(
    payload:any,
    govDocumentId: any
  ): Observable<any> {
    const req = {
      ...payload,
      govDocumentId: govDocumentId,
    };
    return this._HttpClient.post(
      enviroment.API_URL + 'Gov/Version/Search',
      req
    );
  }

  deleteVersion(id: any): Observable<any> {
    return this._HttpClient.delete(enviroment.API_URL + `Gov/Version/${id}`);
  }

    createVersionr(req?: any) {
    return this._HttpClient.post(enviroment.API_URL + 'Gov/Version', req);
  }
  updateVersion(req?: any) {
    return this._HttpClient.put(enviroment.API_URL + 'Gov/Version', req);
  }
  getByIdVersion(id?: any) {
    return this._HttpClient.get(enviroment.API_URL + `Gov/Version/${id}`);
  }




    UpdateEditor(req?: any) {
    return this._HttpClient.put(enviroment.API_URL + 'Gov/Version/Content', req);
  }

    getByIdEditor(id?: any) {
    return this._HttpClient.get(enviroment.API_URL + `Gov/Version/Content/${id}`);
  }

  addAllChecked(req?: any) {
    return this._HttpClient.post(enviroment.API_URL + 'Gov/addAll', req);
  }

  getContent(){
    return this._HttpClient.get(enviroment.API_URL + `Gov/Version/Content/`);
  }



    // ---------------------------------
  getApprovers(id: unknown) {
    return this._HttpClient.get(
      enviroment.API_URL + `Gov/ApproversByDocument/${id}`
    );
  }
  saveApprover(req: any,govDocumentApproverID?:number) {
    const method = govDocumentApproverID ? 'put':'post'
    const payload = {
      ...req,
      govDocumentApproverID
    }
    return this._HttpClient[method](enviroment.API_URL + 'Gov/Approver', payload);
  }
  deleteApprover(id: unknown) {
    return this._HttpClient.delete(enviroment.API_URL + `Gov/Approver/${id}`);
  }
  getApproverDetails(id: unknown) {
    return this._HttpClient.get(enviroment.API_URL + `Gov/Approver/${id}`);
  }

  getReviewers(id: unknown) {
    return this._HttpClient.get(
      enviroment.API_URL + `Gov/ReviewerByDocument/${id}`
    );
  }
  saveReviewer(req: any,govDocumentReviewerID?:number) {
    const method = govDocumentReviewerID ? 'put':'post'
    const payload = {
      ...req,
     govDocumentReviewerID
    }
    return this._HttpClient[method](enviroment.API_URL + 'Gov/Reviewer', payload);
  }
  deleteReviewer(id: unknown) {
    return this._HttpClient.delete(enviroment.API_URL + `Gov/Reviewer/${id}`);
  }

  getReviewerDetails(id: unknown) {
    return this._HttpClient.get(enviroment.API_URL + `Gov/Reviewer/${id}`);
  }
}
