import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { e } from '@angular/cdk/scrolling-module.d-ud2XrbF8';
@Injectable({
  providedIn: 'root',
})
export class IndicatorService {
  getIndicatorThresholdByID(current_row_selected: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `Indicator/ThresholdBand/${current_row_selected}`
    );
  }
  getIndicatorThresholdList(
    payload:any,
    indicatorID: any
  ): Observable<any> {
    const req = {
      ...payload,
      indicatorID,
    };
    return this._HttpClient.post(
      enviroment.API_URL + `Indicator/ThresholdBand/Search`,
      req
    );
  }
  deleteIndicatorThreshold(current_row_selected: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + `Indicator/ThresholdBand/${current_row_selected}`
    );
  }
  updateIndicatorThreshold(req: any): Observable<any> {
    return this._HttpClient.put(
      enviroment.API_URL + `Indicator/ThresholdBand`,
      req
    );
  }
  addIndicatorThreshold(req: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + `Indicator/ThresholdBand`,
      req
    );
  }
  constructor(private _HttpClient: HttpClient) {}

  private _indicatorViwed$: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  indicarotViwed: Observable<any> = this._indicatorViwed$.asObservable();

  setViewIndicator(data: any) {
    this._indicatorViwed$.next(data);
  }

  getIndicatorsList(
    sort_data: any = null,
    pageNumber: number = 1,
    perPage: number = 10,
    filters: any[] = [],
    indicatorTypeID: any
  ): Observable<any> {
    const req = {
      search: '',
      dataViewId: 1,
      pageNumber: pageNumber,
      pageSize: perPage,
      filters: filters,
      sortField: sort_data?.field,
      sortDirection: sort_data?.direction,
      indicatorTypeID: indicatorTypeID,
    };
    return this._HttpClient.post(enviroment.API_URL + 'Indicator/Search', req);
  }

  getIndicatorsListNew(payload: any, indicatorTypeID: any): Observable<any> {
    const req = {
      ...payload,
      indicatorTypeID: indicatorTypeID,
    };
    return this._HttpClient.post(enviroment.API_URL + 'Indicator/Search', req);
  }

  getIndicatorsInputsList(
   payload:any,
    indicatorID: any
  ): Observable<any> {
    const req = {
      ...payload,
      indicatorID:indicatorID
    };
    return this._HttpClient.post(
      enviroment.API_URL + 'Indicator/InputType/Search',
      req
    );
  }
  getIndicatorFormulaList(
    payload:any,
    indicatorID: any
  ): Observable<any> {
    const req = {
      ...payload,
      indicatorID,
    };
    return this._HttpClient.post(
      enviroment.API_URL + 'Indicator/Formula/Search',
      req
    );
  }

  getIndicatorById(id: any): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + `Indicator/${id}`);
  }
  getIndicatorFormulaByID(id: any): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + `Indicator/Formula/${id}`);
  }

  addIndicatorInput(data: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + `Indicator/InputType`,
      data
    );
  }
  addIndicatorFormula(data: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + `Indicator/Formula`,
      data
    );
  }

  updateIndicatorInput(data: any): Observable<any> {
    return this._HttpClient.put(
      enviroment.API_URL + `Indicator/InputType`,
      data
    );
  }
  updateIndicatorFormula(data: any): Observable<any> {
    return this._HttpClient.put(enviroment.API_URL + `Indicator/Formula`, data);
  }

  getIndicatorInputByID(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `Indicator/InputType/${id}`
    );
  }
  getIndicatorForumlaByID(id: any): Observable<any> {
    return this._HttpClient.get(enviroment.API_URL + `Indicator/Formula/${id}`);
  }

  deleteIndicatorInput(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + `Indicator/InputType/${id}`
    );
  }
  deleteIndicatorFormula(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + `Indicator/Formula/${id}`
    );
  }

  deleteIndicator(indicatorId: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + `Indicator/${indicatorId}`
    );
  }

  saveIndicator(data: any, id?: any) {
    const method = id ? 'put' : 'post';
    const url = 'Indicator';
    data = { ...data, organizationalUnitID: data?.organizationalUnitID?.id };
    if (id) {
      data = { ...data, indicatorID: id };
    }
    return this._HttpClient[method](enviroment.API_URL + url, data);
  }

  getmeasurmentList(
    sort_data: any = null,
    pageNumber: number = 1,
    perPage: number = 10,
    filters: any[] = [],
    indicatorID: any
  ): Observable<any> {
    const req = {
      search: '',
      dataViewId: 1,
      pageNumber: pageNumber,
      pageSize: perPage,
      filters: filters,
      sortField: sort_data?.field,
      sortDirection: sort_data?.direction,
      indicatorID,
    };
    return this._HttpClient.post(
      enviroment.API_URL + 'Indicator/Measurement/Search',
      req
    );
  }

  getmeasurmentListNew(payload: any, indicatorID: any): Observable<any> {
    const req = {
      ...payload,
      indicatorID,
    };
    return this._HttpClient.post(
      enviroment.API_URL + 'Indicator/Measurement/Search',
      req
    );
  }

  deleteMeasurment(id: any): Observable<any> {
    return this._HttpClient.delete(
      enviroment.API_URL + `Indicator/Measurement/${id}`
    );
  }
  getmeasurmentById(id: any): Observable<any> {
    return this._HttpClient.get(
      enviroment.API_URL + `Indicator/Measurement/${id}`
    );
  }
  createMeasurmnet(data: any): Observable<any> {
    return this._HttpClient.post(
      enviroment.API_URL + `Indicator/Measurement`,
      data
    );
  }

  updateMeasurmnet(req: any): Observable<any> {
    return this._HttpClient.put(
      enviroment.API_URL + `Indicator/Measurement`,
      req
    );
  }

  evaluate(data: any, id: any): Observable<any> {
    const payload = { values: data, indicatorFormulaID: id };
    return this._HttpClient.post(
      enviroment.API_URL + 'Indicator/Measurement/Evaluate ',
      payload
    );
  }
}
