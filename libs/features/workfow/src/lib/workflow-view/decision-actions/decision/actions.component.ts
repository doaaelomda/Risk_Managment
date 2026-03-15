import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsListComponent } from 'libs/shared/shared-ui/src/lib/cards-list/cards-list.component';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkflowService } from 'libs/features/workfow/src/services/workflow.service';
import { SharedWorkflowViewComponent } from '../../shared-workflow-view/shared-workflow-view.component';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Button } from 'primeng/button';
import { ActionComponent } from '../action/action.component';
import {
  filter,
  finalize,
  forkJoin,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { MessageService } from 'primeng/api';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-actions',
  imports: [
    CommonModule,
    CardsListComponent,
    SharedWorkflowViewComponent,
    DeleteConfirmPopupComponent,
    TranslateModule,
    Button,
    ActionComponent,
  ],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss',
})
export class ActionsComponent implements OnInit {
  constructor(
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _WorkflowService: WorkflowService,
    private _translateService: TranslateService,
    private _LayoutService: LayoutService,
    private messageService: MessageService,
    public _PermissionSystemService:PermissionSystemService
  ) {}

  current_params: any;
  current_decision_step: any;
  breadCrumb: any;
  initBreadcrumbs(): void {
    this.breadCrumb = [
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      {
        name: this._translateService.instant('BREAD_CRUMB_TITLES.SETTING'),
        routerLink: '/gfw-portal/setting/workflow',
      },
      {
        name: this._translateService.instant('RISK_MANAGMENT.WORKFLOW'),
        routerLink: '/gfw-portal/setting/workflow/list',
      },
      { name: '-', routerLink: '' },
      {
        name: this._translateService.instant('WORKFLOW_STEPS.TITLES.STEPS'),
        routerLink: '',
      },
      {
        name: this._translateService.instant('WORKFLOW_STEPS.TITLES.DECISIONS'),
        routerLink: '',
      },
      {
        name: this._translateService.instant('WORKFLOW_STEPS.TITLES.ACTIONS'),
        routerLink: '',
      },
    ];

    this._LayoutService.breadCrumbLinks.next(this.breadCrumb);
  }
  wfData: any = '';
  initRouteSubscriptions(): void {
    this._ActivatedRoute.paramMap.subscribe((params) => {
      this.current_decision_step = params.get('desId');
      this.getActions();
    });

    this._ActivatedRoute.parent?.paramMap
      .pipe(
        tap((params) => (this.current_work_flow_id = params.get('id'))),
        switchMap((params) =>
          this._WorkflowService.getWorkFlowById(params.get('id'))
        ),
        filter((res) => !!res?.data)
      )
      .subscribe((res) => {
        const workflow = res.data;
        this.wfData = workflow;
        const wfId = workflow.wfid;

        Object.assign(this.breadCrumb[3], {
          name: workflow.name,
          routerLink: `/gfw-portal/setting/workflow/${wfId}`,
        });

        this.breadCrumb[4].routerLink = `/gfw-portal/setting/workflow/${wfId}/steps`;
        this._LayoutService.breadCrumbLinks.next(this.breadCrumb);

        console.log('Workflow Data:', workflow);

        forkJoin({
          decision: this._WorkflowService.getDecisionById(
            this.current_params?.desId
          ),
          step: this._WorkflowService.getStepById(this.current_params?.stepId),
        }).subscribe(({ decision, step }) => {
          const stepName = step?.data?.name ?? '-';
          const desName = decision?.data?.declarationText ?? '-';

          console.log('Step Name:', stepName);
          console.log('Decision Name:', desName);

          this._WorkflowService.dynamic_steps_subject.next({
            step: 4,
            steper: [
              { description: workflow.name },
              {
                description: stepName,
                command: () =>
                  this._Router.navigate([
                    `/gfw-portal/setting/workflow/${wfId}/steps`,
                  ]),
              },
              {
                description: desName,
                command: () =>
                  this._Router.navigate([
                    `/gfw-portal/setting/workflow/${wfId}/step/${this.current_params?.stepId}/decisions`,
                  ]),
              },
            ],
          });
        });
      });

    this.current_params = this.getAllRouteParams(this._ActivatedRoute);
    const { id: wfId, stepId, desId } = this.current_params;
    console.log(this.current_params, 'this.current_params');

    this.breadCrumb[5].routerLink = `/gfw-portal/setting/workflow/${wfId}/step/${stepId}/decisions`;
  }

  initActionMenu(): void {
    this.item_actions = [
      {
        label: this._translateService.instant(
          'WORKFLOW_STEPS.BUTTONS.UPDATE_ACTION'
        ),
        command: () => this.handleUpdateActionClick(),
        visible: ()=> this._PermissionSystemService.can('WORKFLOW' , 'DEFINEACTIONS' , 'EDIT')
      },

      {
        label: this._translateService.instant(
          'WORKFLOW_STEPS.BUTTONS.VIEW_ACTION'
        ),
        command: () => {
          this.handleViewActionClick();
        },
        visible: ()=> this._PermissionSystemService.can('WORKFLOW' , 'DEFINEACTIONS' , 'VIEW')
      },
      {
        label: this._translateService.instant(
          'WORKFLOW_STEPS.BUTTONS.DELETE_ACTION'
        ),
        command: () => (this.deletingActionDialog = true),
        visible: ()=> this._PermissionSystemService.can('WORKFLOW' , 'DEFINEACTIONS' , 'DELETE')
      },
    ];
  }
  isUpdatingAction: boolean = false;
  handleUpdateActionClick(): void {
    this._WorkflowService
      .getActionById(this.current_selected_item?.id)
      .subscribe((res: any) => {
        console.log(res, 'got action by id');
        this.singleActionData = res?.data;
        this.isUpdatingAction = true;
        this.isAddingAction = false;
      });
    console.log(this.singleActionData, 'singleActionData');
  }
  ngOnInit(): void {
    this.initBreadcrumbs();
    this.initRouteSubscriptions();
    this.initActionMenu();
  }
  isAddingAction: boolean = false;
  singleActionData: any = '';
  returnToList() {
    this.isAddingAction = false;
    this.isUpdatingAction = false;
  }
  handleActionRoute() {
    this.singleActionData = '';
    this.isAddingAction = true;
    this.isUpdatingAction = false;
    // this._Router.navigate([
    //   `/gfw-portal/setting/workflow/${this.current_params?.id}/step/${this.current_params?.stepId}/decision/${this.current_params?.desId}/actions/add`,
    // ]);
  }
  onCancel(event: any) {
    this.isAddingAction = false;
    this.isUpdatingAction = false;
  }

