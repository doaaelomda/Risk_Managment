import { PaginationInterface } from './../../../../../../../../apps/gfw-portal/src/app/core/models/pagination';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import {
  DatePackerComponent,
  DeleteConfirmPopupComponent,
  SharedUiComponent,
  UserDropdownComponent,
} from '@gfw/shared-ui';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import * as moment from 'moment';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { AccessManagementService } from 'libs/features/setting/src/services/access-management.service';
import { MessageService } from 'primeng/api';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { filter, tap } from 'rxjs';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-users-role',
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule,
    TranslateModule,
    DeleteConfirmPopupComponent,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    UiDropdownComponent,
    DatePackerComponent,
    UserDropdownComponent,
    NewTableComponent
  ],
  templateUrl: './users-role.component.html',
  styleUrl: './users-role.component.scss',
})
export class UsersRoleComponent {
  user: any[] = [];
  userTypes: any[] = [
    { name: 'Primary', value: 1 },
    { name: 'Delegated', value: 2 },
  ];
  assigneeUserID: any[] = [];
  constructor(
    private _router: Router,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _sharedService: SharedService,
    private _accessManagementS: AccessManagementService,
    private _activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private _SharedService: SharedService,
    private _RiskService: RiskService,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this._sharedService.getUserLookupData().subscribe((res: any) => {
      this.user = res?.data;
    });
  }
  dataList: any[] = [];

  itemsMenu: any[] = [];
  loadingState: boolean = true;

  defultprofile: any;
  table_name: string = '';
  badge_name: string = '';
  total_items_input: any;
  action_items: any[] = [];
  current_row_selected: any;
  loadDelted: boolean = false;
  actionDeleteVisible: boolean = false;

  handleClosedDelete(event: any) {
    this.actionDeleteVisible = false;
  }

