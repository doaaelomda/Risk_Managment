import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class AccessManagementService {
  constructor(private _HttpClient: HttpClient) {}
  getRolesTypeLookUp(): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + 'Roles/lookup');
  }

  getRolesProfile(id: number): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `DataEntity/data-view/${id}/columns`
    );
  }

  getRoleSearch(
   req:any
  ): Observable<any> {

    return this._HttpClient.post(enviroment.API_URL + 'Roles/Search', req);
  }
  getPermissionsSearch(
  req:any
  ): Observable<any> {

    return this._HttpClient.post(
      enviroment.API_URL + 'Permissions/search',

      req
    );
  }

  modifyRole(data: any, id?: any) {
    const url = enviroment.API_URL + 'Roles' + (id ? `/id` : '');
    const method = id ? 'put' : 'post';

    const Data = {
      name: data?.nameEn,
      nameAr: data?.nameAr,
      description: data?.description,
      isActive: data?.status,
      ownerUserID: data?.role_admin,
      roleReportToID: data?.report_to,
      roleTypeID: data?.role_type,
      organizationalUnitId: data?.organizationalUnit?.id,
      ...(id ? { id: +id } : {}),
    };
    console.log('URL:', url);

    return this._HttpClient[method](url, Data);
  }

  deleteRole(id: any) {
    const body = {
      roleId: id,
    };
    const url = enviroment.API_URL + `Roles/id`;
    return this._HttpClient.delete(url, {
      body: body,
    });
  }

  getRole(id: any) {
    return this._HttpClient.get(enviroment.API_URL + `Roles/id?RoleId=${id}`);
  }
  currentRoleData: BehaviorSubject<any> = new BehaviorSubject(null);

  getPermissions(roleId: any) {
    const body = {
      roleID: +roleId,
    };
    return this._HttpClient.post(
      enviroment.API_URL + 'RolePermissions/RoleId',
      body
    );
  }

  savePermissions(permissionIds: string | number[], roleId: number | string) {
    const body = {
      roleId,
      permissionIds,
    };
    return this._HttpClient.post(enviroment.API_URL + 'RolePermissions', body);
  }

  modifyUserRole(data: any, roleId: any, isEditing?: boolean) {
    const method = isEditing ? 'put' : 'post';
    const url = isEditing ? 'Roles/UpdateUserRole' : 'Roles/CreateUserRole';
    const Data = {
      userId: data?.user,
      roleId: +roleId,
      expireOn: moment(data?.date, 'MM-DD-YYYY').utc(true).toISOString(),
      userRoleTypeID: +data?.userType,
    };
    if(data?.userRoleTypeID === 2) delete data.expireOn;
    return this._HttpClient[method](enviroment.API_URL + url, Data);
  }

  removeUserRole(userId: any, roleId: any) {
    const Data = {
      userId: userId,
      roleId: +roleId,
    };
    return this._HttpClient.delete(
      enviroment.API_URL + `Roles/RemoveUserRole`,
      {
        body: Data,
      }
    );
  }

  getUserData(userId: any, roleId?: any) {
    const body = {
      userId,
      ...(roleId && { roleId: roleId }),
    };
    return this._HttpClient.post(
      enviroment.API_URL + `Users/GetUserById`,
      body
    );
  }

  searchUserRole() {
    return this._HttpClient.get(enviroment.API_URL + `SearchUserRole`);
  }

  getSearchUserRole(
    payload:any,
    roleId: any = '',
  ): Observable<any> {
    payload['roleId']=roleId
    return this._HttpClient.post(
      enviroment.API_URL + 'Roles/SearchUserRole',
      payload
    );
  }

  modifyUser(data: any, userId?: string | number) {
    const method = userId ? 'put' : 'post';
    const url = userId ? 'Users/update-user' : 'Users/craete-user';
    console.log(data?.organizationalUnitID,'data?.OrganizationUnit');

    const Data = {
      userName: data?.username,
      email: data?.email,
      name: data?.nameEnglish,
      nameAr: data?.nameArabic,
      isActive: data?.Status == 1,
      organizationalUnitID: data?.organizationalUnitID?.id,
      ...(userId && { userId: userId }),
      postion: data?.postion,
    };
    return this._HttpClient[method](enviroment.API_URL + url, Data);
  }

  getUsersList(
    sort_data: any = null,
    pageNumber: number = 1,
    pageSize: number = 10,
    filters: any[] = [],

    search: any = '',
    newTable:boolean=false,
    payload?:any
  ): Observable<any> {
    let req
    if(newTable){
      req = {
        ...payload
      }
    } else{
           req = {
      search,
      pageNumber,
      pageSize,
      filters,
      sortField: sort_data?.field,
      sortDirection: sort_data?.direction,
    };
    }

    return this._HttpClient.post(enviroment.API_URL + 'Users/search', req);
  }

  deleteUser(userId: any) {
    return this._HttpClient.delete(enviroment.API_URL + `Users/${userId}`);
  }

  getUserById(userId: any) {
    return this._HttpClient.get(enviroment.API_URL + `Users/${userId}`);
  }

  GetAllRolesinUser() {
    return this._HttpClient.get(enviroment.API_URL + `Users/RolesInUser`);
  }
  modifyUserRoles(userId: string | number, roleIds: any) {
    const method = 'post';
    const body = {
      userId,
      roleIds,
    };
    return this._HttpClient[method](
      enviroment.API_URL + `Users/CreatRoleInUser`,
      body
    );
  }

  getUserRoles(userId: string | number) {
    const method = 'post';
    const body = {
      userId,
    };
    return this._HttpClient[method](enviroment.API_URL + `Users/UserId`, body);
  }

  getUserPermissions(userId:string|number) {
    console.log(userId,'userId here');

    return this._HttpClient.post(enviroment.API_URL + 'Users/UserPermissions',{userId})
  }
}
