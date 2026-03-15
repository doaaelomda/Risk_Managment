import { Breadcrumb } from './../../../../../../../../apps/gfw-portal/src/app/core/models/breadcrumb.model';
/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { ComplianceService } from 'libs/features/compliance/src/compliance/compliance.service';

@Component({
  selector: 'lib-comment-compliance-document',
  imports: [CommonModule, CommentSectionComponent],
  templateUrl: './commentComplianceDocument.component.html',
  styleUrl: './commentComplianceDocument.component.scss',
})
export class CommentComplianceDocumentComponent implements OnInit {
  relatedColumnId!: number;
  items: any[] = [];
  constructor(
    private _LayoutService: LayoutService,
    private _ActivatedRoute: ActivatedRoute,
    private _TranslateService: TranslateService,
    private complianceService: ComplianceService
  ) {}
  ngOnInit() {
    this.getIdFromRouting();
  }

  // get Id FromRouting
  getIdFromRouting() {
    this._ActivatedRoute.parent?.paramMap.subscribe((params: any) => {
      this.relatedColumnId = Number(params.get('id'));
      this.complianceService
        .getDocumentCompliance(this.relatedColumnId)
        .subscribe((res) => {
          this.getDefaultBreadcrumbs(res?.data);
        });
    });
  }

  // Breadcrumb Initialize
  private getDefaultBreadcrumbs(data: any) {
   this._LayoutService.breadCrumbLinks.next([
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.COMPLIANCE_GOVERNANCE'
        ),
        icon: '',
        routerLink: '/gfw-portal/compliance/complianceDocuments',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.DOCUMENTS'),
        icon: '',
        routerLink: '/gfw-portal/compliance/complianceDocuments',
      },
      {
        name: data?.name ?? '-',
        icon: '',
        routerLink: `/gfw-portal/compliance/overViewDocument/${this.relatedColumnId}/overview`,
      },
      {
        name: this._TranslateService.instant('TABS.COMMENTS'),
        icon: '',
      }
    ])
  }
}
