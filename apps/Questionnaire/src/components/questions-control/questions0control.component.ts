import { EditAttachmentComponent } from './../../../../../libs/shared/shared-ui/src/lib/editAttachment/editAttachment.component';
import { ViewAttachementComponent } from './../../../../../libs/shared/shared-ui/src/lib/view-attachement/view-attachement.component';
import { NewAttachListComponent } from './../../../../../libs/shared/shared-ui/src/lib/new-attach-list/new-attach-list.component';
import { CommentSectionComponent } from './../../../../../libs/shared/shared-ui/src/lib/comment-section/comment-section.component';

import { CalendarModule } from 'primeng/calendar';
import { Component, input, output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Section } from '../../models/sections.interface';
import { Question } from '../../models/questions.interface';
import { CheckboxModule } from 'primeng/checkbox';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { AuthService } from '../../services/auth.service';
import { DeleteConfirmPopupComponent } from "libs/shared/shared-ui/src/lib/delete-confirm-popup/delete-confirm-popup.component";
@Component({
  selector: 'app-questions0control',
  imports: [
    CommonModule,
    RadioButtonModule,
    CheckboxModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    InputNumberModule,
    InputTextModule,
    CalendarModule,
    CommentSectionComponent,
    NewAttachListComponent,
    ViewAttachementComponent,
    EditAttachmentComponent,
    DeleteConfirmPopupComponent
],
  templateUrl: './questions0control.component.html',
  styleUrl: './questions0control.component.scss',
})
export class Questions0controlComponent {
  currentToken!:string | null
  constructor(
    private _questionnaireS: QuestionnaireService,
    private _translateS: TranslateService,
    private messageService: MessageService,
    private router: Router,
    private _sharedService: SharedService,
    private authService: AuthService
  ) {
    this.currentToken = localStorage.getItem('accessKey')
    this.steps = [
      {
        id: 1,
        name: this._translateS.instant('QUESTIONNAIRE.ANSWER'),
        icon: 'fi fi-rr-ballot-check',
      },
      {
        id: 2,
        name: this._translateS.instant('QUESTIONNAIRE.ATTACHMENTS'),
        icon: 'fi fi-rr-clip-file',
      },
      {
        id: 3,
        name: this._translateS.instant('QUESTIONNAIRE.COMMENTS'),
        icon: 'fi fi-rr-comment-alt-dots',
      },
    ];

    this.currentStep = this.steps[0].id;
  }
  currentStep: any;
  ngOnInit(): void {
    this.initTextForm();
  }
  actionDeleteVisible:boolean=false
  handleClosedDelete(event:boolean){
    this.actionDeleteVisible = event
  }
  closing:boolean=false
  close(){
    const returnURL = '/thanks'
    if(!this.currentToken)return
    this.closing=true
    this._questionnaireS.closeQuestionnaire(this.currentToken).pipe(finalize(()=>this.closing =false)).subscribe({
      next:() => {
        this.messageService.add({
          severity:'success',
          detail:'Questionnaire closed successfully.',
          summary:'Success'
        })
        this.router.navigate([returnURL])
      }
    })
  }
  singleSelectTypes: any[] = ['Rating (1–5)', 'Yes / No'];
  multiSelectTypes: any[] = ['Multiple Choice', 'Checklist'];
  textAnswerTypes: any[] = ['Text / Comment'];
  numberAnswerTypes: any[] = ['Numeric Value'];
  dateAnswerTypes: any[] = ['Date Picker'];
  yesNoOptions = [
    { answer_Text: 'Yes', value: '1' },
    { answer_Text: 'No', value: '0' },
  ];
  ngOnChanges(changes: SimpleChanges): void {
    const sectionChange = changes['current_section_input'];
    if (sectionChange) {
      Promise.resolve().then(() => {
        this.handleSectionChange(sectionChange.currentValue);
      });
    }
  }
  progress = output<number>();
  handleSectionChange(section: Section) {
    console.log('Current Section: ',section);
    
    this.current_question_data = section;
    this.currentQuestionIndex = 0;
    this.changeCurrentQuestion(section?.questions[0]);

    this.getSectionProgress(section);
  }
  getSectionProgress(section: Section) {
    if (!section?.questions) return;
    this.answeredQuestions = 0
    const totalQuestions = section.questions.length;
    if (totalQuestions === 0) {
      this.progress.emit(0);
      return;
    }
    const answeredQuestions = section.questions.filter(
      (question) => question.isAnswered
    ).length;

    const percentage = +((answeredQuestions / totalQuestions) * 100).toFixed(2);
    this.progress.emit(percentage);
  }
  updateProgress(question: Question) {
    if (question.isAnswered) return;
    const totalQuestions = this.current_question_data.questions.length;
    this.answeredQuestions++;
    const percentage = +(
      (this.answeredQuestions / totalQuestions) *
      100
    ).toFixed(2);
    this.progress.emit(percentage);
  }

