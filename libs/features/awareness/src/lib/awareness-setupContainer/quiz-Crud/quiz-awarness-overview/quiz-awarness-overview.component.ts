// eslint-disable-next-line @nx/enforce-module-boundaries
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AwarenessService } from 'libs/features/awareness/src/services/awareness.service';
import { SharedTabsComponent } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-quiz-awarness-overview',
  imports: [    CommonModule,
    RouterOutlet,
    SkeletonModule,
    TranslateModule,SharedTabsComponent],
  templateUrl: './quiz-awarness-overview.component.html',
  styleUrl: './quiz-awarness-overview.component.scss',
})
export class QuizAwarnessOverviewComponent {
  loadDataQuestions: boolean = false;
  tabs: any[] = [];
  questionsData: any;
  active_tab = 1;
  questionId: any;

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _TranslateService: TranslateService,
    private _AwarenessService: AwarenessService,
    private _PermissionSystemService:PermissionSystemService
  ) {
    this.tabs = [
      {
        id: 2,
        name: this._TranslateService.instant('TEMPLATES.QUESTION'),
        icon: 'fi fi-rr-interrogation',
        router: 'question-quiz',
        visible: ()=> this._PermissionSystemService.can('AWARNESS', 'QUIZQUESTIONLIST', 'VIEW')
      },
    ];

    this._ActivatedRoute.paramMap.subscribe((res) => {
      this.questionId = res.get('quizId');
    });

    this.getByIdQuestion();
  }

  getByIdQuestion() {
    this.loadDataQuestions = true;
    this._AwarenessService
      .getQuizById(this.questionId)
      .subscribe((res: any) => {
        this.questionsData = res?.data;
        this.loadDataQuestions = false;
      });
  }
}
