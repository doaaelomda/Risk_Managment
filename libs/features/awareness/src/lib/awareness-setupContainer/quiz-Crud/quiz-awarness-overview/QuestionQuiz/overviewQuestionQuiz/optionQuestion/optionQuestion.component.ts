import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize, forkJoin, Observable, of, take } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import {
  DeleteConfirmPopupComponent,
} from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { AwarenessService } from 'libs/features/awareness/src/services/awareness.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { SkeletonModule } from 'primeng/skeleton';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
@Component({
  selector: 'lib-option-question',
  imports: [
    CommonModule,
    TranslateModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextComponent,
    UiDropdownComponent,
    SkeletonModule,
    NewTableComponent
  ],
  templateUrl: './optionQuestion.component.html',
  styleUrl: './optionQuestion.component.scss',
})
export class OptionQuestionComponent implements OnInit {
  routesParams: any;
  optionTitle: string = '';
  items: any[] = [];
  selected_profile_column = 0;
  defaultProfile!: newProfile;
  showOptionPopup = false;
  current_row_selected: any;
  actionDeleteVisible = false;
  loadingTable = true;
  loadDeleted = false;
  option_form: any;
  isLoading = false;
  compagin_id: any;
  current_update_id: any = null;
  dataTable: any[] = [];
  questionId: any;
  id: any;
  quizId: any;
  showViewOptionPopup: boolean = false;
  validationsRequired = [{ key: 'required', message: 'VALIDATIONS.REQUIRED' }];
  dataOption: any;
  paginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  campaignResData: any;
  constructor(
    private _MessageService: MessageService,
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _SharedService: SharedService,
    private _TranslateService: TranslateService,
    private _AwarenessService: AwarenessService,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this._ActivatedRoute?.parent?.paramMap.pipe(take(1)).subscribe((params) => {
      this.questionId = params.get('questionId');
      this.quizId = params.get('quizId');
      this.id = params.get('id');
      this.compagin_id = params.get('id');
      const quiz$ = this.questionId
        ? this._AwarenessService.getQuestionQuizById(this.questionId)
        : of({ data: { name: '-' } });

      const campaign$ = this.id
        ? this._AwarenessService.getQuizById(this.id)
        : of({ data: { name: '-' } });
      forkJoin([quiz$, campaign$]).subscribe(([quizRes, campaignRes]: any) => {
        this.dataQuestion = quizRes?.data || { name: '-' };
        this.campaignResData = campaignRes?.data;
        const breadcrumbLinks = [
          { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
          {
            name: this._TranslateService.instant('AWARENESS.TITLE'),
            icon: '',
            routerLink: '/gfw-portal/awareness/campaign-list',
          },
          {
            name: this._TranslateService.instant('OPTION_QUESTION.option'),
            icon: '',
            routerLink: `/gfw-portal/awareness/compagine-setup/${this.id}/Quiz/${this.quizId}/question-quiz`,
          },
          {
            name:
              this._SharedService.truncateWords(
                this.dataQuestion.questionText,
                3
              ) || '-',
            icon: '',
            routerLink: `/gfw-portal/awareness/compagine-setup/${this.id}/Quiz/${this.quizId}/question-quiz/${this.questionId}/overview`,
          },
          {
            name: this._TranslateService.instant('OPTION_QUESTION.option'),
            icon: '',
          },
        ];

        this._LayoutService.breadCrumbLinks.next(breadcrumbLinks);
      });
    });

    this.initForm();
  }
  dataQuestion: any;
  ngOnInit(): void {
    this.items = [
      {
        label: this._TranslateService.instant('OPTION_QUESTION.VIEW'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this.showViewOptionPopup = true;
          this.openViewModal()
        },
        visible: ()=> this._PermissionSystemService.can('AWARNESS' , 'OPTIONQUESTION' , 'VIEW')
      },
      {
        label: this._TranslateService.instant('OPTION_QUESTION.UPDATE'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this.showOptionPopup = true;
          this._AwarenessService
            .getOptionQuizById(this.current_row_selected)
            .subscribe((res: any) => {
              this.current_update_id = res?.data?.awarenessQuizOptionID;
              this.initForm(res?.data);
            });
        },
                visible: ()=> this._PermissionSystemService.can('AWARNESS' , 'OPTIONQUESTION' , 'EDIT')

      },
      {
        label: this._TranslateService.instant('OPTION_QUESTION.DELETE'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.handleShowDelete(true);
        },
                visible: ()=> this._PermissionSystemService.can('AWARNESS' , 'OPTIONQUESTION' , 'DELETE')

      },
    ];

  }


  getOptionQuizList(event?: any) {
    this.dataTable = [];
    this.loadingTable = true;
    this._AwarenessService
      .getOptionQuizList(
        event,
        this.compagin_id,
        this.questionId
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
        error: () => (this.loadingTable = false),
      });
  }

