import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ComplianceService } from '../../compliance/compliance.service';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { TextareaUiComponent, LoaderComponent } from '@gfw/shared-ui';
import { Button } from 'primeng/button';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { PendingAssessmentService } from '../../services/pending_assessment.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { OwnerUserComponent } from "libs/shared/shared-ui/src/lib/ownerUser/ownerUser.component";
import { SystemActionsComponent } from "libs/shared/shared-ui/src/lib/system-actions/system-actions.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
export interface IAssessment {
  id: number;
  title: string;
  count: number;
  status_name: string;
  status_color:string
}
@Component({
  selector: 'lib-pending-assessment',
  imports: [
    CommonModule,
    AccordionModule,
    TranslateModule,
    DialogModule,
    UiDropdownComponent,
    TextareaUiComponent,
    ReactiveFormsModule,
    Button,
    OwnerUserComponent,
    LoaderComponent,
    SystemActionsComponent
],
  templateUrl: './pending-assessment.component.html',
  styleUrl: './pending-assessment.component.scss',
})
export class PendingAssessmentComponent implements OnInit {
  constructor(private _ActivatedRoute:ActivatedRoute,private _MessageService:MessageService ,private _ComplianceService:ComplianceService,private sharedService: SharedService , private _PendingAssessmentService:PendingAssessmentService, public _PermissionSystemService:PermissionSystemService) {
    //


    this._ActivatedRoute.parent?.parent?.paramMap.subscribe((params)=>{
      console.log("params",params);
      this.complianceAssessmentID = params.get('id');

    });



    this._ComplianceService.GovControlData$.subscribe((res:any)=>{
      console.log("res govControlID " , res);

      this.govControlID = res?.govControlID;
      if(this.govControlID){
        this.getAssmentsTypesStatus()


      }
    });
  }


  govControlID:any
  ngOnInit() {

    this.initForm();

    this.loadLookups();

  }
  tabs:any[] = [

  ];
  activeAssessment: number = 1;
  assessments: IAssessment[] = [
    {
      id: 1,
      title: 'Compliance Assessment',
      count: 5,
      status_name: '-',
      status_color:'DodgerBlue'
    },
    {
      id: 2,
      title: 'Maturity Assessment',
      count: 5,
      status_name: '-',
      status_color:'DodgerBlue'
    },
  ];
  setActiveAssessment(assessment: IAssessment) {
    this.activeAssessment = assessment.id;
    this.loadLookups();
    this.getCurrentListView()
  }


  loading_list: boolean = false;
  getCurrentListView(){
    this.loading_list = true;
    this.tabs = [];
    const payload = {
        "pageNumber": 1,
  "pageSize": 100,

  "govControlID": this.govControlID,
  "complianceAssessmentID": +this.complianceAssessmentID
    }
    const API$ = this.activeAssessment === 1 ? this._PendingAssessmentService.getComplianceAssessmentList(payload) : this._PendingAssessmentService.getMaturityAssessmentList(payload);


    API$.subscribe((res:any)=>{
      console.log("assessment list",res);
      this.loading_list = false;
      this.tabs = res?.data?.items;
    });
  }

  addingAssessment: boolean = false;
  createAssessment(assessment: IAssessment) {
    console.log(assessment, 'assessment here');

    this.addingAssessment = true;
  }
  form!: FormGroup;
  initForm(): void {
    this.form = new FormGroup({
      controlComplianceStatusTypeID: new FormControl(null, [
        Validators.required,
      ]),
      findings: new FormControl(null),
      risks: new FormControl(null),
      recommendations: new FormControl(null),
      GovControlAssessmentWorkflowStageID: new FormControl(null),
      GovControlAssessmentPhaseTypeID: new FormControl(null),
    });
  }
  saving: boolean = false;
  complianceAssessmentID:any;
  save() {
    const canAdd = this._PermissionSystemService.can('COMPLIANCE' , 'ONGOINGASSSESSMENT_CONTROLSASSESSMENT' , 'ADD')  
    if(!canAdd)return
    this.saving = true;
    const payload = {
      govControlID:this.govControlID,
      ...this.form.value,
      complianceAssessmentID: this.complianceAssessmentID
    }
    switch (this.activeAssessment) {
      case 1:

        this._PendingAssessmentService.addComplianceAssessment(payload).pipe(finalize(()=> this.saving = false)).subscribe((res:any)=>{
          this.saving = false;
          this.addingAssessment = false;
          this._MessageService.add({severity:'success', summary:'Success', detail:'Compliance Assessment added successfully'});
          this.getCurrentListView()
        });
        break;

        case 2:
        payload['govControlMaturityLevelID'] = payload['controlComplianceStatusTypeID'];
        delete payload['controlComplianceStatusTypeID'];
        this._PendingAssessmentService.addMaturityAssessment(payload).pipe(finalize(()=> this.saving = false)).subscribe((res:any)=>{
          this.saving = false;
          this.addingAssessment = false;
          this._MessageService.add({severity:'success', summary:'Success', detail:'Maturity Assessment added successfully'});
          this.getCurrentListView()
        });
        break;
      default:
        break;
    }




  }
  statusList: unknown;

  phases_list:any[]=[];
  workflowsList:any[]=[];
  loadLookups() {
    this.sharedService.lookUps([65, 66, 67, 68 , 69 , 70,29]).subscribe((res) => {
              this.phases_list = res?.data?.GovControlAssessmentPhaseType;
        this.workflowsList = res?.data?.GovControlAssessmentWorkflowStage;
      switch (this.activeAssessment) {
        case 1:
          this.statusList = res?.data?.ControlComplianceStatusType;
          break;
        case 2:
          this.statusList = res?.data?.GovControlMaturityLevel;

          break;
      }
    });
  }

  getAssmentsTypesStatus(){
    this._PendingAssessmentService.getAssessmentsTypes(this.complianceAssessmentID , this.govControlID).subscribe((res:any)=>{
      console.log("getAssmentsTypesStatus" , res);
      this.assessments[0].status_name = res?.data?.complianceStatusTypeName || "-"
      this.assessments[0].status_color = res?.data?.complianceStatusTypeColor || "DodgerBlue"
      this.assessments[1].status_name = res?.data?.maturityStatusTypeName || "-"
      this.assessments[1].status_color = res?.data?.maturityStatusTypeColor || "DodgerBlue";
      this.getCurrentListView();
    })
  }


  deleteAssessment(tab:any , event:PointerEvent){
    if(!this._PermissionSystemService.can('COMPLIANCE' , 'ONGOINGASSSESSMENT_CONTROLSASSESSMENT' , 'DELETE'))return
    event.stopPropagation();
    console.log("delete",tab);


    switch (this.activeAssessment) {
      case 1:
        //delete compliance assessment
        this._PendingAssessmentService.deleteComplianceAssessment(tab?.govControlComplianceAssessmentID).subscribe((res:any)=>{
          this._MessageService.add({severity:'success', summary:'Success', detail:'Compliance Assessment deleted successfully'});
          this.getCurrentListView();
        });
        break;
      case 2:
        //delete maturity assessment
        this._PendingAssessmentService.deleteMaturityAssessment(tab?.govControlMaturityAssessmentID).subscribe((res:any)=>{
          this._MessageService.add({severity:'success', summary:'Success', detail:'Maturity Assessment deleted successfully'});
          this.getCurrentListView();
        });
        break;
    }

  }




}
