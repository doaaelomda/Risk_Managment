import { PermissionSystemService } from './../../../../../../apps/gfw-portal/src/app/core/services/permission.service';
import { LayoutService } from './../../../../../../apps/gfw-portal/src/app/core/services/layout.service';
import {
  DatePackerComponent,
  SharedUiComponent,
  TextareaUiComponent,
} from '@gfw/shared-ui';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '@gfw/primeng';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RiskService } from '../../services/risk.service';
import { finalize } from 'rxjs';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { InputTextComponent } from './../../../../../shared/shared-ui/src/lib/input-text/input-text.component';
import { Router } from '@angular/router';
import { validations } from 'libs/shared/shared-ui/src/models/validation.model';
import { TreeSelectUiComponent } from 'libs/shared/shared-ui/src/lib/tree-select/tree-select-ui.component';
import { TreeMultiselectComponent } from 'libs/shared/shared-ui/src/lib/treeMultiselect/treeMultiselect.component';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import {PaginationStateStore} from 'libs/shared/shared-ui/src/services/pagination-state-store';
@Component({
  selector: 'lib-risks',
  imports: [
    CommonModule,
    PrimengModule,
    DeleteConfirmPopupComponent,
    TranslateModule,
    InputTextComponent,
    ReactiveFormsModule,
    DatePackerComponent,
    TextareaUiComponent,
    FormsModule,
    DropdownModule,
    TreeMultiselectComponent,
    NewTableComponent,
  ],
  templateUrl: './risks.component.html',
  styleUrl: './risks.component.css',
})
export class RisksComponent implements OnInit, OnDestroy {
  @ViewChild(SharedUiComponent) sharedUiComp?: SharedUiComponent;





  ngOnDestroy(): void {
    this.sharedUiComp = undefined;
  }
  assets: any;
  validations: validations[] = [
    {
      key: 'required',
      message: 'VALIDATIONS.RISK_TITLE_REQUIRED',
    },
  ];
  validationsDate: validations[] = [
    {
      key: 'required',
      message: 'Identified Date Is Required',
    },
  ];

  validationsStatus: validations[] = [
    {
      key: 'required',
      message: 'Risk Assets Is Required',
    },
  ];
  validationsOrganization: validations[] = [
    {
      key: 'required',
      message: 'Risk Organization Is Required',
    },
  ];
  validationsCode: validations[] = [
    {
      key: 'required',
      message: 'Risk Code Is Required',
    },
  ];
  validationsDes: validations[] = [
    {
      key: 'required',
      message: 'Risk Description Is Required',
    },
  ];