  getAllRouteParams(route: ActivatedRoute): { [key: string]: any } {
    let params: { [key: string]: any } = {};
    let currentRoute: ActivatedRoute | null = route.root;

    while (currentRoute) {
      params = {
        ...params,
        ...currentRoute.snapshot.params,
      };
      currentRoute = currentRoute.firstChild;
    }

    return params;
  }
  current_selected_item: any;
  current_work_flow_id: any;
  current_desicion_id: any;
  setSelected(event: any) {
    this.current_selected_item = event;
  }
  data_list = [
    {
      id: 1,
      title: 'Edit Item Data',
      sub: 'Order:25',
      icon: 'fi fi-rs-tools',
    },
  ];
  loadingList: boolean = false;
  total_items: any = '';
  getActions() {
    this.loadingList = true;
    this.data_list = [];
    this._WorkflowService
      .getActions(null, 1, 50, [], +this.current_decision_step)
      .pipe(finalize(() => (this.loadingList = false)))
      .subscribe((res: any) => {
        console.log('list step data', res?.data);
        const items: any[] = res?.data?.items;

        this.data_list = items.map((i: any) => {
          return {
            ...i,
            id: i?.wfActionID,
            icon: 'fi fi-rr-tools',
            title: i?.name,
            sub: '',
          };
        });

        this.loadingList = false;
        this.total_items = this.data_list?.length;
      });
  }
  isViewingAction: boolean = false;
  item_actions: any = [];
  title = '';
  desc = '';
  handleViewActionClick() {
    this.view_data = [];
    this._WorkflowService
      .getActionById(this.current_selected_item?.id)
      .subscribe((res: any) => {
        console.log(res, 'got action by id');
        const data = res?.data;
        const title = data?.name;
        const desc = data?.sub;
        this.title = title;
        this.desc = desc;

        this.handleViewData(
          'WORKFLOW_STEPS.FIELDS.NAME_EN',
          data?.name,
          '',
          false
        );
        this.handleViewData(
          'WORKFLOW_STEPS.FIELDS.NAME_AR',
          data?.nameAr,
          '',
          false
        );
        this.handleViewData(
          'WORKFLOW_STEPS.FIELDS.COLOR',
          data?.color,
          '',
          false
        );
        this.handleViewData(
          'WORKFLOW_STEPS.FIELDS.ORDER',
          data?.orderNumber,
          '',
          false
        );

        this.isViewingAction = true;
      });

    // this.handleViewData(
    //   'WORKFLOW_STEPS.FIELDS.WORKFLOW_ACTION_TYPE',
    //   'Move to Step',
    //   '',
    //   false,
    //   '',
    //   'fi fi-rs-tools'
    // );
    // this.handleViewData(
    //   'WORKFLOW_STEPS.FIELDS.NEXT_STEPS',
    //   'Request Approval',
    //   '',
    //   false
    // );
  }

  titleDelete = 'WORKFLOW_STEPS.TEXTS.TITLE_DELETE_ACTION';
  descriptionDelete = 'WORKFLOW_STEPS.TEXTS.DESCRIPTION_DELETE_ACTION';
  deletingActionDialog: boolean = false;
  handleCloseDelete(event: any) {
    this.deletingActionDialog = event;
  }
  isDeletingAction: boolean = false;
  deleteAction() {
    if(!this._PermissionSystemService.can('WORKFLOW' , 'DEFINEACTIONS' , 'DELETE')) return;
    this.isDeletingAction = true;
    const actionId = this.current_selected_item?.id;
    this._WorkflowService.deleteAction(actionId).subscribe((res) => {
      this.isDeletingAction = false;
      this.messageService.add({
        severity: 'success',
        detail: 'Action Deleted Successfully',
      });
      this.getActions();
      this.deletingActionDialog = false;
      console.log('deleted action');
    });
  }

  view_data: any[] = [];
  handleViewData(
    label: string,
    value: any,
    img: string,
    isDescription: boolean,
    position?: string,
    icon?: string
  ) {
    const newData = { label, value, img, isDescription, position, icon };
    this.view_data = [...this.view_data, newData];
  }

  onSave(event: any) {
              // ===== Permissions =====
  const hasPermission = this.isUpdatingAction
    ? this._PermissionSystemService.can('WORKFLOW' , 'DEFINEACTIONS', 'EDIT')
    : this._PermissionSystemService.can('WORKFLOW' , 'DEFINEACTIONS', 'ADD');

  if (!hasPermission) {
    return;
  }
    this.isAddingAction = false;
    this.isUpdatingAction = false;
    this.getActions();
  }
}
