import { Component, input, OnChanges, OnInit, output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { ComplianceAssessmntService } from '../../services/compliance-assessmnt.service';
import { finalize } from 'rxjs';
import { SkeletonModule } from "primeng/skeleton";
import { DialogModule } from 'primeng/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextComponent } from "libs/shared/shared-ui/src/lib/input-text/input-text.component";
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from "primeng/button";
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TranslationsService } from 'apps/gfw-portal/src/app/core/services/translate.service';
import { HttpClient } from '@angular/common/http';
import { DashboardLayoutService } from 'libs/features/dashboard/src/services/dashboard-layout.service';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { EmptyStateDashbourdComponent } from "libs/shared/shared-ui/src/lib/empty-state-dashbourd/empty-state-dashbourd.component";
import { NodeAssessmentComponent } from './node-assessmnet/node-assessment.component';
interface IData {
  id: number;
  parentId:number;
  name:string;
  code:string;
  objective: string;
  statusName: string;
  statusColor: string;
  controlsCount:number;
  notes:string;
  risks:string;
  recommendations:string
  findings:string;
  children: IData[];
}

@Component({
  selector: 'lib-assessments-details',
  imports: [CommonModule, NodeAssessmentComponent,DropdownModule, ReactiveFormsModule, DialogModule, AccordionModule, SkeletonModule, InputTextComponent, ButtonModule, EmptyStateDashbourdComponent],
  templateUrl: './assessments-details.component.html',
  styleUrl: './assessments-details.component.scss',
})
export class AssessmentsDetailsComponent implements OnInit, OnChanges {
  constructor(
    private _SharedService:SharedService,
    private complianceAssessmentService: ComplianceAssessmntService,
    private _ActivatedRoute:ActivatedRoute,
    private _DashboardLayoutService:DashboardLayoutService,
    private  _MessageService:MessageService,
    private _TranslationsService:TranslationsService,
    private _HttpClient:HttpClient
  ) {
    // this.getData();



    this._ActivatedRoute.parent?.paramMap.subscribe((params) => {
      console.log("params:", params.get('id'));
      this.current_report_id = params.get('id')
    })
  }


  current_report_id:any;
  currentLanguage:string= 'en'
  ngOnInit(): void {
    this.getAssessments()
    this.initSettingForm();
        this.currentLanguage = this._TranslationsService.getSelectedLanguage();

  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chart_config_input'].currentValue) {
      if (this.chart_config_input()?.data?.settingsResource) {
        this.getSettingData()
      }
    }
  }
  data: IData[] = [];

    actionEmitter = output<any>();


  mode = input<string>();

  setting_visible:boolean = false;

  chart_config_input = input<any>()

  loadingData: boolean = true;
  getData() {
    this.loadingData = true;
    this.data = []
    this.complianceAssessmentService
      .getComplianceAssessmentDashboardDetails(this.setting_data?.assessmentId, this.setting_data?.compliancePhaseID)
      .pipe(finalize(() => (this.loadingData = false)))
      .subscribe({
        next: (res: any) => {
          this.data = res.data;
        },
      });
  }


    assessmentsPhases: any[] = [
    {
      id: 1,
      label: 'Phase 1'
    },
    {
      id: 2,
      label: 'phase 2'
    }
  ]
  setting_form!:FormGroup;



    assessments: { label: string; id: number }[] = [];
  getAssessments() {
    this._SharedService.lookUps([94]).subscribe({
      next: (res) => {
        this.assessments = res.data.ComplianceAssessment;
      },
    });
  }
  initSettingForm(data?: any) {
    console.log("data widget", data);

    this.setting_form = new FormGroup({
      title: new FormControl(data ? data?.title : ''),
      titleAr: new FormControl(data ? data?.titleAr : ''),
      assessmentId: new FormControl(data ? data?.assessmentId : ''),
      compliancePhaseID: new FormControl(data ? data?.compliancePhaseID : ''),
    })




  }

  loading_setting_save:boolean = false;


  handleSaveSetting(){
    //

      this.loading_setting_save = true
    const req = {
      "reportDefinitionId": this.current_report_id,
      "reportPartId": this.chart_config_input()?.data?.id,
      "configJson": this.setting_form.value,
    }
    this._DashboardLayoutService.updateWidgetSetting(req).subscribe({
      next: (res: any) => {

        this.loading_setting_save = false
        this.setting_visible = false
        this._MessageService.add({ severity: 'success', summary: 'Success', detail: 'Widget Setting Saved Successfully' });

        this.getSettingData()
      }
    })
  }


    setting_data:any
    getSettingData() {
      this._HttpClient.get(enviroment.DOMAIN_URI + this.chart_config_input()?.data?.settingsResource).subscribe((res: any) => {
        console.log("dounght setting", res);
        this.setting_data = res?.data?.settings
        this.initSettingForm(res?.data?.settings);
       this.getData()
      })
    }


}
