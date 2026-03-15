import { validations } from 'libs/shared/shared-ui/src/models/validation.model';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
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
import { DatePackerComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { TextareaUiComponent } from '@gfw/shared-ui';
import { CurrencyInputComponent } from '@gfw/shared-ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize, forkJoin, switchMap } from 'rxjs';
import { RoleDropdownComponent } from '@gfw/shared-ui';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { DashboardLayoutService } from '../../../services/dashboard-layout.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-activity-action',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextComponent,
    UiDropdownComponent,
    DatePackerComponent,
    ButtonModule,
    TextareaUiComponent,
    TranslateModule,
    RouterLink,
  ],
  templateUrl: './activity-action.component.html',
  styleUrl: './activity-action.component.scss',
})
export class ActivityActionComponent implements OnInit {
  activityForm!: FormGroup;
  current_updated_id: any;
  generalId: any;
  isLoading = false;

  activityTypes: any[] = [];
  channelTypes: any[] = [];
  directionTypes: any[] = [];
  statusTypes: any[] = [];
  usersList: any[] = [];
  rolesList: any[] = [];

  validationsRequired = [{ key: 'required', message: 'VALIDATIONS.REQUIRED' }];

  constructor(
    private _Router: Router,
    private _MessageService: MessageService,
    private _SharedService: SharedService,
    private _ActivatedRoute: ActivatedRoute,
    private _TranslateService: TranslateService,
    private _dashboardLayoutService: DashboardLayoutService,
    private _LayoutService: LayoutService,
    private _PermissionSystemService:PermissionSystemService
  ) {}

  ngOnInit(): void {
    this.initActivityForm();
    this.loadLookups();
    this._ActivatedRoute.paramMap.subscribe((res: any) => {
      const activityId = res.get('ActivityId');
      this.generalId = res.get('generalId');
      if (this.generalId) {
        this._LayoutService.breadCrumbLinks.next([
          {
            name: '',
            icon: 'fi fi-rs-home',
            routerLink: '/',
          },
          {
            name: this._TranslateService.instant('ACTIVITY.LIST_TITLE'),
            icon: '',
            routerLink: `/gfw-portal/third-party/view/${this.generalId}/Activity`,
          },
          {
            name: this.current_updated_id
              ? this._TranslateService.instant('INCIDENT.Update_Incident')
              : this._TranslateService.instant('ACTIVITY.ADD_BUTTON'),
            icon: '',
          },
        ]);
      }
      if (activityId) {
        this.current_updated_id = activityId;
        this._dashboardLayoutService
          .getActivityById(activityId)
          .subscribe((res: any) => {
            this.initActivityForm(res?.data);
          });
        this._LayoutService.breadCrumbLinks.next([
          {
            name: '',
            icon: 'fi fi-rs-home',
            routerLink: '/',
          },
          {
            name: this._TranslateService.instant('ACTIVITY.LIST_TITLE'),
            icon: '',
            routerLink: `/gfw-portal/third-party/view/${this.generalId}/Activity`,
          },
          {
            name: this.current_updated_id
              ? this._TranslateService.instant('INCIDENT.Update_Incident')
              : this._TranslateService.instant('ACTIVITY.ADD_BUTTON'),
            icon: '',
          },
        ]);
      }
    });
  }

  initActivityForm(data?: any) {
    this.activityForm = new FormGroup({
      name: new FormControl(data?.name, [Validators.required]),
      description: new FormControl(data?.description),
      activityTypeID: new FormControl(data?.activityTypeID, [
        Validators.required,
      ]),
      activityChannelTypeID: new FormControl(data?.activityChannelTypeID),
      activityDirectionTypeID: new FormControl(data?.activityDirectionTypeID),
      activityStatusTypeID: new FormControl(data?.activityStatusTypeID),
      activityDate: new FormControl(
        data?.activityDate
          ? moment(new Date(data.activityDate)).format('MM-DD-YYYY')
          : null
      ),
      dueDate: new FormControl(
        data?.dueDate
          ? moment(new Date(data.dueDate)).format('MM-DD-YYYY')
          : null
      ),
      isCompleted: new FormControl(data?.isCompleted || false),
      responsibleUserID: new FormControl(data?.responsibleUserID),
      responsibleRoleID: new FormControl(data?.responsibleRoleID),
    });
  }

  loadLookups() {
    this._SharedService.lookUps([171, 172, 173, 170]).subscribe((res: any) => {
      this.activityTypes = res?.data?.ActivityType;
      this.channelTypes = res?.data?.ActivityChannelType;
      this.directionTypes = res?.data?.ActivityDirectionType;
      this.statusTypes = res?.data?.ActivityStatusType;
    });

    this._SharedService
      .getUserLookupData()
      .subscribe((res: any) => (this.usersList = res?.data));
    this._SharedService
      .getRoleLookupData()
      .subscribe((res: any) => (this.rolesList = res?.data));
  }

  submit() {
    const canAdd = this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYACTIVITY' , 'ADD')
    const canEdit = this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYACTIVITY' , 'EDIT')
if(this.current_updated_id && !canEdit)return
    if(!this.current_updated_id && !canAdd)return

    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const req = {
      ...this.activityForm.value,
      dueDate: moment(this.activityForm.get('dueDate')?.value, 'MM-DD-YYYY')
        .utc(true)
        .toISOString(),
      activityDate: moment(
        this.activityForm.get('activityDate')?.value,
        'MM-DD-YYYY'
      )
        .utc(true)
        .toISOString(),
      dataEntityID: 1,
      dataEntityTypeID: 40,
    };

    const API$ = this.current_updated_id
      ? this._dashboardLayoutService.updateActivity(
          req,
          this.current_updated_id
        )
      : this._dashboardLayoutService.addActivity(req);

    API$.pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: () => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.current_updated_id
            ? this._TranslateService.instant('MESSAGES.UPDATE_SUCCESS')
            : this._TranslateService.instant('MESSAGES.ADD_SUCCESS'),
        });
        this._Router.navigate([
          `/gfw-portal/third-party/view/${this.generalId}/Activity`,
        ]);
      },
    });
  }
}
