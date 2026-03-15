import { SystemActionsComponent } from 'libs/shared/shared-ui/src/lib/system-actions/system-actions.component';
import { OverviewEntry, SharedOverviewComponent } from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';
/* eslint-disable @nx/enforce-module-boundaries */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { IncidentService } from '../../../services/incident.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'lib-view-incident',
  imports: [CommonModule,SkeletonModule,TranslateModule,SharedOverviewComponent,SystemActionsComponent],
  templateUrl: './viewIncident.component.html',
  styleUrl: './viewIncident.component.scss',
})
export class ViewIncidentComponent  {
  breadCrumbLinks: any;
  loadDataIncidentts: boolean = false;
  tabs: any[] = [];
  IncidenttsData: any;
  active_tab = 1;
  IncidenttId: any;
  entries: OverviewEntry[] = [
  { key: 'name', label: 'INCIDENT.NAME', type: 'text' },
  { key: 'incidentTypeName', label: 'INCIDENT.INCIDENT_TYPE', type: 'text' },
  { key: 'incidentStatusName', label: 'INCIDENT.STATUS', type: 'text' },
  { key: 'priorityName', label: 'INCIDENT.PRIORITY', type: 'text' },
  { key: 'severityName', label: 'INCIDENT.SEVERITY', type: 'text' },
  { key: 'sourceName', label: 'INCIDENT.SOURCE', type: 'text' },
  { key: 'location', label: 'INCIDENT.LOCATION', type: 'text' },
  { key: 'occurredAt', label: 'INCIDENT.OCCURRED_AT', type: 'date' },
  { key: 'reportedAt', label: 'INCIDENT.REPORTED_AT', type: 'date' },
  { key: 'isConfidential', label: 'INCIDENT.IS_CONFIDENTIAL', type: 'boolean' },
  { key: 'estimatedFinancialImpact', label: 'INCIDENT.ESTIMATED_FINANCIAL_IMPACT', type: 'number' },
  { key: 'referenceCode', label: 'INCIDENT.REFERENCE_CODE', type: 'text' },
  { key: 'description', label: 'INCIDENT.DESCRIPTION', type: 'description' }
];

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private IncidentService: IncidentService,
    private _LayoutService:LayoutService,
    private _TranslateService:TranslateService
  ) {

    this.breadCrumb = [
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name:  this._TranslateService.instant('INCIDENT.incident'),
        icon: '',
        routerLink: '/gfw-portal/incident/list',
      },
      {
        name:this._TranslateService.instant('INCIDENT.LIST_TITLE'),
        icon: '',
        routerLink:'/gfw-portal/incident/list'
      },
       {
        name:'-',
        icon: '',
      },
    ]

    this._LayoutService.breadCrumbLinks.next(this.breadCrumb)
    this._ActivatedRoute?.parent?.paramMap.subscribe((res) => {
      this.IncidenttId = res.get('id');
    });
    this.getByIdIncidenttes();
  }

  breadCrumb:any[]=[]
  getByIdIncidenttes() {
    this.loadDataIncidentts = true;
    this.IncidentService.getIncidentById(this.IncidenttId).subscribe((res: any) => {
      this.IncidenttsData = res?.data;
      this.breadCrumb[this.breadCrumb.length - 1].name = res?.data?.name
      this.loadDataIncidentts = false;
    });
  }

      hasActions:boolean = true;
  onFoundAction(event:boolean){
    this.hasActions = event;
    console.log('hasActions', this.hasActions);
  }
}
