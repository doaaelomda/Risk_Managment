
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import * as moment from 'moment';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { debounceTime, finalize } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import {
  DatePackerComponent,
  DeleteConfirmPopupComponent,
  TextareaUiComponent,
} from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { IndicatorService } from '../../services/indicator.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { NewTableComponent } from "libs/shared/shared-ui/src/lib/new-table/new-table.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-indicator-measurment',
  imports: [
    CommonModule,
    TranslateModule,
    MenuModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    DialogModule,
    SkeletonModule,
    InputTextComponent,
    ReactiveFormsModule,
    DatePackerComponent,
    UiDropdownComponent,
    TextareaUiComponent,
    NewTableComponent,
  ],
  templateUrl: './indicator-measurment.component.html',
  styleUrl: './indicator-measurment.component.scss',
})
export class IndicatorMeasurmentComponent implements OnInit {
  IndicatorId: any;
  measurementForm!: FormGroup;
  updateMeasurment: boolean = false;
  formulaId: any = '';
  isLoading: boolean = false;
  textFields = [
    {
      name: 'note',
      label: 'measurment.NOTE',
      placeholder: 'measurment.NOTE_PLACEHOLDER',
    },
    {
      name: 'measuredValue',
      label: 'measurment.MEASURED_VALUE',
      placeholder: 'measurment.MEASURED_VALUE',
    },
    {
      name: 'dataSourceName',
      label: 'measurment.DATA_SOURCE_NAME',
      placeholder: 'measurment.DATA_SOURCE_NAME',
    },
  ];
  columnControl: any;
  data_payload: any;
  dropDownFields: any;
  currentStep = 1;
  periodStartDate: any = '';
  periodEndDate: any = '';
  indicatorInputs: any[] = [];
  dynamicForm!: FormGroup;
  evaluationValue: any = '';
  usedExpression: any = '';
  show_action: boolean = false;
  indicatorAggregationPeriodTypeArray: any;
  indicatorMeasurementStatusTypeArray: any;
  ViewIndicatorModal: boolean = false;
  loadDataIndicator: boolean = false;
  validationsRequired: any[] = [
    { key: 'required', message: 'VALIDATIONS.REQUIRED' },
  ];
    steps: any;
  loadDelted: boolean = false;
  items: any[] = [];
  selected_profile_column: number = 0;
  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  current_filters: any[] = [];
  sort_data: any;
  loadingTable: boolean = true;
  dataTable: any[] = [];
  current_row_selected: any;
  actionDeleteVisible: boolean = false;
  IndicatorMeasurmentData: any;
    constructor(
    private _MessageService: MessageService,
    private _IndicatorService: IndicatorService,
    private _SharedService: SharedService,
    private _TranslateService: TranslateService,
    private _ActivatedRoute: ActivatedRoute,
    private _messageService: MessageService,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this._ActivatedRoute?.parent?.paramMap.subscribe((res: any) => {
      this.IndicatorId = res.get('id');
    });
    this.measurmentFormInitial();
    this.loadLookups();
  }

