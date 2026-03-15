import { SharedTabsComponent } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterOutlet,
  ActivatedRoute,
} from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AccessManagementService } from '../../../services/access-management.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-role-view-container',
  imports: [CommonModule, RouterOutlet,SharedTabsComponent,TranslateModule],
  templateUrl: './role-view-container.component.html',
  styleUrl: './role-view-container.component.scss',
})
export class RoleViewContainerComponent {
  constructor(
    private _TranslateService: TranslateService,
    private _accessManagementService: AccessManagementService,
    private _activatedRoute: ActivatedRoute,
    private _LayoutService:LayoutService,
    private _PermissionSystemService:PermissionSystemService
  ) {
    this.tabs = [
      {
        id: 2,
        name: 'TABS.PERMISSIONS',
        icon: 'fi fi-rr-padlock-check',
        router: 'permissions',
        visible: ()=> this._PermissionSystemService.can('ACCESSMANAGEMNET', 'ROLESPERMISIION', 'VIEW')
      },
      {
        id: 3,
        name: 'TABS.USERS',
        icon: 'fi fi-rr-users-alt',
        router: 'users',
        visible: ()=> this._PermissionSystemService.can('ACCESSMANAGEMNET', 'ROLESUSERS', 'VIEW')
      },
    ];
  }

  ngOnInit() {
    this.checkRoleId();
  }

  tabs: any[] = [];

  checkRoleId() {
    this._activatedRoute.paramMap.subscribe((res) => {
      const Id = res?.get('id');
      this.roleId = Id;
      this.getRoleData();

    });
  }



  roleId: string | number | null = '';
  roleData: any;

  getRoleData() {
    this._accessManagementService.getRole(this.roleId).subscribe((res: any) => {
      console.log(res, 'role data');
      this.roleData = res['data'];
    });
  }
}
