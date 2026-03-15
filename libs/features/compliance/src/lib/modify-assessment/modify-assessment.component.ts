import { DatePackerComponent } from './../../../../../shared/shared-ui/src/lib/date-packer/date-packer.component';
import { UiDropdownComponent } from './../../../../../shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { InputTextComponent } from './../../../../../shared/shared-ui/src/lib/input-text/input-text.component';
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
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleDropdownComponent } from 'libs/shared/shared-ui/src/lib/role-dropdown/role-dropdown.component';
import { UserDropdownComponent } from 'libs/shared/shared-ui/src/lib/user-dropdown/user-dropdown.component';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { validations } from 'libs/shared/shared-ui/src/models/validation.model';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ComplianceAssessmntService } from '../../services/compliance-assessmnt.service';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { DropdownCheckboxComponent, TextareaUiComponent, SwitchUiComponent } from '@gfw/shared-ui';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-modify-assessment',
  imports: [
    CommonModule,
    FormsModule,
    AccordionModule,
    TranslateModule,
    ReactiveFormsModule,
    InputTextComponent,
    UiDropdownComponent,
    ButtonModule,
    RoleDropdownComponent,
    UserDropdownComponent,
    DatePackerComponent,
    RadioButtonModule,
    TextareaUiComponent,
    DropdownCheckboxComponent,
    SwitchUiComponent,
    TranslateModule
],
  templateUrl: './modify-assessment.component.html',
  styleUrl: './modify-assessment.component.scss',
})
export class ModifyAssessmentComponent {
  // Declaration Variables
  showUnits: boolean = true;
  Units: string = '';
  statusList: string[] = [];
  isSaving: boolean = false;
  assessmentId: string | number = '';
  form!: FormGroup;
  assessmnetStage: string = '';
  AssessmentStatusType: any[] = [];
  rolesLookUpData: string[] = [];
  usersLookUpData: string[] = [];
  assessorsLookUpData: string[] = [];
  firstId: string = '';
  nameValidation: validations[] = [
    { key: 'required', message: 'VALIDATIONS.NAME' },
  ];
  dateValidation: validations[] = [
    { key: 'required', message: 'VALIDATIONS.REQUIRED' },
  ];
  statusValidation: validations[] = [
    { key: 'required', message: 'VALIDATIONS.STATUS' },
  ];
  // initialize Contractor
  constructor(
    private _router: Router,
    private _sharedService: SharedService,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _activeRouter: ActivatedRoute,
    private _messageService: MessageService,
    private ComplianceAssessmntService: ComplianceAssessmntService,
    private _PermissionSystemService:PermissionSystemService
  ) {}
  // LifeCycle Hooks
  ngOnInit() {
    this.getUsersLookUp();
    this.getRolesLookUp();
    this.initForm();
    this.getLookups();
    this.handleBreadCamb();
  }
  // handle BreadCamb
  handleBreadCamb() {
    this._activeRouter.params.subscribe((params) => {
      this.assessmentId = params['id'];
      const lastCrumbName$ = this.assessmentId
        ? this.ComplianceAssessmntService.getAssessmnetById(this.assessmentId)
        : null;

      const baseBreadcrumb = [
        { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
        {
          name: this._TranslateService.instant('BREAD_CRUMB_TITLES.Compliance'),
          icon: '',
          routerLink: '/gfw-portal/compliance/assessments',
        },
        {
          name: this._TranslateService.instant('TABS.ASSESSMENT'),
          icon: '',
          routerLink: '/gfw-portal/compliance/assessments',
        },
      ];

      if (lastCrumbName$) {
        lastCrumbName$.subscribe({
          next: (res) => {
            this.initForm(res?.data);
            this._LayoutService.breadCrumbLinks.next([
              ...baseBreadcrumb,
              { name: res?.data?.name || '-', icon: '' },
            ]);
          },
        });
      } else {
        this._LayoutService.breadCrumbLinks.next([
          ...baseBreadcrumb,
          {
            name: this._TranslateService.instant(
              'BREAD_CRUMB_TITLES.ADD_Assessment'
            ),
            icon: '',
          },
        ]);
      }
    });
  }
  // Initialize Form
  initForm(data?: any) {
    this.form = new FormGroup({
      name: new FormControl(data?.name, Validators.required),
      startDate: new FormControl(
        data?.startDate
          ? moment(new Date(data.startDate)).format('MM-DD-YYYY')
          : null,
        Validators.required
      ),
      // closeDate: new FormControl(
      //   data?.closeDate
      //     ? moment(new Date(data.closeDate)).format('MM-DD-YYYY')
      //     : null      ),
      expectedCloseDate: new FormControl(
        data?.expectedCloseDate
          ? moment(new Date(data.expectedCloseDate)).format('MM-DD-YYYY')
          : null      ),
      evidenceGatheringDueDate: new FormControl(
        data?.evidenceGatheringDueDate
          ? moment(new Date(data.evidenceGatheringDueDate)).format('MM-DD-YYYY')
          : null
      ),
      // complianceAssessmentStatusTypeID: new FormControl(
      //   data?.complianceAssessmentStatusTypeID,
      //   Validators.required
      // ),
      responsableRoleID: new FormControl(data?.responsableRoleID),
      assessorUserIDs: new FormControl(
        data?.assessors?.map((ass: any) => ass.assessorUserID)
      ),
      description: new FormControl(data?.description),
      responsibleUserID: new FormControl(data?.responsableUserID),
      complianceAssessmentStageID: new FormControl(
        data?.complianceAssessmentStageId
      ),
      complianceAssessmentScopeTypeID: new FormControl(
        data?.complianceAssessmentScopeTypeID
      ),
      complianceDocumentID: new FormControl(data?.complianceDocumentID),
      // inclucePreviousAssessment:new FormControl(data?.inclucePreviousAssessment ?? false),
      // incluceRequirementAssessment:new FormControl(data?.incluceRequirementAssessment ?? false),
      // incluceProcedureAssessment:new FormControl(data?.incluceProcedureAssessment ?? false),
      // incluceMaturityAssessment:new FormControl(data?.incluceMaturityAssessment ?? false),
    });
  }
  // get Lookups Multi
  getLookups() {
    this._sharedService.lookUps([85, 86, 81, 88]).subscribe((res) => {
      this.statusList = res?.data?.ComplianceAssessmentStatusType;
      this.AssessmentStatusType = res?.data?.ComplianceAssessmentScopeType;
      this.Units = res?.data?.ComplianceDocument;
      this.assessmnetStage = res?.data?.ComplianceAssessmentStage;

      this.firstId = res?.data?.ComplianceAssessmentScopeType[0]?.id;
      this.form?.get('complianceAssessmentScopeTypeID')?.setValue(this.firstId);
    });
  }
  // handle show Units with index
  onScopeClick(id: number, index: number) {
    this.showUnits = index === 0;
  }
  // Navigated Back
  navigateBack() {
    this._router.navigate(['/gfw-portal/compliance/assessments']);
  }
  // load Roles
  getRolesLookUp() {
    this._sharedService.getRoleLookupData().subscribe((res) => {
      this.rolesLookUpData = res?.data;
    });
  }
  // load Users
  getUsersLookUp() {
    this._sharedService.getUserLookupData().subscribe((res) => {
      this.usersLookUpData = res?.data;
      this.assessorsLookUpData = JSON.parse(JSON.stringify(res?.data));
    });
  }
  // save New Assessment
  submit() {
    const canAdd = this._PermissionSystemService.can('COMPLIANCE' , 'ASSESSMENT' , 'ADD')
    const canEdit = this._PermissionSystemService.can('COMPLIANCE' , 'ASSESSMENT' , 'EDIT')
    if(this.assessmentId && !canEdit)return
    if(!this.assessmentId && !canAdd)return
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;

    [
      'startDate',
      'evidenceGatheringDueDate',
      'expectedCloseDate',
      'closeDate',
    ].forEach((key) => {
      if (formValue[key]) {
        formValue[key] = moment(formValue[key], 'MM-DD-YYYY')
          .utc(true)
          .toISOString();
      }
    });

    const payload = Object.fromEntries(
      Object.entries(formValue).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ''
      )
    );

    if (this.assessmentId) {
      payload['complianceAssessmentID'] = this.assessmentId;
    }

    this.isSaving = true;

    const request$ = this.assessmentId
      ? this.ComplianceAssessmntService.updateAssessmnet(payload)
      : this.ComplianceAssessmntService.createAssessmnet(payload);

    request$.subscribe({
      next: () => {
        this._messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.assessmentId
            ? this._TranslateService.instant(
                'MESSAGES.UPDATE_COMPLIANCE_SUCCESS'
              )
            : this._TranslateService.instant(
                'MESSAGES.ADD_ASSESSMENT_COMPLIANCE_SUCCESS'
              ),
        });
        this.isSaving = false;
        this._router.navigate(['/gfw-portal/compliance/assessments']);
        this.form.reset();
      },
      error: (err) => {
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.message || 'Something went wrong!',
        });
        this.isSaving = false;
      },
    });
  }
}