  current_section_input = input<Section>();
  current_question_data!: Section;

  current_selection_question!: Question;
  currentQuestionIndex = 0;
  handleStepChange(step: any) {
    console.log(step, 'step');

    this.currentStep = step.id;
  }
  steps: any[] = [];

  single_select_answer!: number;

  formText!: FormGroup;

  initTextForm() {
    this.formText = new FormGroup({
      answer: new FormControl(null),
    });
  }

  moveStepForward() {
    if (!this.isAtLastQuestion()) {
      this.currentQuestionIndex++;
      const currentQuestion =
        this.current_question_data.questions[this.currentQuestionIndex];
      this.changeCurrentQuestion(currentQuestion);
    }
  }

  handlePrevious() {
    if (!this.isAtFirstQuestion()) {
      this.currentQuestionIndex--;
      const currentQuestion =
        this.current_question_data.questions[this.currentQuestionIndex];
      this.changeCurrentQuestion(currentQuestion);
    }
  }

  navigateToQuestion(question: any) {
    const questionIndex = this.current_question_data.questions.findIndex(
      (q: any) => q.id === question.id
    );
    this.currentQuestionIndex = questionIndex;
    this.changeCurrentQuestion(question);
  }
  changeCurrentQuestion(question: Question) {
    console.log('current question: ', question);
    if (!question) return;
       if (question.answerText) {
      if (this.multiSelectTypes.includes(question.answerType)) {
        question.answer = question.answerText
          ?.split(',')
          .map((val) => Number(val.trim()))
          .filter((val) => !isNaN(val));
      }
      if (
        this.singleSelectTypes.includes(question.answerType) ||
        this.numberAnswerTypes.includes(question.answerType)
      ) {
        question.answer = +question.answerText;
      }
      if (this.textAnswerTypes.includes(question.answerType)) {
        question.answer = question.answerText;
      }
      if (this.dateAnswerTypes.includes(question.answerType)) {
        question.answer = new Date(question.answerText);
      }
    }
    this.current_selection_question = question;
    this.currentStep = this.steps[0].id;
    this.FEAT_ID = question.questionId;
    this.getAttachments();
  }

  clearValues() {
    if (!this.current_selection_question) return;
    this.current_selection_question.answer = null;
  }
  saving: boolean = false;
  handleSave(lastStep: boolean = false) {
    const savedQuestion = this.current_selection_question;
    if (!savedQuestion.answer) return;
    console.log('saving..', savedQuestion);
    this.updateProgress(savedQuestion);
    
    savedQuestion.isAnswered = true;
    //   const answeredQuestions = this.current_question_data.questions.filter(
    //   (question) => question.answer
    // );
      this.saving = true;
     const payload =  [{
        id: this.current_selection_question.questionId,
        answer: Array.isArray(this.current_selection_question.answer)
          ? this.current_selection_question.answer.join(',')
          : `${this.current_selection_question.answer}`,
      }]
      this._questionnaireS
        .saveQuestionAnswers(payload)
        .pipe(finalize(() => (this.saving = false)))
        .subscribe(() => {
          this.messageService.add({
            severity: 'success',
            detail: 'Questionnaire Answered Successfully.',
            summary: 'Success',
          });

          if(lastStep){
                 this._questionnaireS.submittion.set(
            this._questionnaireS.submittion() + 1
          );
          }else {
             this.moveStepForward();
          }
          // this.authService.setAccessData(null)
        });
 
  }
  answeredQuestions: number = 0;

