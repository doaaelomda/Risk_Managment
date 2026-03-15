import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { MenuModule } from 'primeng/menu';
import { Router } from '@angular/router';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { forkJoin } from 'rxjs';
import { AccessManagementService } from '../../../services/access-management.service';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-roles-permssions-list',
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule,
    TranslateModule,
    DeleteConfirmPopupComponent,
    NewTableComponent,
  ],
  templateUrl: './roles-permssions-list.component.html',
  styleUrl: './roles-permssions-list.component.scss',
})
export class RolesPermssionsListComponent {
  constructor(
    private _AccessManagementService: AccessManagementService,
    private _SharedService: SharedService,
    private _router: Router,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _messageService: MessageService,
    public _PermissionSystemService:PermissionSystemService
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
        routerLink: '/gfw-portal/setting/',
      },
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.Access_Management'
        ),
        icon: '',
        routerLink: '/gfw-portal/setting/access-management',
      },
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.ROLES_PERMSSIONS'
        ),
        icon: '',
        routerLink: '',
      },
    ]);
  }
  columnControl: any = {
    type: 'route',
    data: '/gfw-portal/setting/access-management/roles&permssions',
  };
  current_payload: any;
  handleDataTable(event: any) {
    this.current_payload = event;
    this.getRoleData(this.current_payload);
  }
  dataList: any[] = [];

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
  selected_profile_column: number = 0;

  handleClosedDelete(event: any) {
    this.actionDeleteVisible = false;
  }

  deleteRole() {
    if(!this._PermissionSystemService.can('ACCESSMANAGEMNET' , 'ROLES' , 'DELETE')) return;
    this._AccessManagementService
      .deleteRole(this.current_row_selected)
      .subscribe((res) => {
        this._messageService.add({
          severity: 'success',
          detail: 'Role Deleted Successfully',
        });
        this.actionDeleteVisible = false;
        this.getRoleData(this.current_payload);
      });
  }

  setSelectedRow(event: any) {
    this.current_row_selected = event;
    console.log(event, 'event');
  }

  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }
  ngOnInit(): void {
    this.table_name = this._TranslateService.instant('SETTING.ROLE_LIST');
    this.badge_name = this._TranslateService.instant('SETTING.ROLES');

    this.itemsMenu = [
      {
        items: [
          {
            label: this._TranslateService.instant('MENU.QUICK_ADD'),
            command: () => {},
          },
          {
            label: this._TranslateService.instant('SETTING.ADD_NEW_ROLE'),
            command: () => {},
          },
        ],
      },
    ];

    this.action_items = [
      {
        label: this._TranslateService.instant('SETTING.VIEW_ROLE'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._router.navigate([
            '/gfw-portal/setting/access-management/roles&permssions',
            this.current_row_selected,
          ]);
        },
        visible: ()=> this._PermissionSystemService.can('ACCESSMANAGEMNET' , 'ROLES' , 'VIEW')
      },
      {
        label: this._TranslateService.instant('SETTING.DELETE_ROLE'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.actionDeleteVisible = true;
        },
        visible: ()=> this._PermissionSystemService.can('ACCESSMANAGEMNET' , 'ROLES' , 'DELETE')
      },
      {
        label: this._TranslateService.instant('SETTING.UPDATE_ROLE'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this._router.navigate([
            '/gfw-portal/setting/access-management/roles&permssions/updaterole',
            this.current_row_selected,
          ]);
        },
        visible: ()=> this._PermissionSystemService.can('ACCESSMANAGEMNET' , 'ROLES' , 'EDIT')
      },
    ];
  }

  getRoleData(event?: any) {
    this.loadingState = true;
    this.dataList = [];
    this._AccessManagementService.getRoleSearch(event).subscribe((res: any) => {
      this.dataList = res?.data?.items;
      this.pageginationObj = {
        perPage: res?.data?.pageSize,
        currentPage: res?.data?.pageNumber,
        totalItems: res?.data?.totalCount,
        totalPages: res?.data?.totalPages,
      };
      this._SharedService.paginationSubject.next(this.pageginationObj);
      this.loadingState = false;
      this.total_items_input = this.dataList?.length;
    });
  }

  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
}
