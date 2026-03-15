import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ChartBarComponent } from "@gfw/shared-ui";
@Component({
  selector: 'lib-risk-matrix',
  imports: [CommonModule, ChartBarComponent],
  templateUrl: './risk-matrix.component.html',
  styleUrl: './risk-matrix.component.scss',
})
export class RiskMatrixComponent {
  constructor(private layoutService: LayoutService) {
    this.layoutService.breadCrumbTitle.next('Risk Matrix');
    this.layoutService.breadCrumbAction.next(null)
       this.layoutService.breadCrumbLinks.next([
      {
        name:'',
        icon:'fi fi-rs-home',
        routerLink:'/'
      },
      {
        name:'Risk Management',
        icon:'',
        routerLink:''
      },
      {
        name:'Risk Dashboards',
        icon:'',
        routerLink:''
      },
      {
        name:'Risk Matrix',
        icon:'',
        routerLink:''
      }
    ])
  }




  riskDashboardWidgets:any[]=[
    {
      id:1,
      chart_type:'bar',
      title:'Risks by probability',
      end_point:'',
      multi_data:false,
      index_axis:'y',
    },
    {
        id:2,
      chart_type:'bar',
      title:'Risks by probability',
      end_point:'',
      multi_data:false,
      index_axis:'x',
    }
  ]

}
