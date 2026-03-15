import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  RouterOutlet,
} from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AccessManagementService } from '../../../services/access-management.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { SharedTabsComponent } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';

@Component({
  selector: 'lib-user-view-container',
  imports: [
    CommonModule,
    RouterOutlet,
    TranslateModule,
    SharedTabsComponent
  ],
  templateUrl: './userViewContainer.component.html',
  styleUrl: './userViewContainer.component.css',
})
export class UserViewContainerComponent {
  constructor(
    private _TranslateService: TranslateService,
    private _accessManagementS: AccessManagementService,
    private _activatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _PermissionSystemService:PermissionSystemService
  ) {
    this.tabs = [
      // {
      //   id: 1,
      //   name: this._TranslateService.instant('TABS.OVERVIEW'),
      //   icon: 'fi-rr-apps',
      //   router: 'Overview',
      // },
      {
        id: 2,
        name: this._TranslateService.instant('TABS.ROLES'),
        icon: 'fi fi-rr-user-gear',
        router: 'Roles',
        visible: () =>
          this._PermissionSystemService.can(
            'ACCESSMANAGEMNET',
            'USERSROLES',
            'VIEW'
          ),
      },
      {
        id: 3,
        name: this._TranslateService.instant('TABS.PERMISSIONS'),
        icon: 'fi fi-rr-padlock-check',
        router: 'Permission',
            visible: () =>
          this._PermissionSystemService.can(
            'ACCESSMANAGEMNET',
            'USERSPERMISSION',
            'VIEW'
          ),
      },
    ];
  }
  userData: any = '';
  ngOnInit() {
    this._activatedRoute.paramMap.subscribe((res) => {
      const userId = res?.get('id');
      if (!userId) return;
      this.getUser(userId);
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
          '/gfw-portal/setting/access-management/users',
      },
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.Access_Management'
        ),
        icon: '',
        routerLink:
          '/gfw-portal/setting/access-management/users',
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
  ngOnDestroy() {
    this._LayoutService.breadCrumbLinks.next([]);
  }
  getUser(userId: string | number | null) {
    this._accessManagementS.getUserById(userId).subscribe((res: any) => {
      this.userData = res;
      this.setBreadCrumb(res?.name);

      console.log('got user', res);
    });
  }

  tabs: any[] = [];
}
