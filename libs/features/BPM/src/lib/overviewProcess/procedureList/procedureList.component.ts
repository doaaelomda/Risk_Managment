import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
/* eslint-disable @nx/enforce-module-boundaries */
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import {
  ActivatedRoute,
  Router,
  RouterOutlet,
} from '@angular/router';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { ProcessListService } from '../../../processList/process-list.service';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-procedure-list',
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    DeleteConfirmPopupComponent,
    RouterOutlet,
    NewTableComponent,
  ],
  templateUrl: './procedureList.component.html',
  styleUrl: './procedureList.component.scss',
})
export class ProcedureListComponent {
  processId: any;
  columnControl: any;
  data_payload: any;
  loadDelted: boolean = false;
  items: any[] = [];
  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  loadingTable: boolean = true;
  dataTable: any[] = [];
  current_row_selected: any;
  actionDeleteVisible: boolean = false;
  AssestsData: any;
  constructor(
    private _MessageService: MessageService,
    private _Router: Router,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private ProcessListService: ProcessListService,
    private _ActivatedRoute: ActivatedRoute,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this.items = [
      {
        label: this._TranslateService.instant('PROCEDURE.View_procedure'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._Router.navigate([
            `/gfw-portal/BPM/viewprocedure`,
            this.processId,
            this.current_row_selected,
          ]);
        },
        visible: ()=> this._PermissionSystemService.can('BUSINESSPROCESS', 'PROCEDURE' , 'VIEW')
      },
      {
        label: this._TranslateService.instant('PROCEDURE.Delete_procedure'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.handleShowDelete(true);
        },
        visible: ()=> this._PermissionSystemService.can('BUSINESSPROCESS', 'PROCEDURE' , 'DELETE')
      },
      {
        label: this._TranslateService.instant('PROCEDURE.Update_procedure'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this._Router.navigate([
            `/gfw-portal/BPM/add-procedure`,
            this.processId,
            this.current_row_selected,
          ]);
        },
        visible: ()=> this._PermissionSystemService.can('BUSINESSPROCESS', 'PROCEDURE' , 'EDIT')
      },
    ];
    this._ActivatedRoute.parent?.paramMap.subscribe((res: any) => {
      this.processId = res.get('processId');
      this.columnControl = {
        type: 'route',
        data: `/gfw-portal/BPM/viewprocedure/${this.processId}`,
      };
    });
  }
  handleShowDelete(event: boolean) {
    this.actionDeleteVisible = true;
  }
  getprocedureSearch(event: any) {
    this.dataTable = [];
    this.loadingTable = true;
    this.ProcessListService.getprocedureSearch(event, +this.processId)
      .pipe(finalize(() => (this.loadingTable = false)))
      .subscribe({
        next: (res: any) => {
          this.dataTable = res?.data?.items;
          this.pageginationObj = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this._SharedService.paginationSubject.next(this.pageginationObj);
          this.loadingTable = false;
        },
        error: (err: any) => {
          this.loadingTable = false;
        },
      });
    this.loadingTable = true;
  }
  setSelected(event: any) {
    this.current_row_selected = event;
  }
  handleClosedDelete(event?: boolean) {
    this.actionDeleteVisible = false;
  }
  deleteProcedure() {
    if(!this._PermissionSystemService.can('BUSINESSPROCESS', 'PROCEDURE' , 'DELETE')) return;
    this.loadDelted = true;
    this.ProcessListService.deleteProcedure(this.current_row_selected)
      .pipe(finalize(() => (this.loadDelted = false)))
      .subscribe({
        next: (res: any) => {
          this.loadDelted = false;
          this.handleClosedDelete();
          this.getprocedureSearch(null);

          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Procedurce Deleted Successfully ',
          });
        },
        error: (err: any) => {
          this.loadDelted = false;
        },
      });
  }
  addProcedure() {
    this._Router.navigate([`/gfw-portal/BPM/add-procedure`, this.processId]);
  }
  handleDataTable(event: any) {
    this.data_payload = event;
    this.getprocedureSearch(event);
  }
}
