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
import { Subscription } from 'rxjs';
import { MothodologyService } from 'libs/features/risks/src/services/methodology.service';
import { EffectivenessFormulaService } from 'libs/features/risks/src/services/effectiveness-formula.service';
@Component({
  selector: 'lib-effectiveness-formula-view',
  imports: [
    CommonModule,
    SkeletonModule,
    TranslateModule,
    SharedOverviewComponent,
  ],
  templateUrl: './effectiveness-formula-view.component.html',
  styleUrl: './effectiveness-formula-view.component.scss',
})
export class EffectivenessFormulaViewComponent implements OnInit, OnDestroy {
  breadCrumbLinks: any;
  loadingData: boolean = false;
  tabs: any[] = [];
  Data: any;
  active_tab = 1;
  effectivenessId: any;
  methodolgyId: any;
  breadCrumb: any[] = [];
  effectivenessFormulalData: any;
  private subscription: Subscription = new Subscription();
  entries: OverviewEntry[] = [
    {
      key: 'name',
      label: 'EFFECTIVENESS_FORMULA.NAME_EN',
      type: 'text',
    },
    {
      key: 'nameAr',
      label: 'EFFECTIVENESS_FORMULA.NAME_AR',
      type: 'text',
    },
    {
      key: 'individualControlEffectivenessFormula',
      label: 'EFFECTIVENESS_FORMULA.INDIVIDUAL_FORMULA',
      type: 'text',
    },
    {
      key: 'combinedControlEffectivenessFormula',
      label: 'EFFECTIVENESS_FORMULA.COMBINED_FORMULA',
      type: 'text',
    },
    {
      key: 'finalControlEffectivenessFormula',
      label: 'EFFECTIVENESS_FORMULA.FINAL_FORMULA',
      type: 'text',
    },
    {
      key: 'minCap',
      label: 'EFFECTIVENESS_FORMULA.MIN_CAP',
      type: 'text',
    },
    {
      key: 'maxCap',
      label: 'EFFECTIVENESS_FORMULA.MAX_CAP',
      type: 'text',
    },
    {
      key: 'controlEffectivenessFormulaCapBehaviorTypeName',
      label: 'EFFECTIVENESS_FORMULA.CAP_BEHAVIOR',
      type: 'text',
    },
    {
      key: 'capJustification',
      label: 'EFFECTIVENESS_FORMULA.CAP_JUSTIFICATION',
      type: 'text',
    },
    {
      key: 'descriptionAr',
      label: 'CONTENT.DESCRIPTION_AR',
      type: 'description',
    },
    {
      key: 'description',
      label: 'CONTENT.DESCRIPTION',
      type: 'description',
    },
  ];

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private EffectivenessFormulaService: EffectivenessFormulaService,
    private _methodologyS: MothodologyService
  ) {}
  // Get Data
  getData() {
    this._ActivatedRoute.parent?.paramMap.subscribe((res: any) => {
      this.effectivenessId = res.get('effectivenessId');
      this.methodolgyId = res.get('methodolgyId');
      if (this.effectivenessId) {
        this.loadingData = true;
        const sub = this.EffectivenessFormulaService.getById(
          this.effectivenessId
        ).subscribe((res: any) => {
          this.effectivenessFormulalData = res?.data;
          this.loadingData = false;
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
          name: this._TranslateService.instant(
            'EFFECTIVENESS_FORMULA.TABLE_TITLE'
          ),
          routerLink: `/gfw-portal/risks-management/methodolgy/${this.methodolgyId}/effectivenessFormula`,
        },

        {
          name: this.effectivenessFormulalData?.name || '-',
          icon: '',
          routerLink: `/gfw-portal/risks-management/methodolgy/${
            this.methodolgyId
          }/effectivenessFormula/${this.effectivenessId}/effectivenessFormula/${
            (this, this.effectivenessId)
          }`,
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
}
