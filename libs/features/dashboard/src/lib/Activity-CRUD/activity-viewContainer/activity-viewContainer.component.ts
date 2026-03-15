import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  Router,
  RouterOutlet,
} from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { DashboardLayoutService } from '../../../services/dashboard-layout.service';
import { SharedTabsComponent } from "libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component";
@Component({
  selector: 'lib-activity-view-container',
  imports: [
    CommonModule,
    SkeletonModule,
    RouterOutlet,
    TranslateModule,
    SharedTabsComponent
],
  templateUrl: './activity-viewContainer.component.html',
  styleUrl: './activity-viewContainer.component.scss',
})
export class ActivityViewContainerComponent implements OnInit {
  ActivityId: any;
  dateActivity: any;
  loadData: boolean = false;
  tabs: any;
  showTabs: boolean = true;
  generalId: any;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private dashboardLayoutService: DashboardLayoutService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private router: Router
  ) {
    this._ActivatedRoute.paramMap.subscribe((res: any) => {
      this.ActivityId = res.get('ActivityId');
      this.generalId = res.get('generalId');
      this.loadData = true;
      if (this.ActivityId) {
        this.dashboardLayoutService
          .getActivityById(this.ActivityId)
          .subscribe((res: any) => {
            this.dateActivity = res?.data;
            this.loadData = false;
            this._LayoutService.breadCrumbLinks.next([
              {
                name: '',
                icon: 'fi fi-rs-home',
                routerLink: '/',
              },
              {
                name: this._TranslateService.instant('ACTIVITY.LIST_TITLE'),
                icon: '',
                routerLink: `/gfw-portal/third-party/view/${this.generalId}/Activity`,
              },

              {
                name: this.dateActivity?.name || '-',
                icon: '',
              },
            ]);
          });
      }
    });
  }
  ngOnInit(): void {
    this.tabs = [
      {
        id: 1,
        name: this._TranslateService.instant('TABS.OVERVIEW'),
        icon: 'fi-rr-apps',
        router: 'overview',
      },
      {
        id: 2,
        name: this._TranslateService.instant('TABS.COMMENTS'),
        icon: 'fi fi-rr-comment',
        router: 'comments',
      },
      {
        id: 3,
        name: this._TranslateService.instant('TABS.ATTACHMENTS'),
        icon: 'fi fi-rr-paperclip',
        router: 'attachments',
      },
    ];
  }
}
