import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlaService } from '../../../services/sla.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { OverviewEntry, SharedOverviewComponent } from "libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component";
import { finalize } from 'rxjs';

@Component({
  selector: 'lib-sla-overview',
  imports: [CommonModule, TranslateModule, SharedOverviewComponent],
  templateUrl: './sla-overview.component.html',
  styleUrl: './sla-overview.component.scss',
})
export class SlaOverviewComponent {
  constructor(private _slaS: SlaService, private activeRoute: ActivatedRoute) {}

  ngOnInit() {
    this.handleActiveRoute();
  }

  handleActiveRoute() {
    this.activeRoute.parent?.paramMap.subscribe((res) => {
      console.log(res, 'params');

      const slaId = res?.get('slaId');
      if (!slaId) return;
      this.getById(slaId);
    });
  }
  data: any;
  loading:boolean = false
  getById(id: any) {
    this.loading = true
    this._slaS.getSLAById(id).pipe(finalize(() => this.loading = false)).subscribe((res: any) => {
      console.log(res, 'got contract by id');
      this.data = res?.data;
    });
  }


  entries: OverviewEntry[] = [
  { key: 'name', label: 'CONTENT.NAME', type: 'text' },
  { key: 'contractName', label: 'THIRD_PARTY.CONTRACT', type: 'text' },
  { key: 'metricName', label: 'THIRD_PARTY.METRIC_NAME', type: 'text' },
  { key: 'targetValue', label: 'THIRD_PARTY.TARGET_VALUE', type: 'text' },
  { key: 'unit', label: 'THIRD_PARTY.UNIT', type: 'text' },
  { key: 'measurementMethod', label: 'THIRD_PARTY.MEASUREMENT_METHOD', type: 'text' },

  { key: 'penaltyClause', label: 'THIRD_PARTY.PENALTY_CLAUSE', type: 'description' },
  { key: 'notes', label: 'THIRD_PARTY.NOTES', type: 'description' }
];

}
