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
  selector: 'lib-general-assessment-action',
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
    InputNumberComponent
  ],
  templateUrl: './general-assessment-action.component.html',
  styleUrl: './general-assessment-action.component.scss',
})
export class GeneralAssessmentActionComponent implements OnInit {
  constructor(
    private _Router: Router,
    private _MessageService: MessageService,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _ActivatedRoute: ActivatedRoute,
    private _dashboardLayoutService: DashboardLayoutService,
    private _TranslateService: TranslateService,
    private _PermissionSystemService:PermissionSystemService
  ) {}
  generalAssessmentForm!: FormGroup;
  current_updated_id: any;
  statusTypes: any[] = [];
  generalAssessmentArray = [];
  generalId: any;
  updateFlag = false;
  usersList: any;
  rolesList: any;
  ngOnInit(): void {
    this.initgeneralAssessmentForm();
    this.loadLookups();
    this._ActivatedRoute.paramMap.subscribe((res: any) => {
      const id = res.get('AssId');
      this.generalId = res.get('generalId');
      if (this.generalId) {
        this.breadCrumb = [
          this._LayoutService.breadCrumbLinks.next([
            {
              name: '',
              icon: 'fi fi-rs-home',
              routerLink: '/',
            },
            {
              name: this._TranslateService.instant(
                'GENERAL_ASSESSMENT.assessment'
              ),
              icon: '',
              routerLink: `/gfw-portal/third-party/view/${this.generalId}/assessment`,
            },
            {
              name: this.current_updated_id
                ? this._TranslateService.instant('INCIDENT.Update_Incident')
                : this._TranslateService.instant(
                    'GENERAL_ASSESSMENT.ADD_BUTTON'
                  ),
              icon: '',
            },
          ]),
        ];
      }
      if (id) {
        this.updateFlag = true;
        this.current_updated_id = id;

        this._dashboardLayoutService
          .getGeneralAssessmentsById(id)
          .subscribe((res: any) => {
            this.initgeneralAssessmentForm(res?.data);
                    this.breadCrumb = [
          this._LayoutService.breadCrumbLinks.next([
            {
              name: '',
              icon: 'fi fi-rs-home',
              routerLink: '/',
            },
            {
              name: this._TranslateService.instant(
                'GENERAL_ASSESSMENT.assessment'
              ),
              icon: '',
              routerLink: `/gfw-portal/third-party/view/${this.generalId}/assessment`,
            },
            {
              name: this.current_updated_id
                ? this._TranslateService.instant('INCIDENT.Update_Incident')
                : this._TranslateService.instant(
                    'GENERAL_ASSESSMENT.ADD_BUTTON'
                  ),
              icon: '',
            },
          ]),
        ];
          });
      } else {
        this.updateFlag = false;
        this.initgeneralAssessmentForm();
      }
    });
  }

  breadCrumb: any;
  severityLevels: any;
  sourceTypes: any;
  confidentailArray = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  nameVaildation: validations[] = [
    { key: 'required', message: 'VALIDATIONS.NAME' },
  ];
  initgeneralAssessmentForm(data?: any) {
    this.generalAssessmentForm = new FormGroup({
      name: new FormControl(data?.name, [Validators.required]),
      purpose: new FormControl(data?.purpose),
      scope: new FormControl(data?.scope),
      outOfScope: new FormControl(data?.outOfScope),
      overallScore: new FormControl(data?.overallScore),
      startDate: new FormControl(
        data?.startDate
          ? moment(new Date(data.startDate)).format('MM-DD-YYYY')
          : null,
      ),
      dueDate: new FormControl(
        data?.dueDate
          ? moment(new Date(data.dueDate)).format('MM-DD-YYYY')
          : null,
      ),
      generalAssessmentStatusTypeID: new FormControl(
        data?.generalAssessmentStatusTypeID,
        [Validators.required]
      ),
      responsibleUserID: new FormControl(data?.responsibleUserID, [
      ]),
      responsibleRoleID: new FormControl(data?.responsibleRoleID, []),
      generalAssessmentTypeID: new FormControl(data?.generalAssessmentTypeID, []),
    });
  }


  loadLookups() {
    this._SharedService.lookUps([149, 150]).subscribe({
      next: (res: any) => {
        ;
        this.statusTypes = res?.data?.GeneralAssessmentStatusType;
        this.generalAssessmentArray = res?.data.GeneralAssessmentType;
      },
    });
    this._SharedService.getUserLookupData().subscribe((res: any) => {
      this.usersList = res?.data;
    });
    this._SharedService.getRoleLookupData().subscribe((res: any) => {
      this.rolesList = res?.data;
    });
  }

  isLoading: boolean = false;
  validationsRequired: any[] = [
    { key: 'required', message: 'VALIDATIONS.REQUIRED' },
  ];

  submit() {
    const canAdd = this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYASSESSMENT' , 'ADD')
    const canEdit = this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYASSESSMENT' , 'EDIT')
    if(this.current_updated_id && !canEdit)return
    if(!this.current_updated_id && !canAdd)return
    if (this.generalAssessmentForm.invalid) {
      this.generalAssessmentForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const req = {
      ...this.generalAssessmentForm.value,
      dueDate: moment(
        this.generalAssessmentForm.get('dueDate')?.value,
        'MM-DD-YYYY'
      )
        .utc(true)
        .toISOString(),
      startDate: moment(
        this.generalAssessmentForm.get('startDate')?.value,
        'MM-DD-YYYY'
      )
        .utc(true)
        .toISOString(),
      dataEntityID:this.generalId ,
      dataEntityTypeID: 1,
    };

    if (this.current_updated_id) {
      req['generalAssessmentID'] = this.current_updated_id;
    }

    const API$ = this.current_updated_id
      ? this._dashboardLayoutService.updateGeneralAssessments(
          req,
          this.current_updated_id
        )
      : this._dashboardLayoutService.addGeneralAssessments(req);

    API$.pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((res: any) => {
      this._MessageService.add({
        severity: 'success',
        summary: 'Success',
        detail: this.current_updated_id
          ? 'General Assessment Successfully'
          : 'General Assessment Added Successfully ',
      });
      this._Router.navigate([`gfw-portal/third-party/view/${this.generalId}/assessment`]);
    });
  }
}
