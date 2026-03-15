import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize, Observable, Subscription } from 'rxjs';
import * as moment from 'moment';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import {
  DeleteConfirmPopupComponent,
  TextareaUiComponent,
  DatePackerComponent,
} from '@gfw/shared-ui';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { IndicatorService } from '../../services/indicator.service';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { SkeletonModule } from 'primeng/skeleton';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'lib-indicator-formula',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    DialogModule,
    DeleteConfirmPopupComponent,
    TextareaUiComponent,
    InputTextComponent,
    DatePackerComponent,
    SkeletonModule,
    NewTableComponent,
    TooltipModule,
  ],
  templateUrl: './indicator-formula.component.html',
  styleUrl: './indicator-formula.component.scss',
})
export class IndicatorFormulaComponent implements OnInit {
  // ======== Variables ======== //
  current_Indicator_data: any;
  indicatorDataSub$!: Subscription;
  breadCrumb: any[] = [];
  items: any[] = [];
  selected_profile_column: number = 0;
  pageginationObj: PaginationInterface = {
    perPage: 0,
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  };
  current_filters: any[] = [];
  sort_data: any;
  loadingTable: boolean = true;
  dataTable: any[] = [];
  current_row_selected: any;
  indicatorFormulaProfiles: newProfile[] = [];
  viewingItem: boolean = false;
  viewed_data: any = '';
  loadingViewedData: boolean = false;
  formulaForm!: FormGroup;
  update_flag: boolean = false;
  formulaActionVisible: boolean = false;
  loadingBtn: boolean = false;
  indicatorID:any
  constructor(
    private _IndicatorService: IndicatorService,
    private _SharedService: SharedService,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _MessageService: MessageService,
    public _PermissionSystemService: PermissionSystemService,
    private route: ActivatedRoute,
    private Router: Router
  ) {
    const module = this.route.parent?.snapshot.paramMap.get('module') ?? '';
     this.indicatorID = this.route.parent?.snapshot.paramMap.get('id') ?? '';
    this.handleBreadCrumb(module);
    // Listen to selected indicator
    this.indicatorDataSub$ = this._IndicatorService.indicarotViwed.subscribe(
      (res) => {
        this.current_Indicator_data = res;
        this.breadCrumb[this.breadCrumb.length - 2].name = res?.code;
      }
    );
  }

  ngOnInit(): void {
    this.initForm();
    this.setupActions();
    this.getFactors()
  }

  handleBreadCrumb(module: string) {
    let listUrl = '/gfw-portal/indicators/KPI';
    switch (module) {
      case 'risks':
        {
          listUrl = '/gfw-portal/risks-management/KRI';
        }
        break;
      case 'compliance':
        {
          listUrl = '/gfw-portal/compliance/KCI';
        }
        break;
      case 'thirdparties':
        {
          listUrl = '/gfw-portal/third-party/KTI';
        }
        break;
      default:
        '/gfw-portal/indicators/KPI';
    }
    this.breadCrumb = [
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      {
        name: this._TranslateService.instant('INDICATORS.INDICATOR'),
        icon: '',
        routerLink: listUrl,
      },
      { name: '-', icon: '' },
      {
        name: this._TranslateService.instant('INDICATORS.FORMULAS'),
        icon: '',
        routerLink: '',
      },
    ];
    this._LayoutService.breadCrumbLinks.next(this.breadCrumb);
  }

  handleViewClick() {
    const indId = this.current_row_selected;
    this.loadingViewedData = true;
    this._IndicatorService.getIndicatorForumlaByID(indId).subscribe((res) => {
      this.loadingViewedData = false;
      const data = res?.data;
      this.viewed_data = data;
    });
    this.viewingItem = true;
  }

  // ======== CRUD Actions ======== //
  setupActions() {
    this.items = [
      {
        label: this._TranslateService.instant('INDICATORS.VIEW_FORMULA'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this.handleViewClick();
        },
        visible: () =>
          this._PermissionSystemService.can(
            'INDICATORS',
            'INDICATORFORMULAS',
            'VIEW'
          ),
      },
      {
        label: this._TranslateService.instant('INDICATORS.UPDATE_FORMULA'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this.update_flag = true;
          this._IndicatorService
            .getIndicatorFormulaByID(this.current_row_selected)
            .subscribe((res: any) => {
              this.initForm(res?.data);
              this.formulaActionVisible = true;
            });
        },
        visible: () =>
          this._PermissionSystemService.can(
            'INDICATORS',
            'INDICATORFORMULAS',
            'EDIT'
          ),
      },
      {
        label: this._TranslateService.instant('INDICATORS.DELETE_FORMULA'),
        icon: 'fi fi-rr-trash',
        command: () => (this.actionDeleteVisible = true),
        visible: () =>
          this._PermissionSystemService.can(
            'INDICATORS',
            'INDICATORFORMULAS',
            'DELETE'
          ),
      },
    ];
  }

  setSelected(event: any) {
    this.current_row_selected = event;
  }

  // ======== Delete ======== //
  actionDeleteVisible: boolean = false;
  loadDeleted: boolean = false;

