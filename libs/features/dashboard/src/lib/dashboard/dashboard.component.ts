import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardBuilderComponent } from "../dashboard-builder/dashboard-builder.component";
import { ActivatedRoute } from '@angular/router';
import { DashboardLayoutService } from '../../services/dashboard-layout.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { switchMap } from 'rxjs';
@Component({
  selector: 'lib-dashboard',
  imports: [CommonModule, TranslateModule, DashboardBuilderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {

  constructor(private _LayoutService: LayoutService, private _DashboardLayoutService: DashboardLayoutService, private _ActivatedRoute: ActivatedRoute) {
    this._LayoutService.breadCrumbLinks.next(this.breadCrumb)
  }


  breadCrumb=[
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/'
      },
      {
        name: 'Dahboards',
        icon: '',
        routerLink: '/'
      },
      {
        name: '-',
        icon: '',
        routerLink: '/'
      }
    ]

  dashboard_config: any;

  ngOnInit(): void {
    const currentId:any = this._ActivatedRoute.snapshot.data
    console.log("currentId" , currentId);

    this._DashboardLayoutService.getDashboardLayoutConfig(currentId?.id).subscribe((res: any) => {
      this.breadCrumb[this.breadCrumb.length -1].name = res?.data?.dashboard_Title
        this.dashboard_config = res?.data;
        if(res?.data?.dashboard_Title == "Indicator Dashboard"){
          this.dashboard_config?.dashboard_Widgets?.push(
             {
                "id": 10007,
                "type": "kri",
                "width": 1.5,
                "name": "Bar chart",
                "description": "Bar chart for incidents by Source",
                "dataViewID": 114,
                "settingsResource": "api/Dashboard/reportparts/107/settings",
                "dataResource": "api/Incident/Reports/IncidentsBySource"
            }
          )
        }
    })
  }

}
