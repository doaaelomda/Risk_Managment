import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize, forkJoin, Observable, of, take } from 'rxjs';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AwarenessService } from 'libs/features/awareness/src/services/awareness.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DeleteConfirmPopupComponent, SharedUiComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-question-quiz',
  imports: [
    CommonModule,
    TranslateModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    InputNumberComponent,
    InputTextComponent,
    InputNumberComponent,
    NewTableComponent,
  ],
  templateUrl: './QuestionQuiz.component.html',
  styleUrl: './QuestionQuiz.component.scss',
})
export class QuestionQuizComponent {
  quizId: any;
  dataQuestion: any;
  loading: boolean = false;
  riskId = 1;
  riskChildId: any;
  compaginId: any;
  question_form!: FormGroup;
  current_update_id: any = null;
  showQuizPopup = false;
  isLoading = false;
  current_row_selected: any;
  dataTable: any[] = [];
  loadingTable = true;
  loadDeleted = false;
  items: any[] = [];
  quizColumns: any[] = [];
  selected_profile_column = 0;
  defaultProfile: any;
  paginationObj: any = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  current_filters: any[] = [];
  sort_data: any;
  actionDeleteVisible: boolean = false;
  validationsRequired = [{ key: 'required', message: 'VALIDATIONS.REQUIRED' }];
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _AwarenessService: AwarenessService,
    private _MessageService: MessageService,
    private _Router: Router,
    private _SharedService: SharedService,
    public _PermissionSystemService: PermissionSystemService
  ) {
    this._ActivatedRoute?.parent?.paramMap
      .pipe(take(1))
      .subscribe((params: any) => {
        this.quizId = params.get('quizId');
        this.compaginId = params.get('id');
        this.loading = true;

        const quiz$ = this.quizId
          ? this._AwarenessService.getQuizById(this.quizId)
          : of({ data: { name: '-' } });

        const campaign$ = this.compaginId
          ? this._AwarenessService.getCampaignById(this.compaginId)
          : of({ data: { name: '-' } });

        forkJoin([quiz$, campaign$]).subscribe(
          ([quizRes, campaignRes]: any) => {
            this.dataQuestion = quizRes?.data || { name: '-' };
            const campaignData = campaignRes?.data || { name: '-' };
            this.loading = false;

            const breadcrumbLinks = [
              { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
              {
                name: this._TranslateService.instant('AWARENESS.TITLE'),
                icon: '',
                routerLink: '/gfw-portal/awareness/campaign-list',
              },
              {
                name: this._SharedService.truncateWords(campaignData.name, 3),
                icon: '',
                routerLink: `/gfw-portal/awareness/compagine-setup/${this.compaginId}/overview`,
              },
              {
                name: this._TranslateService.instant('QUIZ.TITLE'),
                icon: '',
                routerLink: `/gfw-portal/awareness/compagine-setup/${this.compaginId}/Quiz`,
              },
              {
                name: this._SharedService.truncateWords(
                  this.dataQuestion.name,
                  3
                ),
                icon: '',
                routerLink: `/gfw-portal/awareness/compagine-setup/${this.compaginId}/Quiz/${this.quizId}/overview`,
              },
              {
                name: this._TranslateService.instant('TEMPLATES.QUESTION'),
                icon: '',
              },
            ];

            this.columnControl = {
              type: 'route',
              data: `/gfw-portal/awareness/compagine-setup/${this.compaginId}/Quiz/${this.quizId}/question-quiz/`,
            };
            this._LayoutService.breadCrumbLinks.next(breadcrumbLinks);
          }
        );
      });
  }

  // quizId/:id/QuestionQuiz/:quizId
  ngOnInit(): void {
    this.items = [
      {
        label: this._TranslateService.instant('AWARENESS_QUESTION.VIEW'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._Router.navigate([
            `/gfw-portal/awareness/compagine-setup/${this.compaginId}/Quiz/${this.quizId}/question-quiz/${this.current_row_selected}`,
          ]);
        },
        visible: () =>
          this._PermissionSystemService.can('AWARNESS', 'QUIZQUESTION', 'VIEW'),
      },
      {
        label: this._TranslateService.instant('AWARENESS_QUESTION.UPDATE'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this.showQuizPopup = true;
          this._AwarenessService
            .getQuestionQuizById(this.current_row_selected)
            .subscribe((res: any) => {
              this.current_update_id = res?.data?.awarenessQuizquizId;
              this.initForm(res?.data);
            });
        },
        visible: () =>
          this._PermissionSystemService.can('AWARNESS', 'QUIZQUESTION', 'EDIT'),
      },
      {
        label: this._TranslateService.instant('AWARENESS_QUESTION.DELETE'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.handleShowDelete(true);
        },
        visible: () =>
          this._PermissionSystemService.can('AWARNESS', 'QUIZQUESTION', 'DELETE'),
      },
    ];
    this.initForm();
  }

  initForm(data?: any) {
    this.question_form = new FormGroup({
      questionText: new FormControl(data?.questionText, Validators.required),
      questionTextAr: new FormControl(data?.questionTextAr),
      points: new FormControl(data?.points),
    });
  }

  submit() {

                    // ===== Permissions =====
  const hasPermission = this.current_update_id
    ? this._PermissionSystemService.can('AWARNESS', 'QUIZQUESTION', 'EDIT')
    : this._PermissionSystemService.can('AWARNESS', 'QUIZQUESTION', 'ADD');

  if (!hasPermission) {
    return;
  }
    if (this.question_form.invalid) {
      this.question_form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const req = {
      ...this.question_form.value,
      awarenessQuizID: this.quizId,
    };

    let request$: Observable<any>;
    if (this.current_update_id) {
      req.awarenessQuizquizId = this.current_update_id;
      request$ = this._AwarenessService.updateQuestionQuiz(req);
    } else {
      request$ = this._AwarenessService.addQuestionQuiz(req);
    }

    request$.pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: () => {
        this._MessageService.add({
          severity: 'success',
          detail: this.current_update_id
            ? this._TranslateService.instant(
                'AWARENESS_QUESTION.UPDATED_SUCCESS'
              )
            : this._TranslateService.instant(
                'AWARENESS_QUESTION.ADDED_SUCCESS'
              ),
        });
        this.showQuizPopup = false;
        this.getQuestionQuizList(this.data_payload);
        this.question_form.reset();
      },
    });
  }

  handleShowDelete(event: boolean) {
    this.actionDeleteVisible = event;
  }

  handleClosedDelete(event: boolean) {
    this.actionDeleteVisible = false;
  }

  deleteQuestionQuiz() {
    if (!this._PermissionSystemService.can('AWARNESS', 'QUIZQUESTION', 'DELETE'))
      return;

    this.loadDeleted = true;
    this._AwarenessService
      .deleteQuestionQuiz(this.current_row_selected)
      .subscribe({
        next: () => {
          this.loadDeleted = false;
          this._MessageService.add({
            severity: 'success',
            detail: this._TranslateService.instant(
              'AWARENESS_QUESTION.DELETED_SUCCESS'
            ),
          });
          this.actionDeleteVisible = false;
          this.getQuestionQuizList(this.data_payload);
        },
        error: () => {
          this.loadDeleted = false;
          this._MessageService.add({
            severity: 'error',
            detail: this._TranslateService.instant(
              'AWARENESS_QUESTION.DELETED_FAILED'
            ),
          });
        },
      });
  }

  onModalClose() {
    this.question_form.reset();
  }

  setSelected(event: any) {
    this.current_row_selected = event;
  }
  getQuestionQuizList(event?: any) {
    this.dataTable = [];
    this.loadingTable = true;
    this._AwarenessService
      .getQuestionQuizList(
        this.sort_data,
        event?.currentPage ?? 1,
        event?.perPage ?? 10,
        this.current_filters,
        this.compaginId,
        this.quizId
      )
      .pipe(finalize(() => (this.loadingTable = false)))
      .subscribe({
        next: (res: any) => {
          this.dataTable = res?.data?.items;
          this.paginationObj = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this._SharedService.paginationSubject.next(this.paginationObj);
        },
        error: () => {
          this.loadingTable = false;
        },
      });
  }
  data_payload: any;

  columnControl: any;

  handleDataTable(event: any) {
    this.data_payload = event;
    this.getQuestionQuizList(event);
  }
}
