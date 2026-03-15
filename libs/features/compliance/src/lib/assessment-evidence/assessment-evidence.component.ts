import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EntityActionComponent } from 'libs/shared/shared-ui/src/lib/entity-action/entity-action.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ComplianceAssessmntService } from '../../services/compliance-assessmnt.service';

@Component({
  selector: 'lib-assessment-evidence',
  imports: [CommonModule, EntityActionComponent, TranslateModule],
  templateUrl: './assessment-evidence.component.html',
  styleUrl: './assessment-evidence.component.scss',
})
export class AssessmentEvidenceComponent {
  // declaration Variables
  entityID: any;
  dataAssessmnetCompliance: any;
  // handle Constructor
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private ComplianceAssessmntService: ComplianceAssessmntService
  ) {
    this.handleBreadCamb();
  }
  // handle BreadCamb
  handleBreadCamb() {
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
                'BREAD_CRUMB_TITLES.EVIDENCE_LIST'
              ),
              icon: '',
            },
          ]);
        },
      });
    });
  }
}
