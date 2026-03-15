import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { QuestionService } from '../../Service/question.service';
import { SharedTabsComponent } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { Subscription } from 'rxjs';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-question-overview',
  imports: [
    CommonModule,
    RouterOutlet,
    SkeletonModule,
    TranslateModule,
    SharedTabsComponent,
  ],
  templateUrl: './questionOverview.component.html',
  styleUrl: './questionOverview.component.scss',
})
export class QuestionOverviewComponent {
  // ====================== Declaration Variables ======================
  breadCrumbLinks: any;
  loadDataQuestions: boolean = false;
  private subscription: Subscription = new Subscription();
  tabs: any[] = [];
  active_tab = 1;
  questionsData: any;
  questionId: any;
  multiQuestionTypes = ['Multiple Choice', 'Checklist'];
  addition_tabs: any[] = [];
  // ====================== Declaration Contractor ======================
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _TranslateService: TranslateService,
    private _questionService: QuestionService,
    private _PermissionSystemService:PermissionSystemService
  ) {}

  // ====================== Lifecycle Hook ======================
  ngOnInit(): void {
    // Get question ID from route params
    const sub = this._ActivatedRoute.paramMap.subscribe((res) => {
      this.questionId = res.get('id');
      this.getByIdQuestion(); // Fetch question data after getting ID
    });
    this.subscription.add(sub);
  }

  // ====================== Fetch Question Data ======================
  getByIdQuestion(): void {
    this.loadDataQuestions = true;
    const sub = this._questionService
      .getQuestionById(this.questionId)
      .subscribe((res: any) => {
        this.questionsData = res?.data;
        this.loadDataQuestions = false;

        // Add Question Answer tab if question type is multi-choice
        const hasMultiChoices = this.multiQuestionTypes.includes(
          res?.data?.questionTypeName
        );

        console.log(this.questionsData,'this.questionsData');
        

        if (hasMultiChoices) {
          this.addition_tabs = [
            {
              id: 5,
              name: 'TABS.QuestionnaireAnswerOption',
              icon: 'fi fi-rr-question-square',
              router: 'QuestionnaireAnswer',
              visible: ()=>this._PermissionSystemService.can('QUESTIONNAIRES' , 'QUESTIONSQUESTIONNAIREANSWER' , 'VIEW')

            },
          ];
        }
      });

    this.subscription.add(sub);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
