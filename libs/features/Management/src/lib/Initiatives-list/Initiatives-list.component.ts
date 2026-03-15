import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { TranslateService } from '@ngx-translate/core';
/* eslint-disable @nx/enforce-module-boundaries */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { TasksService } from '../../services/tasks.service';
import { finalize } from 'rxjs';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { Router } from '@angular/router';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { MenuModule } from 'primeng/menu';
import { MessageService } from 'primeng/api';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-initiatives-list',
  imports: [
    CommonModule,
    TranslateModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    MenuModule,
    NewTableComponent,
  ],
  templateUrl: './Initiatives-list.component.html',
  styleUrl: './Initiatives-list.component.scss',
})
export class InitiativesListComponent {
  columnControl: any = {
    type: 'route',
    data: '/gfw-portal/management/initiative',
  };
  data_payload: any;
  constructor(
    private _LayoutService: LayoutService,
    private _Router: Router,
    private _TranslateService: TranslateService,
    private _SharedService: SharedService,
    private _TasksService: TasksService,
    private _MessageService: MessageService,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('INITIATIVE.Management'),
        icon: '',
        routerLink: '/gfw-portal/management/initiatives',
      },
      {
        name: this._TranslateService.instant('INITIATIVE.Initiative'),
        icon: '',
        routerLink: '/gfw-portal/management/initiatives',
      },
    ]);
  }

  loadDelted: boolean = false;
  actionDeleteVisible: boolean = false;
  items: any[] = [];
  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };

  current_filters: any[] = [];

  loadingTable: boolean = true;
  dataTable: any[] = [];
  current_row_selected: any;
  ngOnInit(): void {
    this.items = [
      {
        label: this._TranslateService.instant('INITIATIVE.VIEW_INITIATIVE'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._Router.navigate([
            '/gfw-portal/management/initiative',
            this.current_row_selected,
          ]);
        },
                visible: ()=> this._PermissionSystemService.can('MANAGEMENT' , 'INITIATIVE' , 'VIEW')

      },
      {
        label: this._TranslateService.instant('INITIATIVE.DELETE_INITIATIVE'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.handleShowDelete(true);
        },
                visible: ()=> this._PermissionSystemService.can('MANAGEMENT' , 'INITIATIVE' , 'DELETE')

      },
      {
        label: this._TranslateService.instant('INITIATIVE.UPDATE_INITIATIVE'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this._Router.navigate([
            '/gfw-portal/management/add-initiative',
            this.current_row_selected,
          ]);
        },
                visible: ()=> this._PermissionSystemService.can('MANAGEMENT' , 'INITIATIVE' , 'EDIT')

      },
    ];
  }


  handleShowDelete(event: boolean) {
    this.actionDeleteVisible = true;
  }

  handleClosedDelete(event: boolean) {
    this.actionDeleteVisible = false;
  }

  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }

  setSelected(event: any) {
    this.current_row_selected = event;
  }

  getInitiativesData(event?: any) {
    this.dataTable = [];
    this.loadingTable = true;
    this._TasksService
      .getInitiativesSearch(event)
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
  }

  deleteinitiative() {
     if(!this._PermissionSystemService.can('MANAGEMENT' , 'INITIATIVE' , 'DELETE')) return;
    this.loadDelted = true;
    this._TasksService.deleteinitiative(+this.current_row_selected).subscribe({
      next: () => {
        this.actionDeleteVisible = false;
        this.loadDelted = false;
        this.getInitiativesData(this.data_payload);
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'initiative  Deleted Successfully!',
        });
      },
      error: (err) => {
        console.error('Delete failed', err);
        this.loadDelted = false;
      },
    });
  }

  handleDataTable(event: any) {
    this.data_payload = event;
    this.getInitiativesData(event);
  }
}
