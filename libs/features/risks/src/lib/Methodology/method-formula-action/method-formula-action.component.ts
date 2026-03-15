import { Component, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TextareaUiComponent, LoaderComponent } from '@gfw/shared-ui';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { MethodologyFormulaService } from '../../../services/methodology-formula.service';
import { Button } from 'primeng/button';
import { finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-method-formula-action',
  imports: [
    CommonModule,
    InputTextComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TextareaUiComponent,
    UiDropdownComponent,
    Button,
    DialogModule,
    LoaderComponent,
    InputTextModule,
    TooltipModule
  ],
  templateUrl: './method-formula-action.component.html',
  styleUrl: './method-formula-action.component.scss',
})
export class MethodFormulaActionComponent implements OnInit {
  current_update_id: number = 0;
  current_methodology_id!: number;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _sharedS: SharedService,
    private _methodFormulaS: MethodologyFormulaService,
    private messageService: MessageService,
    private router: Router,
    private layout: LayoutService,
    private translate: TranslateService,
    private _PermissionSystemService:PermissionSystemService
  ) {
    //
  }

  ngOnInit(): void {
    console.log(
      " Number(this._ActivatedRoute.snapshot.paramMap.get('id')) ",
      Number(this._ActivatedRoute.snapshot.paramMap.get('id'))
    );

    this.current_methodology_id = Number(
      this._ActivatedRoute.snapshot.paramMap.get('id')
    );
    this.current_update_id =
      Number(this._ActivatedRoute.snapshot.paramMap.get('formula_id')) || 0;
    this.initBreadcrumb();
    this.getLookups();
    this.getFactors();
  }

