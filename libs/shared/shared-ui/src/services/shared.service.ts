/* eslint-disable @nx/enforce-module-boundaries */
import { colorDropDown } from './../../../../../apps/gfw-portal/src/app/core/models/colorDropDown.interface';
import { colorDashboard } from './../../../../../apps/gfw-portal/src/app/core/models/colorDashboard.interface';
import { enviroment } from './../../../../../apps/gfw-portal/env/dev.env';
import { Injectable } from '@angular/core';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor(private _HttpClient: HttpClient) {}

  // Cache for API requests to prevent duplicate calls
  private apiRequestCache = new Map<string, Observable<any>>();






  public colorsDashboard:colorDashboard[]=[
  { "color": "#1E90FF", "colorName": "DodgerBlue" },
  { "color": "#4682B4", "colorName": "SteelBlue" },
  { "color": "#73C0DE", "colorName": "SkyBlue" },
  { "color": "#B0E0E6", "colorName": "PowderBlue" },
  { "color": "#2E8B57", "colorName": "DarkGreen" },
  { "color": "#3BA272", "colorName": "Teal" },
  { "color": "#91CC75", "colorName": "Green" },
  { "color": "#ADFF2F", "colorName": "GreenYellow" },
  { "color": "#FFD700", "colorName": "Gold" },
  { "color": "#FAC858", "colorName": "LightYellow" },
  { "color": "#FFA500", "colorName": "Orange" },
  { "color": "#FF8C00", "colorName": "DarkOrange" },
  { "color": "#EA7CCC", "colorName": "Pink" },
  { "color": "#FF69B4", "colorName": "HotPink" },
  { "color": "#9370DB", "colorName": "MediumPurple" },
  { "color": "#9A60B4", "colorName": "Purple" },
  { "color": "#FF6347", "colorName": "Tomato" },
  { "color": "#FF4500", "colorName": "OrangeRed" },
  { "color": "#FF0000", "colorName": "Red" },
  { "color": "#DC143C", "colorName": "DarkRed" },
  { "color": "#D3D3D3", "colorName": "LightGray" },
  { "color": "#A9A9A9", "colorName": "DarkGray" },
  { "color": "#808080", "colorName": "Gray" },
  { "color": "#696969", "colorName": "DimGray" }
]


handleSystemActions(url:string):Observable<any>{
  return this._HttpClient.post(enviroment.DOMAIN_URI + url , null )
}


getDataEntityActions(dataEntityTypeId:number , entityId : number):Observable<any>{
  const cacheKey = `getDataEntityActions_${dataEntityTypeId}_${entityId}`;

  if (!this.apiRequestCache.has(cacheKey)) {
    const request = this._HttpClient.get(enviroment.DOMAIN_URI + `${dataEntityTypeId}/Actions?entityId=${entityId}`)
      .pipe(shareReplay(1));
    this.apiRequestCache.set(cacheKey, request);
  }

  return this.apiRequestCache.get(cacheKey)!;
}



getWFActionsSystem(dataEntityTypeId:number , entityId : number):Observable<any>{
  const cacheKey = `getWFActionsSystem_${dataEntityTypeId}_${entityId}`;

  if (!this.apiRequestCache.has(cacheKey)) {
    const request = this._HttpClient.get(enviroment.API_URL + `WF/Decisions?dataEntityTypeId=${entityId}&dataEntityId=${dataEntityTypeId}`)
      .pipe(shareReplay(1));
    this.apiRequestCache.set(cacheKey, request);
  }

  return this.apiRequestCache.get(cacheKey)!;
}


handleExcuteWFAction(dataEntityTypeID:number , dataEntityID:number , wfDecisionID:number):Observable<any>{
  const req =
    {
  "dataEntityTypeID": dataEntityTypeID,
  "dataEntityID": dataEntityID,
  "wfDecisionID": wfDecisionID
}

  return this._HttpClient.post(enviroment.API_URL + `WF/ExecuteDecision` , req )
}



