import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DashboardLayoutService } from 'libs/features/dashboard/src/services/dashboard-layout.service';
import { OverviewEntry, SharedOverviewComponent } from "libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component";

@Component({
  selector: 'lib-activity-view',
  imports: [CommonModule, SkeletonModule, TranslateModule, SharedOverviewComponent],
  templateUrl: './activityView.component.html',
  styleUrl: './activityView.component.scss',
})
export class ActivityViewComponent  {
  breadCrumbLinks: any;
  loadDataActivty: boolean = false;
  tabs: any[] = [];
  ActivityData: any;
  active_tab = 1;
  ActivtyId: any;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private DashboardLayoutService: DashboardLayoutService
  ) {
    this._ActivatedRoute?.parent?.paramMap.subscribe((res) => {
      this.ActivtyId = res.get('ActivityId');
    });
    this.getByIdActivty();
  }
  getByIdActivty() {
    this.loadDataActivty = true;
    this.DashboardLayoutService.getActivityById(
      this.ActivtyId
    ).subscribe((res: any) => {
      this.ActivityData = res?.data;
      this.loadDataActivty = false;
    });
  }


  entries: OverviewEntry[] = [
  { key: 'name', label: 'CONTENT.NAME', type: 'text' },

  { key: 'activityChannelTypeName', label: 'ACTIVITY.CHANNEL', type: 'text' },
  { key: 'activityDirectionTypeName', label: 'ACTIVITY.DIRECTION', type: 'text' },

  { key: 'isCompleted', label: 'Summary.COMPLETED', type: 'boolean' },
  { key: 'activityDate', label: 'ACTIVITY.ACTIVITY_DATE', type: 'date' },
  { key: 'dueDate', label: 'GENERAL_ASSESSMENT.DUE_DATE', type: 'date' },

  { key: 'activityTypeName', label: 'ACTIVITY.TYPE', type: 'text' },
  { key: 'activityStatusTypeName', label: 'GENERAL_ASSESSMENT.STATUS', type: 'text' },

  { key: 'responsibleUserName', label: 'GENERAL_ASSESSMENT.RESPONSIBLE_USER', type: 'user',id:'responsibleUserID' },
  { key: 'responsibleRoleName', label: 'GENERAL_ASSESSMENT.RESPONSIBLE_ROLE', type: 'role',id:'responsibleRoleID' },
    { key: 'description', label: 'ACTIVITY.DESCRIPTION', type: 'description' },
];

}
