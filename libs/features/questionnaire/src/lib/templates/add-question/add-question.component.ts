import { QuestionsTableUiComponent } from './../../../../../../shared/shared-ui/src/lib/questions-table-ui/questions-table-ui.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Button } from 'primeng/button';

import { TranslateModule } from '@ngx-translate/core';
import { QuestionsService } from '../../services/questions.service';

import { MultiSelectModule } from 'primeng/multiselect';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { InputNumberModule } from 'primeng/inputnumber';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-add-question',
  imports: [
    CommonModule,
    Button,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    RouterLink,
    MultiSelectModule,
    CdkDropList,
    CdkDrag,
    InputNumberModule,
    QuestionsTableUiComponent
  ],
  templateUrl: './add-question.component.html',
  styleUrl: './add-question.component.scss',
})
export class AddQuestionComponent {
  constructor(
    private _questionsS: QuestionsService,
    private _activatedRoute: ActivatedRoute,
    private _messageS: MessageService,
    private _router: Router,
    private _SharedService:SharedService,
    private _PermissionSystemService:PermissionSystemService
  ) {}

  templateId!: string;
  ngOnInit() {
    this.getQuestionId();
  }
  isLoadingData:boolean = false
  search:any = ''
  handleQuestionsSelect(event:any){
    console.log(event, 'questions from add question ts');
    this.selected_questions = event
  }
  handleSearch(event:any){
    this.search = event
    this.getQuestionsList()
  }

  removeQuestion(index:any){
    this.selected_questions.splice(index,1)
    this.selected_questions = [...this.selected_questions];
  }
  getQuestionsList(event?:any) {
    this.isLoadingData = true
    this._questionsS.getQuestionsList(this.search,event?.currentPage ?? 1, event?.perPage ?? 10).subscribe((res) => {
      this.isLoadingData =false
      this.questionsList = res?.data?.items;
            this.pageginationObj = {
        perPage: res?.data?.pageSize,
        currentPage: res?.data?.pageNumber,
        totalItems: res?.data?.totalCount,
        totalPages: res?.data?.totalPages
      }
      this._SharedService.paginationSubject.next(this.pageginationObj);

    });
  }
  pageginationObj:any = {}
  form!: FormGroup;
  questionsList: any[] = [];
  selected_questions: any[] = [];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.selected_questions,
      event.previousIndex,
      event.currentIndex
    );
  }

  sectionId!: string;
  questionId!: string;

  getQuestionId() {
    this._activatedRoute.paramMap.subscribe((res: any) => {
      this.templateId = res.get('templateId');
      this.sectionId = res.get('sectionId');
      this.questionId = res.get('questionId');
      if (!this.questionId) return;
      this.getQuestionById(this.questionId);
    });
  }

  getQuestionById(id: string) {
    this._questionsS.getById(id).subscribe((res) => {
      const question_data = res?.data;
      console.log(question_data, 'sdata');
    });
  }
  navigateBack() {
    this._router.navigate([
      `/gfw-portal/questionnaire/templates/${this.templateId}/sections/${this.sectionId}/questions`
    ]);
  }
  isSavingTemplate: boolean = false;
  save() {
    
    const canAdd = this._PermissionSystemService.can('QUESTIONNAIRES' , 'TEMPLATESSECTIONSQUESTIONS' , 'ADD') 
    const canEdit = this._PermissionSystemService.can('QUESTIONNAIRES' , 'TEMPLATESSECTIONSQUESTIONS' , 'EDIT') 
    if(this.questionId && !canEdit)return
    if(!this.questionId && !canAdd)return
    if (!this.selected_questions.length) return;
    this.isSavingTemplate = true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const data = this.selected_questions.map(
      ({ questionTypeName, questionText, ...rest }) => rest
    );
    const msg = this.questionId ? 'updated' : 'created';
    this._questionsS
      .save(data, this.templateId, this.sectionId, this.questionId)
      .subscribe({
        next: (res) => {
          this.isSavingTemplate = false;
          this._messageS.add({
            severity: 'success',
            detail: `Question ${msg} successfully`,
          });
          this.navigateBack();
        },
        error: (err) => (this.isSavingTemplate = false),
      });
  }
}
