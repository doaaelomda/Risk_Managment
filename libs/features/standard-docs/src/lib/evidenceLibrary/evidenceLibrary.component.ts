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
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { EvidenceLibraryService } from '../services/evidence-libraray.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-evidence-library',
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
  templateUrl: './evidenceLibrary.component.html',
  styleUrl: './evidenceLibrary.component.scss',
})
export class EvidenceLibraryComponent implements OnInit, OnDestroy {
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
    data: `gfw-portal/library/evidence-library`,
  };

  items: any[] = [];
  current_row_selected: any;
  actionDeleteVisible = false;
  current_evidence_payload: any;
  loadDeleted = false;

  constructor(
    private _MessageService: MessageService,
    private _Router: Router,
    private _LibraryService: EvidenceLibraryService,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    public _PermissionSystemService: PermissionSystemService
  ) {}

  setBreadcrumbs() {
    this._LayoutService.breadCrumbLinks.next([
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      {
        name: this._TranslateService.instant('HEARDE_TABLE.EVIDENCE_LIBRARY'),
        icon: '',
        routerLink: '/gfw-portal/library/evidence-library',
      },
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.EVIDENCE_LIBRARY_LIST'
        ),
        icon: '',
        routerLink: '/gfw-portal/library/evidence-library',
      },
    ]);
  }

  setSelectedRow(event: any) {
    this.current_row_selected = event;
  }

  setActionItem() {
    this.items = [
      {
        label: this._TranslateService.instant('EVIDENCE_LIBRARY.VIEW'),
        icon: 'fi fi-rr-eye',
        command: () => this.viewEvidence(),
        visible: () =>
          this._PermissionSystemService.can(
            'LIBRARY',
            'EVIDENCELIBRARY',
            'VIEW'
          ),
      },
      {
        label: this._TranslateService.instant('EVIDENCE_LIBRARY.DELETE'),
        icon: 'fi fi-rr-trash',
        command: () => this.handleShowDelete(true),
        visible: () =>
          this._PermissionSystemService.can(
            'LIBRARY',
            'EVIDENCELIBRARY',
            'DELETE'
          ),
      },
      {
        label: this._TranslateService.instant('EVIDENCE_LIBRARY.UPDATE'),
        icon: 'fi fi-rr-pencil',
        command: () => this.updateEvidence(),
        visible: () =>
          this._PermissionSystemService.can(
            'LIBRARY',
            'EVIDENCELIBRARY',
            'EDIT'
          ),
      },
    ];
  }

  handleDataTable(payload: any = null) {
    this.current_evidence_payload = payload;
    this.getDataTable(payload);
  }

  getDataTable(payload: any) {
    this.loadingTable = true;
    this.dataTable = [];

    const sub = this._LibraryService
      .getEvidenceLibrarySearch(payload)
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

  private viewEvidence() {
    this._Router.navigate([
      '/gfw-portal/library/evidence-library',
      this.current_row_selected,
    ]);
  }

  private updateEvidence() {
    this._Router.navigate([
      '/gfw-portal/library/update-evidence-library',
      this.current_row_selected,
    ]);
  }

  handleShowDelete(visible: boolean) {
    this.actionDeleteVisible = visible;
  }

  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }

  handleClosedDelete(_: boolean) {
    this.actionDeleteVisible = false;
  }

  deleteEvidenceLibrary() {
    if (
      !this._PermissionSystemService.can('LIBRARY', 'EVIDENCELIBRARY', 'DELETE')
    )
      return;
    this.loadDeleted = true;
    const sub = this._LibraryService
      .deleteEvidenceLibrary(this.current_row_selected)
      .pipe(finalize(() => (this.loadDeleted = false)))
      .subscribe(() => {
        this._MessageService.add({
          severity: 'success',
          summary: this._TranslateService.instant('COMMON.SUCCESS'),
          detail: this._TranslateService.instant(
            'EVIDENCE_LIBRARY.DELETE_SUCCESS'
          ),
        });

        this.handleDataTable(this.current_evidence_payload);
        this.handleClosedDelete(false);
      });

    this.subscriptions.add(sub);
  }

  ngOnInit(): void {
    this.setBreadcrumbs();
    this.setActionItem();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
