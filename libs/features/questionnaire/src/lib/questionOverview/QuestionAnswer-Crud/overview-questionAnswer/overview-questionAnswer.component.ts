import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { SharedTabsComponent } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslateModule } from '@ngx-translate/core';
import { QuestionAnswarOptionService } from 'libs/features/questionnaire/src/Service/question-answar-option.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lib-overview-question-answer',
  imports: [
    CommonModule,
    RouterOutlet,
    SharedTabsComponent,
    SkeletonModule,
    TranslateModule,
  ],
  templateUrl: './overview-questionAnswer.component.html',
  styleUrl: './overview-questionAnswer.component.scss',
})
export class OverviewQuestionAnswerComponent implements OnInit, OnDestroy {
  // declaration Variables
  subscription = new Subscription();
  isLoading: boolean = false;
  data: any;
  id: any;
  // Declaration Contractor
  constructor(
    private QuestionAnswarOptionService: QuestionAnswarOptionService,
    private _ActivatedRoute: ActivatedRoute
  ) {}
  // Get Data
  getData() {
    this.isLoading = true;
    this.id = this._ActivatedRoute?.snapshot.params['answerId'];
    if (!this.id) return;
    this.subscription =
      this.QuestionAnswarOptionService.getQuestionAnswerOptionById(
        this.id
      ).subscribe((res: any) => {
        this.isLoading = false;
        this.data = res?.data;
      });
  }

  // Life Cycle Hooks
  ngOnInit(): void {
    this.getData();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
