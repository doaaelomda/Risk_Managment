import { DeleteConfirmPopupComponent } from './../../../../../shared/shared-ui/src/lib/delete-confirm-popup/delete-confirm-popup.component';
import { SharedUiComponent } from './../../../../../shared/shared-ui/src/lib/shared-ui/shared-ui.component';
import { LayoutService } from './../../../../../../apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedService } from './../../../../../shared/shared-ui/src/services/shared.service';
import { MessageService } from 'primeng/api';
import { PaginationInterface } from './../../../../../../apps/gfw-portal/src/app/core/models/pagination';
import { newProfile } from './../../../../../shared/shared-ui/src/models/newProfiles';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StandardDocsService } from '../services/standard-docs.service';
import { finalize } from 'rxjs';
import * as moment from 'moment';
import { ButtonModule } from 'primeng/button';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-standard-docs',
  imports: [
    CommonModule,
    TranslateModule,
    SharedUiComponent,
    ButtonModule,
    DeleteConfirmPopupComponent,
    NewTableComponent,
  ],
  templateUrl: './standard-docs.component.html',
  styleUrl: './standard-docs.component.css',
})
export class StandardDocsComponent {
  // ─────────────────────────────
  // General State
  // ─────────────────────────────
  loading = true;
  loadingDelete = false;
  deleteModalVisible = false;
  selectedRow: any = null;

  // ─────────────────────────────
  // Entity / Configuration
  // ─────────────────────────────
  private readonly FEATURE_KEY = 'GOVERNANCE_STANDARDS';
  private readonly FEATURE_NAME = 'DOCUMENT';
  private readonly featureDisplayName = 'Document';
  private readonly ENTITY_ROUTE = '/gfw-portal/library/standard-docs/';

  readonly updateRoute = '/gfw-portal/library/standard-docs/action';
  readonly viewRoute = '/gfw-portal/library/standard-docs/';
  readonly serviceName = '_standardDocsS';
  readonly entityIdField = 'governanceStandardID';
  readonly dataEntityId = 81;

  // ─────────────────────────────
  // Translatable Keys
  // ─────────────────────────────
  labels = {
    view: '',
    delete: '',
    update: '',
    add: '',
    titleDelete: '',
    descDelete: '',
    badge: '',
    table: '',
  };

  // ─────────────────────────────
  // Profiles + Table
  // ─────────────────────────────
  selectedProfileId = 0;
  entityProfiles: newProfile[] = [];
  defaultProfile!: newProfile;
  tableData: any[] = [];
  sortState: any = null;
  currentFilters: any[] = [];