  deleteRole() {}
  selectedUserId: any = '';
  setSelectedRow(event: any) {
    this.selectedUserId = event;
    console.log('role Selected', event);
  }

  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }
  openModal: boolean = false;
  ngOnInit(): void {
    this.table_name = this._TranslateService.instant('SETTING.USERLIST');
    this.badge_name = this._TranslateService.instant('SETTING.USERS');

    this.initResonseActionForm();

    this.itemsMenu = [
      {
        items: [
          {
            label: this._TranslateService.instant('MENU.QUICK_ADD'),
            command: () => {
              this.isEditing = false;
              this.openModle();
            },
          },
          {
            label: this._TranslateService.instant('SETTING.ADD_NEW_USER'),
            command: () => {
              // D:\Bayantouaz\GRCOrbitPlus-FrontEnd\GFW\libs\features\setting\src\lib\access-management\addUserRole\addUserRole.component.ts
              this._router.navigate([
                `/gfw-portal/setting/access-management/addUserRole`,
              ]);
            },
          },
        ],
      },
    ];

    this.action_items = [
      // {
      //   label: this._TranslateService.instant('SETTING.VIEW_USER'),
      //   icon: 'fi fi-rr-eye',
      //   command: () => {},
      // },
      {
        label: this._TranslateService.instant('SETTING.UNASSIGN_USER'),
        icon: 'fi fi-rr-delete-user',
        command: () => {
          this.actionDeleteVisible = true;
        },
        visible: ()=> this._PermissionSystemService.can('ACCESSMANAGEMNET' , 'ROLESUSERS' , 'DELETE')
      },
      {
        label: this._TranslateService.instant('SETTING.UPDATE_USER'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this.isEditing = true;
          this.openModal = true;

          this.setUserData();
          // this._router.navigate(['/gfw-portal/risks-management/risk-action', this.current_row_selected])
        },
        visible: ()=> this._PermissionSystemService.can('ACCESSMANAGEMNET' , 'ROLESUSERS' , 'EDIT')
      },
    ];

    this.getRoleId();
  }

  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };

  getUsersData(event: any) {
    console.log(event, 'event');
    this.getUsersList(this.data_payload);

    //
  }
  getUsersList(payload?:any) {
    this.loadingState = true;
    this.dataList = [];
    this._accessManagementS
      .getSearchUserRole(
        payload,
        this.roleId,
      )
      .subscribe((res) => {
        this.loadingState = false;
        console.log(res, 'users list here');
        this.dataList = res?.data?.items;
        this.pageginationObj = {
          perPage: res?.data?.pageSize,
          currentPage: res?.data?.pageNumber,
          totalItems: res?.data?.totalCount,
          totalPages: res?.data?.totalPages,
        };

        this._SharedService.paginationSubject.next(this.pageginationObj);
        this.total_items_input = this.dataList?.length;
      });
  }

  setUserData() {
    this._accessManagementS
      .getUserData(this.selectedUserId, this.roleId)
      .subscribe((res: any) => {
        const data: any = {
          userType: res?.data?.userRoleTypeId,
          user: res?.data?.id,
        };

        if (res?.data?.expireOn) {
          data.date = res.data.expireOn;
        }
        console.log(res, 'got user');
        this.initResonseActionForm(data);
      });
  }
  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null; // don’t validate if empty

      const date = moment(value, 'MM-DD-YYYY', true); // parse with your format
      if (!date.isValid()) return { invalidDate: true };

      return date.isAfter(moment()) ? null : { notFutureDate: true };
    };
  }
  responseActionForm!: FormGroup;
  initResonseActionForm(data?: any): void {
    this.responseActionForm = new FormGroup({
      userType: new FormControl(data ? data?.userType : null, [
        Validators.required,
      ]),

      user: new FormControl(data ? data?.user : null),

      date: new FormControl(
        data ? moment(new Date(data?.date)).format('MM-DD-YYYY') : null,
        [this.futureDateValidator()]
      ),
    });
  }
  onModalClose() {
    this.responseActionForm.reset();
    this.isEditing = false;
  }
  isDeleting: boolean = false;
  deleteUser() {
    if(!this._PermissionSystemService.can('ACCESSMANAGEMNET' , 'ROLESUSERS' , 'DELETE')) return;
    this.isDeleting = true;
    this._accessManagementS
      .removeUserRole(this.selectedUserId, this.roleId)
      .subscribe({
        next: (res) => {
          this.isDeleting = false;

          this.messageService.add({
            severity: 'success',
            detail: `User unassigned successfully`,
          });
          this.actionDeleteVisible = false;
          this.getUsersList(this.data_payload);
        },
        error: (err) => {
          this.isDeleting = false;
        },
      });
  }
  openModle() {
    this.openModal = true;
  }
  roleId: any = '';

  getRoleId() {
    this._activatedRoute.parent?.paramMap
      .pipe(
        filter((params) => params.has('id')),
        tap((params) => {
          this.roleId = params.get('id');
          this.getRoleData();
          console.log(this.roleId, 'roleId');
        })
      )
      .subscribe();
  }
  isSaving: boolean = false;
  isEditing: boolean = false;
  submit() {

                    // ===== Permissions =====
  const hasPermission = this.isEditing
    ? this._PermissionSystemService.can('ACCESSMANAGEMNET' , 'ROLESUSERS', 'EDIT')
    : this._PermissionSystemService.can('ACCESSMANAGEMNET' , 'ROLESUSERS', 'ADD');

  if (!hasPermission) {
    return;
  }
    this.isSaving = true;
    const msg = this.isEditing ? 'updated' : 'added';
    const data = this.responseActionForm.value;
    this._accessManagementS
      .modifyUserRole(data, this.roleId, this.isEditing)
      .subscribe({
        next: (res) => {
          this.isSaving = false;

          console.log(res, msg);
          this.openModal = false;
          this.onModalClose();

          this.messageService.add({
            severity: 'success',
            detail: `User ${msg} Successfully`,
          });

          this.getUsersList(this.data_payload);
        },
        error: (err) => {
          this.isSaving = false;
        },
      });
  }

  getRoleData() {
    this._accessManagementS.getRole(this.roleId).subscribe((res: any) => {
      console.log(res, 'role data');
      if (res) {
        this._LayoutService.breadCrumbLinks.next([
          {
            name: '',
            icon: 'fi fi-rs-home',
          },
          {
            name: this._TranslateService.instant('USERINFO.Setting'),
            icon: '',
            routerLink:
              '/gfw-portal/setting/access-management/roles&permssions',
          },
          {
            name: this._TranslateService.instant('USERINFO.AccessManagement'),
            icon: '',
            routerLink: '/gfw-portal/setting/access-management',
          },
          {
            name: this._TranslateService.instant(
              'BREAD_CRUMB_TITLES.ROLES_PERMSSIONS'
            ),
            icon: '',
            routerLink: `/gfw-portal/setting/access-management/roles&permssions`,
          },
          {
            name: res['data'].name || '-',
            icon: '',
            routerLink: `/gfw-portal/setting/access-management/roles&permssions/${this.roleId}/overview`,
          },
          {
            name: this._TranslateService.instant(
              'TABS.USERS'
            ),
            icon: '',
          },
        ]);
      }
    });
  }

   columnControl: any = {
    type: 'popup',
    data: '',
  };

  handleDataTable(event: any) {
    this.data_payload = event;
    this.getUsersList(event);
  }

  data_payload: any;

}
