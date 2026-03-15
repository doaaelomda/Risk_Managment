/* eslint-disable @nx/enforce-module-boundaries */
import { InputNumberComponent } from './../../../../../shared/shared-ui/src/lib/input-number/input-number.component';
/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { validations } from 'libs/shared/shared-ui/src/models/validation.model';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { AttachUiComponent, TextareaUiComponent } from '@gfw/shared-ui';
import { DatePackerComponent } from '@gfw/shared-ui';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RiskService } from '../../services/risk.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ActivatedRoute } from '@angular/router';
import { filter, finalize, forkJoin, Subscription, switchMap, tap } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
@Component({
  selector: 'lib-risk-assessment-action',
  imports: [
    CommonModule,
    SkeletonModule,
    ButtonModule,
    AccordionModule,
    DatePackerComponent,
    DropdownModule,
    TextareaUiComponent,
    InputTextComponent,
    TranslateModule,
    UiDropdownComponent,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
  ],
  templateUrl: './risk-assessment-action.component.html',
  styleUrl: './risk-assessment-action.component.scss',
})
export class RiskAssessmentActionComponent implements OnInit {
  RiskAssessId: any;
  riskIdForRouting: string | null = null;
  nameSubRisk: any;
  constructor(
    private _MessageService: MessageService,
    private _ActivatedRoute: ActivatedRoute,
    private _RiskService: RiskService,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _Router: Router,
    private _sharedS: SharedService
  ) {
    this._LayoutService.breadCrumbAction.next(null);
    this._LayoutService.breadCrumbTitle.next(
      this._TranslateService.instant('BREAD_CRUMB_TITLES.RISK_MANGEMENT')
    );
    this._ActivatedRoute.paramMap.subscribe((params) => {
      if (params.get('riskID') && params.get('assessmentId')) {
        this.current_risk_id = params.get('riskID');
        this.RiskAssessId = params.get('assessmentId');
        this._RiskService
          .getOneRisk(Number(params.get('riskID')))
          .subscribe((res) => {
            console.log('single risk data', res);
            this.current_risk_data = res?.data;
            this.loading_data = false;
          });

        forkJoin([
          this._RiskService.getRiskActionLookupData([18, 17, 14, 15, 16, 5, 7, 72, 206, 236, 237]),
          this._RiskService.getOneRiskAssessment(
            Number(params.get('assessmentId')),
            Number(params.get('riskID'))
          ),
        ]).subscribe((res: any[]) => {
          console.log('res all ', res);
          this.methodologies = res[0]?.data?.RiskMethodology;
          this.work_flows = res[0]?.data?.WorkFlow;
          this.nameSubRisk = res[1].data.title;
          this.AssessmentStatusType = res[0]?.data?.RiskAssessmentStatusType;
          this.EffectivenessLevel = res[0]?.data?.ControlEffectivenessLevel;
          this.effectivinessFormula = res[0]?.data?.RiskMethodologyControlEffectivenessFormula
          this.approaches_list = res[0]?.data?.RiskAssessmentApproach


          this.initMainForm(res[1]?.data);
          this.initResposbilityForm(res[1]?.data);
          this.initQualitiveForm(res[1]?.data);
          this.initQuantitiveForm(res[1]?.data);
          this.checkQuantityForm()
        });
      } else {
        this.current_risk_id = params.get('riskID');
        this._RiskService
          .getOneRisk(Number(params.get('riskID')))
          .subscribe((res) => {
            console.log('single risk data', res);
            this.current_risk_data = res?.data;
            this.loading_data = false;
          });
        this.initLookUpData();

      }
    });

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
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.Risk_Assessments'
        ),
        icon: '',
        routerLink: `/gfw-portal/risks-management/risk/${this.current_risk_id}/assessments-list`,
      },
      {
        name: this.RiskAssessId ? 'Update Assessment' : 'Add Assessment',
        icon: '',
      },
    ]);
    this._LayoutService.breadCrumbAction.next(null);
  }

  onMethodologyChange() {
    this.form_main_info
      .get('riskMethodologyID')
      ?.valueChanges.subscribe((id) => {
        if (!id) {
          this.resetMethodologyRelatedInputs();
          return;
        }
        this.getLevelsAndLikelihoods(id);
      });
  }

  resetMethodologyRelatedInputs() {
    this.RiskImpact = [];
    this.RiskLikelihood = [];
    this.formulaExpression = '';
    this.factordata = [];
    this.quantitive_form.get('riskMethodologyFormulaID')?.reset();
  }

  getLevelsAndLikelihoods(methodologyId: number) {
    this._RiskService.getImpactByMethodology(methodologyId).subscribe((res) => {
      this.RiskImpact = res;
    });

    this._RiskService
      .getLikelihoodsByMethodology(methodologyId)
      .subscribe((res) => {
        this.RiskLikelihood = res;
      });
  }

  loading_data: boolean = false;
  current_risk_data: any;

  current_risk_id: any;

  RiskImpact: any;
  RiskLikelihood: any;
  work_flows: any[] = [];
  Type: any[] = [
    // {
    //   id:1,
    //   label:'workflow 1',
    // },
    // {
    //   id:2,
    //   label:'workflow 2',
    // },
    // {
    //   id:3,
    //   label:'workflow 3',
    // }
  ];
  EffectivenessLevel: any[] = [
    // {
    //   id:1,
    //   label:'EffectivenessLevel 1',
    // },
    // {
    //   id:2,
    //   label:'EffectivenessLevel 2',
    // },
    // {
    //   id:3,
    //   label:'EffectivenessLevel 3',
    // }
  ];

  AssessmentStatusType: any[] = [
    // {
    //   id:1,
    //   label:'AssessmentStatus 1',
    // },
    // {
    //   id:2,
    //   label:'AssessmentStatus 2',
    // },
    // {
    //   id:3,
    //   label:'AssessmentStatus 3',
    // }
  ];

  form_main_info!: FormGroup;
  resposibility_form!: FormGroup;
  quilitive_form!: FormGroup;
  quantitive_form!: FormGroup;

  validationsCode: validations[] = [
    {
      key: 'required',
      message: 'Assessment Code Is Requirednn',
    },
  ];
  validationsTitle: validations[] = [
    {
      key: 'required',
      message: 'VALIDATIONS.RISKASS_REQUIRED',
    },
  ];
  validationsWF: validations[] = [
    {
      key: 'required',
      message: 'Assessment Work Flow Is Required',
    },
  ];
  validationsDes: validations[] = [
    {
      key: 'required',
      message: 'Scope Description Is Required',
    },
  ];
  validationsAssump: validations[] = [
    {
      key: 'required',
      message: 'Assumptions Description Is Required',
    },
  ];

  users: any[] = [
    // {
    //   id: 1,
    //   label: 'user 1',
    // },
    // {
    //   id: 2,
    //   label: 'user 2',
    // },
    // {
    //   id: 3,
    //   label: 'user 3',
    // },
  ];

  ngOnInit(): void {
    this.initMainForm();
    this.initResposbilityForm();
    this.initQualitiveForm();
    this.initQuantitiveForm();
    this.initAttachmentForm();
    this.loadRoles();
    this.checkQuantityForm();
    this.onMethodologyChange();
  }

  effectivinessFormula: any[] = []
  initLookUpData() {
    this._RiskService
      .getRiskActionLookupData([18, 17, 14, 15, 16, 5, 7, 72, 206, 237, 236])
      .subscribe((res: any) => {
        console.log('response look up ', res?.data);
        this.work_flows = res?.data?.WorkFlow;
        this.AssessmentStatusType = res?.data?.RiskAssessmentStatusType;
        this.EffectivenessLevel = res?.data?.ControlEffectivenessLevel;
        this.methodologies = res?.data?.RiskMethodology;
        this.effectivinessFormula = res?.data?.RiskMethodologyControlEffectivenessFormula;
        this.approaches_list = res?.data?.RiskAssessmentApproach
      });
  }

  showErrorResponsbility: boolean = false;
  initResposbilityForm(data?: any) {
    this.resposibility_form = new FormGroup({
      assessedByUserID: new FormControl(
        data?.assessedByUserID ? Number(data?.assessedByUserID) : null,
        []
      ),
      reviewedByUserID: new FormControl(
        data?.assessedByUserID ? Number(data?.reviewedByUserID) : null,
        []
      ),
    });
  }
  loadRoles() {
    this._RiskService.getRoles().subscribe((res: any) => {
      this.Reviwer = res?.data;
      this.users = JSON.parse(JSON.stringify(res?.data));
    });
  }
  Reviwer: any[] = [];
  initQualitiveForm(data?: any) {
    this.quilitive_form = new FormGroup({
      riskImpactID: new FormControl(data ? data?.riskImpactID : null, []),
      riskLikelihoodID: new FormControl(
        data ? data?.riskLikelihoodID : null,
        []
      ),
      justificationRiskImpact: new FormControl(
        data ? data?.justificationRiskImpact : null
      ),
      justificationRiskLikelihood: new FormControl(
        data ? data?.justificationRiskLikelihood : null
      ),
    });
  }
  validationsSummary: validations[] = [
    {
      key: 'required',
      message: 'Context Summary Is Required',
    },
  ];

  approaches_list: any[] = [
  ]
  initMainForm(data: any = {}) {
    this.form_main_info = new FormGroup({
      assessmentCode: new FormControl(data.assessmentCode ?? null),
      assessmentText: new FormControl(data.title ?? null, Validators.required),
      wfid: new FormControl(data.wfid ?? null),
      riskAssessmentTypeID: new FormControl(data.riskAssessmentTypeID ?? null),
      assumptions: new FormControl(data.assumptions ?? null),
      scope: new FormControl(data.scope ?? null),
      contextSummary: new FormControl(data.contextSummary ?? null),
      controlEffectivenessLevelID: new FormControl(
        data.controlEffectivenessLevelID ?? null
      ),
      // assessmentDate: new FormControl(
      //   data.assessmentDate
      //     ? moment(data.assessmentDate).format('MM-DD-YYYY')
      //     : null
      // ),
      riskAssessmentApproachID: new FormControl(null),
      effectivinessFormulaId: new FormControl(null),
      riskMethodologyID: new FormControl(data?.riskMethodologyID ?? null),

    });



    const methodologyId = this.form_main_info.get('riskMethodologyID')?.value

    if (!methodologyId) {
      this.resetMethodologyRelatedInputs();
      return;
    }
    this.getLevelsAndLikelihoods(methodologyId);
  }

  initQuantitiveForm(data?: any) {
    this.quantitive_form = new FormGroup({
      riskMethodologyFormulaID: new FormControl(
        data?.riskMethodologyFormulaID ?? null
      ),
    });
  }
  methodologySub!: Subscription;
  formulaSub!: Subscription;
  formulaExpression: string = '';
  checkQuantityForm() {
    const methodologyControl = this.form_main_info.get('riskMethodologyID');
    const formulaControl = this.quantitive_form.get('riskMethodologyFormulaID');

    if (!methodologyControl || !formulaControl) return;

    this.methodologySub?.unsubscribe();
    this.formulaSub?.unsubscribe();

    this.methodologySub = methodologyControl.valueChanges.subscribe((value) => {
      if (!value) {
        formulaControl.clearValidators();
        this.formulas = [];
      } else {
        formulaControl.setValidators([Validators.required]);
        this.getFormulas(+value);
      }
      formulaControl.updateValueAndValidity();
    });

    this.formulaSub = formulaControl.valueChanges.subscribe((value) => {
      if (!value) {
        this.factordata = [];
        this.formulaExpression = '';
      } else {
        const chosenFormula = this.formulas.find(
          (formula) => formula.riskMethodologyFormulaID === +value
        );
        this.formulaExpression = chosenFormula?.formulaExpression || '';
        this.getFactors(+value);
      }
    });
  }

  ngOnDestroy() {
    this.methodologySub?.unsubscribe();
    this.formulaSub?.unsubscribe();
  }

  emptyFactors() {
    const formulaControl = this.quantitive_form.get('riskMethodologyFormulaID');
    const cannotSave =
      this.factordata.some((factor) => !factor.value) && formulaControl?.value;
    return cannotSave;
  }

  getFormulas(methodologyId: number) {
    this._RiskService.getFormulas(methodologyId).subscribe((res) => {
      console.log(res, 'got formulas');
      this.formulas = res?.data || [];
    });
  }

  getFactors(formulaId: number) {
    this._RiskService.getFactorsInputs(formulaId).subscribe((res) => {
      this.factordata = res?.data || [];
      if (this.form_main_info.get('riskAssessmentApproachID')?.value === 2) {
        this.factordata.map((factor: any) => {
          this._RiskService.getLevelByFactorID(factor?.riskFactorID).subscribe((res: any) => {
            factor.levels = res?.data
          })
        })
      }

      console.log("factordata", this.factordata);

    });
  }

  methodologies: any[] = [];
  formulas: any[] = [];
  factordata: any[] = [];

  isLoading: boolean = false;
  loading: boolean = false;

  validationsAssessmentType: validations[] = [
    {
      key: 'required',
      message: 'Assessment Type is required',
    },
  ];

  validationsRiskImpact: validations[] = [
    {
      key: 'required',
      message: 'Risk Impact is required',
    },
  ];

  validationsRiskLikelihood: validations[] = [
    {
      key: 'required',
      message: 'Risk Likelihood is required',
    },
  ];

  validationsJustificationImpact: validations[] = [
    {
      key: 'required',
      message: 'Justification for Risk Impact is required',
    },
  ];

  validationsJustificationLikelihood: validations[] = [
    {
      key: 'required',
      message: 'Justification for Risk Likelihood is required',
    },
  ];

  validationsExpectedLoss: validations[] = [
    {
      key: 'required',
      message: 'Expected Loss is required',
    },
  ];

  validationsMaxLoss: validations[] = [
    {
      key: 'required',
      message: 'Maximum Loss is required',
    },
  ];

  validationsMostLikelyLoss: validations[] = [
    {
      key: 'required',
      message: 'Most Likely Loss is required',
    },
  ];

  validationsMinLoss: validations[] = [
    {
      key: 'required',
      message: 'Minimum Loss is required',
    },
  ];

  validationsAssessedBy: validations[] = [
    {
      key: 'required',
      message: 'Assessed By is required',
    },
  ];

  validationsReviewedBy: validations[] = [
    {
      key: 'required',
      message: 'Reviewed By is required',
    },
  ];

  validationsAttachmentTitle: validations[] = [
    {
      key: 'required',
      message: 'Attachment Title is required',
    },
  ];

  validationsAttachmentType: validations[] = [
    {
      key: 'required',
      message: 'Attachment Type is required',
    },
  ];

  validations: validations[] = [
    {
      key: 'required',
      message: 'Risk Title Is Required',
    },
  ];
  validationsDate: validations[] = [
    {
      key: 'required',
      message: 'Identified Date Is Required',
    },
  ];

  validationsSelectRisk: validations[] = [
    {
      key: 'required',
      message: 'Select Risk Is Required',
    },
  ];
  validationsStatus: validations[] = [
    {
      key: 'required',
      message: 'Risk Assets Is Required',
    },
  ];
  validationsEffectivenessLevel: validations[] = [
    {
      key: 'required',
      message: 'EffectivenessLevel Is Required',
    },
  ];
  validationsOrganization: validations[] = [
    {
      key: 'required',
      message: 'Risk Organization Is Required',
    },
  ];
  submit() {
    if (this.form_main_info.invalid) {
      this.form_main_info.markAllAsTouched();
      return;
    }

    this.loading = true;
    console.log("factordata", this.factordata);
    const reformattedFactors = this.factordata.map((factor) => ({
      riskFactorId: factor.riskFactorID,
      value: factor.value,
    }));
    console.log("reformattedFactors", reformattedFactors);

    const quantitivePayload = {
      ...this.quantitive_form.value,
      factordata: reformattedFactors,
    };

    const fullPayload = {
      ...this.form_main_info.value,
      ...this.resposibility_form.value,
      ...this.quilitive_form.value,
      ...quantitivePayload,
      ...this.attachment_form.value,
    };
    console.log(fullPayload, 'fullPayload');
    const payload: any = Object.fromEntries(
      Object.entries(fullPayload).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ''
      )
    );
    payload['riskID'] = Number(this.current_risk_id);
    // payload['assessmentText'] = payload['riskTitle'];
    console.log('assessmentDate', payload.assessmentDate);

    payload.assessmentDate = moment(payload.assessmentDate, 'MM-DD-YYYY')
      .utc(true)
      .toISOString();
    console.log('assessmentDate', payload.assessmentDate);
    const isUpdate = this.RiskAssessId;
    const request$ = isUpdate
      ? this._RiskService.updateRiskAssesment(Number(isUpdate), payload)
      : this._RiskService.saveRiskAssesment(payload);
    request$.pipe(finalize(() => (this.loading = false))).subscribe({
      next: () => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Risk saved successfully',
        });
        this.loading = false;
        this._Router.navigate([
          `/gfw-portal/risks-management/risk/${this.current_risk_id}/assessments-list`,
        ]);
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }
  back() {
    this._Router.navigate([
      `/gfw-portal/risks-management/risk/${this.current_risk_id}/assessments-list`,
    ]);
  }
  selectedAttachmens: { title: string; type: any; file: File }[] = [];
  attachment_form!: FormGroup;

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
  attachment_types: any[] = [
    {
      id: 1,
      label: 'Type 1',
    },
    {
      id: 2,
      label: 'Type 2',
    },
    {
      id: 3,
      label: 'Type 3',
    },
  ];
  handleSelectedAttachment(file: File) {
    const attachmentData = {
      title: this.attachment_form.get('title')?.value,
      type: this.attachment_form.get('type')?.value,
      file: file,
    };
    this.selectedAttachmens.push(attachmentData);
    this.attachment_form.reset();
    console.log('Selected file from risk comp:', this.selectedAttachmens);
  }
}

// {
//   "riskID": 0,
//   "assessmentCode": "string",
//   "assessmentText": "string",
//   "riskAssessmentTypeID": 0,
//   "assumptions": "string",
//   "scope": "string",
//   "wfid": 0,
//   "controlEffectivenessLevelID": 0,
//   "assessedByUserID": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//   "reviewedByUserID": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//   "approvedByUserID": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//   "assessmentDate": "2025-07-10T14:09:50.220Z",
//   "riskImpactID": 0,
//   "justificationRiskImpact": "string",
//   "riskLikelihoodID": 0,
//   "justificationRiskLikelihood": "string",
//   "expectedLoss": 0,
//   "maxLoss": 0,
//   "mostLikelyLoss": 0,
//   "minLoss": 0,
//   "contextSummary": "string"
// }
