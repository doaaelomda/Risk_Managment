import { SharedTabsComponent } from './../../../../../shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  RouterOutlet,
} from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { AssetsService } from '../../services/assets.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'lib-overview-assets',
  imports: [
    CommonModule,
    RouterOutlet,
    SkeletonModule,
    TranslateModule,
    SharedTabsComponent
  ],
  templateUrl: './OverviewAssets.component.html',
  styleUrl: './OverviewAssets.component.scss',
})
export class OverviewAssetsComponent {
  breadCrumbLinks: any;
  loadDataAssests: boolean = false;
  tabs: any[] = [];
  AssetsData: any;
  active_tab = 1;
  AssestId: any;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _AssetsService: AssetsService
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
        icon: 'fi fi-rr-paperclip',
        router: 'attachments',
      },
    ];
    this._ActivatedRoute.paramMap.subscribe((res) => {
      this.AssestId = res.get('id');
    });
    this.getByIdAssestes();
  }
  getByIdAssestes() {
    this.loadDataAssests = true;
    this._AssetsService.getAssetById(this.AssestId).subscribe((res: any) => {
      this.AssetsData = res?.data;
      this.loadDataAssests = false;
    });
  }
}
