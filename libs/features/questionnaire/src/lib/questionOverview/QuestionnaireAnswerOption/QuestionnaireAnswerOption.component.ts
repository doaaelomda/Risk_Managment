import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { QuestionService } from '../../../Service/question.service';
import { finalize, Subscription } from 'rxjs';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { QuestionAnswarOptionService } from '../../../Service/question-answar-option.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-questionnaire-answer-option',
  imports: [
    CommonModule,
    NewTableComponent,
    TranslateModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
  ],
  templateUrl: './QuestionnaireAnswerOption.component.html',
  styleUrl: './QuestionnaireAnswerOption.component.scss',
})
export class QuestionnaireAnswerOptionComponent implements OnInit, OnDestroy {
  // Iniliaze Variables
  questionId: any = '';
  loading: boolean = false;
  dataQuestion: any;
  actionDeleteVisible: boolean = false;
  isDeleting: boolean = false;
  action_items: any;
  answerOptionList: any[] = [];
  isLoading: boolean = true;
  payload_current: any;
  select_Question_Id: any;
  get columnControl() {
    return {
      type: 'route',
      data: `/gfw-portal/questionnaire/${this.questionId}/view`,
    }
  }

  paginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  private subscription: Subscription = new Subscription();

  // Iniliaze Contractor
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _QuestionService: QuestionService,
    private _router: Router,
    private _MessageService: MessageService,
    private _SharedService: SharedService,
    private QuestionAnswarOptionService: QuestionAnswarOptionService,
    public _PermissionSystemService:PermissionSystemService
  ) {}

  // handleBreadCrumb
  handleBreadCrumb() {
    this._ActivatedRoute?.parent?.paramMap.subscribe((res) => {
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
              },
            ]);
          });
        this.subscription.add(sub);
      }
    });
  }
  // handleActionList
  handleActionList() {
    this.action_items = [
      {
        label: this._TranslateService.instant('questionnaireAnswerOption.view'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._router.navigate([
            `gfw-portal/questionnaire/${this.questionId}/view/${this.select_Question_Id}`,
          ]);
        },
        visible: ()=>this._PermissionSystemService.can('QUESTIONNAIRES' , 'QUESTIONSQUESTIONNAIREANSWER' , 'VIEW')
      },
      {
        label: this._TranslateService.instant(
          'questionnaireAnswerOption.delete'
        ),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.actionDeleteVisible = true;
        },
        visible: ()=>this._PermissionSystemService.can('QUESTIONNAIRES' , 'QUESTIONSQUESTIONNAIREANSWER' , 'DELETE')
      },
      {
        label: this._TranslateService.instant(
          'questionnaireAnswerOption.update'
        ),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this._router.navigate([
            `/gfw-portal/questionnaire/${this.questionId}/updateQuestionAnswer/${this.select_Question_Id}`,
          ]);
        },
        visible: ()=>this._PermissionSystemService.can('QUESTIONNAIRES' , 'QUESTIONSQUESTIONNAIREANSWER' , 'EDIT')
      },
    ];
  }

  // method to handle close delete popup
  handleClosedDelete() {
    this.actionDeleteVisible = false;
  }
  // method to delete answerOption
  deleteQuestionAnswer() {
     if(!this._PermissionSystemService.can('QUESTIONNAIRES' , 'QUESTIONSQUESTIONNAIREANSWER' , 'DELETE')) return;

    this.isLoading = true;
    this.isDeleting = true;

    const del_sub = this.QuestionAnswarOptionService.delete(
      this.select_Question_Id
    )
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.isDeleting = false;
        })
      )
      .subscribe({
        next: () => {
          this.actionDeleteVisible = false;
          this._MessageService.add({
            severity: 'success',
            summary: this._TranslateService.instant('ATTACHMENT.successfully'),
            detail: this._TranslateService.instant(
              'questionnaireAnswerOption.deleteSuccess'
            ),
          });

          this.handleDataTable(this.payload_current);
        },
        error: () => {
          this.isLoading = false;
        },
      });
    this.subscription.add(del_sub);
  }

  // method to add answerOption
  addNewanswerOption() {
    this._router.navigate([
      `gfw-portal/questionnaire/${this.questionId}/addQuestionAnswer`,
    ]);
  }
  // method to handle show delete popup
  handleShowDelete() {
    this.actionDeleteVisible = true;
  }
  // method to set selected row
  setSelectedRow(event: any) {
    this.select_Question_Id = event;
  }
  // method to get payload and calling data table
  handleDataTable(payload: any = null) {
    this.payload_current = payload;
    this.getDataTable(payload);
  }
  // method to get data table
  getDataTable(payload: any) {
    this.isLoading = true;
    this.answerOptionList = [];
    const sub = this.QuestionAnswarOptionService.getDataTable(
      payload,
      this.questionId
    )
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          this.answerOptionList = res?.data?.items;
          this.paginationObj = {
            perPage: res?.data?.pageSize ,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount ,
            totalPages: res?.data?.totalPages,
          };
          this._SharedService.paginationSubject.next(this.paginationObj);
        },
      });
    this.subscription.add(sub);
  }
  // Life Cycle Hooks
  ngOnInit(): void {
    this.handleBreadCrumb();
    this.handleActionList();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
