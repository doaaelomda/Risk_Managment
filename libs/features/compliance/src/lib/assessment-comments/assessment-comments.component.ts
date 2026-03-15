import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ComplianceAssessmntService } from '../../services/compliance-assessmnt.service';

@Component({
  selector: 'lib-assessment-comments',
  imports: [CommonModule, CommentSectionComponent],
  templateUrl: './assessment-comments.component.html',
  styleUrl: './assessment-comments.component.scss',
})
export class AssessmentCommentsComponent {
  dataAssessmnetCompliance: any;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private ComplianceAssessmntService: ComplianceAssessmntService
  ) {
    this._ActivatedRoute.parent?.paramMap.subscribe((params) => {
      this.riskChildId = params.get('id');
      this.ComplianceAssessmntService.getAssessmnetById(
        this.riskChildId
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
              routerLink: `/gfw-portal/compliance/assessments/view/${this.riskChildId}/overview`,
            },
            {
              name:this._TranslateService.instant('TABS.COMMENTS'),
              icon:''
            }
          ]);
        },
      });
    });
  }
  riskId = 1;
  riskChildId: any;
}
