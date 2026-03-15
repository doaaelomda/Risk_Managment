import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RiskService } from '../../services/risk.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { switchMap, tap } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
import { RiskOverviewComponent } from './risk-overview/risk-overview.component';
import { RiskAssessmentsComponent } from '../risk-assessments/risk-assessments.component';
import { RiskAssessmentViewComponent } from '../risk-assessment-view/risk-assessment-view.component';
import { RouterOutlet  } from '@angular/router';
import { SharedTabsComponent } from "libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-risk-view',
  imports: [CommonModule, RouterOutlet, SkeletonModule, TranslateModule, SharedTabsComponent],
  templateUrl: './risk-view.component.html',
  styleUrl: './risk-view.component.scss',
})
export class RiskViewComponent {
  current_risk_data: any;
  current_riskID: any;
  breadCrumbLinks: any;
  loading_data: boolean = true;
  current_tab_id = 1;
  tabs: any[] = [];



  constructor(
    private _RiskService: RiskService,
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _PermissionSystemService:PermissionSystemService
  ) {




    this.breadCrumbLinks = [
     {
    name: '',
    icon: 'fi fi-rs-home',
    routerLink: '/'
  },
  {
    name: this._TranslateService.instant('BREAD_CRUMB_TITLES.RISK_MANGEMENT'),
    icon: '',
    routerLink: '/gfw-portal/risks-management/risks-list'
  },
  {
    name: this._TranslateService.instant('BREAD_CRUMB_TITLES.RISK_LIST'),
    icon: '',
    routerLink: '/gfw-portal/risks-management/risks-list'
  },
      {
        name: `View ${this.current_riskID}`,
        icon: '',

      }
    ];
    this._LayoutService.breadCrumbLinks.next(this.breadCrumbLinks);

    this.tabs = [
      {
        id:900,
        name:"TABS.IMPACTED_ASSESTS",
        icon:"fi fi-rr-link-alt",
        router:'impacted-assets',
        visible:()=> true
      },
  {
    id: 2,
    name: 'TABS.RISK_ASSESSMENT',
    icon: 'fi fi-rr-shield-check',
    router: 'assessments-list',
    visible: ()=> this._PermissionSystemService.can('RISKS', 'ASSESSMENT', 'VIEW')
  },
  {
    id: 3,
    name: 'TABS.MITIGATION_PLAN',
    icon: 'fi fi-rr-tools',
    router: 'mitigation-plans',
    visible: ()=> this._PermissionSystemService.can('RISKS', 'TREATMENT', 'VIEW')
  },
  {
    id:6,
    name:"TABS.LINKED_MODULES",
    router:'linkedModules',
    icon:"fi fi-rr-link-alt",
    visible: () => this._PermissionSystemService.can('RISKS', 'RISK_LINKEDMODULE', 'VIEW')
  },
   {
    id:7,
     name: 'RooteCause.RooteCause', router: 'routeCause', icon: 'fi-rr-circle' ,
      visible: ()=> this._PermissionSystemService.can('RISKS', 'RISK_ROORCAUSE', 'VIEW')
  },
  {
    id:8,
    name:"Questionnaire",
    icon:'fi fi-rr-comment-question',
    router:'questionnaire/list',
    visible: ()=> this._PermissionSystemService.can('RISKS', 'RISK_QUESTIONNAIRE', 'VIEW')
  }
];


    this._ActivatedRoute.paramMap
      .pipe(
        tap((res) => (this.current_riskID = res.get('riskID'))),
        switchMap((res) => this._RiskService.getOneRisk(Number(res.get('riskID'))))
      )
      .subscribe({
        next: (res: any) => {
          this.current_risk_data = res?.data;
            this._RiskService.riskData$.next(this.current_risk_data);
          this.breadCrumbLinks[this.breadCrumbLinks.length - 1].name =
            this.current_risk_data?.riskTitle;
             this.breadCrumbLinks[this.breadCrumbLinks.length - 1].routerLink =
           `/gfw-portal/risks-management/risk/${this.current_riskID}/overview`
          this.loading_data = false;
        },
      });
  }





}
