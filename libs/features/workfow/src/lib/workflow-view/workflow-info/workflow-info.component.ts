import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MenuModule } from 'primeng/menu';
import { Router, ActivatedRoute } from '@angular/router';
import { tap, switchMap, finalize } from 'rxjs';
import { WorkflowService } from '../../../services/workflow.service';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslateService } from '@ngx-translate/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-workflow-info',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkeletonModule,
    TranslateModule,
    MenuModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    DialogModule,
    InputTextComponent,
    UiDropdownComponent,
  ],
  templateUrl: './workflow-info.component.html',
  styleUrl: './workflow-info.component.scss',
})
export class WorkflowInfoComponent implements OnInit {
  isSaving: boolean = false;
  submit() {
    if(!this._PermissionSystemService.can('WORKFLOW', 'WORKFLOW', 'EDIT')) return
    this.isSaving = true;
    const req = {
      ...this.workflowForm.value,
      wfid: this.current_WF_data?.wfid,
    };

    this._WorkflowService.updateWorkflow(req).subscribe((res: any) => {
      this.isSaving = false;
      this.openModal = false;
      this.getWorkFlowById();
    });
  }
  isEditing: boolean = true;

  constructor(
    private _LayoutService: LayoutService,
    private _Router: Router,
    private _SharedService: SharedService,
    private _MessageService: MessageService,
    private _TranslateService: TranslateService,
    private _ActivatedRoute: ActivatedRoute,
    private _WorkflowService: WorkflowService,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this._WorkflowService.dynamic_steps_subject.next({
      step: 1,
      steper: [],
    });
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
    ];
    this._LayoutService.breadCrumbLinks.next(this.breadCrumb);
  }

  breadCrumb: any[] = [];

  getWorkFlowById() {
    this.isLoading = true;
    this._WorkflowService
      .getWorkFlowById(this.current_workflow_id)
      .subscribe((res: any) => {
        this.isLoading = false;
        this.current_WF_data = res?.data;
      });
  }

  current_workflow_id: any;
  current_WF_data: any;
  isLoading: boolean = true;

  userTypes: any[] = [];
  ngOnInit(): void {
    this.initWorkFlowForm();
    this.getEntityTypeLookup();
    this.itemsMenu = [
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
          this.initWorkFlowForm(this.current_WF_data);
          this.openModal = true;
        },
         visible: ()=> this._PermissionSystemService.can('WORKFLOW' , 'WORKFLOW' , 'EDIT')
      },
    ];

    this._ActivatedRoute.parent?.paramMap
      .pipe(
        tap((res) => {
          this.current_workflow_id = res.get('id');
        }),
        switchMap((res: any) =>
          this._WorkflowService.getWorkFlowById(res?.get('id'))
        )
      )
      .subscribe((res: any) => {
        this.current_WF_data = res?.data;
        this.breadCrumb[this.breadCrumb.length - 1].name =
          this.current_WF_data?.name;
        this.breadCrumb[
          this.breadCrumb.length - 1
        ].routerLink = `/gfw-portal/setting/workflow/${this.current_workflow_id}/info`;
        this.isLoading = false;
        this._WorkflowService.dynamic_steps_subject.next({
          step: 1,
          steper: [
            {
              description: this.current_WF_data?.name,
            },
            {
              description: '-',
              command: () => {
                this._Router.navigate([
                  `/gfw-portal/setting/workflow/${this.current_workflow_id}/steps`,
                ]);
              },
            },
          ],
        });
      });
  }

  getEntityTypeLookup() {
    this._SharedService.lookUps([87]).subscribe((res: any) => {
      this.userTypes = res?.data?.DataEntityType;
    });
  }
  workflowForm!: FormGroup;

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

  openModal: boolean = false;

  itemsMenu: any[] = [];

  actionDeleteVisible: boolean = false;

  handleClosedDelete(event?: any) {
    this.actionDeleteVisible = false;
  }

  isDeleting: boolean = false;

  deleteWorkflow() {
    if(!this._PermissionSystemService.can('WORKFLOW' , 'WORKFLOW' , 'DELETE')) return;
    this.isDeleting = true;
    console.log('deleted');
    this._WorkflowService
      .deleteWorkFlow(this.current_WF_data?.wfid)
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
        this._Router.navigate(['/gfw-portal/setting/workflow']);
      });
  }
}
