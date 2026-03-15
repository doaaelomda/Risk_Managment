import {
  OverviewEntry,
  SharedOverviewComponent,
} from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessManagementService } from 'libs/features/setting/src/services/access-management.service';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'lib-roles-permssions-view',
  imports: [CommonModule, SharedOverviewComponent],
  templateUrl: './roles-permssions-view.component.html',
  styleUrl: './roles-permssions-view.component.scss',
})
export class RolesPermssionsViewComponent {
  constructor(
    private _accessManagementService: AccessManagementService,
    private _activatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService
  ) {}
  entries: OverviewEntry[] = [
    { key: 'roleReportToName', label: 'SETTING.REPORT_TO', type: 'text' },
    { key: 'ownerUserName', label: 'SETTING.RESPONSIBLE', type: 'user' },
    { key: 'description', label: 'LOOKUP.DESCRIPTION', type: 'description' },
  ];

  ngOnInit() {
    this.checkRoleId();
  }
  checkRoleId() {
    this._activatedRoute.parent?.paramMap.subscribe((res) => {
      const Id = res?.get('id');
      this.roleId = Id;
      this.getRoleData();
    });
  }
  roleId: any = '';
  roleData: any;
  loading: boolean = false;
  getRoleData() {
    this.loading = true;
    this._accessManagementService
      .getRole(this.roleId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res: any) => {
        console.log(res, 'role data');
        this.roleData = res['data'];
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
            name: this.roleData?.name,
            icon: '',
            routerLink: `/gfw-portal/setting/access-management/roles&permssions/${this.roleId}/overview`,
          },
        ]);
      });
  }
}
