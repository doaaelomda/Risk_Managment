import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  constructor(private httpClient: HttpClient) {}
  readonly BASE_URL = 'Users';

  getUserData(): Observable<unknown> {
    return this.httpClient.get(
      enviroment.API_URL + this.BASE_URL + '/UserData'
    );
  }
  getUserImage(): Observable<unknown> {
    return this.httpClient.get(
      enviroment.API_URL + this.BASE_URL + '/UserImage'
    );
  }

  updateUserImage(image: File): Observable<unknown> {
    const formData =new FormData
    formData.append('image',image)
    return this.httpClient.post(
      enviroment.API_URL + this.BASE_URL + '/UserImage',
      formData
    );
  }
}
