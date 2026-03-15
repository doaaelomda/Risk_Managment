import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ComplianceAssessmntService } from 'libs/features/compliance/src/services/compliance-assessmnt.service';
import { CommonModule } from '@angular/common';
import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';

@Component({
  selector: 'lib-evidence-compliance-comments',
  templateUrl: './evidanceComplianceComments.component.html',
  styleUrls: ['./evidanceComplianceComments.component.scss'],
  imports: [CommonModule, CommentSectionComponent],
})
export class EvidenceComplianceCommentsComponent implements OnInit, OnDestroy {
  evidenceId: any;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private complianceService: ComplianceAssessmntService
  ) {}

  ngOnInit(): void {
    this.handleRouteParams();
  }

  /**
   * Handle route parameters to get evidence ID
   * and load breadcrumb accordingly
   */
  handleRouteParams(): void {
    const routeSub = this._ActivatedRoute?.parent?.paramMap
      .pipe(
        switchMap((params) => {
          this.evidenceId = params.get('id');
          if (this.evidenceId) {
            return this.complianceService.getEvidenceComplianceById(
              this.evidenceId
            );
          }
          return of(null);
        })
      )
      .subscribe((res: any) => {
        if (res?.data) {
          this.updateBreadCrumb(res.data || '-');
        }
      });

    this.subscriptions.add(routeSub);
  }

  updateBreadCrumb(evidenceData: any): void {
    this._LayoutService.breadCrumbLinks.next([
          { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
           {
              name: this._TranslateService.instant('BREAD_CRUMB_TITLES.EVIDENCE_COMPLIANCE_LIST'),
              icon: '',
              routerLink: '/gfw-portal/compliance/evidenceType',
            },
            { name: evidenceData?.name || '-', icon: '', routerLink: `/gfw-portal/compliance/evidenceType/${this.evidenceId}` },
      { name: this._TranslateService.instant('TABS.COMMENTS'), icon: '' },
    ]);
  }

  /**
   * Cleanup all subscriptions when component is destroyed
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
