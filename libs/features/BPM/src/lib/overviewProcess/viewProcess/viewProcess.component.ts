import { SystemActionsComponent } from 'libs/shared/shared-ui/src/lib/system-actions/system-actions.component';
import { OverviewEntry, SharedOverviewComponent } from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProcessListService } from '../../../processList/process-list.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'lib-view-process',
  imports: [CommonModule,SkeletonModule,TranslateModule,SharedOverviewComponent,SystemActionsComponent],
  templateUrl: './viewProcess.component.html',
  styleUrl: './viewProcess.component.scss',
})
export class ViewProcessComponent {
  dataProcess: any;
  loadDataProcess: boolean = false;
  processId: any;
  tabs: any;

  entries: OverviewEntry[] = [
  { key: 'nameAr', label: 'PROCESS.NAMEAr', type: 'text' },
  { key: 'description', label: 'PROCESS.DESCRIPTION', type: 'description' },
  { key: 'descriptionAr', label: 'PROCESS.describtionAr', type: 'description' }
];

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private ProcessListService: ProcessListService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService
  ) {
    this._ActivatedRoute?.parent?.paramMap.subscribe((res: any) => {
      this.processId = res.get('processId');
      this.loadDataProcess = true;
      if (this.processId) {
        this.ProcessListService.getprocessById(this.processId).subscribe(
          (res: any) => {
            this.dataProcess = res?.data;
            this.loadDataProcess = false;
          }
        );
      }
    });
  }
}
