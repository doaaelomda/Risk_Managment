import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextareaUiComponent } from '@gfw/shared-ui';
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
import { ContactService } from '../../services/contact.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { NewTableComponent } from "libs/shared/shared-ui/src/lib/new-table/new-table.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-contact-list',
  imports: [
    CommonModule,
    TranslateModule,
    MenuModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    DialogModule,
    SkeletonModule,
    InputTextComponent,
    TextareaUiComponent,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    FormsModule,
    InputSwitchModule,
    InputNumberComponent,
    NewTableComponent
],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss',
})
export class ContactListComponent {
  constructor(
    private _MessageService: MessageService,
    private _Router: Router,
    private _contactS: ContactService,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _activatedR: ActivatedRoute,
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
  visibleOverview = false;
  loading = false;
  overviewData: any = null;
  FEATURE_NAME = 'CONTACT';
  FEATURE_PLURAL_NAME = 'CONTACTS';
  FEATURE_LIST_NAME = 'CONTACTS_LIST';
  ENTITY_ID_NAME = 'thirdPartyContactID';

  VIEW_ROUTER = '/gfw-portal/third-party/contacts/';
  EDIT_ROUTER = '/gfw-portal/contacts/edit';
  ADD_ROUTER = '/gfw-portal/contacts/add';
  BASE_LIST_ROUTER = '/gfw-portal/third-party/contacts';
  THIRD_PARTY_LIST_ROUTER = '/gfw-portal/third-party/list';

  COLUMNS_ID = 54;
  DATA_VIEW_ID = 54;
  FILTERS_ID = 54;

  // --------------------------
  // Lifecycle
  // --------------------------
  handleBreadCrumb() {
     if(this.thirdPartyId)return
    this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant(
           'THIRD_PARTY.' + this.FEATURE_PLURAL_NAME
        ),
        icon: '',
        routerLink: this.thirdPartyId
          ? this.THIRD_PARTY_LIST_ROUTER
          : this.BASE_LIST_ROUTER,
      },
      {
        name: this._TranslateService.instant(
          'THIRD_PARTY.' + this.FEATURE_LIST_NAME
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
        this.VIEW_ROUTER = `/gfw-portal/third-party/${this.thirdPartyId}/contacts/`;
           this.columnControl = {
            type:'popup',
            data:''
      // type: 'route',
      // data: `/gfw-portal/third-party/${this.thirdPartyId}/contacts/`,
    };
      }

        this.handleBreadCrumb();
    });
    this.items = [
      {
        label: this._TranslateService.instant(
          'THIRD_PARTY.VIEW_' + this.FEATURE_NAME
        ),
        icon: 'fi fi-rr-eye',
        command: () => {
          this.loading=true
          this.visibleOverview=true
          // this._Router.navigate([this.VIEW_ROUTER + this.current_row_selected]);
              this._contactS
      .getContactById(this.current_row_selected)
      .subscribe((res) => {
        this.overviewData = res?.data;
        this.loading=false
      })
        },
        visible: ()=>this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYCONTACT' , 'VIEW')

      },
      {
        label: this._TranslateService.instant(
          'THIRD_PARTY.DELETE_' + this.FEATURE_NAME
        ),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.handleShowDelete(true);
        },
                visible: ()=>this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYCONTACT' , 'DELETE')

      },
      {
        label: this._TranslateService.instant(
          'THIRD_PARTY.UPDATE_' + this.FEATURE_NAME
        ),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this.handleEdit();
        },
                visible: ()=>this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYCONTACT' , 'EDIT')

      },
    ];


    this.initForm();
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
  handleEdit() {
    this._contactS
      .getContactById(this.current_row_selected)
      .subscribe((res) => {
        const contactData = res?.data;
        this.initForm(contactData);
        this.visible_save_dialog = true;
      });
  }
  visible_save_dialog: boolean = false;
  addLoading: boolean = false;
  add() {
    const canAdd = this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYCONTACT' , 'ADD')
    const canEdit = this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYCONTACT' , 'EDIT')
    if(this.current_row_selected && !canEdit)return
    if(!this.current_row_selected && !canAdd)return
    if (this.form.invalid) return;
    this.addLoading = true;
    this.form.get('phone')?.setValue(`${this.form.get('phone')?.value}`);
    this.form.get('mobile')?.setValue(`${this.form.get('mobile')?.value}`);
    this._contactS
      .saveContact(
        this.form.value,
        this.thirdPartyId,
        this.current_row_selected
      )
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
      jobTitle: new FormControl(data?.jobTitle ?? null, Validators.required),
      email: new FormControl(data?.email ?? null, [
        Validators.required,
        Validators.email,
      ]),
      phone: new FormControl(data?.phone ?? null, Validators.required),
      mobile: new FormControl(data?.mobile ?? null, Validators.required),
      isPrimary: new FormControl(data?.isPrimary ?? false),
      notes: new FormControl(data?.notes ?? null, Validators.required),
    });
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

    this._contactS
      .getContactsListSearch(
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
     if(!this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYCONTACT' , 'DELETE')) return;

    this.loadDeleted = true;
    this._contactS
      .deleteContact(this.current_row_selected)
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
