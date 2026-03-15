import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { CalendarModule } from 'primeng/calendar';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InstanceService } from '../services/instance.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import {
  DatePackerComponent,
  TextareaUiComponent,
  UserDropdownComponent,
} from '@gfw/shared-ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import * as moment from 'moment';
import { Subscription, switchMap, tap } from 'rxjs';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-modify-instance',
  imports: [
    CommonModule,
    Button,
    InputSwitchModule,
    InputTextComponent,
    CalendarModule,
    DatePackerComponent,
    TextareaUiComponent,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    UiDropdownComponent,
    UserDropdownComponent,
  ],
  templateUrl: './modify-instance.component.html',
  styleUrl: './modify-instance.component.scss',
})
export class ModifyInstanceComponent implements OnDestroy {
  isSavingInstance: boolean = false;
  instanceId!: any;
  form!: FormGroup;
  userList: any[] = [];
  rolesList: any[] = [];
  instanceStatusList: any[] = [];
  dataResolver: any;
  finalLinks: any;
  dataBreadCrumb: any;
  riskTitle: any;
  idValue: any;
  containerKey = 'BREAD_CRUMB_TITLES.QUESTIONNAIRE';
  newBreadCrumb: any;
  private subscription: Subscription = new Subscription();
  constructor(
    private _instanceS: InstanceService,
    private _activatedRoute: ActivatedRoute,
    private _messageS: MessageService,
    private _router: Router,
    private _SharedService: SharedService,
    private layout: LayoutService,
    private _translateS: TranslateService,
    private _PermissionSystemService:PermissionSystemService
  ) {
    this.initialBreadCrumb();
    const permissions = this._activatedRoute.snapshot.data['permissions']
    this.moduleName = permissions?.module
    this.featureName = permissions?.feature
  }
    moduleName!:string;
  featureName!:string;

  initialBreadCrumb() {
    this._activatedRoute.data.subscribe((res) => {
      if (res['breadCrumbData']) {
        this.dataResolver = res['resolvedHandler'];
        this.newBreadCrumb = [...res['breadCrumbData']];
        this.getData(res['url_entity_id']);
      } else {
        this.dataBreadCrumb = [
          {
            name: this._translateS.instant(this.containerKey),
            routerLink: '/gfw-portal/questionnaire/instance',
          },
          {
            name: this.instanceId
              ? this.template_data?.name
              : this._translateS.instant('INSTANCE.ADD_NEW_INSTANCE'),
          },
        ];
        this.layout.breadCrumbLinks.next(this.dataBreadCrumb);
      }
    });
  }

  getData(url: any) {
    const paramEntityPath = this.dataResolver?.routerEntity;
    const routerLink = paramEntityPath.replace(
      '${id}',
      '/' + this.dataResolver?.entityId
    );
    const paramListPath = this.dataResolver?.routerList;
    const routerList = paramListPath.replace(
      '${id}',
      '/' + this.dataResolver?.entityId
    );
    this._SharedService
      .getEntityByUrl(url + this.dataResolver?.entityId)
      .subscribe((res: any) => {
        this.riskTitle = res?.data?.riskTitle;
        this.newBreadCrumb.splice(2, 0, {
          name: this.riskTitle || res?.data?.legalName,
          routerLink: routerLink,
        });
        this.newBreadCrumb.splice(3, 0, {
          name: 'Questionnaire',
          routerLink: routerList,
        });
        if (this.instanceId) {
          this.newBreadCrumb.splice(5, 4, { name: this.template_data?.name });
        }
        this.layout.breadCrumbLinks.next(this.newBreadCrumb);
      });
  }
  ngOnInit() {
    this.getInstanceId();
    this.initForm();
    this.getLookups();
    this.handleToggle()
  }
  initForm(data?: any) {
    this.form = new FormGroup({
      name: new FormControl(data?.name ?? null, Validators.required),
      nameAr: new FormControl(data?.nameAr ?? null, Validators.required),
      description: new FormControl(
        data?.description ?? null,
        Validators.required
      ),
      descriptionAr: new FormControl(
        data?.descriptionAr ?? null,
        Validators.required
      ),
      // dataEntityTypeID: new FormControl(65),
      // dataEntityID: new FormControl(1),
      assigneeUserID: new FormControl(data?.assigneeUserID ?? null),
      assigneeRoleID: new FormControl(data?.assigneeRoleID ?? null),
      // finalScore: new FormControl(data?.finalScore ?? null),
      isExternal: new FormControl(data?.isExternal ?? true),
      externalAccessToken: new FormControl(data?.externalAccessToken ?? null),
      externalLinkExpirationDate: new FormControl(
        data?.externalLinkExpirationDate
          ? new Date(data?.externalLinkExpirationDate)
          : null
      ),
      expirationDate: new FormControl(
        data ? new Date(data?.expirationDate) : null
      ),
    });
  }

