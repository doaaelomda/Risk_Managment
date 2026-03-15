import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { AccordionModule } from 'primeng/accordion';
import { DatePackerComponent, TextareaUiComponent } from '@gfw/shared-ui';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ComplianceService } from '../../../compliance/compliance.service';
import * as moment from 'moment';
import { finalize, Subscription } from 'rxjs';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-add-document',
  imports: [
    CommonModule,
    AccordionModule,
    InputTextComponent,
    ReactiveFormsModule,
    TranslateModule,
    DatePackerComponent,
    UiDropdownComponent,
    ButtonModule,
    MenuModule,
    RouterLink,
    TextareaUiComponent,
  ],
  templateUrl: './AddDocument.component.html',
  styleUrl: './AddDocument.component.scss',
})
export class AddDocumentComponent implements OnInit, OnDestroy {
  // ==================== Variables ====================
  roleId: any;
  organizationUnitOptions: any;
  ComplianceDocument!: FormGroup; // Main reactive form
  users: any[] = [];
  manager: any[] = [];
  DocumentTypeOptions: any[] = [];
  id: any;
  saveDataLoader = false;
  DocumentNames: any[] = [];
  GovControlMaturityLevelType: any[] = [];
  complianceAssessmentID: any;
  complianceStateTypeID: any;
  complianceDocumentStatusTypeID: any;
  clafficaions_profiles: any;
  showErrorResponsibility = false;
  GovControls: any[] = [];
  regularId: any;

  // Validation rules for title
  validationsTitle = [
    {
      key: 'required',
      message: 'VALIDATIONS.REQUIRED',
    },
  ];

  // Dropdown options
  languageCode :any[]=[]

  // Subscription management
  private destroy$ = new Subscription();

  // ==================== Constructor ====================
  constructor(
    private layoutService: LayoutService,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private complianceService: ComplianceService,
    private sharedService: SharedService,
    private _PermissionSystemService:PermissionSystemService
  ) {}

  // ==================== OnInit ====================
  ngOnInit(): void {
    // Get route params safely
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.regularId = this.route.snapshot.paramMap.get('regularId')!;
    this.initResponsibilityForm();
    this.loadLookups();
    this.loadLangDropDown()
    this.loadBreadcrumb();
  }

  // ==================== Load Lookup Data ====================
  private loadLookups(): void {
    this.destroy$.add(
      this.sharedService.lookUps([24, 82, 83 , 30,242]).subscribe((res: any) => {
        this.GovControls = res?.data?.GovRegulator;
        this.complianceStateTypeID = res?.data?.ComplianceStateType;
        this.complianceDocumentStatusTypeID =
          res?.data?.ComplianceDocumentStatusType;
          this.GovControlMaturityLevelType = res?.data?.GovControlMaturityLevelType;
          this.clafficaions_profiles = res?.data?.GRCDocumentElementClassificationProfile
      })
    );
  }

  // ==================== Load Lookup Language Data ====================
  private loadLangDropDown(){
    this.languageCode = [
    { value: 'AR', label: this.translateService.instant('language.AR') },
    { value: 'EN', label: this.translateService.instant('language.EN') },
  ];
  }

