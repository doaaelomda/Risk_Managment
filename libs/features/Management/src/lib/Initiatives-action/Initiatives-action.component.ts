import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { DatePackerComponent, UserDropdownComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { TextareaUiComponent } from '@gfw/shared-ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { MessageService } from 'primeng/api';
import { TasksService } from '../../services/tasks.service';
import * as moment from 'moment';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-initiatives-action',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextComponent,
    UiDropdownComponent,
    DatePackerComponent,
    ButtonModule,
    InputNumberComponent,
    TextareaUiComponent,
    TranslateModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './Initiatives-action.component.html',
  styleUrl: './Initiatives-action.component.scss',
})
export class InitiativesActionComponent implements OnInit {
  initiativeForm!: FormGroup;

  strategicObjectives: any[] = [];
  managerRoles: any[] = [];
  statusTypes: any[] = [];
  priorityLevels: any[] = [];
  updateFlagId = false;
  isLoading: boolean = false;
  validationsRequired: any[] = [
    { key: 'required', message: 'VALIDATIONS.REQUIRED' },
  ];
  constructor(
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _sharedService: SharedService,
    private _MessageService: MessageService,
    private _taskService: TasksService,
    private _Router: Router,
    private _ActiveRouter: ActivatedRoute,
    private _permissionService: PermissionSystemService
  ) {
    this._ActiveRouter.params.subscribe((params) => {
      this.updateFlagId = params['initiativeId'];
      if (this.updateFlagId) {
        this._taskService
          .getInitiativeById(this.updateFlagId)
          .subscribe((res: any) => {
            console.log(res.data, 'ressssssssssssssssss');
            this.initInitiativeForm(res?.data);
          });
      }
    });
  }
  ngOnInit(): void {
    this.initInitiativeForm();
    this.loadLookups();
    this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('INITIATIVE.Management'),
        icon: '',
        routerLink: '/gfw-portal/management/initiatives',
      },
      {
        name: this._TranslateService.instant('INITIATIVE.Initiative'),
        icon: '',
        routerLink: '/gfw-portal/management/initiatives',
      },

      {
        name: this.updateFlagId
          ? this._TranslateService.instant('INITIATIVE.UPDATE_INIT')
          : this._TranslateService.instant('INITIATIVE.ADD_INIT'),
        icon: '',
      },
    ]);
  }

  initInitiativeForm(data?: any) {
    this.initiativeForm = new FormGroup({
      name: new FormControl(data?.name, Validators.required),
      nameAr: new FormControl(data?.nameAr),
      description: new FormControl(data?.description),
      descriptionAr: new FormControl(data?.descriptionAr),
      // strategicObjectiveID: new FormControl(data?.strategicObjectiveID),
      startDate: new FormControl(
        data?.startDate
          ? moment(new Date(data?.startDate)).format('MM-DD-YYYY')
          : null
      ),
      endDate: new FormControl(
        data?.endDate
          ? moment(new Date(data?.endDate)).format('MM-DD-YYYY')
          : null
      ),
      initiativeManagerRoleID: new FormControl(
        data?.initiativeManagerRoleID,
        Validators.required
      ),
      initiativeStatusTypeID: new FormControl(data?.initiativeStatusTypeID),
      initiativePriorityLevelTypeID: new FormControl(
        data?.initiativePriorityLevelTypeID
      ),
      progressPercentage: new FormControl(data?.progressPercentage, [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ]),
    });
  }

  loadLookups() {
    // this.strategicObjectives = [{ id: 1, label: 'Objective 1' }];
    // this.managerRoles = [{ id: 1, label: 'Manager' }];
    // this.statusTypes = [{ id: 1, label: 'Active' }];
    // this.priorityLevels = [{ id: 1, label: 'High' }];
    this._sharedService.getRoleLookupData().subscribe((res: any) => {
      this.managerRoles = res?.data;
    });
    this._sharedService.lookUps([118, 119, 124]).subscribe((res: any) => {
      this.priorityLevels = res?.data?.InitiativePriorityLevelType;
      this.statusTypes = res?.data?.InitiativeStatusType;
      this.strategicObjectives = res?.data?.StrategicObjectivePriorityLevelType;
    });
  }

 submit() {  if (this.initiativeForm.invalid) {
    this.initiativeForm.markAllAsTouched();
    return;
  }

            // ===== Permissions =====
  const hasPermission = this.updateFlagId
    ? this._permissionService.can('MANAGEMENT' , 'INITIATIVE', 'EDIT')
    : this._permissionService.can('MANAGEMENT' , 'INITIATIVE', 'ADD');

  if (!hasPermission) {
    return;
  }
  this.isLoading = true;
  const payload = { ...this.initiativeForm.value };

  ['startDate', 'endDate'].forEach((key) => {
    if (payload[key]) {
      payload[key] = moment(payload[key]).toISOString();
    }
  });

  if (this.updateFlagId) {
    this._taskService.updateInitiative({ initiativeID: this.updateFlagId, ...payload }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this._MessageService.add({
          severity: 'success',
          summary: this._TranslateService.instant('Update Initiative Success'),
          detail: '',
          life: 3000,
        });
        this.initiativeForm.reset();
        this.updateFlagId = false;
        this._Router.navigate(['/gfw-portal/management/initiatives']);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  } else {
    this._taskService.CreateInitiative(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this._MessageService.add({
          severity: 'success',
          summary: this._TranslateService.instant('Add Initiative Success'),
          detail: '',
          life: 3000,
        });
        this.initiativeForm.reset();
        this._Router.navigate(['/gfw-portal/management/initiatives']);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}

}
