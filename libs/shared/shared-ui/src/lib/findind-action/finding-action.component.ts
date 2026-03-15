import { ViewFindingComponent } from './../../../../../features/compliance/src/lib/pending-assesment-view-container/viewFinding/viewFinding.component';
import { ComplianceService } from 'libs/features/compliance/src/compliance/compliance.service';
import dateHandler from 'libs/shared/utils/dateHandler';
import { Component, effect, Input, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  TextareaUiComponent,
  DatePackerComponent,
  UserDropdownComponent,
  DeleteConfirmPopupComponent,
} from '@gfw/shared-ui';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { ButtonModule } from 'primeng/button';
import { validations } from 'libs/shared/shared-ui/src/models/validation.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { finalize, Subscription } from 'rxjs';
import * as moment from 'moment';
import { SkeletonModule } from 'primeng/skeleton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MessageService } from 'primeng/api';
import { NewTableComponent } from '../new-table/new-table.component';
@Component({
  selector: 'lib-finding-action',
  imports: [
    ProgressBarModule,
    CommonModule,
    TextareaUiComponent,
    ReactiveFormsModule,
    MenuModule,
    DialogModule,
    InputTextComponent,
    TextareaUiComponent,
    UiDropdownComponent,
    DatePackerComponent,
    ButtonModule,
    TranslateModule,
    DeleteConfirmPopupComponent,
    UserDropdownComponent,
    DialogModule,
    SkeletonModule,
    InputTextComponent,
    RadioButtonModule,
    FormsModule,
    ViewFindingComponent,
    NewTableComponent,
  ],
  templateUrl: './finding-action.component.html',
  styleUrl: './finding-action.component.scss',
})
export class FindingActionComponent implements OnInit {
  @Input() readOnly:boolean = false
    @Input() canAdd:boolean = true
  @Input() canEdit:boolean = true
  @Input() canDelete:boolean = true
  @Input() canView:boolean = true
  // initialize Variable
  dataEntityTypeID = input<any>();
  HEADER_TITLE = input<any>();
  UPDATE_TITLE = input<any>();
  HEADER_DESC = input<any>();
  entityID = input<any>();
  fileUsageTypeId = input<any>();
  dataList: any[] = [];
  loadingStateTable: boolean = true;
  selected_profile_column: any;
  current_filters: any;
  sort_data: any;
  loadingSave: boolean = false;
  displayModal: boolean = false;
  selected_file_show: any;
  loadUpdate: boolean = false;
  loadingState: boolean = false;
  findingID: any;
  paginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  show_action: boolean = false;
  current_row: any;
  showViewModal: boolean = false;
  FindingData: any;
  verificationOutcomes: any[] = [];
  remediationOwners: any[] = [];
  categories: any[] = [];
  severityLevels: any[] = [];
  sourceTypes: any[] = [];
  dataEntities: any[] = [];
  updateFinding: boolean = false;
  assigneeRoleID: any[] = [];
  assigneeUserID: any[] = [];
  followUpUserID: any[] = [];
  verificationUserID: any[] = [];
  loadingData: boolean = false;
  items: any;
  actionDeleteVisible = false;
  loadDelted = false;

  columnControl: any = {
    type: 'popup',
    data: `gfw-portal/compliance/assessments/view/`,
  };
  ValidationsRequired: validations[] = [
    { key: 'required', message: 'VALIDATIONS.REQUIRED' },
  ];
  findingStatusType: any[] = [];
  private taskByIdSub!: Subscription;
  private deleteSub!: Subscription;
  private createSub!: Subscription;
  private updateSub!: Subscription;
  private tableSub!: Subscription;
  current_control_assessment_payload: any;
  // Initialize Contractor
  constructor(
    private _sharedService: SharedService,
    private _RiskService: RiskService,
    private _MessageService: MessageService,
    private _TranslateService: TranslateService,
    private ComplianceService: ComplianceService
  ) {


    // effect(()=>{
    //   if(this.entityID()){
    //     this.handleDataTable()
    //   }
    // })

    this.initTabs();
  }
  showAction(){
    if(this.readOnly)return
    this.show_action = true
  }

