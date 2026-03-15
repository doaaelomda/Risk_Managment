import { SharedService } from './../../../../../../../shared/shared-ui/src/services/shared.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { SkeletonModule } from 'primeng/skeleton';
import { OwnerUserComponent } from 'libs/shared/shared-ui/src/lib/ownerUser/ownerUser.component';
import { SystemActionsComponent } from 'libs/shared/shared-ui/src/lib/system-actions/system-actions.component';
import { ComplianceService } from 'libs/features/compliance/src/compliance/compliance.service';
import {
  OverviewEntry,
  SharedOverviewComponent,
} from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';
@Component({
  selector: 'lib-overview-control',
  imports: [
    CommonModule,
    TranslateModule,
    SkeletonModule,
    SystemActionsComponent,
    SharedOverviewComponent,
  ],
  templateUrl: './overview-control.component.html',
  styleUrl: './overview-control.component.scss',
})
export class OverviewControlComponent implements OnInit {
  Data: any;
  id: any;
  loadingState = true;
  statusCards = [
    {
      icon: 'fi fi-br-bank',
      title: 'Control_view.COMPLIANCE_STATUS',
      value: 'complianceStatusTypeName',
      lastUpdated: 'complianceExpiryDate',
      nextDate: 'complianceNextTestDate',
      spanClass: 'progress_span3',
    },
    {
      icon: 'fi fi-rs-tools',
      title: 'Control_view.Implementation_Status',
      value: 'implementationStatusTypeName',
      lastUpdated: 'implementationLastUpdated',
      nextDate: 'implementationNextTestDate',
      spanClass: 'progress_span2',
    },
    {
      icon: 'fi fi-rr-bullseye-arrow',
      title: 'Control_view.EFFECTIVE',
      value: 'effectivenessStatusTypeName',
      lastUpdated: 'effectivenessLastUpdated',
      nextDate: 'effectivenessNextTestDate',
      spanClass: 'progress_span',
    },
    {
      icon: 'fi fi-br-stats',
      title: 'Control_view.MATURITY_STATUS',
      value: 'maturityLevelName',
      lastUpdated: 'maturityAssessmentDate',
      nextDate: 'maturityNextTestDate',
      spanClass: 'progress_span4',
    },
  ];
  controlId: any;
  loadingData: boolean = false;
  overviewEntries: OverviewEntry[] = [
    {
      key: 'complianceDocumentElementName',
      label: 'LOOKUP.NAME',
      type: 'text',
    },
    {
      key: 'complianceDocumentElementNameAr',
      label: 'LOOKUP.NAME_AR',
      type: 'text',
    },
    {
      key: 'govControlName',
      label: 'RISK_MANAGMENT.Gov_Control_Type',
      type: 'text',
    },
    {
      key: 'grcDocumentElementTypeName',
      label: 'MAIN_INFO.DOC_ELE_CLASSFICATION_PROFILE',
      type: 'text',
    },
    {
      key: 'complianceDocumentName',
      label: 'Control_view.ComplianceDocument',
      type: 'text',
    },
    {
      key: 'parentName',
      label: 'GOVERNANCE_STANDARDS.PARENT_NAME',
      type: 'text',
    },
    {
      key: 'referenceCode',
      label: 'MODAL_VIEW.REFERENCE_CODE',
      type: 'text',
    },
    {
      key: 'grcDocumentElementClassificationName',
      label: 'CONTENT.CLASSFICATIONS',
      type: 'badge',
      colorKey: 'grcDocumentElementClassificationColor',
    },
    {
      key: 'orderNumber',
      label: 'ControlRequirement.ORDER_NUMBER',
      type: 'text',
    },
    {
      key: 'code',
      label: 'GOVERNANCE_STANDARDS.CODE',
      type: 'text',
    },
    {
      key: 'elementText',
      label: 'GOVERNANCE_STANDARDS.OBJECTIVE',
      type: 'description',
    },
    {
      key: 'elementTextAr',
      label: 'GOVERNANCE_STANDARDS.OBJECTIVE_AR',
      type: 'description',
    },
  ];

  constructor(
    private complianceService: ComplianceService,
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private service: RiskService
  ) {}

  getIDs() {
    this.loadingState = true;
    this.id = +this._ActivatedRoute.parent?.snapshot.paramMap.get('id')!;
    this.controlId =
      +this._ActivatedRoute.parent?.snapshot.paramMap.get('controlId')!;
    if (this.id && this.controlId) {
      this.getData();
    }
  }

  getData() {
    this.loadingData = true;
    this.service.getControlById(this.id).subscribe((res) => {
      this.Data = res?.data;
      this.loadingData = false;
      if (this.Data) {
        this.handleBreadCrumb(this.Data.complianceDocumentElementName);
      }
    });
  }

  handleBreadCrumb(complianceDocumentElementName?: any) {
    this.complianceService
      .getDocumentCompliance(this.controlId)
      .subscribe((res) => {
        this.loadingState = false;
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
            name: this._TranslateService.instant('BREAD_CRUMB_TITLES.CONTENT'),
            icon: '',
            routerLink: `/gfw-portal/compliance/overViewDocument/${this.controlId}/content`,
          },
          {
            name: complianceDocumentElementName,
          },
        ]);
      });
  }
  ngOnInit(): void {
    this.getIDs();
  }
  hasActions: boolean = true;
  onFoundAction(event: boolean) {
    this.hasActions = event;
    console.log('hasActions', this.hasActions);
  }
}
