import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';

@Injectable({ providedIn: 'root' })
export class ImgService {
  private cache = new Map<number, any>();

  constructor(private _HttpClient: HttpClient) {}

  getData(userId: number): Observable<any> {
    if (!userId) return of(null);
    if (this.cache.has(userId)) {
      return of(this.cache.get(userId));
    }
    return this._HttpClient
      .get(enviroment.API_URL + `Users/UserImage/UserId?UserID=${userId}`)
      .pipe(tap((res) => this.cache.set(userId, res)));
  }
}