  // handle Active Delete Popup
  handleShowDelete() {
    this.show_action = true;
  }
  // handle initialize Actions
  initializeActions() {
    this.items = [
      {
        label: this._TranslateService.instant('FINDINGS_RISK.VIEW_FINDINGS'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this.loadingData = true;
          this.showViewModal = true;
          this.getFindingById(this.current_row);
        },
        visible:() => this.canView
      },
      {
        label: this._TranslateService.instant('FINDINGS_RISK.DELETE_FINDINGS'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.actionDeleteVisible = true;
        },
        visible:() => this.canDelete
      },
      {
        label: this._TranslateService.instant('FINDINGS_RISK.UPDATE_FINDINGS'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this.show_action = true;
          this.ComplianceService.getByIdFindings(this.current_row).subscribe(
            (res: any) => {
              this.findingID = res?.data?.findingID;
              this.initialForm(res?.data);
            }
          );
        },
        visible:() => this.canEdit
      },
    ];
  }
  // method to set selected row
  setSelected(event: any) {
    this.current_row = event;
  }
  // View Popup Active
  openViewModal(event: any) {
    const findingID = event?.findingID;
    if (!findingID) return;
    this.getFindingById(findingID);
  }
  // get Data Finding
  getFindingById(findingID: any) {
    this.taskByIdSub = this.ComplianceService.getByIdFindings(
      findingID
    ).pipe(finalize(()=> this.loadingData = false)).subscribe((res: any) => {
      const data = res?.data;
      this.FindingData = data;
      this.showViewModal = true;
    });
  }
  // delete Finding
  deleteFinding() {
    if(!this.canDelete)return
    this.loadDelted = true;
    this.deleteSub = this.ComplianceService.deleteFinding(
      this.current_row
    ).subscribe({
      next: (res: any) => {
        this.loadDelted = false;
        this.actionDeleteVisible = false;
        this._MessageService.add({
          severity: 'success',
          summary: this._TranslateService.instant('MESSAGES.DeleteFinding'),
          detail: '',
          life: 3000,
        });
        this.getDataTable(this.current_control_assessment_payload);
      },
      error: () => {
        this.loadDelted = false;
      },
    });
  }
  // Close Modal Delete
  handleClosedDelete(event: any) {
    this.actionDeleteVisible = false;
  }

  // Initial Form
  basicInfoForm!: FormGroup;
  ownerShipForm!: FormGroup;
  datesForm!: FormGroup;
  rootCauseForm!: FormGroup;
  detailsForm!: FormGroup;
  initialForm(data?: any): void {
    this.detailsForm = new FormGroup({
      observation: new FormControl(data ? data.observation : null, []),

      recommendation: new FormControl(data ? data.recommendation : null, []),

      findingVerificationOutcomeTypeID: new FormControl(
        data ? data.findingVerificationOutcomeTypeID : null,
        Validators.required
      ),
    });
    this.rootCauseForm = new FormGroup({
      rootCause: new FormControl(data ? data.rootCause : null, []),
      impact: new FormControl(data ? data.impact : null),
    });
    this.datesForm = new FormGroup({
      // reportedDate: new FormControl(
      //   data?.reportedDate
      //     ? moment(new Date(data.reportedDate)).utc(true).format('MM-DD-YYYY')
      //     : null
      // ),
      dueDate: new FormControl(
        data?.dueDate
          ? moment(new Date(data.dueDate)).utc(true).format('MM-DD-YYYY')
          : null
      ),

      verificationDate: new FormControl(
        data?.verificationDate
          ? moment(new Date(data.verificationDate))
              .utc(true)
              .format('MM-DD-YYYY')
          : null
      ),
      remediationTargetDate: new FormControl(
        data?.remediationTargetDate
          ? moment(new Date(data.remediationTargetDate))
              .utc(true)
              .format('MM-DD-YYYY')
          : null
      ),
    });
    this.ownerShipForm = new FormGroup({
      remediationOwnerUserID: new FormControl(
        data ? data.remediationOwnerUserID : null
      ),
      ownerRoleID: new FormControl(data ? data.ownerRoleID : null, [
        Validators.required,
      ]),
      ownerUserID: new FormControl(data ? data.ownerUserID : null, [
        Validators.required,
      ]),
      assigneeUserID: new FormControl(data ? data.assigneeUserID : null, [
        Validators.required,
      ]),
      verificationUserID: new FormControl(
        data ? data.verificationUserID : null,
        [Validators.required]
      ),
    });
    this.basicInfoForm = new FormGroup({
      title: new FormControl(data ? data.title : null, [Validators.required]),
      referenceCode: new FormControl(data ? data.referenceCode : null, []),
      findingSeverityLevelTypeID: new FormControl(
        data ? data.findingSeverityLevelTypeID : null,
        Validators.required
      ),
      findingSourceTypeID: new FormControl(
        data ? data.findingSourceTypeID : null,
        Validators.required
      ),
      findingCategoryID: new FormControl(data ? data.findingCategoryID : null, [
        Validators.required,
      ]),
      findingStatusTypeID: new FormControl(
        data ? data.findingStatusTypeID : null,
        [Validators.required]
      ),
    });

    this.updateFinding = !!data;
  }
  // load Lookups
  getLookups() {
    this._RiskService.getRiskActionLookupData([89, 90, 91, 93, 92]).subscribe({
      next: (res: any) => {
        this.severityLevels = res?.data?.FindingSeverityLevelType || [];
        this.sourceTypes = res?.data?.FindingSourceType || [];
        this.categories = res?.data?.FindingCategory || [];
        this.verificationOutcomes =
          res?.data?.FindingVerificationOutcomeType || [];
        this.findingStatusType = res?.data?.FindingStatusType || [];
      },
    });
    this._sharedService.getUserLookupData().subscribe((res: any) => {
      const users = res?.data ?? [];
      this.assigneeUserID = JSON.parse(JSON.stringify(users));
      this.followUpUserID = JSON.parse(JSON.stringify(users));
      this.verificationUserID = JSON.parse(JSON.stringify(users));
      this.remediationOwners = JSON.parse(JSON.stringify(users));
    });
    this._sharedService.getRoleLookupData().subscribe((res: any) => {
      this.assigneeRoleID = res?.data;
    });
  }
  // save Finding
  submit() {
    if(!this.canEdit && !this.canAdd)return
    if (this.basicInfoForm.invalid || this.readOnly) {
      this.basicInfoForm.markAllAsTouched();
      return;
    }
    const basicData = this.basicInfoForm.value;
    const ownerShipData = this.ownerShipForm.value;
    const datesData = this.datesForm.value;
    const rootCauseData = this.rootCauseForm.value;
    const detailsData = this.detailsForm.value;
    const data = {
      ...basicData,
      ...ownerShipData,
      ...datesData,
      ...rootCauseData,
      ...detailsData,
    };

    const formatDate = (date: any) =>
      date ? dateHandler(new Date(date)) : null;

    const payload: any = {
      ...data,
      reportedDate: formatDate(data.reportedDate),
      dueDate: formatDate(data.dueDate),
      verificationDate: formatDate(data.verificationDate),
      remediationTargetDate: formatDate(data.remediationTargetDate),
      dataEntityID: +this.entityID(),
      dataEntityTypeID: this.dataEntityTypeID(),
      ...(this.updateFinding && { findingID: this.findingID }),
    };

    Object.keys(payload).forEach(
      (key) => payload[key] == null && delete payload[key]
    );

    const request$ = this.updateFinding
      ? this.ComplianceService.UpdateFinding(payload)
      : this.ComplianceService.createFinding(payload);

    const messageKey = this.updateFinding
      ? 'MESSAGES.UpdateFinding'
      : 'MESSAGES.CreateFinding';

    const sub = request$.subscribe({
      next: () => {
        this.show_action = false;
        this.getDataTable(this.current_control_assessment_payload);
        this._MessageService.add({
          severity: 'success',
          summary: this._TranslateService.instant(messageKey),
          detail: '',
          life: 3000,
        });
      },
    });

    this.updateFinding ? (this.updateSub = sub) : (this.createSub = sub);
  }

