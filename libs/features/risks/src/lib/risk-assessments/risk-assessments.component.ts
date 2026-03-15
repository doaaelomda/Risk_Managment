import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DatePackerComponent,
  DeleteConfirmPopupComponent,
  TextareaUiComponent,
} from '@gfw/shared-ui';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuModule } from 'primeng/menu';
import { switchMap } from 'rxjs';
import { RiskService } from '../../services/risk.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { PrimengModule } from '@gfw/primeng';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { validations } from 'libs/shared/shared-ui/src/models/validation.model';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { SampleAssessmentComponent } from "../sample-assessment/sample-assessment.component";
import { CheckboxModule } from 'primeng/checkbox';
@Component({
  selector: 'lib-risk-assessments',
  imports: [
    CommonModule,
    MenuModule,
    CommonModule,
    PrimengModule,
    TranslateModule,
    InputTextComponent,
    ReactiveFormsModule,
    UiDropdownComponent,
    DatePackerComponent,
    TextareaUiComponent,
    FormsModule,
    DropdownModule,
    DeleteConfirmPopupComponent,
    NewTableComponent,
    SampleAssessmentComponent,
    CheckboxModule
],
  templateUrl: './risk-assessments.component.html',
  styleUrl: './risk-assessments.component.scss',
})
export class RiskAssessmentsComponent implements OnInit {


