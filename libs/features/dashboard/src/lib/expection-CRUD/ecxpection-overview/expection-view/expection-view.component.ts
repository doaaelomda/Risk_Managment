import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DashboardLayoutService } from 'libs/features/dashboard/src/services/dashboard-layout.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { OverviewEntry, SharedOverviewComponent } from "libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component";

@Component({
  selector: 'lib-expection-view',
  imports: [CommonModule, SkeletonModule, TranslateModule, SharedOverviewComponent],
  templateUrl: './expection-view.component.html',
  styleUrl: './expection-view.component.scss',
})
export class ExpectionViewComponent {
  riskChildId:any
  generalId:any
  dataOfExpection:any
  loading:boolean=false
  entries: OverviewEntry[] = [
     { key: 'name', label: 'EXCEPTIONS.NAME', type: 'text' },
  { key: 'grcExceptionTypeName', label: 'EXCEPTIONS.TYPE', type: 'text' },
  { key: 'grcExceptionSeverityTypeName', label: 'EXCEPTIONS.SEVERITY', type: 'text' },
  { key: 'grcExceptionStatusTypeName', label: 'EXCEPTIONS.STATUS', type: 'text' },
  { key: 'exceptionStatusTypeName', label: 'EXCEPTIONS.exceptionStatusType', type: 'text' },
  { key: 'reviewFrequencyTypeName', label: 'EXCEPTIONS.reviewFrequencyType', type: 'text' },
  { key: 'justification', label: 'EXCEPTIONS.JUSTIFICATION', type: 'text' },
  { key: 'validFrom', label: 'EXCEPTIONS.VALID_FROM', type: 'date' },
  { key: 'validTo', label: 'EXCEPTIONS.VALID_TO', type: 'date' },
  { key: 'approvalDate', label: 'ASSESSMENT_RISK.approvalDate', type: 'date' },
  { key: 'requestedByUserName', label: 'EXCEPTIONS.REQUESTED_BY', type: 'user' },
  { key: 'approvedByUserName', label: 'EXCEPTIONS.APPROVED_BY', type: 'user' },

  { key: 'description', label: 'EXCEPTIONS.DESCRIPTION', type: 'description' },

];

   constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _dashBoard: DashboardLayoutService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService
  ) {
    this._ActivatedRoute?.parent?.paramMap.subscribe((res) => {
      this.riskChildId = res.get('ExceptionId');
      this.generalId = res.get('generalId');
      this.loading=true
      if (this.riskChildId) {
        this._dashBoard
          .getExceptionsById(this.riskChildId)
          .subscribe((res: any) => {
            this.dataOfExpection=res?.data
            this.loading=false
            this._LayoutService.breadCrumbLinks.next([
              {
                name: '',
                icon: 'fi fi-rs-home',
                routerLink: '/',
              },
              {
                name: this._TranslateService.instant('EXCEPTIONS.LIST_TITLE'),
                icon: '',
                routerLink: `/gfw-portal/third-party/view/${this.generalId}/Exceptions`,
              },

              {
                name: res?.data?.name || '-',
                icon: '',
              },
            ]);
          });
      }
    });
  }
}
