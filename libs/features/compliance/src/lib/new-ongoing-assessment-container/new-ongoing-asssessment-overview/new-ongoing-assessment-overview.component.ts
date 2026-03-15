import { Component, effect, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiDropdownComponent } from "libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component";
import { TranslateModule } from '@ngx-translate/core';
import { TextareaUiComponent } from "@gfw/shared-ui";
import { PendingAssessmentService } from '../../../services/pending_assessment.service';
import { ButtonModule } from "primeng/button";
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { OverviewEntry, SharedOverviewComponent } from "libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component";
@Component({
  selector: 'lib-new-ongoing-assessment-overview',
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, UiDropdownComponent, TextareaUiComponent, ButtonModule, SharedOverviewComponent],
  templateUrl: './new-ongoing-assessment-overview.component.html',
  styleUrl: './new-ongoing-assessment-overview.component.scss',
})
export class NewOngoingAssessmentOverviewComponent implements OnInit {

  constructor(private _SharedService: SharedService, private _MessageService: MessageService, private _PendingAssessmentService: PendingAssessmentService) {
    effect(() => {


      if (this.assessmentItemResultID()) {
        this.getComplianceAssessmentItemResultById(this.assessmentItemResultID())
      }
    })



  }






  currentItemResultData: any;

  loading_data = true

  getComplianceAssessmentItemResultById(id: any) {
    this.loading_data = true
    this._PendingAssessmentService.getComplianceAssessmentItemResultById(id).subscribe({
      next: (res: any) => {
        this.currentItemResultData = res?.data;
        this.loading_data= false;
               this._PendingAssessmentService.getComplianceAssessmentStatusByItemResultId(this.currentItemResultData?.complianceAssessmentItemResultStatusTypeProfileID).subscribe({
          next: (res: any) => {
            this.statusList = res?.data;
          }
        })

        this.initForm(this.currentItemResultData)
      }
    })
  }


  assessmentItemResultID = input<any>();
  mode = input<string>();


  entires:OverviewEntry[] = [
    {
      key:'complianceAssessmentItemResultStatusTypeName',
      label:'ASSESSMENT.SELECT_COMPLIANCE_STATUS',
      type:'badge',
      colorKey:'complianceAssessmentItemResultStatusTypeColor'
    },
    {
      key:'findings',
      label:'ASSESSMENT.Finding',
      type:'description'
    },
    {
      key:'risks',
      label:'ASSESSMENT.Risk',
      type:'description'
    },
    {
      key:'recommendations',
      label:'ASSESSMENT.Recommendation',
      type:'description'
    }
  ]

  loadLookups() {
    this._SharedService.lookUps([65, 66, 67, 68, 69, 70, 29, 244]).subscribe((res) => {
      this.phases_list = res?.data?.GovControlAssessmentPhaseType;
      this.workflowsList = res?.data?.GovControlAssessmentWorkflowStage;

    });



  }
  ngOnInit() {
    this.loadLookups()
    this.initForm();
    console.log("Current Mode" , this.mode());

  }

  activeAssessment: number = 1

  form!: FormGroup;

  workflowsList: any[] = [];
  phases_list: any[] = []

  statusList: any[] = []

  initForm(data?: any): void {
    this.form = new FormGroup({
      complianceAssessmentItemResultStatusTypeID: new FormControl(data?.complianceAssessmentItemResultStatusTypeID || null, [
        Validators.required,
      ]),
      findings: new FormControl(data?.findings || null),
      risks: new FormControl(data?.risks || null),
      recommendations: new FormControl(data?.recommendations || null),
      // GovControlAssessmentWorkflowStageID: new FormControl(null),
      // govControlAssessmentPhaseTypeID: new FormControl(data?.govControlAssessmentPhaseTypeID || null  ),
    });
  }



  saving: boolean = false;


  save() {
    //
    if(this.mode() === 'readonly')return
    this.saving = true;
    const payload = {
      assessmentItemResultID: this.assessmentItemResultID(),
      ...this.form.value
    }


    this._PendingAssessmentService.updateComplianceAssessmentItemResult(payload).subscribe({
      next: (res: any) => {
        this.saving = false;
        this._MessageService.add({ severity: 'success', summary: 'Success', detail: 'Item Result Updated Successfully' });
        this.getComplianceAssessmentItemResultById(this.assessmentItemResultID())
      },
      error: () => {
        this.saving = false;
      }
    })

  }
}
