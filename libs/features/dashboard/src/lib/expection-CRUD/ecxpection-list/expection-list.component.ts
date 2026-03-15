import { TranslateService } from '@ngx-translate/core';
/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import {  DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import * as moment from 'moment';
import { ButtonModule } from 'primeng/button';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { DashboardLayoutService } from '../../../services/dashboard-layout.service';
import { NewTableComponent } from "libs/shared/shared-ui/src/lib/new-table/new-table.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-expection-list',
  imports: [TranslateModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    MenuModule, NewTableComponent],
  templateUrl: './expection-list.component.html',
  styleUrl: './expection-list.component.scss',
})
export class ExpectionListComponent  implements OnInit {
  loadDeleted: boolean = false;
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
  routesParams: any;
  loadingTable: boolean = true;
  dataTable: any[] = [];
  current_row_selected: any;

  thridId: any;

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _MessageService: MessageService,
    private _Router: Router,
    private _TranslateService: TranslateService,
    private _SharedService: SharedService,
    private _dashboardLayoutService: DashboardLayoutService,
    public _PermissionSystemService:PermissionSystemService
  ) {}

  ngOnInit(): void {
    const routeData = this._ActivatedRoute.snapshot.data;
    const param = this._ActivatedRoute.parent?.snapshot.params;

    this.routesParams = routeData;
    if (param) {
      this.thridId = param['id'];
      // this.thridId=0
         this.columnControl = {
      type: 'route',
      data: `/gfw-portal/third-party/${this.thridId}/overview-exception/`,
    };

    }
    
    this.items = [
      {
        label: this._TranslateService.instant('EXCEPTIONS.View_Exception'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._Router.navigate([
            `/gfw-portal/third-party/${this.thridId}/overview-exception`,
            this.current_row_selected,
          ]);
        },
        visible: ()=>this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYEXCEPTIONS' , 'VIEW')

      },
      {
        label: this._TranslateService.instant('EXCEPTIONS.Delete_Exception'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.handleShowDelete(true);
        },
           visible: ()=>this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYEXCEPTIONS' , 'DELETE')
      },
      {
        label: this._TranslateService.instant('EXCEPTIONS.Update_Exception'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this._Router.navigate([
            `/gfw-portal/third-party/${this.thridId}/update-exception`,
            this.current_row_selected,
          ]);
        },
           visible: ()=>this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYEXCEPTIONS' , 'EDIT')
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

  handleDataTable(event: any) {
    this.data_payload = event;
    this.getExceptionsData(event);
  }

  data_payload: any;


  columnControl: any;





  getExceptionsData(event?: any) {
    this.dataTable = [];
    this.loadingTable = true;
    this._dashboardLayoutService
      .getExceptionsList(
      event,
        this.routesParams.grcExceptionTypeID,
        // 0,
        this.thridId,
        this.routesParams.dataEntityTypeID
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

  deleteException() {
     if(!this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYEXCEPTIONS' , 'DELETE')) return;

    this.loadDeleted = true;
    this._dashboardLayoutService
      .deleteException(this.current_row_selected)
      .pipe(finalize(() => (this.loadDeleted = false)))
      .subscribe({
        next: () => {
          this.closeDeleteModal();
          this.getExceptionsData();

          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Exception Deleted Successfully',
          });
        },
        error: () => {
          this.loadDeleted = false;
        },
      });
  }

  addException() {
    this._Router.navigate([
      `/gfw-portal/third-party/${this.thridId}/add-exception`,
    ]);
  }
}
