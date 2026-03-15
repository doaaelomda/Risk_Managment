/* eslint-disable @nx/enforce-module-boundaries */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { RiskService } from '../../services/risk.service';
import { tap, switchMap } from 'rxjs';
import { SharedTabsComponent } from "libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-ass-view-cintainer',
  imports: [CommonModule, RouterOutlet, SkeletonModule, TranslateModule, SharedTabsComponent],
  templateUrl: './ass-view-cintainer.component.html',
  styleUrl: './ass-view-cintainer.component.scss',
})
export class AssViewCintainerComponent {

  constructor(
    private _RiskService: RiskService,
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _PermissionSystemService:PermissionSystemService
  ) {
      this._LayoutService.breadCrumbTitle.next(
    this._TranslateService.instant('BREAD_CRUMB_TITLES.RISK_MANGEMENT')
  );

        this._ActivatedRoute.paramMap
          .pipe(
            tap((res) => (this.current_riskID = res.get('riskID'))),
            switchMap((res) => this._RiskService.getOneRisk(Number(res.get('riskID'))))
          )
          .subscribe({
            next: (res: any) => {
              this.current_risk_data = res?.data;

            },
          });
this._ActivatedRoute.paramMap.pipe(
  switchMap(param => {
    const riskId = Number(param.get('assID'));
    this.riskID = riskId
    const assessmentId = Number(param.get('assID')); // ✅ يجب أن يعمل الآنv
    return this._RiskService.getOneRiskAssessment(riskId, assessmentId);
  })
).subscribe((res: any) => {
  this.nameSubRisk = res?.data.title;
  this.assesmentCode = res?.data?.assessmentCode
  console.log(res?.data ,'got assessment data');


        this.breadCrumbLinks = [
        {
          name: '',
          icon: 'fi fi-rs-home',
          routerLink: '/gfw-portal/dashboard',
        },
        {
          name: this._TranslateService.instant('BREAD_CRUMB_TITLES.RISK_MANGEMENT'),
          routerLink: '/gfw-portal/risks-management/risks-list',
        },
        {
          name: 'Risk List',
          icon: '',
          routerLink: '/gfw-portal/risks-management/risks-list',
        },
                {
          name: `${res.data?.riskTitle || '--'}`,
          icon: '',
        },
        {
          name: this._TranslateService.instant('RISK_VIEW.RISK_ASSESSMENT'),
          routerLink: `/gfw-portal/risks-management/risk/${this.current_riskID}/assessments-list`,
        },
        {
          name: `${res.data?.title || '--'}`,
          icon: '',
        },
      ];

      this._LayoutService.breadCrumbLinks.next(this.breadCrumbLinks);
});


    this.tabs = [

      {
        id: 2,
        name: 'Control Evaluation',
        icon: 'fi fi-rr-triangle-warning',
        router: 'control-evaluations',
        visible: () => this._PermissionSystemService.can('RISKS','RISKASSESSMENTCONTROLEVALUATION','VIEW')
      },


    ];
  }
assesmentCode:any
riskID:any
  breadCrumbLinks:any
nameSubRisk:any
  current_riskID:any;
  loading_data: boolean = false;

  current_risk_data: any;
  tabs: any[] = []
}
