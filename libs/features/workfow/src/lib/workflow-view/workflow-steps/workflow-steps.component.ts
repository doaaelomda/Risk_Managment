import { CardsListComponent } from './../../../../../../shared/shared-ui/src/lib/cards-list/cards-list.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { WorkflowService } from '../../../services/workflow.service';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import {
  UserDropdownComponent,
  RoleDropdownComponent,
  TextareaUiComponent,
  DeleteConfirmPopupComponent,
} from '@gfw/shared-ui';
import { SharedWorkflowViewComponent } from '../shared-workflow-view/shared-workflow-view.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { finalize, Observable, switchMap, tap } from 'rxjs';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-workflow-steps',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    CardsListComponent,
    ButtonModule,
    DialogModule,
    InputTextComponent,
    FormsModule,
    UserDropdownComponent,
    RoleDropdownComponent,
    TextareaUiComponent,
    DeleteConfirmPopupComponent,
    SharedWorkflowViewComponent,
    RadioButtonModule,
    UiDropdownComponent,
    InputNumberComponent,
  ],
  templateUrl: './workflow-steps.component.html',
  styleUrl: './workflow-steps.component.scss',
})
export class WorkflowStepsComponent {
  item_actions: any = [];
  ngOnInit() {
    this.getStepsList();
    this.getUsersLookUp();
    this.getRolesLookUp();
    this.initStepForm();
    this.item_actions = [
      {
        label: this._TranslateService.instant(
          'WORKFLOW_STEPS.BUTTONS.UPDATE_STEP'
        ),
        command: () => {
          this.handleEditStepClick();
        },
        visible: ()=> this._PermissionSystemService.can('WORKFLOW' , 'STEPS' , 'EDIT')

      },
      {
        label: this._TranslateService.instant(
          'WORKFLOW_STEPS.BUTTONS.VIEW_STEP'
        ),
        command: () => {
          this.isViewingStep = true;
          this.handleViewStepClick();
        },
        visible: ()=> this._PermissionSystemService.can('WORKFLOW' , 'STEPS' , 'VIEW')
      },
      {
        label: this._TranslateService.instant(
          'WORKFLOW_STEPS.BUTTONS.DELETE_STEP'
        ),
        command: () => {
          this.deletingStepDialog = true;
        },
        visible: ()=> this._PermissionSystemService.can('WORKFLOW' , 'STEPS' , 'DELETE')
      },

    ];
  }

  viewDecision(item:any){
    if(!this._PermissionSystemService.can('WORKFLOW' , 'SETDECISIONS' , 'VIEW')) return
             this._Router.navigate([
            `/gfw-portal/setting/workflow/${this.current_workflow_id}/step/${item?.id}/decisions`,
          ]);

          this._WorkflowService.dynamic_steps_subject.next({
            step: 3,
            steper: [
              {
                description: item?.title,
              },
              {
                description: '-',
              },
              {
                description: '-',
              },
            ],
          });
  }

  breadCrumb: any[] = [];

