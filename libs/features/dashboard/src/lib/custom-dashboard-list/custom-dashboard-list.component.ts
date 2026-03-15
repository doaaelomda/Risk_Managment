import { SharedService } from './../../../../../shared/shared-ui/src/services/shared.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  TextareaUiComponent,
  DeleteConfirmPopupComponent,
} from '@gfw/shared-ui';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import {
  FormControl,
  Validators,
  FormsModule,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { DashboardLayoutService } from '../../services/dashboard-layout.service';
import { finalize, Observable, Subscription } from 'rxjs';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { MessageService } from 'primeng/api';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-custom-dashboard-list',
  imports: [
    CommonModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
    NewTableComponent,
    InputTextComponent,
    FormsModule,
    ReactiveFormsModule,
    TextareaUiComponent,
    UiDropdownComponent,
    DeleteConfirmPopupComponent,
  ],
  templateUrl: './custom-dashboard-list.component.html',
  styleUrl: './custom-dashboard-list.component.scss',
})
export class CustomDashboardListComponent implements OnInit, OnDestroy {
  // Declaration Variables
  show_add_dailog: boolean = false;
  itemsMenu: any[] = [];
  loadingState: boolean = true;
  action_items: any[] = [];
  current_row_selected: any;
  loadDelted: boolean = false;
  actionDeleteVisible: boolean = false;
  openModal: boolean = false;
  loadingBtn: boolean = false;
  quickAddVisible: boolean = false;
  update_flag: boolean = false;
  permissions: any[] = [];
  dashboard_form!: FormGroup;
  visibleInput: boolean = false;
  dataList: any[] = [];
  current_paylod: any;
  status: any[] = [];
  columnControl: any = {
    type: 'route',
    data: `/gfw-portal/setting/dashboard-builder/dashboard/`,
  };
  pagination: PaginationInterface = {
    perPage: 0,
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  };
  private subscription: Subscription = new Subscription();
  // iniliaze Constructor
  constructor(
    private _router: Router,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _sharedService: SharedService,
    private _DashboardLayoutService: DashboardLayoutService,
    private _MessageService: MessageService,
    public _PermissionSystemService: PermissionSystemService
  ) {}

  // iniliaze Form
  form: FormGroup = new FormGroup({
    dashboard_name: new FormControl(null, [Validators.required]),
  });

