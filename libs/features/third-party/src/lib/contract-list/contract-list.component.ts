import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TextareaUiComponent,
  DatePackerComponent,
} from '@gfw/shared-ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { finalize } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import * as moment from 'moment';
import { ContractsService } from '../../services/contract.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { NewTableComponent } from "libs/shared/shared-ui/src/lib/new-table/new-table.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-contract-list',
  imports: [
    CommonModule,
    TranslateModule,
    MenuModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    DialogModule,
    SkeletonModule,
    InputTextComponent,
    InputNumberComponent,
    InputSwitchModule,
    TextareaUiComponent,
    ReactiveFormsModule,
    FormsModule,
    DatePackerComponent,
    UiDropdownComponent,
    NewTableComponent
],
  templateUrl: './contract-list.component.html',
  styleUrl: './contract-list.component.scss',
})
export class ContractListComponent implements OnInit {
  constructor(
    private _MessageService: MessageService,
    private _Router: Router,
    private _ContractsService: ContractsService,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _activatedR: ActivatedRoute,
    private _riskS: RiskService,
    public _PermissionSystemService:PermissionSystemService
  ) {}

  // --------------------------
  // Attributes
  // --------------------------
  loadDeleted = false;
  items: any[] = [];
  selected_profile_column = 0;
  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  current_filters: any[] = [];
  sort_data: any;
  loadingTable = true;
  dataTable: any[] = [];
  current_row_selected: any;
  actionDeleteVisible = false;


  FEATURE_NAME = 'CONTRACT';
  FEATURE_PLURAL_NAME = 'CONTRACTS';
  FEATURE_LIST_NAME = 'CONTRACTS_LIST';
  ENTITY_ID_NAME = 'thirdPartyContractID';

  VIEW_ROUTER = '/gfw-portal/third-party/contracts/';
  EDIT_ROUTER = '/gfw-portal/contracts/edit';
  ADD_ROUTER = '/gfw-portal/contracts/add';
  BASE_LIST_ROUTER = '/gfw-portal/third-party/contracts';
  THIRD_PARTY_LIST_ROUTER = '/gfw-portal/third-party/list';

  COLUMNS_ID = 55;
  DATA_VIEW_ID = 55;
  FILTERS_ID = 55;

