/* eslint-disable @nx/enforce-module-boundaries */
import { PaginationInterface } from './../models/pagination';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { sideBarLinks } from '../models/sidebarLinks';
import { Breadcrumb } from '../models/breadcrumb.model';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(private _HttpClient:HttpClient) { }



  addToSide:BehaviorSubject<any> = new BehaviorSubject<any>(null)


getMenueSideBar(): Observable<sideBarLinks[]> {
  return this._HttpClient.get<{ data: sideBarLinks[] }>(enviroment.API_URL + 'Menu').pipe(
    map(res => res.data)
  );
}


  showGlobalLoader:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  sidebarState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  overlayStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  breadCrumbTitle: BehaviorSubject<string> = new BehaviorSubject<string>('');
  breadCrumbLinks:BehaviorSubject<Breadcrumb[]> = new BehaviorSubject<Breadcrumb[]>([])
  breadCrumbAction:BehaviorSubject<any> = new BehaviorSubject<any>(null)
}
