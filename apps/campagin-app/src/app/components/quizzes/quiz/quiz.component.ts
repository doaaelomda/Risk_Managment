import { SkeletonModule } from 'primeng/skeleton';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { ProgressBarModule } from 'primeng/progressbar';

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IStep } from '../../../types/step.interface';
import { IQuestion } from '../../../types/question.interface';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CampaignService } from '../../../services/campaign.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IQuizSubmission } from '../../../types/quizSubmission.interface';
import dateHandler from '../../../shared/utils/dateHandler';
import { finalize } from 'rxjs';
import { SharedFileViewerComponent } from '../../../shared/components/shared-file-viewer/shared-file-viewer.component';
import { IFile } from '../../../types/file.interface';
@Component({
  selector: 'app-quiz',
  imports: [
    CommonModule,
    SharedFileViewerComponent,
    FormsModule,
    CheckboxModule,
    Button,
    ProgressBarModule,
    CalendarModule,
    RadioButtonModule,
    InputTextModule,
    InputNumberModule,
    TranslateModule,
    SkeletonModule,
  ],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
})
export class QuizComponent {
  constructor(
    private translateService: TranslateService,
    private campaignService: CampaignService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.paginateQuestions();
    this.initQuizResults();
  }
  campaign_id!: number;
  ngOnInit() {
    this.language = localStorage.getItem('user-language') || 'en';
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.campaign_id = +id;

    this.getCampaignDetails();
  }
  initSteps(hasQuizzes: boolean = false) {
    this.steps = [
      {
        id: 1,
        title: this.translateService.instant(
          'QUIZ.REVIEW_MATERIAL_CONFIRMATION'
        ),
        description: this.translateService.instant(
          'QUIZ.ADD_NEW_CONTROL_COMPLIANCE'
        ),
      },
    ];
    if (hasQuizzes) {
      this.steps.push({
        id: 2,
        title: this.translateService.instant('QUIZ.QUIZ'),
        description: this.translateService.instant('QUIZ.COMPANY_DETAILS'),
      });
    }
    this.steps.push({
      id: 3,
      title: this.translateService.instant('QUIZ.CONFIRMATION'),
      description: this.translateService.instant('QUIZ.START_COLLABORATING'),
    });
  }

  initQuizResults() {
    this.passedQuiz = {
      title: this.translateService.instant('QUIZ.QUIZ_PASSED_TITLE'),
      note: this.translateService.instant('QUIZ.QUIZ_PASSED_DESC'),
      icon: '/images/passed-icon.svg',
      alt: 'passed__icon',
    };

    this.failedQuiz = {
      title: this.translateService.instant('QUIZ.QUIZ_INCOMPLETE'),
      note: this.translateService.instant('QUIZ.QUIZ_INCOMPLETE_DESC'),
      icon: '/images/failed-icon.svg',
      alt: 'failed__icon',
    };
  }

  confirmReading() {
    this.campaignService.confirmRead(this.campaign_id).subscribe({
      next: () => {
        //
      },
      error: () => {
        this.router.navigate(['/campaigns']);
      },
    });
  }

  language!: string;
  activeStep!: number;
  setActiveStep(step: number, fetchNewQuestions: boolean = true) {
    if (step === 2 && fetchNewQuestions) {
      this.getQuizQuestions(step);
    } else {
      this.activeStep = step;
    }
  }

  getQuizQuestions(step: number) {
    this.campaignService.getQuizQuestions(this.campaign_id).subscribe({
      next: (res) => {
        console.log(res, 'got quiz questions');
        this.activeStep = step;
        this.questions = res.data.questions;
        this.totalQuestions = res.data.questions;
        this.quizId = res.data.awarenessQuizID;
      },
    });
  }

