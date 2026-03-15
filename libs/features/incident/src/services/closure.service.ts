import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClosureService {

   private readonly searchEndpoint = 'Incident/Incident/Closure/Search';
  private readonly deleteEndpoint = 'Incident/Incident/Closure';
  private readonly saveEndpoint = 'Incident/Incident/Closure';
private readonly updateEndpoint = 'Incident/Incident/Closure';
  private readonly getByIdEndpoint = 'Incident/Incident/Closure';
  private readonly idKey = 'incidentClosureID';

  viewedData = new BehaviorSubject(null)
  constructor(private _http: HttpClient) {}


  findAll(
    req?:any
  ): Observable<any> {

    return this._http.post(`${enviroment.API_URL}${this.searchEndpoint}`, req);
  }

  save(
    data: any,
    id?: any
  ): Observable<any> {
    const method = id ? 'put' : 'post';
    const endpoint = id ? this.updateEndpoint : this.saveEndpoint
    if(id){
      data = {...data, [this.idKey]:id}
    }
    return this._http[method](`${enviroment.API_URL}${endpoint}`, data);

  }

  delete(
    id: any
  ): Observable<any> {
    return this._http.delete(`${enviroment.API_URL}${this.deleteEndpoint}`,{
      body:{incidentClosureID:id}
    });
  }

  getById(
    id: any
  ): Observable<any> {
    return this._http.get(`${enviroment.API_URL}${this.getByIdEndpoint}?IncidentClosureID=${id}`);
  }

}
