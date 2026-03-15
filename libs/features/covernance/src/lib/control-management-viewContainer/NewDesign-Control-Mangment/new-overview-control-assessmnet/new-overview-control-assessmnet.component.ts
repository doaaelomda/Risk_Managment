import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { SkeletonModule } from 'primeng/skeleton';
import { SystemActionsComponent } from 'libs/shared/shared-ui/src/lib/system-actions/system-actions.component';
import { OwnerUserComponent } from 'libs/shared/shared-ui/src/lib/ownerUser/ownerUser.component';
import { Subscription } from 'rxjs';
@Component({
  selector: 'lib-overview-control-assessmnet',
  imports: [
    CommonModule,
    TranslateModule,
    SkeletonModule,
    OwnerUserComponent,
    SystemActionsComponent,
  ],
  templateUrl: './new-overview-control-assessmnet.component.html',
  styleUrl: './new-overview-control-assessmnet.component.scss',
})
export class newOverviewControlAssessmnetComponent
  implements OnInit, OnDestroy
{
  // Declaration Variables
  data: any;
  id!: number;
  controlId!: number;
  loadingState = true;
  tabs: any[] = [];
  active_tab = 1;
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
  controlMainInfo = [
    { label: 'Control_view.CONTROL_CODE', key: 'controlCode' },
    { label: 'pending_assessment.referenceNumber', key: 'referenceNumber' },
    { label: 'measurment.STATUS', key: 'status', isBadge: true },
  ];
  controlInfoFields = [
    {
      label: 'Control_view.DESCRIPTION',
      key: 'fullControlText',
      isFullSection: true,
      textClass: 'desc',
    },
    {
      label: 'Control_view.Objective',
      key: 'objective',
      isFullSection: true,
      isObjective: true,
    },
    {
      label: 'Control_view.Evidence_Description',
      key: 'evidenceDescription',
      isFullSection: true,
    },
    {
      label: 'Control_view.scope',
      key: 'scope',
      isFullSection: true,
      hasBorder: true,
    },
  ];
  classificationFields = [
    { label: 'RISK_MANAGMENT.Gov_Control_Type', key: 'govControlTypeName' },
    {
      label: 'RISK_MANAGMENT.Gov_Control_Category',
      key: 'govControlCategoryName',
    },
    {
      label: 'RISK_MANAGMENT.Organizational_Unit',
      key: 'organizationUnitName',
    },
    { label: 'RISK_MANAGMENT.Gov_Document', key: 'govDocumentName' },
    { label: 'RISK_MANAGMENT.Gov_Document_Type', key: 'govDocumentTypeName' },
  ];
  fieldsConfig: any = {
    Compliance: [
      {
        label: 'controls.ComplianceStatus',
        key: 'complianceStatusTypeName',
        type: 'status',
      },
      {
        label: 'controls.ComplianceLastUpdated',
        key: 'complianceLastUpdated',
        type: 'date',
      },
      {
        label: 'controls.ComplianceExpiryDate',
        key: 'complianceExpiryDate',
        type: 'date',
      },
      {
        label: 'controls.ComplianceNextTest',
        key: 'complianceNextTestDate',
        type: 'date',
      },
      {
        label: 'controls.ComplianceReptation',
        key: 'complianceReptationDate',
        type: 'date',
      },
    ],
    Effectiveness: [
      {
        label: 'controls.ComplianceStatus',
        key: 'effectivenessStatusTypeName',
        type: 'status',
      },
      {
        label: 'Control_view.Effectiveness_Last_Updated',
        key: 'effectivenessLastUpdated',
        type: 'date',
      },
      {
        label: 'controls.EffectivenessExpiryDate',
        key: 'effectivenessExpiryDate',
        type: 'date',
      },
      {
        label: 'controls.EffectivenessNextTest',
        key: 'EffectivenessNextTestDate',
        type: 'date',
      },
      {
        label: 'controls.EffectivenessReptation',
        key: 'effectivenessReptationDate',
        type: 'date',
      },
    ],
    Implementation: [
      {
        label: 'controls.ComplianceStatus',
        key: 'implementationStatusTypeName',
        type: 'status',
      },
      {
        label: 'controls.ImplementationNextTest',
        key: 'implementationNextTestDate',
        type: 'date',
      },
      {
        label: 'controls.ImplementationReptation',
        key: 'implementationReptationDate',
        type: 'date',
      },
      {
        label: 'controls.ComplianceLastUpdated',
        key: 'implementationLastUpdated',
        type: 'date',
      },
    ],
    Maturity: [
      {
        label: 'controls.ComplianceStatus',
        key: 'maturityStatusTypeName',
        type: 'status',
      },
      {
        label: 'controls.MaturityNextTest',
        key: 'maturityNextTestDate',
        type: 'date',
      },
      {
        label: 'controls.MaturityReptation',
        key: 'maturityReptationDate',
        type: 'date',
      },
      {
        label: 'controls.ComplianceLastUpdated',
        key: 'maturityLastUpdated',
        type: 'date',
      },
    ],
  };
  tabsData = [
    { id: 1, key: 'Compliance', noteKey: '' },
    { id: 2, key: 'Effectiveness', noteKey: '' },
    { id: 3, key: 'Implementation', noteKey: '' },
    { id: 4, key: 'Maturity', noteKey: '' },
  ];

  private subscriptions: Subscription = new Subscription();
  constructor(
    private riskService: RiskService,
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private translateService: TranslateService
  ) {}

  /**
   * Fetch control data from server based on route params
   */
  getDataControls() {
    this.loadingState = true;
    this.id = +this.activatedRoute.parent?.snapshot.paramMap.get('id')!;
    this.controlId =
      +this.activatedRoute.parent?.snapshot.paramMap.get('controlId')!;

    if (this.id) {
      const sub = this.riskService.getOneGovControl(this.id).subscribe({
        next: (res) => {
          this.data = res?.data;
          this.loadingState = false;

          this.layoutService.breadCrumbLinks.next([
            {
              name: '',
              icon: 'fi fi-rs-home',
              routerLink: '/',
            },
            {
              name: this.translateService.instant(
                'BREAD_CRUMB_TITLES.Governance'
              ),
              icon: '',
              routerLink: this.controlId
                ? `/gfw-portal/compliance/overViewDocument/${this.controlId}/content`
                : '/gfw-portal/governance/control-management/list',
            },
            {
              name: this.translateService.instant(
                'BREAD_CRUMB_TITLES.Control_Management'
              ),
              icon: '',
              routerLink: this.controlId
                ? `/gfw-portal/compliance/overViewDocument/${this.controlId}/content`
                : '/gfw-portal/governance/control-management/list',
            },
            {
              name: this.data?.name || '-',
              icon: '',
            },
          ]);
        },
        error: (err) => {
          console.error('Error fetching control data', err);
          this.loadingState = false;
        },
      });

      this.subscriptions.add(sub);
    }
  }

  // status Tabs
  selectTab(id: number) {
    this.active_tab = id;
  }
  // handleTabs
  handleTabs() {
    this.tabs = [
      {
        id: 1,
        name: this.translateService.instant('pending_assessment.Compliance'),
      },
      {
        id: 2,
        name: this.translateService.instant('pending_assessment.Effectiveness'),
      },
      {
        id: 3,
        name: this.translateService.instant(
          'pending_assessment.Implementation'
        ),
      },
      {
        id: 4,
        name: this.translateService.instant(
          'pending_assessment.Maturity_Level'
        ),
      },
    ];
  }

  /** Lifecycle hook */
  ngOnInit(): void {
    this.getDataControls();
    this.handleTabs();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

      hasActions:boolean = true;
  onFoundAction(event:boolean){
    this.hasActions = event;
    console.log('hasActions', this.hasActions);
  }
}
