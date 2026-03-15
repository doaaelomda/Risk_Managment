import {
  OverviewEntry,
  SharedOverviewComponent,
} from './../../../../../../shared/shared-ui/src/lib/shared-overview/shared-overview.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MothodologyService } from '../../../services/methodology.service';
import { filter, finalize, Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-methodology-overview',
  imports: [CommonModule, TranslateModule, SharedOverviewComponent],
  templateUrl: './methodology-overview.component.html',
  styleUrl: './methodology-overview.component.scss',
})
export class MethodologyOverviewComponent {
  constructor(private _service: MothodologyService) { }

  entries: OverviewEntry[] = [
    {
      key: 'name',
      label: 'CONTENT.NAME',
      type: 'text',
    },
    {
      key: 'nameAr',
      label: 'CONTENT.NAME_AR',
      type: 'text',
    },
      {
      key: 'factorImpactName',
      label: 'CONTENT.FACTOR_IMPACT',
      type: 'text',
    },
         {
      key: 'factorLikelihoodName',
      label: 'CONTENT.FACTOR_LIKELIHOOD',
      type: 'text',
    },
    {
      key: 'description',
      label: 'CONTENT.DESCRIPTION',
      type: 'description', // to make it full width with special handling
    },
    {
      key: 'descriptionAr',
      label: 'CONTENT.DESCRIPTION_AR',
      type: 'description', // full width
    },
  ];

  data!: any;
  dataSub!: Subscription;
  loading: boolean = false;
  getData() {
    this.loading = true;
    this.dataSub = this._service.viewedData
      .pipe(filter((res) => !!res))
      .subscribe({
        next: (res) => {
          this.data = res;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  ngOnInit() {
    this.getData();
  }
  ngOnDestroy() {
    this.dataSub.unsubscribe();
  }
}
