import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DashboardBuilderComponent } from '../../dashboard-builder/dashboard-builder.component';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { InputSearchComponent, LoaderComponent } from '@gfw/shared-ui';
import { DashboardLayoutService } from '../../../services/dashboard-layout.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { Subscription } from 'rxjs';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-custom-dashboard-desgine',
  imports: [
    CommonModule,
    ButtonModule,
    DashboardBuilderComponent,
    DialogModule,
    TranslateModule,
    InputSearchComponent,
    LoaderComponent,
    CheckboxModule,
    FormsModule
  ],
  templateUrl: './custom-dashboard-desgine.component.html',
  styleUrl: './custom-dashboard-desgine.component.scss',
})
export class CustomDashboardDesgineComponent implements OnInit, OnDestroy {
  // declaration Variables
  is_slected_dashboard: boolean = false;
  show_add_dailog: boolean = false;
  selected_cat: any;
  selected_widgets: any[] = [];
  loadingSave: boolean = false;
  dashConfig: any = null;
  categories_widgets: any[] = [];
  loading_dashboard_info: boolean = true;
  current_dashboard_id: any;
  nameReport: any;
  sidebar_icons: any[] = [
    'sideBar/building-08.svg',
    'sideBar/file-check-02.svg',
    'sideBar/file-shield-02.svg',
    'sideBar/settings-04.svg',
    'sideBar/settings.svg',
  ];
  // Holds all subscriptions to unsubscribe safely
  private subscription = new Subscription();

  // Iniliaze Constructor
  constructor(
    private _MessageService: MessageService,
    private _ActivatedRoute: ActivatedRoute,
    private _DashboardLayoutService: DashboardLayoutService,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    public _PermissionSystemService:PermissionSystemService
  ) {}

  // handle get CurrentDashboardId
  getCurrentDashboardId() {
    const sub = this._ActivatedRoute.parent?.paramMap.subscribe((res) => {
      this.current_dashboard_id = res.get('id');

      if (this.current_dashboard_id) {
        this.getDashboardConfig(this.current_dashboard_id);
      } else {
        this.is_slected_dashboard = false;
        this.loading_dashboard_info = false;
      }
    });
    // Add subscription to the main subscription container
    if (sub) {
      this.subscription.add(sub);
    }
  }
  // get DashboardConfig
  getDashboardConfig(id: any) {
    this.loading_dashboard_info = true;
    const sub = this._DashboardLayoutService
      .getDashboardLayoutConfig(id)
      .subscribe((res: any) => {
        this.selected_widgets.map((wid: any) => {
          wid.selected = false;
        });
        this.selected_widgets = [];
        this.dashConfig = res?.data;
        this.nameReport = res?.data?.dashboard_Title;
        this.is_slected_dashboard = true;
        this.loading_dashboard_info = false;
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
            name: this.nameReport,
            icon: '',
            routerLink: `/gfw-portal/setting/dashboard-builder/dashboard/${this.current_dashboard_id}/overview`,
          },
          {
            name: this._TranslateService.instant('Dashboard.TABS.DESIGN'),
            icon: '',
          },
        ]);
      });
    // Add subscription to the main subscription container
    if (sub) {
      this.subscription.add(sub);
    }
  }

  // handleChangeDashboardWidgets
  handleChangeDashboardWidgets(event: any) {
    this.dashConfig = event;
  }

  // get CatWidgets
  getCatWidgets() {
    const sub = this._DashboardLayoutService
      .getDashboardCategoruWidgetsLookUp()
      .subscribe((res: any) => {
        this.categories_widgets = res?.data;
        this.selected_cat = this.categories_widgets[0];
      });
    // Add subscription to the main subscription container
    if (sub) {
      this.subscription.add(sub);
    }
  }

  // handle Toggle Select Widget
  handleToggleSelectedWidget(widget: any) {
    widget.selected = !widget.selected;

    if (widget.selected) {
      this.selected_widgets.push(widget);
    } else {
      const i = this.selected_cat.widgets.findIndex(
        (el: any) => el.id == widget.id
      );
      this.selected_widgets.splice(i, 1);
    }
  }
  // save DashBoard Widgets
  saveDashboardWidgets() {
    if (this.selected_widgets.length) {
      this.loadingSave = true;
      const selectedIds: any[] = this.selected_widgets.map((wid: any) => {
        return wid?.id;
      });

      const sub = this._DashboardLayoutService
        .addDashboardWidgets(this.current_dashboard_id, selectedIds)
        .subscribe({
          next: () => {
            this.loadingSave = false;
            this.show_add_dailog = false;
            this._MessageService.add({
              severity: 'success',
              summary: 'Success',
              detail: this._TranslateService.instant(
                'Dashboard.TABS.DashboardWidgetsAddedSuccessfully'
              ),
            });
          },
          error: (y) => {
            this.loadingSave = false;
          },
        });
      // Add subscription to the main subscription container
      if (sub) {
        this.subscription.add(sub);
      }
    }
  }
  // handle PreviewStep
  handlePreviewStep() {
    console.log('dashconfig after custom', this.dashConfig);
    const payload = {
      report_Id: this.current_dashboard_id,
      widgets: this.dashConfig?.dashboard_Widgets?.map((part: any) => {
        return {
          reportPartID: part?.id,
          width: part?.width,
        };
      }),
    };
    const sub = this._DashboardLayoutService
      .updateDashboardWidgets(payload)
      .subscribe({
        next: () => {
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: this._TranslateService.instant(
              'Dashboard.TABS.Dashboardlayoutsavedsuccessfully'
            ),
          });
          // Add subscription to the main subscription container
          if (sub) {
            this.subscription.add(sub);
          }
        },
        error: () => {
          //
        },
      });
  }

  // Life Cycle Hooks
  ngOnInit(): void {
    this.getCatWidgets();
    this.getCurrentDashboardId();
  }

  // On Destroy
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subscription.unsubscribe();
  }
}