buildFactorRegex(data: { factorCode: string }[]): RegExp {
  const escapeRegex = (str: string) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Factor codes
  const codes = data.map(item => escapeRegex(item.factorCode)).join('|');

  // Number pattern
  const numberPattern = '\\d+(?:\\.\\d+)?';

  // Operand = factor code or number
  const operand = `(?:${codes}|${numberPattern})`;

  // Parenthesized expression: allow spaces inside parentheses
  const parenExpr = `\\(\\s*${operand}(?:\\s*[+\\-*/%]\\s*${operand})*\\s*\\)`;

  // Term can be operand or parenthesized expression
  const term = `(?:${operand}|${parenExpr})`;

  // Full expression: term followed by zero or more (operator + term)
  const pattern = `^\\s*${term}(?:\\s*[+\\-*/%]\\s*${term})*\\s*$`;

  return new RegExp(pattern);
}



  private initBreadcrumb(): void {
    const containerKey = 'BREAD_CRUMB_TITLES.METHODOLOGY';
    this.setBreadcrumb(containerKey, [
      { nameKey: containerKey },
      {
        nameKey: 'METHODOLOGY.METHODOLOGYS_LIST',
        routerLink: '/gfw-portal/risks-management/methodolgy/list',
      },
      {
        nameKey: 'METHODOLOGY.FORMULAS_LIST',
        routerLink: `/gfw-portal/risks-management/methodolgy/${this.current_methodology_id}/formula`,
      },
      {
        nameKey: this.current_update_id
          ? 'METHODOLOGY.UPDATE_FORMULA'
          : 'METHODOLOGY.ADD_NEW_FORMULA',
      },
    ]);
  }

  private setBreadcrumb(
    titleKey: string,
    links: { nameKey: string; icon?: string; routerLink?: string }[]
  ): void {
    this.layout.breadCrumbTitle.next(this.translate.instant(titleKey));
    const translatedLinks = [
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      ...links.map((link) => ({
        name: this.translate.instant(link.nameKey),
        icon: link.icon ?? '',
        ...(link.routerLink ? { routerLink: link.routerLink } : {}),
      })),
    ];
    this.layout.breadCrumbLinks.next(translatedLinks);
    this.layout.breadCrumbAction.next(null);
  }

  factorValidators: any = '';
  getLookups() {
    this._sharedS.lookUps([12, 72]).subscribe((res) => {
      const data = res?.data;
      this.assessmentTypes = data.RiskAssessmentType;
      this.categories = data.RiskCategory;
    });
  }
  loadingData: boolean = false;
  getFactors() {
    this.loadingData = true;
    this._methodFormulaS
      .getFactors(this.current_methodology_id)
      .pipe(finalize(() => this.handleFormInit()))
      .subscribe((res) => {
        console.log(res, 'got factors');
        this.factors = res?.data;
      });
  }

  handleFormInit() {
    if (!this.current_update_id) {
      this.initFormulaForm();
      this.loadingData = false;

      return;
    }

    this._methodFormulaS.getById(this.current_update_id).subscribe((res) => {
      console.log(res, 'got formula byid');

      this.initFormulaForm(res?.data);
      this.loadingData = false;
    });
  }

  assessmentTypes: any[] = [];
  categories: any[] = [];
  factors: any[] = [];
  methodologies: any[] = [];
  formula_form!: FormGroup;

  initFormulaForm(data?: any) {
    this.factorValidators = this.buildFactorRegex(this.factors);

    this.formula_form = new FormGroup({
      name: new FormControl(data?.name ?? null, Validators.required),
      nameAr: new FormControl(data?.nameAr ?? null, Validators.required),
      description: new FormControl(
        data?.description ?? null,
        Validators.required
      ),
      descriptionAr: new FormControl(
        data?.descriptionAr ?? null,
        Validators.required
      ),
      formulaExpression: new FormControl(
        data?.formulaExpression ?? null,
        Validators.pattern(this.factorValidators)
      ),
      riskAssessmentTypeID: new FormControl(
        data?.riskAssessmentTypeID ?? null,
        Validators.required
      ),
      riskCategoryID: new FormControl(
        data?.riskCategoryID ?? null,
        Validators.required
      ),
      factorId: new FormControl(data?.factorId ?? [], Validators.required),
    });
  }

  expressionExamples = [
    'Factor 1+Factor2/Factor4',
    '(Factor 1+Factor2)*Factor4',
    '(Factor 1+Factor2)*Factor2 + 1',
  ];

  factorIds = new Map();
  handleFactorClick(factor: any) {
    const code = factor?.factorCode;
    const currentExpress = this.formula_form.get('formulaExpression');
    if (!currentExpress) return;

    currentExpress.setValue(
      currentExpress.value ? currentExpress.value + `${code} ` : `${code} `
    );

    if (!this.factorIds.has(code)) {
      this.factorIds.set(code, factor?.riskFactorID);
    }

    const currentValues = this.formula_form.get('factorId')?.value || [];
    const newValues = [...this.factorIds.values()];

    const updatedValues = Array.from(new Set([...currentValues, ...newValues]));

    this.formula_form.get('factorId')?.setValue(updatedValues);

    console.log(updatedValues, 'factorIds');
  }
  isFactorsShowing: boolean = false;

  handleShowFactor() {
    this.isFactorsShowing = true;
  }

  navigateBack() {
    this.router.navigate([
      `/gfw-portal/risks-management/methodolgy/${this.current_methodology_id}/formula`,
    ]);
  }
  submit() {
    const canAdd = this._PermissionSystemService.can('RISKS' , 'RISKASSESSMENTFORMULA' , 'ADD')
    const canEdit = this._PermissionSystemService.can('RISKS' , 'RISKASSESSMENTFORMULA' , 'EDIT')
    if(this.current_update_id && !canEdit)return
    if(!this.current_update_id && !canAdd)return

    const msg = this.current_update_id ? 'updated' : 'added';
    this.loadingBtn = true;
    const payload = {
      ...this.formula_form.value,
      riskMethodologyID: this.current_methodology_id,
    };
    this._methodFormulaS
      .save(payload, this.current_update_id)
      .pipe(finalize(() => (this.loadingBtn = false)))
      .subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            detail: `Formula ${msg} successfully`,
          });
          this.navigateBack();
        },
      });
  }
  loadingBtn: boolean = false;
}
