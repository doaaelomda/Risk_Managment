/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { enviroment } from "apps/gfw-portal/env/dev.env";
@Injectable({
  providedIn:'root'
})



export class ReviewCommentsService{
  constructor(private _HttpClient:HttpClient){}




  getReviewCommentsAsAdmin(page_size:number , page_number:number , govDocumentVersionID:number):Observable<any>{
    return this._HttpClient.post(enviroment.API_URL + `Gov/ReviewComment/Search` , {
        "pageNumber":page_number,
  "pageSize": page_size,

  "govDocumentVersionID": govDocumentVersionID
    })
  }
  getReviewCommentsAsAdminById(id?:any):Observable<any>{
    return this._HttpClient.get(enviroment.API_URL + `Gov/ReviewComment/${id}`)
  }

}
