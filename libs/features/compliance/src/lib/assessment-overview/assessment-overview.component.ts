import { SystemActionsComponent } from './../../../../../shared/shared-ui/src/lib/system-actions/system-actions.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from 'libs/shared/shared-ui/src/lib/tag/tag.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ComplianceAssessmntService } from '../../services/compliance-assessmnt.service';
import { ActivatedRoute } from '@angular/router';
import { ComplianceService } from '../../compliance/compliance.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ImgSystemComponent } from 'libs/shared/shared-ui/src/lib/img-system/img-system.component';

@Component({
  selector: 'lib-assessment-overview',
  imports: [
    CommonModule,
    TagComponent,
    TranslateModule,
    SystemActionsComponent,
    ImgSystemComponent
  ],
  templateUrl: './assessment-overview.component.html',
  styleUrl: './assessment-overview.component.scss',
})
export class AssessmentOverviewComponent {
  infos: any[] = [];
  statuses = [
    {
      name: 'Human Resources',
      value: 20,
      percentage: 0,
      icon: 'fi fi-rr-shopping-bag',
    },
    {
      name: 'Research & Development',
      value: 50,
      percentage: 0,
      icon: 'fi fi-rr-shopping-bag',
    },
    {
      name: 'Human Resources',
      value: 0,
      percentage: 0,
      icon: 'fi fi-rr-shopping-bag',
    },
  ];

  controlStatuses: any[] = [];

