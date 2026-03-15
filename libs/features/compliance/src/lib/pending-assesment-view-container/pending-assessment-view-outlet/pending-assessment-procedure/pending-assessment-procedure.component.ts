import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs';
import { isArray, TranslateModule } from '@ngx-translate/core';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { ComplianceService } from 'libs/features/compliance/src/compliance/compliance.service';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import {
  LoaderComponent,
  TextareaUiComponent,
  DeleteConfirmPopupComponent,
} from '@gfw/shared-ui';
import { SystemActionsComponent } from 'libs/shared/shared-ui/src/lib/system-actions/system-actions.component';
import { AccordionModule } from 'primeng/accordion';
import { Button } from 'primeng/button';
import { PendingAssessmentService } from 'libs/features/compliance/src/services/pending_assessment.service';
import { OwnerUserComponent } from 'libs/shared/shared-ui/src/lib/ownerUser/ownerUser.component';
import { SharedDescriptionComponent } from 'libs/shared/shared-ui/src/lib/shared-description/shared-description.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-pending-assessment-procedure',
  imports: [
    CommonModule,
    DialogModule,
    LoaderComponent,
    TextareaUiComponent,
    ReactiveFormsModule,
    TranslateModule,
    SystemActionsComponent,
    AccordionModule,
    Button,
    DeleteConfirmPopupComponent,
    OwnerUserComponent,
    SharedDescriptionComponent,
],
  templateUrl: './pending-assessment-procedure.component.html',
  styleUrl: './pending-assessment-procedure.component.scss',
})
export class PendingAssessmentProcedureComponent {
  constructor(
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private _ComplianceService: ComplianceService,
    private _MessageService: MessageService,
    private pendingAssessmentService: PendingAssessmentService,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this.route.parent?.parent?.paramMap.subscribe((params) => {
      this.complianceAssessmentID = Number(params.get('id'));
      console.log('complianceAssessmentID', this.complianceAssessmentID);
    });

    this._ComplianceService.controlAssessmentID$.subscribe((res: any) => {
      console.log('res controlAssessmentID', res);
      this.controlAssessmentID = res;
    });
  }
  ngOnInit() {
    this.getLookUps();

    this._ComplianceService.GovControlData$.subscribe((res: any) => {
      this.goControlId = res?.govControlID;
      console.log('GovControlData ', res);
      if (this.goControlId) {
        this.getCovControlRequirments();
      }
    });
  }
  controls: any[] = [];

  activeProcedure!: any;
  setActiveProcedure(event: boolean, procedure: any) {
    this.activeProcedure = event ? procedure : null;

    procedure.isExpand = event;

    if (event) {
      this.getAssessments();
    }
  }

  loadControls: boolean = true;

  getCovControlRequirments() {
    this.loadControls = true;
    this.pendingAssessmentService
      .getProcedures(this.goControlId)
      .pipe(finalize(() => (this.loadControls = false)))
      .subscribe((res: any) => {
        this.controls = isArray(res?.data)
          ? res?.data?.map((item: any) => ({
              ...item,
              isExpand: false,
            }))
          : [];
        console.log(this.controls, 'requirment controls');
      });
  }

  edit_flag: boolean = false;
  currentAssessmentId: any;
  handleEdit(event:Event,control: any, assessment: any) {
    event.stopPropagation()
    this.edit_flag = true;
    this.currentAssessmentId = assessment.businessProcedureAssessmentID;
    this.initForm(assessment);
    this.activeProcedure = control;
    this.isSavingAssessment = true;
  }

  handleDelete(event:Event,control: any, assessment: any) {
    event.stopPropagation()
    this.currentAssessmentId = assessment.businessProcedureAssessmentID;
    this.activeProcedure = control;
    this.actionDeleteVisible = true;
  }

  getAssessments() {
    this.loading = true;
    this.pendingAssessmentService
      .getProcedureAssessments({
        complianceAssessmentID: this.complianceAssessmentID,
        controlAssessmentID: this.controlAssessmentID,
        govControlID: this.activeProcedure.govControlID,
        govControlRequirementAssessmentID:
          this.activeProcedure?.requirementAssessmentID,
        businessProcedureID: this.activeProcedure?.businessProcedureID,
        // businessProcedureAssessmentID:
        //   this.activeProcedure?.businessProcedureAssessmentID,
        pageNumber: 1,
        pageSize: 100,
        filters: [],
        sortField: null,
        sortDirection: null,
      })
      .subscribe((res: any) => {
        this.cuurentRequirmentControlAssessment = res.data.items;
        this.loading = false;
        console.log(this.cuurentRequirmentControlAssessment, 'this.cuurentRequirmentControlAssessment');
      });
  }

