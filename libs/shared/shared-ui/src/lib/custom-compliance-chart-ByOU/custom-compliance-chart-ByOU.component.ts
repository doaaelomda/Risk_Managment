/* eslint-disable @nx/enforce-module-boundaries */
import { DashboardLayoutService } from 'libs/features/dashboard/src/services/dashboard-layout.service';
import { TranslationsService } from 'apps/gfw-portal/src/app/core/services/translate.service';
import { Component, input, OnChanges, OnDestroy, OnInit, output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from "primeng/button";
import { SwitchUiComponent } from "../switch-ui/switch-ui.component";
import { InputTextComponent } from "../input-text/input-text.component";
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from "primeng/dropdown";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterDashboardComponent } from "libs/features/dashboard/src/lib/filter-dashboard/filter-dashboard.component";
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { SharedService } from '../../services/shared.service';
import { finalize, Subscription } from 'rxjs';
import { DonutChartComponent } from "./donut-chart/donut-chart.component";
import { KanobChartComponent } from './kanob-chart/kanob-chart.component';
import { EmptyStateDashbourdComponent } from "../empty-state-dashbourd/empty-state-dashbourd.component";
@Component({
  selector: 'lib-custom-compliance-chart-by-ou',
  imports: [CommonModule, KanobChartComponent, FormsModule, TranslateModule, ReactiveFormsModule, DialogModule, ButtonModule, SwitchUiComponent, InputTextComponent, DropdownModule, FilterDashboardComponent, DonutChartComponent, EmptyStateDashbourdComponent],
  templateUrl: './custom-compliance-chart-ByOU.component.html',
  styleUrl: './custom-compliance-chart-ByOU.component.scss',
})
export class CustomComplianceChartByOUComponent implements OnInit, OnChanges , OnDestroy {

  load_chartData:boolean = true


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chart_config_input'].currentValue) {
      this.selectedWidth = this.chart_config_input()?.data?.width || this.selectedWidth;
      console.log("dounght chart", this.chart_config_input());

      if (this.chart_config_input()?.data?.settingsResource) {
        this.getSettingData()
      }
    }
  }
    constructor(private _SharedService: SharedService, private _HttpClient: HttpClient, private _MessageService: MessageService, private _ActivatedRoute: ActivatedRoute, private _TranslationsService: TranslationsService, private dashboardLayoutService: DashboardLayoutService) {
    // this.dashboardLayoutService.filter_visible$.subscribe(visible => {
    //   this.filter_visible = visible;
    // });

    this._ActivatedRoute.parent?.paramMap.subscribe((params) => {
      console.log("params:", params.get('id'));
      this.current_report_id = params.get('id')
    })
  }


    ngOnInit(): void {
      this.getAssessments()
    this.initSettingForm();
    this.currentLanguage = this._TranslationsService.getSelectedLanguage();
  }


  ngOnDestroy(): void {
    this.form_sub.unsubscribe()
  }



  mode = input<any>();
  chart_config_input = input<any>();


  setting_data:any
  getSettingData() {
    this._HttpClient.get(enviroment.DOMAIN_URI + this.chart_config_input()?.data?.settingsResource).subscribe((res: any) => {
      console.log("dounght setting", res);
      this.setting_data = res?.data?.settings
      this.initSettingForm(res?.data?.settings);
      this.getAssessmentData(this.chart_config_input()?.data?.dataResource)
    })
  }

  loadingAssessmentData:boolean= false;

  chart_widgets_data:any[]=[]
    getAssessmentData(url: string) {
      this.chart_widgets_data = []
      this.load_chartData = true;
      if (!url || !this.setting_form.get('assessmentId')?.value) return;
      url = url.replace('api/', enviroment.API_URL);
      this._HttpClient.get(`${url}?complianceAssessmentId=${this.setting_data?.assessmentId}&compliancePhaseId=${this.setting_data?.compliancePhaseID}&grcDocumentElementClassificationId=${this.setting_data?.grcDocumentElementClassificationID}`).pipe(finalize(() => this.loadingAssessmentData =false)).subscribe({
        next: (res: any) => {
          console.log("ResponseData" , res);
          this.chart_widgets_data =  res?.data
          this.loadingAssessmentData = false;
          this.load_chartData = false;
        },
      });
      console.log(url, 'url here');
    }

    classfications:any[]=[];


  getClassficationByAssessmentId(id:any){
    this.dashboardLayoutService.getClassficationDataByAssessmentId(id).subscribe((res:any)=>{
      this.classfications = res?.data
    })
  }


  assessments: { label: string; id: number }[] = [];
  getAssessments() {
    this._SharedService.lookUps([94]).subscribe({
      next: (res) => {
        this.assessments = res.data.ComplianceAssessment;
      },
    });
  }

  current_report_id: any;
  widthOptions: any[] = [
    {
      id: 1,
      value: .5,
    },
    {
      id: 2,
      value: .75,
    },
    {
      id: 3,
      value: 1,
    },
    {
      id: 4,
      value: 1.5,
    },

  ]


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

  selectedWidth: any = this.widthOptions[3].value;

  currentLanguage!: string


  actionEmitter = output<any>();



  setting_visible: boolean = false;



  setting_form!: FormGroup;


  form_sub!:Subscription;

  initSettingForm(data?: any) {
    console.log("data widget", data);

    this.setting_form = new FormGroup({
      title: new FormControl(data ? data?.title : ''),
      titleAr: new FormControl(data ? data?.titleAr : ''),
      assessmentId: new FormControl(data ? data?.assessmentId : ''),
      compliancePhaseID: new FormControl(data ? data?.compliancePhaseID : ''),
      grcDocumentElementClassificationID: new FormControl(data ? data?.grcDocumentElementClassificationID : ''),
      donut_chart: new FormControl(data ? data?.donut_chart : false),
      show_filter: new FormControl(data ? data?.show_filter : false),
    })


    if(data && data?.assessmentId){
      this.getClassficationByAssessmentId(data?.assessmentId)
    }


    this.form_sub = this.setting_form.get('assessmentId')?.valueChanges.subscribe((value) => {
      this.getClassficationByAssessmentId(value);
    }) || new Subscription();



  }

  loading_setting_save: boolean = false;

  handleSaveSetting() {
    this.loading_setting_save = true
    const req = {
      "reportDefinitionId": this.current_report_id,
      "reportPartId": this.chart_config_input()?.data?.id,
      "configJson": this.setting_form.value,
    }
    this.dashboardLayoutService.updateWidgetSetting(req).subscribe({
      next: (res: any) => {

        this.loading_setting_save = false
        this.setting_visible = false
        this._MessageService.add({ severity: 'success', summary: 'Success', detail: 'Widget Setting Saved Successfully' });
      this.getAssessmentData(this.chart_config_input()?.data?.dataResource)
      }
    })
  }


  current_widget_applied_filters: any[] = []


  filter_visible: boolean = false;
  show_filter: boolean = false;


  handleDataFilter(event: any) {
    //
  }
}
