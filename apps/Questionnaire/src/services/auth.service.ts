import { HttpClient } from '@angular/common/http';
/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from "@angular/core";
import { enviroment } from "apps/Questionnaire/env/env.dev";
import { BehaviorSubject, map, Observable } from "rxjs";
import { Router } from '@angular/router';
@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private _httpClient: HttpClient , private _Router:Router) {
    console.log("Hello I'm Intailized ");
    const accessKey = localStorage.getItem('accessKey');
    if(accessKey){
      this.accessData$.next(accessKey);
      this._Router.navigate(['/welcome']);
    }

  }



  private accessData$ = new BehaviorSubject<any>(null);
  verifyToken(externalAccessToken: string): Observable<any> {
    return this._httpClient.post(
      enviroment.API_URL + 'Questionnaire/Questionnair/ExternalAccess',
      { externalAccessToken }
    ).pipe(
      map((response: any) => {
        return {
          ...response,
          accessKey: externalAccessToken
        };
      })
    )
  }




  setAccessData(data: string|null) {
    this.accessData$.next(data);
    if(!data){
      localStorage.removeItem('accessKey');
      return
    }
    localStorage.setItem('accessKey',data);
    
  }

  getAccessData(): Observable<any> {
    return this.accessData$.asObservable();
  }


}
