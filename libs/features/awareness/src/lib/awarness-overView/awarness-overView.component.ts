import { SharedTabsComponent } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  RouterOutlet,
} from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { AwarenessService } from '../../services/awareness.service';
@Component({
  selector: 'lib-awarness-over-view',
  imports: [ CommonModule,
    RouterOutlet,
    SkeletonModule,
    TranslateModule,
    SharedTabsComponent
  ],
  templateUrl: './awarness-overView.component.html',
  styleUrl: './awarness-overView.component.scss',
})
export class AwarnessOverViewComponent  {
  breadCrumbLinks: any;
  loadDataAwarness: boolean = false;
  tabs: any[] = [];
  awarenessData: any;
  active_tab = 1;
  AwarrnessId: any;

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _TranslateService: TranslateService,
    private _AwarenessService: AwarenessService
  ) {
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
        icon: 'fi fi-ts-clip-file',
        router: 'attachments',
      },
    ];

    this._ActivatedRoute.paramMap.subscribe((res) => {
      this.AwarrnessId = res.get('id');
    });

    this.getByIdAwarrness();
  }

  getByIdAwarrness() {
    this.loadDataAwarness = true;
    this._AwarenessService
      .getCampaignById(this.AwarrnessId)
      .subscribe((res: any) => {
        this.awarenessData = res?.data;
        this.loadDataAwarness = false;
      });
  }
}
