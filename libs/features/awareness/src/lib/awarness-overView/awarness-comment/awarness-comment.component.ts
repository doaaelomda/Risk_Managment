import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ActivatedRoute } from '@angular/router';
import { AwarenessService } from '../../../services/awareness.service';

@Component({
  selector: 'lib-awarness-comment',
  imports: [CommonModule, CommentSectionComponent],
  templateUrl: './awarness-comment.component.html',
  styleUrl: './awarness-comment.component.scss',
})
export class AwarnessCommentComponent {
    awarenessId: any;
  dataAwareness: any;
  loading: boolean = false;
  riskId = 1;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _AwarenessService: AwarenessService
  ) {
     this._ActivatedRoute.parent?.paramMap.subscribe((res) => {
    this.awarenessId = res.get('id');
      this.loading = true;

      if (this.awarenessId) {
         this._AwarenessService.getCampaignById(this.awarenessId).subscribe((res: any) => {
        this.dataAwareness = res?.data;
        this.loading = false;

        this._LayoutService.breadCrumbLinks.next([
          { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
          {
            name: this._TranslateService.instant('AWARENESS.TITLE'),
            icon: '',
            routerLink: '/gfw-portal/awareness/campaign-list',
          },
          { name: this.dataAwareness?.name || '-', icon: '',routerLink:`/gfw-portal/awareness/campaign/${this.awarenessId}` },
          {name:this._TranslateService.instant('TABS.COMMENTS'),icon:''}
        ]);
      });
      }
    });
  }
}
