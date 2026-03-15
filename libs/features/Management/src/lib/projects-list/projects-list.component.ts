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
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-projects-list',
  imports: [
    CommonModule,
    TranslateModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    MenuModule,
    NewTableComponent,
  ],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.scss',
})
export class ProjectsListComponent {
  columnControl: any = {
    type: 'route',
    data: '/gfw-portal/management/project/',
  };
  data_payload: any;
  loadDelted: boolean = false;
  actionDeleteVisible: boolean = false;
  items: any[] = [];
  selected_profile_column: number = 0;
  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  loadingTable: boolean = true;
  dataTable: any[] = [];
  current_row_selected: any;
  constructor(
    private _MessageService: MessageService,
    private _LayoutService: LayoutService,
    private _Router: Router,
    private _TranslateService: TranslateService,
    private _SharedService: SharedService,
    private _TasksService: TasksService,
    public _PermissionSystemService: PermissionSystemService
  ) {}

  ngOnInit(): void {
    this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('INITIATIVE.Management'),
        icon: '',
        routerLink: '/gfw-portal/management/projects',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.Projects'),
        icon: '',
        routerLink: '/gfw-portal/management/projects',
      },
    ]);
    this.items = [
      {
        label: 'View Project',
        icon: 'fi fi-rr-eye',
        command: () => {
          this._Router.navigate([
            '/gfw-portal/management/project' + this.current_row_selected,
          ]);
        },
        visible: () =>
          this._PermissionSystemService.can('MANAGEMENT', 'PROJECTS', 'VIEW'),
      },
      {
        label: 'Delete Project',
        icon: 'fi fi-rr-trash',
        command: () => {
          this.handleShowDelete(true);
        },
        visible: () =>
          this._PermissionSystemService.can('MANAGEMENT', 'PROJECTS', 'DELETE'),
      },
      {
        label: 'Edit Project',
        icon: 'fi fi-rr-pencil',
        command: () => {
          this._Router.navigate([
            '/gfw-portal/management/edit-project',
            this.current_row_selected,
          ]);
        },
        visible: () =>
          this._PermissionSystemService.can('MANAGEMENT', 'PROJECTS', 'EDIT'),
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
  getProjectsData(event?: any) {
    this.dataTable = [];
    this.loadingTable = true;
    this._TasksService
      .getProjectsSearch(event)
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

  deleteProject() {
    //
    if (!this._PermissionSystemService.can('MANAGEMENT', 'PROJECTS', 'DELETE'))
      return;
    this.loadDelted = true;
    this._TasksService
      .deleteProject(this.current_row_selected)
      .pipe(finalize(() => (this.loadDelted = false)))
      .subscribe({
        next: (res: any) => {
          this.loadDelted = false;
          this.closeDeleteModal();
          this.getProjectsData(this.data_payload);

          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Project Deleted Successfully ',
          });
        },
        error: (err: any) => {
          this.loadDelted = false;
        },
      });
  }

  handleDataTable(event: any) {
    this.data_payload = event;
    this.getProjectsData(event);
  }
}

