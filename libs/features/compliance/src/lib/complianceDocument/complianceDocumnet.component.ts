import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService, MenuItem } from 'primeng/api';

import { PrimengModule } from '@gfw/primeng';
import { DeleteConfirmPopupComponent } from './../../../../../shared/shared-ui/src/lib/delete-confirm-popup/delete-confirm-popup.component';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';

import { LayoutService } from './../../../../../../apps/gfw-portal/src/app/core/services/layout.service';
import { SharedService } from './../../../../../shared/shared-ui/src/services/shared.service';
import { ComplianceService } from '../../compliance/compliance.service';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-compliance-documnet',
  standalone: true,
  imports: [
    CommonModule,
    PrimengModule,
    TranslateModule,
    DeleteConfirmPopupComponent,
    NewTableComponent,
  ],
  templateUrl: './complianceDocumnet.component.html',
  styleUrl: './complianceDocumnet.component.scss',
})
export class ComplianceDocumnetComponent implements OnInit, OnDestroy {
  /** ===== State Variables ===== */

  /** Table data */
  dataTable: any[] = [];
  columnControl: any = {
    type: 'route',
    data: '/gfw-portal/compliance/overViewDocument/',
  };
  /** Selected row ID */
  selectedRowId!: number;

  /** Loading states */
  isLoading = true;
  isDeleting = false;

  /** Delete popup visibility */
  showDeletePopup = false;

  /** Context menu items */
  menuItems: any[] = [];

  /** Pagination object */
  pagination: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };

  /** Last payload from table */
  tablePayload: any;

  /** Unsubscribe notifier */
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private messageService: MessageService,
    private sharedService: SharedService,
    private translate: TranslateService,
    private layoutService: LayoutService,
    private complianceService: ComplianceService,
    public _PermissionSystemService:PermissionSystemService
  ) {}

  /* ================= Lifecycle ================= */

  ngOnInit(): void {
    this.setBreadcrumb();
    this.initMenuActions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  /**
   * Initialize context menu actions
   */
  private initMenuActions(): void {
    this.menuItems = [
      {
        label: this.translate.instant('MAIN_INFO.ViewDocument'),
        icon: 'fi fi-rr-eye',
        command: () => this.viewDocument(),
           visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'COMPLIANCEDOCUMENT' , 'VIEW')
      },
      {
        label: this.translate.instant('MAIN_INFO.UpdateDocument'),
        icon: 'fi fi-rr-pencil',
        command: () => this.updateDocument(),
           visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'COMPLIANCEDOCUMENT' , 'UPDATE')
      },
      {
        label: this.translate.instant('MAIN_INFO.DeleteDocument'),
        icon: 'fi fi-rr-trash',
        command: () => (this.showDeletePopup = true),
        visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'COMPLIANCEDOCUMENT' , 'DELETE')

      },
    ];
  }

  /**
   * Breadcrumb setup
   */
  private setBreadcrumb(): void {
    this.layoutService.breadCrumbLinks.next([
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      {
        name: 'Compliance Governance',
        routerLink: '/gfw-portal/complianceDocuments',
      },
      { name: 'Documents' },
    ]);
  }

  /* ================= Actions ================= */

  viewDocument(): void {
    if (!this.selectedRowId) return;
    this.router.navigate([
      '/gfw-portal/compliance/overViewDocument/',
      this.selectedRowId,
    ]);
  }

  updateDocument(): void {
    if (!this.selectedRowId) return;
    this.router.navigate([
      '/gfw-portal/compliance/updatecomplianceDocuments/',
      this.selectedRowId,
    ]);
  }

  addDocument(): void {
    this.router.navigate(['/gfw-portal/compliance/addcomplianceDocuments']);
  }

  /**
   * Delete document
   */
  confirmDelete(): void {
    if (!this.selectedRowId) return;

    this.isDeleting = true;

    this.complianceService
      .deleteDocument(this.selectedRowId)
      .pipe(
        finalize(() => (this.isDeleting = false)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.showDeletePopup = false;
        this.getData(this.tablePayload);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.translate.instant('DOCUMENTS.DELETE_SUCCESS'),
        });
      });
  }

  closeDeleteModal() {
    this.showDeletePopup = false;
  }

  /* ================= Table ================= */

  /**
   * Get table data
   */
  getData(payload?: any): void {
    this.isLoading = true;
    this.dataTable = [];

    this.complianceService
      .getGovermentSearch(payload)
      .pipe(
        finalize(() => (this.isLoading = false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res: any) => {
          this.dataTable = res?.data?.items ?? [];
          this.pagination = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this.sharedService.paginationSubject.next(this.pagination);
        },
      });
  }

  /**
   * Handle table events
   */
  handleTableChange(event: any): void {
    this.tablePayload = event;
    this.getData(event);
  }

  /**
   * Row selection
   */
  setSelectedRow(id: number): void {
    this.selectedRowId = id;
  }
}