  steps: IStep[] = [];
  singleTypes: string[] = ['Rating (1–5)', 'Yes / No'];
  multiTypes: string[] = ['Multiple Choice', 'Checklist'];
  stringTypes: string[] = ['Text / Comment'];
  numberTypes: string[] = ['Numeric Value'];
  dateTypes: string[] = ['Date Picker'];
  totalQuestions: IQuestion[] = [];
  questions: IQuestion[] = [];
  answeredQuestions: IQuestion[] = [];
  progress: number = 0;
  currentPage: number = 1;
  totalPages!: number;
  paginateQuestions() {
    const perPage = 2;
    this.totalPages = Math.ceil(this.totalQuestions.length / perPage);
    const start = (this.currentPage - 1) * perPage;
    const end = start + perPage;
    this.questions = this.totalQuestions.slice(start, end);
  }
  cannotProceed() {
    return (
      this.questions.some((q) => {
        if (q.options && this.multiTypes.includes(q.type)) {
          return !q.options.some((option) => option.checked);
        } else {
          return !q.answer;
        }
      }) || !this.totalQuestions.length
    );
  }
  calculatingQuizPoints: boolean = false;
  proceedQuiz() {
    if (this.cannotProceed()) return;
    const atLastPage = this.currentPage >= this.totalPages;
    const isDone: boolean =
      this.answeredQuestions.length >= this.totalQuestions.length;
    if (!isDone) {
      this.answeredQuestions = [...this.answeredQuestions, ...this.questions];
    }

    if (!atLastPage) {
      this.currentPage++;
      this.paginateQuestions();
    } else {
      const questions = this.answeredQuestions
        .filter((q) => !!q.answer)
        .map((q) => {
          const isADate = q.type === 'Date Picker';

          return {
            questionId: q.awarenessQuizQuestionID,
            answer: isADate
              ? dateHandler(q.answer as Date)
              : q.answer!.toString(),
          };
        });
      console.log(questions, 'questions here');

      const payload: IQuizSubmission = {
        questions,
        campaignId: this.campaign_id,
        quizId: this.quizId,
      };

      this.calculatingQuizPoints = true;
      this.campaignService
        .submitQuiz(payload)
        .pipe(finalize(() => (this.calculatingQuizPoints = false)))
        .subscribe({
          next: (res) => {
            console.log(res, ' submitted quiz');
            this.passed = res.data.passed;
            this.setActiveStep(3);
          },
        });
    }
    const progress = Math.round(
      (this.answeredQuestions.length / this.totalQuestions.length) * 100
    );
    this.progress = progress;

    console.log('answeredQuestions: ', this.answeredQuestions);
  }

  passedQuiz: { title: string; note: string; icon: string; alt: string } = {
    title: 'Great you Passed the quiz',
    note: 'You have successfully completed the training for this campaign please confirm you have read and understood',
    icon: '/images/passed-icon.svg',
    alt: 'passed__icon',
  };

  failedQuiz: { title: string; note: string; icon: string; alt: string } = {
    title: 'Quiz Incomplete',
    note: 'Please review the campign materials to improve your score and try again',
    icon: '/images/failed-icon.svg',
    alt: 'failed__icon',
  };

  getQuizResult() {
    const result = this.passed ? this.passedQuiz : this.failedQuiz;
    return result;
  }
  confirmed: boolean = false;
  passed: boolean = false;
  confirm() {
    this.router.navigate(['/campaigns']);
  }
  reviewMaterial() {
    this.setActiveStep(1);
    this.resetQuestions();
  }
  resetQuestions() {
    this.totalQuestions = [];
    this.questions = [];
    this.answeredQuestions = [];
    this.progress = 0;
  }
  tryAgain() {
    this.setActiveStep(2, false);
  }
  quizId!: number;
  files!: IFile[];

  hasQuizzes: boolean = false;
  getCampaignDetails() {
    if (!this.campaign_id) throw new Error(' No Campaign id found. ');
    this.campaignService.getCampaignDetails(this.campaign_id).subscribe({
      next: (res) => {
        console.log(res, 'got campaign details...');
        const {
          govDocumentID,
          currentGovDocumentVersionID,
          hasQuizzes,
          awarenessCampaignID,
        } = res.data;

        this.hasQuizzes = hasQuizzes;
        if (govDocumentID) {
          this.searchFiles(govDocumentID, currentGovDocumentVersionID);
        } else {
          this.getFiles(awarenessCampaignID, 74);
        }

        this.initSteps(hasQuizzes);
      },
    });
  }

  searchFiles(dataEntityId: number, dataEntityTypeId: number) {
    this.campaignService.searchFiles(dataEntityId, dataEntityTypeId).subscribe({
      next: (files) => {
        console.log(files, 'got files');
        this.files = [files.data.items[0]];
        console.log(this.files, 'file');
        this.setActiveStep(1);
        this.confirmReading();
      },
    });
  }

  getFiles(dataEntityId: number, dataEntityTypeId: number) {
    this.campaignService.getFiles(dataEntityId, dataEntityTypeId).subscribe({
      next: (files) => {
        console.log(files, 'got files');
        this.files = files.data;
        console.log(this.files, 'file');
        this.setActiveStep(1);
        this.confirmReading();
      },
    });
  }
}
