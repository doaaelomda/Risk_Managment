/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { enviroment } from "apps/gfw-portal/env/dev.env";
@Injectable({
  providedIn:'root'
})


export class NotificationService{

  constructor(private _HttpClient:HttpClient){

  }


  getEventGroups():Observable<any>{
    return this._HttpClient.get(enviroment.API_URL + `Notifications/NotificationEventGroup`)
  }



  getNotificationListSearch(groupId:any):Observable<any>{
    const req = {
      pageNumber:1,
      pageSize:50,
      notificationEventGroupID:groupId
    }

    return this._HttpClient.post(enviroment.API_URL + `Notifications/NotificationEvent/Search` , req)
  }

  getSingleEvent(id:any):Observable<any>{
    return this._HttpClient.get(enviroment.API_URL + `Notifications/NotificatoinTemplate/${id}`)
  }

    getEventById(id:any):Observable<any>{
    return this._HttpClient.get(enviroment.API_URL + `Notifications/NotificationEvent/${id}`)
  }

  getTemplateRecivers(id:any):Observable<any>{
    return this._HttpClient.get(enviroment.API_URL+`DataEntity/Attribute/Responsibilities?dataEntityTypeID=${id}`)
  }

  getTemplatesList(id:any):Observable<any>{
    return this._HttpClient.get(enviroment.API_URL+`Notifications/NotificationEvent/${id}`)
  }



  deleteMessageTemplate(id:any):Observable<any>{
    return this._HttpClient.delete(enviroment.API_URL + `Notifications/NotificatoinTemplate/${id}`)
  }



  addNotificationTemplateBasicsInfo(data:any):Observable<any>{
    return this._HttpClient.post(enviroment.API_URL + `Notifications/NotificatoinTemplate` , data)
  }
  updateNotificationTemplateBasicsInfo(data:any):Observable<any>{
    return this._HttpClient.put(enviroment.API_URL + `Notifications/NotificatoinTemplate/BasicInfo` , data)
  }


  getSingleTemplate(id:any):Observable<any>{
    return this._HttpClient.get(enviroment.API_URL + `Notifications/NotificatoinTemplate/${id}`)
  }

  saveInternalNotification(req:any):Observable<any>{
    return this._HttpClient.put(enviroment.API_URL + `Notifications/NotificatoinTemplate/Internal` , req)
  }
  saveExternalNotification(req:any):Observable<any>{
    return this._HttpClient.put(enviroment.API_URL + `Notifications/NotificatoinTemplate/External` , req)
  }


  toggleEventActivate(data:any):Observable<any>
  {
    return this._HttpClient.put(enviroment.API_URL + `Notifications/NotificationEvent/is-active` , data)
  }




}
