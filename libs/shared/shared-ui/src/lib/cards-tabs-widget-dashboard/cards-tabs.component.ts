// eslint-disable-next-line @nx/enforce-module-boundaries
import { DashboardLayoutService } from './../../../../../features/dashboard/src/services/dashboard-layout.service';
import { Component, input, OnChanges, OnInit, output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardDashboardComponent } from "../card-dashboard/card-dashboard.component";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule } from '@angular/forms';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { FilterDashboardComponent } from "libs/features/dashboard/src/lib/filter-dashboard/filter-dashboard.component";
import { DialogModule } from "primeng/dialog";
@Component({
  selector: 'lib-cards-tabs',
  imports: [CommonModule, CardDashboardComponent, FormsModule, DropdownModule, FilterDashboardComponent, DialogModule],
  templateUrl: './cards-tabs.component.html',
  styleUrl: './cards-tabs.component.scss',
})
export class CardsTabsComponent implements OnInit , OnChanges{

  constructor(private dashboardLayoutService: DashboardLayoutService) {
  }
  ngOnInit(): void {
    this.dashboardLayoutService.filter_visible$.subscribe(res => {
      this.filter_visible = res;
    })
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chart_config_input']) {
      this.selectedWidth = this.chart_config_input()?.data?.width || this.selectedWidth;
    }
  }


  mode = input<string>();


  filter_visible: boolean = false;

  data_tabs = [
    {
      id:1,
      name:"Incident Actions",
      cards:[
        {
          id:1,
          title:"Not Started",
          value:53,
          color:'gray'
        },
        {
          id:2,
          title:"In Progress",
          value:300,
          color:'orange'
        },
        {
          id:4,
          title:"ApproachingDue  Date",
          value:300,
          color:'orange'
        },
        {
          id:5,
          title:"Completed",
          value:400,
          color:'green'
        },
        {
          id:6,
          title:"Completed Overdue",
          value:600,
          color:"red"
        },
        {
          id:5,
          title:"Completed Overdue",
          value:400,
          color:"red"
        },
      ]
    },
    {
      id:2,
      name:"KPI Tasks",
      cards:[
        {
          id:1,
          title:"test 1",
          value:30,
          color:'gray'
        },
        {
          id:2,
          title:"test 2",
          value:450,
          color:'orange'
        },
        {
          id:4,
          title:"ApproachingDue  Date",
          value:200,
          color:'orange'
        },
        {
          id:5,
          title:"Completed",
          value:400,
          color:'green'
        },
        {
          id:6,
          title:"Completed Overdue",
          value:600,
          color:"red"
        },
        {
          id:5,
          title:"Completed Overdue",
          value:400,
          color:"red"
        },
      ]
    },
  ]


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

   chart_config_input = input.required<any>();

  actionEmitter = output<any>();

  current_active_tab  = this.data_tabs[0]
}
