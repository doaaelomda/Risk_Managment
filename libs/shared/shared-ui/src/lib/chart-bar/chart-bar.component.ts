/* eslint-disable @nx/enforce-module-boundaries */
import {  Component, ElementRef, input, OnChanges, OnInit, output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from "primeng/dropdown";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DashboardLayoutService } from 'libs/features/dashboard/src/services/dashboard-layout.service';
import { TranslationsService } from 'apps/gfw-portal/src/app/core/services/translate.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { FilterDashboardComponent } from "libs/features/dashboard/src/lib/filter-dashboard/filter-dashboard.component";
import { DialogModule } from "primeng/dialog";
import { InputTextComponent } from "../input-text/input-text.component";
import { ButtonModule } from "primeng/button";
import { UiDropdownComponent } from "../ui-dropdown/ui-dropdown.component";
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ThemeCustomService } from '../../services/theme.service';
import * as echarts from 'echarts';
import { SkeletonModule } from 'primeng/skeleton';
import { EmptyStateDashbourdComponent } from '../empty-state-dashbourd/empty-state-dashbourd.component';
import { SwitchUiComponent } from "../switch-ui/switch-ui.component";

type EChartsOption = echarts.EChartsOption;
@Component({
  selector: 'lib-chart-bar',
  imports: [CommonModule, SkeletonModule, TranslateModule, DropdownModule, EmptyStateDashbourdComponent, FormsModule, FilterDashboardComponent, DialogModule, ReactiveFormsModule, InputTextComponent, ButtonModule, UiDropdownComponent, SwitchUiComponent],
  templateUrl: './chart-bar.component.html',
  styleUrl: './chart-bar.component.scss',
})
export class ChartBarComponent implements OnChanges, OnInit {

  constructor(private _TranslationsService:TranslationsService,private _ThemeCustomService: ThemeCustomService, private _MessageService: MessageService, private _ActivatedRoute: ActivatedRoute, private _HttpClient: HttpClient, private _ChangeDetectorRef: ChangeDetectorRef, private dashboardLayoutService: DashboardLayoutService) {
    this.dashboardLayoutService.filter_visible$.subscribe((res) => {
      this.filter_visible = res;
    })



    this._ActivatedRoute.parent?.paramMap.subscribe((params) => {
      this.current_report_id = params.get('id')
    })
  }


  current_report_id: any
  loadSaveSetting: boolean = false
  handleSaveSetting() {
    this.loadSaveSetting = true
    const req = {
      "reportDefinitionId": this.current_report_id,
      "reportPartId": this.chart_config?.data?.id,
      "configJson": this.setting_form.value
    }
    this.dashboardLayoutService.updateWidgetSetting(req).subscribe({
      next: (res) => {
        //
        this.loadSaveSetting = false
        this.setting_visible = false;
        this.getChartSettingData(this.chart_config?.data?.settingsResource)
        this._MessageService.add({ severity: 'success', summary: 'Success', detail: 'Widget Setting Saved Successfully' })

      }
    })
  }

  ngOnInit(): void {

    this.initSettingForm()
    this.current_language = this._TranslationsService.getSelectedLanguage();
  }


  handleResizeWidget(){
    if(this.setting_form.get('direction')?.value === 'x'){
      setTimeout(() => {
        this.myChart.resize();
      }, 0);
    }else{
         setTimeout(() => {
           this.myChartVerticale.resize();
      }, 0);
    }
  }


  current_language: string = ''


  setting_visible: boolean = false

  setting_form!: FormGroup;

  mode = input<string>();

  filter_visible: boolean = false;

  // chart Code

  @ViewChild('EchartBarHorizontal', { static: false }) EchartBarHorizontal!: ElementRef;
  @ViewChild('EchartBarVertical', { static: false }) EchartBarVertical!: ElementRef;
  myChart!: echarts.ECharts;
  myChartVerticale!: echarts.ECharts;
  chartOptions: EChartsOption = {};
  chartOptionsVerticale: EChartsOption = {};


  initBartChartHorizontal(labels: string[], data: number[], colors: string[], chartName: string) {
    const chartDom = this.EchartBarHorizontal?.nativeElement;
    this.myChart = echarts.init(chartDom);

    const seriesData = data.map((value, idx) => ({
      value,
      itemStyle: { color: colors[idx] ?? '#0099cc' }
    }));

    this.chartOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'none' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      yAxis: {
        type: 'value'
      },
      xAxis: {
        type: 'category',
        data: labels
      },
      series: [
        {
          name: chartName, type: 'bar', barWidth: '40px', data: seriesData, itemStyle: { borderRadius: [ 10,10 , 0 ,0 ], borderColor: '#fff', borderWidth: 2, }
        }
      ]
    };

