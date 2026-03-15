/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TextareaUiComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { EditorComponent } from 'libs/shared/shared-ui/src/lib/editor/editor.component';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { DropdownCheckboxComponent } from '@gfw/shared-ui';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { finalize, Observable, Subscription, switchMap, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { SafeHtmlPipe } from "../../../../../../../apps/gfw-portal/src/app/core/pipes/safeHtml.pipe";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-template-action',
  imports: [
    CommonModule,
    DropdownCheckboxComponent,
    EditorComponent,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    InputTextComponent,
    ButtonModule,
    TextareaUiComponent,
    DialogModule,
    UiDropdownComponent,
    SafeHtmlPipe,
  ],
  templateUrl: './template-action.component.html',
  styleUrl: './template-action.component.scss',
})
export class TemplateActionComponent implements OnInit {
  ngOnInit(): void {
    this.initBascisInfoForm();
    this.initInternalForm();
    this.initExternalForm();
    this.getEventId();

    this._ActivatedRoute.paramMap
      .pipe(
        tap((res) => {
          console.log('params', res.get('tempId'));
        }),
        switchMap((res) => {
          if (!res.get('tempId')) {
            this.current_mode = 'add';
            this.breadCrumb[this.breadCrumb.length - 1].name = 'Add Template';
            return [];
          }

          this.current_mode = 'edit';
          this.current_update_id = res.get('tempId');
          return this._NotificationService.getSingleTemplate(res.get('tempId'));
        })
      )
      .subscribe((res) => {
        if (res?.data) {
          this.breadCrumb[
            this.breadCrumb.length - 1
          ].name = `${res?.data?.name}`;
          this.initBascisInfoForm(res?.data);
          this.initInternalForm(res?.data);
          this.initExternalForm(res?.data);
        }
      });
  }

  current_update_id: any;
  show_varaible: boolean = false;