  // handle BreadCrumb
  handleBreadCrumb() {
    this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('Dashboard.BREADCRUMB.SETTING'),
        icon: '',
        routerLink: '/gfw-portal/setting/dashboard-builder/dashboard-list',
      },
      {
        name: this._TranslateService.instant(
          'Dashboard.BREADCRUMB.BUILD_BUILDER'
        ),
        icon: '',
        routerLink: '/gfw-portal/setting/dashboard-builder/dashboard-list',
      },
      {
        name: this._TranslateService.instant('Dashboard.BREADCRUMB.LIST'),
        icon: '',
      },
    ]);
  }

  // Handle Action Item
  handleAction() {
    this.action_items = [
      {
        label: this._TranslateService.instant(
          'Dashboard.ACTIONS.VIEW_DASHBOARD'
        ),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._router.navigate([
            `/gfw-portal/setting/dashboard-builder/dashboard`,
            this.current_row_selected,
          ]);
        },
        visible: () =>
          this._PermissionSystemService.can('DASHBOURD', 'DASHBOURD', 'VIEW'),
      },
      {
        label: this._TranslateService.instant(
          'Dashboard.ACTIONS.DELETE_DASHBOARD'
        ),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.actionDeleteVisible = true;
        },
        visible: () =>
          this._PermissionSystemService.can('DASHBOURD', 'DASHBOURD', 'DELETE'),
      },
      {
        label: this._TranslateService.instant(
          'Dashboard.ACTIONS.UPDATE_DASHBOARD'
        ),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this.update_flag = true;
          const sub = this._DashboardLayoutService
            .getDashboardInfoById(this.current_row_selected)
            .subscribe((res: any) => {
              this.quickAddVisible = true;
              this.initDashboardForm(res?.data);
            });
          this.subscription.add(sub);
        },
        visible: () =>
          this._PermissionSystemService.can('DASHBOURD', 'DASHBOURD', 'EDIT'),
      },
    ];
  }

  // handle Selection Row
  setSelectedRow(event: any) {
    this.current_row_selected = event;
  }

  // load Lookups
  getPermissionLookup() {
    const sub = this._sharedService.lookUps([58]).subscribe((res: any) => {
      this.permissions = res?.data?.Permission;
    });
    this.subscription.add(sub);
    this.status = [
      {
        id: 1,
        label: this._TranslateService.instant('NOTIFICATION_SETTING.ACTIVE'),
      },
      {
        id: 2,
        label: this._TranslateService.instant('NOTIFICATION_SETTING.INACTIVE'),
      },
    ];
  }
  // Method Dashboard Flow
  handleStratDashboardFlow() {
    const current_daedshboard = {
      id: 200,
      dashboard_name: this.form.value.dashboard_name,
      dashboard_parts: [],
    };
    localStorage.setItem(
      'current_custom_dashboard',
      JSON.stringify(current_daedshboard)
    );
    this._router.navigate([
      `/gfw-portal/setting/dashboard-builder/dashboard/` +
        current_daedshboard.id,
    ]);
  }
  // Method Close Quick Add Modal
  closeQuickAddModal() {
    this.update_flag = false;
    this.current_row_selected = null;
    this.initDashboardForm();
  }
  // dashboard Action
  dashboardAction() {
    if (this.dashboard_form.invalid) {
      return;
    }

    // ===== Permissions =====
    const hasPermission = this.update_flag
      ? this._PermissionSystemService.can('DASHBOURD', 'DASHBOURD', 'EDIT')
      : this._PermissionSystemService.can('DASHBOURD', 'DASHBOURD', 'ADD');

    if (!hasPermission) {
      return;
    }
    this.loadingBtn = true;
    const payload = this.dashboard_form.value;
    payload.isActive =
      this.dashboard_form.get('isActive')?.value == 1 ? true : false;
    const APICALL$: Observable<any> = this.update_flag
      ? this._DashboardLayoutService.updateDashboardInfo(
          this.dashboard_form.value,
          this.current_row_selected
        )
      : this._DashboardLayoutService.addDashboardInfo(
          this.dashboard_form.value
        );

    const sub = APICALL$.subscribe({
      next: (res: any) => {
        this.loadingBtn = false;
        this.quickAddVisible = false;
        this._MessageService.add({
          summary: 'success',
          severity: 'success',
          detail: this.update_flag
            ? this._TranslateService.instant(
                'Dashboard.MESSAGES.DASHBOARD_INFO_UPDATED'
              )
            : this._TranslateService.instant(
                'Dashboard.MESSAGES.DASHBOARD_INFO_CREATED'
              ),
        });

        if (!this.update_flag) {
          this._router.navigate([
            '/gfw-portal/setting/dashboard-builder/dashboard',
            res?.data,
          ]);
          // this._LayoutService.addToSide.next({
          //   name: this.dashboard_form.get('name')?.value,
          //   nameAr: this.dashboard_form.get('nameAr')?.value,
          //   icon: '',
          //   link: `/gfw-portal/custom-dahboards/${res?.data}`,
          // });
        }
        this.getDataTable(this.current_paylod);
      },
      error: () => {
        this.loadingBtn = false;
      },
    });
    this.subscription.add(sub);
  }
  // Close Delete Popup
  handleClosedDelete() {
    this.actionDeleteVisible = false;
  }

  // Method Delete DashBoard
  deleteDashboard() {
    if (!this._PermissionSystemService.can('DASHBOURD', 'DASHBOURD', 'DELETE'))
      return;
    this.loadDelted = true;
    const sub = this._DashboardLayoutService
      .deleteDashboard(this.current_row_selected)
      .subscribe({
        next: () => {
          this.loadDelted = false;
          this.actionDeleteVisible = false;
          this._MessageService.add({
            summary: 'success',
            severity: 'success',
            detail: this._TranslateService.instant(
              'Dashboard.MESSAGES.DASHBOARD_DELETED'
            ),
          });
          this.getDataTable(this.current_paylod);
        },
        error: () => {
          this.loadDelted = false;
        },
      });
    this.subscription.add(sub);
  }

  // Iniliaze DashBoard Form
  initDashboardForm(data?: any) {
    this.dashboard_form = new FormGroup({
      name: new FormControl(data ? data?.name : null, Validators.required),
      nameAr: new FormControl(data ? data?.nameAr : null),
      description: new FormControl(data ? data?.description : null),
      descriptionAr: new FormControl(data ? data?.descriptionAr : null),
      isActive: new FormControl(
        data ? (data?.isActive == true ? 1 : 2) : null,
        Validators.required
      ),
      permissionID: new FormControl(
        data ? data?.permissionID : null,
        Validators.required
      ),
    });
  }

  // method to handle data table
  handleDataTable(payload: any = null) {
    this.current_paylod = payload;
    this.getDataTable(payload);
  }
  // method to get data table
  getDataTable(payload: any) {
    this.loadingState = true;
    this.dataList = [];
    const sub = this._DashboardLayoutService
      .getDashboardList(payload)
      .pipe(finalize(() => (this.loadingState = false)))
      .subscribe({
        next: (res: any) => {
          this.dataList = res?.data?.items;
          this.pagination = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this._sharedService.paginationSubject.next(this.pagination);
        },
        error: () => {},
      });
    this.subscription.add(sub);
  }

  // Life Cycle Hooks
  ngOnInit(): void {
    this.initDashboardForm();
    this.getPermissionLookup();
    this.handleBreadCrumb();
    this.handleAction();
  }
  // Destroy Component
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