  handleClosedDelete() {
    this.actionDeleteVisible = false;
  }

  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }

  deleteIndicatorFormula() {
    this.loadDeleted = true;
    this._IndicatorService
      .deleteIndicatorFormula(this.current_row_selected)
      .pipe(finalize(() => (this.loadDeleted = false)))
      .subscribe(() => {
        this.closeDeleteModal();
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Formula Deleted Successfully',
        });
        this.getData(this.data_payload);
      });
  }
  buildFactorRegex(data: { code: string }[]): RegExp {
  const escapeRegex = (str: string) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Factor codes
  const codes = data.map(item => escapeRegex(item.code)).join('|');

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

  factorValidators: RegExp | null = null;
  initForm(data?: any): void {
    const formulaExpressionValidators = this.factorValidators
      ? [Validators.pattern(this.factorValidators)]
      : [];

    this.formulaForm = new FormGroup({
      name: new FormControl(data ? data?.name : null, [
        Validators.required,
        Validators.maxLength(100),
      ]),
      formulaExpression: new FormControl(
        data ? data?.formulaExpression : null,
        formulaExpressionValidators
      ),
      note: new FormControl(data ? data?.note : null, [
        Validators.maxLength(500),
      ]),
      effectiveDateFrom: new FormControl(
        data ? new Date(data?.effectiveDateFrom) : null,
        [Validators.required]
      ),
      effectiveDateTo: new FormControl(
        data ? new Date(data?.effectiveDateTo) : null,
        [Validators.required]
      ),
    });
  }

  submit() {
    const canAdd = this._PermissionSystemService.can(
      'INDICATORS',
      'INDICATORFORMULAS',
      'ADD'
    );
    const canEdit = this._PermissionSystemService.can(
      'INDICATORS',
      'INDICATORFORMULAS',
      'EDIT'
    );
    if (this.update_flag && !canEdit) return;
    if (!this.update_flag && !canAdd) return;
    this.loadingBtn = true;

    const req: any = {
      ...this.formulaForm.value,
      indicatorID: this.current_Indicator_data?.indicatorID,
      effectiveDateFrom: moment(
        this.formulaForm.value.effectiveDateFrom
      ).format('YYYY-MM-DD'),
      effectiveDateTo: moment(this.formulaForm.value.effectiveDateTo).format(
        'YYYY-MM-DD'
      ),
    };

    if (this.update_flag) {
      req.indicatorFormulaID = this.current_row_selected;
    }

    const API$: Observable<any> = this.update_flag
      ? this._IndicatorService.updateIndicatorFormula(req)
      : this._IndicatorService.addIndicatorFormula(req);

    API$.pipe(finalize(() => (this.loadingBtn = false))).subscribe(() => {
      this._MessageService.add({
        severity: 'success',
        summary: 'Success',
        detail: this.update_flag
          ? 'Formula Updated Successfully'
          : 'Formula Added Successfully',
      });
      this.initForm();
      this.update_flag = false;
      this.current_row_selected = null;
      this.getData(this.data_payload);
      this.formulaActionVisible = false;
    });
  }
  columnControl: any = {
    type: 'Popup',
    data: '',
  };
  data_payload: any;
  handleDataTable(event: any) {
    this.data_payload = event;
    this.getData(event);
  }
  getData(payload?: any) {
    this.dataTable = [];
    this.loadingTable = true;

    if (this.current_Indicator_data) {
      this._IndicatorService
        .getIndicatorFormulaList(
          payload,
          this.current_Indicator_data?.indicatorID
        )
        .pipe(finalize(() => (this.loadingTable = false)))
        .subscribe({
          next: (res: any) => {
            this.dataTable = res?.data?.items;
            this.pageginationObj = {
              perPage: res?.data?.pageSize,
              currentPage: res?.data?.pageNumber,
              totalItems: res?.data?.totalCount,
              totalPages: res?.data?.totalPages,
            };
            this._SharedService.paginationSubject.next(this.pageginationObj);
            this.loadingTable = false;
          },
          error: (err: any) => {
            this.loadingTable = false;
          },
        });
    }
  }

  expressionExamples = [
    'Factor 1+Factor2/Factor4',
    '(Factor 1+Factor2)*Factor4',
    '(Factor 1+Factor2)*Factor2 + 1',
  ];
  isFactorsShowing: boolean = false;

  handleShowFactor() {
    this.isFactorsShowing = true;
  }
  navigateBack() {
    this.Router.navigate([
      `/gfw-portal/risks-management/methodolgy/${this.current_row_selected}/formula`,
    ]);
  }
  factorIds = new Map();
  handleFactorClick(factor: any) {
    const code = factor?.code;
    const currentExpress = this.formulaForm.get('formulaExpression');
    if (!currentExpress) return;

    currentExpress.setValue(
      currentExpress.value ? currentExpress.value + `${code} ` : `${code} `
    );

    if (!this.factorIds.has(code)) {
      this.factorIds.set(code, factor?.riskFactorID);
    }

    const currentValues = this.formulaForm.get('factorId')?.value || [];
    const newValues = [...this.factorIds.values()];

    const updatedValues = Array.from(new Set([...currentValues, ...newValues]));

    this.formulaForm.get('factorId')?.setValue(updatedValues);

    console.log(updatedValues, 'factorIds');
  }
  factors: any;
  getFactors() {
    this.loadingViewedData = true;
    this._IndicatorService
      .getIndicatorsInputsList({dataViewId:36 , pageNumber:1,pageSize:100}, this.indicatorID)
      .pipe(finalize(() => this.handleFormInit()))
      .subscribe((res) => {
        this.factors = res?.data?.items;
        this.factorValidators = this.buildFactorRegex(this.factors || []);
        this.formulaForm
          ?.get('formulaExpression')
          ?.setValidators(
            this.factorValidators
              ? [Validators.pattern(this.factorValidators)]
              : []
          );
        this.formulaForm
          ?.get('formulaExpression')
          ?.updateValueAndValidity();
      });
  }

  loadingData: boolean = false;
  handleFormInit() {
    if (!this.current_row_selected) {
      this.initForm();
      this.loadingData = false;

      return;
    }

    this._IndicatorService
      .getIndicatorFormulaByID(this.current_row_selected)
      .subscribe((res) => {
        this.initForm(res?.data);
        this.loadingData = false;
      });
  }
}
