import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardBuilderComponent } from '../../dashboard-builder/dashboard-builder.component';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { DashboardLayoutService } from '../../../services/dashboard-layout.service';
import { ActivatedRoute } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LoaderComponent } from '@gfw/shared-ui';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-preview-dashboard',
  imports: [CommonModule, DashboardBuilderComponent, LoaderComponent,TranslateModule],
  templateUrl: './preview-dashboard.component.html',
  styleUrl: './preview-dashboard.component.scss',
})
export class PreviewDashboardComponent implements OnInit, OnDestroy {
  // declaration variables
  dashboard_config: any;
  current_id: any;
  loading_state: boolean = true;
  sidebar_icons: any[] = [
    'sideBar/building-08.svg',
    'sideBar/file-check-02.svg',
    'sideBar/file-shield-02.svg',
    'sideBar/settings-04.svg',
    'sideBar/settings.svg',
  ];
  // ====== Subscription ======
  private subscription = new Subscription();

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _DashboardLayoutService: DashboardLayoutService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    public _PermissionSystemService:PermissionSystemService
  ) {}

  // ===== Subscribe to parent route to get dashboard id =====

  getData() {
    const sub = this._ActivatedRoute.parent?.paramMap.subscribe((res) => {
      this.current_id = res.get('id');
      this.getDashboardPreview(this.current_id);
    });
    if (sub) {
      this.subscription.add(sub);
    }
  }
  // ===== Preview Report =====
  getDashboardPreview(id: any) {
    const sub = this._DashboardLayoutService
      .getDashboardLayoutConfig(id)
      .subscribe((res: any) => {
        this.dashboard_config = res?.data;
        this.loading_state = false;

        // ===== Update breadcrumb links dynamically =====
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
            name: this.dashboard_config?.dashboard_Title,
            icon: '',
            routerLink:`/gfw-portal/setting/dashboard-builder/dashboard/${this.current_id}/overview`
          },
          {
            name: this._TranslateService.instant('Dashboard.TABS.PREVIEW'),
            icon: '',
          },
        ]);
      });
    if (sub) {
      this.subscription.add(sub);
    }
  }
  // ===== Print Report =====
  async printReport() {
    if(!this._PermissionSystemService.can('DASHBOURD' , 'PREVIEW' , 'PRINT')) return;
    const dashboardElement = document.querySelector(
      '.dashboard_builder'
    ) as HTMLElement;
    if (!dashboardElement) return;
    const canvas = await html2canvas(dashboardElement, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('dashboard.pdf');
  }

  // Life Cycle Hooks
  ngOnInit(): void {
    this.getData();
  }
  // ===== Unsubscribe to avoid memory leaks =====
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
