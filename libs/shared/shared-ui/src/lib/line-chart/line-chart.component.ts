/* eslint-disable @nx/enforce-module-boundaries */
import { TranslationsService } from './../../../../../../apps/gfw-portal/src/app/core/services/translate.service';
import { Component, input, OnChanges, OnInit, output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from "primeng/dropdown";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DashboardLayoutService } from 'libs/features/dashboard/src/services/dashboard-layout.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from "primeng/dialog";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { FilterDashboardComponent } from "libs/features/dashboard/src/lib/filter-dashboard/filter-dashboard.component";
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { InputTextComponent } from "../input-text/input-text.component";
import { SwitchUiComponent } from "../switch-ui/switch-ui.component";
import { ButtonModule } from "primeng/button";
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeCustomService } from '../../services/theme.service';
import { EmptyStateDashbourdComponent } from '../empty-state-dashbourd/empty-state-dashbourd.component';
@Component({
  selector: 'lib-line-chart',
  imports: [CommonModule, EmptyStateDashbourdComponent,TranslateModule,ReactiveFormsModule, ChartModule, FormsModule, DropdownModule, DialogModule, FilterDashboardComponent, InputTextComponent, SwitchUiComponent, ButtonModule],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent implements OnInit, OnChanges {
  mode = input<string>();
  constructor(private _TranslationsService:TranslationsService,public _ThemeCustomService:ThemeCustomService,private _ActivatedRoute: ActivatedRoute, private _MessageService: MessageService, public dashboardLayoutService: DashboardLayoutService, private _HttpClient: HttpClient) {
    this.dashboardLayoutService.filter_visible$.subscribe(visible => {
      this.filter_visible = visible;
    });

    this._ActivatedRoute.parent?.paramMap.subscribe((params) => {
      this.current_report_id = params.get('id')
    })
  }

  ngOnInit(): void {
    this.initSettingForm();
    this.current_lang = this._TranslationsService.getSelectedLanguage()
  }

  current_lang:string = ''

  @ViewChild('chart') chart!: any | null;

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




  selectedWidth: any = this.widthOptions[3].value;

  filter_visible: boolean = false;

  chart_config_input = input.required<any>();

  actionEmitter = output<any>();
  chart_config: any


  show_filter: boolean = false;

  chartWidth: number = 100;
  ngOnChanges(changes: SimpleChanges): void {
    this.chart_config = changes['chart_config_input']?.currentValue;



    if (changes['chart_config_input']) {
      this.selectedWidth = this.chart_config_input()?.data?.width || this.selectedWidth;

      if (this.chart_config_input()?.data?.settingsResource) {
        this.getSettingData()
      }
    }



  }


  setting_visible: boolean = false
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


  setting_form!: FormGroup;


  initSettingForm(data?: any) {
    console.log("data widget", data);

    this.setting_form = new FormGroup({
      title: new FormControl(data ? data?.title : ''),
      titleAr: new FormControl(data ? data?.titleAr : ''),
      show_label: new FormControl(data ? data?.show_label : false),
    })
  }



  getSettingData() {
    this._HttpClient.get(enviroment.DOMAIN_URI + this.chart_config_input()?.data?.settingsResource).subscribe((res: any) => {
      console.log("dounght setting", res);
      this.initSettingForm(res?.data?.settings)
    })
  }



  accountDataBar = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        type: 'line',
        label: 'Total Accounts',
        backgroundColor: '#9B8AFB',
        borderColor: '#314CFF',
        data: [],
        borderRadius: 5,
        barThickness: 35,
        tension: 0.4
      },

    ]
  };

  opptionsAccountBar =
    {
      indexAxis: 'x',
      maintainAspectRatio: false,
      aspectRatio: 1,
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false
        },
        legend: {
          display: false,
          labels: {
            color: '#667085'
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: '#667085'
          },
          grid: {
            color: '#EAECF0',
            drawBorder: false
          },
          barPercentage: 0.3,
          categoryPercentage: 0.3
        },
        y: {
          stacked: false,
          ticks: {
            color: '#667085'
          },
          grid: {
            color: '#EAECF0',
            drawBorder: false
          }
        }
      }
    };


  dataSet: any[] = [];
  isLoader:boolean=true;
  current_widget_applied_filters: any[] = [];
  handleDataFilter(event: any) {
  this.current_widget_applied_filters = event;
  this.isLoader=true;
  this._HttpClient.post(enviroment.DOMAIN_URI + this.chart_config_input()?.data?.dataResource, { filters: event }).subscribe((res: any) => {
    const apiLabels = res?.data?.labels || [];
    const apiDataset = res?.data?.datasets?.[0] || {};
    const apiData = apiDataset.data || [];
    this.dataSet = apiData;
    const apiColors = apiDataset.backgroundColor.map((color:any)=>{
      return this._ThemeCustomService.colorFactor(color)
    })
    const apiIds = apiDataset.ids || [];

    // Each point as its own dataset (line)
    const datasets = apiData.map((value: number, idx: number) => ({
      type: 'line',
      label: `${apiLabels[idx]} (${apiDataset.label})`,
      data: apiLabels.map((_: any, i: number) => (i === idx ? value : 0)),
      backgroundColor: apiColors[idx] ?? '#09c',
      borderColor: apiColors[idx] ?? '#09c',
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 5,
      pointBackgroundColor: apiColors[idx] ?? '#09c',
      spanGaps: true
    }));

    this.accountDataBar = {
      labels: apiLabels,
      datasets
    };

    this.chart?.chart?.update();
    this.isLoader=false;
  });
}
}
