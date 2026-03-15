import { SharedTabsComponent } from './../../../../../shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
/* eslint-disable @nx/enforce-module-boundaries */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  RouterOutlet,
} from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { IncidentService } from '../../services/incident.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-overview-incident',
  imports: [
    CommonModule,
    RouterOutlet,
    SkeletonModule,
    TranslateModule,
    SharedTabsComponent,
  ],
  templateUrl: './overviewIncident.component.html',
  styleUrl: './overviewIncident.component.scss',
})
export class OverviewIncidentComponent {
  breadCrumbLinks: any;
  loadDataincidentts: boolean = false;
  tabs: any[] = [];
  incidentData: any;
  active_tab = 1;
  incidenttId: any;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _incidentService: IncidentService,
    private _PermissionSystemService:PermissionSystemService
  ) {
    this.breadCrumb = [
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('INCIDENT.incident'),
        icon: '',
        routerLink: '/gfw-portal/incident/list',
      },
      {
        name: this._TranslateService.instant('INCIDENT.LIST_TITLE'),
        icon: '',
        routerLink: '/gfw-portal/incident/list',
      },
      {
        name: '-',
        icon: '',
      },
    ];
    this._LayoutService.breadCrumbLinks.next(this.breadCrumb);

    this.tabs = [
      {
        id: 2,
        name: 'Actions',
        icon: 'fi fi-rr-triangle-warning',
        router: 'action',
        visible: ()=> this._PermissionSystemService.can('INCIDENT', 'INCIDENT_ACTION', 'VIEW')
      },
      {
        id: 3,
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.INVESTIGATIONS'
        ),
        icon: 'fi fi-rr-search',
        router: 'investigations',
        visible: ()=> this._PermissionSystemService.can('INCIDENT', 'INCIDENT_INVESTIGATIONS', 'VIEW')
      },
      {
        id: 5,
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.CLOSURE'
        ),
        icon: 'fi fi-rr-handshake',
        router: 'closure',
        visible: ()=> this._PermissionSystemService.can('INCIDENT', 'INCIDENT_CLOSURE', 'VIEW')
      },
      {
        id: 4,
        name: this._TranslateService.instant('LessonLearn.LessonLearn'),
        icon: 'fi fi-rr-clip',
        router: 'lesson-Learning',
        visible: ()=> this._PermissionSystemService.can('INCIDENT', 'INCIDENT_LESSON', 'VIEW')
      },
    ];
    this._ActivatedRoute.paramMap.subscribe((res) => {
      this.incidenttId = res.get('id');
    });
    this.getByIdincidenttes();
  }
  breadCrumb: any[] = [];

  getByIdincidenttes() {
    this.loadDataincidentts = true;
    this._incidentService
      .getIncidentById(this.incidenttId)
      .subscribe((res: any) => {
        this.incidentData = res?.data;
        this.breadCrumb[this.breadCrumb.length - 1].name = res?.data?.name;

        this.loadDataincidentts = false;
      });
  }
}
