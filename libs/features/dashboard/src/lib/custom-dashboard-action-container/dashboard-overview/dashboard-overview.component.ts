import { Breadcrumb } from './../../../../../../../apps/gfw-portal/src/app/core/models/breadcrumb.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DashboardLayoutService } from '../../../services/dashboard-layout.service';
import { Subscription, switchMap } from 'rxjs';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import {
  OverviewEntry,
  SharedOverviewComponent,
} from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';
@Component({
  selector: 'lib-dashboard-overview',
  imports: [
    CommonModule,
    TranslateModule,
    SkeletonModule,
    SharedOverviewComponent,
  ],
  templateUrl: './dashboard-overview.component.html',
  styleUrl: './dashboard-overview.component.scss',
})
export class DashboardOverviewComponent implements OnInit, OnDestroy {
  // Declaration Variables
  data_dashboard: any;
  reportName: any;
  loadingData = false;

  // Holds all subscriptions to unsubscribe safely
  private subscription = new Subscription();

  // Overview entries configuration
  entries: OverviewEntry[] = [
    { key: 'name', label: 'LOOKUP.NAME', type: 'text' },
    { key: 'nameAr', label: 'PERMISSIONS.NameArabic', type: 'text' },
    {
      key: 'description',
      label: 'RISK_ACTION.DESCRIPTION',
      type: 'description',
    },
    {
      key: 'descriptionAr',
      label: 'MAIN_INFO.DescriptionArabic',
      type: 'description',
    },
  ];

  constructor(
    private _DashboardLayoutService: DashboardLayoutService,
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService
  ) {}

  // getData and Breadcrumb
  getData() {
    this.loadingData = true;
    // Subscribe to parent route param and load dashboard info
    const sub = this._ActivatedRoute.parent?.paramMap
      .pipe(
        switchMap((params) =>
          this._DashboardLayoutService.getDashboardInfoById(params.get('id'))
        )
      )
      .subscribe((res: any) => {
        this.data_dashboard = res?.data;
        this.reportName = this.data_dashboard?.name;
        this.loadingData = false;

        // Update breadcrumb links
        this._LayoutService.breadCrumbLinks.next([
          {
            name: '',
            icon: 'fi fi-rs-home',
            routerLink: '/',
          },
          {
            name: this._TranslateService.instant(
              'Dashboard.BREADCRUMB.SETTING'
            ),
            icon: '',
            routerLink:
              '/gfw-portal/setting/dashboard-builder/dashboard-list',
          },
          {
            name: this._TranslateService.instant(
              'Dashboard.BREADCRUMB.BUILD_BUILDER'
            ),
            icon: '',
            routerLink:
              '/gfw-portal/setting/dashboard-builder/dashboard-list',
          },
          {
            name: this._TranslateService.instant('Dashboard.BREADCRUMB.LIST'),
            icon: '',
            routerLink: '/gfw-portal/setting/dashboard-builder/dashboard-list',
          },
          {
            name: this.reportName,
            icon: '',
            routerLink:`/gfw-portal/setting/dashboard-builder/dashboard/${this.data_dashboard?.reportDefinitionID}/overview`
          },
        ]);
      });

    // Add subscription to the main subscription container
    if (sub) {
      this.subscription.add(sub);
    }
  }

  // Life Cycle Hooks
  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subscription.unsubscribe();
  }
}
