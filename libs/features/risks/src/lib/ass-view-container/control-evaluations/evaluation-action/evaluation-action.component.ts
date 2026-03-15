/* eslint-disable @nx/enforce-module-boundaries */
import { Component, effect, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { SharedUiComponent, TextareaUiComponent } from '@gfw/shared-ui';
import { finalize, forkJoin } from 'rxjs';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlEvaluationService } from 'libs/features/risks/src/services/control-evaluation.service';
import { Button } from 'primeng/button';
import { MessageService } from 'primeng/api';
import {
  OverviewEntry,
} from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
export interface IControlEvalutions {
  riskAssessmentControlEvaluationID?: number;
  riskID?: number;
  riskAssessmentID: number;
  govControlID: number;
  riskMethodologyControlEffectivenessLevelTypeID: number;
  riskMethodologyControlEffectivenessScore: number;
  controlWeight: number;
  govControlFunctionTypeID: number;
  coveragePercentage: number;
  controlEffectivenessScore: number;
  evaluationRemarks: string;
  evaluatedByUserID: number;
  evaluationDate: string;
}
@Component({
  selector: 'lib-evaluation-action',
  imports: [
    CommonModule,
    TooltipModule,
    TranslateModule,
    DialogModule,
    SharedUiComponent,
    UiDropdownComponent,
    TextareaUiComponent,
    InputNumberComponent,
    ReactiveFormsModule,
    Button,
  ],
  templateUrl: './evaluation-action.component.html',
  styleUrl: './evaluation-action.component.scss',
})
export class EvaluationActionComponent {
  control_seleceted_visible: boolean = false;
  riskId!: number;
  current_assessment_data:any;
  risk_data:any;
  assessmentId!: number;

  isRisk = input<boolean>(false)
  evaluation_id_risk = input<any>(null)
  constructor(
    private _RiskService: RiskService,
    private _SharedService: SharedService,
    private route: ActivatedRoute,
    private evaluationService: ControlEvaluationService,
    private router: Router,
    private messageService: MessageService,
    private layoutService: LayoutService,
    private translateService: TranslateService,
    public _PermissionSystemService:PermissionSystemService
  ) {


    this.getDataContrilsList();
    this.getLookUps()
    console.log("evaluation_id_risk" , this.evaluation_id_risk());

    const id = this.isRisk() ? this.evaluation_id_risk() :this.route.snapshot.paramMap.get('id')
    const riskId = this.route.snapshot.paramMap.get('riskID') || this.route.parent?.snapshot.paramMap.get('riskID') ;
    if (riskId) {
      this.riskId = +riskId;
                 this._RiskService.getOneRisk(+riskId).subscribe((res:any)=>{
        this.risk_data = res?.data
      })
    }

    const assessmentId = this.route.snapshot.paramMap.get('assID');
    if (assessmentId) {
      this.assessmentId = +assessmentId;
           this._RiskService.getOneRiskAssessment(+assessmentId).subscribe((res:any)=>{
        this.current_assessment_data = res?.data
      })
    }



        this.initForm();
          effect(()=>{
      if(this.isRisk() && this.evaluation_id_risk()){
        this.evaluationId = this.evaluation_id_risk();
        this.getEvaluationById(this.evaluationId);
      }
    })


    if (!id) {
      this.initBreadCrumb(this.assessmentId, this.riskId);
      return;
    }


    this.evaluationId = +id;
    this.initBreadCrumb(this.assessmentId, this.riskId,this.evaluationId);
    this.getEvaluationById(this.evaluationId);
  }
  getEvaluationById(id: number) {
    this.evaluationService.getDetails(id).subscribe({
      next: (res) => {
        if (res && typeof res === 'object' && 'data' in res) {
          const data = res.data as IControlEvalutions;
          this.initForm(data);
          this.getControlById(data.govControlID);
        }
      },
    });
  }
  getControlById(id: number) {
    this.evaluationService.getControlById(id).subscribe({
      next: (res) => {
        if (res && typeof res === 'object' && 'data' in res)
          this.current_controll_data = res.data;
      },
    });
  }
  evaluationId!: number;
  ngOnInit() {}

  getDataContrilsList() {
    forkJoin([this._RiskService.getRisksProfile(18)]).subscribe(
      (res: any[]) => {
        this.profilesList = res[0]?.data?.userColumnProfiles.map(
          (profile: newProfile) => {
            return {
              ...profile,
              columns: profile.columns.map((col: any, i) => {
                return {
                  ...col,
                  displayName: res[0]?.data?.columnDefinitions?.find(
                    (colD: any) => colD?.id == col?.id
                  )?.label,
                  dataMap: res[0]?.data?.columnDefinitions?.find(
                    (colD: any) => colD?.id == col?.id
                  )?.dataMap,
                };
              }),
            };
          }
        );

        this.defultprofile = {
          profileId: 0,
          profileName: 'Defult Profile',
          isDefult: false,
          columns: res[0]?.data?.columnDefinitions,
        };

        this._SharedService.paginationSubject.next(this.pageginationObj);
        this.loading = false;
      }
    );
  }

