import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { AwarenessService } from 'libs/features/awareness/src/services/awareness.service';

@Component({
  selector: 'lib-audience-comment',
  imports: [CommonModule, CommentSectionComponent],
  templateUrl: './audience-comment.component.html',
  styleUrl: './audience-comment.component.scss',
})
export class AudienceCommentComponent {
  audienceId: any;
  dataAwareness: any;
  loading: boolean = false;
  riskId = 1;
  awarenessId:any
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _AwarenessService: AwarenessService
  ) {
    this._ActivatedRoute.parent?.paramMap.subscribe((res) => {
      this.audienceId = res.get('audienceId');
      this.awarenessId = res.get('id');
      this.loading = true;

      if (this.audienceId) {
        this._AwarenessService
          .getAduianceById(this.audienceId)
          .subscribe((res: any) => {
            this.dataAwareness = res?.data;
            this.loading = false;

            this._LayoutService.breadCrumbLinks.next([
              { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
              {
                name: this._TranslateService.instant('AWARENESS.TITLE'),
                icon: '',
                routerLink: '/gfw-portal/awareness/campaign-list',
              },
              {
                name: this._TranslateService.instant('ADUIANCE.TITLE'),
                icon: '',
                routerLink: `/gfw-portal/awareness/compagine-setup/${this.awarenessId}/aduiance`,
              },
              {
                name: this.dataAwareness?.campaignName,
                icon: '',
                routerLink: `/gfw-portal/awareness/compagine-setup/${this.awarenessId}/aduiance/${res?.data?.awarenessCampaignAudienceID}/overview`,
              },
              {
                name: this._TranslateService.instant('TABS.COMMENTS'),
                icon: '',
              },
            ]);
          });
      }
    });
  }
}
