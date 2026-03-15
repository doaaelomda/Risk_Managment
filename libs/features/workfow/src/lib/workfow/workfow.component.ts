import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { MessageService } from 'primeng/api';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';

import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';

import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { validations } from 'libs/shared/shared-ui/src/models/validation.model';
import { finalize, Observable } from 'rxjs';
import { WorkflowService } from '../../services/workflow.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-workfow',
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    DeleteConfirmPopupComponent,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    UiDropdownComponent,

    InputTextComponent,
    NewTableComponent,
  ],
  templateUrl: './workfow.component.html',
  styleUrl: './workfow.component.css',
})
export class WorkfowComponent implements OnInit {
  actionDeleteVisible: boolean = false;
  isDeleting: boolean = false;
  action_items: any;
  workflowList: any[] = [];
  isLoading: boolean = true;
  workflowListProfiles: any[] = [];
  openModal: boolean = false;
  isEditing: boolean = false;
  isSaving: boolean = false;
  defultProfile!: newProfile;
  validationsname: validations[] = [
    {
      key: 'required',
      message: 'VALIDATIONS.WORKFLOWname',
    },
  ];
  dateEntityIdValidations: validations[] = [
    {
      key: 'required',
      message: 'Date Entity Type',
    },
  ];
  columnControl: any = {
    type: 'route',
    data: '/gfw-portal/setting/workflow/',
  };
  data_payload: any;
  selectworkflow: any = null;
  userTypes: any;
  workflowForm!: FormGroup;
  constructor(
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _MessageService: MessageService,
    private _SharedService: SharedService,
    private _RiskService: RiskService,
    private _router: Router,
    private _WorkflowService: WorkflowService,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.SETTING'),
        icon: '',
        routerLink: '/gfw-portal/setting/workflow',
      },
      {
        name: this._TranslateService.instant('RISK_MANAGMENT.WORKFLOW'),
        icon: '',
      },
    ]);
  }
  ngOnInit() {
    this.action_items = [
      {
        label: this._TranslateService.instant('WORKFLOW.VIEW_WORKFLOW'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._router.navigate([
            `/gfw-portal/setting/workflow/${this.selectworkflow}/info`,
          ]);
        },
         visible: ()=> this._PermissionSystemService.can('WORKFLOW' , 'WORKFLOW' , 'VIEW')
      },
      {
        label: this._TranslateService.instant('WORKFLOW.DELETE_WORKFLOW'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.actionDeleteVisible = true;
        },
         visible: ()=> this._PermissionSystemService.can('WORKFLOW' , 'WORKFLOW' , 'DELETE')
      },
      {
        label: this._TranslateService.instant('WORKFLOW.UPDATE_WORKFLOW'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          // this._router.navigate(['/gfw-portal/workflow/update']);
          this._WorkflowService
            .getWorkFlowById(this.selectworkflow)
            .subscribe((res: any) => {
              console.log('sigle WTF', res?.data);
              this.initWorkFlowForm(res?.data);
              this.openModal = true;
            });
        },
         visible: ()=> this._PermissionSystemService.can('WORKFLOW' , 'WORKFLOW' , 'EDIT')
      },
    ];
    this.initWorkFlowForm();
    this.getEntityTypeLookup();
  }
  getEntityTypeLookup() {
    this._SharedService.lookUps([87]).subscribe((res: any) => {
      this.userTypes = res?.data?.DataEntityType;
    });
  }
  handleClosedDelete(event?: any) {
    this.actionDeleteVisible = false;
  }
  deleteWorkflow() {
    if(!this._PermissionSystemService.can('WORKFLOW' , 'WORKFLOW' , 'DELETE')) return;
    this.isDeleting = true;
    console.log('deleted');
    this._WorkflowService
      .deleteWorkFlow(this.selectworkflow)
      .pipe(
        finalize(() => {
          this.isDeleting = false;
          this.actionDeleteVisible = false;
        })
      )
      .subscribe((res: any) => {
        this.isDeleting = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Workflow Deleted Successfully',
        });
        this.getworkflowList(this.data_payload);
        this.selectworkflow = null;
      });
  }
  addNewWorkFlow(event?: any) {
    console.log('delete');
    this.selectworkflow = null;
    this.openModal = true;
  }
  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  setSelectedRow(event: any) {
    this.selectworkflow = event;
    console.log('role Selected', event);
  }
  getworkflowList(payload?: any) {
    this.workflowList = [];
    this.isLoading = true;
    this._WorkflowService
      .getWorlFlowsLists(payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          this.workflowList = res?.data?.items;
          this.pageginationObj = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this._SharedService.paginationSubject.next(this.pageginationObj);
          this.isLoading = false;
        },
        error: (err: any) => {
          this.isLoading = false;
        },
      });
  }
  initWorkFlowForm(data?: any) {
    this.workflowForm = new FormGroup({
      name: new FormControl(data ? data?.name : null, [Validators.required]),
      nameAr: new FormControl(data ? data?.nameAr : null, [
        Validators.required,
      ]),
      dataEntityTypeID: new FormControl(data ? data?.dataEntityTypeID : null, [
        Validators.required,
      ]),
    });
  }
  submit() {
    this.isSaving = true;
    let req = {
      ...this.workflowForm.value,
    };
    if (this.selectworkflow) {
      req.wfid = this.selectworkflow;
    }

    const API$: Observable<any> = this.selectworkflow
      ? this._WorkflowService.updateWorkflow(req)
      : this._WorkflowService.addWorkflow(req);

                // ===== Permissions =====
  const hasPermission = this.selectworkflow
    ? this._PermissionSystemService.can('WORKFLOW', 'WORKFLOW', 'EDIT')
    : this._PermissionSystemService.can('WORKFLOW', 'WORKFLOW', 'ADD');

  if (!hasPermission) {
    return;
  }
    API$.subscribe((res: any) => {
      this.openModal = false;
      this.initWorkFlowForm();
      this.getworkflowList(this.data_payload);
      this._MessageService.add({
        summary: 'success',
        severity: 'success',
        detail: this.selectworkflow
          ? 'Workflow Updated Successfully'
          : 'Workflow Created Successfully',
      });
      this.selectworkflow = null;
      this.isSaving = false;
    });
  }
  handleDataTable(event: any) {
    this.data_payload = event;
    this.getworkflowList(event);
  }
}
