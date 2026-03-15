import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { QuestionService } from 'libs/features/questionnaire/src/Service/question.service';
import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';
import { QuestionAnswarOptionService } from 'libs/features/questionnaire/src/Service/question-answar-option.service';

@Component({
  selector: 'lib-comment-question-answer',
  imports: [CommonModule, CommentSectionComponent],
  templateUrl: './comment-questionAnswer.component.html',
  styleUrl: './comment-questionAnswer.component.scss',
})
export class CommentQuestionAnswerComponent implements OnInit, OnDestroy {
  // Declaration Variables
  questionId: any;
  dataQuestion: any;
  loading: boolean = false;
  questionnaireAnswerOptionID: any;
  private subscription: Subscription = new Subscription();

  // Declaration Constractor
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private QuestionAnswarOptionService: QuestionAnswarOptionService
  ) {}
  ngOnInit(): void {
    this.getQuestionnaireAnswerOption();
  }
  // Handle BreadCrumb

  getQuestionnaireAnswerOption() {
    ;
    this.questionnaireAnswerOptionID =
      this._ActivatedRoute.parent?.snapshot.params['answerId'];
      this.questionId =
      this._ActivatedRoute.parent?.snapshot.params['id'];
    if (!this.questionnaireAnswerOptionID) return;
    this.QuestionAnswarOptionService.getQuestionAnswerOptionById(
      this.questionnaireAnswerOptionID
    ).subscribe((res: any) => {
      this.dataQuestion = res?.data;
      this._LayoutService.breadCrumbLinks.next([
        { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
        {
          name: this._TranslateService.instant(
            'BREAD_CRUMB_TITLES.QUESTION_LIST'
          ),
          icon: '',
          routerLink: '/gfw-portal/questionnaire/questions-list',
        },
        {
          name: this.dataQuestion?.questionText || '-',
          icon: '',
          routerLink: `/gfw-portal/questionnaire/ViewQuestion/${this.questionId}/overview`,
        },
        {
          name: this._TranslateService.instant(
            'TABS.QuestionnaireAnswerOption'
          ),
          icon: '',
          routerLink: `/gfw-portal/questionnaire/ViewQuestion/${this.questionId}/QuestionnaireAnswer`,
        },
        {
          name: this.dataQuestion?.answerText,
          icon:'',
          routerLink:`/gfw-portal/questionnaire/${this.questionId}/view/${this.questionnaireAnswerOptionID}/overview`
        },
        {
          name: this._TranslateService.instant('TABS.COMMENTS'),
          icon: '',
        },
      ]);
    });
  }
  // OnDestroy
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
