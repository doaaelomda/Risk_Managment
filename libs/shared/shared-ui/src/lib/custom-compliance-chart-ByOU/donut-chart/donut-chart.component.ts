import { AfterViewInit, Component, effect, ElementRef, input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeCustomService } from '../../../services/theme.service';
import * as echarts from 'echarts';
import { SkeletonModule } from "primeng/skeleton";


type EChartsOption = echarts.EChartsOption;

@Component({
  selector: 'lib-donut-chart',
  imports: [CommonModule, SkeletonModule],
  templateUrl: './donut-chart.component.html',
  styleUrl: './donut-chart.component.scss',
})
export class DonutChartComponent implements AfterViewInit {

  @ViewChild('EchartD', { static: false }) EchartD!: ElementRef;
  myChart!: echarts.ECharts;
  chartOptions: EChartsOption = {};

  constructor(public _ThemeCustomService: ThemeCustomService) {

    effect(()=>{
        setTimeout(()=>{
    this.handleChartData()

  })
    })
  }

  current_org = input<any>()

  labels: any[] = [];


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



  ngAfterViewInit(): void {
    this.initEChartDounght();

      window.addEventListener('resize', () => {
    this.myChart.resize();
  });





  }

  loading_widget_data:boolean = false;

handleChartData() {
  this.loading_widget_data = true;
  const org = this.current_org();
  console.log("Data From Function" , org );

  if (!org || !this.myChart) return;

    console.log("Data From Function after if" , org );
  const status = org.status || [];

  // labels for the UI
  this.labels = status.map((s: any) => ({
    label: s.name,
    value: s.count,
    per: s.percentage + '%',
  color: this._ThemeCustomService.colorFactor(s.color || '#8B5CF6')  }));

  // chart data
  const chartData = status.map((s: any) => ({
    value: s.count,
    name: s.name,
    itemStyle: {
      color: this._ThemeCustomService.colorFactor(s.color || '#3B82F6')
    }
  }));

  // fallback if no data
  if (!chartData.length) {
    chartData.push({
      value: 1,
      name: 'No Data',
      itemStyle: { color: '#f0f0f0' }
    });
  }

  this.myChart?.setOption({
    series: [
      {
        data: chartData
      }
    ]
  });

    this.loading_widget_data = false;

}
}
