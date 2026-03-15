import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputSearchComponent } from '@gfw/shared-ui';

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationsService } from 'apps/gfw-portal/src/app/core/services/translate.service';
import { AccessManagementService } from 'libs/features/setting/src/services/access-management.service';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { finalize } from 'rxjs';
import { SkeletonModule } from "primeng/skeleton";

@Component({
  selector: 'lib-permissions-view',
  imports: [
    CommonModule,
    AccordionModule,
    InputSwitchModule,
    InputSearchComponent,
    FormsModule,
    ReactiveFormsModule,
    UiDropdownComponent,
    TranslateModule,
    ButtonModule,
    SkeletonModule
],
  templateUrl: './permissions-view.component.html',
  styleUrl: './permissions-view.component.scss',
})
export class PermissionsViewComponent {
  constructor(
    private _TranslateService: TranslationsService,
    private _accessManagementS: AccessManagementService,
    private _activatedRoute: ActivatedRoute,
    private _SharedService: SharedService,
    private messageService: MessageService,
    private _LayoutService: LayoutService,
    private _Translate: TranslateService
  ) {}
  ngOnInit() {
    this.getPermLevels();
    this.getPermTypes();
    this.checkLanguage();
    this.handleFilterChanges();
    this.getPermissions();
  }
  isArabicLang: boolean = false;
  checkLanguage() {
    this._TranslateService.selected_lan_sub.subscribe((res) => {
      this.isArabicLang = res === 'ar';
      console.log(res, 'lang');
    });
  }
  selectedPerm: any = [];
  handleSearch(event: string) {
    this.setControlValue('search', event);
  }

  setControlValue(control: string, value: any) {
    this.filtersForm?.get(control)?.setValue(value);
  }
  getControlValue(control: string) {
    this.filtersForm?.get(control)?.value;
  }

  applyFilters() {
    if(!this.selectedPerm.permissions)return
    const type = this.filtersForm.get('permissionsType')?.value?.toLowerCase();
    const level = this.filtersForm
      .get('permissionsLevel')
      ?.value?.toLowerCase();
    const search = this.filtersForm.get('search')?.value?.toLowerCase();

    const noFiltersApplied = !type && !level && !search;

    if (noFiltersApplied) {
      this.selectedPerm.permissions = this.selectedPerm.originalPermissions;
    } else {
      this.selectedPerm.permissions =
        this.selectedPerm.originalPermissions.filter((perm: any) => {
          const matchesType =
            !type || perm.permissionTypeName?.toLowerCase()?.includes(type);
          const matchesLevel =
            !level || perm.perLevelName?.toLowerCase()?.includes(level);
          const matchesSearch =
            !search || perm.name?.toLowerCase()?.includes(search);

          return matchesType && matchesLevel && matchesSearch;
        });
    }

    const selectedIds = this.getSelectedIds();
    this.selectedPerm.permissions.forEach((p: any) => {
      p.isChecked = selectedIds.includes(p.id);
    });

    this.onSwitchChange();
  }


  handleFilterChanges() {
    this.filtersForm.valueChanges.subscribe(() => {
      console.log('filter changed');

      this.applyFilters();
    });
  }
  permissionTypes = [];
  permissionLevels = [];

  filtersForm: FormGroup = new FormGroup({
    search: new FormControl(''),
    permissionsType: new FormControl(null),
    permissionsLevel: new FormControl(null),
  });
  roleId: any = '';
  markSelectedPermissionsAsChecked(data: any[]): any[] {
    function traverse(node: any) {
      if (node.permissions && Array.isArray(node.permissions)) {
        node.permissions.forEach((perm: any) => {
          if (perm.isSelected) {
            perm.isChecked = true;
          }
        });
      }

      // If this node has children, recursively traverse them
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach((child: any) => traverse(child));
      }
    }

    data.forEach((node) => traverse(node));