public colorDropDown:colorDropDown[]=[
  { "color": "#1E90FF", "nameEn": "DodgerBlue", "nameAr": "أزرق مشرق" },
  { "color": "#4682B4", "nameEn": "SteelBlue", "nameAr": "أزرق فولاذي" },
  { "color": "#73C0DE", "nameEn": "SkyBlue", "nameAr": "أزرق سماوي" },
  { "color": "#B0E0E6", "nameEn": "PowderBlue", "nameAr": "أزرق بودري" },
  { "color": "#2E8B57", "nameEn": "DarkGreen", "nameAr": "أخضر غامق" },
  { "color": "#3BA272", "nameEn": "Teal", "nameAr": "أخضر مائل للأزرق" },
  { "color": "#91CC75", "nameEn": "Green", "nameAr": "أخضر" },
  { "color": "#ADFF2F", "nameEn": "GreenYellow", "nameAr": "أصفر مائل للأخضر" },
  { "color": "#FFD700", "nameEn": "Gold", "nameAr": "ذهبي" },
  { "color": "#FAC858", "nameEn": "LightYellow", "nameAr": "أصفر فاتح" },
  { "color": "#FFA500", "nameEn": "Orange", "nameAr": "برتقالي" },
  { "color": "#FF8C00", "nameEn": "DarkOrange", "nameAr": "برتقالي غامق" },
  { "color": "#EA7CCC", "nameEn": "Pink", "nameAr": "وردي" },
  { "color": "#FF69B4", "nameEn": "HotPink", "nameAr": "وردي فاقع" },
  { "color": "#9370DB", "nameEn": "MediumPurple", "nameAr": "بنفسجي متوسط" },
  { "color": "#9A60B4", "nameEn": "Purple", "nameAr": "بنفسجي" },
  { "color": "#FF6347", "nameEn": "Tomato", "nameAr": "أحمر طماطمي" },
  { "color": "#FF4500", "nameEn": "OrangeRed", "nameAr": "أحمر مائل للبرتقالي" },
  { "color": "#FF0000", "nameEn": "Red", "nameAr": "أحمر" },
  { "color": "#DC143C", "nameEn": "DarkRed", "nameAr": "أحمر غامق" },
  { "color": "#D3D3D3", "nameEn": "LightGray", "nameAr": "رمادي فاتح" },
  { "color": "#A9A9A9", "nameEn": "DarkGray", "nameAr": "رمادي غامق" },
  { "color": "#808080", "nameEn": "Gray", "nameAr": "رمادي" },
  { "color": "#696969", "nameEn": "DimGray", "nameAr": "رمادي باهت" }
]


    orgainationalUnitLookUp() {
    return this._HttpClient.get(
      enviroment.API_URL + 'OrganizationalUnit/lookup'
    );
  }
  paginationSubject: BehaviorSubject<PaginationInterface> =
    new BehaviorSubject<PaginationInterface>({
      perPage: 10,
      currentPage: 1,
      totalItems: 0,
      totalPages: 0,
    });

  getFiltersByDataEntity(id: number): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `DataEntity/data-view/${id}/filters`
    );
  }
  getFiltersByDataEntityAndReportID(id: number , reportPartID:any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `DataEntity/data-view/${id}/filters/${reportPartID}`
    );
  }




  lookUps(ids: number[]): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + 'Lookup/multi', ids);
  }

  saveFilterProfile(req: any, id: any,reportPartID?: any): Observable<any> {
    if(reportPartID){
      req = {...req,reportPartID}
    }
    return this._HttpClient.post(
      enviroment.API_URL + `DataEntity/data-view/${id}/filter-profiles`,
      req
    );
  }

  updateFilterProfile(req: any, id: any, profId: any): Observable<any> {
    return this._HttpClient.put(
      enviroment.API_URL +
        `DataEntity/data-view/${id}/filter-profiles/${profId}`,
      req
    );
  }

