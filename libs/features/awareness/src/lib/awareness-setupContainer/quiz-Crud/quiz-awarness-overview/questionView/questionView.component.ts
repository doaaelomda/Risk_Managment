import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AwarenessService } from 'libs/features/awareness/src/services/awareness.service';
import { forkJoin, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';

@Component({
  selector: 'lib-question-view',
  imports: [CommonModule, SkeletonModule, TranslateModule],
  templateUrl: './questionView.component.html',
  styleUrl: './questionView.component.scss',
})
export class QuestionViewComponent {
  questionId: any;
  dataQuestion: any;
  loading: boolean = false;
  awarenessId: any;

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _AwarenessService: AwarenessService,
    private _sharedService:SharedService
  ) {
    this._ActivatedRoute?.parent?.paramMap.pipe(take(1)).subscribe((params) => {
      this.questionId = params.get('quizId');
      this.awarenessId = params.get('id');
      this.loading = true;

      const quiz$ = this.questionId
        ? this._AwarenessService.getQuizById(this.questionId)
        : of({ data: { name: '-' } });

      const campaign$ = this.awarenessId
        ? this._AwarenessService.getCampaignById(this.awarenessId)
        : of({ data: { name: '-' } });

      forkJoin([quiz$, campaign$]).subscribe(([quizRes, campaignRes]: any) => {
        this.dataQuestion = quizRes?.data || { name: '-' };
        const campaignData = campaignRes?.data || { name: '-' };
        this.loading = false;

        const breadcrumbLinks = [
          { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
          {
            name: this._TranslateService.instant('AWARENESS.TITLE'),
            icon: '',
            routerLink: '/gfw-portal/awareness/campaign-list',
          },
          { name: this._sharedService.truncateWords(campaignData.name,3), icon: '',
            routerLink:`/gfw-portal/awareness/compagine-setup/${this.awarenessId}/overview`
           },
          {
            name: this._TranslateService.instant('QUIZ.TITLE'),
            icon: '',
            routerLink: `/gfw-portal/awareness/compagine-setup/${this.awarenessId}/Quiz`,
          },
          { name: this._sharedService.truncateWords(this.dataQuestion.name,3) || '-', icon: '',
             routerLink:`/gfw-portal/awareness/compagine-setup/${this.awarenessId}/Quiz/${this.questionId}/overview`
           }
        ];

        this._LayoutService.breadCrumbLinks.next(breadcrumbLinks);
      });
    });
  }
}
