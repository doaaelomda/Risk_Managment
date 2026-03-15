import { FindingActionComponent } from './../../../../../shared/shared-ui/src/lib/findind-action/finding-action.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ComplianceAssessmntService } from '../../services/compliance-assessmnt.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
@Component({
  selector: 'lib-findings-assessment',
  imports: [CommonModule, FindingActionComponent, TranslateModule],
  templateUrl: './FindingsAssessment.component.html',
  styleUrl: './FindingsAssessment.component.scss',
})
export class FindingsAssessmentComponent {
  // Declaration Variable
  entityID: any;
  dataAssessmnetCompliance: any;
  // handle Contractor
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private ComplianceAssessmntService: ComplianceAssessmntService
  ) {
    this.handleBreadCramp();
  }

  // methods handleBreadCramp
  handleBreadCramp() {
    this._ActivatedRoute.parent?.paramMap.subscribe((params) => {
      this.entityID = params.get('id');
      this.ComplianceAssessmntService.getAssessmnetById(
        this.entityID
      ).subscribe({
        next: (res) => {
          this.dataAssessmnetCompliance = res?.data;
          this._LayoutService.breadCrumbLinks.next([
            {
              name: '',
              icon: 'fi fi-rs-home',
              routerLink: '/',
            },
            {
              name: this._TranslateService.instant(
                'BREAD_CRUMB_TITLES.Compliance'
              ),
              icon: '',
              routerLink: '/gfw-portal/compliance/assessments',
            },
            {
              name: this._TranslateService.instant('TABS.ASSESSMENT'),
              icon: '',
              routerLink: '/gfw-portal/compliance/assessments',
            },
            {
              name: this.dataAssessmnetCompliance?.name || '-',
              icon: '',
              routerLink: `/gfw-portal/compliance/assessments/view/${this.entityID}/overview`,
            },
            {
              name: this._TranslateService.instant(
                'BREAD_CRUMB_TITLES.findings'
              ),
              icon: '',
            },
          ]);
        },
      });
    });
  }
}
