import { RiskMatrexChartComponent } from './../../../../../../shared/shared-ui/src/lib/risk-matrex-chart/risk-matrex-chart.component';
import { RiskService } from './../../../services/risk.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { ProgressBarModule } from 'primeng/progressbar';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DateFormaterPipe } from '../../../../../../../apps/gfw-portal/src/app/core/pipes/dateFormater.pipe';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { switchMap, tap } from 'rxjs';
import { SystemActionsComponent } from 'libs/shared/shared-ui/src/lib/system-actions/system-actions.component';
import { OverviewEntry, SharedOverviewComponent } from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';

@Component({
  selector: 'lib-risk-overview',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    ChipModule,
    ProgressBarModule,
    CardModule,
    SkeletonModule,
    SystemActionsComponent,
    SharedOverviewComponent,
    RiskMatrexChartComponent
],
  templateUrl: './risk-overview.component.html',
  styleUrl: './risk-overview.component.scss',
})
export class RiskOverviewComponent implements OnInit {
  Data: any;

  constructor(
    private cd: ChangeDetectorRef,
    public formatDate: DateFormaterPipe,
    private _RiskService: RiskService,
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService
  ) {
      this.mainInfoEntries = [
    { key: 'riskCode', label: this._TranslateService.instant('RISK_MANAGMENT.RISK_CODE'), type: 'text' },
    { key: 'riskTitle', label: this._TranslateService.instant('RISK_MANAGMENT.RISK_TITLE'), type: 'text' },

    { key: 'externalReference', label: this._TranslateService.instant('RISK_MANAGMENT.EXTERNALREFERENCE_DESCRIPTION'), type: 'description' },
     { key: 'riskDescription', label: this._TranslateService.instant('RISK_MANAGMENT.RISK_DESCRIPTION'), type: 'description' },
    {
      key: 'affectedAssetsDescription',
      label: this._TranslateService.instant('RISK_MANAGMENT.AFFECTEDASSETS_DESCRIPTION'),
      type: 'description',
    },
  ];

  this.classificationsEntries = [
    {
      key: 'riskDomainName',
      label: this._TranslateService.instant('RISK_MANAGMENT.DOMAIN'),
      type: 'badge',
      colorKey: 'riskDomainColor',
    },
    {
      key: 'riskCategoryName',
      label: this._TranslateService.instant('RISK_MANAGMENT.CATEGORY'),
      type: 'badge',
      colorKey: 'riskCategoryColor',
    },
    {
      key: 'riskSourceName',
      label: this._TranslateService.instant('RISK_MANAGMENT.SOURCE'),
      type: 'badge',
      colorKey: 'riskSourceColor',
    },
    {
      key: 'riskStageName',
      label: this._TranslateService.instant('RISK_MANAGMENT.RISK_STAGE'),
      type: 'badge',
      colorKey: 'riskStageColor',
    },
    {
      key: 'riskResponseTypeName',
      label: this._TranslateService.instant('RISK_MANAGMENT.RISK_RESPONSE_TYPE'),
      type: 'badge',
      colorKey: 'riskResponseTypeColor',
    },
    {
      key: 'riskFrequencyTypeName',
      label: this._TranslateService.instant('RISK_MANAGMENT.RISK_FREQUENCY_TYPE'),
      type: 'badge',
      colorKey: 'riskFrequencyTypeColor',
    },
  ];

  this.responsibilitiesEntries = [
    {
      key: 'riskOwnerRole',
      label: this._TranslateService.instant('RISK_MANAGMENT.RISK_ROLE_OWNERS'),
      type: 'role',
      id:'riskOwnerRolesID'
    },
    {
      key: 'riskManagerRole',
      label: this._TranslateService.instant('RISK_MANAGMENT.RISK_MANAGER_ROLES'),
      type: 'role',
      id:'riskManagerRolesID'
    },
    {
      key: 'riskManagerUser',
      label: this._TranslateService.instant('RISK_MANAGMENT.RISK_MANAGER_USERS'),
      type: 'user',
      id:'riskManagerUsersID'
    },
  ];
  this.timelineEntries = [
    { key: 'identifiedDate', label: this._TranslateService.instant('RISK_MANAGMENT.IDENTIFIED_DATE'), type: 'date' },
    { key: 'expectedCloseDate', label: this._TranslateService.instant('RISK_MANAGMENT.EXPECTED_CLOSE_DATE'), type: 'date' },
    { key: 'actualCloseDate', label: this._TranslateService.instant('RISK_MANAGMENT.ACTUAL_CLOSE_DATE'), type: 'date' },
    { key: 'nextReviewDate', label: this._TranslateService.instant('RISK_MANAGMENT.NEXT_REVIEW_DATE'), type: 'date' },
  ];
  this.statusAndImplemenationsEntries = [
    {
      key: 'riskRecordStatusTypeName',
      label: this._TranslateService.instant('RISK_MANAGMENT.RISK_RECORD_STATUS'),
      type: 'badge',
      colorKey: 'riskRecordStatusTypeColor',
    },
    {
      key: 'riskExistenceStatusTypeName',
      label: this._TranslateService.instant('RISK_MANAGMENT.RISK_EXISTENCE_STATUS'),
      type: 'badge',
      colorKey: 'riskExistenceStatusTypeColor',
    },
    {
      key: 'riskExecutionStatusTypeName',
      label: this._TranslateService.instant('RISK_MANAGMENT.EXECUTION_STATUS'),
      type: 'badge',
      colorKey: 'riskExecutionStatusTypeColor',
    },
    { key: 'wfName', label: this._TranslateService.instant('RISK_MANAGMENT.WORKFLOW_ID'), type: 'text' },
  ];

  this.methodologyAndAppetiteEntries = [
    {
      key: 'riskMethodologyName',
      label: this._TranslateService.instant('RISK_MANAGMENT.RISK_METHODOLOGY'),
      type: 'text',
    },
    {
      key: 'riskAssessmentApproachName',
      label: this._TranslateService.instant('RISK_MANAGMENT.RISK_ASSESSMENT_APPROACH'),
      type: 'text',
    },
  ];
  this.strategicAnalysis = [
    { key: 'strengths', label: this._TranslateService.instant('RISK_MANAGMENT.CONTEXT_STRENGTHS'), type: 'description',hasNoBorder:true },
    { key: 'weaknesses', label: this._TranslateService.instant('RISK_MANAGMENT.CONTEXT_WEAKNESSES'), type: 'description' },
    { key: 'opportunities', label: this._TranslateService.instant('RISK_MANAGMENT.RISK_OPPORTUNITIES'), type: 'description' },
    {
      key: 'discraptionThreats',
      label: this._TranslateService.instant('RISK_MANAGMENT.RISK_THREATS'),
      type: 'description',
    },
  ];
  }