  pagination: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 10,
    totalPages: 1,
  };

  // ─────────────────────────────
  // UI Actions
  // ─────────────────────────────
  actionItems: any[] = [];

  constructor(
    private router: Router,
    private messageService: MessageService,
    private sharedService: SharedService,
    private translate: TranslateService,
    private layout: LayoutService,
    private _standardDocsS: StandardDocsService,
    public _PermissionSystemService: PermissionSystemService
  ) {
    this.initBreadcrumb();
  }

  // ─────────────────────────────
  // Lifecycle
  // ─────────────────────────────
  ngOnInit(): void {
    this.initializeTranslations();
    this.setupActionItems();
  }

  // ─────────────────────────────
  // Translations & Labels
  // ─────────────────────────────
  private initializeTranslations(): void {
    const base = this.FEATURE_KEY;
    const name = this.FEATURE_NAME;

    this.labels = {
      view: `${base}.VIEW_${name}`,
      delete: `${base}.DELETE_${name}`,
      update: `${base}.UPDATE_${name}`,
      add: `${base}.ADD_NEW_${name}`,
      titleDelete: `${base}.DELETE_${name}_TITLE`,
      descDelete: `${base}.DELETE_${name}_DESC`,
      badge: `${base}.${name}`,
      table: `${base}.${name}S_LIST`,
    };
  }

  // ─────────────────────────────
  // Breadcrumb Setup
  // ─────────────────────────────
  private initBreadcrumb(): void {
    const containerKey = 'BREAD_CRUMB_TITLES.GOVERNANCE_STANDARDS';
    this.setBreadcrumb(containerKey, [
      { nameKey: containerKey, routerLink: this.ENTITY_ROUTE },
      { nameKey: `${this.FEATURE_KEY}.${this.FEATURE_NAME}S_LIST` },
    ]);
  }

  private setBreadcrumb(
    titleKey: string,
    links: { nameKey: string; icon?: string; routerLink?: string }[]
  ): void {
    this.layout.breadCrumbTitle.next(this.translate.instant(titleKey));
    const translatedLinks = [
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      ...links.map((link) => ({
        name: this.translate.instant(link.nameKey),
        icon: link.icon ?? '',
        ...(link.routerLink ? { routerLink: link.routerLink } : {}),
      })),
    ];
    this.layout.breadCrumbLinks.next(translatedLinks);
    this.layout.breadCrumbAction.next(null);
  }

  // ─────────────────────────────
  // Action Buttons
  // ─────────────────────────────
  private setupActionItems(): void {
    this.actionItems = [
      {
        label: this.translate.instant(this.labels.view),
        icon: 'fi fi-rr-eye',
        command: () => this.handleViewClick(),
        visible: () =>
          this._PermissionSystemService.can(
            'LIBRARY',
            'STANDARDDOCUMENTS',
            'VIEW'
          ),
      },
      {
        label: this.translate.instant(this.labels.delete),
        icon: 'fi fi-rr-trash',
        command: () => this.toggleDeleteModal(true),
        visible: () =>
          this._PermissionSystemService.can(
            'LIBRARY',
            'STANDARDDOCUMENTS',
            'DELETE'
          ),
      },
      {
        label: this.translate.instant(this.labels.update),
        icon: 'fi fi-rr-pencil',
        command: () => this.handleUpdateClick(),
        visible: () =>
          this._PermissionSystemService.can(
            'LIBRARY',
            'STANDARDDOCUMENTS',
            'EDIT'
          ),
      },
    ];
  }

  // ─────────────────────────────
  // Action Handlers
  // ─────────────────────────────
  handleViewClick(): void {
    console.log('Viewing', this.FEATURE_NAME);
    this.router.navigate([
      '/gfw-portal/library/standard-docs/' + this.selectedRow,
    ]);
  }

  handleUpdateClick(): void {
    this.router.navigate([
      '/gfw-portal/library/standard-docs/action/' + this.selectedRow,
    ]);
    console.log('Updating', this.FEATURE_NAME);
  }

  handleAddClick(): void {
    this.router.navigate(['/gfw-portal/library/standard-docs/action']);
    console.log('Adding', this.FEATURE_NAME);
  }

  toggleDeleteModal(visible: boolean): void {
    if (!visible) {
      this.selectedRow = null;
    }
    this.deleteModalVisible = visible;
  }

  delete(): void {
    if (
      !this._PermissionSystemService.can(
        'LIBRARY',
        'STANDARDDOCUMENTS',
        'DELETE'
      )
    )
      if (!this.selectedRow) return;
    this.loadingDelete = true;

    (this as any)[this.serviceName]
      .delete(this.selectedRow)
      .pipe(finalize(() => (this.loadingDelete = false)))
      .subscribe({
        next: () => {
          this.getListData(this.current_payload);
          this.toggleDeleteModal(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `${this.featureDisplayName} deleted successfully!`,
          });
        },
        error: () => (this.loadingDelete = false),
      });
  }

  current_payload: any;
  handleDataTable(payload: any) {
    this.current_payload = payload;
    this.getListData(this.current_payload);
  }
  getListData(event?: any): void {
    this.loading = true;
    this.tableData = [];

    (this as any)[this.serviceName]
      .findAll(event)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: any) => {
          const d = res?.data;
          this.tableData = d?.items;
          this.pagination = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this.sharedService.paginationSubject.next(this.pagination);
        },
        error: () => (this.loading = false),
      });
  }

  setSelected(event: any): void {
    this.selectedRow = event;
  }
}
