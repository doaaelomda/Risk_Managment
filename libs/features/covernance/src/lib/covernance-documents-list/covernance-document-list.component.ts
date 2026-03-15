import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { LayoutService } from './../../../../../../apps/gfw-portal/src/app/core/services/layout.service';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { MenuModule } from 'primeng/menu';
import { MessageService } from 'primeng/api';
import { GovDocumentsService } from '../../service/covDocument.service';
import { NewTableComponent } from "libs/shared/shared-ui/src/lib/new-table/new-table.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-covernance-document-list',
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
  templateUrl: './covernance-document-list.component.html',
  styleUrls: ['./covernance-document-list.component.scss'],
})
export class CovernanceDocumentListComponent implements OnInit {
  columnControl:any={
    type:'route',
    data:'/gfw-portal/governance/Document-action/viewDocument'
  }
  constructor(
    private _Router: Router,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _MessageService: MessageService,
    private _GovDocumentsService: GovDocumentsService,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.GOVERNANCE_DOCUMENTS'),
        icon: '',
        routerLink: '/gfw-portal/governance/documents',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.GOVERNANCE_DOCUMENTS_LIST'),
        icon: '',
        routerLink: '/gfw-portal/governance/documents',
      },
    ]);
  }
  currnet_payload:any
handleDataTable(event:any){
  this.currnet_payload =event
  this.getDocumentsData(event)
}
  // attributes
  items: any[] = [];
  loadDeleted = false;
  actionDeleteVisible = false;
  loadingTable = true;
  current_row_selected: any;
  sort_data: any;
  current_filters: any[] = [];
  dataTable: any[] = [];
  selected_profile_column = 0;
  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };

  ngOnInit(): void {
    this.items = [
      {
        label: this._TranslateService.instant('DOCUMENTS.VIEW_DOCUMENT'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._Router.navigate(['/gfw-portal/governance/Document-action/viewDocument/' + this.current_row_selected]);
        },
        visible: ()=>this._PermissionSystemService.can('GOVERNANCE' , 'GOVDOCUMENT' , 'VIEW')


      },
      {
        label: this._TranslateService.instant('DOCUMENTS.DELETE_DOCUMENT'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.handleShowDelete(true);
        },
         visible: ()=>this._PermissionSystemService.can('GOVERNANCE' , 'GOVDOCUMENT' , 'DELETE')
      },
      {
        label: this._TranslateService.instant('DOCUMENTS.UPDATE_DOCUMENT'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this._Router.navigate(['/gfw-portal/governance/Document-action', this.current_row_selected]);
        },
         visible: ()=>this._PermissionSystemService.can('GOVERNANCE' , 'GOVDOCUMENT' , 'EDIT')
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



  getDocumentsData(event?: any) {
    this.dataTable = [];
    this.loadingTable = true;

    this._GovDocumentsService
      .getDocumentsSearchNew(event)
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

  deleteDocument() {
    this.loadDeleted = true;
    this._GovDocumentsService
      .deleteDocument(this.current_row_selected)
      .pipe(finalize(() => (this.loadDeleted = false)))
      .subscribe(() => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this._TranslateService.instant('DOCUMENTS.DELETE_SUCCESS'),
        });
        this.getDocumentsData(this.currnet_payload);
        this.handleClosedDelete(false);
      });
  }

  onViewModalDocument(event?: any) {
    // open modal for document details if you have modal view
  }
}
