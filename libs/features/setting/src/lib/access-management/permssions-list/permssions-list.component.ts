import { Router } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { AccessManagementService } from '../../../services/access-management.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { MenuModule } from 'primeng/menu';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { MessageService } from 'primeng/api';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-permssions-list',
  imports: [
    CommonModule,
    ButtonModule,
    DeleteConfirmPopupComponent,
    MenuModule,
    TranslateModule,
    NewTableComponent,
  ],
  templateUrl: './permssions-list.component.html',
  styleUrl: './permssions-list.component.scss',
})
export class PermssionsListComponent implements OnInit {
  constructor(
    private _messageService: MessageService,
    private _riskService: RiskService,
    private _Router: Router,
    private _SharedService: SharedService,
    private _AccessManagementService: AccessManagementService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
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
        routerLink: '/gfw-portal/setting/access-management/permssions-list',
      },
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.Access_Management'
        ),
        icon: '',
        routerLink: '/gfw-portal/setting/access-management/permssions-list',
      },
      {
        name: this._TranslateService.instant('SETTING.PERMISSIONS'),
        icon: '',
        routerLink: '',
      },
    ]);
  }

  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  columnControl:any
  current_payload: any;
  handleDataTable(event: any) {
    this.current_payload = event;
    this.getPermssionData(this.current_payload);
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

  setSelectedRow(event: any) {
    this.current_row_selected = event;
    console.log(event, 'event');
  }

  ngOnInit(): void {
    this.action_items = [
      // {
      //   label: this._TranslateService.instant('SETTING.VIEW_PERMISSION'),
      //   icon: 'fi fi-rr-eye',
      //   command: () => {
      //     // access-management\permissionViewContainer\permissionViewContainer.component.ts
      //   },
      // },
      {
        label: this._TranslateService.instant('SETTING.DELETE_PERMISSION'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.actionDeleteVisible = true;
        },
        visible: ()=> this._PermissionSystemService.can('ACCESSMANAGEMNET' , 'PERMISSIONS' , 'DELETE')
      },
      {
        label: this._TranslateService.instant('SETTING.UPDATE_PERMISSION'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this._Router.navigate(
            ['/gfw-portal/setting/access-management/add-permission'],
            {
              queryParams: { id: this.current_row_selected },
            }
          );
        },
        visible: ()=> this._PermissionSystemService.can('ACCESSMANAGEMNET' , 'PERMISSIONS' , 'EDIT')
      },
    ];
  }

  DeletePermission() {
    if(!this._PermissionSystemService.can('ACCESSMANAGEMNET' , 'PERMISSIONS' , 'DELETE')) return;
    this.loadDelted = true;
    this._riskService.deletePerrmission(this.current_row_selected).subscribe({
      next: (res: any) => {
        this._messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Permission Delete Successfully',
        });
        this.actionDeleteVisible = false;
        this.getPermssionData(this.current_payload);
      },
    });
  }

  getPermssionData(event?: any) {
    this.loadingState = true;
    this.dataList = [];
    this._AccessManagementService
      .getPermissionsSearch(event)
      .subscribe((res: any) => {
        this.dataList = res?.data?.items;
        this.pageginationObj = {
          perPage: res?.data?.pageSize,
          currentPage: res?.data?.pageNumber,
          totalItems: res?.data?.totalCount,
          totalPages: res?.data?.totalPages,
        };
        this._SharedService.paginationSubject.next(this.pageginationObj);
        this.loadingState = false;
      });
  }

  add_permission() {
    this._Router.navigate([
      '/gfw-portal/setting/access-management/add-permission',
    ]);
  }
}
