import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  OverviewEntry,
  SharedOverviewComponent,
} from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { QuestionAnswarOptionService } from 'libs/features/questionnaire/src/Service/question-answar-option.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lib-view-question-answer',
  imports: [CommonModule, SharedOverviewComponent],
  templateUrl: './view-questionAnswer.component.html',
  styleUrl: './view-questionAnswer.component.scss',
})
export class ViewQuestionAnswerComponent implements OnInit, OnDestroy {
  // Declaration Variables
  questionId: any;
  dataQuestion: any;
  dataLoading: boolean = false;
  questionnaireAnswerOptionID: any;
  subscription = new Subscription();
  entries: OverviewEntry[] = [
    { key: 'questionText', label: 'TEMPLATES.QUESTION_TEXT', type: 'text' },
    { key: 'answerText', label: 'QUESTION_ANSWER.ANSWER_TEXT', type: 'text' },
    {
      key: 'answerTextAr',
      label: 'QUESTION_ANSWER.ANSWER_TEXT_AR',
      type: 'text',
    },
    {
      key: 'displayOrder',
      label: 'QUESTION_ANSWER.DISPLAY_ORDER',
      type: 'number',
    },
    { key: 'score', label: 'QUESTION_ANSWER.SCORE', type: 'text' },
  ];

  // Declaration Constructor
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private QuestionAnswarOptionService: QuestionAnswarOptionService
  ) {}
  // Get Data
  getQuestionnaireAnswerOption() {
    this.dataLoading = true;
    this.questionnaireAnswerOptionID =
      this._ActivatedRoute.parent?.snapshot.params['answerId'];
    this.questionId = this._ActivatedRoute.parent?.snapshot.params['id'];
    if (!this.questionnaireAnswerOptionID) return;
    this.subscription =
      this.QuestionAnswarOptionService.getQuestionAnswerOptionById(
        this.questionnaireAnswerOptionID
      ).subscribe((res: any) => {
        this.dataLoading = false;
        this.dataQuestion = res?.data;
        this.setBreadCrumb();
      });
  }

  // handle breadCrumb()
  setBreadCrumb() {
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
        name: this._TranslateService.instant('TABS.QuestionnaireAnswerOption'),
        icon: '',
        routerLink: `/gfw-portal/questionnaire/ViewQuestion/${this.questionId}/QuestionnaireAnswer`,
      },
      {
        name: this.dataQuestion?.answerText,
        icon: '',
        routerLink: `/gfw-portal/questionnaire/${this.questionId}/view/${this.questionnaireAnswerOptionID}/overview`,
      },
    ]);
  }
  // Life Cycle Hooks
  ngOnInit(): void {
    this.getQuestionnaireAnswerOption();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
