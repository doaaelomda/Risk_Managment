import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { AwarenessService } from 'libs/features/awareness/src/services/awareness.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { forkJoin, of, take } from 'rxjs';

@Component({
  selector: 'lib-view-question-quiz',
  imports: [CommonModule, SkeletonModule, TranslateModule],
  templateUrl: './viewQuestionQuiz.component.html',
  styleUrl: './viewQuestionQuiz.component.scss',
})
export class ViewQuestionQuizComponent {
  questionId: any;
  dataQuestion: any;
  loading: boolean = false;
  id: any;
  quizId: any;
  campaignResData: any;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _AwarenessService: AwarenessService,
    private _sharedService: SharedService
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
        this.campaignResData = campaignRes?.data;
        this.loading = false;

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
            routerLink: `/gfw-portal/awareness/compagine-setup/${this.id}/Quiz/${this.quizId}/question-quiz`,
          },
          {
            name:
              this._sharedService.truncateWords(
                this.dataQuestion.questionText,
                3
              ) || '-',
            icon: '',
            routerLink: `/gfw-portal/awareness/compagine-setup/${this.id}/Quiz/${this.quizId}/question-quiz/${this.questionId}/overview`,
          },
        ];

        this._LayoutService.breadCrumbLinks.next(breadcrumbLinks);
      });
    });
  }
}
