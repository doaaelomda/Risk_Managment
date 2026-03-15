import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

/* eslint-disable @nx/enforce-module-boundaries */
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { ThreatService } from '../../services/threat.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-thread-list',
  imports: [    CommonModule,
    TranslateModule,
    MenuModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    DialogModule,
    SkeletonModule,
  NewTableComponent],
  templateUrl: './threadList.component.html',
  styleUrl: './threadList.component.scss',
})
export class ThreadListComponent implements OnInit {
  constructor(
    private _MessageService: MessageService,
    private _Router: Router,
    private _ThreatService: ThreatService,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _ActivatedRoute: ActivatedRoute,
    public _PermissionSystemService:PermissionSystemService
  ) {
    // Breadcrumb setup
    this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('HEARDE_TABLE.THREATS'),
        icon: '',
        routerLink: '/gfw-portal/Threats-management/list',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.THREAT_LIST'),
        icon: '',
        routerLink: '/gfw-portal/Threats-management/list',
      },
    ]);
  }

  // ========================= ATTRIBUTES ========================= //
  loadDeleted = false;
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
  ThreatData: any;
  threatsProfiles: newProfile[] = [];
  defultProfile!: newProfile;
  loadDataThreat = false;

  // ========================= LIFECYCLE ========================= //
  ngOnInit(): void {
    this.items = [
      {
        label: this._TranslateService.instant('THREAT.VIEW'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._Router.navigate([
            '/gfw-portal/Threats-management',
            this.current_row_selected,
          ]);
        },
        visible: ()=> this._PermissionSystemService.can('THREATS' ,'THREATS' , 'VIEW')
      },
      {
        label: this._TranslateService.instant('THREAT.DELETE'),
        icon: 'fi fi-rr-trash',
        command: () => this.handleShowDelete(true),
        visible: ()=> this._PermissionSystemService.can('THREATS' ,'THREATS' , 'DELETE')
      },
      {
        label: this._TranslateService.instant('THREAT.UPDATE'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this._Router.navigate([
            '/gfw-portal/Threats-management/update-threat',
            this.current_row_selected,
          ]);
        },
        visible: ()=> this._PermissionSystemService.can('THREATS' ,'THREATS' , 'EDIT')
      },
    ];
  }

  // ========================= METHODS ========================= //
  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }

  handleClosedDelete(_: boolean) {
    this.actionDeleteVisible = false;
  }

  handleShowDelete(_: boolean) {
    this.actionDeleteVisible = true;
  }

  setSelected(event: any) {
    this.current_row_selected = event;
  }



  // ---- Get Data ----
  getThreatData(event?: any) {
    this.dataTable = [];
    this.loadingTable = true;
    this._ThreatService
      .getThreatSearch(
        event
      )
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
        error: () => {
          this.loadingTable = false;
        },
      });
  }

  // ---- Delete Threat ----
  deleteThreat() {
    if(!this._PermissionSystemService.can('THREATS' ,'THREATS' , 'DELETE')) return;
    this.loadDeleted = true;
    this._ThreatService
      .deleteThreat(this.current_row_selected)
      .pipe(finalize(() => (this.loadDeleted = false)))
      .subscribe(() => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this._TranslateService.instant('THREAT.DELETE_SUCCESS'),
        });
        this.getThreatData(this.data_payload);
        this.handleClosedDelete(false);
      });
  }
    columnControl: any = {
    type: 'route',
    data: '/gfw-portal/Threats-management/',
  };

  handleDataTable(event: any) {
    this.data_payload = event;
    this.getThreatData(event);
  }

  data_payload: any;

}

