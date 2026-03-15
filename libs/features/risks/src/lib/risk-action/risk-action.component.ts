import { TreeMultiselectComponent } from './../../../../../shared/shared-ui/src/lib/treeMultiselect/treeMultiselect.component';
/* eslint-disable @nx/enforce-module-boundaries */
import { CommentSectionComponent } from './../../../../../shared/shared-ui/src/lib/comment-section/comment-section.component';
/* eslint-disable @nx/enforce-module-boundaries */
import { TreeSelectUiComponent } from './../../../../../shared/shared-ui/src/lib/tree-select/tree-select-ui.component';
/* eslint-disable @nx/enforce-module-boundaries */
import { UiDropdownComponent } from './../../../../../shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextComponent } from './../../../../../shared/shared-ui/src/lib/input-text/input-text.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { validations } from 'libs/shared/shared-ui/src/models/validation.model';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  AttachUiComponent,
  DatePackerComponent,
  UserDropdownComponent,
  DropdownCheckboxComponent,
  RoleDropdownComponent,
} from '@gfw/shared-ui';
import { TextareaUiComponent } from '../../../../../shared/shared-ui/src/lib/textarea-ui/textarea-ui.component';
import { SwitchUiComponent } from '../../../../../shared/shared-ui/src/lib/switch-ui/switch-ui.component';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';
import { RiskService } from '../../services/risk.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';
import { TooltipModule } from 'primeng/tooltip';
import * as moment from 'moment';
import { RouterLink } from '@angular/router';
import { forkJoin, filter } from 'rxjs';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { MethodologyImpactsService } from '../../services/methodology-impacts.service';
import { MethodologyLikehoodsService } from '../../services/methodology-likehoods.service';
import { CheckboxModule } from 'primeng/checkbox';
import { MethodologyLevelsService } from '../../services/methodology-levels.service';
@Component({
  selector: 'lib-risk-action',
  imports: [
    CommonModule,
    ButtonModule,
    InputTextComponent,
    ReactiveFormsModule,
    UiDropdownComponent,
    DatePackerComponent,
    TextareaUiComponent,
    AccordionModule,
    TranslateModule,
    TooltipModule,
    RouterLink,
    UserDropdownComponent,
    FormsModule,
    RoleDropdownComponent,
    CheckboxModule

  ],
  templateUrl: './risk-action.component.html',
  styleUrl: './risk-action.component.scss',
})
export class RiskActionComponent implements OnInit {
  riskId: any;
  methodologies: any[] = [];
  constructor(
    private _messageService: MessageService,
    private _ActivatedRoute: ActivatedRoute,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _riskService: RiskService,
    private _router: Router,
    private _SharedService: SharedService,
    private _permissionService: PermissionSystemService,
    private _MethodologyImpactsService: MethodologyImpactsService,
    private _MethodologyLikehoodsService: MethodologyLikehoodsService,
    private _MethodologyLevelsService:MethodologyLevelsService
  ) {
    this.initRiskForm();
    this.initWorkFlow();
    this.initResponsibilityForm();
    this.initClassficationForm();
    this.initTimeLinesForm();
    this.initStatusAndImplemenationsForm();
    // this.initCurrentRatingForm();
    // this.initTargetRatingForm();
    // this.initInherentRiskForm();
    // this.initResidualRiskForm();
    this.initMethodologyAndAppetiteForm();
    this.initAttachmentForm();
    this.loadUser();
    // this.initialWorkFlow();
    this.initFormTabs();
    // this.initialOTHER_INFO();

    this._ActivatedRoute.paramMap.subscribe((params) => {
      this.riskId = params.get('id');
      if (this.riskId) {
        this.getLookUpListsData();
        forkJoin([
          this._riskService.getRiskActionLookupData([1]),
          this._riskService.getOneRisk(this.riskId),
        ]).subscribe((res: any[]) => {
          console.log('forkJoin result:', res);
          this.riskDomains = res[0]?.data?.RiskDomain;
          this.sources = res[0]?.data?.RiskSource;
          this.status = res[0]?.data?.RiskRecordStatusType;
          this.riskFrequencies = res[0]?.data?.RiskFrequencyType;

          const riskResponse = res[1];
          const riskData = riskResponse?.data;
          console.log('riskData:', riskData);
          this.initRiskForm({ ...riskData });
          this.initResponsibilityForm(riskData);
          this.initClassficationForm(riskData);
          this.initTimeLinesForm(riskData);
          this.initStatusAndImplemenationsForm(riskData);
          // this.initCurrentRatingForm(riskData);
          // this.initTargetRatingForm(riskData);
          // this.initInherentRiskForm(riskData);
          // this.initResidualRiskForm(riskData);
          this.initMethodologyAndAppetiteForm(riskData);

          // this.initialOTHER_INFO(riskData);
          this.initFormTabs(riskData);
          // this.initialWorkFlow(riskData);
          this.loadRoles();
          this.initAttachmentForm();
        });
      } else {
        this.getLookUpListsData();
        // this.initialOTHER_INFO();
        this.initRiskForm();
        this.initWorkFlow();
        this.initResponsibilityForm();
        this.initClassficationForm();
        this.initTimeLinesForm();
        this.initStatusAndImplemenationsForm();
        // this.initCurrentRatingForm();
        // this.initTargetRatingForm();
        // this.initInherentRiskForm();
        // this.initResidualRiskForm();
        this.initMethodologyAndAppetiteForm();
        this.initAttachmentForm();
        console.log('values', this.form.value);
        this.loadRoles();
      }
    });
    this._LayoutService.breadCrumbTitle.next(
      this._TranslateService.instant('BREAD_CRUMB_TITLES.RISK_MANGEMENT')
    );
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
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.RISK_LIST'),
        icon: '',
        routerLink: '/gfw-portal/risks-management/risks-list',
      },
      {
        name: this.riskId
          ? this._TranslateService.instant('BREAD_CRUMB_TITLES.UPDATE_RISK')
          : this._TranslateService.instant('BREAD_CRUMB_TITLES.ADD_RISK'),
        icon: '',
      },
    ]);

    this._LayoutService.breadCrumbAction.next(null);
  }
  tabs: any;
  ngOnInit() {
    this.tabs = [
      {
        id: 1,
        name: this._TranslateService.instant(
          'RISK_MANAGMENT.CONTEXT_STRENGTHS'
        ),
      },
      {
        id: 2,
        name: this._TranslateService.instant(
          'RISK_MANAGMENT.CONTEXT_WEAKNESSES'
        ),
      },
      {
        id: 3,
        name: this._TranslateService.instant(
          'RISK_MANAGMENT.RISK_OPPORTUNITIES'
        ),
      },
      {
        id: 4,
        name: this._TranslateService.instant('RISK_MANAGMENT.RISK_THREATS'),
      },
    ];

    this.resposibility_form
      .get('managerTeam')
      ?.valueChanges.subscribe((selectedId) => {
        this.onManagerTeamChange(selectedId);
      });
  }

  loadUser() {
    // this._riskService.getUser(this.mangerTeamId).subscribe((res: any) => {
    //   this.mangerUsers = res?.data;
    // });
    this._SharedService.getUserLookupData().subscribe((res: any) => {
      this.mangerUsers = res?.data;
    });
  }

  manger_team: any[] = [];

  loadRoles() {
    this._riskService.getRoles().subscribe((res: any) => {
      this.owners = res?.data;
      this.manger_team = res?.data;
    });
  }

  findNodeById(tree: any[], id: number): any {
    for (const node of tree) {
      if (node.id === id) return node;
      if (node.children?.length) {
        const found = this.findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }
  mangerTeamId: any;
  onManagerTeamChange(selected: any) {
    this.mangerTeamId = selected;
    // this.loadUser()
  }
  mangerTeamArray: any[] = [
    {
      id: 1,
      label: 'mangerTeam 1',
    },
    {
      id: 2,
      label: 'mangerTeam 2',
    },
  ];
  get selectedThreats() {
    const selectedIds = this.OTHER_INFO.get('threatIds')?.value || [];
    return this.Threats?.filter((t) => selectedIds.includes(t?.id)) ?? null;
  }

  get selectedvulnerabilityIds() {
    const selectedvulnerabilityIds =
      this.OTHER_INFO.get('vulnerabilityIds')?.value || [];
    return (
      this.Vulnerability_Attributes?.filter((t: any) =>
        selectedvulnerabilityIds.includes(t?.id)
      ) ?? null
    );
  }

  removeVulnerability(vulnerability: any) {
    const theards = this.OTHER_INFO.get('vulnerabilityIds')?.value;
    console.log('threads values', theards);
    const updated = theards.filter((id: any) => id != vulnerability.id);

    console.log('updated data', updated);

    this.OTHER_INFO.get('vulnerabilityIds')?.setValue(updated);

    this.OTHER_INFO.get('vulnerabilityIds')?.updateValueAndValidity({
      emitEvent: true,
    });
  }

  removethreads(thread: { id: number; label: string }) {
    const theards = this.OTHER_INFO.get('threatIds')?.value;
    console.log('threads values', theards);
    const updated = theards.filter((id: any) => id != thread.id);

    console.log('updated data', updated);

    this.OTHER_INFO.get('threatIds')?.setValue(updated);

    this.OTHER_INFO.get('threatIds')?.updateValueAndValidity({
      emitEvent: true,
    });
  }

  workflowarray: any[] = [];
  mangerUsers: any;
  handleSelectedAttachment(file: File) {
    const attachmentData = {
      title: this.attachment_form.get('title')?.value,
      type: this.attachment_form.get('type')?.value,
      file: file,
    };
    this.selectedAttachmens.push(attachmentData);
    this.attachment_form.reset();
    // console.log('Selected file from risk comp:', this.selectedAttachmens);
  }

  RiskStage: any;
  RiskExistenceStatusType: any;
  AssessmentStatusType: any;
  OrganizationalUnit: any;
  RiskResponseType: any[] = []
  RiskExecutionStatusType: any[] = []
  RiskImpact: any[] = []
  RiskLikelihood: any[] = []
  RiskLevel: any[] = []
  targetRiskLikelihood: any[] = []
  targetRiskImpact: any[] = []
  getLookUpListsData() {
    this._riskService
      .getRiskActionLookupData([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 18, 55, 50, 47, 206, 20, 21
      ])
      .subscribe({
        next: (res: any) => {
          // console.log("res lookup", res );
          this.riskDomains = res?.data?.RiskDomain;
          this.sources = res?.data?.RiskSource;
          this.status = res?.data?.RiskRecordStatusType;
          this.riskFrequencies = res?.data?.RiskFrequencyType;
          this.RiskStage = res?.data?.RiskStage;
          this.RiskExistenceStatusType = res?.data?.RiskExistenceStatusType;
          this.AssessmentStatusType = res?.data?.AssessmentStatusType;
          this.riskCategories = res.data.RiskCategory;
          this.attachment_types = res.data.AssessmentStatusType;
          this.mangerTeamArray = res.data.RoleRiskManger;
          this.workflowarray = res?.data?.WorkFlow;
          this.Attributes = res?.data.Attributy;
          this.Vulnerability_Attributes = res?.data?.Vulnerability;
          this.Threats = res?.data?.Threat;
          this.methodologies = res?.data?.RiskMethodology;
          this.RiskResponseType = res?.data?.RiskResponseType
          this.RiskExecutionStatusType = res?.data?.RiskExecutionStatusType
          this.RiskImpact = res?.data?.RiskImpact
          this.RiskLikelihood = res?.data?.RiskLikelihood
          this.RiskLevel = res?.data?.RiskLevel
          this.targetRiskImpact = res?.data?.TargetRiskImpact
          this.targetRiskLikelihood = res?.data?.TargetRiskLikelihood
          // this.owners = res.data.RoleOwnerManger;
        },
      });
    this._riskService.getAssetsLookUpData().subscribe({
      next: (res: any) => {
        // this.nodes_assets = res?.data;
        this.nodes_assets = this.transformNodes(res?.data);
        console.log('nodes_assets', this.nodes_assets);
        // this.OrganizationalUnit = JSON.parse(JSON.stringify(res))
      },
    });

    this._riskService.orgainationalUnitLookUp().subscribe({
      next: (res: any) => {
        this.OrganizationalUnit = this.transformNodes(res?.data);
        console.log('OrganizationalUnit', this.OrganizationalUnit);
      },
    });
  }

  transformNodes(nodes: any[], parentKey: string = ''): any[] {
    return nodes.map((node, index) => {
      const key = parentKey ? `${parentKey}-${index}` : `${index}`;
      const isLeaf = !node.children || node.children.length === 0;
      return {
        key,
        id: node.id,
        label: node.label,
        children: node.children ? this.transformNodes(node.children, key) : [],
      };
    });
  }
  nodes_assets: any[] = [];

  selectedAttachmens: { title: string; type: any; file: File }[] = [];
  attachment_form!: FormGroup;
  form_tabs!: FormGroup;
  initFormTabs(data?: any) {
    this.form_tabs = new FormGroup({
      strengths: new FormControl(data ? data?.strengths : ''),
      weaknesses: new FormControl(data ? data?.weaknesses : ''),
      opportunities: new FormControl(data ? data?.opportunities : ''),
      discraptionThreats: new FormControl(data ? data?.discraptionThreats : ''),
    });
  }
  activeTab = 1;
  removeAttach(i?: number) {
    if (i !== undefined) {
      this.selectedAttachmens.splice(i, 1);
    } else {
      this.selectedAttachmens.pop();
    }
  }
  initAttachmentForm(data?: any) {
    this.attachment_form = new FormGroup({
      title: new FormControl(null),
      type: new FormControl(null),
    });
  }

  riskFrequencies: any[] = [];
  status: any[] = [];
  sources: any[] = [];
  riskDomains: any[] = [];
  riskCategories: any[] = [];
  units: any[] = [];

  attachment_types: any[] = [
    {
      id: 1,
      label: 'attachment 1',
    },
    {
      id: 2,
      label: 'attachment 2',
    },
    {
      id: 3,
      label: 'attachment 3',
    },
  ];

  assets: any[] = [
    // {
    //   id: 1,
    //   label: 'asset 1'
    // },
    // {
    //   id: 2,
    //   label: 'asset 2'
    // }
  ];

  validations: validations[] = [
    {
      key: 'required',
      message: 'VALIDATIONS.RISK_TITLE_REQUIRED',
    },
  ];
  stage: validations[] = [
    {
      key: 'required',
      message: 'Risk Stage Is Required',
    },
  ];
  nextReviewDate: validations[] = [
    {
      key: 'required',
      message: 'nextReviewDate Is Required',
    },
  ];
  expectedCloseDate: validations[] = [
    {
      key: 'required',
      message: 'expectedCloseDate Is Required',
    },
    {
      key: 'afterIdentified',
      message: 'Expected close date must be after identified date',
    },
  ];
  AttachmentTitle: validations[] = [
    {
      key: 'required',
      message: 'AttachmentTitle Is Required',
    },
  ];
  AttachmentType: validations[] = [
    {
      key: 'required',
      message: 'AttachmentType Is Required',
    },
  ];
  mangerTeam: validations[] = [
    {
      key: 'required',
      message: 'MangerTeam Is Required',
    },
  ];
  MangerUser: validations[] = [
    {
      key: 'required',
      message: 'MangerUser Is Required',
    },
  ];
  validationsDate: validations[] = [
    {
      key: 'required',
      message: 'Identified Date Is Required',
    },
    {
      key: 'maxDate',
      message: 'Date cannot be after today',
    },
  ];

  validationsStatus: validations[] = [
    {
      key: 'required',
      message: 'Risk Title Is Required',
    },
  ];
  validationsCode: validations[] = [
    {
      key: 'required',
      message: 'Risk Code Is Required',
    },
  ];
  validationsDesc: validations[] = [
    {
      key: 'required',
      message: 'Risk Decription Is Required',
    },
  ];
  ownerValidations: validations[] = [
    {
      key: 'required',
      message: 'Risk Owner Is Required',
    },
  ];

  form!: FormGroup;

  findNodesByIds(nodes: any[], ids: number[]): any[] {
    const result: any[] = [];

    function search(node: any) {
      if (ids.includes(node.id)) {
        result.push(node);
      }
      if (node.children) {
        node.children.forEach((child: any) => search(child));
      }
    }

    nodes.forEach((node) => search(node));
    return result;
  }
  initRiskForm(data?: any) {
    let orgIds: any[] = [];
    let orValue: any[] = [];
    let assIds: any[] = [];
    let assValue: any[] = [];
    if (data) {
      orgIds = data.organizationalUnits.map((org: any) => org.id);
      orValue = this.findNodesByIds(this.OrganizationalUnit, orgIds);
      assIds = data.assets.map((ass: any) => ass.id);
      assValue = this.findNodesByIds(this.nodes_assets, assIds);
    }
    this.form = new FormGroup({
      riskTitle: new FormControl(data ? data?.riskTitle : null, [
        Validators.required,
      ]),
      riskCode: new FormControl(data ? data?.riskCode : null, []),
      organizationalUnitIDs: new FormControl(data ? orValue : null),

      riskDescription: new FormControl(data ? data?.riskDescription : null, []),
      // show_asset: new FormControl({ value: true, disabled: true }),
      // assets: new FormControl(data ? assValue : null),
      // riskMethodologyID: new FormControl(data ? data?.riskMethodologyID : null, []),
      externalReference: new FormControl(data?.externalReference ?? null),
      affectedAssetsDescription: new FormControl(
        data?.affectedAssetsDescription ?? null
      ),
    });
    console.log(this.form.value, 'form');

    this.form.get('show_asset')?.valueChanges.subscribe((res: any) => {
      if (this.form.get('show_asset')?.value) {
        this.form.get('assets')?.addValidators([]);
        this.form.get('assets')?.updateValueAndValidity();
      } else {
        this.form.get('assets')?.clearValidators();
        this.form.get('assets')?.updateValueAndValidity();
      }
    });
  }

  resposibility_form!: FormGroup;
  workflow_form!: FormGroup;
  initialWorkFlow(data?: any) {
    this.workflow_form = new FormGroup({
      wfid: new FormControl(data ? data?.wfid : null, []),
    });
  }
  Threats: any[] = [];
  Vulnerability_Attributes: any[] = [];
  Attributes: any[] = [];
  OTHER_INFO!: FormGroup;
  initialOTHER_INFO(data?: any) {
    this.OTHER_INFO = new FormGroup({
      threatIds: new FormControl(data?.threats?.map((t: any) => t.id) ?? null),
      vulnerabilityIds: new FormControl(
        data?.vulnerabilities?.map((v: any) => v.vulnerabilityID) ?? null
      ),
    });
  }

  initResponsibilityForm(data?: any) {
    this.resposibility_form = new FormGroup({
      riskOwnerRolesID: new FormControl(
        data ? data?.riskOwnerRolesID : null,
        []
      ),
      riskManagerUsersID: new FormControl(
        data ? data?.riskManagerUsersID : null
      ),
      riskManagerRolesID: new FormControl(
        data ? data?.riskManagerRolesID : null
      ),
    });

    this.resposibility_form.valueChanges.subscribe((res: any) => {
      this.showErrorResponsbility = this.resposibility_form.invalid;
    });
  }

  classfication_form!: FormGroup;

  initClassficationForm(data?: any) {
    this.classfication_form = new FormGroup({
      riskCategoryID: new FormControl(data ? data?.riskCategoryID : null, []),
      riskDomainID: new FormControl(data ? data?.riskDomainID : null, []),
      riskSourceID: new FormControl(data ? data?.riskSourceID : null, []),
      riskStageID: new FormControl(data ? data?.riskStageID : null, []),
      riskResponseTypeID: new FormControl(
        data ? data?.riskResponseTypeID : null,
        []
      ),
      riskFrequencyTypeID: new FormControl(
        data ? data?.riskFrequencyTypeID : null,
        []
      ),

      // riskExecutionStatusTypeID: new FormControl(
      //   data ? data?.riskExecutionStatusTypeID : null,
      //   []
      // ),
      //  attributyIds: new FormControl(
      //   data?.attributies?.map((a: any) => a.id) ?? null
      // ),
      // riskFrequencyTypeID: new FormControl(
      //   data ? data?.riskFrequencyTypeID : null,
      //   []
      // ),
    });

    this.classfication_form.valueChanges.subscribe((res: any) => {
      if (this.classfication_form.invalid) {
        this.showErrorClassfication = true;
      } else {
        this.showErrorClassfication = false;
      }
    });
  }

  riskCategoryIDValidations: validations[] = [
    {
      key: 'required',
      message: 'Risk Category Is Required',
    },
  ];
  riskDomainIDValidations: validations[] = [
    {
      key: 'required',
      message: 'Risk Domain Is Required',
    },
  ];
  riskSourceIDValidations: validations[] = [
    {
      key: 'required',
      message: 'Risk Source Is Required',
    },
  ];
  riskStatusTypeIDValidations: validations[] = [
    {
      key: 'required',
      message: 'Risk Status Is Required',
    },
  ];
  riskFrequencyTypeIDValidations: validations[] = [
    {
      key: 'required',
      message: 'Risk Frequency Is Required',
    },
  ];

  owners: any;

  timelines_from!: FormGroup;

  initTimeLinesForm(data?: any) {
    this.timelines_from = new FormGroup({
      // riskStageID: new FormControl(data ? data?.riskStageID : null),
      expectedCloseDate: new FormControl(
        data?.expectedCloseDate
          ? moment(new Date(data?.expectedCloseDate)).format('MM-DD-YYYY')
          : null,
        [
          (control) => {
            if (!control.value || !this.form?.get('identifiedDate')?.value)
              return null;

            const expected = moment(control.value, 'MM-DD-YYYY');
            const identified = moment(
              this.form.get('identifiedDate')?.value,
              'MM-DD-YYYY'
            );

            return expected.isBefore(identified)
              ? {
                afterIdentified:
                  'Expected close date must be after identified date',
              }
              : null;
          },
        ]
      ),

      identifiedDate: new FormControl(
        data?.identifiedDate
          ? moment(new Date(data?.identifiedDate)).format('MM-DD-YYYY')
          : null,
        [
          (control) => {
            if (!control.value) return null;
            const selectedDate = moment(control.value, 'MM-DD-YYYY');
            const today = moment().endOf('day');
            return selectedDate.isAfter(today)
              ? { maxDate: 'لا يمكن اختيار تاريخ بعد اليوم' }
              : null;
          },
        ]
      ),
      actualCloseDate: new FormControl(
        data?.actualCloseDate
          ? moment(new Date(data?.actualCloseDate)).format('MM-DD-YYYY')
          : null
      ),

      nextReviewDate: new FormControl(
        data?.nextReviewDate
          ? moment(new Date(data?.nextReviewDate)).format('MM-DD-YYYY')
          : null
      ),
    });
  }

  statusAndImplemenationsForm!: FormGroup;
  initStatusAndImplemenationsForm(data?: any) {
    this.statusAndImplemenationsForm = new FormGroup({
      riskRecordStatusTypeID: new FormControl(
        data?.riskRecordStatusTypeID ?? null
      ),
      riskExistenceStatusTypeID: new FormControl(
        data?.riskExistenceStatusTypeID ?? null
      ),
      riskExecutionStatusTypeID: new FormControl(
        data?.riskExecutionStatusTypeID ?? null
      ),
      wfID: new FormControl(data?.wfID ?? null),
    });
  }

  currentRatingForm!: FormGroup;
  initCurrentRatingForm(data?: any) {
    this.currentRatingForm = new FormGroup({
      riskImpactID: new FormControl(data?.riskImpactID ?? null),
      riskLikelihoodID: new FormControl(data?.riskLikelihoodID ?? null),
      riskLevelID: new FormControl(data?.riskLevelID ?? null),
      riskScore: new FormControl(data?.riskScore ?? null),
    });
  }
  targetRatingForm!: FormGroup;
  initTargetRatingForm(data?: any) {
    this.targetRatingForm = new FormGroup({
      targetRiskImpactID: new FormControl(data?.targetRiskImpactID ?? null),
      targetRiskLikelihoodID: new FormControl(
        data?.targetRiskLikelihoodID ?? null
      ),
      targetRiskLevelID: new FormControl(data?.targetRiskLevelID ?? null),
      targetRiskScore: new FormControl(data?.targetRiskScore ?? null),
    });
  }

  inherentRiskForm!: FormGroup;
  initInherentRiskForm(data?: any) {
    this.inherentRiskForm = new FormGroup({
      inherentRiskImpactID: new FormControl(data?.inherentRiskImpactID ?? null),
      inherentRiskLikelihoodID: new FormControl(
        data?.inherentRiskLikelihoodID ?? null
      ),
      inherentRiskLevelID: new FormControl(data?.inherentRiskLevelID ?? null),
      inherentRiskScore: new FormControl(data?.inherentRiskScore ?? null),
    });
  }

  residualRiskForm!: FormGroup;
  initResidualRiskForm(data?: any) {
    this.residualRiskForm = new FormGroup({
      residualRiskImpactID: new FormControl(data?.residualRiskImpactID ?? null),
      residualRiskLikelihoodID: new FormControl(
        data?.residualRiskLikelihoodID ?? null
      ),
      residualRiskLevelID: new FormControl(data?.residualRiskLevelID ?? null),
      residualRiskScore: new FormControl(data?.residualRiskScore ?? null),
    });
  }

  methodologyAndAppetiteForm!: FormGroup;
  initMethodologyAndAppetiteForm(data?: any) {
    this.methodologyAndAppetiteForm = new FormGroup({
      riskMethodologyID: new FormControl(data?.riskMethodologyID ?? null),
      // riskAppetiteID: new FormControl(
      //   data?.riskAppetiteID ?? null
      // ),
      // riskToleranceID: new FormControl(data?.riskToleranceID ?? null),
    });


    this.methodologyAndAppetiteForm.get('riskMethodologyID')?.valueChanges.subscribe((val: any) => {
      this.handledAssessmentImpactandLikelhoodByMethodologyId(val)
    })
  }




  showErrorClassfication: boolean = false;
  showErrorResponsbility: boolean = false;
  isLoading: boolean = false;
  submit() {
    console.log('main form', this.form.get('organizationalUnitIDs')?.value);

    // ===== Permissions =====
    const hasPermission = this.riskId
      ? this._permissionService.can('RISKS', 'RISK', 'EDIT')
      : this._permissionService.can('RISKS', 'RISK', 'ADD');

    if (!hasPermission) {
      return;
    }

    if (
      this.form.invalid ||
      this.resposibility_form.invalid ||
      this.classfication_form.invalid
    ) {
      this.form.markAllAsTouched();
      this.resposibility_form.markAllAsTouched();
      this.classfication_form.markAllAsTouched();
      this.timelines_from.markAllAsTouched();
      this.attachment_form.markAllAsTouched();
      if (this.resposibility_form.invalid) {
        this.showErrorResponsbility = true;
      }

      if (this.classfication_form.invalid) {
        this.showErrorClassfication = true;
      }
      return;
    }

    console.log('values', this.form.value);
    const fullPayload = {
      ...this.form.value,
      ...this.resposibility_form.value,
      ...this.classfication_form.value,
      ...this.timelines_from.value,
      // ...this.workflow_form.value,
      // ...this.OTHER_INFO.value,
      ...this.form_tabs.value,
      ...this.work_flow_form.value,
      ...this.statusAndImplemenationsForm.value,
      // ...this.currentRatingForm.value,
      // ...this.targetRatingForm.value,
      // ...this.inherentRiskForm.value,
      // ...this.residualRiskForm.value,
      ...this.methodologyAndAppetiteForm.value,
    };
    fullPayload.organizationalUnitIDs = Array.isArray(
      fullPayload.organizationalUnitIDs
    )
      ? fullPayload.organizationalUnitIDs?.map((ou: any) => ou.id)
      : fullPayload.organizationalUnitIDs
        ? [fullPayload.organizationalUnitIDs.id]
        : null;

    fullPayload.businessEntityCatalogIds = Array.isArray(fullPayload.assets)
      ? fullPayload.assets?.map((asset: any) => asset.id)
      : fullPayload.assets
        ? [fullPayload.assets.id]
        : null;

    ['identifiedDate', 'expectedCloseDate', 'nextReviewDate', 'actualCloseDate'].forEach((key) => {
      if (fullPayload[key]) {
        fullPayload[key] = moment(fullPayload[key], 'MM-DD-YYYY')
          .utc(true)
          .toISOString();
      }
    });

    const payload: any = Object.fromEntries(
      Object.entries(fullPayload).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ''
      )
    );
    payload.assets = payload['assets']?.map((ass: any) => ass?.id);
    this.isLoading = true;

    console.log('payload sent to API', payload);
    const isUpdate = this.riskId;
    const request$ = isUpdate
      ? this._riskService.updateRiskData(isUpdate, payload)
      : this._riskService.saveRiskData(payload);
    request$.subscribe({
      next: (res) => {
        this._messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: isUpdate
            ? 'Risk updated successfully'
            : 'Risk saved successfully',
        });
        this.isLoading = false;
        this._router.navigate(['/gfw-portal/risks-management/risks-list']);
      },

      error: (err) => {
        this.isLoading = false;
      },
      complete: () => (this.isLoading = false),
    });
  }

  // handled work flow

  work_flow_form!: FormGroup;

  initWorkFlow() {
    this.work_flow_form = new FormGroup({
      workflow: new FormControl(null),
    });
  }

  assessmentState: any = {
  1: this.createEmptyAssessmentState(), // Inherent
  2: this.createEmptyAssessmentState(), // Residual
  3: this.createEmptyAssessmentState(), // Target
};

