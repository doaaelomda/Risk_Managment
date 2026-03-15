import { AccordionModule } from 'primeng/accordion';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AccessManagementService } from '../../../services/access-management.service';
import { MessageService } from 'primeng/api';
import { TreeSelectUiComponent } from 'libs/shared/shared-ui/src/lib/tree-select/tree-select-ui.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-add-user-role',
  imports: [
    CommonModule,
    FormsModule,
    AccordionModule,
    TranslateModule,
    ReactiveFormsModule,
    InputTextComponent,
    UiDropdownComponent,
    ButtonModule,
    TreeSelectUiComponent,
  ],
  templateUrl: './addUserRole.component.html',
  styleUrl: './addUserRole.component.css',
})
export class AddUserRoleComponent {
  assigneeOrganizationalUnitID: any[] = [];
  roleId: any;
  constructor(
    private _RiskService: RiskService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _AccessManagementService: AccessManagementService,
    private messageService: MessageService,
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private _PermissionSystemService:PermissionSystemService
  ) {
    this.initResponsibilityForm();
    this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
      },
      {
        name: this._TranslateService.instant('USERINFO.Setting'),
        icon: '',
        routerLink: '/gfw-portal/setting/access-management/users',
      },
      {
        name: this._TranslateService.instant('USERINFO.AccessManagement'),
        icon: '',
        routerLink: '/gfw-portal/setting/access-management/users',
      },
      {
        name: this._TranslateService.instant('USERINFO.Users'),
        icon: '',
        routerLink: `/gfw-portal/setting/access-management/users`,
      },
      {
        name: this._TranslateService.instant('USERINFO.AddNewUser'),
        icon: '',
      },
    ]);
    this.statusList = [
      {
        id: 1,
        value: true,
        label: this._TranslateService.instant('NOTIFICATION_SETTING.ACTIVE'),
      },
      {
        id: 2,
        value: false,
        label: this._TranslateService.instant('NOTIFICATION_SETTING.INACTIVE'),
      },
    ];
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
  userInformation!: FormGroup;
  showErrorResponsbility: boolean = false;
  checkUserId() {
    this._activatedRoute.paramMap.subscribe((res) => {
      console.log(res, 'url here');
      const userId = res?.get('id');
      this.userId = userId;
      if (userId) {
        this._AccessManagementService
          .getUserById(userId)
          .subscribe((res: any) => {
            console.log(res, 'user data');
            const data = res;
            this.initResponsibilityForm(data);
            const currentBreadcrumb =
              this._LayoutService.breadCrumbLinks.getValue();
            const updatedBreadcrumb = [...currentBreadcrumb];
            updatedBreadcrumb[updatedBreadcrumb.length - 1] = {
              name: res?.name,
              icon: '',
            };
            this._LayoutService.breadCrumbLinks.next(updatedBreadcrumb);
          });
      }
    });
  }
  ngOnInit() {
    this.checkUserId();
  }
  findNodeById(nodes: any[], id: number): any | null {
    for (let node of nodes) {
      if (node.id === id) return node;
      if (node.children && node.children.length) {
        const found = this.findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }
  initResponsibilityForm(data?: any) {
    const isActiveValue =
      data?.isActive && data ? 1 : !data?.isActive && data ? 2 : null;
    this.userInformation = new FormGroup({
      username: new FormControl(data?.userName, Validators.required),
      email: new FormControl(data?.email, Validators.email),
      nameEnglish: new FormControl(data?.name, Validators.required),
      nameArabic: new FormControl(data?.nameAr, Validators.required),
      organizationalUnitID: new FormControl(null, Validators.required),
      Status: new FormControl(isActiveValue, Validators.required),
      postion: new FormControl(data?.position),
    });
    if (data?.organizationalUnitID) {
      this._RiskService.orgainationalUnitLookUp().subscribe({
        next: (res: any) => {
          this.assigneeOrganizationalUnitID = Array.isArray(res?.data)
            ? res.data
            : [];

          const selectedNode = this.findNodeById(
            this.assigneeOrganizationalUnitID,
            data.organizationalUnitID
          );

          this.userInformation
            .get('organizationalUnitID')
            ?.setValue(selectedNode);
        },
      });
    } else {
      this._RiskService.orgainationalUnitLookUp().subscribe({
        next: (res: any) => {
          this.assigneeOrganizationalUnitID = Array.isArray(res?.data)
            ? res.data
            : [];
        },
      });
    }
  }
  statusList: any[] = [];
  isSaving: boolean = false;
  userId: any = '';
  navigateBack() {
    this.router.navigate(['/gfw-portal/setting/access-management/users']);
  }

  submit() {
    if(!this._PermissionSystemService.can('ACCESSMANAGEMNET' , 'USERS' , 'DELETE')) return;
    this.isSaving = true;

    const data = {
      ...this.userInformation.value,
    };
    console.log(data ,"any");

    const msg = this.userId ? 'updated' : 'added';
    this._AccessManagementService.modifyUser(data, +this.userId).subscribe({
      next: (res) => {
        {
          this.isSaving = false;
          this.messageService.add({
            severity: 'success',
            detail: 'User ' + msg + ' successfully',
          });
          setTimeout(() => {
            this.navigateBack();
          }, 1000);
        }
      },
      error: (err) => {
        this.isSaving = false;
      },
    });
  }
}
