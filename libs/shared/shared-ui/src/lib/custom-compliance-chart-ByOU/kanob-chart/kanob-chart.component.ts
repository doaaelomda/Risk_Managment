import { Component, effect, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KnobModule } from "primeng/knob";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-kanob-chart',
  standalone: true,
  imports: [CommonModule, KnobModule, FormsModule],
  templateUrl: './kanob-chart.component.html',
  styleUrl: './kanob-chart.component.scss',
})
export class KanobChartComponent {

  current_org = input<any>();

  labels: any[] = [];
  value: number = 0;
  groupName: string = '';

  constructor() {
    effect(() => {
      const org = this.current_org();
      if (!org) return;

      this.groupName = org.groupName || '';

      // knob value
      this.value = org.complianceScore || 0;

      // labels
      this.labels = (org.status || []).map((s: any) => ({
        label: s.name,
        value: s.count,
        color: s.color || '#7A5AF8'
      }));
    });
  }
}