    this.myChart.setOption(this.chartOptions);
  }
  initBartChartVerticale(labels: string[], data: number[], colors: string[], chartName: string) {
    const chartDom = this.EchartBarVertical?.nativeElement;
    this.myChartVerticale = echarts.init(chartDom);

    const seriesData = data.map((value, idx) => ({
      value,
      itemStyle: { color: colors[idx] ?? '#0099cc' }
    }));

    this.chartOptionsVerticale = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'none' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      yAxis: {
           type: 'category',
        data: labels

      },
      xAxis: {
     type: 'value'
      },
      series: [
        {
          name: chartName, type: 'bar', barWidth: '40px', data: seriesData, itemStyle: { borderRadius: [0 , 10 , 10 ,0], borderColor: '#fff', borderWidth: 2, }
        }
      ]
    };

    this.myChartVerticale.setOption(this.chartOptionsVerticale);
  }



  loading_Data:boolean = true


  // end chart code
  actionEmitter = output<any>();

  chart_config_input = input.required<any>();

  chart_config: any

  show_filter: boolean = false

  chartWidth: number = 100;
  ngOnChanges(changes: SimpleChanges): void {


    if (changes['chart_config_input']) {
      this.chart_config = changes['chart_config_input']?.currentValue;
      this.selectedWidth = this.chart_config_input()?.data?.width || this.selectedWidth;







      if (this.chart_config?.data?.settingsResource) {
        this.getChartSettingData(this.chart_config?.data?.settingsResource)
      }




    }


  }

  getChartSettingData(endpoint: any) {
    // start handle call API
    this._HttpClient.get(enviroment.DOMAIN_URI + endpoint).subscribe((res: any) => {
      this.setting_data = res?.data?.settings;
      this.initSettingForm(this.setting_data);
      this.getChartViewData(this.chart_config_input()?.data?.dataResource)
    })

  }

  // [
  //     {
  //       label: 'Active Accounts',
  //       backgroundColor: ['#6E39CB', '#09c', '#027A48', '#F59E42', '#F43F5E', '#0EA5E9', '#FACC15'],
  //       data: [100, 150, 60, 200, 37, 65, 34],
  //       borderRadius: 5,
  //       barThickness: 35
  //     },
  //   ]

  private readonly DEFAULT_COLORS = ['#6E39CB', '#09c', '#027A48', '#F59E42', '#F43F5E', '#0EA5E9', '#FACC15'];
  dataSet: any[] = [];
  getChartViewData(endpoint: any) {
    this._HttpClient.post(enviroment.DOMAIN_URI + endpoint, { filters: [] }).subscribe((res: any) => {

      const resLabels = res?.data?.labels ?? [];
      const dataset = res?.data?.datasets?.[0] ?? {};
      const resData = dataset.data ?? [];
       this.dataSet = resData;
      const resColors = dataset.backgroundColor.map((color: string) => { return this._ThemeCustomService.colorFactor(color)  }) || this.DEFAULT_COLORS;
      const chartName = '';
      this.current_chart_data = {
        labels: resLabels,
        data: resData,
        colors: resColors,
        chartName: chartName
      }
      if (this.setting_form.get('direction')?.value === 'x') {
        this.initBartChartHorizontal(resLabels, resData, resColors, chartName);
        setTimeout(() => {
          this.myChart.resize();
        }, 0);
      } else {
        this.initBartChartVerticale(resLabels, resData, resColors, chartName);
             setTimeout(() => {
               this.myChartVerticale.resize();
        }, 0);
      }

      this.loading_Data = false;

    })
  }


  current_chart_data:any;

  setting_data: any;


  initSettingForm(data?: any) {
    console.log("data widget", data);

    this.setting_form = new FormGroup({
      title: new FormControl(data ? data?.title : ''),
      titleAr: new FormControl(data ? data?.titleAr : ''),
      direction: new FormControl(data ? data?.direction ?? 'x' : 'x'),
      show_filter: new FormControl(data ? data?.show_filter ?? false : false),
    })


    this.setting_form.get('direction')?.valueChanges.subscribe((res) => {
      if(res === 'x'){
        this.initBartChartHorizontal(this.current_chart_data.labels, this.current_chart_data.data, this.current_chart_data.colors, this.current_chart_data.chartName);
                setTimeout(() => {
          this.myChart.resize();
        }, 0);
      }else{
        this.initBartChartVerticale(this.current_chart_data.labels, this.current_chart_data.data, this.current_chart_data.colors, this.current_chart_data.chartName);
               setTimeout(() => {
               this.myChartVerticale.resize();
        }, 0);
      }
    });




  }

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


  dirs: any[] = [
    {
      label: 'Horizontal',
      value: 'x'
    },
    {
      label: 'Vertical',
      value: 'y'
    }
  ]


  selectedWidth: any = this.widthOptions[3].value;






  current_widget_applied_filters: any[] = []


  handleDataFilter(event: any) {
    this.current_widget_applied_filters = event;
    this._HttpClient.post(enviroment.DOMAIN_URI + this.chart_config?.data?.dataResource, { filters: event }).subscribe((res: any) => {
      const resLabels = res?.data?.labels ?? [];
      const resDatasets = Array.isArray(res?.data?.datasets) ? res.data.datasets : [];

    })
  }
}