  handleDataTable(event: any) {
    this.data_payload = event;
    this.getmeasurmentsData(event);
  }
  goToStep2() {
    if (this.measurementForm.invalid) {
      this.measurementForm.markAllAsTouched();
      return;
    }
    const formValue = this.measurementForm.value;
    this.periodStartDate = formValue.periodStartDate;
    this.periodEndDate = formValue.periodEndDate;
    this.getIndicatorsInputsDate(this.data_payload);
  }
  getIndicatorsInputsDate(payload:any) {
    this.dataTable = [];
    this.loadingTable = true;
    if (this.IndicatorId) {
      this._IndicatorService
        .getIndicatorsInputsList(
          payload,
          this.IndicatorId
        )
        .subscribe({
          next: (res: any) => {
            const items = res?.data?.items;
            this.indicatorInputs = items;
            this.createDynamicForm(items);
            this.currentStep = 2;
            this.getmeasurmentsData();
          },
          error: () => {
            this.loadingTable = false;
          },
        });
    }
  }
  createDynamicForm(items: any[]) {
    const group: any = {};

    items.forEach((item, index) => {
      group[`Value${index}`] = new FormControl(item.value || null, [
        Validators.pattern(/^\d+$/),
        Validators.required,
      ]);
    });

    this.dynamicForm = new FormGroup(group);
    this.indicatorInputs = items;

    this.handleFormsChanges();
  }
  getValuesArray() {
    if (!this.dynamicForm || !this.indicatorInputs) return [];
    return this.indicatorInputs.map((item, index) => ({
      indicatorInputTypeID: item.indicatorInputTypeID,
      value: +this.dynamicForm.get(`Value${index}`)?.value,
    }));
  }
  handleFormsChanges() {
    this.measurementForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe(() => this.evaluateIfValid());

    this.dynamicForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe(() => this.evaluateIfValid());
  }
  private evaluateIfValid() {
    if (this.measurementForm.invalid || this.dynamicForm.invalid) {
      this.evaluationValue = '';
      this.usedExpression = '';
      return;
    }

    this.evaluate();
  }
  evaluate() {
    if (!this.formulaId) return;
    if (this.measurementForm.invalid || this.dynamicForm.invalid) return;
    const values = this.getValuesArray();
    this._IndicatorService.evaluate(values, this.formulaId).subscribe((res) => {
      console.log(res, 'evaluated');
      this.evaluationValue = res?.data?.evaluatedValue?.toFixed(2);
      this.usedExpression = res?.data?.formulaExpression;
      console.log('fixed:', this.evaluationValue, 'raw', res?.data);
    });
  }
  allowNumbersOnly(event: KeyboardEvent) {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  goToStep1() {
    this.currentStep = 1;
  }
  onModalClose() {
    this.currentStep = 1;
    this.measurementForm.reset();
  }
  handleClosedDelete(event: boolean) {
    this.actionDeleteVisible = false;
  }
  loadLookups() {
    this._SharedService.lookUps([103, 107, 25]).subscribe((res: any) => {
      this.indicatorAggregationPeriodTypeArray =
        res?.data.IndicatorAggregationPeriodType;
      this.indicatorMeasurementStatusTypeArray =
        res?.data.IndicatorMeasurementStatusType;
    });
  }
  ngOnInit(): void {
    this.items = [
      {
        label: this._TranslateService.instant('measurment.VIEW_measurment'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this;
          this.ViewIndicatorModal = true;
          this._IndicatorService
            .getmeasurmentById(this.current_row_selected)
            .subscribe((res: any) => {
              this.IndicatorMeasurmentData = res?.data;
            });
        },
        visible: ()=> this._PermissionSystemService.can('INDICATORS', 'INDICATORSMEASURMENTS', 'VIEW')
      },
      {
        label: this._TranslateService.instant('measurment.DELETE_measurment'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.handleShowDelete(true);
        },
        visible: ()=> this._PermissionSystemService.can('INDICATORS', 'INDICATORSMEASURMENTS', 'DELETE')
      },
      {
        label: this._TranslateService.instant('measurment.UPDATE_measurment'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this.updateMeasurment = true;
          this.show_action = true;
          this._IndicatorService
            .getmeasurmentById(this.current_row_selected)
            .subscribe((res: any) => {
              this.measurmentFormInitial(res?.data);
            });
        },
        visible: ()=> this._PermissionSystemService.can('INDICATORS', 'INDICATORSMEASURMENTS', 'EDIT')
      },
    ];

    this.steps = [
      {
        name: this._TranslateService.instant('INDICATORS.MainInfo'),
        id: 1,
        description: '-',
        icon: 'fi fi-rr-chart-line-up',
        command: () => {
          this.currentStep = 1;
        },
      },
      {
        name: this._TranslateService.instant('INDICATORS.INDICATOR_INPUTS'),
        id: 2,
        description: '-',
        icon: 'fi fi-rr-tools',
        command: () => {
          this.goToStep2();
        },
      },
    ];
  }
  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }
  onViewModalAssets(event?: any) {
    this.ViewIndicatorModal = true;
    this._IndicatorService
      .getmeasurmentById(event?.indicatorMeasurementID)
      .subscribe((res: any) => {
        this.IndicatorMeasurmentData = res?.data;
      });
  }
  handleShowDelete(event: boolean) {
    this.actionDeleteVisible = true;
  }
  setSelected(event: any) {
    console.log("event" , event);

    this.current_row_selected = event;
  }
  getmeasurmentsData(event?: any) {
    this.dataTable = [];
    this.loadingTable = true;
    this._IndicatorService
      .getmeasurmentListNew(event, this.IndicatorId)
      .pipe(finalize(() => (this.loadingTable = false)))
      .subscribe({
        next: (res: any) => {
          const itemWithFormulaId = res?.data?.items?.find(
            (item: any) => item.indicatorFormulaID
          );
          if (itemWithFormulaId) {
            this.formulaId = itemWithFormulaId?.indicatorFormulaID;
          }
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
  deleteMeasurment() {
    if(!this._PermissionSystemService.can('COMPLIANCE' , 'KEYCOMPLIANCEINDICATORSMEASURMENTLIST' , 'DELETE'))
    this.loadDelted = true;
    this._IndicatorService
      .deleteMeasurment(this.current_row_selected)
      .pipe(finalize(() => (this.loadDelted = false)))
      .subscribe((res) => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Measurment Deleted Successfully',
        });
        this.getmeasurmentsData();
        this.handleClosedDelete(false);
      });
  }
  measurmentFormInitial(data?: any) {
    this.measurementForm = new FormGroup({
      periodStartDate: new FormControl(
        data?.periodStartDate
          ? moment(data.periodStartDate).format('MM-DD-YYYY')
          : null,
        [Validators.required]
      ),
      periodEndDate: new FormControl(
        data?.periodEndDate
          ? moment(data.periodEndDate).format('MM-DD-YYYY')
          : null,
        [Validators.required]
      ),

      indicatorAggregationPeriodTypeID: new FormControl(
        data?.indicatorAggregationPeriodTypeID || null,
        [Validators.required]
      ),
      // indicatorMeasurementStatusTypeID: new FormControl(
      //   data?.indicatorMeasurementStatusTypeID || null,
      //   [Validators.required]
      // ),
      dataSourceName: new FormControl(data?.dataSourceName || null, [
        Validators.required,
      ]),
      note: new FormControl(data?.note || null),
    });
  }
  submit() {
    const canAdd = this._PermissionSystemService.can('COMPLIANCE' , 'KEYCOMPLIANCEINDICATORSMEASURMENTLIST' , 'ADD')
    const canEdit = this._PermissionSystemService.can('COMPLIANCE' , 'KEYCOMPLIANCEINDICATORSMEASURMENTLIST' , 'EDIT')
    if(this.updateMeasurment && !canEdit)return
    if(!this.updateMeasurment && !canAdd)return
    if (this.measurementForm.invalid || this.dynamicForm.invalid) {
      this.measurementForm.markAllAsTouched();
      this.dynamicForm.markAllAsTouched();
      return;
    }

    const dynamicValues = this.getValuesArray();
    this.isLoading = true;
    const fullPayload: any = {
      ...this.measurementForm.value,
      values: dynamicValues,
      indicatorID: +this.IndicatorId,
      periodStartDate: this.periodStartDate,
      periodEndDate: this.periodEndDate,
    };

    if (this.updateMeasurment && this.current_row_selected) {
      fullPayload.indicatorMeasurementID = this.current_row_selected;
    }

    ['periodStartDate', 'periodEndDate'].forEach((key) => {
      if (fullPayload[key]) {
        fullPayload[key] = moment(fullPayload[key]).toISOString();
      }
    });

    const payload: any = Object.fromEntries(
      Object.entries(fullPayload).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ''
      )
    );
    const request$ = this.updateMeasurment
      ? this._IndicatorService.updateMeasurmnet(payload)
      : this._IndicatorService.createMeasurmnet(payload);

    request$.subscribe(
      (res) => {
        this.show_action = false;
        this.measurementForm.reset();
        this.isLoading = false;
        this.getmeasurmentsData();
        this._messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.updateMeasurment
            ? 'Measurement updated successfully'
            : 'Measurement saved successfully',
        });
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}