  // ==================== Load Breadcrumb ====================
  private loadBreadcrumb(): void {
    if (this.regularId) {
      this.layoutService.breadCrumbLinks.next([
        { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
        {
          name: this.translateService.instant('BREAD_CRUMB_TITLES.Compliance'),
          icon: '',
          routerLink: '/gfw-portal/compliance/competent_authorities',
        },
        {
          name: this.translateService.instant('BREAD_CRUMB_TITLES.DOCUMENTS'),
          icon: '',
          routerLink: '/gfw-portal/compliance/competent_authorities',
        },
        {
          name: this.translateService.instant(
            'BREAD_CRUMB_TITLES.COMPLIANCE_GOVERNANCE'
          ),
          icon: '',
          routerLink: `/gfw-portal/compliance/competent_authorities/${this.regularId}`,
        },
        {
          name: this.translateService.instant(
            'BREAD_CRUMB_TITLES.ADD_DOCUMENTS'
          ),
          icon: '',
        },
      ]);
    }

    if (this.id) {
      this.complianceService.getDocumentCompliance(this.id).subscribe((res) => {
        this.initResponsibilityForm(res?.data);

        if (this.regularId) {
          this.layoutService.breadCrumbLinks.next([
            { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
            {
              name: this.translateService.instant(
                'BREAD_CRUMB_TITLES.Compliance'
              ),
              icon: '',
              routerLink: '/gfw-portal/compliance/competent_authorities',
            },
            {
              name: this.translateService.instant(
                'BREAD_CRUMB_TITLES.DOCUMENTS'
              ),
              icon: '',
              routerLink: '/gfw-portal/compliance/competent_authorities',
            },
            {
              name: this.translateService.instant(
                'BREAD_CRUMB_TITLES.COMPLIANCE_GOVERNANCE'
              ),
              icon: '',
              routerLink: `/gfw-portal/compliance/competent_authorities/${this.regularId}`,
            },
            { name: res?.data?.name || '-', icon: '' },
          ]);
        } else {
          this.layoutService.breadCrumbLinks.next([
            { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
            {
              name: this.translateService.instant(
                'BREAD_CRUMB_TITLES.COMPLIANCE_GOVERNANCE'
              ),
              icon: '',
              routerLink: '/gfw-portal/compliance/complianceDocuments',
            },
            {
              name: this.translateService.instant(
                'BREAD_CRUMB_TITLES.DOCUMENTS'
              ),
              icon: '',
              routerLink: '/gfw-portal/compliance/complianceDocuments',
            },
            { name: res?.data?.name || '-', icon: '' },
          ]);
        }
      });
    }

    if (!this.id && !this.regularId) {
      this.layoutService.breadCrumbLinks.next([
        { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
        {
          name: this.translateService.instant(
            'BREAD_CRUMB_TITLES.COMPLIANCE_GOVERNANCE'
          ),
          icon: '',
          routerLink: '/gfw-portal/compliance/complianceDocuments',
        },
        {
          name: this.translateService.instant('BREAD_CRUMB_TITLES.DOCUMENTS'),
          icon: '',
          routerLink: '/gfw-portal/compliance/complianceDocuments',
        },
        {
          name: this.translateService.instant(
            'BREAD_CRUMB_TITLES.ADD_DOCUMENTS'
          ),
          icon: '',
        },
      ]);
    }
  }

  // ==================== Initialize Form ====================
  private initResponsibilityForm(data?: any): void {
    this.ComplianceDocument = new FormGroup({
      name: new FormControl(data?.name, Validators.required),
      nameAr: new FormControl(data?.nameAr),
      description: new FormControl(data?.description),
      descriptionAr: new FormControl(data?.descriptionAr),
      shortName: new FormControl(data?.shortName),
      govRegulatorID: new FormControl(
        data?.govRegulatorID || null,
        !this.regularId ? Validators.required : null
      ),
      documentCode: new FormControl(data?.documentCode),
      version: new FormControl(data?.version),
      languageCode: new FormControl(data?.languageCode),
      nextComplianceAssessmentDate: new FormControl(
        data?.nextComplianceAssessmentDate
          ? moment(new Date(data?.nextComplianceAssessmentDate)).format(
              'MM-DD-YYYY'
            )
          : null
      ),
      fromEffectiveDate: new FormControl(
        data?.fromEffectiveDate
          ? moment(new Date(data?.fromEffectiveDate)).format('MM-DD-YYYY')
          : null
      ),
      lastComplianceAssessmentDate: new FormControl(
        data?.lastComplianceAssessmentDate
          ? moment(new Date(data?.lastComplianceAssessmentDate)).format(
              'MM-DD-YYYY'
            )
          : null
      ),
      complianceDocumentStatusTypeID: new FormControl(
        data?.complianceDocumentStatusTypeID
      ),
      complianceStateTypeID: new FormControl(data?.complianceStateTypeID),
      complianceAssessmentID: new FormControl(data?.complianceAssessmentID),
      govControlMaturityLevelTypeID: new FormControl(data?.govControlMaturityLevelTypeID),
      grcDocumentElementClassificationProfileID:new FormControl(data?.grcDocumentElementClassificationProfileID ?? null)
    });
  }

  // ==================== Submit Form ====================
  submit(): void {

        const canAdd = this._PermissionSystemService.can('COMPLIANCE' , 'COMPLIANCEDOCUMENT' , 'ADD')
    const canEdit = this._PermissionSystemService.can('COMPLIANCE' , 'COMPLIANCEDOCUMENT' , 'EDIT')
    if(this.id && !canEdit)return
    if(!this.id && !canAdd)return
    if (this.ComplianceDocument.invalid) {
      this.ComplianceDocument.markAllAsTouched();
      return;
    }

    this.saveDataLoader = true;

    const payload: any = {
      ...this.ComplianceDocument.value,
      ...(this.regularId && { govRegulatorID: this.regularId }),
    };

    // Convert dates to ISO format
    [
      'lastComplianceAssessmentDate',
      'fromEffectiveDate',
      'nextComplianceAssessmentDate',
    ].forEach((key) => {
      if (payload[key]) {
        payload[key] = moment(new Date(payload[key]), 'MM-DD-YYYY')
          .utc(true)
          .toISOString();
      } else {
        delete payload[key];
      }
    });

    // Remove null/undefined values
    Object.keys(payload).forEach((key) => {
      if (payload[key] === null || payload[key] === undefined) {
        delete payload[key];
      }
    });

    const request$ = this.id
      ? this.complianceService.updateDocumentGov(this.id, {
          ...payload,
          complianceDocumentID: this.id,
        })
      : this.complianceService.createDocumentGov(payload);
    this.destroy$.add(
      request$.pipe(finalize(() => (this.saveDataLoader = false))).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: this.id ? 'Update Success' : 'Create Success',
            detail: this.id
              ? this.translateService.instant('DOCUMENTS.Update_SUCCESS')
              : this.translateService.instant('DOCUMENTS.Add_SUCCESS')
          });

          this.router.navigate([
            this.regularId
              ? `/gfw-portal/compliance/competent_authorities/${this.regularId}`
              : `/gfw-portal/compliance/complianceDocuments`,
          ]);
        },
      })
    );
  }

  // ==================== Component Destroy ====================
  ngOnDestroy(): void {
    // Complete all subscriptions
    this.destroy$.unsubscribe();
  }
}