  current_workflow_id: any;
  current_step_selected: any;
  current_WF_data: any;
  setSelected(event: any) {
    this.current_step_selected = event;
  }
  constructor(
    private _Router: Router,
    private _WorkflowService: WorkflowService,
    private _ActivatedRoute: ActivatedRoute,
    private _sharedService: SharedService,
    private _TranslateService: TranslateService,
    private _MessageService: MessageService,
    private _LayoutService: LayoutService,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this.dataSourceTypes = [
      {
        name: this._TranslateService.instant(
          'WORKFLOW_STEPS.BUTTONS.Entity_Data'
        ),
        id: '1',
        value: 1,
      },
      {
        name: this._TranslateService.instant(
          'WORKFLOW_STEPS.BUTTONS.Selected_Values'
        ),
        id: '2',
        value: 2,
      },
      {
        name: this._TranslateService.instant(
          'WORKFLOW_STEPS.BUTTONS.Not_Selected'
        ),
        id: '3',
        value: null,
      },
    ];
    this.breadCrumb = [
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
        routerLink: '/gfw-portal/setting/workflow',
      },
      {
        name: '-',
        icon: '',
        routerLink: '',
      },
      {
        name: this._TranslateService.instant('WORKFLOW_STEPS.TITLES.STEPS'),
        icon: '',
        routerLink: '',
      },
    ];
    this._LayoutService.breadCrumbLinks.next(this.breadCrumb);
    this._ActivatedRoute.parent?.paramMap
      .pipe(
        tap((res) => (this.current_workflow_id = res.get('id'))),
        switchMap((res) => this._WorkflowService.getWorkFlowById(res.get('id')))
      )
      .subscribe((res) => {
        this.current_WF_data = res?.data;
        this.breadCrumb[this.breadCrumb.length - 2].name =
          this.current_WF_data?.name;
        this.breadCrumb[
          this.breadCrumb.length - 2
        ].routerLink = `/gfw-portal/setting/workflow/${this.current_WF_data?.wfid}`;
        this.getDataEntityLookup();
         this._WorkflowService.dynamic_steps_subject.next({
      step: 2,
      steper: [
        {
          description: this.current_WF_data?.name,
        },
        {
          description: '-',
        },
        {
          description: '-',
        },
      ],
    });
      });


  }

  entity_list: any[] = [];

  getDataEntityLookup() {
    console.log('current WF data', this.current_WF_data);
    this._WorkflowService
      .dataEntityLookUp(this.current_WF_data?.dataEntityTypeID)
      .subscribe((res: any) => {
        this.entity_list = res?.data;
      });
  }

  data_list: any[] = [];
  handleAddStepClick() {
    this.isEditingStep = false;
    this.show_action = true;
  }
  handleEditStepClick() {
    console.log(this.current_step_selected, 'this.current_step_selected');
    const selectedId = this.current_step_selected?.id;
    this.isEditingStep = true;
    // get data using selectedId then pass it to initStepForm function
    console.log(this.current_step_selected, 'this.current_step_selected');

    this.initStepForm(this.current_step_selected);

    this.show_action = true;
  }
  deletingStepDialog: boolean = false;
  handleCloseDelete(event: any) {
    this.deletingStepDialog = event;
  }
  titleDelete = 'WORKFLOW_STEPS.TEXTS.TITLE_DELETE_STEP';
  descriptionDelete = 'WORKFLOW_STEPS.TEXTS.DESCRIPTION_DELETE_STEP';
  isDeletingStep: boolean = false;
  deleteStep() {
    if(!this._PermissionSystemService.can('WORKFLOW','STEPS' , 'DELETE')) return;
    this.isDeletingStep = true;
    this._WorkflowService
      .deleteStep(this.current_step_selected?.id)
      .pipe(finalize(() => (this.isDeletingStep = false)))
      .subscribe((res: any) => {
        this.isDeletingStep = false;
        this.deletingStepDialog = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'success',
          detail: 'step deleted successfully',
        });
        this.getStepsList();
      });
  }
  handleViewStepClick() {
    this.view_data = [];
    this.handleViewData(
      'WORKFLOW_STEPS.FIELDS.NAME_EN',
      this.current_step_selected?.name,
      '',
      false
    );
    this.handleViewData(
      'WORKFLOW_STEPS.FIELDS.NAME_AR',
      this.current_step_selected?.nameAr,
      '',
      false
    );
    this.handleViewData(
      'WORKFLOW_STEPS.FIELDS.TIMELINE',
      this.current_step_selected?.timeline,
      '',
      false
    );
    this.handleViewData(
      'WORKFLOW_STEPS.FIELDS.ASSIGNEE_USER',
      this.current_step_selected?.assigneeUserName,
      '/images/avatar.svg',
      false,
      ''
    );
    this.handleViewData(
      'WORKFLOW_STEPS.FIELDS.ASSIGNEE_ROLE',
      this.current_step_selected?.assigneeRoleName,
      '/images/not2.png',
      false
    );
    this.handleViewData(
      'WORKFLOW_STEPS.FIELDS.TASK_TITLE_EN',
      this.current_step_selected?.taskTitle,
      '',
      false
    );
    this.handleViewData(
      'WORKFLOW_STEPS.FIELDS.TASK_TITLE_AR',
      this.current_step_selected?.taskTitleAr,
      '',
      false
    );
    this.handleViewData(
      'WORKFLOW_STEPS.FIELDS.TASK_DESC_EN',
      this.current_step_selected?.taskDescription,
      '',
      true
    );
    this.handleViewData(
      'WORKFLOW_STEPS.FIELDS.TASK_DESC_AR',
      this.current_step_selected?.taskDescriptionAr,
      '',
      true
    );
  }
  isEditingStep: boolean = false;
  isViewingStep: boolean = false;

  // handle actions

  show_action: boolean = false;

  step_form!: FormGroup;

  rolesLookUpData: any[] = [];
  usersLookUpData: any[] = [];
  resetDataSourceTypeValues(value?: any) {
    const userSourceType = this.step_form.get(
      'assigneeUserDataSourceTypeID'
    )?.value;

    // Clean up both controls before switching
    ['assigneeUserID', 'assigneeUserEntityTypeAttributeID'].forEach((ctrl) => {
      if (this.step_form.contains(ctrl)) {
        this.step_form.get(ctrl)?.setValidators(null);
        this.step_form.get(ctrl)?.updateValueAndValidity({ emitEvent: false });
        this.step_form.removeControl(ctrl);
      }
    });

    switch (userSourceType) {
      case 1:
        this.step_form.addControl(
          'assigneeUserEntityTypeAttributeID',
          new FormControl(value || null, Validators.required)
        );
        break;

      case 2:
        this.step_form.addControl(
          'assigneeUserID',
          new FormControl(value || null, Validators.required)
        );
        break;

      default:
        break;
    }

    this.step_form.updateValueAndValidity();
  }

  handleAssgineRoleSourceType(value?: any) {
    const roleSourceType = this.step_form.get(
      'assigneeRoleDataSourceTypeID'
    )?.value;

    ['assigneeRoleID', 'assigneeRoleEntityTypeAttributeID'].forEach((ctrl) => {
      if (this.step_form.contains(ctrl)) {
        this.step_form.removeControl(ctrl);
      }
    });

    switch (roleSourceType) {
      case 1:
        this.step_form.addControl(
          'assigneeRoleEntityTypeAttributeID',
          new FormControl(value || null, Validators.required)
        );
        break;

      case 2:
        this.step_form.addControl(
          'assigneeRoleID',
          new FormControl(value || null, Validators.required)
        );
        break;

      default:
        break;
    }

    this.step_form.updateValueAndValidity();
  }

  getRolesLookUp() {
    this._sharedService.getRoleLookupData().subscribe((res) => {
      console.log(res, 'roles here');
      this.rolesLookUpData = res?.data;
    });
  }
  getUsersLookUp() {
    this._sharedService.getUserLookupData().subscribe((res) => {
      console.log(res, 'users here');
      this.usersLookUpData = res?.data;
    });
  }
  closeForm() {
    this.show_action = false;
    this.initStepForm();
  }
  initStepForm(data?: any) {
    this.step_form = new FormGroup({
      name: new FormControl(data?.name || null, Validators.required),
      nameAr: new FormControl(data?.nameAr || null),

      timeline: new FormControl(data?.timeline || null, Validators.required),
      taskTitle: new FormControl(data?.taskTitle || null, Validators.required),
      taskTitleAr: new FormControl(
        data?.taskTitleAr || null,
        Validators.required
      ),
      taskDescription: new FormControl(
        data?.taskDescription || null,
        Validators.required
      ),
      taskDescriptionAr: new FormControl(data?.task_descAr || null),
      assigneeRoleDataSourceTypeID: new FormControl(
        data?.assigneeRoleDataSourceTypeID || null
      ),
      assigneeUserDataSourceTypeID: new FormControl(
        data?.assigneeUserDataSourceTypeID || null
      ),
    });

    if (data?.assigneeRoleID) {
      this.step_form.addControl(
        'assigneeRoleID',
        new FormControl(data.assigneeRoleID)
      );
    }

    if (data?.assigneeUserID) {
      this.step_form.addControl(
        'assigneeUserID',
        new FormControl(data.assigneeUserID)
      );
    }

    if (data?.assigneeRoleEntityTypeAttributeID) {
      this.step_form.addControl(
        'assigneeRoleEntityTypeAttributeID',
        new FormControl(data.assigneeRoleEntityTypeAttributeID)
      );
    }

    if (data?.assigneeUserEntityTypeAttributeID) {
      this.step_form.addControl(
        'assigneeUserEntityTypeAttributeID',
        new FormControl(data.assigneeUserEntityTypeAttributeID)
      );
    }
    this.resetDataSourceTypeValues(
      data?.assigneeUserID || data?.assigneeUserEntityTypeAttributeID
    );
    this.handleAssgineRoleSourceType(
      data?.assigneeRoleID || data?.assigneeRoleEntityTypeAttributeID
    );
  }

  view_data: any[] = [];
  handleViewData(
    label: string,
    value: any,
    img: string,
    isDescription: boolean,
    position?: string
  ) {
    const newData = { label, value, img, isDescription, position };
    this.view_data = [...this.view_data, newData];
  }

  dataSourceTypes: any[] = [];

  // handling step APIS CALLS

  loadingList: boolean = false;
  listLength: any = '';
  getStepsList() {
    this.loadingList = true;
    this.data_list = [];
    this._WorkflowService
      .getWorkflowSteps(null, 1, 50, [], +this.current_workflow_id)
      .subscribe((res: any) => {
        console.log('list step data', res?.data);
        const items: any[] = res?.data?.items;

        this.data_list = items.map((i: any) => {
          return {
            ...i,
            id: i?.wfStepID,
            icon: 'fi fi-rr-priority-arrow',
            title: i?.name,
            sub: i?.wfName,
          };
        });

        this.loadingList = false;
        this.listLength = this.data_list?.length;
      });
  }

  loadSave: boolean = false;

  handleSubmitActionStep() {
    console.log('form value', this.step_form.value);
    this.loadSave = true;
    const req = {
      ...this.step_form.value,
      wfid: this.current_workflow_id,
    };

    const API$: Observable<any> = this.isEditingStep
      ? this._WorkflowService.editWFStep(
          req,
          this.current_step_selected?.wfStepID
        )
      : this._WorkflowService.addWFStep(req);

                // ===== Permissions =====
  const hasPermission = this.isEditingStep
    ? this._PermissionSystemService.can('WORKFLOW','STEPS', 'EDIT')
    : this._PermissionSystemService.can('WORKFLOW','STEPS', 'ADD');

  if (!hasPermission) {
    return;
  }
    API$.subscribe({
      next: (res: any) => {
        this.initStepForm();
        this.getStepsList();
        this.loadSave = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'success',
          detail: this.isEditingStep
            ? 'Step Updated Successfully'
            : 'Step Added Successfully',
        });
        this.show_action = false;
        this.isEditingStep = false;
      },
      error: (err: any) => {
        this.loadSave = false;
      },
    });
  }
    onViewModal(event?: any) {
      this.current_step_selected = event;
    this.isViewingStep = true;
          this.handleViewStepClick();
  }
}
