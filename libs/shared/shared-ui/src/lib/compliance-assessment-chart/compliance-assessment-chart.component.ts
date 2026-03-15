import { Component, input, output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { DropdownModule } from 'primeng/dropdown';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { HttpClient } from '@angular/common/http';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { DialogModule } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DashboardLayoutService } from 'libs/features/dashboard/src/services/dashboard-layout.service';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { InputTextComponent } from '../input-text/input-text.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { FilterDashboardComponent } from 'libs/features/dashboard/src/lib/filter-dashboard/filter-dashboard.component';
import { ThemeCustomService } from '../../services/theme.service';
import { TranslateModule } from '@ngx-translate/core';
import { MenuModule } from 'primeng/menu';
import { SkeletonModule } from "primeng/skeleton";

@Component({
  selector: 'lib-compliance-assessment-chart',
  imports: [
    CommonModule,
    ProgressBarModule,
    DropdownModule,
    FormsModule,
    DialogModule,
    Button,
    ReactiveFormsModule,
    InputTextComponent,
    FilterDashboardComponent,
    TranslateModule,
    MenuModule,
    SkeletonModule
],
  templateUrl: './compliance-assessment-chart.component.html',
  styleUrl: './compliance-assessment-chart.component.scss',
})
export class ComplianceAssessmentChartComponent {
  constructor(
    private sharedService: SharedService,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private dashboardLayoutService: DashboardLayoutService,
    private messageService: MessageService,
    private themeCustomService: ThemeCustomService
  ) {
    this.dashboardLayoutService.filter_visible$.subscribe((res) => {
      this.filter_visible = res;
    });
    const id = this.route.snapshot.parent?.paramMap.get('id');
    if (!id) return;
    this.dashboardId = +id;
    this.initForm()
    this.getAssessments();
  }
  filter_visible: boolean = false;
  dashboardId!: number;
  mode = input.required<string>();
  chart_config_input = input.required<any>();
  private readonly DEFAULT_COLORS = [
    '#6E39CB',
    '#09c',
    '#027A48',
    '#F59E42',
    '#F43F5E',
    '#0EA5E9',
    '#FACC15',
  ];

  data: any;
  current_chart_data: any;
  loading_Data: boolean = false;

  ngOnChanges(changes: SimpleChanges) {
    const dataChanges = changes['chart_config_input'];
    this.selectedWidth =
      this.chart_config_input()?.data?.width || this.selectedWidth;

    console.log(dataChanges, 'data Changes');

    if (dataChanges) {
      this.data = {
        ...dataChanges.currentValue.data,
        title: dataChanges.currentValue.title,
      };
    }
    console.log(this.data, 'this.data');
    this.getAssessmentSettings(this.data.settingsResource);
  }
  assessments: { label: string; id: number }[] = [];
  getAssessments() {
    this.sharedService.lookUps([94]).subscribe({
      next: (res) => {
        this.assessments = res.data.ComplianceAssessment;
      },
    });
  }

  widthOptions: any[] = [
    {
      id: 1,
      value: 0.5,
    },
    {
      id: 2,
      value: 0.75,
    },
    {
      id: 3,
      value: 1,
    },
    {
      id: 4,
      value: 1.5,
    },
  ];
  selectedWidth: any = this.widthOptions[3].value;
  actionEmitter = output<any>();
  onAssessmentChange() {
      this.getClassficationByAssessmentId(this.currentAssessment?.id)
  }
  assessmentData: any;
  loadingAssessmentData:boolean=true
  getAssessmentData(url: string) {
    if (!url || !this.currentAssessment) return;
    url = url.replace('api/', enviroment.API_URL);
    this.httpClient.post(url, { complianceAssessmentID: this.currentAssessment.id , compliancePhaseID:this.assessmentSettings?.compliancePhaseID , grcDocumentElementClassificationID: this.assessmentSettings?.grcDocumentElementClassificationID  }).pipe((finalize(() => this.loadingAssessmentData=false))).subscribe({
      next: (res: unknown) => {
        if (res && typeof res === 'object' && 'data' in res) {
          this.assessmentData = res.data;
          // this.setAnalysis();
          this.initControls(this.assessmentData);

          this.handleFilters(this?.assessmentData);
          console.log(res, 'url response');
        }
      },
    });
    console.log(url, 'url here');
  }
  handleFilters(data: any) {
    if (!data.datasets) return;
    const resLabels = data?.labels ?? [];
    const dataset = data?.datasets?.[0] ?? {};
    const resData = dataset.data ?? [];
    const resColors =
      dataset.backgroundColor.map((color: string) => {
        return this.themeCustomService.colorFactor(color);
      }) || this.DEFAULT_COLORS;
    const chartName = dataset.label ?? 'Bar Chart';
    this.current_chart_data = {
      labels: resLabels,
      data: resData,
      colors: resColors,
      chartName: chartName,
    };

    this.loading_Data = false;
  }
  assessmentSettings: any;
  getAssessmentSettings(url: string) {
    if (!url) return;
    url = url.replace('api/', enviroment.API_URL);
    this.httpClient.get(url).subscribe({
      next: (res: any) => {
        this.assessmentSettings = res.data.settings;
        this.currentAssessment =
          this.assessmentSettings.assessment ?? this.assessments[0];
          this.getClassficationByAssessmentId(this.currentAssessment?.id);
    this.getAssessmentData(this.data.dataResource);
        this.initForm(this.assessmentSettings);
        console.log(res, ' got assessment settings ');
      },
    });
  }

