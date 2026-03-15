import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from "apps/gfw-portal/env/dev.env";

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(private _HttpClient: HttpClient) {}

  getPermission(userId?: string): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + `Users/UserPermissions`, {
      userId: userId,
    });
  }
}
