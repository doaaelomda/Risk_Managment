import { NewTableComponent } from './../../../../../shared/shared-ui/src/lib/new-table/new-table.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { MeetingsService } from '../../services/meetings.service';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-meetings-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MenuModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    DialogModule,
    SkeletonModule,
    NewTableComponent
  ],
  templateUrl: './meetings-list.component.html',
  styleUrl: './meetings-list.component.scss',
})
export class MeetingsListComponent implements OnInit {
  constructor(
    private _LayoutService: LayoutService,
    private _SharedService: SharedService,
    private _MeetingsService: MeetingsService,
    private _TranslateService: TranslateService,
    private _MessageService: MessageService,
    private _Router: Router,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.MEETINGS'),
        icon: '',
        routerLink: '/gfw-portal/meetings',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.MEETINGS_LIST'),
        icon: '',
        routerLink: '/gfw-portal/meetings/list',
      },
    ]);
  }

  // UI and Data
  items: any[] = [];
  selected_profile_column = 0;
  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  ViewControlModal = false;
  current_filters: any[] = [];
  sort_data: any;
  loadingTable = true;
  dataTable: any[] = [];
  current_row_selected: any;
  actionDeleteVisible = false;
  loadDelted = false;
  MeetingsData: any;

  ngOnInit(): void {
    this.items = [
      {
        label: this._TranslateService.instant('MEETINGS.VIEW_MEETING'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._Router.navigate(['/gfw-portal/meetings/view' , this.current_row_selected]);
        },
        visible: ()=> this._PermissionSystemService.can('MEETING' , 'MEETING' , 'VIEW')
      },
      {
        label: this._TranslateService.instant('MEETINGS.UPDATE_MEETING'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this._Router.navigate(['/gfw-portal/meetings/edit', this.current_row_selected]);
        },
        visible: ()=> this._PermissionSystemService.can('MEETING' , 'MEETING' , 'EDIT')
      },
      {
        label: this._TranslateService.instant('MEETINGS.DELETE_MEETING'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.handleShowDelete(true);
        },
        visible: ()=> this._PermissionSystemService.can('MEETING' , 'MEETING' , 'DELETE')
      },
    ];


  }

  // Methods
  handleClosedDelete(event: boolean) {
    this.actionDeleteVisible = false;
  }

  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }




  handleShowDelete(event: boolean) {
    this.actionDeleteVisible = true;
  }

  setSelected(event: any) {
    this.current_row_selected = event;
  }


  data_payload:any
  handleDataTable(event: any) {
    this.data_payload = event;
    this.getMeetingsData(event);
  }
  columnControl: any = {
    type: 'route',
    data: '/gfw-portal/meetings/view',
  };
  getMeetingsData(event?: any) {
    this.dataTable = [];
    this.loadingTable = true;
    this._MeetingsService
      .getMeetingsSearch(event)
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
        },
        error: () => (this.loadingTable = false),
      });
  }

  deleteMeeting() {
    if(!this._PermissionSystemService.can('MEETING' , 'MEETING' , 'DELETE')) return;
    this.loadDelted = true;
    this._MeetingsService
      .deleteMeeting(this.current_row_selected)
      .pipe(finalize(() => (this.loadDelted = false)))
      .subscribe(() => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this._TranslateService.instant('MEETINGS.DELETED_SUCCESS'),
        });
        this.getMeetingsData(this.data_payload);
        this.handleClosedDelete(false);
      });
  }
}
