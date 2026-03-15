import { SystemActionsComponent } from 'libs/shared/shared-ui/src/lib/system-actions/system-actions.component';
import {
  OverviewEntry,
  SharedOverviewComponent,
} from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { FactorsService } from 'libs/features/risks/src/services/factor-level.service';
import { Subscription } from 'rxjs';
import { MothodologyService } from 'libs/features/risks/src/services/methodology.service';
@Component({
  selector: 'lib-factor-view',
  imports: [  CommonModule,
    SkeletonModule,
    TranslateModule,
    SystemActionsComponent,
    SharedOverviewComponent,],
  templateUrl: './factor-view.component.html',
  styleUrl: './factor-view.component.scss',
})
export class FactorViewComponent implements OnInit, OnDestroy {
  breadCrumbLinks: any;
  loadDataAssests: boolean = false;
  tabs: any[] = [];
  Data: any;
  active_tab = 1;
  id: any;
  methodolgyId: any;
  breadCrumb: any[] = [];
  private subscription: Subscription = new Subscription();
  entries: OverviewEntry[] = [
  {
    key: 'factorCode',
    label: 'FACTOR.CODE',
    type: 'text',
  },
  {
    key: 'name',
    label: 'FACTOR.NAME_EN',
    type: 'text',
  },
  {
    key: 'nameAr',
    label: 'FACTOR.NAME_AR',
    type: 'text',
  },
  {
    key: 'description',
    label: 'FACTOR.DESCRIPTION_EN',
    type: 'text',
  },
  {
    key: 'descriptionAr',
    label: 'FACTOR.DESCRIPTION_AR',
    type: 'text',
  },
  {
    key: 'equation',
    label: 'FACTOR.EQUATION',
    type: 'text',
  },
  {
    key: 'rangeFrom',
    label: 'FACTOR.RANGE_FROM',
    type: 'number',
  },
  {
    key: 'rangeTo',
    label: 'FACTOR.RANGE_TO',
    type: 'number',
  },
  {
    key: 'riskFactorUnitName',
    label: 'FACTOR.UNIT',
    type: 'text',
  },
  {
    key: 'riskCalculationTypeName',
    label: 'FACTOR.CALCULATION_TYPE',
    type: 'text',
  },
  {
    key: 'riskFactorDataTypeName',
    label: 'FACTOR.DATA_TYPE',
    type: 'text',
  },
];


  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private __FactorService: FactorsService,
    private _methodologyS: MothodologyService
  ) {}
  // Get Data
  getData() {
    this._ActivatedRoute.parent?.paramMap.subscribe((res: any) => {
      this.id = res.get('id');
      this.methodolgyId = res.get('methodolgyId');
      if (this.id) {
        const sub = this.__FactorService
          .getById(this.id)
          .subscribe((res: any) => {
            this.Data = res?.data;
            this.getDataMethodology();
          });
        this.subscription.add(sub);
      }
    });
  }

  // get Data Methodology

  getDataMethodology() {
    this._methodologyS.getById(this.methodolgyId).subscribe((res: any) => {
      this._LayoutService.breadCrumbLinks.next([
        {
          name: '',
          icon: 'fi fi-rs-home',
          routerLink: '/',
        },
        {
          name: this._TranslateService.instant(
            'BREAD_CRUMB_TITLES.METHODOLOGY'
          ),
          icon: '',
          routerLink: '/gfw-portal/risks-management/methodolgy/list',
        },
        {
          name: this._TranslateService.instant('METHODOLOGY.METHODOLOGYS_LIST'),
          icon: '',
          routerLink: '/gfw-portal/risks-management/methodolgy/list',
        },
        {
          name: res?.data?.name || '-',
          routerLink: `/gfw-portal/risks-management/methodolgy/${this.methodolgyId}/overview`,
        },

        {
          name: this._TranslateService.instant('FACTOR.TABLE_TITLE'),
          routerLink: `/gfw-portal/risks-management/methodolgy/${this.methodolgyId}/factors`,
        },

        {
          name: this.Data?.name || '-',
          icon: '',
          routerLink: `/gfw-portal/risks-management/methodolgy/${this.methodolgyId}/factors/${this.id}/overview`,
        },
      ]);
    });
  }

  ngOnInit(): void {
    this.getData();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
      hasActions:boolean = true;
  onFoundAction(event:boolean){
    this.hasActions = event;
    console.log('hasActions', this.hasActions);
  }
}
