import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { ThirdPartyService } from '../../services/third-party.service';
import { NewTableComponent } from "libs/shared/shared-ui/src/lib/new-table/new-table.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-third-party-list',
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
  templateUrl: './third-party-list.component.html',
  styleUrl: './third-party-list.component.scss',
})
export class ThirdPartyListComponent implements OnInit {
  constructor(
    private _MessageService: MessageService,
    private _Router: Router,
    private _ThirdPartyService: ThirdPartyService,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.THIRD_PARTY'),
        icon: '',
        routerLink: '/gfw-portal/third-party',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.THIRD_PARTY_LIST'),
        icon: '',
        routerLink: '/gfw-portal/third-party/list',
      },
    ]);
  }

  // --------------------------
  // Attributes
  // --------------------------
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
  thirdPartyData: any;
  loadDataThirdParty = false;

  // --------------------------
  // Lifecycle
  // --------------------------
  ngOnInit(): void {
    this.items = [
      {
        label: this._TranslateService.instant('THIRD_PARTY.VIEW'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._Router.navigate(['/gfw-portal/third-party/view/' + this.current_row_selected]);
        },
        visible: ()=>this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTY' , 'VIEW')

      },
      {
        label: this._TranslateService.instant('THIRD_PARTY.DELETE'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.handleShowDelete(true);
        },
          visible: ()=>this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTY' , 'DELETE')
      },
      {
        label: this._TranslateService.instant('THIRD_PARTY.UPDATE'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this._Router.navigate(['/gfw-portal/third-party/edit',this.current_row_selected]);
        },
          visible: ()=>this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTY' , 'EDIT')
      },
    ];


  }

  // --------------------------
  // Methods
  // --------------------------

  handleClosedDelete(event?:any) {
    this.actionDeleteVisible = false;
  }

  handleShowDelete(event: boolean) {
    this.actionDeleteVisible = true;
  }

  setSelected(event: any) {
    this.current_row_selected = event;
  }


  handleDataTable(event: any) {
    this.data_payload = event;
    this.getThirdPartyData(event);
  }

  data_payload: any;


  columnControl: any= {
      type: 'route',
      data: `/gfw-portal/third-party/view`,
    };






  getThirdPartyData(event?: any) {
    this.dataTable = [];
    this.loadingTable = true;
    this._ThirdPartyService
      .getThirdPartyListSearch(
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
        error: () => (this.loadingTable = false),
      });
  }

  deleteThirdParty() {
     if(!this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTY' , 'DELETE')) return;

    this.loadDeleted = true;
    this._ThirdPartyService
      .deleteThirdParty(this.current_row_selected)
      .pipe(finalize(() => (this.loadDeleted = false)))
      .subscribe(() => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Third-party record deleted successfully',
        });
        this.getThirdPartyData(this.data_payload);
        this.handleClosedDelete();
      });
  }
}
