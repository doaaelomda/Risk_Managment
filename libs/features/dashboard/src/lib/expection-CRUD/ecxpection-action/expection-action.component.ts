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
import { TextareaUiComponent } from '@gfw/shared-ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { DashboardLayoutService } from '../../../services/dashboard-layout.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-exceptions-action',
  standalone: true,
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
  templateUrl: './expection-action.component.html',
  styleUrls: ['./expection-action.component.scss'],
})
export class ExceptionsActionComponent implements OnInit {
  exceptionForm!: FormGroup;
  current_updated_id: any;
  generalId: any;
  isLoading = false;

  exceptionTypes: any[] = [];
  severityTypes: any[] = [];
  statusTypes: any[] = [];
  usersList: any[] = [];
  reviewFrequencyType: any[] = [];
  exceptionStatusType: any[] = [];

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
    this.initExceptionForm();
    this.loadLookups();

    this._ActivatedRoute.paramMap.subscribe((params: any) => {
      const exceptionId = params.get('ExceptionId');
      ;
      this.generalId = params.get('generalId');

      if (this.generalId) {
        this._LayoutService.breadCrumbLinks.next([
          { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
          {
            name: this._TranslateService.instant('EXCEPTIONS.LIST_TITLE'),
            icon: '',
            routerLink: `/gfw-portal/third-party/view/${this.generalId}/Exceptions`,
          },
          {
            name: this._TranslateService.instant('EXCEPTIONS.ADD_BUTTON'),
            icon: '',
          },
        ]);
      }

      if (exceptionId) {
        this.current_updated_id = exceptionId;
        this._dashboardLayoutService
          .getExceptionsById(exceptionId)
          .subscribe((res: any) => {
            this.initExceptionForm(res?.data);
            this._LayoutService.breadCrumbLinks.next([
              { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
              {
                name: this._TranslateService.instant('EXCEPTIONS.LIST_TITLE'),
                icon: '',
                routerLink: `/gfw-portal/third-party/view/${this.generalId}/Exceptions`,
              },
              {
                name: this.current_updated_id
                  ? res?.data?.name
                  : this._TranslateService.instant('EXCEPTIONS.ADD_BUTTON'),
                icon: '',
              },
            ]);
          });
      }
    });
  }

  initExceptionForm(data?: any) {
    this.exceptionForm = new FormGroup({
      name: new FormControl(data?.name, [Validators.required]),
      description: new FormControl(data?.description),
      grcExceptionTypeID: new FormControl(data?.grcExceptionTypeID, [
        Validators.required,
      ]),
      grcExceptionSeverityTypeID: new FormControl(
        data?.grcExceptionSeverityTypeID
      ),
      grcExceptionStatusTypeID: new FormControl(data?.grcExceptionStatusTypeID),
      exceptionStatusTypeID: new FormControl(data?.exceptionStatusTypeID),
      reviewFrequencyTypeID: new FormControl(data?.reviewFrequencyTypeID),
      justification: new FormControl(data?.justification),
      validFrom: new FormControl(
        data?.validFrom ? moment(data.validFrom).format('MM-DD-YYYY') : null
      ),
      validTo: new FormControl(
        data?.validTo ? moment(data.validTo).format('MM-DD-YYYY') : null
      ),
      approvalDate: new FormControl(
        data?.approvalDate
          ? moment(data.approvalDate).format('MM-DD-YYYY')
          : null
      ),
      requestedByUserID: new FormControl(data?.requestedByUserID),
      approvedByUserID: new FormControl(data?.approvedByUserID),
    });
  }

  loadLookups() {
    // Load exception types, severity, status
    this._SharedService
      .lookUps([187, 188, 189, 190, 191])
      .subscribe((res: any) => {
        this.exceptionTypes = res?.data?.GRCExceptionType;
        this.severityTypes = res?.data?.GRCExceptionSeverityType;
        this.statusTypes = res?.data?.GRCExceptionStatusType;
        this.exceptionStatusType = res?.data?.ExceptionStatusType;
        this.reviewFrequencyType = res?.data?.ReviewFrequencyType;
      });

    // Load users for Requested By / Approved By
    this._SharedService.getUserLookupData().subscribe((res: any) => {
      this.usersList = res?.data;
      this.approvalUsers=JSON.parse(JSON.stringify(res?.data))
    });
  }

  approvalUsers:any
  submit() {
    const canAdd = this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYEXCEPTIONS' , 'ADD')
    const canEdit = this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYEXCEPTIONS' , 'EDIT')
    if(this.current_updated_id && !canEdit)return
    if(!this.current_updated_id && !canAdd)return
    if (this.exceptionForm.invalid) {
      this.exceptionForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const nowIso = new Date().toISOString();
    const req = {
      ...this.exceptionForm.value,
      validFrom: this.exceptionForm.get('validFrom')?.value
        ? new Date(this.exceptionForm.get('validFrom')?.value).toISOString()
        : nowIso,
      validTo: this.exceptionForm.get('validTo')?.value
        ? new Date(this.exceptionForm.get('validTo')?.value).toISOString()
        : nowIso,
      approvalDate: this.exceptionForm.get('approvalDate')?.value
        ? new Date(this.exceptionForm.get('approvalDate')?.value).toISOString()
        : nowIso,
      dataEntityTypeID: 1,
      dataEntityID: this.generalId,
    };

    const API$ = this.current_updated_id
      ? this._dashboardLayoutService.updateExceptions(
          req,
          this.current_updated_id
        )
      : this._dashboardLayoutService.addExceptions(req);

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
          `/gfw-portal/third-party/view/${this.generalId}/Exceptions`,
        ]);
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
