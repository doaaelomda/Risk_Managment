import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DashboardLayoutService } from 'libs/features/dashboard/src/services/dashboard-layout.service';
import { OverviewEntry, SharedOverviewComponent } from "libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component";

@Component({
  selector: 'lib-view-general-assessmnet',
  imports: [CommonModule, SkeletonModule, TranslateModule, SharedOverviewComponent],
  templateUrl: './viewGeneralAssessmnet.component.html',
  styleUrl: './viewGeneralAssessmnet.component.scss',
})
export class ViewGeneralAssessmnetComponent {
  breadCrumbLinks: any;
  loadDataAssests: boolean = false;
  tabs: any[] = [];
  assessmentData: any;
  active_tab = 1;
  AssestId: any;
  entries: OverviewEntry[] = [
  { key: 'purpose', label: 'GENERAL_ASSESSMENT.PURPOSE', type: 'text' },
  { key: 'scope', label: 'GENERAL_ASSESSMENT.SCOPE', type: 'text' },
  { key: 'outOfScope', label: 'GENERAL_ASSESSMENT.OUT_OF_SCOPE', type: 'text' },

  { key: 'overallScore', label: 'GENERAL_ASSESSMENT.OVERALL_SCORE', type: 'number' },
  { key: 'startDate', label: 'GENERAL_ASSESSMENT.START_DATE', type: 'date' },
  { key: 'dueDate', label: 'GENERAL_ASSESSMENT.DUE_DATE', type: 'date' },

  { key: 'generalAssessmentTypeName', label: 'GENERAL_ASSESSMENT.generalAssessmentType', type: 'text' },
  { key: 'generalAssessmentStatusTypeName', label: 'GENERAL_ASSESSMENT.STATUS', type: 'text' },

  { key: 'responsibleUserName', label: 'GENERAL_ASSESSMENT.RESPONSIBLE_USER', type: 'user',id:'responsibleUserID' },
  { key: 'responsibleUserName', label: 'GENERAL_ASSESSMENT.RESPONSIBLE_ROLE', type: 'text' }
];

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private DashboardLayoutService: DashboardLayoutService
  ) {
    this._ActivatedRoute?.parent?.paramMap.subscribe((res) => {
      this.AssestId = res.get('AssId');
    });
    this.getByIdAssestes();
  }
  getByIdAssestes() {
    this.loadDataAssests = true;
    this.DashboardLayoutService.getGeneralAssessmentsById(
      this.AssestId
    ).subscribe((res: any) => {
      this.assessmentData = res?.data;
      this.loadDataAssests = false;
    });
  }
}
