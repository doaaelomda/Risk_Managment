import { SystemActionsComponent } from './../../../../../../shared/shared-ui/src/lib/system-actions/system-actions.component';
import { OwnerUserComponent } from './../../../../../../shared/shared-ui/src/lib/ownerUser/ownerUser.component';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { tap, switchMap } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
import {
  OverviewEntry,
  SharedOverviewComponent,
} from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';
import { TranslationsService } from '../../../../../../../apps/gfw-portal/src/app/core/services/translate.service';

@Component({
  selector: 'lib-control-management-overview',
  imports: [
    CommonModule,
    TranslateModule,
    SkeletonModule,
    OwnerUserComponent,
    SystemActionsComponent,
    SharedOverviewComponent,
  ],
  templateUrl: './control-management-overview.component.html',
  styleUrl: './control-management-overview.component.scss',
})
export class ControlManagementOverviewComponent implements OnInit {
  Data: any;

  constructor(
    private _RiskService: RiskService,
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private TranslationsService: TranslationsService
  ) {}

  mainInformationsEntries: OverviewEntry[] = [];
  textAndScopeEntries: OverviewEntry[] = [];
  documentsAndReferenceEntries: OverviewEntry[] = [];
  responsibilityAndOwnershipEntries: OverviewEntry[] = [];
  complianceStatusEntries: OverviewEntry[] = [];
  effectivenessEntries: OverviewEntry[] = [];
  implementationEntries: OverviewEntry[] = [];
  applyCapEntries: OverviewEntry[] = [];
  maturityEntries: OverviewEntry[] = [];

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
  getDataControls() {
    this.loadingState = true;
    this.id = +this._ActivatedRoute.parent?.snapshot.paramMap.get('id')!;
    this.controlId =
      +this._ActivatedRoute.parent?.snapshot.paramMap.get('controlId')!;
    if (this.id) {
      this._RiskService.getOneGovControl(this.id).subscribe((res) => {
        this.loadingState = false;
        this.Data = res?.data;
        this._LayoutService.breadCrumbLinks.next([
          {
            name: '',
            icon: 'fi fi-rs-home',
            routerLink: '/',
          },
          {
            name: this._TranslateService.instant(
              'BREAD_CRUMB_TITLES.Governance'
            ),
            icon: '',
            routerLink: this.controlId
              ? `/gfw-portal/compliance/overViewDocument/${this.controlId}/content`
              : '/gfw-portal/governance/control-management/list',
          },
          {
            name: this._TranslateService.instant(
              'BREAD_CRUMB_TITLES.Control_Management'
            ),
            icon: '',
            routerLink: this.controlId
              ? `/gfw-portal/compliance/overViewDocument/${this.controlId}/content`
              : '/gfw-portal/governance/control-management/list',
          },
          {
            name: this.Data?.name || '-',
            icon: '',
          },
        ]);
        const language = this.TranslationsService.getSelectedLanguage();
        console.log(language, 'language');
        let nameObj:OverviewEntry =
          language === 'en'
            ? {
                key: 'name',
                label: this._TranslateService.instant('GOV_CONTROL.NAME_EN'),
                type: 'text',
              }
            : {
                key: 'nameAr',
                label: this._TranslateService.instant('GOV_CONTROL.NAME_AR'),
                type: 'text',
              };
        this.mainInformationsEntries = [
        nameObj,

          {
            key: 'controlCode',
            label: this._TranslateService.instant('GOV_CONTROL.CODE'),
            type: 'text',
          },

          {
            key: 'referenceNumber',
            label: this._TranslateService.instant(
              'GOV_CONTROL.REFERENCE_NUMBER'
            ),
            type: 'text',
          },
          {
            key: 'govDocumentTypeName',
            label: this._TranslateService.instant('GOV_CONTROL.CONTROL_TYPE'),
            type: 'text',
          },
          {
            key: 'govControlCategoryName',
            label: this._TranslateService.instant('GOV_CONTROL.CATEGORY'),
            type: 'text',
          },
          {
            key: 'isApplicable',
            label: this._TranslateService.instant('GOV_CONTROL.APPLICABLE'),
            type: 'boolean',
            true_value: this._TranslateService.instant('COMMON.YES'),
            false_value: this._TranslateService.instant('COMMON.NO'),
          },
        ];
        this.textAndScopeEntries = [
          {
            key: 'fullControlText',
            label: this._TranslateService.instant('GOV_CONTROL.FULL_TEXT'),
            type: 'description',
            hasNoBorder: true,
          },
          {
            key: 'fullControlTextAr',
            label: this._TranslateService.instant('GOV_CONTROL.FULL_TEXT_AR'),
            type: 'description',
          },
          {
            key: 'evidenceDescription',
            label: this._TranslateService.instant(
              'GOV_CONTROL.EVIDENCE_DESCRIPTION'
            ),
            type: 'description',
          },
          {
            key: 'objective',
            label: this._TranslateService.instant('GOV_CONTROL.OBJECTIVE'),
            type: 'description',
          },
          {
            key: 'objectiveAr',
            label: this._TranslateService.instant('GOV_CONTROL.OBJECTIVE_AR'),
            type: 'description',
          },
          {
            key: 'scope',
            label: this._TranslateService.instant('GOV_CONTROL.SCOPE'),
            type: 'description',
          },
        ];
        if (this.Data?.govControlTypeID === 1) {
          this.documentsAndReferenceEntries = [
            {
              key: 'govRegulatorName',
              label: this._TranslateService.instant(
                'Control_view.GOV_REGULATOR'
              ),
              type: 'text',
            },
            {
              key: 'complianceDocumentName',
              label: this._TranslateService.instant(
                'Control_view.ComplianceDocument'
              ),
              type: 'text',
            },
          ];
        } else {
          this.documentsAndReferenceEntries = [
            {
              key: 'govDocumentName',
              label: this._TranslateService.instant('GOV_CONTROL.GOV_DOCUMENT'),
              type: 'text',
            },
            {
              key: 'govDocumentTypeName',
              label: this._TranslateService.instant(
                'GOV_CONTROL.GOV_DOCUMENT_TYPE'
              ),
              type: 'badge',
              colorKey: 'govDocumentTypeColor',
            },
          ];
        }
        this.responsibilityAndOwnershipEntries = [
          {
            key: 'responsibleRoleName',
            label: this._TranslateService.instant(
              'GOV_CONTROL.RESPONSIBLE_ROLE'
            ),
            type: 'role',
            id: 'responsibleRoleID',
          },
          {
            key: 'responsibleUserName',
            label: this._TranslateService.instant(
              'GOV_CONTROL.RESPONSIBLE_USER'
            ),
            type: 'user',
            position: 'responsibleUserPosition',
            image: 'responsibleUserImage',
            id: 'responsibleUserID',
          },
          {
            key: 'organizationalUnitName',
            label: this._TranslateService.instant(
              'GOV_CONTROL.ORGANIZATIONAL_UNIT'
            ),
            type: 'text',
          },
        ];
        this.complianceStatusEntries = [
          {
            key: 'complianceStatusTypeName',
            label: this._TranslateService.instant(
              'GOV_CONTROL.COMPLIANCE_STATUS'
            ),
            type: 'badge',
            colorKey: 'complianceStatusTypeColor',
          },
          {
            key: 'complianceNextTestDate',
            label: this._TranslateService.instant(
              'GOV_CONTROL.COMPLIANCE_NEXT_TEST_DATE'
            ),
            type: 'date',
          },
          {
            key: 'complianceExpiryDate',
            label: this._TranslateService.instant(
              'GOV_CONTROL.COMPLIANCE_EXPIRY_DATE'
            ),
            type: 'date',
          },
        ];
        this.effectivenessEntries = [
          {
            key: 'effectivenessStatusTypeName',
            label: this._TranslateService.instant(
              'GOV_CONTROL.EFFECTIVENESS_STATUS'
            ),
            type: 'badge',
            colorKey: 'effectivenessStatusTypeColor',
          },
          {
            key: 'effectivenessNextTestDate',
            label: this._TranslateService.instant(
              'GOV_CONTROL.EFFECTIVENESS_NEXT_TEST_DATE'
            ),
            type: 'date',
          },
        ];
        this.maturityEntries = [
          {
            key: 'maturityLevelName',
            label: this._TranslateService.instant('GOV_CONTROL.MATURITY_LEVEL'),
            type: 'badge',
            colorKey: 'maturityLevelColor',
          },
          {
            key: 'maturityNextTestDate',
            label: this._TranslateService.instant(
              'GOV_CONTROL.MATURITY_NEXT_TEST_DATE'
            ),
            type: 'date',
          },
        ];
        this.implementationEntries = [
          {
            key: 'isActive',
            label: this._TranslateService.instant('GOV_CONTROL.IS_ACTIVE'),
            type: 'boolean',
            true_value: this._TranslateService.instant('COMMON.ACTIVE'),
            false_value: this._TranslateService.instant('COMMON.INACTIVE'),
          },
          {
            key: 'implementationNextTestDate',
            label: this._TranslateService.instant(
              'GOV_CONTROL.IMPLEMENTATION_NEXT_TEST_DATE'
            ),
            type: 'date',
          },
          {
            key: 'implementationGuidance',
            label: this._TranslateService.instant(
              'GOV_CONTROL.IMPLEMENTATION_GUIDANCE'
            ),
            type: 'description',
          },
        ];
        this.applyCapEntries = [
          {
            key: 'applyCap',
            label: this._TranslateService.instant('GOV_CONTROL.APPLY_CAP'),
            type: 'boolean',
            true_value: this._TranslateService.instant('COMMON.YES'),
            false_value: this._TranslateService.instant('COMMON.NO'),
          },
        ];
        if (this.Data?.applyCap) {
          this.applyCapEntries.push(
            {
              key: 'minCap',
              label: this._TranslateService.instant(
                'NEW_CONTROL.fields.MinCap.label'
              ),
              type: 'text',
            },
            {
              key: 'minCap',
              label: this._TranslateService.instant(
                'NEW_CONTROL.fields.MaxCap.label'
              ),
              type: 'text',
            },
            {
              key: 'govControlCapBehaviorTypeName',
              label: this._TranslateService.instant(
                'EFFECTIVENESS_FORMULA.CAP_BEHAVIOR'
              ),
              type: 'badge',
              colorKey: 'govControlCapBehaviorTypeColor',
            }
          );
        }
      });
    }
  }

  ngOnInit(): void {
    this.getDataControls();
  }

  loadingData: boolean = false;

  idValue: any;
  riskTitle: string = '-';

  hasActions: boolean = true;
  onFoundAction(event: boolean) {
    this.hasActions = event;
    console.log('hasActions', this.hasActions);
  }
}
