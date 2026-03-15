import { SharedTabsComponent } from './../../../../../shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  RouterOutlet,
} from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { ThreatService } from '../../services/threat.service';
@Component({
  selector: 'lib-overview-threads',
  imports: [CommonModule,
    RouterOutlet,
    SkeletonModule,
    TranslateModule,
    SharedTabsComponent],
  templateUrl: './overviewThreads.component.html',
  styleUrl: './overviewThreads.component.scss',
})
export class OverviewThreadsComponent {
      breadCrumbLinks: any;
  loadDatathreats: boolean = false;
  threatsData: any;
  active_tab = 1;
  threatsId: any;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _TranslateService: TranslateService,
    private _threats: ThreatService
  ) {
    this._ActivatedRoute.paramMap.subscribe((res) => {
      this.threatsId = res.get('id');
    });
    this.getByIdthreats();
  }

    getByIdthreats() {
    this.loadDatathreats = true;
    this._threats.getThreatById(this.threatsId).subscribe((res: any) => {
      this.threatsData = res?.data;
      this.loadDatathreats = false;
    });
  }
}