  handleToggle(){
     this.form.get('isExternal')?.valueChanges.subscribe((isExternal) => {
    if (isExternal) {
      this.form.get('assigneeUserID')?.reset();
      this.form.get('assigneeRoleID')?.reset();
    } else {
      this.form.get('externalLinkExpirationDate')?.reset();
    }
  });
  }
  getLookups() {
    const status = this._SharedService.lookUps([195]).subscribe((res) => {
      this.instanceStatusList = res?.data?.QuestionnaireInstanceStatusType;
    });
    const role = this._SharedService.getRoleLookupData().subscribe((res) => {
      this.rolesList = res?.data;
    });
    const user = this._SharedService.getUserLookupData().subscribe((res) => {
      this.userList = res?.data;
    });
    this.subscription.add(status);
    this.subscription.add(role);
    this.subscription.add(user);
  }
  getInstanceId() {
    this.instanceId = this._activatedRoute.snapshot.paramMap.get('instanceId');
    if (!this.instanceId) return;
    this.getInstanceById(this.instanceId);
  }
  template_data: any;
  getInstanceById(id: string) {
    const sub = this._instanceS.getById(id).subscribe((res) => {
      this.template_data = res?.data;
      this.initialBreadCrumb();
      this.initForm(this.template_data);
      this.handleToggle()
    });
    this.subscription.add(sub);
  }
  routerList: any;
  navigateBack() {
    if (this.dataResolver?.entityId) {
      const paramListPath = this.dataResolver?.routerList;
      this.routerList = paramListPath.replace(
        '${id}',
        +this.dataResolver?.entityId
      );
    }
    this.dataResolver?.entityId
      ? this._router.navigate([this.routerList])
      : this._router.navigate(['/gfw-portal/questionnaire/instance']);
  }
  save() {
    const canAdd = this._PermissionSystemService.can(this.moduleName , this.featureName , 'ADD') 
    const canEdit = this._PermissionSystemService.can(this.moduleName , this.featureName , 'EDIT')
    if(this.instanceId && !canEdit)return
    if(!this.instanceId && !canAdd)return
    if (this.form.invalid) return;
    const data = {
      ...this.form.value,
      expirationDate: this.form.value.expirationDate ? moment(this.form.value.expirationDate).format(
        'YYYY-MM-DD'
      ):null,
    };
    data['dataEntityTypeID'] = this.dataResolver?.dataEntityTypeId;
    data['dataEntityID'] = this.dataResolver?.entityId;
    this.isSavingInstance = true;

    const msg = this.instanceId
      ? this._translateS.instant('BUTTONS.UPDATE')
      : this._translateS.instant('BUTTONS.created');
    const sub = this._instanceS.save(data, this.instanceId).subscribe({
      next: (res) => {
        this.isSavingInstance = false;
        this._messageS.add({
          severity: 'success',
          detail:
            this._translateS.instant('TEMPLATES.TEMPLATE') +
            `${msg}` +
            this._translateS.instant('ATTACHMENT.successfully'),
        });
        this.navigateBack();
      },
      error: (err) => (this.isSavingInstance = false),
    });
    this.subscription.add(sub);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
