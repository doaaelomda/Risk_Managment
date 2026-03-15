import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Input,
  output,
  input,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DashboardLayoutService } from 'libs/features/dashboard/src/services/dashboard-layout.service';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { FilterDashboardComponent } from 'libs/features/dashboard/src/lib/filter-dashboard/filter-dashboard.component';
import { ThemeCustomService } from '../../services/theme.service';
import { Button } from "primeng/button";
import { InputTextComponent } from "../input-text/input-text.component";

@Component({
  selector: 'lib-chart-kri',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    TranslateModule,
    DialogModule,
    FilterDashboardComponent,
    Button,
    InputTextComponent,
    ReactiveFormsModule
],
  templateUrl: './chart-kri.component.html',
  styleUrl: './chart-kri.component.scss',
})
export class ChartKRIComponent implements AfterViewInit, OnDestroy {
  constructor(
    private httpClient: HttpClient,
    private dashboardLayoutService: DashboardLayoutService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private themeCustomService: ThemeCustomService
  ) {
    this.initForm()
    this.dashboardLayoutService.filter_visible$.subscribe((res) => {
      this.filter_visible = res;
    });
    const id = this.route.snapshot.parent?.paramMap.get('id');
    if (!id) return;
    this.dashboardId = +id;
  }
  filter_visible: boolean = false;
  dashboardId: any;
  actionEmitter = output<any>();
  mode = input<string>();
  chart_config_input = input.required<any>();
  @ViewChild('kriChart', { static: true })
  chartRef!: ElementRef;

  kris: { name: string; value: number }[] = [
    { name: 'Fraud', value: 6230 },
    { name: 'Complaints', value: 3500 },
    { name: 'Incidents', value: 1200 },
  ];

  thresholds: any = {
    low: 2000,
    medium: 4000,
    high: 6000,
  };

  private chartInstance!: echarts.ECharts;

  ngAfterViewInit(): void {
    this.initChart();
  }

  ngOnDestroy(): void {
    this.chartInstance?.dispose();
  }

  private initChart() {
    this.chartInstance = echarts.init(this.chartRef.nativeElement);
    this.renderChart();
    window.addEventListener('resize', () => {
      this.chartInstance.resize();
    });
  }

  private getGradient(value: number) {
    let top = '';
    let bottom = '';

    if (value >= this.thresholds.high) {
      top = '#FCA5A5';
      bottom = '#DC2626';
    } else if (value >= this.thresholds.medium) {
      top = '#FDE68A';
      bottom = '#CA8A04';
    } else {
      top = '#86EFAC';
      bottom = '#16A34A';
    }

    return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: top },
      { offset: 1, color: bottom },
    ]);
  }

  private renderChart() {
    const labels = this.kris.map((k) => k.name);
    const values = this.kris.map((k) => k.value);

    const option: echarts.EChartsOption = {
      grid: {
        left: '8%',
        right: '15%',
        top: '10%',
        bottom: '12%',
        containLabel: true,
      },

      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const val = params.value;
          let level = 'Low';

          if (val >= this.thresholds.high) level = 'High';
          else if (val >= this.thresholds.medium) level = 'Medium';

          return `${params.name}<br/>${val}<br/>${level}`;
        },
      },

      xAxis: {
        type: 'category',
        data: labels,
      },

      yAxis: {
        type: 'value',
        max: this.thresholds.max,
      },

      series: [
        {
          type: 'bar',
          data: values.map((v) => ({
            value: v,
            itemStyle: {
              color: this.getGradient(v),
              borderRadius: [12, 12, 0, 0],
            },
          })),
          barWidth: 50,
          markLine: {
            symbol: 'none',
            lineStyle: {
              type: 'dashed',
              width: 2,
            },
            label: {
              show: true,
              position: 'end',
              formatter: (params: any) => {
                if (params.value === this.thresholds.high) return 'High';
                if (params.value === this.thresholds.medium) return 'Medium';
                if (params.value === this.thresholds.low) return 'Low';
                return '';
              },
            },
            data: [
              {
                yAxis: this.thresholds.low,
                lineStyle: { color: '#16A34A' },
              },
              {
                yAxis: this.thresholds.medium,
                lineStyle: { color: '#CA8A04' },
              },
              {
                yAxis: this.thresholds.high,
                lineStyle: { color: '#DC2626' },
              },
            ],
          },
        },
      ],
    };

    this.chartInstance.setOption(option);
  }

  private buildLevelLabel(text: string, value: number, color: string) {
    return {
      type: 'text',
      right: 10,
      top: `${(1 - value / this.thresholds.max) * 100}%`,
      style: {
        text,
        fill: color,
        font: '14px sans-serif',
      },
    };
  }
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
  }
  private readonly DEFAULT_COLORS = [
    '#6E39CB',
    '#09c',
    '#027A48',
    '#F59E42',
    '#F43F5E',
    '#0EA5E9',
    '#FACC15',
  ];
  current_chart_data: any;
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
  setting_visible: boolean = false;
  loadingSave: boolean = false;
  setting_form!: FormGroup;
  initForm(formData?: any) {
    this.setting_form = new FormGroup({
      title: new FormControl(formData?.title ?? null),
      titleAr: new FormControl(formData?.titleAr ?? null),
      // content: new FormControl(formData?.content ?? null),
    });
  }

  saveSettings() {
    this.loadingSave = true;
    const payload = {
      reportDefinitionId: 0,
      reportPartId: this.data.id,
      configJson: {
        ...this.setting_form.value,
      },
    };

    this.dashboardLayoutService
      .updateWidgetSetting(payload)
      .pipe(finalize(() => (this.loadingSave = false)))
      .subscribe({
        next: (res) => {
          this.setting_visible = false;
          // this.getitemSettings(this?.data?.settingsResource);
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
  data: any;
  handleDataFilter(event: any) {
    // if (!this.currentAssessment) return;
    this.current_widget_applied_filters = event;
    this.httpClient.post(
      `${enviroment.DOMAIN_URI}${this.data?.dataResource}/`,
      {}
    );
  }
}