  units: any[] = [];
  constructor(
    private _router: Router,
    private _MessageService: MessageService,
    private _SharedService: SharedService,
    private _RiskService: RiskService,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    public _PermissionSystemService:PermissionSystemService,
    private _PaginationStateStore:PaginationStateStore
  ) {
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
    ]);
    this._LayoutService.breadCrumbAction.next(null);
    this._LayoutService.breadCrumbAction.next(null);
    this.initRiskForm();
    this.itemsMenu = [
      {
        items: [
          {
            label: this._TranslateService.instant('MENU.QUICK_ADD'),
            command: () => {
              this.quickAddVisible = true;
            },
          },
          {
            label: this._TranslateService.instant('MENU.ADD_RISK'),
            command: () => {
              this._router.navigate([
                '/gfw-portal/risks-management/risk-action',
              ]);
            },
          },
        ],
      },
    ];
  }

  itemsMenu: any[] = [];

  loadDelted: boolean = false;
  columnControl: any = {
    type: 'route',
    data: '/gfw-portal/risks-management/risk',
  };

  handleDataTable(event: any) {
    console.log("Paagination Store Data" , this._PaginationStateStore.getPaginationState('RISK'));
    console.log("Event Data Payload Emitter" , event );


    this.data_payload = event;
    if(this._PaginationStateStore.getPaginationState('RISK')){
      this.data_payload.pageNumber = this._PaginationStateStore.getPaginationState('RISK')?.currentPage;
      this.data_payload.pageSize = this._PaginationStateStore.getPaginationState('RISK')?.perPage;
    }
    this.getRiskData(event);
  }

  data_payload: any;

  deleteRisk() {
    if(!this._PermissionSystemService.can('RISKS' , 'RISK' , 'DELETE')) return;
    this.loadDelted = true;
    this._RiskService.deleteRisk(this.current_row_selected).pipe(finalize(()=> this.loadDelted = false)).subscribe((res) => {
      this.loadDelted = false;
      this.getRiskData(this.data_payload);
      this.actionDeleteVisible = false;
      this._MessageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Risk Deleted Successfully !',
      });
    });
  }

  handleShowDelete(event: boolean) {
    console.log('delte emited', event);

    this.actionDeleteVisible = true;
  }

  current_row_selected: any;
  setSelected(event: any) {
    this.current_row_selected = event;
  }

  handleClosedDelete(event: boolean) {
    this.actionDeleteVisible = false;
  }

  ngOnInit(): void {
    this.items = [
      {
        label: this._TranslateService.instant('Items.View_Risk'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._router.navigate([
            '/gfw-portal/risks-management/risk',
            this.current_row_selected,
          ]);
        },
        visible: ()=> this._PermissionSystemService.can('RISKS' , 'RISK' , 'VIEW')
      },
      {
        label: this._TranslateService.instant('Items.Delete_Risk'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.actionDeleteVisible = true;
        },
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'RISK' , 'DELETE')
      },
      {
        label: this._TranslateService.instant('Items.Update_Risk'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this._router.navigate([
            '/gfw-portal/risks-management/risk-action',
            this.current_row_selected,
          ]);
        },
        visible: ()=> this._PermissionSystemService.can('RISKS' , 'RISK' , 'EDIT')
      },
    ];
    this.loadRisk();
  }

  selected_profile_column: number = 0;

  loadRisk() {
    this.assets = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' },
    ];
    this.getLookUpListsData();
  }
  getLookUpListsData() {
    this._RiskService.getAssetsLookUpData().subscribe({
      next: (res: any) => {
        this.assets = res?.data;
      },
    });
    this._RiskService.orgainationalUnitLookUp().subscribe((res: any) => {
      this.units = res?.data;
    });
  }
  actionDeleteVisible: boolean = false;
  items: any[] = [];

  dataTale: any[] = [];
  loading: boolean = true;

  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };

  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }

  getRiskData(payload?: any) {
    this.dataTale = [];
    this.loading = true;
    this._RiskService
      .searchRisks(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: any) => {
          this.dataTale = res?.data?.items;
          this.pageginationObj = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this._SharedService.paginationSubject.next(this.pageginationObj);
          this._PaginationStateStore.setPaginationState('RISK', this.pageginationObj);

          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
        },
      });
  }

  visible: boolean = false;
  quickAddVisible: boolean = false;

  saveQuickAdd() {
    console.log('Saving Quick Add...');
    this.quickAddVisible = false;
  }
  openQuickAddModal() {
    this.quickAddVisible = true;
  }

  closeQuickAddModal() {
    this.quickAddVisible = false;
    this.form.reset();
  }
  initRiskForm(data?: any) {
    this.form = new FormGroup({
      riskTitle: new FormControl(data ? data?.riskTitle : null, [
        Validators.required,
      ]),
      riskCode: new FormControl(data ? data?.riskCode : null, []),
      organizationalUnitIDs: new FormControl(
        data ? data?.organizationalUnits : null
      ),
      identifiedDate: new FormControl(
        data
          ? moment(new Date(data?.identifiedDate)).format('MM-DD-YYYY')
          : null
      ),
      riskDescription: new FormControl(data ? data?.riskDescription : null, []),
      show_asset: new FormControl({ value: true, disabled: false }),
      assets: new FormControl(data ? data?.assets : null),
    });

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
  form!: FormGroup;
  loadingBtn: boolean = false;
  submit() {
    if (this.form.invalid && this._PermissionSystemService.can('RISKS' , 'RISK' , 'ADD')) {
      this.form.markAllAsTouched();
      return;
    }

    this.loadingBtn = true;

    const fullPayload = { ...this.form.value };
    fullPayload.organizationalUnitIDs = Array.isArray(
      fullPayload.organizationalUnitIDs
    )
      ? fullPayload.organizationalUnitIDs.map((ou: any) => ou.id)
      : fullPayload.organizationalUnitIDs
      ? [fullPayload.organizationalUnitIDs.id]
      : [];

    fullPayload.businessEntityCatalogIds = Array.isArray(fullPayload.assets)
      ? fullPayload.assets.map((asset: any) => asset.id)
      : fullPayload.assets
      ? [fullPayload.assets.id]
      : [];

    const payload: any = Object.fromEntries(
      Object.entries(fullPayload).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ''
      )
    );
    payload.identifiedDate = moment(
      new Date(payload.identifiedDate),
      'MM-DD-YYYY'
    )
      .utc(true)
      .toISOString();
    payload.assets = payload['assets']?.map((ass: any) => ass?.id);
    this._RiskService
      .saveRiskData(payload)
      .pipe(finalize(() => (this.loadingBtn = false)))
      .subscribe({
        next: () => {
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Risk saved successfully',
          });
          this.quickAddVisible = false;
          this.getRiskData(this.data_payload);
          this.form.reset();
        },
        error: (err) => {
          const msg = err?.error?.errorMessage ?? 'Network or server error.';
          this._MessageService.add({
            severity: 'error',
            summary: 'Error',
            detail: msg,
            life: 8000,
          });
        },
      });
  }
}
