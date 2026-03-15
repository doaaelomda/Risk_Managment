import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RiskService } from '../../services/risk.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { finalize, forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { TextareaUiComponent } from '@gfw/shared-ui';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { SkeletonModule } from 'primeng/skeleton';
import { UserDropdownComponent } from '@gfw/shared-ui';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'lib-new-risk-assessment-action',
  imports: [
    CommonModule,
    TranslateModule,
    DropdownModule,
    InputNumberModule,
    AccordionModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    UiDropdownComponent,
    TextareaUiComponent,
    InputTextComponent,
    SkeletonModule,
    UserDropdownComponent,
    RadioButtonModule,
    InputNumberComponent
  ],
  templateUrl: './new-risk-assessment-action.component.html',
  styleUrl: './new-risk-assessment-action.component.scss',
})
export class NewRiskAssessmentActionComponent implements OnInit {
  constructor(
    private riskService: RiskService,
    private translateService: TranslateService,
    private layoutService: LayoutService,
    private route: ActivatedRoute,
    private _SharedService: SharedService,
    private _MessageService:MessageService,
    private _PermissionSystemService:PermissionSystemService,
    private _Router: Router,
  ) {
    this.initAllForms()
  }


  currentFormulaData: any
  ngOnInit(): void {
    this.getRouteDataIntail();
    this.loadLookupForms();
    if (this.riskAssessmentId) {
      this.riskService.getOneRiskAssessment(
        this.riskAssessmentId,
        this.riskId
      ).subscribe((res: any) => {
        this.currentFormulaData = res?.data?.factors
        this.initAllForms(res?.data)
      })
    }
  }

  initAllForms(data?: any) {
    this.initMainForm(data);
    this.initResposbilityForm(data);
    this.initQualitiveForm(data);
    this.initQuantitiveForm(data);
    this.initEffectivinessForm(data);

  }

  optionsMeasurementBasis: any[] = [
    {
      id: 1,
      label: 'Expert Judgment'
    },
    {
      id: 2,
      label: "Formula Based"
    }
  ]

  effectivinessForm!: FormGroup;

  initEffectivinessForm(data?: any) {
    this.effectivinessForm = new FormGroup({
      controlEffectivenessLevelID: new FormControl(
        data?.controlEffectivenessLevelID ?? null
      ),
      riskMethodologyControlEffectivenessFormulaID: new FormControl(data?.riskMethodologyControlEffectivenessFormulaID ?? null),
      overlapFactor: new FormControl(data?.overlapFactor ?? null),
      controlEvaluationMeasurementBasisID: new FormControl(data?.controlEvaluationMeasurementBasisID ?? 1),
    });
  }

  loadLookupForms() {
    this.riskService.getRiskActionLookupData([18, 17, 14, 15, 16, 5, 7, 72, 206, 237, 236 , 72]).subscribe((res: any) => {
      console.log('response look up ', res?.data);
      this.work_flows = res?.data?.WorkFlow;
      this.AssessmentStatusType = res?.data?.RiskAssessmentType;
      this.EffectivenessLevel = res?.data?.ControlEffectivenessLevel;
      this.methodologies = res?.data?.RiskMethodology;
      this.effectivinessFormula = res?.data?.RiskMethodologyControlEffectivenessFormula;
      this.approaches_list = res?.data?.RiskAssessmentApproach
    })

    this.loadUsers()
  }


  initResposbilityForm(data?: any) {
    this.resposibility_form = new FormGroup({
      approvedByUserID: new FormControl(
        data ? data?.approvedByUserID : null,
        []
      ),
      reviewedByUserID: new FormControl(
        data ? data?.reviewedByUserID : null,
        []
      ),
    });
  }

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
  loadUsers() {
    this._SharedService.getUserLookupData().subscribe((res: any) => {
      this.users = res?.data
    })
  }

  users: any[] = []

  work_flows: any[] = []
  AssessmentStatusType: any[] = []
  EffectivenessLevel: any[] = []
  methodologies: any[] = []
  effectivinessFormula: any[] = []
  approaches_list: any[] = []


  getRouteDataIntail() {
    const riskId = this.route.snapshot.paramMap.get('riskID');
    if (riskId) {
      this.riskId = +riskId;
      this.getRiskData(this.riskId);
    }
    const riskAssessmentId = this.route.snapshot.paramMap.get('assessmentId');
    if (riskAssessmentId) this.riskAssessmentId = +riskAssessmentId;
    this.initBreadCrumb();
  }

