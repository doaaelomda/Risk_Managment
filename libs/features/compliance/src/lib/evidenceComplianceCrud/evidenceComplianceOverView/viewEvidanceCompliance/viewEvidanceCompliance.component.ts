import { OverviewEntry, SharedOverviewComponent } from './../../../../../../../shared/shared-ui/src/lib/shared-overview/shared-overview.component';
import { ComplianceAssessmntService } from './../../../../services/compliance-assessmnt.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
@Component({
  selector: 'lib-view-evidance-compliance',
  imports: [CommonModule, SkeletonModule, TranslateModule,SharedOverviewComponent],
  templateUrl: './viewEvidanceCompliance.component.html',
  styleUrl: './viewEvidanceCompliance.component.scss',
})
export class ViewEvidanceComplianceComponent {
  evidanceId: any;
  data: any;
  loading: boolean = false;
  entries: OverviewEntry[] = [
  {
    key: 'name',
    label: 'EVIDENCE_COMPLIANCE.NAME',
    type: 'text',
  },
  {
    key: 'taskTitle',
    label: 'EVIDENCE_COMPLIANCE.TASK_TITLE',
    type: 'text',
  },
  {
    key: 'evidenceTypeStatusTypeName',
    label: 'EVIDENCE_COMPLIANCE.EVIDENCE_TYPE_STATUS',
    type: 'text',
  },
  {
    key: 'organizationalUnitName',
    label: 'EVIDENCE_COMPLIANCE.ORGANIZATIONAL_UNIT',
    type: 'text',
  },
  {
    key: 'assigneeRoleName',
    label: 'EVIDENCE_COMPLIANCE.ASSIGNEE_ROLE',
    type: 'text',
  },
  {
    key: 'assigneeUserName',
    label: 'EVIDENCE_COMPLIANCE.ASSIGNEE_USER',
    type: 'user',
    id:'assigneeUserID'
  },
  {
    key: 'approvalRequired',
    label: 'EVIDENCE_COMPLIANCE.APPROVAL_REQUIRED',
    type: 'boolean',
  },
  {
    key: 'nextUpdateDate',
    label: 'EVIDENCE_COMPLIANCE.NEXT_UPDATE_DATE',
    type: 'date',
  },
  {
    key: 'description',
    label: 'EVIDENCE_COMPLIANCE.DESCRIPTION',
    type: 'description',
  },
  {
    key: 'taskDescription',
    label: 'EVIDENCE_COMPLIANCE.TASK_DESCRIPTION',
    type: 'description',
  },
  {
    key: 'evidenceDescription',
    label: 'EVIDENCE_COMPLIANCE.EVIDENCE_DESCRIPTION',
    type: 'description',
  },
];

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private ComplianceAssessmntService: ComplianceAssessmntService
  ) {
    this._ActivatedRoute?.parent?.paramMap.subscribe((res) => {
      this.evidanceId = res.get('id');
      this.loading = true;
      this.ComplianceAssessmntService.getEvidenceComplianceById(
        this.evidanceId
      ).subscribe((res: any) => {
        this.data = res?.data;
        this.loading = false;
        if (this.evidanceId) {
          this._LayoutService.breadCrumbLinks.next([
            {
              name: '',
              icon: 'fi fi-rs-home',
              routerLink: '/',
            },
            {
              name: this._TranslateService.instant(
                'BREAD_CRUMB_TITLES.EVIDENCE_COMPLIANCE_LIST'
              ),
              icon: '',
              routerLink: '/gfw-portal/compliance/evidenceType',
            },
            {
              name: this.data?.name,
              icon: '',
            },
          ]);
        }
      });
    });
  }
}