  ngOnInit(): void {
    this.getRiskData();
  }
  icon_Role: string = 'assets/icons/user-icon.svg';

  loadingData: boolean = false;

  idValue: any;
  getRiskData() {
    this.loadingData = true;
    this._ActivatedRoute.parent?.paramMap
      .pipe(
        tap((res) => (this.idValue = res.get('riskID'))),
        switchMap((res) =>
          this._RiskService.getOneRisk(Number(res.get('riskID')))
        )
      )
      .subscribe((res) => {
        this.Data = res.data;
        this.riskTitle = res.data.riskTitle;
        console.log('Risk Data:', this.Data);
        this._LayoutService.breadCrumbLinks.next([
          {
            name: '',
            icon: 'fi fi-rs-home',
            routerLink: '/',
          },
          {
            name: this._TranslateService.instant(
              'BREAD_CRUMB_TITLES.RISK_MANGEMENT'
            ),
            icon: '',
            routerLink: '/gfw-portal/risks-management/risks-list',
          },
          {
            name: this._TranslateService.instant(
              'BREAD_CRUMB_TITLES.RISK_LIST'
            ),
            icon: '',
            routerLink: '/gfw-portal/risks-management/risks-list',
          },
          {
            name: this.riskTitle || '---',
            icon: '',
            routerLink: `/gfw-portal/risks-management/risk/${this.idValue}/overview`,
          },
        ]);
        this._LayoutService.breadCrumbAction.next(null);

        this.loadingData = false;
      });
  }

  riskTitle: string = '-';
  progressValues = [
    {
      value: 20,
      // background: 'linear-gradient(270.07deg, #9FCF82 0.08%, #6EA56E 99.96%)',
      background: 'linear-gradient(0deg, #6EA56E, #6EA56E)',
    },
    {
      value: 20,
      // background: 'linear-gradient(270.07deg, #CBD081 0.08%, #9FCF82 99.96%)',
      background: 'rgba(203, 208, 129, 1)',
    },
    {
      value: 20,
      // background:
      //   'linear-gradient(270.07deg, #E9B07A 0.08%, #E3CB83 44.74%, #D4CE82 99.96%)',
      background: 'rgba(233, 176, 122, 1)',
    },
    {
      value: 20,
      background: 'rgba(205, 104, 89, 0.94)',
      // background: 'linear-gradient(270.07deg, #E7A576 0.08%, #DE7B65 99.96%)',
      transform: 'rotate(-179.96deg)',
    },
    {
      value: 20,
      background: 'rgba(205, 104, 89, 1)',
      // background: 'linear-gradient(270.07deg, #DE7B65 0.08%, #CD6859 99.96%)',
      transform: 'rotate(-179.96deg)',
    },
  ];

  mainInfoEntries: OverviewEntry[] = []

  classificationsEntries: OverviewEntry[] = []

  responsibilitiesEntries: OverviewEntry[] = []
  timelineEntries: OverviewEntry[] = []
  statusAndImplemenationsEntries: OverviewEntry[] = []

  methodologyAndAppetiteEntries: OverviewEntry[] = []
  strategicAnalysis: OverviewEntry[] = []

}