  // --------------------------
  // Lifecycle
  // --------------------------
  handleBreadCrumb() {
    if (this.thirdPartyId) return;
    this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.THIRD_PARTY'),
        icon: '',
        routerLink: '/gfw-portal/third-party',
      },
      {
        name: this._TranslateService.instant(
          'THIRD_PARTY.' + this.FEATURE_PLURAL_NAME
        ),
        icon: '',
      },
    ]);
  }
  thirdPartyId!: any;
  ngOnInit(): void {
    this._activatedR.parent?.paramMap.subscribe((res) => {
      console.log(res, 'params');
      this.thirdPartyId = res?.get('id');
      if (this.thirdPartyId) {
        this.VIEW_ROUTER = `/gfw-portal/third-party/${this.thirdPartyId}/contracts/`;

   this.columnControl = {
      type: 'route',
      data: `/gfw-portal/third-party/${this.thirdPartyId}/contracts/`,
    };
      }
      this.handleBreadCrumb();
      this.initForm();
      this.getLookUps();
    });
    this.items = [
      {
        label: this._TranslateService.instant(
          'THIRD_PARTY.VIEW_' + this.FEATURE_NAME
        ),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._Router.navigate([this.VIEW_ROUTER + this.current_row_selected]);
        },
        visible: ()=>this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYCONTRACT' , 'VIEW')

      },
      {
        label: this._TranslateService.instant(
          'THIRD_PARTY.DELETE_' + this.FEATURE_NAME
        ),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.handleShowDelete(true);
        },
        visible: ()=>this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYCONTRACT' , 'DELETE')
      },
      {
        label: this._TranslateService.instant(
          'THIRD_PARTY.UPDATE_' + this.FEATURE_NAME
        ),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this.handleEdit();
        },
        visible: ()=>this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYCONTRACT' , 'EDIT')
      },
    ];


  }

  handleEdit() {
    this._ContractsService
      .getContractById(this.current_row_selected)
      .subscribe((res: any) => {
        const contactData = res?.data;
        this.initForm(contactData);
        this.visible_save_dialog = true;
      });
  }
  visible_save_dialog: boolean = false;
  addLoading: boolean = false;
  add() {
    const canAdd = this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYCONTRACT' , 'ADD')
    const canEdit = this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYCONTRACT' , 'EDIT')
    if(this.current_row_selected && !canEdit)return
    if(!this.current_row_selected && !canAdd)return
    if (this.form.invalid) return;
    this.addLoading = true;
    this.form.get('phone')?.setValue(`${this.form.get('phone')?.value}`);
    this.form.get('mobile')?.setValue(`${this.form.get('mobile')?.value}`);
    const formValue = this.form.value;
    if (formValue.startDate) {
      formValue.startDate = moment(formValue.startDate).format('YYYY-MM-DD');
    }
    if (formValue.endDate) {
      formValue.endDate = moment(formValue.endDate).format('YYYY-MM-DD');
    }
    this._ContractsService
      .saveContract(formValue, this.thirdPartyId, this.current_row_selected)
      .subscribe({
        next: (res: any) => {
          this.addLoading = false;
          console.log(res, 'saved');
          const msg = this.current_row_selected ? 'updated' : 'saved';
          const title_case_feature_name = this.FEATURE_NAME.toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          this._MessageService.add({
            severity: 'success',
            detail: `${title_case_feature_name} ${msg} successfully`,
          });
          this.resetForm();
          this.getData(this.data_payload);
        },
        error: (err) => {
          this.addLoading = false;
        },
      });
  }
  resetForm() {
    this.visible_save_dialog = false;
    this.current_row_selected = null;
    this.form.reset();
  }
  form!: FormGroup;
  initForm(data?: any) {
    this.form = new FormGroup({
      name: new FormControl(data?.name ?? null, Validators.required),
      thirdPartyContractStatusTypeID: new FormControl(
        data?.thirdPartyContractStatusTypeID ?? null, Validators.required
      ),
      contractNumber: new FormControl(
        data?.contractNumber ?? null,
        Validators.required
      ),
      startDate: new FormControl(
        data?.startDate ? new Date(data?.startDate) : null,
        Validators.required
      ),
      endDate: new FormControl(
        data?.endDate ? new Date(data?.endDate) : null,
        Validators.required
      ),
      autoRenewal: new FormControl(data?.autoRenewal ?? false),
      terminationNoticeDays: new FormControl(
        data?.terminationNoticeDays ?? null,
        [Validators.required, Validators.min(0)]
      ),
      contractValue: new FormControl(data?.contractValue ?? null, [
        Validators.required,
        Validators.min(0),
      ]),
      currency: new FormControl(data?.currency ?? null, Validators.required),
      notes: new FormControl(data?.notes ?? null),
      thirdPartyID: new FormControl(data?.thirdPartyID ?? null),
    });
  }
  contractStatusList: any[] = [];
  thirdPartiesList: any[] = [];
  getLookUps() {
    this._riskS.getRiskActionLookupData([158, 151]).subscribe((res) => {
      console.log(res, 'got looksups');
      this.contractStatusList = res?.data?.ThirdPartyContractStatusType;
      this.thirdPartiesList = res?.data?.ThirdParty;
    });
  }

  // --------------------------
  // Methods
  // --------------------------

  handleClosedDelete(event?: any) {
    this.actionDeleteVisible = false;
  }

  handleShowDelete(event: boolean) {
    this.actionDeleteVisible = true;
  }

  setSelected(event: any) {
    this.current_row_selected = event;
  }

    handleDataTable(event: any) {
    this.data_payload = event;
    this.getData(event);
  }

  data_payload: any;


  columnControl: any;





  getData(event?: any) {
    this.dataTable = [];
    this.loadingTable = true;
    console.log(this.thirdPartyId, 'this.thirdPartyId');

    this._ContractsService
      .getContractsListSearch(
        event,
        +this.thirdPartyId
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
        },
        error: () => (this.loadingTable = false),
      });
  }

  delete() {
     if(!this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYCONTRACT' , 'DELETE')) return;

    this.loadDeleted = true;
    this._ContractsService
      .deleteContract(this.current_row_selected)
      .pipe(finalize(() => (this.loadDeleted = false)))
      .subscribe(() => {
        const title_case_feature_name = this.FEATURE_NAME.toLowerCase()
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: title_case_feature_name + ' deleted successfully',
        });
        this.getData(this.data_payload);
        this.handleClosedDelete();
      });
  }
}
