import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstanceSectionsService {

  private readonly searchEndpoint = 'Questionnaire/instance';
  private readonly deleteEndpoint = 'Questionnaire/instance/section';
  private readonly saveEndpoint = 'Questionnaire/instance/section';
  private readonly getByIdEndpoint = 'Questionnaire/instance/section';
  private readonly idKey = 'questionnaireInstanceSectionID';


  constructor(private _http: HttpClient) {}


  findAll(
        instanceId:string,
    sortData: any = null,
    pageNumber: number = 1,
    perPage: number = 10,
    filters: any[] = [],
    extraFields: any = {},

  ): Observable<any> {
    const req = {
      search: '',
      pageNumber,
      pageSize: perPage,
      filters,
      sortField: sortData?.field,
      sortDirection: sortData?.direction,
      ...extraFields,
    };
    return this._http.get(`${enviroment.API_URL}${this.searchEndpoint}/${instanceId}/full-detail`);
  }

  save(
    data: any,
    questionnaireTemplateSectionID:any,
    questionnaireInstanceID:any,
    id?: any,

  ): Observable<any> {
    const method = id ? 'put' : 'post';
    data = {...data , questionnaireInstanceID}
    const payload = id ? { ...data, [this.idKey]: id } : data;
    return this._http[method](`${enviroment.API_URL}${this.saveEndpoint}`, payload);
  }

  delete(
    id: any
  ): Observable<any> {
    return this._http.delete(`${enviroment.API_URL}${this.deleteEndpoint}/${id}`);
  }

  getById(
    id: any
  ): Observable<any> {
    return this._http.get(`${enviroment.API_URL}${this.getByIdEndpoint}/${id}`);
  }

}
