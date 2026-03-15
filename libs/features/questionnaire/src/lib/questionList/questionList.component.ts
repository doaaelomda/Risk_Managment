import { NewTableComponent } from './../../../../../shared/shared-ui/src/lib/new-table/new-table.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { finalize, Subscription } from 'rxjs';
/* eslint-disable @nx/enforce-module-boundaries */
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { QuestionService } from '../../Service/question.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-question-list',
  imports: [
    CommonModule,
    TranslateModule,
    MenuModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    DialogModule,
    SkeletonModule,
    NewTableComponent,
  ],
  templateUrl: './questionList.component.html',
  styleUrl: './questionList.component.scss',
})
export class QuestionListComponent implements OnInit {
  // ====================== Table & Data ======================
  dataTable: any[] = [];
  tablePayload: any;
  loadingTable = true;

  // ====================== Pagination ======================
  paginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };

  // ====================== Action Items ======================
  items: any[] = [];
  current_row_selected: any;
  actionDeleteVisible = false;
  loadDeleted = false;

  // ====================== Column Control ======================
  columnControl: any = {
    type: 'route',
    data: '/gfw-portal/questionnaire/ViewQuestion',
  };

  private subscription: Subscription = new Subscription();

  // ====================== Constructor ======================
  constructor(
    private _MessageService: MessageService,
    private _Router: Router,
    private _QuestionService: QuestionService,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    public _PermissionSystemService:PermissionSystemService
  ) {}

  // ====================== Breadcrumbs ======================
  private initBreadcrumbs(): void {
    this._LayoutService.breadCrumbLinks.next([
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      {
        name: this._TranslateService.instant('HEARDE_TABLE.QUESTIONS'),
        icon: '',
        routerLink: '/gfw-portal/questionnaire/questions-list',
      },
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.QUESTION_LIST'
        ),
        icon: '',
        routerLink: '/gfw-portal/questionnaire/questions-list',
      },
    ]);
  }

  // ====================== Row Action Menu ======================
  private initActionItems(): void {
    this.items = [
      {
        label: this._TranslateService.instant('QUESTION.VIEW'),
        icon: 'fi fi-rr-eye',
        command: () =>
          this._Router.navigate([
            '/gfw-portal/questionnaire/ViewQuestion',
            this.current_row_selected,
          ]),
          visible: ()=>this._PermissionSystemService.can('QUESTIONNAIRES' , 'QUESTIONS' , 'VIEW')
      },
      {
        label: this._TranslateService.instant('QUESTION.DELETE'),
        icon: 'fi fi-rr-trash',
        command: () => this.handleShowDelete(true),
        visible: ()=>this._PermissionSystemService.can('QUESTIONNAIRES' , 'QUESTIONS' , 'DELETE')
      },
      {
        label: this._TranslateService.instant('QUESTION.UPDATE'),
        icon: 'fi fi-rr-pencil',
        command: () =>
          this._Router.navigate([
            '/gfw-portal/questionnaire/updateQuestion',
            this.current_row_selected,
          ]),
          visible: ()=>this._PermissionSystemService.can('QUESTIONNAIRES' , 'QUESTIONS' , 'EDIT')
      },
    ];
  }

  // ====================== Table Handling ======================
  /** Fetch table data from API */
  getData(payload?: any): void {
    this.loadingTable = true;
    this.dataTable = [];

   const sub = this._QuestionService
      .getQuestionSearch(payload)
      .pipe(
        finalize(() => (this.loadingTable = false))
      )
      .subscribe({

        next: (res: any) => {
          this.dataTable = res?.data?.items ?? [];
          this.paginationObj = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this._SharedService.paginationSubject.next(this.paginationObj);
        },
      });
       this.subscription.add(sub);
  }

  /** Handle table events (filter, sort, pagination) */
  handleDataTable(event: any): void {
    this.tablePayload = event;
    this.getData(event);
  }

  // ====================== Row Selection ======================
  setSelected(event: any): void {
    this.current_row_selected = event;
  }

  // ====================== Delete Handling ======================
  handleShowDelete(_: boolean): void {
    this.actionDeleteVisible = true;
  }

  handleClosedDelete(_: boolean): void {
    this.actionDeleteVisible = false;
  }

  closeDeleteModal(): void {
    this.actionDeleteVisible = false;
  }

  /** Delete selected question */
  deleteQuestion(): void {
     if(!this._PermissionSystemService.can('QUESTIONNAIRES' , 'QUESTIONS' , 'DELETE')) return;

    this.loadDeleted = true;
   const sub = this._QuestionService
      .deleteQuestion(this.current_row_selected)
      .pipe(finalize(() => (this.loadDeleted = false)))
      .subscribe(() => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this._TranslateService.instant('QUESTION.DELETE_SUCCESS'),
        });
        console.log('getting data after delete...');
        
        this.getData(this.tablePayload);
        this.handleClosedDelete(false);
      });
       this.subscription.add(sub);
  }

  // ====================== Lifecycle Hooks ======================
  ngOnInit(): void {
    this.initBreadcrumbs();
    this.initActionItems();
  }

   ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