  handleFilter(event: any[]) {
    const filters = event.map((filter: any) => {
      if (filter?.filter_type?.filterType == 'Date') {
        if (filter?.firstValue != 18 && filter?.firstValue != 19) {
          return {
            filterID: filter?.filter_type?.filterId,
            filterCode: filter?.filter_type?.fieldName,
            operatorId: filter?.operator?.DataEntityTypeOperatorID,
            operatorCode: filter?.operator?.OperatorCode,
            firstValue: null,
            secondValue: null,
            dateOptionID: String(filter?.firstValue),
          };
        } else {
          const secod = filter?.secondValue;

          return {
            filterID: filter?.filter_type?.filterId,
            filterCode: filter?.filter_type?.fieldName,
            operatorId: filter?.operator?.DataEntityTypeOperatorID,
            operatorCode: filter?.operator?.OperatorCode,
            firstValue: Array.isArray(secod)
              ? moment(new Date(secod[0])).format('MM-DD-YYYY')
              : moment(new Date(secod)).format('MM-DD-YYYY'),
            secondValue: Array.isArray(secod)
              ? moment(new Date(secod[1])).format('MM-DD-YYYY')
              : null,
            dateOptionID: String(filter?.firstValue),
          };
        }
      } else {
        return {
          filterID: filter?.filter_type?.filterId,
          filterCode: filter?.filter_type?.fieldName,
          operatorId: filter?.operator?.DataEntityTypeOperatorID,
          operatorCode: filter?.operator?.OperatorCode,
          firstValue: String(filter?.firstValue),
          secondValue: null,
          dateOptionID: null,
        };
      }
    });
    this.current_filters = filters;
    this.getDataList();
  }
  current_filters: any[] = [];
  data_sort: any = null;
  handleSort(event: any) {
    this.data_sort = event;
    this.loading = true;
    this.dataList = [];
    this._RiskService
      .getRiskSearch(
        this.data_sort,
        event?.currentPage ?? 1,
        event?.perPage ?? 10,
        this.current_filters
      )
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res: any) => {
        this.dataList = res?.data?.items;
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

  getDataList(event?: any) {
    this.loadingState = true;
    this.loading = true;
    this.dataList = [];
    this._RiskService
      .getControlsGovSearch(
        this.data_sort,
        event?.currentPage ?? 1,
        event?.perPage ?? 10,
        this.current_filters
      )
      .subscribe((res: any) => {
        this.dataList = res?.data?.items;
        this.pageginationObj = {
          perPage: res?.data?.pageSize,
          currentPage: res?.data?.pageNumber,
          totalItems: res?.data?.totalCount,
          totalPages: res?.data?.totalPages,
        };
        this.loadingState = false;
        this._SharedService.paginationSubject.next(this.pageginationObj);
        this.loading = false;
      });
  }

  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  dataList: any[] = [];

  itemsMenu: any[] = [];
  loadingState: boolean = true;
  profilesList: any = [];
  loading: boolean = true;
  defultprofile: any;
  table_name: string = '';
  badge_name: string = '';
  total_items_input: any;
  action_items: any[] = [];
  current_row_selected: any;

  govControlID!: number;
  current_controll_data: any;
  setSelectedRow(event: any) {
    console.log(event, 'selected');
    this.govControlID = event.govControlID;
    this.form.get('govControlID')?.setValue(this.govControlID);
    console.log(this.form.value);
    this.current_controll_data = event;
  }
  overviewEntries: OverviewEntry[] = [
    {
      key: 'controlCode',
      label: 'Control_view.CONTROL_CODE',
      type: 'text',
    },
    {
      key: 'govRegulatorName',
      label: 'Control_view.GOV_REGULATOR',
      type: 'text',
    },
    {
      key: 'govDocumentTypeName',
      label: 'Control_view.GOV_DOCUMENT_TYPE',
      type: 'text',
    },
    {
      key: 'govDocumentName',
      label: 'Control_view.GOV_DOCUMENT',
      type: 'text',
    },
    {
      key: 'organizationUnitName',
      label: 'Control_view.Organizational_Unit',
      type: 'text',
    },

    {
      key: 'fullControlText',
      label: 'Control_view.DESCRIPTION',
      type: 'description',
    },
    {
      key: 'objective',
      label: 'Control_view.Objective',
      type: 'description',
    },
    {
      key: 'evidenceDescription',
      label: 'Control_view.Evidence_Description',
      type: 'description',
    },
    {
      key: 'scope',
      label: 'Control_view.scope',
      type: 'description',
    },
  ];
  form!: FormGroup;
  initForm(data?: IControlEvalutions) {
    this.form = new FormGroup({
      riskAssessmentControlEvaluationID: new FormControl(
        data?.riskAssessmentControlEvaluationID ?? null
      ),
      riskAssessmentID: new FormControl(
        data?.riskAssessmentID ?? this.assessmentId,
        // Validators.required
      ),
      riskID: new FormControl(
        data?.riskID ?? this.riskId,
        // Validators.required
      ),
      govControlID: new FormControl(
        data?.govControlID ?? null,
        Validators.required
      ),
      riskMethodologyControlEffectivenessLevelTypeID: new FormControl(
        data?.riskMethodologyControlEffectivenessLevelTypeID ?? null,

      ),
      // riskMethodologyControlEffectivenessScore: new FormControl(
      //   data?.riskMethodologyControlEffectivenessScore ?? null,
      //
      // ),
      controlWeight: new FormControl(
        data?.controlWeight ?? null,

      ),
      govControlFunctionTypeID: new FormControl(
        data?.govControlFunctionTypeID ?? null,

      ),
      coveragePercentage: new FormControl(
        data?.coveragePercentage ?? null,

      ),
      controlEffectivenessScore: new FormControl(
        data?.controlEffectivenessScore ?? null,

      ),
      evaluationRemarks: new FormControl(
        data?.evaluationRemarks ?? null,

      ),
      // evaluatedByUserID: new FormControl(
      //   data?.evaluatedByUserID ?? null,
      //   Validators.required
      // ),
      // evaluationDate: new FormControl(
      //   data?.evaluationDate ? new Date(data?.evaluationDate) : null,
      //   Validators.required
      // ),
    });
  }
  effectivenessLevelType: { id: number; label: string }[] = [];
  controlFunctionTypes: { id: number; label: string }[] = [];
  users: { id: number; name: string }[] = [];
  getLookUps() {
    this._SharedService.lookUps([233, 234]).subscribe({
      next: (res) => {
        const {
          RiskMethodologyControlEffectivenessLevelType,
          GovControlFunctionType,
        } = res.data;
        this.effectivenessLevelType =
          RiskMethodologyControlEffectivenessLevelType;
        this.controlFunctionTypes = GovControlFunctionType;
      },
    });
    this._SharedService.getUserLookupData().subscribe({
      next: (res) => {
        this.users = res.data;
      },
    });
  }
  adding: boolean = false;
  navigateBack() {
    this.router.navigateByUrl(
      `/gfw-portal/risks-management/risk/${this.riskId}/assessment/${this.assessmentId}/control-evaluations`
    );
  }
  save() {
    this.adding = true;
    const payload = this.form.value;
    if(!payload?.riskAssessmentControlEvaluationID) delete payload.riskAssessmentControlEvaluationID ;
    this.evaluationService
      .save(this.form.value)
      .pipe(finalize(() => (this.adding = false)))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            detail: 'Evaluation Saved Successfully.',
            summary: 'Success',
          });
          if(this.isRisk()){
            this.action_data_emiter.emit({show_list:true})
          }else{

            this.navigateBack()
          }
          // setTimeout(() => , 1500);
        },
      });
  }

  action_data_emiter= output<any>();
  initBreadCrumb(
    riskAssessmentID: number,
    riskID: number,
    evaluationId?: number
  ) {
    const breadCrumb = [
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this.translateService.instant(
          'BREAD_CRUMB_TITLES.RISK_MANGEMENT'
        ),
        routerLink: '/gfw-portal/risks-management/risks-list',
      },
      {
        name: 'Risk List',
        icon: '',
        routerLink: '/gfw-portal/risks-management/risks-list',
      },
      {
        name: this.translateService.instant('EVALUATION.EVALUATIONS_LIST'),
        routerLink: `/gfw-portal/risks-management/risk/${riskID}/assessment/${riskAssessmentID}/control-evaluations`,
      },
      {
        name: this.translateService.instant(
          evaluationId
            ? 'EVALUATION.UPDATE_EVALUATION'
            : 'EVALUATION.ADD_EVALUATION'
        ),
        routerLink: '',
      },
    ];

    this.layoutService.breadCrumbLinks.next(breadCrumb);
  }
}
