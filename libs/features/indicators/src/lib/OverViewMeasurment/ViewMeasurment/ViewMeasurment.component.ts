import { SystemActionsComponent } from './../../../../../../shared/shared-ui/src/lib/system-actions/system-actions.component';
import {
  OverviewEntry,
  SharedOverviewComponent,
} from './../../../../../../shared/shared-ui/src/lib/shared-overview/shared-overview.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { IndicatorService } from '../../services/indicator.service';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'lib-view-measurment',
  imports: [
    CommonModule,
    SkeletonModule,
    TranslateModule,
    SharedOverviewComponent,
    SystemActionsComponent,
  ],
  templateUrl: './ViewMeasurment.component.html',
  styleUrl: './ViewMeasurment.component.scss',
})
export class ViewMeasurmentComponent {
  // Declaration Variables
  isLoading: boolean = false;
  data: any;
  id: any;
  entries: OverviewEntry[] = [
    {
      key: 'code',
      label: 'INDICATORS.CODE',
      type: 'text',
    },
    {
      key: 'name',
      label: 'INDICATORS.NAME',
      type: 'text',
    },
    {
      key: 'indicatorTypeName',
      label: 'INDICATORS.INDICATOR_TYPE_ID',
      type: 'text',
    },
    {
      key: 'indicatorUnitTypeName',
      label: 'INDICATORS.INDICATOR_UNIT_TYPE_ID',
      type: 'text',
    },
    {
      key: 'indicatorAggregationPeriodTypeName',
      label: 'INDICATORS.INDICATOR_AGGREGATION_PERIOD_TYPE_ID',
      type: 'text',
    },
    {
      key: 'indicatorCalculationDirectionTypeName',
      label: 'INDICATORS.INDICATOR_CALCULATION_DIRECTION_TYPE_ID',
      type: 'text',
    },
    {
      key: 'indicatorEvaluationMethodTypeName',
      label: 'INDICATORS.INDICATOR_EVALUATION_METHOD_TYPE_ID',
      type: 'text',
    },
    {
      key: 'targetValue',
      label: 'INDICATORS.TARGET_VALUE',
      type: 'text',
    },
    {
      key: 'ownerRoleName',
      label: 'INDICATORS.OWNER_ROLE_ID',
      type: 'text',
    },
    {
      key: 'organizationalUnitName',
      label: 'INDICATORS.ORGANIZATIONAL_UNIT_ID',
      type: 'text',
    },
    {
      key: 'description',
      label: 'INDICATORS.DESCRIPTION',
      type: 'description',
    },
  ];

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _IndicatorService: IndicatorService
  ) {
    this.getDataOfViewIndicator();
  }
  // get Data Indicators
  getDataOfViewIndicator() {
    this.isLoading = true;
    this._ActivatedRoute?.parent?.paramMap
      .pipe(
        switchMap((res) => {
          this.id = res.get('id');
          if (!this.id) return [];
          return this._IndicatorService.getIndicatorById(res.get('id'));
        })
      )
      .subscribe((res: any) => {
        this.data = res?.data;
        this.isLoading = false;
      });
  }
}
