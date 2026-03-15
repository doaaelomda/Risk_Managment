import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ActivatedRoute } from '@angular/router';
import { GoveranceService } from 'libs/features/covernance/src/service/goverance.service';
import { MessageService } from 'primeng/api';
import { RequirmentDocumentService } from 'libs/features/compliance/src/services/requirment-document.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { ComplianceService } from 'libs/features/compliance/src/compliance/compliance.service';
@Component({
  selector: 'lib-comment-requirment',
  imports: [CommonModule, CommentSectionComponent],
  templateUrl: './comment-Requirment.component.html',
  styleUrl: './comment-Requirment.component.scss',
})
export class CommentRequirmentComponent {
  requirementControl: any;
  controlRequirementData: any;
  loading: boolean = false;
  govControlID: any;
  controlId: any;
  constructor(
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _ActivatedRoute: ActivatedRoute,
    private RequirmentDocumentService: RequirmentDocumentService,
    private complianceService: ComplianceService
  ) {
    this.id = +this._ActivatedRoute.parent?.snapshot.paramMap.get('id')!;
    this.controlId =
      +this._ActivatedRoute.parent?.snapshot.paramMap.get('controlId')!;
    this.govControlID =
      +this._ActivatedRoute.parent?.snapshot.paramMap.get('govControlID')!;
    if (this.id) {
      this.getData();
    }
  }
  Data: any;
  id: any;
  getData() {
    this.RequirmentDocumentService.getRequirementControlsById(
      this.id
    ).subscribe((res) => {
      this.Data = res?.data;
      this.handleBreadCrumb(this.Data);
    });
  }
  handleBreadCrumb(Data?: any) {
    if (this.controlId) {
      this.getData();
      this.complianceService
        .getDocumentCompliance(this.controlId)
        .subscribe((res: any) => {
          if (res?.data) {
            this._LayoutService.breadCrumbLinks.next([
              {
                name: this._TranslateService.instant(
                  'BREAD_CRUMB_TITLES.COMPLIANCE_GOVERNANCE'
                ),
                icon: '',
                routerLink: `/gfw-portal/compliance/complianceDocuments`,
              },
              {
                name: this._TranslateService.instant(
                  'BREAD_CRUMB_TITLES.DOCUMENTS'
                ),
                icon: '',
                routerLink: `/gfw-portal/compliance/complianceDocuments`,
              },
              {
                name: res?.data?.name ? res?.data?.name : '-',
                icon: '',
                routerLink: `/gfw-portal/compliance/overViewDocument/${this.controlId}/overview`,
              },
              {
                name: this._TranslateService.instant(
                  'BREAD_CRUMB_TITLES.CONTROL_REQUIREMENTS'
                ),
                icon: '',
                routerLink: `/gfw-portal/compliance/overViewDocument/${this.controlId}/content/${this.govControlID}/RequirementControl`,
              },
              {
                name: Data?.requirementText ? Data?.requirementText : '-',
                routerLink: `/gfw-portal/compliance/overViewDocument/${this.controlId}/content/${this.govControlID}/RequirementControl/${this.id}`,
              },
              {
                name: this._TranslateService.instant('TABS.COMMENTS'),
              },
            ]);
          }
        });
    }
  }
}
