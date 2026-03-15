import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsListComponent } from 'libs/shared/shared-ui/src/lib/cards-list/cards-list.component';
import { WorkflowService } from '../../../services/workflow.service';

import { ActivatedRoute, Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SharedWorkflowViewComponent } from '../shared-workflow-view/shared-workflow-view.component';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { DeleteConfirmPopupComponent, SwitchUiComponent } from '@gfw/shared-ui';
import { RadioButtonModule } from 'primeng/radiobutton';
import { finalize, Observable, switchMap, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-step-decisions',
  imports: [
    CommonModule,
    CardsListComponent,
    DialogModule,
    TranslateModule,
    ReactiveFormsModule,
    ButtonModule,
    SharedWorkflowViewComponent,
    InputTextComponent,
    DeleteConfirmPopupComponent,
    RadioButtonModule,
    SwitchUiComponent,
  ],
  templateUrl: './step-decisions.component.html',
  styleUrl: './step-decisions.component.scss',
})
export class StepDecisionsComponent {
  constructor(
    private _Router: Router,
    private _WorkflowService: WorkflowService,
    private _ActivatedRoute: ActivatedRoute,
    private _translateService: TranslateService,
    private _MessageService: MessageService,
    private _LayoutService: LayoutService,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this._ActivatedRoute.parent?.paramMap.subscribe((res) => {
      console.log(res, 'params');

      const stepId = res?.get('id');

      this.breadCrumb = [
        {
          name: '',
          icon: 'fi fi-rs-home',
          routerLink: '/',
        },
        {
          name: this._translateService.instant('BREAD_CRUMB_TITLES.SETTING'),
          icon: '',
          routerLink: '/gfw-portal/setting',
        },
        {
          name: this._translateService.instant('RISK_MANAGMENT.WORKFLOW'),
          icon: '',
          routerLink: '/gfw-portal/setting/workflow/list',
        },
        {
          name: '-',
          icon: '',
          routerLink: '',
        },
        {
          name: this._translateService.instant('WORKFLOW_STEPS.TITLES.STEPS'),
          icon: '',
          routerLink: `/gfw-portal/setting/workflow/${stepId}/steps`,
        },
        {
          name: this._translateService.instant(
            'WORKFLOW_STEPS.TITLES.DECISIONS'
          ),
          icon: '',
          routerLink: ``,
        },
      ];
      this._LayoutService.breadCrumbLinks.next(this.breadCrumb);
    });
    this._ActivatedRoute.parent?.paramMap
      .pipe(
        tap((res) => {
          this.current_work_flow_id = res.get('id');
        }),
        switchMap((res) => this._WorkflowService.getWorkFlowById(res.get('id')))
      )
      .subscribe((res) => {
        this.current_WF_data = res?.data;
        console.log(res?.data, 'res?.data');
        const wfId = res?.data?.wfid;
        this.breadCrumb[3].name = res?.data?.name;
        this.breadCrumb[3].routerLink = '/gfw-portal/setting/workflow/' + wfId;
      });

    this._ActivatedRoute.paramMap
      .pipe(
        tap((res) => {
          this.current_step_id = res.get('id');
        }),
        switchMap((res) => this._WorkflowService.getStepById(res.get('id')))
      )
      .subscribe((res) => {
        this.current_step_data = res?.data;
        this._WorkflowService.dynamic_steps_subject.next({
          step: 3,
          steper: [
            {
              description: this.current_WF_data?.name,
            },

            {
              description: res?.data?.name,
              command: () => {
                this._Router.navigate([
                  `/gfw-portal/setting/workflow/${this.current_work_flow_id}/steps`,
                ]);
              },
            },
          ],
        });
      });
  }

  breadCrumb: any[] = [];
  current_WF_data: any;
  current_step_data: any;
  current_selected_item: any;
  current_work_flow_id: any;
  current_step_id: any;
  setSelected(event: any) {
    this.current_selected_item = event;
    console.log('current_selected_item', this.current_selected_item);
  }
  item_actions: any = [];
  ngOnInit() {
    this.initDecisionForm();
    this.getDecisionsList();
    this.item_actions = [
      {
        label: this._translateService.instant(
          'WORKFLOW_STEPS.BUTTONS.EDIT_DECISION'
        ),
        command: () => {
          this.handleEditDecisionClick();
        },
        visible: ()=> this._PermissionSystemService.can('WORKFLOW' , 'SETDECISIONS' , 'EDIT')
      },
      {
        label: this._translateService.instant(
          'WORKFLOW_STEPS.BUTTONS.VIEW_DECISION'
        ),
        command: () => {
          this.isViewingDecision = true;
          this.handleViewDecisionClick();
        },
         visible: ()=> this._PermissionSystemService.can('WORKFLOW' , 'SETDECISIONS' , 'VIEW')
      },
      {
        label: this._translateService.instant(
          'WORKFLOW_STEPS.BUTTONS.DELETE_DECISION'
        ),
        command: () => {
          this.deletingDecisionDialog = true;
        },
         visible: ()=> this._PermissionSystemService.can('WORKFLOW' , 'SETDECISIONS' , 'DELETE')
      },
    ];

    this._LayoutService.breadCrumbLinks.next(this.breadCrumb);
  }
  data_list: any[] = [];

