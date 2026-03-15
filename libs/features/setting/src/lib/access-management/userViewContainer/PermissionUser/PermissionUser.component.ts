import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyStateComponent, InputSearchComponent } from '@gfw/shared-ui';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AccessManagementService } from 'libs/features/setting/src/services/access-management.service';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { ActivatedRoute } from '@angular/router';
import { PermissionService } from 'libs/features/setting/src/services/permission.service';
import { AuthService } from 'libs/features/auth/src/services/auth.service';

@Component({
  selector: 'lib-permission-user',
  imports: [
    CommonModule,
    InputSearchComponent,
    UiDropdownComponent,
    FormsModule,
    ReactiveFormsModule,
    EmptyStateComponent
  ],
  templateUrl: './PermissionUser.component.html',
  styleUrl: './PermissionUser.component.css',
})
export class PermissionUserComponent {
  constructor(
    private PermissionService: PermissionService,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _RiskService: RiskService,
    private _activatedRoute: ActivatedRoute,
    private authService:AuthService

  ) {}
  ngOnInit() {
    this.getLookups();
    this.getUserPermissions();
    this.handleFilter();
  }
  permissionTypes = [];
  isLoadingData:boolean=false
  getLookups() {
    this._RiskService.getRiskActionLookupData([59, 60, 62]).subscribe({
      next: (res: any) => {
        console.log(res, 'got permission types');

        this.permissionTypes = res?.data?.PermissionType;
      },
    });
  }

  getUserPermissions() {
    this.isLoadingData=true
    this._activatedRoute.parent?.paramMap.subscribe((res) => {
      const userId = res?.get('id');
      if (!userId) return;

      this.PermissionService
        .getPermission(userId)
        .subscribe((res: any) => {
          console.log(res, 'got user permissions');
          const permissions = res?.data;
          this.isLoadingData=false
          this.originalPermissions = [];
          permissions?.map((perm: any) => {
            this.originalPermissions.push({
              name: perm?.name,
              badge: perm?.permissionLevelName,
              type: perm?.permissionTypeName,
            });
          });

          this.permissions = [...this.originalPermissions];
        });
    });
  }
  filterForm: FormGroup = new FormGroup({
    selectedRegulator: new FormControl(null),
  });
  originalPermissions: any[] = [];

  permissions: any[] = [];

  handleFilter() {
    this.filterForm
      .get('selectedRegulator')
      ?.valueChanges.subscribe((newRegulator: string) => {
        this.applyFilters()
      });
  }

  setBreadCrumb(userName: any) {
    this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.SETTING'),
        icon: '',
        routerLink:
          '/gfw-portal/setting/access-management/usersAccessManagment',
      },
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.Access_Management'
        ),
        icon: '',
        routerLink:
          '/gfw-portal/setting/access-management/usersAccessManagment',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.USERS'),
        icon: '',
        routerLink: '/gfw-portal/setting/access-management/users',
      },
      {
        name: userName,
        icon: '',
      },
    ]);
  }

  search: any = '';

handleSearch(searchValue: string) {
  this.search = searchValue;
  this.applyFilters();
}
applyFilters() {
  const searchQuery = this.search?.toLowerCase() || '';
  const selectedRegulator =
    this.filterForm.get('selectedRegulator')?.value?.toLowerCase() || null;

  this.permissions = this.originalPermissions.filter((p) => {
    const matchSearch =
      !searchQuery ||
      p.name?.toLowerCase().includes(searchQuery) ||
      p.technicalName?.toLowerCase().includes(searchQuery);

    const matchRegulator =
      !selectedRegulator ||
      p.type?.toLowerCase() === selectedRegulator;

    return matchSearch && matchRegulator;
  });
}



}
