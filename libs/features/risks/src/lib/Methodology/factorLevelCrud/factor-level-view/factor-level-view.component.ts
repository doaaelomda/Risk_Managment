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
  selector: 'lib-factor-level-view',
  imports: [
    CommonModule,
    SkeletonModule,
    TranslateModule,
    SystemActionsComponent,
    SharedOverviewComponent,
  ],
  templateUrl: './factor-level-view.component.html',
  styleUrl: './factor-level-view.component.scss',
})
export class FactorLevelViewComponent implements OnInit, OnDestroy {
  breadCrumbLinks: any;
  loadDataAssests: boolean = false;
  tabs: any[] = [];
  Data: any;
  active_tab = 1;
  id: any;
  methodolgyId: any;
  breadCrumb: any[] = [];
  factorLevelId: any;
  factoryLevelData: any;
  private subscription: Subscription = new Subscription();
  entries: OverviewEntry[] = [
    { key: 'name', label: 'CONTENT.NAME', type: 'text' },
    { key: 'nameAr', label: 'CONTENT.NAME_AR', type: 'text' },
    { key: 'color', label: 'CONTENT.COLOR', type: 'text' },
    { key: 'weight', label: 'CONTENT.WEIGHT', type: 'text' },
    { key: 'minValue', label: 'CONTENT.MINIMUM_VALUE', type: 'text' },
    { key: 'maxValue', label: 'CONTENT.MAX_VALUE', type: 'text' },
    { key: 'description', label: 'CONTENT.DESCRIPTION', type: 'text' },
    { key: 'descriptionAr', label: 'CONTENT.DESCRIPTION_AR', type: 'text' },
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
      this.factorLevelId = res.get('factorLevelId');
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
          name: this._TranslateService.instant('FACTOR_LEVEL.TABLE_TITLE'),
          routerLink: `/gfw-portal/risks-management/methodolgy/${this.methodolgyId}/factors/${this.id}/factorsLevel`,
        },

        {
          name: this.Data?.name || '-',
          icon: '',
          routerLink: `/gfw-portal/risks-management/methodolgy/${
            this.methodolgyId
          }/factors/${this.id}/factorsLevel/${(this, this.factorLevelId)}`,
        },
      ]);
    });
    this.__FactorService
      .getByIdFactorLevel(this.factorLevelId)
      .subscribe((res: any) => {
        this.factoryLevelData = res?.data;
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
