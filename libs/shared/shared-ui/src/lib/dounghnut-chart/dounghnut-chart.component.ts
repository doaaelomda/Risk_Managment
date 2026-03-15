/* eslint-disable @nx/enforce-module-boundaries */
import { TranslationsService } from 'apps/gfw-portal/src/app/core/services/translate.service';
import { AfterViewInit, Component, ElementRef, input, OnChanges, OnDestroy, OnInit, output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DialogModule } from "primeng/dialog";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DashboardLayoutService } from 'libs/features/dashboard/src/services/dashboard-layout.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { FilterDashboardComponent } from "libs/features/dashboard/src/lib/filter-dashboard/filter-dashboard.component";
import { DropdownModule } from "primeng/dropdown";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextComponent } from "../input-text/input-text.component";
import { SwitchUiComponent } from "../switch-ui/switch-ui.component";
import { ButtonModule } from "primeng/button";
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { EmptyStateComponent } from "../empty-state/empty-state.component";
import { TranslateModule } from '@ngx-translate/core';
import { ThemeCustomService } from '../../services/theme.service';
import * as echarts from 'echarts';
import { Subscription } from 'rxjs';
import { EmptyStateDashbourdComponent } from '../empty-state-dashbourd/empty-state-dashbourd.component';
import { LoaderComponent } from '../loader/loader.component';


type EChartsOption = echarts.EChartsOption;

@Component({
  selector: 'lib-dounghnut-chart',
  imports: [CommonModule, TranslateModule,LoaderComponent ,TableModule, FormsModule, DialogModule, EmptyStateDashbourdComponent,FilterDashboardComponent, DropdownModule, InputTextComponent, ReactiveFormsModule, SwitchUiComponent, ButtonModule, EmptyStateComponent],
  templateUrl: './dounghnut-chart.component.html',
  styleUrl: './dounghnut-chart.component.scss',
})
export class DounghnutChartComponent implements OnInit, OnChanges, AfterViewInit , OnDestroy {


  @ViewChild('EchartD', { static: false }) EchartD!: ElementRef;
  myChart!: echarts.ECharts;
  chartOptions: EChartsOption = {};


  ngOnDestroy(): void {
    this.labelSub$?.unsubscribe();
  }


  initEChartDounght() {
    const chartDom = this.EchartD?.nativeElement;
    this.myChart = echarts.init(chartDom);
    this.chartOptions = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 0,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            {
              value: 0,
              itemStyle: {
                color: '#f0f0f0'
              },
              name: 'No Data'
            }
          ]
        }
      ]
    };
    this.myChart.setOption(this.chartOptions);

  }



  setting_visible: boolean = false

  mode = input<string>();

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




  setting_form!: FormGroup;

  labelSub$!:Subscription;
  initSettingForm(data?: any) {
    console.log("data widget", data);

    this.setting_form = new FormGroup({
      title: new FormControl(data ? data?.title : ''),
      titleAr: new FormControl(data ? data?.titleAr : ''),
      show_label: new FormControl(data ? data?.show_label : false),
      show_filter: new FormControl(data ? data?.show_filter : false),
    })


    const valueChanges = this.setting_form.get('show_label')?.valueChanges;
    if (valueChanges) {
      this.labelSub$ = valueChanges.subscribe((res: any) => {
           this.updateLegendVisibility(res);
        setTimeout(() => {
          this.handledResizeChart();
        }, 0);
      });
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chart_config_input'].currentValue) {
      this.selectedWidth = this.chart_config_input()?.data?.width || this.selectedWidth;
      console.log("dounght chart", this.chart_config_input());

      if (this.chart_config_input()?.data?.settingsResource) {
        this.getSettingData()
      }
    }
  }



  getSettingData() {
    this._HttpClient.get(enviroment.DOMAIN_URI + this.chart_config_input()?.data?.settingsResource).subscribe((res: any) => {
      console.log("dounght setting", res);
      this.initSettingForm(res?.data?.settings)
    })
  }




  current_report_id: any
  loading_setting_save: boolean = false
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
        this._MessageService.add({ severity: 'success', summary: 'Success', detail: 'Widget Setting Saved Successfully' })
      }
    })
  }



  selectedWidth: any = this.widthOptions[3].value;
  constructor(private _TranslationsService:TranslationsService,public _ThemeCustomService: ThemeCustomService, private _ActivatedRoute: ActivatedRoute, private _MessageService: MessageService, private dashboardLayoutService: DashboardLayoutService, private _HttpClient: HttpClient) {
    this.dashboardLayoutService.filter_visible$.subscribe(visible => {
      this.filter_visible = visible;
    });



    this._ActivatedRoute.parent?.paramMap.subscribe((params) => {
      console.log("params:", params.get('id'));
      this.current_report_id = params.get('id')
    })
  }
  ngOnInit(): void {

    this.initSettingForm();
    this.currentLanguage = this._TranslationsService.getSelectedLanguage();
  }


  currentLanguage!: string


  ngAfterViewInit(): void {
    this.initEChartDounght()
  }



  filter_visible: boolean = false;
  show_filter: boolean = false;

  chart_config_input = input.required<any>();



  labels: any[] = [
  ]


  handledResizeChart() {
    setTimeout(() => {
      this.myChart.resize();
    }, 0);
  }


  actionEmitter = output<any>();


updateLegendVisibility(show: boolean) {
  if (!this.myChart) return;

  this.myChart.setOption({
    legend: {
      show: !show
    }
  });
}

  current_widget_applied_filters: any[] = []

  loading: boolean = true
  dataSet: any[] = []
  handleDataFilter(event: any) {
    this.labels = []
    this.loading = true;
    this.current_widget_applied_filters = event
    this._HttpClient.post(enviroment.DOMAIN_URI + this.chart_config_input()?.data?.dataResource, { filters: event }).subscribe((res: any) => {
      const apiLabels = res?.data?.labels || [];
      const apiData = res?.data?.datasets?.[0]?.data || [];
      this.dataSet = apiData;
      const apiColors = res?.data?.datasets?.[0]?.backgroundColor || [];
      const apiIds = res?.data?.datasets?.[0]?.ids || [];
      if (res?.data?.labels?.length > 0) {
        const chartData = res?.data?.labels.map((label: string, idx: number) => ({
          value: apiData[idx] ?? 0,
          name: label,
          itemStyle: {
            color: this._ThemeCustomService.colorFactor(apiColors[idx]) ,
              opacity: 1,
          }
        }));

        this.myChart.setOption({
          series: [{
            name: '',
            data: chartData
          }]
        },{ notMerge: false   } );

        this.handledResizeChart();
      }
      else {
        //
      }



      const total = apiData.reduce((sum: number, val: number) => sum + val, 0);

      this.labels = apiLabels.map((label: string, idx: number) => ({
        id: apiIds[idx] ?? idx + 1,
        label: label,
        value: apiData[idx] ?? 0,
        per: total ? ((apiData[idx] / total) * 100).toFixed(2) + '%' : '0%',
        color: apiColors[idx] ?? '#09c'
      }));
      this.loading = false;

    })
  }



}
