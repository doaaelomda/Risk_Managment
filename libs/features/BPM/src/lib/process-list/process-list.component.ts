import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
/* eslint-disable @nx/enforce-module-boundaries */
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { newProfile } from './../../../../../shared/shared-ui/src/models/newProfiles';
import { PaginationInterface } from './../../../../../../apps/gfw-portal/src/app/core/models/pagination';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { ProcessListService } from '../../processList/process-list.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-process-list',
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    DeleteConfirmPopupComponent,
    RouterLink,
    NewTableComponent,
  ],
  templateUrl: './process-list.component.html',
  styleUrl: './process-list.component.scss',
})
export class ProcessListComponent {
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
  Profiles: newProfile[] = [];
  columnControl: any = {
    type: 'route',
    data: '/gfw-portal/BPM/viewProcess',
  };
  data_payload: any;
  constructor(
    private _MessageService: MessageService,
    private _Router: Router,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private ProcessListService: ProcessListService,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('PROCESS.TABLE_NAME'),
        icon: '',
        routerLink: '/gfw-portal/process/list',
      },
    ]);
    this.items = [
      {
        label: this._TranslateService.instant('PROCESS.View_process'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._Router.navigate([
            '/gfw-portal/BPM/viewProcess',
            this.current_row_selected,
          ]);
        },
        visible: ()=> this._PermissionSystemService.can('BUSINESSPROCESS' , 'PROCESS' , 'VIEW')
      },
      {
        label: this._TranslateService.instant('PROCESS.Delete_process'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.handleShowDelete(true);
        },
        visible: ()=> this._PermissionSystemService.can('BUSINESSPROCESS' , 'PROCESS' , 'DELETE')
      },
      {
        label: this._TranslateService.instant('PROCESS.Update_process'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this._Router.navigate([
            '/gfw-portal/BPM/add-process',
            this.current_row_selected,
          ]);
        },
        visible: ()=> this._PermissionSystemService.can('BUSINESSPROCESS' , 'PROCESS' , 'EDIT')
      },
    ];
  }

  handleShowDelete(event: boolean) {
    this.actionDeleteVisible = true;
  }

  getProcessList(event: any) {
    this.dataTable = [];
    this.loadingTable = true;
    this.ProcessListService.getprocesssSearch(event)
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
  deleteProcess() {
    if(!this._PermissionSystemService.can('BUSINESSPROCESS' , 'PROCESS' , 'DELETE')) return;
    this.loadDelted = true;
    this.ProcessListService.deleteprocess(this.current_row_selected)
      .pipe(finalize(() => (this.loadDelted = false)))
      .subscribe({
        next: (res: any) => {
          this.loadDelted = false;
          this.handleClosedDelete();
          this.getProcessList(this.data_payload);

          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'incident Deleted Successfully ',
          });
        },
        error: (err: any) => {
          this.loadDelted = false;
        },
      });
  }

  handleDataTable(event: any) {
    this.data_payload = event;
    this.getProcessList(event);
  }
}
