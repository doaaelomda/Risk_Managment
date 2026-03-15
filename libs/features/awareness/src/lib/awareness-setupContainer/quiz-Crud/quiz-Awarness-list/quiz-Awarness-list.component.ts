import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import {
  DeleteConfirmPopupComponent,
  TextareaUiComponent,
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
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { UiDropdownComponent } from '../../../../../../../shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-quiz-awarness-list',
  imports: [
    CommonModule,
    TranslateModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    InputNumberComponent,
    UiDropdownComponent,
    InputTextComponent,
    TextareaUiComponent,
    NewTableComponent,
  ],
  templateUrl: './quiz-Awarness-list.component.html',
  styleUrl: './quiz-Awarness-list.component.scss',
})
export class QuizAwarnessListComponent implements OnInit {
  routesParams: any;
  quizTitle: string = '';
  items: any[] = [];
  showQuizPopup: boolean = false;
  current_row_selected: any;
  actionDeleteVisible = false;
  loadingTable = true;
  loadDeleted = false;
  quiz_form: any;
  isLoading = false;
  current_update_id: any = null;
  dataTable: any[] = [];
  quizId: any;
  validationsRequired = [{ key: 'required', message: 'VALIDATIONS.REQUIRED' }];
  paginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  awarenessId: any;
  constructor(
    private _MessageService: MessageService,
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _SharedService: SharedService,
    private _TranslateService: TranslateService,
    private _AwarenessService: AwarenessService,
    public _PermissionSystemService: PermissionSystemService
  ) {
    const routeData = this._ActivatedRoute.snapshot.data;
    this.routesParams = routeData;

    this._ActivatedRoute.parent?.paramMap.subscribe((res) => {
      this.awarenessId = res.get('id');
      if (this.awarenessId) {
        this._AwarenessService
          .getCampaignById(this.awarenessId)
          .subscribe((res: any) => {
            this._LayoutService.breadCrumbLinks.next([
              { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
              {
                name: this._TranslateService.instant('AWARENESS.TITLE'),
                icon: '',
                routerLink: '/gfw-portal/awareness/campaign-list',
              },
              {
                name: res?.data?.name,
                icon: '',
                routerLink: `/gfw-portal/awareness/compagine-setup/${this.awarenessId}/overview`,
              },
              {
                name: this._TranslateService.instant('QUIZ.TITLE'),
                icon: '',
              },
            ]);
          });
        this.columnControl = {
          type: 'route',
          data: `/gfw-portal/awareness/compagine-setup/${this.awarenessId}/Quiz/`,
        };
      }
    });

    this.quizTitle = this._TranslateService.instant('QUIZ.TITLE');
    this.initForm();
  }

  ngOnInit(): void {
    this.items = [
      {
        label: this._TranslateService.instant('QUIZ.VIEW'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._Router.navigate([
            `/gfw-portal/awareness/compagine-setup/${this.awarenessId}/Quiz/${this.current_row_selected}`,
          ]);
        },
        visible: () =>
          this._PermissionSystemService.can('AWARNESS', 'QUIZ', 'VIEW'),
      },
      {
        label: this._TranslateService.instant('QUIZ.UPDATE'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this.showQuizPopup = true;
          this._AwarenessService
            .getQuizById(this.current_row_selected)
            .subscribe((res: any) => {
              this.current_update_id = res?.data?.awarenessQuizID;
              this.initForm(res?.data);
            });
        },
        visible: () =>
          this._PermissionSystemService.can('AWARNESS', 'QUIZ', 'EDIT'),
      },
      {
        label: this._TranslateService.instant('QUIZ.DELETE'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.handleShowDelete(true);
        },
        visible: () =>
          this._PermissionSystemService.can('AWARNESS', 'QUIZ', 'DELETE'),
      },
    ];
  }

  getQuizList(event?: any) {
    this.dataTable = [];
    this.loadingTable = true;
    this._AwarenessService
      .getQuizList(event, +this.awarenessId)
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

  handleShowDelete(event: boolean) {
    this.actionDeleteVisible = event;
  }

  handleClosedDelete(event: boolean) {
    this.actionDeleteVisible = false;
  }

  setSelected(event: any) {
    this.current_row_selected = event;
  }

  deleteQuiz() {
    if (!this._PermissionSystemService.can('AWARNESS', 'QUIZ', 'DELETE'))
      return;
    const quizId = this.current_row_selected;
    this.loadDeleted = true;
    this._AwarenessService.deleteQuiz(quizId).subscribe({
      next: () => {
        this.loadDeleted = false;
        this._MessageService.add({
          severity: 'success',
          detail: this._TranslateService.instant('QUIZ.DELETED_SUCCESS'),
        });
        this.actionDeleteVisible = false;
        this.getQuizList(this.data_payload);
      },
      error: () => {
        this.loadDeleted = false;
        this._MessageService.add({
          severity: 'error',
          detail: this._TranslateService.instant('QUIZ.DELETED_FAILED'),
        });
      },
    });
  }

  initForm(data?: any) {
    this.quiz_form = new FormGroup({
      name: new FormControl(data?.name, Validators.required),
      nameAr: new FormControl(data?.nameAr),
      description: new FormControl(data?.description),
      descriptionAr: new FormControl(data?.descriptionAr),
      randomizeQuestions: new FormControl(
        data?.randomizeQuestions,
        Validators.required
      ),
      passScore: new FormControl(data?.passScore, [Validators.required]),
    });
  }

  submit() {


                    // ===== Permissions =====
  const hasPermission = this.current_update_id
    ? this._PermissionSystemService.can('AWARNESS', 'QUIZ', 'EDIT')
    : this._PermissionSystemService.can('AWARNESS', 'QUIZ', 'ADD');

  if (!hasPermission) {
    return;
  }

    if (this.quiz_form.invalid) {
      this.quiz_form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const req = {
      ...this.quiz_form.value,
      awarenessCampaignID: this.awarenessId,
    };

    let request$: Observable<any>;

    if (this.current_update_id) {
      req.awarenessQuizID = this.current_update_id;
      request$ = this._AwarenessService.updateQuiz(req);
    } else {
      request$ = this._AwarenessService.addQuiz(req);
    }

    request$.pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: () => {
        this._MessageService.add({
          severity: 'success',
          detail: this.current_update_id
            ? this._TranslateService.instant('QUIZ.UPDATED_SUCCESS')
            : this._TranslateService.instant('QUIZ.ADDED_SUCCESS'),
        });
        this.showQuizPopup = false;
        this.getQuizList(this.data_payload);
        this.quiz_form.reset();
      },
    });
  }

  onModalClose() {
    this.quiz_form.reset();
  }

  columnControl: any;
  data_payload: any;
  handleDataTable(event: any) {
    this.data_payload = event;
    this.getQuizList(event);
  }
}
