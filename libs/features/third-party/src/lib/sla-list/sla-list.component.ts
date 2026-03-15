import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import * as moment from 'moment';
import { finalize } from 'rxjs';
import { SlaService } from '../../services/sla.service';
import {
  DeleteConfirmPopupComponent,
  TextareaUiComponent,
} from '@gfw/shared-ui';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { NewTableComponent } from "libs/shared/shared-ui/src/lib/new-table/new-table.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-sla-list',
  imports: [
    CommonModule,
    TranslateModule,
    MenuModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    DialogModule,
    SkeletonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextComponent,
    InputNumberComponent,
    TextareaUiComponent,
    UiDropdownComponent,
    NewTableComponent
],
  templateUrl: './sla-list.component.html',
  styleUrl: './sla-list.component.scss',
})
export class SlaListComponent {
  constructor(
    private _MessageService: MessageService,
    private _Router: Router,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _activatedR: ActivatedRoute,
    private _slaS: SlaService,
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
  active_tab: number = 1;
  current_filters: any[] = [];
  sort_data: any;
  loadingTable = true;
  dataTable: any[] = [];
  current_row_selected: any;
  actionDeleteVisible = false;
  isViewPopupVisible: boolean = false;
  data: any;
  FEATURE_NAME = 'SLA';
  FEATURE_PLURAL_NAME = 'SLAS';
  FEATURE_LIST_NAME = 'SLA_LIST';
  ENTITY_ID_NAME = 'thirdPartySLAID';

  VIEW_ROUTER = '/gfw-portal/third-party/sla/';
  EDIT_ROUTER = '/gfw-portal/sla/edit';
  ADD_ROUTER = '/gfw-portal/sla/add';
  BASE_LIST_ROUTER = '/gfw-portal/third-party/SLA';
  THIRD_PARTY_LIST_ROUTER = '/gfw-portal/third-party/list';

  COLUMNS_ID = 58;
  DATA_VIEW_ID = 58;
  FILTERS_ID = 58;

  // --------------------------
  // Lifecycle
  // --------------------------
  thirdPartyId!: any;
  handleBreadCrumb() {
    if(this.thirdPartyId || this.contractId) return
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
  tabs:any
  handleTabs(){
     this.tabs = [
      {
        id: 1,
        name: this._TranslateService.instant('TABS.OVERVIEW'),
        icon: 'fi-rr-apps',
        router: 'overview',
      },
      // {
      //   id: 2,
      //   name: this._TranslateService.instant('TABS.COMMENTS'),
      //   icon: 'fi fi-rr-comment',
      //   router: 'comments',
      // },
      // {
      //   id: 3,
      //   name: this._TranslateService.instant('TABS.ATTACHMENTS'),
      //   icon: 'fi fi-rr-paperclip',
      //   router: 'attachments',
      // },
    ];
  }
  contractId: any;
  ngOnInit(): void {
    this._activatedR.parent?.paramMap.subscribe((res) => {
      console.log(res, 'params');
      this.thirdPartyId = res?.get('thirdPartyId');
      this.contractId = res?.get('contractId');
      if (this.thirdPartyId) {
        this.VIEW_ROUTER = `/gfw-portal/third-party/${this.thirdPartyId}/sla/`;
           this.columnControl = {
      type: 'route',
      data: `/gfw-portal/third-party/${this.thirdPartyId}/sla/`,
    };
      }
      this.handleBreadCrumb();
      this.getData(null);
      this.initForm();
      this.getLookups();
      this.handleTabs()
    });
    this.items = [
      {
        label: this._TranslateService.instant(
          'THIRD_PARTY.VIEW_' + this.FEATURE_NAME
        ),
        icon: 'fi fi-rr-eye',
        command: () => {
          this.openViewDialog()
          // this._Router.navigate([this.VIEW_ROUTER + this.current_row_selected]);
        },
        visible: ()=>this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYCONTRACTSLA' , 'VIEW')

      },
      {
        label: this._TranslateService.instant(
          'THIRD_PARTY.DELETE_' + this.FEATURE_NAME
        ),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.handleShowDelete(true);
        },
            visible: ()=>this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYCONTRACTSLA' , 'DELETE')
      },
      {
        label: this._TranslateService.instant(
          'THIRD_PARTY.UPDATE_' + this.FEATURE_NAME
        ),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this.handleEdit();
        },
            visible: ()=>this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYCONTRACTSLA' , 'EDIT')
      },
    ];


  }

  // --------------------------
  // Methods
  // --------------------------
  contractsList: any[] = [];
  getLookups() {
    this._SharedService.lookUps([157]).subscribe((res) => {
      this.contractsList = res?.data?.ThirdPartyContract;
    });
  }

  handleEdit() {
    this._slaS.getSLAById(this.current_row_selected).subscribe((res) => {
      const contactData = res?.data;
      this.initForm(contactData);
      this.visible_save_dialog = true;
    });
  }
  visible_save_dialog: boolean = false;
  addLoading: boolean = false;
  add() {
    const canAdd = this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYCONTRACTSLA' , 'ADD')
    const canEdit = this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYCONTRACTSLA' , 'EDIT')
    if(this.current_row_selected && !canEdit)return
    if(!this.current_row_selected && !canAdd)return
    if (this.form.invalid) return;
    this.addLoading = true;
    this.form.get('phone')?.setValue(`${this.form.get('phone')?.value}`);
    this.form.get('mobile')?.setValue(`${this.form.get('mobile')?.value}`);
    this._slaS
      .saveSla(this.form.value, this.contractId, this.current_row_selected)
      .subscribe({

        next: (res) => {
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
          this.getData();
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
      metricName: new FormControl(
        data?.metricName ?? null,
        Validators.required
      ),
      targetValue: new FormControl(data?.targetValue ?? null, [
        Validators.required,
        Validators.min(0),
      ]),
      unit: new FormControl(data?.unit ?? null, Validators.required),
      measurementMethod: new FormControl(
        data?.measurementMethod ?? null,
        Validators.required
      ),
      penaltyClause: new FormControl(data?.penaltyClause ?? null),
      thirdPartyContractID: new FormControl(data?.thirdPartyContractID ?? null),
    });
  }
  handleClosedDelete(event?: any) {
    this.actionDeleteVisible = false;
    this.current_row_selected = null
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

    this._slaS
      .getSLAListSearch(
        event,
        +this.thirdPartyId,
        +this.contractId
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
     if(!this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYCONTRACTSLA' , 'DELETE')) return;

    this.loadDeleted = true;
    this._slaS
      .deleteSLA(this.current_row_selected)
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
        this.getData();
        this.handleClosedDelete();
      });
  }

   openViewDialog(): void {
    this.isViewPopupVisible = true;
      this._slaS.getSLAById(this.current_row_selected).subscribe((res) => {
        this.data = res?.data;
        this.isViewPopupVisible = true;
      });}
}
