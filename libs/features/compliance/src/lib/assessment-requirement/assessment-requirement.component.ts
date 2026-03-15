import { ComplianceService } from './../../compliance/compliance.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isArray, TranslateModule, TranslateService } from '@ngx-translate/core';
import { AccordionModule } from 'primeng/accordion';
import { RequirmentAssessmentService } from '../../services/requirment-assessment.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import {
  FormControl,
  FormGroup,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import {
  TextareaUiComponent,
  DeleteConfirmPopupComponent,
  LoaderComponent,
  NewAttachListComponent,
} from '@gfw/shared-ui';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { Button } from 'primeng/button';
import { finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import { SystemActionsComponent } from 'libs/shared/shared-ui/src/lib/system-actions/system-actions.component';
import { ViewAttachementComponent } from 'libs/shared/shared-ui/src/lib/view-attachement/view-attachement.component';
import { AttachmentsUiComponent } from 'libs/shared/shared-ui/src/lib/attachments-ui/attachments-ui.component';
import { EditAttachmentComponent } from 'libs/shared/shared-ui/src/lib/editAttachment/editAttachment.component';
import { TranslationService } from 'apps/campagin-app/src/app/shared/services/translation.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
interface IRequirmentControl {
  title: string;
  status: string;
  status_color: string;
  assessor: string;
  orgUnit: string;
  assessments?: IAsssessment[];
}
interface IAsssessment {
  title: string;
  status: string;
  status_color: string;
  date: Date;
  assessor: string;
  comment: string;
  attachments?: unknown[];
}
@Component({
  selector: 'lib-assessment-requirement',
  imports: [
    CommonModule,
    TranslateModule,
    AccordionModule,
    DialogModule,
    UiDropdownComponent,
    TextareaUiComponent,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    Button,
    DeleteConfirmPopupComponent,
    LoaderComponent,
    SystemActionsComponent,
    ViewAttachementComponent,
    NewAttachListComponent,
    AttachmentsUiComponent,
    EditAttachmentComponent,
  ],
  templateUrl: './assessment-requirement.component.html',
  styleUrl: './assessment-requirement.component.scss',
})
export class AssessmentRequirementComponent implements OnInit {
  constructor(
    private raService: RequirmentAssessmentService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private _ComplianceService: ComplianceService,
    private _MessageService: MessageService,
    private translateService:TranslateService,
    private translationService:TranslationService,
    public _PermissionSystemService:PermissionSystemService
  ) {
   this.currentLanguage= this.translationService.getSelectedLanguage()
    this.steps = [
      { name: this.translateService.instant('ASSESSMENT_REQUIREMENT.INFORMATIONS'), id: 1, icon: 'fi fi-rr-script' },
      { name: this.translateService.instant('ASSESSMENT_REQUIREMENT.ATTACHMENTS'), id: 2, icon: 'fi fi-rr-clip-file' },
    ];
    this.route.parent?.parent?.paramMap.subscribe((params) => {
      this.complianceAssessmentID = Number(params.get('id'));
      console.log('complianceAssessmentID', this.complianceAssessmentID);
    });

    this._ComplianceService.controlAssessmentID$.subscribe((res: any) => {
      console.log('res controlAssessmentID', res);
      this.controlAssessmentID = res;
    });
  }
  currentLanguage!:string
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

  activeControl!: any;
  setActiveControl(event: boolean, control: any) {
    this.activeControl = event ? control : null;

    control.isExpand = event;

    if (event) {
      this.getDataRequirmentControlAssessments();
    }
  }

  loadControls: boolean = true;

  getCovControlRequirments() {
    this.loadControls = true;
    this.raService
      .getRequimentsControl(this.complianceAssessmentID, this.goControlId)
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
  current_action_requirment_assessment_id: any;
  handleEdit(control: any, rquirment_assessment: any) {
    this.edit_flag = true;
    this.current_action_requirment_assessment_id =
      rquirment_assessment.govControlRequirementComplianceID;
    this.initForm(rquirment_assessment);
    this.activeControl = control;
    this.isSavingAssessment = true;
  }

  handleDelete(control: any, rquirment_assessment: any) {
    this.current_action_requirment_assessment_id =
      rquirment_assessment.govControlRequirementComplianceID;
    this.activeControl = control;
    this.actionDeleteVisible = true;
  }

  getDataRequirmentControlAssessments() {
    this.loading = true;
    this.raService
      .getRequirmentsControlAssessments({
        complianceAssessmentID: this.complianceAssessmentID,
        controlAssessmentID: this.controlAssessmentID,
        // govControlRequirementID:this.activeControl.govControlID,
        govControlRequirementAssessmentID:
          this.activeControl?.requirementAssessmentID,
        pageNumber: 1,
        pageSize: 100,
      })
      .subscribe((res: any) => {
        this.cuurentRequirmentControlAssessment = res.data.items;
        this.loading = false;
        console.log(this.controls, 'requirment controls');
      });
  }

  cuurentRequirmentControlAssessment: any[] = [];
  activeGovControl: unknown;

  statuses: { id: number; label: string }[] = [];
  users: { id: number; label: string }[] = [];
  getLookUps() {
    this.sharedService.lookUps([229]).subscribe({
      next: (res) => {
        const { ControlRequirementComplianceStatusType } = res.data;
        this.statuses = ControlRequirementComplianceStatusType;
      },
    });
    this.sharedService.getUserLookupData().subscribe({
      next: (res) => {
        this.users = res.data;
      },
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
    this.activeControl = control;
    this.isSavingAssessment = true;
  }

  loadAction: boolean = false;

  save() {
    const canAdd = this._PermissionSystemService.can('COMPLIANCE' , 'ONGOINGASSSESSMENT_CONTROLS_REQUIREMENTCONTROL' , 'ADD')
    const canEdit = this._PermissionSystemService.can('COMPLIANCE' , 'ONGOINGASSSESSMENT_CONTROLS_REQUIREMENTCONTROL' , 'EDIT')
    if(this.edit_flag && !canEdit)return
    if(!this.edit_flag && !canAdd)return
    this.loadAction = true;
    const payload = {
      ...this.asssesmentForm.value,
      controlAssessmentID: this.controlAssessmentID,
      complianceAssessmentID: this.complianceAssessmentID,
      // govControlRequirementID: this.activeControl.govControlID,
    };

    if (this.edit_flag) {
      payload['govControlRequirementAssessmentID'] =
        this.current_action_requirment_assessment_id;
    }

    if (!this.edit_flag) {
      payload['govControlRequirementAssessmentID'] =
        this.activeControl?.requirementAssessmentID;
    }

    const API$ = this.edit_flag
      ? this.raService.editAssessment(payload)
      : this.raService.saveAssessment(payload);

    API$.pipe(finalize(() => (this.loadAction = false))).subscribe({
      next: (res: any) => {
        console.log(res, 'saved...');
        console.log(res.idResult, 'res.idResult');
        this.loadAction = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Assessment saved successfully',
        });
        this.getDataRequirmentControlAssessments();
        this.current_action_requirment_assessment_id = null;
        this.FEAT_ID = res.idResult;
        if (!res.idResult) {
          this.isSavingAssessment = false;

          return;
        }
        this.getAttachments();
        this.currentStep = 2;
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
  asssesmentForm!: FormGroup;

  loadDelted: boolean = false;
  deleteRequirmentAssessment() {
    this.loadDelted = true;
    this.raService
      .deleteAssessment(this.current_action_requirment_assessment_id)
      .pipe(finalize(() => (this.loadDelted = false)))
      .subscribe((res: any) => {
        this.loadDelted = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Assessment Deleted successfully',
        });

        this.getDataRequirmentControlAssessments();
        this.current_action_requirment_assessment_id = null;
        this.actionDeleteVisible = false;
      });
  }
  initForm(data?: any) {
    this.asssesmentForm = new FormGroup({
      // assessmentDate: new FormControl(
      //   data?.assessmentDate ? new Date(data?.assessmentDate) : null,
      //   Validators.required
      // ),
      // assessedByUserID: new FormControl(
      //   data?.assessedByUserID ?? null,
      //   Validators.required
      // ),
      govControlRequirementComplianceStatusTypeID: new FormControl(
        data?.govControlRequirementComplianceStatusTypeID ?? null,
        Validators.required
      ),
      comments: new FormControl(data?.comments ?? null, Validators.required),
    });
  }

  currentStep: number = 1;
  setCurrentStep(step: number) {
    this.currentStep = step;
  }

  env: any;
  attachments: any[] = [];
  show_add_dailog: boolean = false;
  displayModal: boolean = false;
  selected_file_show: any;
  edit_file_name: boolean = false;
  current_title_update: string = '';
  current_file_update: any;
  loadUpdate: boolean = false;
  loadingState: boolean = false;
  dataEntityTypeId: number = 25;
  FEAT_ID!: number;
  fileGroupType: string = '1';
  getAttachments() {
    this.loadingState = true;
    this.sharedService
      .getNewAttachment(this.dataEntityTypeId, this.FEAT_ID)
      .subscribe({
        next: (res: any) => {
          this.attachments = res?.data;
          this.loadingState = false;
        },
      });
  }

  handleAdded(event: any) {
    if (event) {
      this.getAttachments();
    }
    this.show_add_dailog = false;
  }

  handleShowAdd(event: boolean) {
    this.show_add_dailog = event;
  }

  handleActionSingleFile(event: any) {
    switch (event.action) {
      case 'Delete':
        this.sharedService.deleteAttachment(event.file.fileID).subscribe({
          next: () => {
            this._MessageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Attachment Deleted Successfully',
            });
            this.getAttachments();
          },
        });
        break;

      case 'Download':
        this.sharedService.downloadAttachment(event.file.fileID).subscribe({
          next: (res: any) => {
            const blob = new Blob([res], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = event.file.fileTitle + '.' + event.file.fileExtension;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          },
        });
        break;

      case 'Show':
        this.sharedService
          .getSingleAttachment(event.file.fileUsageID)
          .subscribe({
            next: (res: any) => {
              this.selected_file_show = res?.data;
              this.displayModal = true;
            },
          });
        break;
      case 'Edit':
        this.edit_file_name = true;
        this.current_title_update = event.file.fileTitle;
        this.current_file_update = event.file;
        break;

      default:
        break;
    }
  }

  handleUpdateTitle(newTitle: string) {
    if (!this.current_file_update) return;

    this.loadUpdate = true;
    this.sharedService
      .updateAttachment(this.current_file_update.fileUsageID, newTitle)
      .subscribe({
        next: () => {
          this.loadUpdate = false;
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Attachment Updated Successfully',
          });
          this.edit_file_name = false;
          this.getAttachments();
          this.current_file_update = null;
          this.current_title_update = '';
        },
        error: () => {
          this.loadUpdate = false;
        },
      });
  }

  handleHideView(event: boolean) {
    this.displayModal = event;
  }

  steps: any = [];
}
