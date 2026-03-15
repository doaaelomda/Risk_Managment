import dateHandler from 'libs/shared/utils/dateHandler';
import { ViewModalComponent } from './../../../../../features/risks/src/lib/viewModal/viewModal.component';
import { Component, effect, Input, input, OnDestroy, OnInit } from '@angular/core';
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
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { finalize, Subscription } from 'rxjs';
import * as moment from 'moment';
import { TreeSelectUiComponent } from 'libs/shared/shared-ui/src/lib/tree-select/tree-select-ui.component';
import { SkeletonModule } from 'primeng/skeleton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MessageService } from 'primeng/api';
import { NewTableComponent } from '../new-table/new-table.component';
@Component({
  selector: 'lib-entity-action',
  imports: [
    ProgressBarModule,
    CommonModule,
    TextareaUiComponent,
    ReactiveFormsModule,
    ViewModalComponent,
    MenuModule,
    DialogModule,
    TreeSelectUiComponent,
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
    NewTableComponent,
  ],
  templateUrl: './entity-action.component.html',
  styleUrl: './entity-action.component.scss',
})
export class EntityActionComponent implements OnInit, OnDestroy {
  @Input() readOnly:boolean = false
  @Input() canAdd:boolean = true
  @Input() canEdit:boolean = true
  @Input() canDelete:boolean = true
  @Input() canView:boolean = true
  // initialize Variable
  businessTaskTypeID = input<any>();
  dataEntityTypeID = input<any>();
  HEADER_TITLE = input<any>();
  UPDATE_TITLE = input<any>();
  HEADER_DESC = input<any>();
  entityID = input<any>();
  fileUsageTypeId = input<any>();
  riskId = 1;
  dataList: any[] = [];
  loadingStateTable: boolean = true;
  sort_data: any;
  columnControl: any = {
    type: 'popup',
    data: `gfw-portal/compliance/assessments/view/`,
  };
  loadingState: boolean = false;
  paginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  show_action: boolean = false;
  current_row: any;
  showViewModal: boolean = false;
  singleTaskData: any;
  dataEntities: any[] = [];
  loadingData: boolean = false;
  items: any;
  actionDeleteVisible = false;
  loadDeleted = false;
  form!: FormGroup;
  FileTitleValidations: validations[] = [
    { key: 'required', message: 'VALIDATIONS.TITLE' },
  ];
  assigneeRoleID: any[] = [];
  assigneeUserID: any[] = [];
  taskEntityPriorityLevelID: any[] = [];
  assigneeOrganizationalUnitID: any[] = [];
  followUpUserID: any[] = [];
  verificationUserID: any[] = [];
  updateEntity: boolean = false;
  businessTaskID: any;
  loadingSave: boolean = false;
  displayModal: boolean = false;
  selected_file_show: any;
  loadUpdate: boolean = false;
  current_control_assessment_payload: any;
  private taskByIdSub!: Subscription;
  private deleteSub!: Subscription;
  private createSub!: Subscription;
  private updateSub!: Subscription;
  private tableSub!: Subscription;
  // Initialize Contractor
  constructor(
    private _sharedService: SharedService,
    private _MessageService: MessageService,
    private _TranslateService: TranslateService
  ) {

    // effect(()=>{
    //   if(this.entityID()){
    //     this.handleDataTable()
    //   }
    // })
  }
  showAction(){
    if(this.readOnly)return
    this.show_action=true
  }
  // handle initialize Actions
  initializeActions() {
    this.items = [
      {
        label: this._TranslateService.instant(
          'WORKFLOW_STEPS.BUTTONS.VIEW_ACTIONS'
        ),
        icon: 'fi fi-rr-eye',
        command: () => {
          this.loadingData = true;
          this.getTaskById(this.current_row);
        },
        visible:()=>this.canView
      },
      {
        label: this._TranslateService.instant(
          'WORKFLOW_STEPS.BUTTONS.DELETE_ACTION'
        ),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.actionDeleteVisible = true;
        },
        visible:()=>this.canDelete
      },
      {
        label: this._TranslateService.instant(
          'WORKFLOW_STEPS.BUTTONS.UPDATE_ACTION'
        ),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this.show_action = true;
          this._sharedService
            .getbyIdEntity(this.current_row)
            .subscribe((res: any) => {
              this.businessTaskID = res?.data?.businessTaskID;
              if (res?.data && this.businessTaskID) {
                this.initForm(res?.data);
              }
            });
        },
        visible:()=>this.canEdit
      },
    ];
  }
  // handle Active Delete Popup
  handleShowDelete() {
    this.show_action = true;
  }
  // method to set selected row
  setSelected(event: any) {
    this.current_row = event;
  }
  // View Popup Active
  openViewModal(event: any) {
    const taskId = event?.businessTaskID;
    if (!taskId) return;
    this.getTaskById(taskId);
  }
  // get Data Entity
  getTaskById(taskId: any) {
    this.taskByIdSub = this._sharedService
      .getTaskById(taskId)
      .subscribe((res: any) => {
        const data = res?.data;
        this.singleTaskData = data;
        this.showViewModal = true;
      });
  }
  // delete Entity
  deleteEntity() {
    if(!this.canDelete)return
    this.loadDeleted = true;
    this.deleteSub = this._sharedService
      .deleteEntity(this.current_row)
      .subscribe({
        next: () => {
          this.loadDeleted = false;
          this.actionDeleteVisible = false;
          this._MessageService.add({
            severity: 'success',
            summary: this._TranslateService.instant('Delete Entity Successful'),
            detail: '',
            life: 3000,
          });
          this.handleDataTable(this.current_control_assessment_payload);
        },
        error: () => {
          this.loadDeleted = false;
        },
      });
  }
  // Close Modal Delete
  handleClosedDelete() {
    this.actionDeleteVisible = false;
  }
  // Find Node Id
  findNodeById(nodes: any[], id: number): any | null {
    for (let node of nodes) {
      if (node.id === id) return node;
      if (node.children && node.children.length) {
        const found = this.findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }
  // Initial Form
  initForm(data?: any): void {
    this.form = new FormGroup({
      name: new FormControl(data ? data?.name : null, [Validators.required]),
      assigneeRoleID: new FormControl(data ? data?.assigneeRoleID : null),
      assigneeUserID: new FormControl(data ? data?.assigneeUserID : null),
      organizationalUnitID: new FormControl(null),
      description: new FormControl(data ? data?.description : null),
      businessTaskPriorityLevelID: new FormControl(
        data?.businessTaskPriorityLevelID
          ? data?.businessTaskPriorityLevelID
          : null
      ),
      followUpUserID: new FormControl(data ? data?.followUpUserID : null),
      verificationUserID: new FormControl(
        data ? data?.verificationUserID : null
      ),
      dueDate: new FormControl(
        data?.dueDate
          ? moment(new Date(data?.dueDate)).utc(true).format('MM-DD-YYYY')
          : null
      ),
      successCriteria: new FormControl(data ? data?.successCriteria : null),
    });
    this.updateEntity = !!data;
    if (data?.organizationalUnitID) {
      this._sharedService.orgainationalUnitLookUp().subscribe({
        next: (res: any) => {
          this.assigneeOrganizationalUnitID = Array.isArray(res?.data)
            ? res.data
            : [];

          const selectedNode = this.findNodeById(
            this.assigneeOrganizationalUnitID,
            data.organizationalUnitID
          );

          this.form.get('organizationalUnitID')?.setValue(selectedNode);
        },
      });
    } else {
      this._sharedService.orgainationalUnitLookUp().subscribe({
        next: (res: any) => {
          this.assigneeOrganizationalUnitID = Array.isArray(res?.data)
            ? res.data
            : [];
        },
      });
    }
  }
  // load Lookups
  getLookups() {
    this._sharedService.lookUps([36]).subscribe({
      next: (res: any) => {
        this.taskEntityPriorityLevelID = res?.data.BusinessTaskPriorityLevel;
      },
    });
    this._sharedService.getUserLookupData().subscribe((res: any) => {
      const users = res?.data ?? [];
      this.assigneeUserID = JSON.parse(JSON.stringify(users));
      this.followUpUserID = JSON.parse(JSON.stringify(users));
      this.verificationUserID = JSON.parse(JSON.stringify(users));
    });
    this._sharedService.getRoleLookupData().subscribe((res: any) => {
      this.assigneeRoleID = res?.data;
    });
  }
  // save Entity
  saving:boolean=false
  submit() {
    if(!this.canAdd && !this.canEdit) return
    if (this.form.invalid || this.readOnly) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true

    const orgUnit = this.form.value.organizationalUnitID?.id;

    const payload = {
      ...this.form.value,
      dueDate: this.form.value.dueDate
        ? dateHandler(new Date(this.form.value.dueDate))
        : null,
      organizationalUnitID: this.form.value.organizationalUnitID
        ? this.form.value.organizationalUnitID.id
        : null,
    };
    Object.keys(payload).forEach((key) => {
      if (payload[key] === null || payload[key] === undefined) {
        delete payload[key];
      }
    });

    if (this.updateEntity == true) {
      const payloadupdate = {
        ...payload,
        dataEntityID: +this.entityID(),
        dataEntityTypeID: this.dataEntityTypeID(),
        businessTaskTypeID: this.businessTaskTypeID(),
        businessTaskID: this.businessTaskID,
      };
      this.createSub = this._sharedService
        .UpdateEntity(payloadupdate)
        .pipe((finalize(() => this.saving = false))).subscribe({
          next: (res) => {
            this.show_action = false;
            this.dataEntities = [];
            this._MessageService.add({
              severity: 'success',
              summary: this._TranslateService.instant(
                'MESSAGES.UpdateEntity'
              ),
              detail: '',
            });
            this.handleDataTable(this.current_control_assessment_payload);
          },
        });
    } else {
      const payloadCreate = {
        ...payload,
        dataEntityID: +this.entityID(),
        dataEntityTypeID: this.dataEntityTypeID(),
        businessTaskTypeID: this.businessTaskTypeID(),
      };
      this.updateSub = this._sharedService
        .CreateEntity(payloadCreate)
        .subscribe({
          next: (res) => {
            this.show_action = false;
            this._MessageService.add({
              severity: 'success',
              summary: this._TranslateService.instant('MESSAGES.AddEntitySuccessful'),
              detail: '',
              life: 3000,
            });
            this.handleDataTable(this.current_control_assessment_payload);
          },
        });
    }
  }
  // Close add Modal
  onModalClose() {
    this.form.reset();
    this.updateEntity = false;
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
    this.tableSub = this._sharedService
      .getEntitiesSearch(
        payload,
        +this.entityID(),
        +this.dataEntityTypeID(),
        +this.businessTaskTypeID()
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
    this.initForm();
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
}
