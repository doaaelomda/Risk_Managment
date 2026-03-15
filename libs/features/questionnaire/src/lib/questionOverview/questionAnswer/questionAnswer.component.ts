import { CardsListComponent } from 'libs/shared/shared-ui/src/lib/cards-list/cards-list.component';
import { TagComponent } from 'libs/shared/shared-ui/src/lib/tag/tag.component';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { QuestionService } from '../../../Service/question.service';
import { CommonModule } from '@angular/common';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SkeletonModule } from 'primeng/skeleton';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { Button } from 'primeng/button';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { DialogModule } from 'primeng/dialog';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-question-answer',
  imports: [
    CommonModule,
    TranslateModule,
    CardsListComponent,
    DialogModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    InputTextComponent,
    Button,
    DeleteConfirmPopupComponent,
    SkeletonModule,
    InputNumberComponent,
  ],
  templateUrl: './questionAnswer.component.html',
  styleUrl: './questionAnswer.component.scss',
})
export class QuestionAnswerComponent {
  answerId: any;
  loadDeleted: unknown;
  handleClosedDelete($event: boolean) {
    throw new Error('Method not implemented.');
  }
  deleteQuestionAnswer() {
    this.deleteQuestion = true;
  }
  closeDeleteModal() {
    this.deleteQuestion = false;
  }
  qaId: any = '';
  item_actions: any[] = [];
  data_list: any[] = [];
  selectedAnswer: any = '';
  loadingList: boolean = false;
  addingAnswer: boolean = false;
  viewingAnswer: boolean = false;
  loadingViewedData: boolean = false;
  loadingBtn: boolean = false;
  viewed_data: any;
  answerForm!: FormGroup;
  deleteQuestion: boolean = false;
  questionAnsweId: any;
  validationsRequired: any[] = [
    { key: 'required', message: 'VALIDATIONS.REQUIRED' },
  ];
  dataQuestion:any
  constructor(
    private _QuestionService: QuestionService,
    private _messageS: MessageService,
    private _activatedR: ActivatedRoute,
    private _translateS: TranslateService,
    private _router: Router,
    private _layoutS: LayoutService,
    public _PermissionSystemService:PermissionSystemService
  ) {}

  ngOnInit() {
    this.initForm();
    this.getQaId();

    this.item_actions = [
      {
        label: this._translateS.instant('QUESTION_ANSWER.VIEW_ANSWER'),
        command: () => {
          this.viewingAnswer=true
          this.getAnswerById(this.selectedAnswer?.questionnaireAnswerOptionID);
        },
        visible: ()=>this._PermissionSystemService.can('QUESTIONNAIRES' , 'QUESTIONSQUESTIONNAIREANSWER' , 'VIEW')

      },
      {
        label: this._translateS.instant('QUESTION_ANSWER.EDIT_ANSWER'),
        command: () => {
          this.qaId = this.selectedAnswer?.questionnaireQuestionID ?? this.qaId;
          this.questionAnsweId =
            this.selectedAnswer?.questionnaireAnswerOptionID;
          this.addingAnswer = true;
          this.initForm(this.selectedAnswer);
        },
        visible: ()=>this._PermissionSystemService.can('QUESTIONNAIRES' , 'QUESTIONSQUESTIONNAIREANSWER' , 'EDIT')

      },
      {
        label: this._translateS.instant('QUESTION_ANSWER.DELETE_ANSWER'),
        command: () => {
          this.deleteQuestionAnswer();
          // this.deleteAnswer(this.selectedAnswer?.questionAnswerID);
        },
        visible: ()=>this._PermissionSystemService.can('QUESTIONNAIRES' , 'QUESTIONSQUESTIONNAIREANSWER' , 'DELETE')

      },
    ];
  }