  viewActions(item: any) {
     if(!this._PermissionSystemService.can('WORKFLOW' , 'DEFINEACTIONS' , 'VIEW')) return
    this._Router.navigate([
      `/gfw-portal/setting/workflow/${this.current_work_flow_id}/step/${this.current_step_id}/decision/${item?.id}/actions`,
    ]);

    this._WorkflowService.dynamic_steps_subject.next({
      step: 4,
      steper: [
        {
          description: this.current_WF_data?.name,
        },
        {
          description: this.current_step_data?.name ?? '-',
          command: () => {
            this._Router.navigate([
              `/gfw-portal/setting/workflow/${this.current_work_flow_id}/steps`,
            ]);
          },
        },
        {
          description: item?.title ?? '-',
          command: () => {
            this._Router.navigate([
              `/gfw-portal/setting/workflow/${this.current_work_flow_id}/step/${this.current_step_id}/decisions`,
            ]);
          },
        },
      ],
    });
  }

  // handle actions

  show_action: boolean = false;

  handleAddDecisionClick() {
    this.isEditingDecision = false;
    this.show_action = true;
  }
  handleEditDecisionClick() {
    this.isEditingDecision = true;
    this.initDecisionForm(this.current_selected_item);
    this.show_action = true;
  }
  deletingDecisionDialog: boolean = false;
  handleCloseDelete(event: any) {
    this.deletingDecisionDialog = event;
  }
  titleDelete = 'WORKFLOW_STEPS.TEXTS.TITLE_DELETE_DECISION';
  descriptionDelete = 'WORKFLOW_STEPS.TEXTS.DESCRIPTION_DELETE_DECISION';
  isDeletingDecision: boolean = false;
  deleteDecision() {
    if(!this._PermissionSystemService.can('WORKFLOW' , 'SETDECISIONS' , 'DELETE')) return;
    this.isDeletingDecision = true;
    this._WorkflowService
      .delteDecisions(this.current_selected_item?.wfDecisionID)
      .pipe(finalize(() => (this.isDeletingDecision = false)))
      .subscribe((res) => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Decisions Deleted Successfully',
        });
        this.isDeletingDecision = false;
        this.getDecisionsList();
      });
  }
  handleViewDecisionClick() {
    this.view_data = [];
    this.handleViewData(
      'WORKFLOW_STEPS.FIELDS.NAME_EN',
      this.current_selected_item?.declarationText,
      '',
      false
    );
    this.handleViewData(
      this.current_selected_item?.declarationTextAr,
      'توفير معلومات',
      '',
      false
    );
    this.handleViewData(
      'WORKFLOW_STEPS.FIELDS.JUSTIFICATION_REQUIRED',
      this.current_selected_item?.isJustificationRequired ? 'Yes' : 'No',
      '',
      false
    );
  }
  isEditingDecision: boolean = false;
  isViewingDecision: boolean = false;

  decision_form!: FormGroup;

  closeForm() {
    this.show_action = false;
    this.initDecisionForm();
  }
  initDecisionForm(data?: any) {
    this.decision_form = new FormGroup({
      declarationText: new FormControl(
        data?.declarationText || null,
        Validators.required
      ),
      declarationTextAr: new FormControl(data?.declarationTextAr || null),
      isJustificationRequired: new FormControl(
        data?.isJustificationRequired || false
      ),
    });
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

  loadingList: boolean = false;

  getDecisionsList() {
    this.loadingList = true;
    this.data_list = [];
    this._WorkflowService
      .getStepDecisions(null, 1, 50, [], +this.current_step_id)
      .pipe(finalize(() => (this.loadingList = false)))
      .subscribe((res: any) => {
        console.log('list step data', res?.data);
        const items: any[] = res?.data?.items;

        this.data_list = items.map((i: any) => {
          return {
            ...i,
            id: i?.wfDecisionID,
            icon: 'fi fi-rr-condition-alt',
            title: i?.declarationText,
            sub: i?.wfName,
          };
        });

        this.loadingList = false;
      });
  }

  loadSave: boolean = false;

  handleSubmitActionDecision() {
    this.loadSave = true;
    const req = {
      ...this.decision_form.value,
      wfid: +this.current_work_flow_id,
      wfStepID: +this.current_step_id,
    };

    const API$: Observable<any> = this.isEditingDecision
      ? this._WorkflowService.updateDecisions(req)
      : this._WorkflowService.addNewDecision(req);

                // ===== Permissions =====
  const hasPermission = this.isEditingDecision
    ? this._PermissionSystemService.can('WORKFLOW' , 'SETDECISIONS', 'EDIT')
    : this._PermissionSystemService.can('WORKFLOW' , 'SETDECISIONS', 'ADD');

  if (!hasPermission) {
    return;
  }

    if (this.isEditingDecision) {
      req.wfDecisionID = this.current_selected_item?.wfDecisionID;
    }

    API$.pipe(finalize(() => (this.isEditingDecision = false)))
      .pipe(
        finalize(() => {
          this.loadSave = false;
        })
      )
      .subscribe({
        next: (res: any) => {
          this.initDecisionForm();
          this.getDecisionsList();
          this.loadSave = false;
          this._MessageService.add({
            severity: 'success',
            summary: 'success',
            detail: this.isEditingDecision
              ? 'Decision Updated Successfully'
              : 'Decision Added Successfully',
          });
          this.show_action = false;
          this.isEditingDecision = false;
        },
      });
  }
}