  riskId!: number;
  riskAssessmentId!: number;
  riskData: any;
  loading: boolean = true;
  form_main_info!: FormGroup;
  quilitive_form!: FormGroup;
  quantitive_form!: FormGroup;
  resposibility_form!: FormGroup;
  factordata: any[] = [];
  submitting: boolean = false;
  formulaExpression!: string;
  showErrorResponsbility: boolean = false;
  showErrorQualitive: boolean = false;
  nameSubRisk!: string;
  RiskImpact = [];
  formulas: any[] = [];
  RiskLikelihood = [];
  getRiskData(riskId: number) {
    this.riskService
      .getOneRisk(riskId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          console.log('single risk data', res);
          this.riskData = res?.data;
          const MethodId = this.riskData?.riskMethodologyID;
          const ApprochId = this.riskData?.riskAssessmentApproachID;
          if (MethodId && ApprochId == 1) {
            this.getImpactsAndLikelihoods(MethodId)
          } else if (MethodId && (  ApprochId == 3 || ApprochId == 2)) {
            this.getFormulas(MethodId)
          }
        },
      });
  }

  initBreadCrumb() {
    this.layoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this.translateService.instant(
          'BREAD_CRUMB_TITLES.RISK_MANGEMENT'
        ),
        icon: '',
        routerLink: '/gfw-portal/risks-management/risks-list',
      },
      {
        name: this.translateService.instant('BREAD_CRUMB_TITLES.RISK_LIST'),
        icon: '',
        routerLink: '/gfw-portal/risks-management/risks-list',
      },
      {
        name: this.translateService.instant(
          'BREAD_CRUMB_TITLES.Risk_Assessments'
        ),
        icon: '',
        routerLink: `/gfw-portal/risks-management/risk/${this.riskId}/assessments-list`,
      },
      {
        name: this.riskAssessmentId ? 'Update Assessment' : 'Add Assessment',
        icon: '',
      },
    ]);
  }
  back() {
    this._Router.navigate([
      `/gfw-portal/risks-management/risk/${this.riskId}/assessments-list`,
    ]);
  }
  submit() {
    //
    const permission = this.riskAssessmentId ? this._PermissionSystemService.can('RISKS','ASSESSMENTS','EDIT') : this._PermissionSystemService.can('RISKS','ASSESSMENTS','ADD')

    if(!permission) return;

    if (this.form_main_info.invalid || this.cannotProcced()) {
      this.form_main_info.markAllAsTouched();
      return;
    }


    this.submitting = true;
    console.log("factordata", this.factordata);
    const isSemiQuantitive = this.riskData?.riskAssessmentApproachID === 2
    const reformattedFactors = this.factordata.map((factor) => ({
      riskFactorId: factor.riskFactorId,
      value: factor.value,
      ...(isSemiQuantitive ? {riskFactorLevelId: factor.value} :{})
    }));
    console.log("reformattedFactors", reformattedFactors);

    const quantitivePayload = {
      ...this.quantitive_form.value,
      factordata: reformattedFactors,
    };



    if(this.effectivinessForm.get('controlEvaluationMeasurementBasisID')?.value === 2){
      this.effectivinessForm.get('controlEffectivenessLevelID')?.setValue(null);
    }else if(this.effectivinessForm.get('controlEvaluationMeasurementBasisID')?.value === 1){
      this.effectivinessForm.get('riskMethodologyControlEffectivenessFormulaID')?.setValue(null);
      this.effectivinessForm.get('overlapFactor')?.setValue(null);
    }

    const fullPayload = {
      ...this.form_main_info.value,
      ...this.resposibility_form.value,
      ...this.quilitive_form.value,
      ...this.effectivinessForm.value,
      ...quantitivePayload,
    };
    console.log(fullPayload, 'fullPayload');
    const payload: any = Object.fromEntries(
      Object.entries(fullPayload).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ''
      )
    );
    payload['riskID'] = Number(this.riskId);
    // payload['assessmentText'] = payload['riskTitle'];
    console.log('assessmentDate', payload.assessmentDate);

    payload.assessmentDate = moment(payload.assessmentDate, 'MM-DD-YYYY')
      .utc(true)
      .toISOString();
    console.log('assessmentDate', payload.assessmentDate);
    const isUpdate = this.riskAssessmentId;
    const request$ = isUpdate
      ? this.riskService.updateRiskAssesment(Number(isUpdate), payload)
      : this.riskService.saveRiskAssesment(payload);
    request$.pipe(finalize(() => (this.submitting = false))).subscribe({
      next: () => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Risk saved successfully',
        });

        this.back()
      },

    });

  }




  initQuantitiveForm(data?: any) {
    this.quantitive_form = new FormGroup({
      riskMethodologyFormulaID: new FormControl(
        data?.riskMethodologyFormulaID ?? null
      ),
    });



    this.formulaSelectLisner()
  }

  formulaSelectLisner() {
    this.quantitive_form.get("riskMethodologyFormulaID")?.valueChanges.subscribe((val: any) => {
      const formula_data = this.formulas.find((formula: any) => formula?.riskMethodologyFormulaID === val);
      this.formulaExpression = formula_data?.formulaExpression || null;

      if (formula_data) {
        this.getFactors(this.quantitive_form.get('riskMethodologyFormulaID')?.value)
      }
    })
  }

  initMainForm(data: any = {}) {
    this.form_main_info = new FormGroup({
      assessmentCode: new FormControl(data.assessmentCode ?? null, Validators.required),
      assessmentText: new FormControl(data.title ?? null, Validators.required),
      wfid: new FormControl(data.wfid ?? null),
      riskAssessmentTypeID: new FormControl(data.riskAssessmentTypeID ?? null, Validators.required),
      assumptions: new FormControl(data.assumptions ?? null),
      scope: new FormControl(data.scope ?? null),
      contextSummary: new FormControl(data.contextSummary ?? null),

      // riskAssessmentApproachID: new FormControl(null),

      // riskMethodologyID: new FormControl(null),
    });


    // const MethodId = this.form_main_info.get('riskMethodologyID')?.value;
    // const ApprochId = this.form_main_info.get('riskAssessmentApproachID')?.value;
    // if (MethodId && ApprochId == 1) {
    //   this.getImpactsAndLikelihoods(MethodId)
    // } else if (MethodId && ApprochId == 3) {
    //   this.getFormulas(MethodId)
    // }

    // this.methodologyFieldLisner();
    // this.arrocheLisner()
  }

  arrocheLisner() {
    this.form_main_info.get('riskAssessmentApproachID')?.valueChanges.subscribe((val: any) => {
      if (this.form_main_info.get('riskAssessmentApproachID')?.value == 3 || this.form_main_info.get('riskAssessmentApproachID')?.value == 2) {
        this.factordata.map((factor: any) => factor.value = null)
        if (this.form_main_info.get('riskAssessmentApproachID')?.value == 2) {
          this.handledSetFactorsLevevls()
        }

        if (this.form_main_info.get('riskMethodologyID')?.value) {
          this.getFormulas(this.form_main_info.get('riskMethodologyID')?.value);

        }
      }


      this.quantitive_form.reset();
      this.quilitive_form.reset();
    })
  }
  methodologyFieldLisner() {
    this.form_main_info.get('riskMethodologyID')?.valueChanges.subscribe((val: any) => {
      const MethodId = this.form_main_info.get('riskMethodologyID')?.value;
      const ApprochId = this.form_main_info.get('riskAssessmentApproachID')?.value;
      this.quantitive_form.reset();
      this.factordata = []
      if (MethodId && ApprochId == 1) {
        this.getImpactsAndLikelihoods(MethodId)
      } else if ((MethodId && ApprochId == 3) || (MethodId && ApprochId == 2)) {
        this.getFormulas(MethodId);

      }
    })
  }

  getImpactsAndLikelihoods(methodologyId: number) {

    forkJoin([this.riskService.getImpactByMethodology(methodologyId), this.riskService.getLikelihoodsByMethodology(methodologyId)]).subscribe((res: any[]) => {
      this.RiskImpact = res[0];
      this.RiskLikelihood = res[1];
    })
  }


  getFormulas(methodologyId: number) {
    this.riskService.getFormulas(methodologyId).subscribe((res) => {
      this.formulas = res?.data || [];
      const formula_data = this.formulas.find((formula: any) => formula?.riskMethodologyFormulaID === this.quantitive_form.get('riskMethodologyFormulaID')?.value);
      this.formulaExpression = formula_data?.formulaExpression || null;
      console.log("formula_data", formula_data);

      if (formula_data) {
        this.getFactors(this.quantitive_form.get('riskMethodologyFormulaID')?.value)
      }
    });

  }


  getFactors(formulaId: number) {
    this.riskService.getFactorsInputs(formulaId).subscribe((res) => {
      this.factordata = res?.data || [];

      if (this.riskData?.riskAssessmentApproachID === 2) {
        this.handledSetFactorsLevevls();
      }

      const flattenFactors = (data: any[]): any[] => {
        return data.flatMap(item => [
          item,
          ...(item.children?.length ? flattenFactors(item.children) : [])
        ]);
      };

      const flatFormulaData = flattenFactors(this.currentFormulaData || []);

      console.log("flatFormulaData", flatFormulaData);

      const factorValueMap = new Map(
        flatFormulaData.map(f => [f?.riskFactorID, f?.value])
      );

       console.log("factorValueMap", factorValueMap);
      this.factordata = this.factordata.map(factor => ({
        ...factor,
        value: factorValueMap.get(factor.riskFactorId) ?? null
      }));

      console.log("factordata" , this.factordata);

    });
  }




  levelsMap = new Map<number, any[]>();

  handledSetFactorsLevevls() {
    this.factordata.map((factor: any) => {
      this.riskService.getLevelByFactorID(factor?.riskFactorId).subscribe((res: any) => {
        this.levelsMap.set(factor?.riskFactorId, res?.data || []);
      })
    })


    console.log("this.factorData", this.factordata);

  }

  cannotProcced(): boolean {
    const hasFactorData = this.factordata.length
    const hasEmptyFactors = this.factordata.some(f => !f.value)


    return hasFactorData && hasEmptyFactors ? true : false
  }


}
