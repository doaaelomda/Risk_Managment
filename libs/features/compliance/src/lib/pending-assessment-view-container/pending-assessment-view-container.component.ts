import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ITabs,
  SharedTabsComponent,
} from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { ComplianceAssessmntService } from '../../services/compliance-assessmnt.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';

@Component({
  selector: 'lib-pending-assessment-view-container',
  imports: [CommonModule, SharedTabsComponent, RouterOutlet],
  templateUrl: './pending-assessment-view-container.component.html',
  styleUrl: './pending-assessment-view-container.component.scss',
})
export class PendingAssessmentViewContainerComponent {
  constructor(
    private translateService: TranslateService,
    private _PermissionSystemService: PermissionSystemService,
    private route: ActivatedRoute,
    private complianceAssessmentService: ComplianceAssessmntService,
    private layoutService: LayoutService
  ) {
    this.tabs = [
      {
        name: this.translateService.instant('ON_GOING_ASSESSMENTS.CONTROLS'),
        router: 'controls',
        icon: '',
        visible: () =>
          this._PermissionSystemService.can(
            'COMPLIANCE',
            'ONGOINGASSSESSMENT_CONTROLS',
            'VIEW'
          ),
      },
      {
        name: this.translateService.instant(
          'ON_GOING_ASSESSMENTS.EVIDENCE_TASKS'
        ),
        router: 'evidence',
        icon: '',
        visible: () =>
          this._PermissionSystemService.can(
            'COMPLIANCE',
            'ONGOINGASSESSMENT_EVIDENCETASK',
            'VIEW'
          ),
      },
      {
        name: this.translateService.instant('ON_GOING_ASSESSMENTS.FINDINGS'),
        router: 'findings',
        icon: '',
        visible: () =>
          this._PermissionSystemService.can(
            'COMPLIANCE',
            'ONGOINGASSESSMENT_FINDINGS',
            'VIEW'
          ),
      },
      {
        name: this.translateService.instant(
          'ON_GOING_ASSESSMENTS.CORRECTIVE_ACTIONS'
        ),
        router: 'corrective-action',
        icon: '',
        visible: () =>
          this._PermissionSystemService.can(
            'COMPLIANCE',
            'ONGOINGASSESSMENT_CORREECTIVEACTION',
            'VIEW'
          ),
      },
    ];

    this.route?.paramMap.subscribe((params) => {
      const assessmentId = params.get('id');
      this.complianceAssessmentService
        .getAssessmnetById(assessmentId)
        .subscribe({
          next: (res) => {
            this.layoutService.breadCrumbLinks.next([
              {
                name: '',
                icon: 'fi fi-rs-home',
                routerLink: '/',
              },
              {
                name: this.translateService.instant(
                  'BREAD_CRUMB_TITLES.Compliance'
                ),
                icon: '',
                routerLink: '/gfw-portal/compliance/pending-assessments',
              },
              {
                name: this.translateService.instant('TABS.ASSESSMENT'),
                icon: '',
                routerLink: '/gfw-portal/compliance/pending-assessments',
              },
              {
                name: res?.data?.name,
                icon: '',
                routerLink: `/gfw-portal/compliance/pending-assessments/${assessmentId}`,
              },
            ]);
          },
        });
    });
  }
  tabs: ITabs[] = [];
}
