import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { QuestionService } from '../../../Service/question.service';
import {
  OverviewEntry,
  SharedOverviewComponent,
} from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';
import { Subscription } from 'rxjs';
@Component({
  selector: 'lib-question-view',
  imports: [
    CommonModule,
    SkeletonModule,
    TranslateModule,
    SharedOverviewComponent,
  ],
  templateUrl: './questionView.component.html',
  styleUrl: './questionView.component.scss',
})
export class QuestionViewComponent implements OnDestroy {
  // Declaration Variables
  questionId: any;
  dataQuestion: any;
  loading: boolean = false;
  entries: OverviewEntry[] = [
    { key: 'questionText', label: 'QUESTION.TEXT', type: 'text' },
    { key: 'questionTextAr', label: 'QUESTION.TEXT_AR', type: 'text' },
    { key: 'questionTypeName', label: 'QUESTION.TYPE', type: 'text' },
    { key: 'isRequired', label: 'QUESTION.IS_REQUIRED', type: 'boolean' },
    { key: 'weight', label: 'QUESTION.WEIGHT', type: 'number' },
    { key: 'questionnaireQuestionCategoryName', label: 'RISK_VIEW.CATEGORY', type: 'text' },
    { key: 'organizationalUnitName', label: 'NEW_CONTROL.fields.OrganizationalUnitID.label', type: 'text' },
  ];
  private subscription: Subscription = new Subscription();

  // Declaration Constructor
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _QuestionService: QuestionService
  ) {
    this.getData();
  }

  // get Data Question
  getData() {
    const sub = this._ActivatedRoute?.parent?.paramMap.subscribe((res) => {
      this.questionId = res.get('id');
      this.loading = true;
      if (this.questionId) {
        const sub = this._QuestionService
          .getQuestionById(this.questionId)
          .subscribe((res: any) => {
            this.dataQuestion = res?.data;
            this.loading = false;
            this._LayoutService.breadCrumbLinks.next([
              { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
              {
                name: this._TranslateService.instant(
                  'BREAD_CRUMB_TITLES.QUESTION_LIST'
                ),
                icon: '',
                routerLink: '/gfw-portal/questionnaire/questions-list',
              },
              { name: this.dataQuestion?.questionText || '-', icon: '' },
            ]);
          });
          this.subscription.add(sub);
      }
    });
    this.subscription.add(sub);
  }
  // On OnDestroy
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