  handleShowDelete(event: boolean) {
    this.actionDeleteVisible = event;
  }

  handleClosedDelete() {
    this.actionDeleteVisible = false;
  }

  setSelected(event: any) {
    this.current_row_selected = event;
  }

  deleteOptionQuiz() {
    if(!this._PermissionSystemService.can('AWARNESS' , 'OPTIONQUESTION' , 'DELETE')) return;
    const optionId = this.current_row_selected;
    this.loadDeleted = true;
    this._AwarenessService.deleteOptionQuiz(optionId).subscribe({
      next: () => {
        this.loadDeleted = false;
        this._MessageService.add({
          severity: 'success',
          detail: this._TranslateService.instant(
            'OPTION_QUESTION.DELETED_SUCCESS'
          ),
        });
        this.actionDeleteVisible = false;
        this.getOptionQuizList(this.data_payload);
      },
    });
  }

  initForm(data?: any) {
    this.option_form = new FormGroup({
      optionText: new FormControl(data?.optionText, Validators.required),
      optionTextAr: new FormControl(data?.optionTextAr),
      isCorrect: new FormControl(data?.isCorrect, Validators.required),
    });
  }

  submit() {

                    // ===== Permissions =====
  const hasPermission = this.current_update_id
    ? this._PermissionSystemService.can('AWARNESS' , 'OPTIONQUESTION', 'EDIT')
    : this._PermissionSystemService.can('AWARNESS' , 'OPTIONQUESTION', 'ADD');

  if (!hasPermission) {
    return;
  }
    if (this.option_form.invalid) {
      this.option_form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const req = {
      ...this.option_form.value,
      awarenessQuizQuestionID: this.questionId,
    };

    let request$: Observable<any>;

    if (this.current_update_id) {
      req.awarenessQuizOptionID = this.current_update_id;
      request$ = this._AwarenessService.updateOptionQuiz(req);
    } else {
      request$ = this._AwarenessService.addOptionQuiz(req);
    }

    request$.pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: () => {
        this._MessageService.add({
          severity: 'success',
          detail: this.current_update_id
            ? this._TranslateService.instant('OPTION_QUESTION.UPDATED_SUCCESS')
            : this._TranslateService.instant('OPTION_QUESTION.ADDED_SUCCESS'),
        });
        this.showOptionPopup = false;
        this.getOptionQuizList(this.data_payload);
        this.option_form.reset();
      },
    });
  }

  onModalClose() {
    this.option_form.reset();
  }

  loading: boolean = false;
  openViewModal() {
    this.showViewOptionPopup = true;
    this.loading = true;
    this._AwarenessService
      .getOptionQuizById(this.current_row_selected
      )
      .subscribe((res: any) => {
        const data = res?.data;
        this.dataOption = data;
        this.loading = false;
        console.log('got task', res?.data);
      });
  }
    columnControl: any = {
    type: 'popup',
    data: '',
  };

  handleDataTable(event: any) {
    this.data_payload = event;
    this.getOptionQuizList(event);
  }

  data_payload: any;
}
