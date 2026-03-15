import { TranslateService, TranslateModule } from '@ngx-translate/core';
/* eslint-disable @nx/enforce-module-boundaries */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { finalize } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { MethodologyAppetiteService } from 'libs/features/risks/src/services/methodology-appetite.service';
import { NewTableComponent } from "libs/shared/shared-ui/src/lib/new-table/new-table.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-appetite-list',
  imports: [
    CommonModule,
    TranslateModule,
    MenuModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    DialogModule,
    SkeletonModule,
    ReactiveFormsModule,
    FormsModule,
    NewTableComponent
],
  templateUrl: './appetiteList.component.html',
  styleUrl: './appetiteList.component.scss',
})
export class AppetiteListComponent {
  items: any[] = [];
  selected_profile_column: number = 0;
   pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  loadingTable: boolean = true;
  actionDeleteVisible: boolean = false;
  loadDeleted: boolean = false;
  dataTable: any[] = [];

  current_row_selected: any;
  sort_data: any;
  current_filters: any;
  riskMethodologyID: any;
  constructor(
    private _MethodologyAppetiteService: MethodologyAppetiteService,
    private _SharedService: SharedService,
    private _MessageService: MessageService,
    private _TranslateService: TranslateService,
    private activatedRoute: ActivatedRoute,
    private _router:Router,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this.riskMethodologyID =
      this.activatedRoute.parent?.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.items = [
      {
        label: this._TranslateService.instant('Appetite.VIEW'),
        icon: 'fi fi-rr-eye',
        command: () => this.onViewAppetite(),
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGYAPPETITE' , 'VIEW')

      },
      {
        label: this._TranslateService.instant('Appetite.DELETE_TITLE'),
        icon: 'fi fi-rr-trash',
        command: () => this.handleShowDelete(true),
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGYAPPETITE' , 'DELETE')
      },
      {
        label: this._TranslateService.instant('Appetite.UPDATE'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this._router.navigate([`/gfw-portal/risks-management/methodolgy/${this.riskMethodologyID}/update-appetite/${this.current_row_selected}`])
        },
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGYAPPETITE' , 'EDIT')
      },
    ];
  }



    handleDataTable(event: any) {
    this.data_payload = event;
    this.getAppetiteData(event);
  }

  data_payload: any;


  columnControl: any;






getAppetiteData(event?: any) {
  this.loadingTable = true;
  this._MethodologyAppetiteService.getAppetite(
    event,
    this.riskMethodologyID
  ).pipe(finalize(() => this.loadingTable = false))
   .subscribe((res: any) => {
      this.dataTable = res?.data?.items;
      this.pageginationObj = {
        perPage: res?.data?.pageSize,
        currentPage: res?.data?.pageNumber,
        totalItems: res?.data?.totalCount,
        totalPages: res?.data?.totalPages,
      };
      this._SharedService.paginationSubject.next(this.pageginationObj);
   });
}


  handleShowDelete(event: boolean) {
    this.actionDeleteVisible = true;
  }

  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }

  deleteAppetite() {
     if(!this._PermissionSystemService.can('RISKS' , 'METHODOLOGYAPPETITE' , 'DELETE')) return;
    this.loadDeleted = true;
    this._MethodologyAppetiteService
      .deleteAppetite(this.current_row_selected)
      .pipe(finalize(() => (this.loadDeleted = false)))
      .subscribe(() => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this._TranslateService.instant('Appetite.DELETE_SUCCESS'),
        });
        this.getAppetiteData();
        this.closeDeleteModal();
      });
  }

  showViewOptionPopup:boolean=false
  appetiteData:any
  loading:boolean=false
  onViewAppetite(event?: any) {
    this.showViewOptionPopup = true;
    this.loading=true
    this.appetiteData = null;
    this._MethodologyAppetiteService
      .getAppetiteById(event?.riskAppetiteID || this.current_row_selected)
      .subscribe((res: any) => {
        this.appetiteData = res?.data;
        this.loading=false
      });
  }

  setSelected(event: any) {
    this.current_row_selected = event;
  }
}
