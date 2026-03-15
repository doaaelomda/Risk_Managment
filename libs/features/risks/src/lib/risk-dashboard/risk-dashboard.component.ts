import { DocsPreviewComponent } from './../../../../../shared/shared-ui/src/lib/docs-preview/docs-preview.component';
import { PdfPreviewComponent } from './../../../../../shared/shared-ui/src/lib/pdf-preview/pdf-preview.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
@Component({
  selector: 'lib-risk-dashboard',
  imports: [CommonModule, PdfPreviewComponent, DocsPreviewComponent],
  templateUrl: './risk-dashboard.component.html',
  styleUrl: './risk-dashboard.component.scss',
})
export class RiskDashboardComponent {
  constructor(private _TranslateService:TranslateService,private _LayoutService:LayoutService){
    this._LayoutService.breadCrumbLinks.next([
  {
    name: '',
    icon: 'fi fi-rs-home',
    routerLink: '/'
  },
  {
    name: this._TranslateService.instant('BREAD_CRUMB_TITLES.RISK_MANGEMENT'),
    icon: '',
    routerLink: '/gfw-portal/risks-management/dashboard'
  },
  {
    name: 'Risk Dashboard',
    icon: '',
    routerLink: ''
  }
]);
  }




  risk_dashboard:any={
    dashboard_Title:"Risk Dashboard",
    dashboard_Widgets:[
      {
        id:1,
        type:"tabs_cards",
        width:1.5,
        data_resource:""
      },
      {
        id:2,
        type:"bar",
        width:.75,
        data_resource:""
      },
      {
                id:3,
        type:"dounghnut",
        width:.75,
        data_resource:""
      },
      // {
      //   id:4,
      //   type:"line",
      //   width:'7',
      //   data_resource:""
      // },
      {
        id:5,
        type:'list',
        width:.75,
        data_resource:""
      }
      ,
      {
        id:6,
        type:'text',
        width:.75,
      }
      ,
      {
        id:7,
        type:'text',
        width:.75,
      }
      ,
      {
        id:6,
        type:'text',
        width:.75,
      }
      ,
      {
        id:7,
        type:'list',
        width:1.5,
      }
    ]
  }


}
