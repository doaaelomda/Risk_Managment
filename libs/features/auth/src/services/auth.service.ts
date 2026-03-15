/* eslint-disable @nx/enforce-module-boundaries */
import { enviroment } from './../../../../../apps/gfw-portal/env/dev.env';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
@Injectable({
  providedIn:'root'
})


export class AuthService{
  constructor(private _Router:Router,private _HttpClient:HttpClient ){
    this.handleLogin()
  }



  validateUserInfo(req:any):Observable<any>{
    return this._HttpClient.post(enviroment.API_URL + 'v1/Auth/validatUser' , req)
  }


  login(req:any):Observable<any>{
    return this._HttpClient.post(enviroment.API_URL + 'v1/Auth/login' , req)
  }


  current_user_id_validate:BehaviorSubject<any> = new BehaviorSubject<any>(null)
  email:BehaviorSubject<any> = new BehaviorSubject<any>(null)




  current_login_user_data:BehaviorSubject<any> = new BehaviorSubject<any>(null)




  handleLogin(){
    const userData = JSON.parse(`${localStorage.getItem('userData')}`)
    if(userData){
      this.current_login_user_data.next(jwtDecode(userData?.accessToken))
      console.log("JWT Decodded" , jwtDecode(userData?.accessToken) );


      // this._Router.navigate(['/gfw-portal/risks-management/risks-list'])
    }else{
      this._Router.navigate(['/auth'])
    }
  }


  sendResetPasswordCode(email:string):Observable<any>{
    return this._HttpClient.post(enviroment.API_URL + `v1/Auth/SendResetCode` , {email})
  }



  resetUserPassword(data:any):Observable<any>{
    return this._HttpClient.post(enviroment.API_URL + `v1/Auth/ResetPassword` , data)
  }




}