  requirementStatus = [
    {
      title: 'Completed',
      name: 'Progress',
      value: 80,
      percentage: 0,
      arrowIco: 'fi fi-rr-arrow-small-up',
      theme: 'green',
    },
  ];
  themeMap: Record<
    string,
    { bg: string; text: string; icon: string; wrapColor: string }
  > = {
    green: {
      bg: '#D1FADF',
      text: '#027A48',
      icon: '#12B76A',
      wrapColor: '#F6FEF9',
    },
    red: {
      bg: '#FEE4E2',
      text: '#B42318',
      icon: '#B42318',
      wrapColor: '#FFFBFA',
    },
    brown: {
      bg: '#FEF0C7',
      text: '#B54708',
      icon: '#B54708',
      wrapColor: '#FFFCF5',
    },
    default: {
      bg: '',
      text: '',
      icon: '',
      wrapColor: '',
    },
  };
  assessmnetId: any;
  dataAssessmnetCompliance: any;
  constructor(
    private _TranslateService: TranslateService,
    private ComplianceAssessmntService: ComplianceAssessmntService,
    private _activeRouter: ActivatedRoute,
    private _complianceService: ComplianceService,
    private _LayoutService: LayoutService
  ) {
    this._activeRouter.parent?.paramMap.subscribe((params) => {
      this.assessmnetId = params.get('id');
      this.ComplianceAssessmntService.getAssessmnetById(
        this.assessmnetId
      ).subscribe({
        next: (res) => {
          this.dataAssessmnetCompliance = res?.data;
          this.handleTranslate();
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
              routerLink: '/gfw-portal/compliance/pending-assessments',
            },
            {
              name: this._TranslateService.instant('TABS.ASSESSMENT'),
              icon: '',
              routerLink: '/gfw-portal/compliance/pending-assessments',
            },
            {
              name: this.dataAssessmnetCompliance?.name ,
              icon: '',
              routerLink: `/gfw-portal/compliance/pending-assessments/${this.assessmnetId}`,
            },
          ]);
        },
      });
    });
  }
  getTheme(theme: string) {
    return this.themeMap[theme] || this.themeMap['default'];
  }
  ngOnInit() {
    this.statuses = this.addPercentageToStatuses(this.statuses);
    this.controlStatuses = this.addPercentageToStatuses(this.controlStatuses);
    this.requirementStatus = this.addPercentageToStatuses(
      this.requirementStatus
    );

    console.log(this.statuses, 'statuses');
  }

  handleTranslate() {
    const assessors = this.dataAssessmnetCompliance.assessors || [];

    const firstTwoAssessors =
      assessors.length > 0
        ? assessors.slice(0, assessors.length)
        : [{ name: '-', img: 'images/avatar.svg' }];

    this.infos = [
      {
        name: 'INFO.NAME',
        value: this.dataAssessmnetCompliance.name,
        type: 'text',
      },
      {
        name: 'INFO.START_DATE',
        value: this.dataAssessmnetCompliance.startDate,
        type: 'date',
      },
      {
        name: 'INFO.EVIDENCE_GATHERING_DUE_DATE',
        value: this.dataAssessmnetCompliance.evidenceGatheringDueDate,
        type: 'date',
      },
      {
        name: 'INFO.STAGE',
        value: this.dataAssessmnetCompliance.complianceAssessmentStageName,
        type: 'text',
      },
      {
        name: 'INFO.EXPECTED_CLOSE_DATE',
        value: this.dataAssessmnetCompliance.expectedCloseDate,
        type: 'date',
      },
      {
        name: 'INFO.CLOSE_DATE',
        value: this.dataAssessmnetCompliance.closeDate,
        type: 'date',
      },
      {
        name: 'INFO.STATUS',
        value:
          this.dataAssessmnetCompliance.complianceAssessmentStatusTypeName ||
          '-',
        type: 'badge',
        colorbadge:
          this.dataAssessmnetCompliance.complianceAssessmentStatusTypeColor,
      },
      {
        name: 'INFO.ASSESSMENT_TYPE',
        value:
          this.dataAssessmnetCompliance.complianceAssessmentScopeTypeName ||
          '-',
        type: 'text',
        colorbadge:
          this.dataAssessmnetCompliance.complianceAssessmentScopeTypeColor ||
          '-',
      },
      {
        name: 'INFO.RESPONSIBLE_ROLE',
        value: this.dataAssessmnetCompliance.responsableRoleName,
        type: 'img',
        img: 'images/avatar.svg',
      },
      {
        name: 'INFO.RESPONSIBLE_USER',
        value: this.dataAssessmnetCompliance.responsableUserName,

        type: 'img',
        img: 'images/avatar.svg',
      },
      ...firstTwoAssessors.map((a: any, index: number) => ({
        name: index === 0 ? 'INFO.ASSESSOR' : '',
        value: a.assessorUserName,
        type: 'images',
        img: a.img || 'images/avatar.svg',
      })),
    ];

    this.infos = this.infos.map((info) => ({
      ...info,
      name: info.name ? this._TranslateService.instant(info.name) : '',
    }));

    this.controlStatuses = [
      {
        title: 'CONTROL_STATUS.COMPLIANCE_STATUS',
        name: 'CONTROL_STATUS.NON_COMPLIANT',
        value: 10,
        percentage: 0,
        arrowIco: 'fi fi-rr-arrow-small-down',
        theme: 'red',
      },
      {
        title: 'CONTROL_STATUS.IMPLEMENTATION_STATUS',
        name: 'CONTROL_STATUS.IN_PROGRESS',
        value: 40,
        percentage: 0,
        arrowIco: 'fi fi-rr-arrow-small-up',
        theme: 'brown',
      },
    ];

    this.controlStatuses = this.controlStatuses.map((status) => ({
      ...status,
      title: this._TranslateService.instant(status.title),
      name: this._TranslateService.instant(status.name),
    }));
  }

  addPercentageToStatuses(statuses: any) {
    const total = statuses.reduce(
      (sum: any, status: any) => sum + status.value,
      0
    );

    return statuses.map((status: any) => {
      const percentage = total > 0 ? (status.value / total) * 100 : 0;
      return {
        ...status,
        percentage: parseFloat(percentage.toFixed(2)),
      };
    });
  }

      hasActions:boolean = true;
  onFoundAction(event:boolean){
    this.hasActions = event;
    console.log('hasActions', this.hasActions);
  }
}
