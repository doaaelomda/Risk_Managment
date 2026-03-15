import { SharedTabsComponent } from './../../../../../shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { switchMap } from 'rxjs';
import { IndicatorService } from '../services/indicator.service';
import { SkeletonModule } from 'primeng/skeleton';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-over-view-measurment',
  imports: [
    CommonModule,
    RouterOutlet,
    TranslateModule,
    SkeletonModule,
    SharedTabsComponent,
  ],
  templateUrl: './OverViewMeasurment.component.html',
  styleUrl: './OverViewMeasurment.component.scss',
})
export class OverViewMeasurmentComponent {
  // Declaration Variables
  breadCrumbLinks: any;
  loading_data: boolean = false;
  tabs: any[] = [];
  data: any;
  active_tab = 1;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _IndicatorService: IndicatorService,
    public _PermissionSystemService: PermissionSystemService
  ) {
    this.handleTab();
    this.getData();
  }

  // handle Get Data
  moduleName!: string;
  getData() {
    this.loading_data = true;
    this._ActivatedRoute.paramMap
      .pipe(
        switchMap((res) => {
          const id = res.get('id');
          this.moduleName = res.get('module') ?? '';
          if (!id) return [];
          return this._IndicatorService.getIndicatorById(res.get('id'));
        })
      )
      .subscribe((res: any) => {
        this.data = res?.data;
        this.loading_data = false;
        this.handleBreadCrumb(this.moduleName);
      });
  }
  handleBreadCrumb(module: string) {
    let listUrl = '/gfw-portal/indicators/KPI'
    switch(module){
      case 'risks':{
        listUrl = '/gfw-portal/risks-management/KRI'
      }break;
      case 'compliance':{
        listUrl = '/gfw-portal/compliance/KCI'
      }break;
      case 'thirdparties':{
        listUrl = '/gfw-portal/third-party/KTI'
      }break;
      default:'/gfw-portal/indicators/KPI'
    }
    this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('INDICATORS.INDICATOR'),
        icon: '',
        routerLink: listUrl,
      },
      {
        name: this._TranslateService.instant('INDICATORS.INDICATORS_LIST'),
        icon: '',
        routerLink: listUrl,
      },

      {
        name: this.data?.name,
        icon: '',
      },
    ]);
  }
  // handle Tabs
  handleTab() {
    this.tabs = [
      {
        id: 2,
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.measurment_LIST'
        ),
        icon: 'fi fi-rr-shield-check',
        router: 'measurement-list',
        visible: () =>
          this._PermissionSystemService.can(
            'COMPLIANCE',
            'KEYCOMPLIANCEINDICATORSMEASURMENTLIST',
            'VIEW'
          ),
      },
    ];
  }
}
