import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, finalize, Subscription } from 'rxjs';
import { MethodologyLevelsService } from '../../../services/methodology-levels.service';
import { TranslateModule } from '@ngx-translate/core';
import { OverviewEntry, SharedOverviewComponent } from "libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component";

@Component({
  selector: 'lib-method-level-overview',
  imports: [CommonModule, TranslateModule, SharedOverviewComponent],
  templateUrl: './method-level-overview.component.html',
  styleUrl: './method-level-overview.component.scss',
})
export class MethodLevelOverviewComponent {
  constructor(private service: MethodologyLevelsService) {}

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
    key: 'color',
    label: 'CONTENT.COLOR',
    type: 'color',
  },
  {
    key: 'fromWeight',
    label: 'CONTENT.FROM_WEIGHT',
    type: 'number',
  },
  {
    key: 'toWeight',
    label: 'CONTENT.TO_WEIGHT',
    type: 'number',
  },
  {
    key: 'levelWeight',
    label: 'CONTENT.LEVEL_WEIGHT',
    type: 'number',
  },
  {
    key: 'riskMethodologyName',
    label: 'BREAD_CRUMB_TITLES.METHODOLOGY',
    type: 'text',
  },
  {
    key: 'description',
    label: 'CONTENT.DESCRIPTION',
    type: 'description',
  },
  {
    key: 'descriptionAr',
    label: 'CONTENT.DESCRIPTION_AR',
    type: 'description',
  },
];

  loading:boolean = false
  getData() {
    this.loading = true
  this.dataSub = this.service.viewedData.pipe(filter((res) => !!res)).subscribe({
  next: (res) => {
    this.data = res;
    this.loading = false;
  },
  error: () => {
    this.loading = false;
  }
});
  }
  data!: any;
  dataSub!: Subscription;
  ngOnInit() {
    this.getData();
  }
  ngOnDestroy() {
    this.dataSub.unsubscribe();
  }
}
