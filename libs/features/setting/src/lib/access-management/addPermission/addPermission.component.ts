import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { ButtonModule } from 'primeng/button';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { validations } from 'libs/shared/shared-ui/src/models/validation.model';
import { TextareaUiComponent } from '@gfw/shared-ui';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-add-permission',
  imports: [
    CommonModule,
    FormsModule,
    AccordionModule,
    TranslateModule,
    ReactiveFormsModule,
    InputTextComponent,
    UiDropdownComponent,
    ButtonModule,
    MenuModule,
    TextareaUiComponent,
  ],
  templateUrl: './addPermission.component.html',
  styleUrl: './addPermission.component.css',
})
export class AddPermissionComponent {
  assigneeOrganizationalUnitID: any[] = [];
  roleId: any;
  current_row_selected: any;
  constructor(
    private _RiskService: RiskService,
    private _LayoutService: LayoutService,
    private _Router: Router,
    private _messageService: MessageService,
    private _TranslateService: TranslateService,
    private _route: ActivatedRoute,
    private _permissionService: PermissionSystemService
  ) {
    this.initResponsibilityForm();
    this._route.queryParams.subscribe((params) => {
      this.current_row_selected = params['id'];
      if (this.current_row_selected) {
        this._RiskService
          .getOnePermission(this.current_row_selected)
          .subscribe({
            next: (res) => {
              console.log('Permission data:', res?.data);
              this.initResponsibilityForm(res?.data);
              const currentBreadcrumb =
                this._LayoutService.breadCrumbLinks.getValue();
              const updatedBreadcrumb = [...currentBreadcrumb];
              updatedBreadcrumb[updatedBreadcrumb.length - 1] = {
                name: res?.data?.name,
                icon: '',
              };
              this._LayoutService.breadCrumbLinks.next(updatedBreadcrumb);
            },
            error: (err) => {
              console.error('Error loading permission:', err);
            },
          });
      } else {
        this.initResponsibilityForm();
      }
    });
    this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
      },
      {
        name: this._TranslateService.instant('USERINFO.Setting'),
        icon: '',
        routerLink: '/gfw-portal/setting/access-management/permssions-list',
      },
      {
        name: this._TranslateService.instant('USERINFO.AccessManagement'),
        icon: '',
        routerLink: '/gfw-portal/setting/access-management/permssions-list',
      },
      {
        name: this._TranslateService.instant('USERINFO.PERMISSIONS_LIST'),
        icon: '',
        routerLink: `/gfw-portal/setting/access-management/permssions-list`,
      },
      {
        name: this._TranslateService.instant('USERINFO.Add_Permission'),
        icon: '',
      },
    ]);
    this.getLookups();
  }
  permissionForm!: FormGroup;
  showErrorResponsbility: boolean = false;
  initResponsibilityForm(data?: any) {
    this.permissionForm = new FormGroup({
      name: new FormControl(data?.name ?? null, [Validators.required]),
      nameAr: new FormControl(data?.nameAr ?? null),
      description: new FormControl(data?.description ?? null),
      descriptionAr: new FormControl(data?.descriptionAr ?? null),
      permissionCategoryID: new FormControl(data?.permissionCategoryID ?? null),
      permissionLevelID: new FormControl(data?.permissionLevelID ?? null),
      permissionTypeID: new FormControl(data?.permissionTypeID ?? null),
      technicalName: new FormControl(data?.technicalName ?? null, [
        Validators.required,
      ]),
      moduleName: new FormControl(data?.moduleName ?? null),
      isActive: new FormControl(data?.isActive ?? null, [Validators.required]),
    });
  }
  nameVaildation: validations[] = [
    { key: 'required', message: 'VALIDATIONS.NAME' },
  ];
  statusVaildation: validations[] = [
    { key: 'required', message: 'VALIDATIONS.STATUS' },
  ];
  permissionTypes: any[] = [];
  permissionLevels: any[] = [];
  permissionCategories: any[] = [];

  statusList :any[]=[]


  getLookups() {
    this._RiskService.getRiskActionLookupData([59, 60, 62]).subscribe({
      next: (res: any) => {
        this.permissionCategories = res?.data?.PermissionCategory;
        this.permissionLevels = res?.data?.PermissionLevel;
        this.permissionTypes = res?.data?.PermissionType;
      },
    });
    this.statusList = [
  { value: true, label: this._TranslateService.instant('NOTIFICATION_SETTING.ACTIVE') },
  { value: false, label: this._TranslateService.instant('NOTIFICATION_SETTING.INACTIVE') },
];
  }
  loadDelted: boolean = false;
  submit() {
    if (this.permissionForm.invalid) {
      this.permissionForm.markAllAsTouched();
      return;
    }
      // ===== Permissions =====
  const hasPermission = this.current_row_selected
    ? this._permissionService.can('ACCESSMANAGEMNET', 'PERMISSIONS', 'EDIT')
    : this._permissionService.can('ACCESSMANAGEMNET', 'PERMISSIONS', 'ADD');

  if (!hasPermission) {
    return;
  }
    this.loadDelted = true;
    if (this.current_row_selected) {
      this._RiskService
        .updatePermission(this.current_row_selected, this.permissionForm.value)
        .subscribe({
          next: (res: any) => {
            this._messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: this._TranslateService.instant('NOTIFICATION_SETTING.Permission_Update_Successfully'),
            });
            this.loadDelted = true;
            this.permissionForm.reset();
            this._Router.navigate([
              '/gfw-portal/setting/access-management/permssions-list',
            ]);
          },
          error: (err) => {
            console.error('Error updating permission:', err);
          },
        });
    } else {
      this._RiskService.addPermission(this.permissionForm.value).subscribe({
        next: (res: any) => {
          this._messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: this._TranslateService.instant('NOTIFICATION_SETTING.Permission_Added_Successfully'),
          });
          this.loadDelted = true;
          this.permissionForm.reset();
          this._Router.navigate([
            '/gfw-portal/setting/access-management/permssions-list',
          ]);
        },
      });
    }
  }
}