  isAtLastQuestion() {
    return (
      this.currentQuestionIndex ===
      this.current_question_data.questions.length - 1
    );
  }
  isAtFirstQuestion() {
    return this.currentQuestionIndex === 0;
  }

  // attachments start point >>

  env: any;
  attachments: any[] = [];
  show_add_dailog: boolean = false;
  displayModal: boolean = false;
  selected_file_show: any;
  edit_file_name: boolean = false;
  current_title_update: string = '';
  current_file_update: any;
  loadUpdate: boolean = false;
  loadingState: boolean = false;
  FEAT_ID!: number;
  getAttachments() {
    this.loadingState = true;
    this._sharedService.getNewAttachment(67, this.FEAT_ID, 67).subscribe({
      next: (res: any) => {
        this.attachments = res?.data;
        this.loadingState = false;
      },
    });
  }

  handleAdded(event: any) {
    if (event) {
      this.getAttachments();
    }
    this.show_add_dailog = false;
  }

  handleShowAdd(event: boolean) {
    this.show_add_dailog = event;
  }

  handleActionSingleFile(event: any) {
    switch (event.action) {
      case 'Delete':
        this._sharedService.deleteAttachment(event.file.fileID).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Attachment Deleted Successfully',
            });
            this.getAttachments();
          },
        });
        break;

      case 'Download':
        this._sharedService.downloadAttachment(event.file.fileID).subscribe({
          next: (res: any) => {
            const blob = new Blob([res], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = event.file.fileTitle + '.' + event.file.fileExtension;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          },
        });
        break;

      case 'Show':
        this._sharedService
          .getSingleAttachment(event.file.fileUsageID)
          .subscribe({
            next: (res: any) => {
              this.selected_file_show = res?.data;
              this.displayModal = true;
            },
          });
        break;
      case 'Edit':
        this.edit_file_name = true;
        this.current_title_update = event.file.fileTitle;
        this.current_file_update = event.file;
        break;

      default:
        break;
    }
  }

  handleUpdateTitle(newTitle: string) {
    if (!this.current_file_update) return;

    this.loadUpdate = true;
    this._sharedService
      .updateAttachment(this.current_file_update.fileUsageID, newTitle, 67)
      .subscribe({
        next: () => {
          this.loadUpdate = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Attachment Updated Successfully',
          });
          this.edit_file_name = false;
          this.getAttachments();
          this.current_file_update = null;
          this.current_title_update = '';
        },
        error: () => {
          this.loadUpdate = false;
        },
      });
  }

  handleHideView(event: boolean) {
    this.displayModal = event;
  }

  // comments start point

  items: any[] = [
    {
      label: 'Delete comment',
      icon: 'fi fi-rr-trash',
      command: () => {},
    },
    {
      label: 'Update comment',
      icon: 'fi fi-rr-pencil',
      command: () => {},
    },
  ];
  deleteComment(message: any) {
    if (!this.FEAT_ID) return;
    this._sharedService
      .deleteComment(message.commentID, this.FEAT_ID)
      .subscribe((res) => {
        console.log('Comment deleted', res);
      });
  }

  updateMessage(newContent: string, message: any) {
    const updated = { ...message, content: newContent };
    updated.commentId = updated['commentID'];
    this._sharedService
      .updateComment(updated.commentId, updated.commentId, updated.content)
      .subscribe(() => {
        console.log('Comment updated');
      });
  }
}
