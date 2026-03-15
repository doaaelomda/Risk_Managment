import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../../../../../../campagin-app/env/dev.env';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}
  userData = signal<{
    accessToken: string | null;
    expirationTime: string | null;
    email: string | null;
    id:number | null
  }>({ accessToken: null, expirationTime: null, email: null,id:null });

  validate(credentials: {
    userEmail: string;
    password: string;
  }): Observable<any> {
    return this.httpClient.post(
      enviroment.API_URL + 'v1/Auth/validatUser',
      credentials
    );
  }

  login(credentials: { userId: number; otp: string }): Observable<any> {
    return this.httpClient.post(
      enviroment.API_URL + 'v1/Auth/login',
      credentials
    );
  }

  resetPassword(credentials: {
    email: string;
    code: string;
    newPassword: string;
  }): Observable<any> {
    return this.httpClient.post(
      enviroment.API_URL + 'v1/Auth/ResetPassword',
      credentials
    );
  }

  sendResetCode(email: string) {
    return this.httpClient.post(
      enviroment.API_URL + 'v1/Auth/SendResetCode',
      email
    );
  }
}
