import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ActivatedRoute } from '@angular/router';
import { AwarenessService } from 'libs/features/awareness/src/services/awareness.service';
import { forkJoin, of, take } from 'rxjs';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';

@Component({
  selector: 'lib-question-comment',
  imports: [CommonModule, CommentSectionComponent],
  templateUrl: './questionComment.component.html',
  styleUrl: './questionComment.component.scss',
})
export class QuestionCommentComponent {
  questionId: any;
  dataQuestion: any;
  loading: boolean = false;
  riskId = 1;
  riskChildId: any;
  audienceId:any
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _AwarenessService: AwarenessService,
    private _SharedService:SharedService
  ) {
     this._ActivatedRoute?.parent?.paramMap.pipe(take(1)).subscribe((params:any) => {
          this.questionId = params.get('quizId');
          this.audienceId = params.get('id');
          this.loading = true;

          const quiz$ = this.questionId
            ? this._AwarenessService.getQuizById(this.questionId)
            : of({ data: { name: '-' } });

          const campaign$ = this.audienceId
            ? this._AwarenessService.getCampaignById(this.audienceId)
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
              { name: this._SharedService.truncateWords(campaignData.name, 3), icon: '' ,
                 routerLink:`/gfw-portal/awareness/compagine-setup/${this.audienceId}/overview`},
              {
                name: this._TranslateService.instant('QUIZ.TITLE'),
                icon: '',
                routerLink: `/gfw-portal/awareness/compagine-setup/${this.audienceId}/Quiz`,
              },
              { name: this._SharedService.truncateWords(this.dataQuestion.name, 3), icon:'',
                routerLink:`/gfw-portal/awareness/compagine-setup/${this.audienceId}/Quiz/${this.questionId}/overview`
               },
              {name:this._TranslateService.instant('TABS.COMMENTS'),icon:''}
            ];

            this._LayoutService.breadCrumbLinks.next(breadcrumbLinks);
          });
        });
  }
}