  isShowSample:boolean = true;
  riskData:any;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _MessageService: MessageService,
    private _Router: Router,
    private _SharedService: SharedService,
    private _RiskService: RiskService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    public _PermissionSystemService:PermissionSystemService
  ) {

    const setting:any[] = this._PermissionSystemService.getSETTING_USER();
console.log("Setting" , setting );
    const sampleSetting = setting.find((s:any)=> s?.code == 'S003')

    this.isShowSample = sampleSetting?.value == "false" ? false : true

    this._LayoutService.breadCrumbTitle.next(
      this._TranslateService.instant('BREAD_CRUMB_TITLES.RISK_MANGEMENT')
    );

    this._LayoutService.breadCrumbAction.next(null);
    this.initRiskForm();

    this._ActivatedRoute.parent?.paramMap.subscribe((res: any) => {
      console.log('res param', res);
      this.current_risk_id = Number(res.get('riskID'));
      this._ActivatedRoute.parent?.paramMap
        .pipe(
          switchMap((params) => {
            this.riskId = Number(params.get('riskID'));
            return this._RiskService.getOneRisk(this.riskId);
          })
        )
        .subscribe((res) => {
          this.riskTitle = res?.data.riskTitle;
          this.riskData = res?.data
          this._LayoutService.breadCrumbLinks.next([
            {
              name: '',
              icon: 'fi fi-rs-home',
              routerLink: '/',
            },
            {
              name: this._TranslateService.instant(
                'BREAD_CRUMB_TITLES.RISK_MANGEMENT'
              ),
              icon: '',
              routerLink: '/gfw-portal/risks-management/risks-list',
            },
            {
              name: this._TranslateService.instant(
                'BREAD_CRUMB_TITLES.RISK_LIST'
              ),
              icon: '',
              routerLink: '/gfw-portal/risks-management/risks-list',
            },
            {
              name: this.riskTitle || '---',
              icon: '',
              routerLink: `/gfw-portal/risks-management/risk/${this.current_risk_id}/overview`,
            },
            {
              name: this._TranslateService.instant(
                'BREAD_CRUMB_TITLES.Risk_Assessments'
              ),
              icon: '',
            },
          ]);
          this._LayoutService.breadCrumbAction.next(null);
        });
    });
    // this.riskId = this._ActivatedRoute.parent?.snapshot.paramMap.get('riskID');
    // console.log('Risk ID:', this.riskId);
    this.columnControl = {
      type: 'route',
      data: `/gfw-portal/risks-management/risk/${this.riskId}/assessment`,
    };
    this.items = [
      {
        label: this._TranslateService.instant('HEARDE_TABLE.Quik_Add'),
        command: () => {
          this.openQuickAddModal();
        },
      },
      {
        label: this._TranslateService.instant(
          'HEARDE_TABLE.ADD_NEW_RISK_ASSESS'
        ),
        command: () => {
          this._Router.navigate([
            `/gfw-portal/risks-management/risk/${this.current_risk_id}/assessment-action`,
          ]);
        },
      },
    ];
  }
  riskId: any;
  riskTitle: any;
  current_risk_id: any;
  visible: boolean = false;
  quickAddVisible: boolean = false;
  workflow: any = [];
  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }
  EffectivenessLevel: any = [];

  columnControl: any;

  // filter handler

  handleDataTable(event: any) {
    this.data_payload = event;
    this.getAsseementsData(event);
  }

  data_payload: any;

  ngOnInit(): void {
    this.getLookUpListsData();
    this.items_table = [
      {
        label: this._TranslateService.instant(
          'ASSESSMENT_RISK.VIEW_ASSESSMENT'
        ),
        icon: 'fi fi-rr-eye',
        command: () => {
          console.log('selected', this.current_row_selected);
          this._Router.navigate([
            '/gfw-portal/risks-management/risk/' + this.riskId + '/assessment/',
            this.current_row_selected,
          ]);
        },
        visible:()=> this._PermissionSystemService.can('RISKS','ASSESSMENT','VIEW')
      },
      {
        label: this._TranslateService.instant(
          'ASSESSMENT_RISK.DELETE_ASSESSMENT'
        ),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.actionDeleteVisible = true;
        },
        visible:()=> this._PermissionSystemService.can('RISKS','ASSESSMENT','DELETE')
      },
      {
        label: this._TranslateService.instant(
          'ASSESSMENT_RISK.UPDATE_ASSESSMENT'
        ),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this._Router.navigate([
            `/gfw-portal/risks-management/risk/${this.current_risk_id}/assessment-action/${this.current_row_selected}`,
          ]);
        },
        visible:()=> this._PermissionSystemService.can('RISKS','ASSESSMENT','EDIT')
      },
    ];
  }

  actionDeleteVisible: boolean = false;
  current_row_selected: any;
  setSelected(event: any) {
    console.log('selected', event);
    this.current_row_selected = event;
  }

  handleClosedDelete(event: boolean) {
    this.actionDeleteVisible = false;
  }

  loadDelted: boolean = false;

  deleteRiskAssesment() {
    if(!this._PermissionSystemService.can('RISKS','ASSESSMENT','DELETE')) return;
    this.loadDelted = true;
    this._RiskService.deleteRiskAssesment(this.current_row_selected).subscribe({
      next: () => {
        this.getAsseementsData();
        this.actionDeleteVisible = false;
        this.loadDelted = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Risk Assessment  Deleted Successfully!',
        });
      },
      error: (err) => {
        console.error('Delete failed', err);
        this.loadDelted = false;
      },
    });
  }

  items_table: any = [];

  items: any[] = [];
  dataTable: any[] = [];
  loading: boolean = true;

  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };

  getAsseementsData(payload?: any) {
    this.loading = true;
    this.dataTable = [];
    this._RiskService
      .getRiskAssessmentSearchNew(payload,this.riskId)
      .subscribe((res: any) => {
        this.dataTable = res?.data?.items;
        this.pageginationObj = {
          perPage: res?.data?.pageSize,
          currentPage: res?.data?.pageNumber,
          totalItems: res?.data?.totalCount,
          totalPages: res?.data?.totalPages,
        };
        this._SharedService.paginationSubject.next(this.pageginationObj);
        this.loading = false;
      });
  }
  uickAddVisible: boolean = false;

  saveQuickAdd() {
    console.log('Saving Quick Add...');
    this.quickAddVisible = false;
    this.submit();
  }
  openQuickAddModal() {
    this.quickAddVisible = true;
  }

  closeQuickAddModal() {
    this.quickAddVisible = false;
  }
  initRiskForm(data?: any) {
    this.form = new FormGroup({
      assessmentText: new FormControl(data ? data.riskTitle : null, [
        Validators.required,
      ]),
      assessmentCode: new FormControl(data ? data.assessmentCode : null, []),
      organizationalUnitID: new FormControl(
        data ? data.organizationalUnitID : null,
        []
      ),
      assessmentDate: new FormControl(
        data
          ? moment(new Date(data.assessmentDate)).format('MM-DD-YYYY')
          : null,
        []
      ),
      riskDescription: new FormControl(data ? data.riskDescription : null, []),
      assumptions: new FormControl(data ? data.assumptions : null, []),
      scope: new FormControl(data ? data.scope : null, []),
      contextSummary: new FormControl(data ? data.contextSummary : null, []),
      workflowId: new FormControl(data ? data.workflowId : null),
      riskAssessmentTypeID: new FormControl(
        data ? data.riskAssessmentTypeID : null
      ),
      controlEffectivenessLevelID: new FormControl(
        data ? data.controlEffectivenessLevelID : null
      ),
      show_asset: new FormControl({ value: true, disabled: true }),
      wfid: new FormControl(data ? data.wfid : null),
    });

    const dropdowns = [
      'assets',
      'workflowId',
      'riskTypeId',
      'controlEffectivenessLevelId',
    ];

    this.form.get('show_asset')?.valueChanges.subscribe((visible: boolean) => {
      dropdowns.forEach((key) => {
        const c = this.form.get(key);
        if (!c) return;
        if (visible) c.addValidators([]);
        else c.clearValidators();
        c.updateValueAndValidity();
      });
    });

    if (this.form.get('show_asset')?.value) {
      dropdowns.forEach((key) => this.form.get(key)?.addValidators([]));
    }
  }

  form!: FormGroup;
  isLoading: boolean = false;
  submit() {
    if(!this._PermissionSystemService.can('RISKS','ASSESSMENT','ADD')) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('values', this.form.value);
    const fullPayload = { ...this.form.value };
    const payload = Object.fromEntries(
      Object.entries(fullPayload).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ''
      )
    );
    this.isLoading = true;
    payload['riskID'] = this.riskId;
    // payload['AssessmentText'] = payload['riskTitle'];
    // payload.identifiedDate = new Date(payload.identifiedDate);
    // payload.expectedCloseDate = new Date(payload.expectedCloseDate);
    // payload.nextReviewDate = new Date(payload.nextReviewDate);
    console.log('payload sent to API', payload);
    const request$ = this._RiskService.saveRiskAssesment(payload);
    request$.subscribe({
      next: (res) => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Risk Assessment  saved successfully',
        });
        this.loading = false;
        this.isLoading = false;
        this.quickAddVisible = false;
        this.getAsseementsData();
        this.form.reset();
        // this._Router.navigate([`/gfw-portal/risks-management/risk/${this.current_risk_id}/assessment-action` ]);
      },
    });
  }
  getLookUpListsData() {
    this._RiskService.getRiskActionLookupData([18, 17, 14 , 240]).subscribe({
      next: (res: any) => {
        this.workflow = res?.data?.WorkFlow;
        this.Type = res?.data?.RiskAssessmentStatusType;
        this.EffectivenessLevel = res?.data?.RiskMethodologyRiskAssessemntControlEffectivenessLevel;
        // this.workflow = res?.data?.WorkFlow
        // this.Type = res?.data?.Type;
        // this.EffectivenessLevel = res?.data?.Type;
      },
    });
  }
  Type: any = [
    // {id:1,label:'Type1'},
    // {id:2,label:'Type2'},
    // {id:3,label:'Type3'}
  ];

  validations: validations[] = [
    {
      key: 'required',
      message: 'VALIDATIONS.RISKASS_REQUIRED',
    },
  ];
  validationsDate: validations[] = [
    {
      key: 'required',
      message: 'Identified Date Is Required',
    },
  ];

  validationsSelectRisk: validations[] = [
    {
      key: 'required',
      message: 'Select Risk Assessment  Is Required',
    },
  ];
  validationsStatus: validations[] = [
    {
      key: 'required',
      message: 'Risk Assessment  Assets Is Required',
    },
  ];
  validationsEffectivenessLevel: validations[] = [
    {
      key: 'required',
      message: 'EffectivenessLevel Is Required',
    },
  ];
  validationsOrganization: validations[] = [
    {
      key: 'required',
      message: 'Risk Assessment  Organization Is Required',
    },
  ];
  validationsCode: validations[] = [
    {
      key: 'required',
      message: 'Risk Assessment  Code Is Required',
    },
  ];
  validationsDes: validations[] = [
    {
      key: 'required',
      message: 'Scope Description Is Required',
    },
  ];
  validationsAssump: validations[] = [
    {
      key: 'required',
      message: 'Assumptions Description Is Required',
    },
  ];
  validationsSummary: validations[] = [
    {
      key: 'required',
      message: 'Context Summary Is Required',
    },
  ];
}
