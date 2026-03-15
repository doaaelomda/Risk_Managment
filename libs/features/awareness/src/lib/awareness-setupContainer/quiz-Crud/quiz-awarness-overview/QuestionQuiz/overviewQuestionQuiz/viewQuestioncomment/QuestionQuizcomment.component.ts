import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';
import { forkJoin, of, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { AwarenessService } from 'libs/features/awareness/src/services/awareness.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';

@Component({
  selector: 'lib-question-quizcomment',
  imports: [CommonModule, CommentSectionComponent],
  templateUrl: './QuestionQuizcomment.component.html',
  styleUrl: './QuestionQuizcomment.component.scss',
})
export class QuestionQuizcommentComponent {
  questionId: any;
  dataQuestion: any;
  loading: boolean = false;
  riskId = 1;
  riskChildId: any;
  awarenessId: any;
  id: any;
  quizId:any
  campaignResData:any
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _AwarenessService: AwarenessService,
    private _SharedService: SharedService
  ) {
    this._ActivatedRoute?.parent?.paramMap.pipe(take(1)).subscribe((params) => {
      this.questionId = params.get('questionId');
         this.quizId = params.get('quizId');
      this.id = params.get('id');
      this.loading = true;

      const quiz$ = this.questionId
        ? this._AwarenessService.getQuestionQuizById(this.questionId)
        : of({ data: { name: '-' } });

      const campaign$ = this.id
        ? this._AwarenessService.getQuizById(this.id)
        : of({ data: { name: '-' } });

      forkJoin([quiz$, campaign$]).subscribe(([quizRes, campaignRes]: any) => {
        this.dataQuestion = quizRes?.data || { name: '-' };
        this.loading = false;
        this.campaignResData = campaignRes?.data
        const breadcrumbLinks = [
                   { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
          {
            name: this._TranslateService.instant('AWARENESS.TITLE'),
            icon: '',
            routerLink: '/gfw-portal/awareness/campaign-list',
          },
          {
            name: this._TranslateService.instant('OPTION_QUESTION.option'),
            icon: '',
routerLink: `/gfw-portal/awareness/compagine-setup/${this.id}/Quiz/${this.quizId}/question-quiz`,          },
          { name: this._SharedService.truncateWords(this.dataQuestion.questionText,3) || '-', icon: '',
            routerLink:`/gfw-portal/awareness/compagine-setup/${this.id}/Quiz/${this.id}/question-quiz/${this.questionId}/overview`


           },
          { name: this._TranslateService.instant('TABS.COMMENTS'), icon: '' },
        ];

        this._LayoutService.breadCrumbLinks.next(breadcrumbLinks);
      });
    });
  }
}
