import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvestigationService {
  private readonly searchEndpoint = 'Incident/Incident/Investigation/Search';
  private readonly deleteEndpoint = 'Incident/Incident/Investigation';
  private readonly saveEndpoint = 'Incident/Incident/Investigation';
  private readonly updateEndpoint = 'Incident/Incident/Investigation';
  private readonly getByIdEndpoint = 'Incident/Incident/Investigation';
  private readonly idKey = 'incidentInvestigationID';

  constructor(private _http: HttpClient) {}
  viewedData = new BehaviorSubject(null)
  findAll(
    req?:any
  ): Observable<any> {
    return this._http.post(`${enviroment.API_URL}${this.searchEndpoint}`, req);
  }

  save(data: any, id?: any): Observable<any> {
    const method = id ? 'put' : 'post';
    const endpoint = id ? this.updateEndpoint : this.saveEndpoint;
    if (id) {
      data = { ...data, [this.idKey]: id };
    }
    return this._http[method](`${enviroment.API_URL}${endpoint}`, data);
  }

  delete(id: any): Observable<any> {
    return this._http.delete(`${enviroment.API_URL}${this.deleteEndpoint}`, {
      body: { incidentInvestigationID: id },
    });
  }
  getById(id: any): Observable<any> {
    return this._http.get(
      `${enviroment.API_URL}${this.getByIdEndpoint}?IncidentInvestigationID=${id}`
    );
  }

  saveTechnicalInfo(data: any): Observable<any> {
    return this._http.put(
      `${enviroment.API_URL}Incident/Incident/Investigation/TechnicalInfo`,
      data
    );
  }
}