  setAnalysis() {
    this.analysises = [
      {
        id: 1,
        title: 'Requirements',
        value: this?.assessmentData.requirementCount.totalCount,
        icon: 'fi fi-rr-list-check',
      },
      {
        id: 2,
        title: 'Findings',
        value: this?.assessmentData.findingCount.totalCount,
        icon: 'fi fi-rr-search',
      },
      {
        id: 3,
        title: 'Corrective actions',
        value: this?.assessmentData.correctiveActionCount.totalCount,
        icon: 'fi fi-rr-tools',
      },
    ];
  }
  currentAssessment!: any;
  analysises: any[] = [];

  setting_form!: FormGroup;
  initForm(formData?: any) {
    this.setting_form = new FormGroup({
      title: new FormControl(formData?.title ?? null),
      titleAr: new FormControl(formData?.titleAr ?? null),
            compliancePhaseID: new FormControl(formData?.compliancePhaseID ?? null),
      grcDocumentElementClassificationID: new FormControl(formData?.grcDocumentElementClassificationID ?? null),
      // content: new FormControl(formData?.content ?? null),
    });
  }
  setting_visible: boolean = false;
  loadingSave: boolean = false;
  saveSettings() {
    this.loadingSave = true;
    const payload = {
      reportDefinitionId: this.dashboardId,
      reportPartId: this.data.id,
      configJson: {
        ...this.setting_form.value,
        assessment: this.currentAssessment,
      },
    };

    this.dashboardLayoutService
      .updateWidgetSetting(payload)
      .pipe(finalize(() => (this.loadingSave = false)))
      .subscribe({
        next: (res) => {
          this.setting_visible = false;
          this.getAssessmentSettings(this?.data?.settingsResource);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Widget Setting Saved Successfully',
          });
        },
      });
  }

  handleWidthChange() {
    console.log(this.selectedWidth, 'this.selectedWidth');

    this.actionEmitter.emit({
      widget: this.chart_config_input()?.data,
      event: 'resize',
      value: this.selectedWidth,
    });
  }

  current_widget_applied_filters: any[] = [];

  handleDataFilter(event: any) {
    if (!this.currentAssessment) return;
    this.current_widget_applied_filters = event;
    this.httpClient.post(
      `${enviroment.DOMAIN_URI}${this.data?.dataResource}/${this.currentAssessment.id}`,
      { id: this.currentAssessment.id, filters: event }
    );
  }


  analysisConfig: any = {
  'Compliant': {
    color: 'success',
    icon: 'fi fi-rs-check-circle',
  },
  'Partially Compliant': {
    color: 'warning',
    icon: 'fi fi-rr-circle-half',
  },
  'Non Compliant': {
    color: 'error',
    icon: 'fi fi-rr-cross-circle',
  },
  'Not Selected': {
    color: 'error',
    icon: 'fi fi-rr-minus',
  },
  'Not Applicable': {
    color: 'error',
    icon: 'fi fi-rr-info',
  }
};

  controls: any[] = [];
initControls(data: any) {

  this.controls = data?.status?.items?.map((item: any, index: number) => {

    const config = this.analysisConfig[item.name] || {};

    return {
      id: index + 1,
      title: item.name,
      color: config?.color || 'default',
      icon: config?.icon || 'fi fi-rr-circle',
      count: item.count,
    };

  }) || [];



  console.log("controls Analysis " , this.controls);


}




  classfications:any[] = []


  getClassficationByAssessmentId(id:any){
    this.dashboardLayoutService.getClassficationDataByAssessmentId(id).subscribe((res:any)=>{
      this.classfications = res?.data
    })
  }

  assessmentsPhases:any[]=[
    {
      id:1,
      label:'Phase 1'
    },
    {
      id:2,
      label:'phase 2'
    }
  ]
}