    return data;
  }
  loadingData:boolean=false
  getPermissions() {
    this._activatedRoute.parent?.paramMap.subscribe((res) => {
      this.roleId = res?.get('id');
      if (!this.roleId) return;
      this.loadingData = true
      this._accessManagementS
        .getPermissions(this.roleId)
        .pipe(finalize(() => this.loadingData = false))
        .subscribe((res: any) => {
          this.permissions = this.markSelectedPermissionsAsChecked(res['data']);
          this.handleSelectedPerm(this.permissions[0]);
          this.getRoleData();
        });
    });
  }

  permissions: any = [];
  toggleTab(tab: any) {
    setTimeout(() => {
      tab.isExpanded = !tab?.isExpanded;
    });
  }

  isAll: boolean = false;

  checkIfAllSelected(node: any): any {
    if (Array.isArray(node.permissions) && node.permissions.length > 0) {
      const allChecked = node.permissions.every(
        (perm: any) => perm.isChecked === true
      );
      if (allChecked) {
        node.allChecked = true;
      }
    }
    return node;
  }

  setCheckedRecursive(node: any, value: boolean): void {
    node.isChecked = value;

    if (Array.isArray(node.permissions)) {
      node.permissions.forEach((perm: any) => (perm.isChecked = value));
    }

    if (Array.isArray(node.children)) {
      node.children.forEach((child: any) =>
        this.setCheckedRecursive(child, value)
      );
    }
  }
  handleAllSelect(model: string) {
    if (model === 'selected') {
      console.log(this.selectedPerm?.permissions,'this.selectedPerm?.permissions before');
      
      this.selectedPerm?.permissions?.forEach(
        (perm: any) => (perm.isChecked = this.selectedPerm.allChecked)
      );

      console.log(this.selectedPerm?.permissions,'this.selectedPerm?.permissions after');
      console.log(this.permissions,'this.permissions');
      
      
    } else if (model === 'all') {
      const value = this.isAll;
      this.permissions?.forEach((permission: any) =>
        this.setCheckedRecursive(permission, value)
      );
    }
    this.onSwitchChange();
  }

  onSwitchChange(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    const updateAllChecked = (items: any[]) => {
      items.forEach((item) => {
        if (item.permissions && item.permissions.length > 0) {
          item.allChecked = item.permissions.every(
            (perm: any) => perm.isChecked
          );
        }

        if (item.children && item.children.length > 0) {
          updateAllChecked(item.children);
        }
      });
    };

    updateAllChecked(this.permissions);
    this.selectedPerm = this.checkIfAllSelected(this.selectedPerm);
    console.log(this.permissions, 'this.permissions');
  }

  handleSelectedPerm(selectedPerm: any) {
    console.log(selectedPerm, 'selected module here...');
    this.filtersForm.reset();
    // this.permissions?.forEach((perm: any) => {
    //   perm.isSelected = false;
    //   perm?.children?.forEach((child: any) => {
    //     child.isSelected = false;
    //     if (child?.children) {
    //       child?.children?.map((subChild: any) => {
    //         subChild.isSelected = false;
    //       });
    //     }
    //   });
    // });
    selectedPerm.isSelected = true;
    if (!selectedPerm?.permissions) return;
    this.selectedPerm = selectedPerm;

    this.selectedPerm?.permissions?.forEach(
      (perm: any) => (perm.name = perm.name?.split('_')?.join(' '))
    );
    this.selectedPerm = this.checkIfAllSelected(this.selectedPerm);
    this.selectedPerm.originalPermissions = JSON.parse(
      JSON.stringify(this.selectedPerm.permissions)
    );
    console.log(this.selectedPerm, 'this.selectedPerm');
    this.applyFilters();
  }

  getPermLevels() {
    console.log('test');

    this._SharedService.lookUps([60]).subscribe((res) => {
      console.log(res, 'perm levels here');
      this.permissionLevels = res?.data?.PermissionLevel;
    });
  }

  getPermTypes() {
    this._SharedService.lookUps([62]).subscribe((res) => {
      console.log(res, 'perm types here');
      this.permissionTypes = res?.data?.PermissionType;
    });
  }
  collectCheckedPermissions(data: any[]): any[] {
    const result: any[] = [];

    function traverse(node: any) {
      if (node.permissions) {
        const checked = node.permissions.filter((perm: any) => perm.isChecked);
        result.push(...checked);
      }

      if (node.children && node.children.length) {
        node.children.forEach((child: any) => traverse(child));
      }
    }

    data.forEach((item) => traverse(item));
    return result;
  }
  isSavingPerms: boolean = false;
  getSelectedIds() {
    const selectedPermissions = this.collectCheckedPermissions(
      this.permissions
    );
    const selectedIds = selectedPermissions.map((perm) => perm.id);
    return selectedIds;
  }
  savePermissions() {
    // if (!this.getSelectedIds()?.length) return;
    this.isSavingPerms = true;

    console.log(this.getSelectedIds(), 'selectedIds');
    this.filtersForm.reset()
    this._accessManagementS
      .savePermissions(this.getSelectedIds(), this.roleId)
      .subscribe({
        next: (res) => {
          {
            console.log(res, 'saved');
            this.messageService.add({
              severity: 'success',
              detail: 'Permissions saved successfully',
            });
            this.isSavingPerms = false;
          }
        },
        error: (err) => {
          this.isSavingPerms = false;
        },
      });
  }

  getRoleData() {
    this._accessManagementS.getRole(this.roleId).subscribe((res: any) => {
      console.log(res, 'role data');
      if (res) {
        this._LayoutService.breadCrumbLinks.next([
          {
            name: '',
            icon: 'fi fi-rs-home',
          },
          {
            name: this._Translate.instant('USERINFO.Setting'),
            icon: '',
            routerLink:
              '/gfw-portal/setting/access-management/roles&permssions',
          },
          {
            name: this._Translate.instant('USERINFO.AccessManagement'),
            icon: '',
            routerLink: '/gfw-portal/setting/access-management',
          },
          {
            name: this._Translate.instant(
              'BREAD_CRUMB_TITLES.ROLES_PERMSSIONS'
            ),
            icon: '',
            routerLink: `/gfw-portal/setting/access-management/roles&permssions`,
          },
          {
            name: res['data'].name || '-',
            icon: '',
            routerLink: `/gfw-portal/setting/access-management/roles&permssions/${this.roleId}/overview`,
          },
          {
            name: this._Translate.instant('TABS.PERMISSIONS'),
            icon: '',
          },
        ]);
      }
    });
  }
}
