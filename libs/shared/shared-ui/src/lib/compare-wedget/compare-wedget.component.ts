import { Component, input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
@Component({
  selector: 'lib-compare-wedget',
  imports: [CommonModule, ChartModule],
  templateUrl: './compare-wedget.component.html',
  styleUrl: './compare-wedget.component.scss',
})
export class CompareWedgetComponent implements OnChanges {
  title_input = input.required<string>();

  data_input = input.required<any>()

  current_title: string = ''

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['title_input'].currentValue) {
      this.current_title = changes['title_input'].currentValue
    }
  }

  dataRevChart = {
    labels: ['previous', 'current'],
    datasets: [
      {
        label: 'Revenue Data',
        data: [1500, 3500],
        fill: true,
        borderColor: '#12B76A',
        tension: 0.4,
        backgroundColor: '#ECFDF3'
      }
    ]
  };

  options = {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: {
        },
        grid: {
          color: '#1CAAB7'
        },
        display: false
      },
      y: {
        ticks: {
        },
        grid: {
        },
        display: false
      }
    }
  };



}