  // Close add Modal
  onModalClose() {
    this.basicInfoForm.reset();
    this.ownerShipForm.reset();
    this.datesForm.reset();
    this.rootCauseForm.reset();
    this.detailsForm.reset();
    this.updateFinding = false;
  }
  // method to get payload and calling data table
  handleDataTable(payload: any = null) {
    this.current_control_assessment_payload = payload;
    this.getDataTable(payload);
  }
  // method to get data table
  getDataTable(payload: any) {
    this.loadingStateTable = true;
    this.dataList = [];
    this.tableSub = this.ComplianceService.getFinding(
      payload,
      +this.dataEntityTypeID(),
      +this.entityID()
    )
      .pipe(finalize(() => (this.loadingStateTable = false)))
      .subscribe({
        next: (res: any) => {
          this.dataList = res?.data?.items;
          this.paginationObj = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this._sharedService.paginationSubject.next(this.paginationObj);
        },
      });
  }

  // handle Cycle Hooks
  ngOnInit(): void {
    this.initialForm();
    this.getLookups();
    this.initializeActions();
  }
  // On Destroy
  ngOnDestroy(): void {
    this.taskByIdSub?.unsubscribe();
    this.deleteSub?.unsubscribe();
    this.createSub?.unsubscribe();
    this.updateSub?.unsubscribe();
    this.tableSub?.unsubscribe();
  }

  tabs: { id: number; name: string }[] = [];
  activeTab: number = 1;
  initTabs() {
    const tabs = [
      {
        id: 1,
        name: this._TranslateService.instant('FINDING.BASIC_INFO'),
      },
      {
        id: 2,
        name: this._TranslateService.instant(
          'FINDING.OWNERSHIP_RESPONSIBILITY'
        ),
      },
      {
        id: 3,
        name: this._TranslateService.instant('FINDING.DATES_TIMELINE'),
      },
      {
        id: 4,
        name: this._TranslateService.instant('FINDING.ROOT_CAUSE_ANALYSIS'),
      },
      {
        id: 5,
        name: this._TranslateService.instant('FINDING.DETAILS_EVIDENCE'),
      },
    ];
    this.tabs = tabs;
  }
  setActiveTab(tab: { id: number; name: string }) {
    this.activeTab = tab.id;
  }
}
