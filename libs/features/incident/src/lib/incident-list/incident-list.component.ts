import { TranslateService } from '@ngx-translate/core';
/* eslint-disable @nx/enforce-module-boundaries */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { Router } from '@angular/router';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { MenuModule } from 'primeng/menu';
import { MessageService } from 'primeng/api';
import { IncidentService } from '../../services/incident.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
@Component({
  selector: 'lib-incident-list',
  imports: [
    CommonModule,
    TranslateModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    MenuModule,
    NewTableComponent,
  ],
  templateUrl: './incident-list.component.html',
  styleUrl: './incident-list.component.scss',
})
export class IncidentListComponent {
  constructor(
    private _MessageService: MessageService,
    private _LayoutService: LayoutService,
    private _Router: Router,
    private _TranslateService: TranslateService,
    private _SharedService: SharedService,
    private _IncidentService: IncidentService,
    public _PermissionSystemService: PermissionSystemService
  ) {
    this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('INCIDENT.incident'),
        icon: '',
        routerLink: '/gfw-portal/incident/list',
      },
      {
        name: this._TranslateService.instant('INCIDENT.LIST_TITLE'),
        icon: '',
      },
    ]);
  }

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

  current_filters: any[] = [];

  sort_data: any;
  loadingTable: boolean = true;
  dataTable: any[] = [];
  current_row_selected: any;
  incidentsProfiles: newProfile[] = [];
  defultProfile!: newProfile;

  ngOnInit(): void {
    this.items = [
      {
        label: this._TranslateService.instant('INCIDENT.View_Incident'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._Router.navigate([
            '/gfw-portal/incident/viewincident',
            this.current_row_selected,
          ]);
        },
        visible: () =>
          this._PermissionSystemService.can('INCIDENT', 'INCIDENT', 'VIEW'),
      },
      {
        label: this._TranslateService.instant('INCIDENT.Delete_Incident'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.handleShowDelete(true);
        },
        visible: () =>
          this._PermissionSystemService.can('INCIDENT', 'INCIDENT', 'DELETE'),
      },
      {
        label: this._TranslateService.instant('INCIDENT.Update_Incident'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this._Router.navigate([
            '/gfw-portal/incident/add-incident',
            this.current_row_selected,
          ]);
        },
        visible: () =>
          this._PermissionSystemService.can('INCIDENT', 'INCIDENT', 'EDIT'),
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
  getIncidentsData(payload?: any) {
    this.dataTable = [];
    this.loadingTable = true;
    this._IncidentService
      .getIncidentsSearch(payload)
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

  deleteIncident() {
    //
    if (!this._PermissionSystemService.can('INCIDENT', 'INCIDENT', 'DELETE'))
      return;
    this.loadDelted = true;
    this._IncidentService
      .deleteIncident(this.current_row_selected)
      .pipe(finalize(() => (this.loadDelted = false)))
      .subscribe({
        next: (res: any) => {
          this.loadDelted = false;
          this.closeDeleteModal();
          this.getIncidentsData(this.data_payload);

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

  data_payload: any;
  columnControl: any = {
    type: 'route',
    data: '/gfw-portal/incident/viewincident',
  };

  handleDataTable(event: any) {
    this.data_payload = event;
    this.getIncidentsData(event);
  }
}
