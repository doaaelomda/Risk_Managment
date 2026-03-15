import { TreeSelectUiComponent } from './../../../../../../shared/shared-ui/src/lib/tree-select/tree-select-ui.component';
import { RiskService } from './../../../../../risks/src/services/risk.service';
import { TreeMultiselectComponent } from './../../../../../../shared/shared-ui/src/lib/treeMultiselect/treeMultiselect.component';
import { TextareaUiComponent, UserDropdownComponent } from '@gfw/shared-ui';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { AccessManagementService } from '../../../services/access-management.service';
import { RoleDropdownComponent } from 'libs/shared/shared-ui/src/lib/role-dropdown/role-dropdown.component';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-roles-permssions-action',
  imports: [
    CommonModule,
    ButtonModule,
    TextareaUiComponent,
    RoleDropdownComponent,
    InputTextComponent,
    UiDropdownComponent,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    UserDropdownComponent,
    TreeSelectUiComponent,
  ],
  templateUrl: './roles-permssions-action.component.html',
  styleUrl: './roles-permssions-action.component.scss',
})
export class RolesPermssionsActionComponent implements OnInit {
  constructor(
    private _RiskService: RiskService,
    private _SharedService: SharedService,
    private _AccessManagementService: AccessManagementService,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _messageService: MessageService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _PermissionSystemService:PermissionSystemService
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
        routerLink: '/gfw-portal/setting/access-management',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.ADD_ROLE'),
        icon: '',
        routerLink: '',
      },
    ]);
  }

  statusList = [
    { name: 'Active', value: true },
    { name: 'Inactive', value: false },
  ];

  OrganizationalUnit: any;

  ngOnInit(): void {
    this.getOrgUniyLookup();
    this.loadUser();
    this.getRoleTypeLookUp();
    this.getRoleAdminstrator();
    this.initRoleForm();
    this.checkIfUpdating();
    this.getUsersLookUpData();
  }
  findNodesByIds(nodes: any[], ids: number[]): any[] {
    const result: any[] = [];

    function search(node: any) {
      if (ids.includes(node.id)) {
        result.push(node);
      }
      if (node.children) {
        node.children.forEach((child: any) => search(child));
      }
    }

    nodes.forEach((node) => search(node));
    return result;
  }
  checkIfUpdating() {
    this._activatedRoute.paramMap.subscribe((res) => {
      console.log(res, 'activatedroute');
      this.roleId = res?.get('id') || '';
      if (!this.roleId) return;
      this._AccessManagementService
        .getRole(this.roleId)
        .subscribe((res: any) => {
          console.log(res, 'got role data');
          const roleData = res['data'];
          this.setControlValues(
            this.role_from,
            'nameAr',
            roleData?.nameAr || null
          );
          this.setControlValues(
            this.role_from,
            'nameEn',
            roleData?.name || null
          );
          this.setControlValues(
            this.role_from,
            'role_type',
            +roleData?.roleTypeID || null
          );
          this.setControlValues(
            this.role_from,
            'status',
            roleData?.isActive || null
          );
          this.setControlValues(
            this.role_from,
            'description',
            roleData?.description || null
          );
          this.setControlValues(
            this.role_from,
            'report_to',
            +roleData?.roleReportToID || null
          );
          this.setControlValues(
            this.role_from,
            'role_admin',
            +roleData?.ownerUserID || null
          );
          console.log(
            roleData?.organizationalUnitID,
            'roleData?.organizationalUnitID'
          );
          console.log(this.OrganizationalUnit, 'OrganizationalUnit');
          const selectedOrg: any = this.findNodesByIds(
            this.OrganizationalUnit,
            [roleData?.organizationalUnitID]
          )[0];

          this.setControlValues(
            this.role_from,
            'organizationalUnit',
            selectedOrg || null
          );
          if (res?.data) {
            const currentBreadcrumb =
              this._LayoutService.breadCrumbLinks.getValue();
            const updatedBreadcrumb = [...currentBreadcrumb];
            updatedBreadcrumb[updatedBreadcrumb.length - 1] = {
              name: res?.data?.name || '',
              icon: '',
              routerLink: '',
            };
            this._LayoutService.breadCrumbLinks.next(updatedBreadcrumb);
          }

        });
    });
  }

  transformNodes(nodes: any[], parentKey: string = ''): any[] {
    return nodes.map((node, index) => {
      const key = parentKey ? `${parentKey}-${index}` : `${index}`;
      const isLeaf = !node.children || node.children.length === 0;
      return {
        key,
        id: node.id,
        label: node.label,
        children: node.children ? this.transformNodes(node.children, key) : [],
      };
    });
  }

  setControlValues(form: FormGroup, controlName: string, value: any): void {
    const control = form.get(controlName);
    if (control) {
      control.setValue(value);
    }
  }

  getOrgUniyLookup() {
    this._RiskService.orgainationalUnitLookUp().subscribe({
      next: (res: any) => {
        this.OrganizationalUnit = this.transformNodes(res?.data);
        console.log(this.OrganizationalUnit, 'this.OrganizationalUnit');
      },
    });
  }

  role_types: any[] = [];
  users: any[] = [];

  getRoleTypeLookUp() {
    this._SharedService.lookUps([63]).subscribe((res: any) => {
      this.role_types = res?.data?.RoleType;
    });
  }
  usersLookUpData: any[] = [];
  getUsersLookUpData() {
    this._SharedService.getUserLookupData().subscribe((res: any) => {
      console.log(res, 'resssss');
      this.usersLookUpData = res?.data;
      console.log(this.usersLookUpData, 'this.usersLookUpData');
    });
  }

  getRoleAdminstrator() {
    this._AccessManagementService.getRolesTypeLookUp().subscribe((res: any) => {
      this.role_types_admin = res?.data;
    });
  }

  role_types_admin: any[] = [];
  loadUser() {
    this._SharedService.getUserLookupData().subscribe((res: any) => {
      this.users = res?.data;
    });
  }

  role_from!: FormGroup;
  initRoleForm() {
    this.role_from = new FormGroup({
      nameAr: new FormControl(null, [Validators.required]),
      nameEn: new FormControl(null, [Validators.required]),
      role_type: new FormControl(null, [Validators.required]),
      status: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      report_to: new FormControl(null, [Validators.required]),
      role_admin: new FormControl(null, [Validators.required]),
      organizationalUnit: new FormControl(null, [Validators.required]),
    });
  }
  roleId = '';
  isModifyingRole: boolean = false;
  navgivateToList() {
    this._router.navigate([
      'gfw-portal/setting/access-management/roles&permssions',
    ]);
  }

  saveRole() {
                            // ===== Permissions =====
  const hasPermission = this.roleId
    ? this._PermissionSystemService.can('ACCESSMANAGEMNET' , 'ROLES', 'EDIT')
    : this._PermissionSystemService.can('ACCESSMANAGEMNET' , 'ROLES', 'ADD');

  if (!hasPermission) {
    return;
  }
    if (this.role_from.invalid ) return;

    const msg = this.roleId ? 'Updated' : 'Created';
    this.isModifyingRole = true;
    const data = this.role_from?.value;
    console.log(data, 'data here');

    this._AccessManagementService.modifyRole(data, this.roleId).subscribe({
      next: (res) => {
        this.isModifyingRole = false;
        this._messageService.add({
          severity: 'success',
          summary: msg + ' Successfully',
          detail: 'Role ' + msg + ' Successfully',
        });
        // this.initRoleForm();
        setTimeout(() => {
          this.navgivateToList();
        }, 1000);
        console.log(res, 'role modified');
      },
      error: (err) => {
        this.isModifyingRole = false;
      },
    });
  }
}
