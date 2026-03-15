import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { Router } from '@angular/router';
import { AccessManagementService } from '../../../services/access-management.service';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { MessageService } from 'primeng/api';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-users-acess-mangment',
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule,
    TranslateModule,
    DeleteConfirmPopupComponent,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    NewTableComponent,
  ],
  templateUrl: './UsersAcessMangment.component.html',
  styleUrl: './UsersAcessMangment.component.css',
})
export class UsersAcessMangmentComponent {
  user: any[] = [];
  NameEnglish: any[] = [];
  assigneeUserID: any[] = [];
  constructor(
    private _router: Router,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _sharedService: SharedService,
    private _AccessManagementService: AccessManagementService,
    private _RiskService: RiskService,
    private messageService: MessageService,
    public _PermissionSystemService: PermissionSystemService
  ) {
    this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.SETTING'),
        icon: '',
        routerLink: '/gfw-portal/setting/access-management/users',
      },
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.Access_Management'
        ),
        icon: '',
        routerLink: '/gfw-portal/setting/access-management/users',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.USERS'),
        icon: '',
      },
    ]);
    this._sharedService.getUserLookupData().subscribe((res: any) => {
      this.user = res?.data;
    });
  }
  dataList: any[] = [];

  columnControl: any = {
    type: 'route',
    data: '/gfw-portal/setting/access-management/users',
  };
  current_payload: any;
  handleDataTable(event: any) {
    this.current_payload = event;
    this.getUsersList(this.current_payload);
  }
  getUsersList(payload: any) {
    this.loadingState = true;
    this.dataList = [];
    this._AccessManagementService
      .getUsersList(null, 1, 10, [], null, true, payload)
      .subscribe((res) => {
        this.loadingState = false;
        console.log(res, 'users list here');
        const data = res?.data?.items;
        this.dataList = data;
        this.pageginationObj = {
          perPage: res?.data?.pageSize,
          currentPage: res?.data?.pageNumber,
          totalItems: res?.data?.totalCount,
          totalPages: res?.data?.totalPages,
        };

        this._sharedService.paginationSubject.next(this.pageginationObj);
        this.total_items_input = this.dataList?.length;
      });
  }
  search: any = '';
  pageNumber: any = 1;
  pageSize: any = 10;
  filters: any = null;
  sort_data: any[] = [];
  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  getUsersData(event: any) {
    console.log(event, 'event');
    this.pageNumber = event?.currentPage;
    this.pageSize = event?.perPage;

    this.getUsersList(this.current_payload);

    //
  }

  selectedUserId: any = '';
  setSelectedRow(event: any) {
    this.selectedUserId = event;
    console.log('role Selected', event);
  }

  itemsMenu: any[] = [];
  loadingState: boolean = true;
  profilesList: any = [];

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

  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }
  openModal: boolean = false;
  ngOnInit(): void {
    this.table_name = this._TranslateService.instant('SETTING.USERLIST');
    this.badge_name = this._TranslateService.instant('SETTING.USERS');

    this.action_items = [
      {
        label: this._TranslateService.instant('SETTING.VIEW_USER'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._router.navigate([
            `/gfw-portal/setting/access-management/users/${this.selectedUserId}`,
          ]);
          // access-management\userViewContainer\userViewContainer.component.ts
        },
        visible: () =>
          this._PermissionSystemService.can(
            'ACCESSMANAGEMNET',
            'USERSROLES',
            'VIEW'
          ),
      },
      {
        label: this._TranslateService.instant('SETTING.DELETE_USER'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.actionDeleteVisible = true;
        },
        visible: () =>
          this._PermissionSystemService.can(
            'ACCESSMANAGEMNET',
            'USERS',
            'DELETE'
          ),
      },
      {
        label: this._TranslateService.instant('SETTING.UPDATE_USER'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this._router.navigate([
            `/gfw-portal/setting/access-management/updateUserRole/${this.selectedUserId}`,
          ]);
        },
        visible: () =>
          this._PermissionSystemService.can(
            'ACCESSMANAGEMNET',
            'USERS',
            'EDIT'
          ),
      },
    ];

    // this.getUsersList();
  }
  usersProfiles: any = [];
  selected_profile_column: any = '';

  isDeleting: boolean = false;
  deleteUser() {
    if (
      !this._PermissionSystemService.can('ACCESSMANAGEMNET', 'USERS', 'DELETE')
    )
      return;
    this.isDeleting = true;
    this._AccessManagementService.deleteUser(this.selectedUserId).subscribe({
      next: (res) => {
        this.isDeleting = false;
        console.log(res, 'deleted');
        this.messageService.add({
          severity: 'success',
          detail: 'User deleted successfully',
        });
        this.actionDeleteVisible = false;
        this.getUsersList(this.current_payload);
      },
      error: (err) => {
        this.isDeleting = false;
      },
    });
  }
  openModle() {
    this.openModal = true;
  }
  newUser() {
    this._router.navigate([`/gfw-portal/setting/access-management/add-user`]);
  }
  submit() {}
}
