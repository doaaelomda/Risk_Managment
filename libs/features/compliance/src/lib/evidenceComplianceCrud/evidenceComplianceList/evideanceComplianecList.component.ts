import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { finalize, Subscription } from 'rxjs';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { ComplianceAssessmntService } from '../../../services/compliance-assessmnt.service';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-evideance-complianec-list',
  imports: [
    CommonModule,
    TranslateModule,
    MenuModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    DialogModule,
    SkeletonModule,
    NewTableComponent,
  ],
  templateUrl: './evideanceComplianecList.component.html',
  styleUrl: './evideanceComplianecList.component.scss',
})
export class EvideanceComplianecListComponent implements OnInit, OnDestroy {
  // Declaration Variable
  private subscriptions: Subscription = new Subscription();
  dataTable: any[] = [];
  loadingTable = true;
  paginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  columnControl: any = {
    type: 'route',
    data: `gfw-portal/compliance/evidenceType`,
  };
  items: any[] = [];
  current_row_selected: any;
  actionDeleteVisible = false;
  current_evidence_payload: any;
  loadDeleted = false;

  // Declaration Contractor
  constructor(
    private _MessageService: MessageService,
    private _Router: Router,
    private _ComplianceService: ComplianceAssessmntService,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    public _PermissionSystemService:PermissionSystemService
  ) {}

  // Set breadcrumbs
  setBreadcrumbs() {
    this._LayoutService.breadCrumbLinks.next([
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      {
        name: this._TranslateService.instant(
          'HEARDE_TABLE.EVIDENCE_COMPLIANCE'
        ),
        icon: '',
        routerLink: '/gfw-portal/compliance/evidenceType',
      },
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.EVIDENCE_COMPLIANCE_LIST'
        ),
        icon: '',
        routerLink: '/gfw-portal/compliance/evidenceType',
      },
    ]);
  }
  // Set selected row
  setSelectedRow(event: any) {
    this.current_row_selected = event;
  }

  // Define table action items
  setActionItem() {
    this.items = [
      {
        label: this._TranslateService.instant('EVIDENCE_COMPLIANCE.VIEW'),
        icon: 'fi fi-rr-eye',
        command: () => this.viewEvidence(),
        visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'EVIDENCECOMPLIANCE' , 'VIEW')

      },
      {
        label: this._TranslateService.instant('EVIDENCE_COMPLIANCE.DELETE'),
        icon: 'fi fi-rr-trash',
        command: () => this.handleShowDelete(true),
             visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'EVIDENCECOMPLIANCE' , 'DELETE')
      },
      {
        label: this._TranslateService.instant('EVIDENCE_COMPLIANCE.UPDATE'),
        icon: 'fi fi-rr-pencil',
        command: () => this.updateEvidence(),
             visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'EVIDENCECOMPLIANCE' , 'EDIT')
      },
    ];
  }

  // Handle data table refresh
  handleDataTable(payload: any = null) {
    this.current_evidence_payload = payload;
    this.getDataTable(payload);
  }

  // Get data table from API
  getDataTable(payload: any) {
    this.loadingTable = true;
    this.dataTable = [];
    const sub = this._ComplianceService
      .getEvidenceComplianceSearch(payload)
      .pipe(finalize(() => (this.loadingTable = false)))
      .subscribe({
        next: (res: any) => {
          this.dataTable = res?.data?.items;
          this.paginationObj = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this._SharedService.paginationSubject.next(this.paginationObj);
        },
      });

    this.subscriptions.add(sub);
  }

  // Navigate to view evidence
  private viewEvidence() {
    this._Router.navigate([
      '/gfw-portal/compliance/evidenceType',
      this.current_row_selected,
    ]);
  }

  // Navigate to update evidence
  private updateEvidence() {
    this._Router.navigate([
      '/gfw-portal/compliance/update-EvidenceType',
      this.current_row_selected,
    ]);
  }

  // Delete actions
  handleShowDelete(visible: boolean) {
    this.actionDeleteVisible = visible;
  }

  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }

  handleClosedDelete(_: boolean) {
    this.actionDeleteVisible = false;
  }

  // Delete Evidence Compliance
  deleteEvidenceCompliance() {
    if(!this._PermissionSystemService.can('COMPLIANCE' , 'EVIDENCECOMPLIANCE' , 'DELETE'))return
    this.loadDeleted = true;
    const sub = this._ComplianceService
      .deleteEvidenceCompliance(this.current_row_selected)
      .pipe(finalize(() => (this.loadDeleted = false)))
      .subscribe(() => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this._TranslateService.instant(
            'EVIDENCE_COMPLIANCE.DELETE_SUCCESS'
          ),
        });
        // Refresh table
        this.handleDataTable(this.current_evidence_payload);
        this.handleClosedDelete(false);
      });

    this.subscriptions.add(sub);
  }

  // Life Cycle Hooks
  ngOnInit(): void {
    this.setBreadcrumbs();
    this.setActionItem();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
