import { Component, input, OnChanges, output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from "primeng/dropdown";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DashboardLayoutService } from 'libs/features/dashboard/src/services/dashboard-layout.service';
import { FormsModule } from '@angular/forms';
import { DialogModule } from "primeng/dialog";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { FilterDashboardComponent } from "libs/features/dashboard/src/lib/filter-dashboard/filter-dashboard.component";

@Component({
  selector: 'lib-list-dashboard',
  imports: [CommonModule, DropdownModule, FormsModule, DialogModule, FilterDashboardComponent],
  templateUrl: './list-dashboard.component.html',
  styleUrl: './list-dashboard.component.scss',
})
export class ListDashboardComponent implements OnChanges {

    mode = input<string>();



  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chart_config_input']) {
      this.selectedWidth = this.chart_config_input()?.data?.width || this.selectedWidth;
    }
  }


chart_config_input = input.required<any>()
show_filter:boolean=false;
actionEmitter = output<any>()

 constructor(dashboardLayoutService: DashboardLayoutService) {
    dashboardLayoutService.filter_visible$.subscribe(res => {
      this.filter_visible = res;
    })
  }
  filter_visible:boolean =false

    widthOptions:any[]=[
    {
      id:1,
      value:.5,
    },
    {
            id:2,
      value:.75,
    },
    {
            id:3,
      value:1,
    },
    {
            id:4,
      value:1.5,
    },

  ]


    selectedWidth:any= this.widthOptions[3].value;

}