  breadCrumb: any[] = [];
  recivers: any[] = [];
  constructor(
    private _Router: Router,
    private _MessageService: MessageService,
    private _NotificationService: NotificationService,
    private _ActivatedRoute: ActivatedRoute,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    public _PermissionSystemService: PermissionSystemService
  ) {
    this.breadCrumb = [
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('Dashboard.BREADCRUMB.SETTING'),
        icon: '',
        routerLink: '/gfw-portal/setting',
      },
      {
        name: '-',
        icon: '',
        routerLink: '/gfw-portal/setting/notification-settings/list',
      },
      {
        name: '-',
        icon: '',
        routerLink: '',
      },
      {
        name: '-',
        icon: '',
        routerLink: '',
      },
    ];
    this._LayoutService.breadCrumbLinks.next(this.breadCrumb);
    this.steps = [
      {
        name: this._TranslateService.instant('NOTIFICATION_SETTING.BASIC_INFO'),
        id: 1,
        description: this._TranslateService.instant(
          'NOTIFICATION_SETTING.ENTER_YOUR_DATA'
        ),
        icon: 'fi fi-rr-ballot',
        command: () => {
          this.currentStep = 1;
        },
        visible: () =>
          this._PermissionSystemService.can(
            'NOTIFICATIONS',
            'TEMPLATE',
            'VIEW'
          ),
      },
      {
        id: 2,
        name: this._TranslateService.instant(
          'NOTIFICATION_SETTING.INTERNAL_NOTIFICATION'
        ),
        icon: 'fi fi-rr-bell',
        description: this._TranslateService.instant(
          'NOTIFICATION_SETTING.SET_INTERNAL_NOTIFICATION'
        ),
        command: () => {
          if (this.current_mode == 'edit') {
            this.currentStep = 2;
          }
        },
        visible: () =>
          this._PermissionSystemService.can(
            'NOTIFICATIONS',
            'INTERNALNOTIFICATION',
            'VIEW'
          ),
      },

      {
        id: 3,
        name: this._TranslateService.instant(
          'NOTIFICATION_SETTING.EXTERNAL_NOTIFICATION'
        ),
        icon: 'fi fi-rr-envelope',
        description: this._TranslateService.instant(
          'NOTIFICATION_SETTING.SET_EXTERNAL_NOTIFICATION'
        ),
        command: () => {
          if (this.current_mode == 'edit') {
            this.currentStep = 3;
          }
        },
        visible: () =>
          this._PermissionSystemService.can(
            'NOTIFICATIONS',
            'EXTERNALNOTIFICATION',
            'VIEW'
          ),
      },
    ];
  }
  handleCancel() {
    const routeTo = `/gfw-portal/setting/notification-settings/${this.current_event_id}/templates`;
    this._Router.navigate([routeTo]);
  }
  getEventId() {
    this._ActivatedRoute?.paramMap
      .pipe(
        tap((res) => {
          console.log('res param', res.get('id'));
          this.current_event_id = res.get('id');
        })
      )
      .subscribe((res: any) => {
        this.getCurrentEventData();
      });
  }

  getCurrentEventData() {
    this._NotificationService
      .getEventById(this.current_event_id)
      .subscribe((res: any) => {
        this.current_event_data = res?.data;
        this.breadCrumb[2].name =
          this.current_event_data?.notificationEventGroupName;
        this.breadCrumb[3].name =
          this.current_event_data?.notificationEventName;
        this.breadCrumb[3].routerLink = `/gfw-portal/setting/notification-settings/${this.current_event_data?.notificationEventID}/templates`;
        this.getReceivers();
        this.getAttributes();
        this.getUsers();
        this.loadRoles();
      });
  }

  mangerUsers: any[] = [];
  rolesList: any[] = [];
  getUsers() {
    this._SharedService.getUserLookupData().subscribe((res: any) => {
      this.mangerUsers = res?.data;
    });
  }

  loadRoles() {
    this._SharedService.getRoleLookupData().subscribe((res: any) => {
      this.rolesList = res?.data;
    });
  }
  getReceivers() {
    this._NotificationService
      .getTemplateRecivers(this.current_event_data?.dataEntityTypeID)
      .subscribe((res) => {
        this.recivers = res?.data;
      });
  }

  getAttributes() {
    console.log('curresnt event', this.current_event_data);

    this._SharedService
      .getDataEntityAttributesNew(this.current_event_data?.dataEntityTypeID)
      .subscribe((res: any) => {
        this.varaibles_list = res?.data.map((item: any) => {
          return {
            ...item,
            isSelected: false,
          };
        });
      });
  }

  current_event_data: any;

  current_event_id: any = null;

  currentStep: any = 1;

  steps: any[] = [];

  status: any[] = [
    {
      id: 1,
      label: 'Active',
      value: true,
    },
    {
      id: 2,
      label: 'InActive',
      value: false,
    },
  ];

  varaibles_list: any[] = [];

  basicsInfoForm!: FormGroup;

  initBascisInfoForm(data?: any) {
    let receiverIDs: any[] = [];
    let userReceivers: any[] = [];
    let roleReceivers: any[] = [];
    if (data) {
      receiverIDs = data?.attributeReceivers?.map((recever: any) => {
        return recever?.dataEntityTypeAttributeID;
      });
      userReceivers = data?.userReceivers?.map((recever: any) => {
        return recever?.userID;
      });
      roleReceivers = data?.roleReceivers?.map((recever: any) => {
        return recever?.roleID;
      });
    }
    this.basicsInfoForm = new FormGroup({
      name: new FormControl(data?.name || '', Validators.required),
      attributeReceiverIDs: new FormControl(receiverIDs || []),
      userReceiverIDs: new FormControl(userReceivers || []),
      roleReceiverIDs: new FormControl(roleReceivers || []),
      isActive: new FormControl(data?.isActive, Validators.required),
    });
  }

  internalForm!: FormGroup;

  initInternalForm(data?: any) {
    this.internalForm = new FormGroup({
      internalTemplateTitle: new FormControl(
        data?.internalTemplateTitle || null
      ),
      internalTemplateTitleAr: new FormControl(
        data?.internalTemplateTitleAr || null
      ),
      internalTemplateContent: new FormControl(
        data?.internalTemplateContent || null
      ),
      internalTemplateContentAr: new FormControl(
        data?.internalTemplateContentAr || null
      ),
    });
  }
  externalForm!: FormGroup;

  initExternalForm(data?: any) {
    this.externalForm = new FormGroup({
      externalTemplateTitle: new FormControl(
        data?.externalTemplateTitle || null
      ),
      externalTemplateTitleAr: new FormControl(
        data?.externalTemplateTitleAr || null
      ),
      externalTemplateContent: new FormControl(
        data?.externalTemplateContent || null
      ),
      externalTemplateContentAr: new FormControl(
        data?.externalTemplateContentAr || null
      ),
    });
  }

  currentControlEffect!: AbstractControl | null;

  handleVaraibleControl(control: AbstractControl) {
    this.currentControlEffect = control;
    this.show_varaible = true;
  }

  setVariableInput(varaible: any) {
    if (!varaible.notificationTagName) return;
    if (this.currentControlEffect && !varaible.isSelected) {
      const currentValue = this.currentControlEffect.value || '';
      this.currentControlEffect.setValue(
        currentValue + ' ' + `{{${varaible.notificationTagName}}}`
      );
      varaible.isSelected = true;
    }
  }

  resetVaraibleList() {
    this.varaibles_list = this.varaibles_list.map((item: any) => {
      return {
        ...item,
        isSelected: false,
      };
    });
  }
  disabledBtn() {
    switch (this.currentStep) {
      case 1:
        return this.basicsInfoForm.invalid;

      case 2:
        return this.internalForm.invalid;
      case 3:
        return this.externalForm.invalid;
      default:
        return false;
    }
  }

  current_mode: string = 'add';
  saveSub$!: Subscription;
  load_save: boolean = false;
  handleSubmitData() {
      const hasPermission = this.current_mode
    ? this._PermissionSystemService.can('NOTIFICATIONS', 'TEMPLATE', 'EDIT')
    : this._PermissionSystemService.can('NOTIFICATIONS', 'TEMPLATE', 'ADD');

  if (!hasPermission) {
    return;
  }
    this.load_save = true;
    let req: any;
    let API$!: Observable<any>;
    switch (this.currentStep) {
      case 1:
        req = {
          ...this.basicsInfoForm.value,
          notificationEventID: +this.current_event_id,
        };
        if (this.current_mode == 'edit') {
          req.notificationTemplateID = +this.current_update_id;
        }
        API$ =
          this.current_mode == 'add'
            ? this._NotificationService.addNotificationTemplateBasicsInfo(req)
            : this._NotificationService.updateNotificationTemplateBasicsInfo(
                req
              );
        this.saveSub$ = API$.pipe(
          finalize(() => (this.load_save = false))
        ).subscribe((res: any) => {
          if (!this.current_update_id) {
            this.current_update_id = res?.data?.notificationTemplateID;
          }
          this.current_mode = 'edit';
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Basics Info Saved Successfully!',
          });
          this.load_save = false;
          this.currentStep = 2;
        });
        break;

      case 2:
        req = {
          ...this.internalForm.value,
          notificationEventID: +this.current_event_id,
          notificationTemplateID: +this.current_update_id,
        };
        API$ = this._NotificationService.saveInternalNotification(req);
        this.saveSub$ = API$.pipe(
          finalize(() => (this.load_save = false))
        ).subscribe((res: any) => {
          this.load_save = false;
          this.current_mode = 'edit';
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: ' Internal Notification Saved Successfully!',
          });
          this.currentStep = 3;
        });
        break;
      case 3:
        req = {
          ...this.externalForm.value,
          notificationEventID: +this.current_event_id,
          notificationTemplateID: +this.current_update_id,
        };
        API$ = this._NotificationService.saveExternalNotification(req);
        this.saveSub$ = API$.pipe(
          finalize(() => (this.load_save = false))
        ).subscribe((res: any) => {
          this.load_save = false;
          this.current_mode = 'edit';
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: ' External Notification Saved Successfully!',
          });
          this._Router.navigate([
            `/gfw-portal/setting/notification-settings/${this.current_event_id}/templates`,
          ]);
        });
        break;
      default:
        break;
    }
  }

  getVisibleCount(): number {
    return this.steps.filter((s) => s.visible()).length;
  }
  get visibleSteps() {
  return this.steps.filter(step => step?.visible());
}

}
