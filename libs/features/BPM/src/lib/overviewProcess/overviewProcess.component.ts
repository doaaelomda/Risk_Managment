import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute,  Router, RouterOutlet } from '@angular/router';
import { ProcessListService } from '../../processList/process-list.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';

import { SharedTabsComponent } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-overview-process',
  imports: [CommonModule,SkeletonModule,RouterOutlet,TranslateModule,SharedTabsComponent],
  templateUrl: './overviewProcess.component.html',
  styleUrl: './overviewProcess.component.scss',
})
export class OverviewProcessComponent implements OnInit {
  processId: any;
  dataProcess: any;
  loadDataProcess:boolean=false
  tabs:any
  showTabs: boolean = true;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private ProcessListService: ProcessListService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private router: Router,
    private _permissionService: PermissionSystemService
  ) {
    this._ActivatedRoute.paramMap.subscribe((res: any) => {
      this.processId = res.get('processId');
      this.loadDataProcess=true
      if (this.processId) {
        this.ProcessListService.getprocessById(this.processId).subscribe(
          (res: any) => {
            this.dataProcess = res?.data;
            this.loadDataProcess=false
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
                name: this.dataProcess?.name || '-',
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
        id: 2,
        name: 'TABS.procedure',
        icon: 'fi fi-rr-process',
        router: 'procedure',
        visible: ()=> this._permissionService.can('BUSINESSPROCESS', 'PROCEDURE', 'VIEW')
      },
    ];
  }
}