createEmptyAssessmentState() {
  return {
    impacts: [],
    likelhoods: [],
    levels: [],
    selectedImpact: null,
    selectedLikehood: null,
    riskScore: 0,
    currentLevelIndex: null
  };
}
handledAssessmentImpactandLikelhoodByMethodologyId(methodologyID: any) {

  forkJoin([
    this._MethodologyLikehoodsService.findAll(
      { pageNumber: 1, dataViewId: 90, pageSize: 100 },
      { riskMethodologyID: methodologyID }
    ),
    this._MethodologyImpactsService.findAll(
      { pageNumber: 1, dataViewId: 90, pageSize: 100 },
      { riskMethodologyID: methodologyID }
    ),
    this._MethodologyLevelsService.findAll(
      { pageNumber: 1, dataViewId: 90, pageSize: 100 },
      { riskMethodologyID: methodologyID }
    )
  ]).subscribe((res: any[]) => {

    const likelhoods = res[0]?.data?.items?.map((el: any) => ({ ...el, selected: false }));
    const impacts = res[1]?.data?.items?.map((el: any) => ({ ...el, selected: false }));
    const levels = res[2]?.data?.items;

    // نوزع نفس الداتا على كل التابات
    Object.keys(this.assessmentState).forEach(tab => {
      this.assessmentState[tab] = {
        ...this.createEmptyAssessmentState(),
        likelhoods: structuredClone(likelhoods),
        impacts: structuredClone(impacts),
        levels: structuredClone(levels)
      };
    });

  });
}





  assessmentTypesTabs: any[] = [
    {
      id: 1,
      name: "RISK_VIEW.INHERATE_RISK"
    },
    {
      id: 2,
      name: "RISK_VIEW.RASUAL_RISK"
    },
    {
      id: 3,
      name: "RISK_VIEW.TARGET_RISK"
    }
  ]

  active_tab_assessment: any = this.assessmentTypesTabs[0]?.id;

