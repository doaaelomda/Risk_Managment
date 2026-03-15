import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { DashboardLayoutService } from '../../services/dashboard-layout.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SharedTabsComponent } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-custom-dashboard-action-container',
  imports: [
    CommonModule,
    TranslateModule,
    RouterOutlet,
    SkeletonModule,
    SharedTabsComponent,
  ],
  templateUrl: './custom-dashboard-action-container.component.html',
  styleUrl: './custom-dashboard-action-container.component.scss',
})
export class CustomDashboardActionContainerComponent
  implements OnInit, OnDestroy
{
  // Declaration Variables
  tabs: any[] = [];
  data_dashboard: any;
  isLoading: boolean = true;
  private subscription: Subscription = new Subscription();
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _DashboardLayoutService: DashboardLayoutService,
    private _PermissionSystemService:PermissionSystemService
  ) {}
  // handle Tabs
  handleTabs() {
    this.tabs = [
      {
        id: 2,
        name: 'Dashboard.TABS.DESIGN',
        icon: 'fi fi-rr-shield-check',
        router: 'desgine',
        visible: ()=> this._PermissionSystemService.can('DASHBOURD', 'DESIGN', 'VIEW')
      },
      {
        id: 3,
        name: 'Dashboard.TABS.PREVIEW',
        icon: 'fi fi-rr-tools',
        router: 'preview',
        visible: ()=> this._PermissionSystemService.can('DASHBOURD', 'PREVIEW', 'VIEW')
      },
    ];
  }
  // get Data IN DashBoard
  getData() {
    const sub = this._ActivatedRoute?.paramMap
      .pipe(
        switchMap((res) =>
          this._DashboardLayoutService.getDashboardInfoById(res.get('id'))
        )
      )
      .subscribe((res: any) => {
        this.data_dashboard = res?.data;
        this.isLoading = false;
      });
    this.subscription.add(sub);
  }
  // Life Cycle Hooks
  ngOnInit(): void {
    this.handleTabs();
    this.getData();
  }
  // Destroy Component
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