updateDefultProfile(id: any, profId?: any, reportPartID?: any): Observable<any> {

  let params = new HttpParams();

  if (profId) {
    params = params.set('profileId', profId);
  }

  if (reportPartID) {
    params = params.set('reprotPartID', reportPartID);
  }

  return this._HttpClient.put(
    `${enviroment.API_URL}DataEntity/data-view/${id}/filter-profiles/default`,
    null,
    { params }
  );

}

  deleteDefultProfile(id: any, profId: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL +
        `DataEntity/data-view/${id}/filter-profiles/${profId}`
    );
  }

  getComments(DataEntityTypeID?: any, DataEntityID?: any): Observable<any> {
    let url = `${enviroment.API_URL}Comment?DataEntityTypeID=${DataEntityTypeID}`;

    if (DataEntityID !== undefined && DataEntityID !== null) {
      url += `&DataEntityID=${DataEntityID}`;
    }

    return this._HttpClient.get(url);
  }
  createComment(commentData: any,isExternal:boolean = false) {
        const url = isExternal ? 'Comment/external' :'Comment'

    return this._HttpClient.post(enviroment.API_URL + url, commentData);
  }
  deleteComment(commentId: number, relatedUserId?: number): Observable<any> {
    let url = `${enviroment.API_URL}Comment/${commentId}`;

    if (relatedUserId) {
      url += `?relatedUserId=${relatedUserId}`;
    }

    return this._HttpClient.delete(url);
  }

  updateComment(
    entityId?: number,
    commentId?: number,
    content?: string
  ): Observable<any> {

    return this._HttpClient.put(`${enviroment.API_URL}Comment/${entityId}`, {
      commentId: commentId,
      content: content,
    });
  }

  getUserLookupData(): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + 'Users/lookup');
  }
  getRoleLookupData(): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + 'Roles/lookup');
  }

  getAttachment(relatedEntityId?: any, relatedColumnId?: any,fileUsageTypeID?:any): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + 'File/GetFiles', {
      dataEntityTypeId: relatedEntityId,
      dataEnityId: relatedColumnId,
      fileUsageTypeID: fileUsageTypeID
    });
  }


    getNewAttachment(relatedEntityId?: any, relatedColumnId?: any , fileUsageTypeID?:number): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + 'File/GetFiles', {
      dataEntityTypeId: relatedEntityId,
      dataEnityId: relatedColumnId,
      fileUsageTypeID:fileUsageTypeID
    });
  }
  saveAttachment(formData: any): Observable<any> {
    return this._HttpClient.post(`${enviroment.API_URL}File`, formData);
  }

  updateAttachment(fileId: any, fileTitle: any ,fileUsage?:number): Observable<any> {
    return this._HttpClient.put(`${enviroment.API_URL}File/id`, {
      fileUsageId: fileId,
      fileTitle: fileTitle,
      fileUsageTypeID:fileUsage
    });
  }

  downloadAttachment(fileId: number): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + `File/download`,
      { fileId: fileId },
      { responseType: 'blob' as 'json' }
    );
  }

  getAttachmentById(id: any): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + 'File/' + id);
  }

  deleteAttachment(fileId: number): Observable<any> {
    return this._HttpClient.delete(`${enviroment.API_URL}File/id`, {
      body: { fileId: fileId },
    });
  }

  // getCommentsByEntityID():Observable<any>{
  //   return
  // }

  getSingleAttachment(usageId: number): Observable<any> {
    return this._HttpClient.get(`${enviroment.API_URL}File/${usageId}`);
  }

  getSearchFiles(req: any): Observable<any> {
    console.log('req test', req);
    // const reqClone = JSON.parse(JSON.stringify(req))
    if (!req?.fileTitle?.length) {
      delete req?.fileTitle;
    }
    return this._HttpClient.post(enviroment.API_URL + 'File/SearchFiles', req);
  }

  addExistFile(req: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'File/CreateUsageFile',
      req
    );
  }

  addNewProfileColumns(req: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + 'DataEntity/dataViewId/Column',
      req
    );
  }
  updateProfileColumns(req: any): Observable<any> {
    return this._HttpClient.put(
      enviroment.API_URL + 'DataEntity/profileId/Column',
      req
    );
  }

  deleteProfileColumns(profileId: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + `DataEntity/profileId/Column`,
      {
        body: {
          profileId,
        },
      }
    );
  }

  CreateEntity(Data?: any) {
    return this._HttpClient.post(
      enviroment.API_URL + 'BusinessTask',
      Data
    );
  }
  UpdateEntity(Data?: any) {
    return this._HttpClient.put(
      enviroment.API_URL + 'BusinessTask',
      Data
    );
  }
  getbyIdEntity(id?: any) {
    return this._HttpClient.get(
      enviroment.API_URL + 'BusinessTask/' + id
    );
  }
  deleteEntity(taskEntityID?: any) {
    return this._HttpClient.delete(enviroment.API_URL + 'BusinessTask', {
      body: { businessTaskId: taskEntityID },
    });
  }
  // dataEntityID:any='',
  // dataEntityTypeID:any=''
  //       dataEntityID:dataEntityID,
  //   dataEntityTypeID:dataEntityTypeID

  getEntitiesSearch(
    payload:any,
    dataEntityID?: any,
    dataEntityTypeID?: any,
    BusinessTaskTypeID?: any,
  ): Observable<any> {
    const req = {
      ...payload,
      dataEntityID:dataEntityID,
      dataEntityTypeID:dataEntityTypeID,
      BusinessTaskTypeID:BusinessTaskTypeID
      // executionStatusTypeID,
    };
    return this._HttpClient.post(
      enviroment.API_URL + 'BusinessTask/Search',
      req
    );
  }

    getTaskById(taskId: any) {
    return this._HttpClient.get(enviroment.API_URL + `BusinessTask/${taskId}`);
  }


  getDataEntityAttributes(dataEntityTypeID:any , dataEntityID?:any ):Observable<any>{
    let query = '?'

    if(dataEntityTypeID){
      query += `dataEntityTypeID=${dataEntityTypeID}`
    }

    if(dataEntityID){
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      query === '?' ?  query += `dataEntityID=${dataEntityID}` : query += `&dataEntityID=${dataEntityID}`
    }

    return this._HttpClient.get(enviroment.API_URL + `DataEntity/Attributes/Lookup`+query)
  }


  getDataEntityAttributesNew(id:any):Observable<any>{
    return this._HttpClient.get(enviroment.API_URL + `DataEntity/${id}/Attributes/Lookup`)
  }

  getVulnerability() {
    return this._HttpClient.get(enviroment.API_URL + 'Vulnerability');
  }
  getThreats() {
    return this._HttpClient.get(enviroment.API_URL + 'Threat');
  }
  getAttributes() {
    return this._HttpClient.get(enviroment.API_URL + 'Vulnerability');
  }

  setDefultColumnProfile(dataViewId: any, profileId: any): Observable<any> {
    return this._HttpClient.put(
      enviroment.API_URL +
        `DataEntity/data-view/${dataViewId}/column-profiles/${profileId}/default`,
      null
    );
  }

  getDataEntityColumns(id: number): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `DataEntity/data-view/${id}/columns`
    );
  }



 getNewEntitiesSearch(
  sort_data: any = null,
  searchTerm: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  filters: any,
  dataEntityID?: any,
  dataEntityTypeID?: any,
  BusinessTaskTypeID?: any,
): Observable<any> {
  const req: any = {
    sortField: sort_data?.field,
    sortDirection: sort_data?.direction,
    search: searchTerm,
    dataViewId: 1,
    pageNumber,
    pageSize: perPage,
    filters,
    BusinessTaskTypeID,
  };


  if (dataEntityID && dataEntityTypeID) {
    req.dataEntityID = dataEntityID;
    req.dataEntityTypeID = dataEntityTypeID;
  }

  return this._HttpClient.post(
    enviroment.API_URL + 'BusinessTask/Search',
    req
  );
}
truncateWords = (text: string, wordLimit: number) => {
  if(text === null || text === undefined){
    return '';
  }
  const words = text?.split(' ')?.map(word =>
    word.length > 10 ? word.slice(0, 10) : word
  );

  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(' ') + '...'
    : words.join(' ');
};



   getEntityByUrl(url: string): Observable<any> {
    return this._HttpClient.get<any>(url);
  }



  assetsCategoriesTree():Observable<any>{
    return this._HttpClient.get(enviroment.API_URL + `Asset/AssetCategory`)
  }

}
