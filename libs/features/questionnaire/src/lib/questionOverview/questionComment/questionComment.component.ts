import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';
import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../../Service/question.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lib-question-comment',
  imports: [CommonModule, CommentSectionComponent],
  templateUrl: './questionComment.component.html',
  styleUrl: './questionComment.component.scss',
})
export class QuestionCommentComponent implements OnDestroy
 {
  // Declaration Variables
  questionId: any;
  dataQuestion: any;
  loading: boolean = false;
  private subscription: Subscription = new Subscription();
   // Declaration Constractor
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _QuestionService: QuestionService,
  ) {
    this.handleBreadCrumb()
  }
  // Handle BreadCrumb
  handleBreadCrumb(){
      this._ActivatedRoute?.parent?.paramMap.subscribe((res) => {
      this.questionId = res.get('id');
      this.loading = true;

      if (this.questionId) {
        const sub =this._QuestionService
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
              { name: this.dataQuestion?.questionText || '-', icon: '',routerLink:`/gfw-portal/questionnaire/ViewQuestion/${this.questionId}/overview` },
              {
                name: this._TranslateService.instant('TABS.COMMENTS'),
                icon: '',
              },
            ]);
          });
          this.subscription.add(sub)
      }
    });
  }

  // OnDestroy
    ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

}
