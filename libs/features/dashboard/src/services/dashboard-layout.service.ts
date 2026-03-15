import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
@Injectable({
  providedIn: 'root',
})
export class DashboardLayoutService {
  constructor(private _HttpClient: HttpClient) {}

  filter_visible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  getDashboardList(
   payload:any
  ): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + 'Dashboard/Search', payload);
  }

  addDashboardInfo(data: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + `Dashboard/CreateReportDefinition`,
      data
    );
  }

  updateDashboardInfo(data: any, id: any): Observable<any> {
    data.reportDefinitionID = id;
    return this._HttpClient.put(
      enviroment.API_URL + `Dashboard/UpdateReportDefinitions`,
      data
    );
  }

  getDashboardInfoById(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `Dashboard/ReportDefinitions/${id}`
    );
  }

  deleteDashboard(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + `Dashboard/ReportDefinitions/${id}`
    );
  }

  getDashboardCategoruWidgetsLookUp(): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `Dashboard/GetCategoriesWithWidgets`
    );
  }

  getDashboardLayoutConfig(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `Dashboard/${id}/dashboard`
    );
  }

  addDashboardWidgets(id: any, wIds: any[]): Observable<any> {
    const payload = {
      reportDefinitionID: id,
      widgetIDs: wIds,
    };
    return this._HttpClient.post(
      enviroment.API_URL + `Dashboard/add-widgets`,
      payload
    );
  }

  updateDashboardWidgets(data: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + `Dashboard/update-widgets`,
      data
    );
  }

  deleteWidget(wid: any, reportId: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + 'Dashboard/delete-widget',
      {
        body: {
          reportDefinitionID: reportId,
          reportPartID: wid,
        },
      }
    );
  }

  saveReportWidgetFilter(
    dataViewId: any,
    reportID: any,
    profileName: any,
    filters: any[]
  ): Observable<any> {
    const req = {
      dataViewID: dataViewId,
      reportPartID: reportID,
      profileName: profileName,
      filters: filters,
    };
    return this._HttpClient.post(
      enviroment.API_URL + `DataEntity/data-view/${dataViewId}/filter-profiles`,
      req
    );
  }

  updateWidgetSetting(req: any): Observable<any> {
    return this._HttpClient.put(
      enviroment.API_URL + `Dashboard/update-settings`,
      req
    );
  }

  updateDefultProfile(
    dataViewId: any,
    profileId: any,
    reprotPartID: any
  ): Observable<any> {
    return this._HttpClient.put(
      enviroment.API_URL +
        `DataEntity/data-view/${dataViewId}/filter-profiles/${profileId}/default/${reprotPartID}`,
      {}
    );
  }

  updateWidgetFilterProfile(
    dataViewId: any,
    profileId: any,
    req: any
  ): Observable<any> {
    return this._HttpClient.put(
      enviroment.API_URL +
        `DataEntity/data-view/${dataViewId}/filter-profiles/${profileId}`,
      req
    );
  }

  deleteWidgetFilterProfile(dataViewId: any, profileId: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL +
        `DataEntity/data-view/${dataViewId}/filter-profiles/${profileId}`
    );
  }

  // General Assessments Api

  getGeneralAssessmentsList(
    payload:any,
    dataEntityTypeID?: any,
    dataEntityID?: any,
    generalAssessmentTypeID?: any
  ): Observable<any> {
    const req = {
      ...payload,
      dataEntityTypeID: dataEntityTypeID,
      dataEntityID: dataEntityID,
      generalAssessmentTypeID: generalAssessmentTypeID,
    };
    return this._HttpClient.post(
      enviroment.API_URL + 'GeneralAssessment/GeneralAssessment/Search',
      req
    );
  }

  addGeneralAssessments(data: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + `GeneralAssessment/GeneralAssessment`,
      data
    );
  }

  updateGeneralAssessments(data: any, id: any): Observable<any> {
    data.reportDefinitionID = id;
    return this._HttpClient.put(
      enviroment.API_URL + `GeneralAssessment/GeneralAssessment`,
      data
    );
  }

  getGeneralAssessmentsById(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `GeneralAssessment/GeneralAssessment${id}`
    );
  }

  deleteGeneralAssessments(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + `GeneralAssessment/GeneralAssessment/${id}`
    );
  }

  // General Activity Api

  getActivitiesList(
payload:any,
    generalAssessmentTypeID?: any,
    dataEntityID?: any,
    dataEntityTypeID?: any
  ): Observable<any> {
    const req = {
   ...payload,
      generalAssessmentTypeID: generalAssessmentTypeID,
      dataEntityID: dataEntityID,
      dataEntityTypeID: dataEntityTypeID,
    };
    return this._HttpClient.post(enviroment.API_URL + 'Activity/search', req);
  }

  addActivity(data: any): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + `Activity`, data);
  }

  updateActivity(data: any, id: any): Observable<any> {
    data.activityID = id;
    return this._HttpClient.put(enviroment.API_URL + `Activity/Id`, data);
  }

  getActivityById(id: any): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + `Activity/${id}`);
  }

  deleteActivity(id: any): Observable<any> {
    return this._HttpClient.delete(enviroment.API_URL + `Activity/Id?id=${id}`);
  }

  getExceptionsList(
    payload:any,
    grcExceptionTypeID?: any,
    dataEntityID?: any,
    dataEntityTypeID?: any
  ): Observable<any> {
    const req = {
      ...payload,
      grcExceptionTypeID: grcExceptionTypeID,
      dataEntityID: dataEntityID,
      dataEntityTypeID: dataEntityTypeID,
    };
    return this._HttpClient.post(enviroment.API_URL + 'GRCException/GRCException/Search', req);
  }

  addExceptions(data: any): Observable<any> {
    return this._HttpClient.post(enviroment.API_URL + `GRCException/GRCException`, data);
  }

  updateExceptions(data: any, id: any): Observable<any> {
    data.grcExceptionID = id;
    return this._HttpClient.put(enviroment.API_URL + `GRCException/GRCException`, data);
  }

  getExceptionsById(id: any): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + `GRCException/GRCException/${id}`);
  }

  deleteException(id: any): Observable<any> {
    return this._HttpClient.delete(enviroment.API_URL + `GRCException/Escalatio_Defination/${id}`);
  }





  getClassficationDataByAssessmentId(id:any):Observable<any>{
    return this._HttpClient.get(enviroment.API_URL + `ComplianceAssessment/GRCDocumentElementClassification/${id}`)
  }
}
