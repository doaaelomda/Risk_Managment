import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { AccessManagementService } from 'libs/features/setting/src/services/access-management.service';
import { TranslationsService } from 'apps/gfw-portal/src/app/core/services/translate.service';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { InputSearchComponent } from '@gfw/shared-ui';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lib-roles-user',
  imports: [
    CommonModule,
    AccordionModule,
    ButtonModule,
    TableModule,
    InputSwitchModule,
    FormsModule,
    CdkDropList,
    CdkDrag,
    InputSearchComponent,
    TranslateModule,
  ],
  templateUrl: './rolesUser.component.html',
  styleUrl: './rolesUser.component.css',
})
export class RolesUserComponent {
  checked: boolean = false;
  checked2: boolean = false;
  constructor(
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _accessManagementS: AccessManagementService,
    private _translationService: TranslationsService,
    private messageService:MessageService,
    private _activatedRoute:ActivatedRoute
  ) {}

  ngOnInit() {
    this.getUser();
    this.getAllRoles();
    this.checkLanguage();

  }
  isArabicLang: boolean = false;
  checkLanguage() {
    this._translationService.selected_lan_sub.subscribe((res) => {
      this.isArabicLang = res === 'ar';
      console.log(res, 'lang');
    });
  }
  search: any = '';
  isSaving: boolean = false;
  saveRoles() {
    this.isSaving = true;
    const roleIds: any[] = [];
    this.myRoles?.map((role) => roleIds.push(role.id));
    this._accessManagementS.modifyUserRoles(this.userId, roleIds).subscribe({
      next: (res) => {
        this.isSaving = false;
        console.log(res, 'updated');
        this.messageService.add({severity:'success',detail:'User roles updated successfully'})
      },
      error: (err) => {
        this.isSaving = false;
      },
    });
  }
  getAllRoles() {
    this._accessManagementS.GetAllRolesinUser().subscribe((res: any) => {
      console.log(res, 'got roles');
      this.allRoles = res?.data;
      this.syncRoles();
    });
  }
  handleSearch(event: any) {
    this.search = event?.toLowerCase() || '';

    if (!this.search) {
      // reset when empty
      this.allRoles = [...this.allRolesOriginal];
      // this.myRoles = [...this.myRolesOriginal];
    } else {
      this.allRoles = this.allRolesOriginal.filter((role) =>
        role.name.toLowerCase().includes(this.search)
      );
      // this.myRoles = this.myRolesOriginal.filter((role) =>
      //   role.name.toLowerCase().includes(this.search)
      // );
    }
  }

  myRoles: any[] = [];
  allRoles: any[] = [];
  allRolesOriginal: any[] = [];
  myRolesOriginal: any[] = [];
  syncRoles() {
    this.allRoles = this.allRoles.filter(
      (role) => !this.myRoles.some((myRole) => myRole.id === role.id)
    );
    this.allRolesOriginal = [...this.allRoles];
    this.myRolesOriginal = [...this.myRoles];
  }
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }


  }

  getRoleIcon(roleType: string) {
    if (!roleType) return 'fi fi-rr-member-search';
    const isPosition = roleType === 'Position';
    const isPermissions = roleType === 'Permission Group';
    const isTeam = roleType === 'Team';

    return isPosition
      ? 'fi fi-rr-user'
      : isPermissions
      ? 'fi fi-rr-padlock-check'
      : isTeam
      ? 'fi fi-rr-users'
      : 'fi fi-rr-user-question';
  }
  getUserRoles(id: any) {
    this._accessManagementS.getUserRoles(id).subscribe((res:any) => {
      console.log(res, 'users roles here');
      this.myRoles = res?.data || []
      this.syncRoles();
    });
  }
  userId: any = '';
  getUser() {
    this._activatedRoute.parent?.paramMap.subscribe((res: any) => {
      const userId = res?.get('id')
      if(!userId) return
      this.getUserRoles(userId);
      this.userId = userId;
      console.log('got user', res);
    });
  }
}