  getQaId() {
  this._activatedR.parent?.paramMap.subscribe((params) => {
    this.qaId = params.get('id');
    if (!this.qaId) return;
    this._QuestionService.getQuestionById(this.qaId).subscribe((res: any) => {
      this.dataQuestion = res?.data;
      this._layoutS.breadCrumbLinks.next([
        { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
        {
          name: this._translateS.instant('BREAD_CRUMB_TITLES.QUESTION_LIST'),
          icon: '',
          routerLink: '/gfw-portal/questionnaire/questions-list',
        },
        {
          name: res.data.questionText,
          icon: '',
          routerLink: `/gfw-portal/questionnaire/ViewQuestion/${this.qaId}`,
        },
        {
          name: this._translateS.instant('QUESTION_ANSWER.ANSWERS'),
          icon: '',
        },
      ]);

      this.getAnswers()
    });
  });
}

  setSelected(event: any) {
    console.log(event,'selected');

    this.selectedAnswer = event;
  }

  initForm(data?: any) {
    this.answerForm = new FormGroup({
      questionnaireQuestionID: new FormControl(
        data?.questionnaireQuestionID ?? this.qaId
      ),
      answerText: new FormControl(data?.answerText, [Validators.required]),
      answerTextAr: new FormControl(data?.answerTextAr),
      score: new FormControl(data?.score),
      displayOrder: new FormControl(data?.displayOrder, [
        Validators.required,
      ]),
    });
  }

  handleAddAnswerClick() {
    this.addingAnswer = true;
    this.initForm();
  }

  getAnswers() {
    this.loadingList = true;
    this._QuestionService.getQuestionAnswer().subscribe((res: any) => {
      this.loadingList = false;
      this.data_list = res?.data;
      // this.data_list = items.map((i: any) => {
      //   return {
      //     ...i,
      //     id: i?.questionnaireAnswerOptionID,
      //     icon: 'fi fi-rr-interrogation',
      //     title: i?.answerText,
      //     sub: i?.questionText,
      //   };
      // });
    });
  }

  getAnswerById(id: any) {
    if (!id) return;
    this.loadingViewedData = true;
    this._QuestionService.getQuestionAnswerById(id).subscribe((res: any) => {
      this.viewed_data = { ...res?.data };
      this.viewingAnswer = true;
      this.loadingViewedData = false;
    });
  }

  submit() {
        const canAdd = this._PermissionSystemService.can('QUESTIONNAIRES' , 'QUESTIONSQUESTIONNAIREANSWER' , 'ADD') 
    const canEdit = this._PermissionSystemService.can('QUESTIONNAIRES' , 'QUESTIONSQUESTIONNAIREANSWER' , 'EDIT') 
    if(this.questionAnsweId && !canEdit)return
    if(!this.questionAnsweId && !canAdd)return

    if (!this.answerForm.valid) return;
    this.loadingBtn = true;

    const data = this.answerForm.value;
    const msg = this.questionAnsweId ? 'updated' : 'added';
    if (this.questionAnsweId) {
      data.questionnaireAnswerOptionID = this.questionAnsweId;
    }
    this._QuestionService
      .saveQuestionAnswer(data, this.questionAnsweId)
      .subscribe({
        next: () => {
          this.loadingBtn = false;
          this.addingAnswer = false;
          this.getAnswers();
          this._messageS.add({
            severity: 'success',
            summary: 'Success',
            detail: `Answer ${msg} successfully`,
          });
        },
        error: () => {
          this.loadingBtn = false;
        },
      });
  }

  deleteAnswer() {
     if(!this._PermissionSystemService.can('QUESTIONNAIRES' , 'QUESTIONSQUESTIONNAIREANSWER' , 'DELETE')) return;

    this.loadDeleted = true
    this._QuestionService
      .deleteQuestionAnswer(this.selectedAnswer?.questionnaireAnswerOptionID)
      .subscribe({
        next:(res) => {
        this.getAnswers();
        this.loadDeleted = false
        this.deleteQuestion = false;
        this._messageS.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Answer deleted successfully',
        });
      },
      error:(err) => this.loadDeleted = false
      });
  }
    onViewModal(event?: any) {
      this.viewingAnswer = true;
      this.getAnswerById(
        this.selectedAnswer?.questionnaireAnswerOptionID
          ? this.selectedAnswer?.questionnaireAnswerOptionID
          : event?.questionnaireAnswerOptionID
      );
  }
}
