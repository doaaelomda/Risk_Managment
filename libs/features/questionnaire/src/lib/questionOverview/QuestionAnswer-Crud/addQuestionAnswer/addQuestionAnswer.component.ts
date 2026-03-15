import { answer } from './../../../../../../../../apps/Questionnaire/src/models/answers.interface';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { QuestionAnswarOptionService } from 'libs/features/questionnaire/src/Service/question-answar-option.service';
import { QuestionService } from 'libs/features/questionnaire/src/Service/question.service';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TextareaUiComponent } from '@gfw/shared-ui';
import { Subscription } from 'rxjs';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-add-question-answer',
  imports: [
    CommonModule,
    InputNumberComponent,
    TranslateModule,
    ReactiveFormsModule,
    ButtonModule,
    RouterLink,
    TextareaUiComponent,
  ],
  templateUrl: './addQuestionAnswer.component.html',
  styleUrl: './addQuestionAnswer.component.scss',
})
export class AddQuestionAnswerComponent implements OnInit, OnDestroy {
  questionId: any = '';
  questionnaireAnswerOptionID: any;
  loading: boolean = false;
  dataQuestion: any;
  actionDeleteVisible: boolean = false;
  isDeleting: boolean = false;
  action_items: any;
  answerOptionList: any[] = [];
  isLoading: boolean = false;
  current_control_answerOption_payload: any;
  select_Question_Id: any;
  validationsRequired: any[] = [
    { key: 'required', message: 'VALIDATIONS.REQUIRED' },
  ];
  form!: FormGroup;
  subscription!: Subscription;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _QuestionService: QuestionService,
    private _router: Router,
    private _messageS: MessageService,
    private _MessageService: MessageService,
    private _SharedService: SharedService,
    private QuestionAnswarOptionService: QuestionAnswarOptionService,
    private _PermissionSystemService:PermissionSystemService
  ) {}

  handleBreadCrumb() {
    ;
    this.questionId = this._ActivatedRoute.snapshot.params['id'];
    this.loading = true;

    if (this.questionId) {
      this.subscription = this._QuestionService
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
              routerLink: `/gfw-portal/questionnaire/ViewQuestion/${this.questionId}/QuestionnaireAnswer`,
            },
            {
              name: this._TranslateService.instant(
                'questionnaireAnswerOption.addNewButton'
              ),
              icon: '',
              routerLink: '',
            },
          ]);
        });
    }
  }

  // initial form
  initForm(data?: any) {
    this.form = new FormGroup({
      questionnaireQuestionID: new FormControl(
        data?.questionnaireQuestionID ?? this.questionId
      ),
      answerText: new FormControl(data?.answerText, [Validators.required]),
      answerTextAr: new FormControl(data?.answerTextAr),
      score: new FormControl(data?.score),
      displayOrder: new FormControl(data?.displayOrder, [Validators.required]),
    });
  }

  submit() {
        const canAdd = this._PermissionSystemService.can('QUESTIONNAIRES' , 'QUESTIONSQUESTIONNAIREANSWER' , 'ADD') 
    const canEdit = this._PermissionSystemService.can('QUESTIONNAIRES' , 'QUESTIONSQUESTIONNAIREANSWER' , 'EDIT') 
    if(this.questionnaireAnswerOptionID && !canEdit)return
    if(!this.questionnaireAnswerOptionID && !canAdd)return
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;

    const data = this.form.value;
    const msg = this.questionnaireAnswerOptionID ? 'updated' : 'added';
    if (this.questionnaireAnswerOptionID) {
      data.questionnaireAnswerOptionID = this.questionnaireAnswerOptionID;
    }
    this.subscription = this.QuestionAnswarOptionService.save(
      data,
      this.questionnaireAnswerOptionID
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this._messageS.add({
          severity: 'success',
          summary: 'Success',
          detail: `Answer ${msg} successfully`,
        });
        this._router.navigate([
          `gfw-portal/questionnaire/ViewQuestion/${this.questionId}/QuestionnaireAnswer`,
        ]);
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
  // get question answer option
  getQuestionnaireAnswerOption() {
    ;
    this.questionnaireAnswerOptionID =
      this._ActivatedRoute.snapshot.params['answerId'];
    if (!this.questionnaireAnswerOptionID) return;
    this.QuestionAnswarOptionService.getQuestionAnswerOptionById(
      this.questionnaireAnswerOptionID
    ).subscribe((res: any) => {
      this.dataQuestion = res?.data;
      this.initForm(res?.data)
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
          name:this.dataQuestion ?.answerText
        },
      ]);
    });
  }
  // Life Cycle Hooks
  ngOnInit(): void {
    this.handleBreadCrumb();
    this.initForm();
    this.getQuestionnaireAnswerOption();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