handleSelectedImpact(impact: any) {
  const state = this.assessmentState[this.active_tab_assessment];

  state.impacts.forEach((el: any) => el.selected = false);
  impact.selected = true;

  state.selectedImpact = impact;
  this.calculateRisk();
}

handleSelectedLikelhood(likehood: any) {
  const state = this.assessmentState[this.active_tab_assessment];

  state.likelhoods.forEach((el: any) => el.selected = false);
  likehood.selected = true;

  state.selectedLikehood = likehood;
  this.calculateRisk();
}

  current_selected_impact:any;
  current_selected_likehood :any;


  riskScore:any = 0;
  currentLevelIndex :any = null;
calculateRisk() {
  const state = this.assessmentState[this.active_tab_assessment];

  if (!state.selectedImpact || !state.selectedLikehood) return;

  state.riskScore =
    state.selectedImpact.weight *
    state.selectedLikehood.weight;

  this.detectRiskLevel();
}


detectRiskLevel() {
  const state = this.assessmentState[this.active_tab_assessment];
  if (state.riskScore == null) return;

  const index = state.levels.findIndex((level: any) =>
    state.riskScore >= level.fromWeight &&
    state.riskScore <= level.toWeight
  );

  state.currentLevelIndex = index !== -1 ? index : null;
}
getArrowLeftPercent(): number {
  const state = this.assessmentState[this.active_tab_assessment];

  if (state.currentLevelIndex === null || !state.levels?.length) {
    return 0;
  }

  return ((state.currentLevelIndex + 0.5) / state.levels.length) * 100;
}
}
