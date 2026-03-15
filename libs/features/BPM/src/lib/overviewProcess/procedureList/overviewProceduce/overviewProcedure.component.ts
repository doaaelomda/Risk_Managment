import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  RouterOutlet,
} from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ProcessListService } from 'libs/features/BPM/src/processList/process-list.service';
import { SharedTabsComponent } from "libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component";

@Component({
  selector: 'lib-overview-procedure',
  imports: [
    CommonModule,
    SkeletonModule,
    RouterOutlet,
    TranslateModule,
    SharedTabsComponent
],
  templateUrl: './overviewProcedure.component.html',
  styleUrl: './overviewProcedure.component.scss',
})
export class OverviewProcedureComponent implements OnInit {
  processId: any;
  dataProcess: any;
  loadDataProcess: boolean = false;
  tabs: any;
  dataProcedure: any;
  procedureId: any;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private ProcessListService: ProcessListService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService
  ) {
    this._ActivatedRoute?.paramMap.subscribe((res: any) => {
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
    this._ActivatedRoute?.paramMap.subscribe((res: any) => {
      this.procedureId = res.get('procedureId');
      if (this.processId) {
        this.ProcessListService.getproceduresById(this.procedureId).subscribe(
          (res: any) => {
            this.dataProcedure = res?.data;
            this.loadDataProcess = false;
            this._LayoutService.breadCrumbLinks.next([
              {
                name: '',
                icon: 'fi fi-rs-home',
                routerLink: '/',
              },
              {
                name: this._TranslateService.instant('PROCESS.TABLE_NAME'),
                icon: '',
                routerLink: '/gfw-portal/BPM/process-list',
              },

              {
                name: this.dataProcedure?.businessProcessName || '-',
                icon: '',
              },
              {
                name: this.dataProcedure?.referenceCode || '-',
                icon: '',
              },
            ]);
          }
        );
      }
    });
  }
  ngOnInit(): void {
    this.tabs = [
      {
        id: 1,
        name: this._TranslateService.instant('TABS.OVERVIEW'),
        icon: 'fi-rr-apps',
        router: 'overview',
      },
      {
        id: 2,
        name: this._TranslateService.instant('TABS.COMMENTS'),
        icon: 'fi fi-rr-comment',
        router: 'comments',
      },
      {
        id: 3,
        name: this._TranslateService.instant('TABS.ATTACHMENTS'),
        icon: 'fi fi-rr-paperclip',
        router: 'attachments',
      },
    ];
  }
}
