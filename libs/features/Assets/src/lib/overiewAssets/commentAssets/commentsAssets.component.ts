import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AssetsService } from '../../../services/assets.service';
import { CommentSectionComponent } from './../../../../../../shared/shared-ui/src/lib/comment-section/comment-section.component';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';

@Component({
  selector: 'lib-comments-assets',
  imports: [CommonModule, CommentSectionComponent],
  templateUrl: './commentsAssets.component.html',
  styleUrls: ['./commentsAssets.component.scss'],
})
export class CommentsAssetsComponent {
  breadCrumb: any[] = [];
  riskId = 1;
  riskChildId: any;

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _AssetsService: AssetsService,
    private _TranslateService: TranslateService,
    private _LayoutService:LayoutService
  ) {
    this.initData();
  }

  private initData(): void {
    this._ActivatedRoute?.parent?.paramMap.subscribe((params) => {
      this.riskChildId = params.get('id');
      this._AssetsService.getAssetById(this.riskChildId).subscribe({
        next: (res: any) => {
          this.breadCrumb = [
            { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
            {
              name: this._TranslateService.instant('BREAD_CRUMB_TITLES.ASSETS'),
              icon: '',
              routerLink: '/gfw-portal/assets',
            },
            {
              name: this._TranslateService.instant(
                'BREAD_CRUMB_TITLES.ASSETS_LIST'
              ),
              icon: '',
              routerLink: '/gfw-portal/assets',
            },
            {
              name: res?.data?.shortName || '-',
              icon: '',
              routerLink: `/gfw-portal/assets/${this.riskChildId}/overview`,
            },
            { name: this._TranslateService.instant('TABS.COMMENTS'), icon: '' },
          ];
          this._LayoutService.breadCrumbLinks.next(this.breadCrumb);
        },
        error: (err) => {
          console.error(err);
        },
      });
    });
  }
}