  cuurentRequirmentControlAssessment: any[] = [];
  activeGovControl: unknown;

  statusList: unknown;

  phases_list: any[] = [];
  workflowsList: any[] = [];

  getLookUps() {
    this.sharedService.lookUps([65, 66, 67, 68, 69, 70]).subscribe((res) => {
      this.phases_list = res?.data?.GovControlAssessmentPhaseType;
      this.workflowsList = res?.data?.GovControlAssessmentWorkflowStage;
      this.statusList = res?.data?.ControlComplianceStatusType;
    });
  }

  isSavingAssessment: boolean = false;
  loading: boolean = false;
  controlAssessmentID!: number;
  complianceAssessmentID!: number;
  govControlRequirementID!: number;
  goControlId!: number;
  addNewAssessment(event: PointerEvent, control: any) {
    event.stopPropagation();
    this.initForm();
    this.activeProcedure = control;
    this.currentAssessmentId = null;
    this.isSavingAssessment = true;
  }

  loadAction: boolean = false;

  save() {

    const canAdd = this._PermissionSystemService.can('COMPLIANCE' , 'ONGOINGASSSESSMENT_CONTROLSPROCEDURE' , 'ADD')
    const canEdit =this._PermissionSystemService.can('COMPLIANCE' , 'ONGOINGASSSESSMENT_CONTROLSPROCEDURE' , 'EDIT')
    if(this.currentAssessmentId && !canEdit)return
    if(!this.currentAssessmentId && !canAdd)return
      this.loadAction = true;

    let payload = {
      ...this.form.value,
      complianceAssessmentID: this.complianceAssessmentID,
      controlAssessmentID: this.controlAssessmentID,
      govControlID: this.activeProcedure.govControlID,
      businessProcedureID: this.activeProcedure.businessProcedureID,
    };
    if (this.currentAssessmentId) {
      payload = {
        ...payload,
        businessProcedureAssessmentID: this.currentAssessmentId,
      };
    }
    this.pendingAssessmentService
      .saveProcedureAssessment(payload)
      .pipe(finalize(() => (this.loadAction = false)))
      .subscribe({
        next: (res) => {
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Assessment added successfully.',
          });
          this.getAssessments();
          this.currentAssessmentId = null;
          this.isSavingAssessment = false;
          console.log(res, 'saved');
        },
      });
  }

  actionDeleteVisible: boolean = false;

  handleClosedDelete(event: boolean) {
    this.actionDeleteVisible = event;
  }
  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }
  form!: FormGroup;
  initForm(data?: any): void {
    this.form = new FormGroup({
      findings: new FormControl(data?.findings ?? null),
      risks: new FormControl(data?.risks ?? null),
      recommendations: new FormControl(data?.recommendations ?? null),
    });
  }

  loadDelted: boolean = false;
  deleteAssessment() {
    if(!this._PermissionSystemService.can('COMPLIANCE' , 'ONGOINGASSSESSMENT_CONTROLSPROCEDURE' , 'DELETE'))return
    this.loadDelted = true;
    this.pendingAssessmentService
      .deleteAssessment(this.currentAssessmentId)
      .pipe(finalize(() => (this.loadDelted = false)))
      .subscribe((res: any) => {
        this.loadDelted = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Assessment Deleted successfully',
        });
        this.getAssessments();
        this.currentAssessmentId = null;
        this.actionDeleteVisible = false;
      });
  }

  currentStep: number = 1;
  setCurrentStep(step: number) {
    this.currentStep = step;
  }

  showingDetails: boolean = false;
  showDetails(procedure: any) {
    this.showingDetails = true;
    this.activeProcedure = procedure;

    if (this.activeProcedure) {
      this.getAssessments();
    }
    console.log(procedure, 'control clicked');
  }
  activeAssessment:any
  setActiveAssessment(event:any,assessment:any){
    console.log(event);
    if(this.activeAssessment === assessment){
      this.activeAssessment =null
      return
    }
    if(!event)return    
    this.activeAssessment = assessment
    // 
  }

  resetAssessments(){
    this.cuurentRequirmentControlAssessment = []
  }
}
