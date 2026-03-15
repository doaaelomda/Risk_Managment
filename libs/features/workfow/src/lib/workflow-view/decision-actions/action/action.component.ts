import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ActivatedRoute } from '@angular/router';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { DropdownModule } from 'primeng/dropdown';
import { Button } from 'primeng/button';
import { WorkflowService } from 'libs/features/workfow/src/services/workflow.service';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { MessageService } from 'primeng/api';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'lib-action',
  imports: [
    CommonModule,
    AccordionModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextComponent,
    TranslateModule,
    RadioButtonModule,
    DropdownModule,
    Button,
    InputNumberComponent,
    DialogModule,
  ],
  templateUrl: './action.component.html',
  styleUrl: './action.component.scss',
})
export class ActionComponent {
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _translateService: TranslateService,
    private _wfService: WorkflowService,
    private messageService: MessageService,
    private riskService: RiskService
  ) {}
  @Input() data: any = '';
  @Input() isUpdating: boolean = false;
  decisionId: any = '';
  ngOnInit() {
    this._activatedRoute.paramMap.subscribe((res) => {
      console.log(res, 'res here');

      this.decisionId = res?.get('desId');
      this.stepId = res?.get('stepId');
    });
    this.getLookUps();
    this.initCreationForm(this.data);
    this.actionTypes = [
      {
        name: this._translateService.instant(
          'WORKFLOW_STEPS.BUTTONS.MOVE_TO_STEP'
        ),
        id: 1,
        desc: this._translateService.instant(
          'WORKFLOW_STEPS.TEXTS.ADD_YOURSELF_OR_IMPORT_FROM_CV'
        ),
        icon: 'fi fi-rr-move-to-folder-2',
      },
      {
        name: this._translateService.instant(
          'WORKFLOW_STEPS.BUTTONS.EDIT_ITEM_DATA'
        ),
        id: 2,
        desc: this._translateService.instant(
          'WORKFLOW_STEPS.TEXTS.ADD_YOURSELF_OR_IMPORT_FROM_CV'
        ),
        icon: 'fi fi-rr-tools',
      },
      {
        name: this._translateService.instant(
          'WORKFLOW_STEPS.BUTTONS.PERFORM_ACTION_ON_ITEM'
        ),
        id: 3,
        desc: this._translateService.instant(
          'WORKFLOW_STEPS.TEXTS.ADD_YOURSELF_OR_IMPORT_FROM_CV'
        ),
        icon: 'fi fi-rr-dashboard',
      },
    ];

    this.getEntityTypes();
  }
  dataEntityTypeAttributeID: any = '';
  getEntityTypes() {
    this._wfService.getDataEntityActions(1).subscribe((res: any) => {
      console.log(res, 'got data');
      this.dataEntityActions = res?.data;
    });
  }
  dataEntityActions: any[] = [];
  getLookUps() {
    this.riskService.getRiskActionLookupData([101, 98]).subscribe((res) => {
      console.log(res, 'log here lookups');
      this.steps = res?.data?.WFStep;
      this.actions = res?.data?.WFAction;
    });
  }
  addingNewItem: boolean = false;
  toggleItemDialog() {
    this.addingNewItem = true;
  }
  saveItem() {
    const body = {
      dataEntityTypeAttributeID: this.dataEntityTypeAttributeID,
      dataEntityTypeID: 1,
      wfActionID: this.actionId || 31,
      selectedValue: '',
    };
    this._wfService.changeActionData(body).subscribe((res) => {
      console.log('changed action data');
    });
  }
  getHeaderTitle() {
    if (!this.isUpdating) {
      const actionTypeId = this.creationForm.get('wfActionTypeID')?.value;
      return this.actionTypes?.find((action) => action.id == actionTypeId)
        ?.name;
    } else {
      return this.creationForm.get('name')?.value;
    }
  }

  actionId: any = '';

  actionName = 'Change Status';
  actionOrder = '25';
  headerData = {
    title: 'Change Status',
    orderNumber: '25',
    icon: 'fi fi-rr-tools',
  };

  creationForm!: FormGroup;
  handleEditItem(item: any) {
    console.log(item, 'item here');
  }

  lastChanges = [
    {
      title: 'Risk Assessment Requests',
      status: 'Pending With Requester',
      id: '1',
    },
    {
      title: 'Risk Assessment Requests',
      status: 'Pending With Requester',
      id: '1',
    },
  ];

  initCreationForm(data?: any) {
    this.creationForm = new FormGroup({
      name: new FormControl(data?.name || null, Validators.required),
      nameAr: new FormControl(data?.nameAr || null),
      color: new FormControl(data?.color || null),
      orderNumber: new FormControl(data?.orderNumber || null),
      wfActionTypeID: new FormControl(data?.wfActionTypeID || 1),
    });
  }
  handleTypeClick(type: any) {
    this.creationForm.get('wfActionTypeID')?.setValue(type.id);
    this.selectedOption = '';
  }
  selectedType = 1;
  steps = [];
  actions = [];
  selectedOption = '';
  isStep() {
    const isStep = this.creationForm.get('wfActionTypeID')?.value === 1;
    return isStep;
  }
  stepId: any = '';
  @Input() wfId: any = '';
  isSavingWFActionType: boolean = false;
  updateWFActionType() {
    this.isSavingWFActionType = true;
    if (this.selectedType == 2) return;
    const isMovingStep = this.creationForm.get('wfActionTypeID')?.value === 1;
    const isPerformingAction =
      this.creationForm.get('wfActionTypeID')?.value === 3;
    const dynamicKey = isMovingStep
      ? 'targetedWFStepID'
      : isPerformingAction
      ? 'dataEntityTypeActionID'
      : null;
    const body = {
      wfActionID: this.actionId || 31,
      wfStepID: this.stepId,
      wfid: this.wfId || 32,
      wfDecisionID: this.decisionId,
      ...(dynamicKey ? { [dynamicKey]: this.selectedOption } : {}),
    };

    this._wfService.changeActionStep(body, isMovingStep).subscribe((res) => {
      this.isSavingWFActionType = false;
      console.log(res);
    });
  }

  actionTypes: any[] = [];
  isSavingAction: boolean = false;
  saveAction() {
    const msg = this.isUpdating ? 'updated' : 'added';
    this.isSavingAction = true;
    this._wfService
      .createAction(this.creationForm.value, this.decisionId, this.data?.id)
      .subscribe({
        next: (res) => {
          console.log(res, 'created action');
          const createdActionId = res?.idResult;
          this.isSavingAction = false;
          this.messageService.add({
            severity: 'success',
            detail: `Action ${msg} successfully`,
          });
          this.actionId = createdActionId;
          console.log(createdActionId, 'createdActionId');

          if (this.isUpdating) {
            this.onSave();
          }
        },
        error: (err) => {
          this.isSavingAction = false;
        },
      });
  }
  @Output() handleCancel = new EventEmitter<boolean>();
  @Output() handleSave = new EventEmitter<boolean>();

  onCancel() {
    this.handleCancel.emit(false);
  }
  onSave() {
    this.handleSave.emit(true);
  }
}
