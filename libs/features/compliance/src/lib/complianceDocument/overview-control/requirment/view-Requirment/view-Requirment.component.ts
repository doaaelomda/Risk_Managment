import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  OverviewEntry,
  SharedOverviewComponent,
} from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { SystemActionsComponent } from 'libs/shared/shared-ui/src/lib/system-actions/system-actions.component';
import { ComplianceService } from 'libs/features/compliance/src/compliance/compliance.service';
import { RequirmentDocumentService } from 'libs/features/compliance/src/services/requirment-document.service';

@Component({
  selector: 'lib-view-requirment',
  imports: [CommonModule, SharedOverviewComponent, SystemActionsComponent],
  templateUrl: './view-Requirment.component.html',
  styleUrl: './view-Requirment.component.scss',
})
export class ViewRequirmentComponent {
  dataRequirment: any;
  loadDataRequirment: boolean = false;
  id: any;
  entries: OverviewEntry[] = [];
  entriesData: any;
  controlId: any;
  Data: any;
  govControlID: number;
  constructor(
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _ActivatedRoute: ActivatedRoute,
    private complianceService: ComplianceService,
    private RequirmentDocumentService: RequirmentDocumentService
  ) {
    this.id = +this._ActivatedRoute.parent?.snapshot.paramMap.get('id')!;
    this.controlId =
      +this._ActivatedRoute.parent?.snapshot.paramMap.get('controlId')!;
    this.govControlID =
      +this._ActivatedRoute.parent?.snapshot.paramMap.get('govControlID')!;
    if (this.id) {
      this.getRequirmentData();
    }
  }
  getRequirmentData() {
    this.loadDataRequirment = true;
    this.RequirmentDocumentService.getRequirementControlsById(
      this.id
    ).subscribe({
      next: (res: any) => {
        this.dataRequirment = res?.data;
        this.entriesData = {
          requirementText: this.dataRequirment.requirementText,
          requirementTextAr: this.dataRequirment.requirementTextAr,
          responsibleUserName: this.dataRequirment.responsibleUser?.name || '-',
          responsibleRoleName:
            this.dataRequirment.responsibleRole?.roleName || '-',
          orderNumber: this.dataRequirment.orderNumber,
          externalReference: this.dataRequirment.externalReference,
        };
        this.handleBreadCrumb(this.dataRequirment);

        this.entries = [
          {
            key: 'requirementText',
            label: 'ControlRequirement.TEXT_EN',
            type: 'text',
          },
          {
            key: 'requirementTextAr',
            label: 'ControlRequirement.TEXT_AR',
            type: 'text',
          },
          // {
          //   key: 'responsibleUserName',
          //   label: 'VERSION.APPROVER_ASSIGNEE',
          //   type: 'text',
          //   id: 'responsibleUserID',
          // },
          // {
          //   key: 'responsibleRoleName',
          //   label: 'VERSION.ROLE_ASSIGNEE',
          //   type: 'text',
          //   id: 'responsibleRoleID',
          // },
          {
            key: 'orderNumber',
            label: 'ControlRequirement.ORDER_NUMBER',
            type: 'number',
          },
          {
            key: 'externalReference',
            label: 'ControlRequirement.EXTERNAL_REF',
            type: 'text',
          },
        ];
        this.loadDataRequirment = false;
      },
      error: () => {
        this.dataRequirment = {};
      },
    });
  }

  getData() {
    this.RequirmentDocumentService.getRequirementControlsById(
      this.id
    ).subscribe((res) => {
      this.Data = res?.data;
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
                name: res?.data?.name || '-',
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
                name: Data?.requirementText,
                routerLink: `/gfw-portal/compliance/overViewDocument/${this.controlId}/content/${this.id}/overview`,
              },
            ]);
          }
        });
    }
  }

  hasActions: boolean = true;
  onFoundAction(event: boolean) {
    this.hasActions = event;
    console.log('hasActions', this.hasActions);
  }
}
