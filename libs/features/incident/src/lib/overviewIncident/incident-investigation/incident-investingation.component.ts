import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { InvestigationService } from '../../../services/investigation.service';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { finalize } from 'rxjs';
import * as moment from 'moment';
import { Button } from 'primeng/button';
import { DeleteConfirmPopupComponent, SharedUiComponent } from '@gfw/shared-ui';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';

@Component({
  selector: 'lib-incident-investingation',
  imports: [
    CommonModule,
    Button,
    DeleteConfirmPopupComponent,
    NewTableComponent,
    TranslateModule,
  ],
  templateUrl: './incident-investingation.component.html',
  styleUrl: './incident-investingation.component.scss',
})
export class IncidentInvestingationComponent {
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
  private readonly FEATURE_KEY = 'INVESTIGATIONS';
  private readonly FEATURE_NAME = 'INVESTIGATION';
  private readonly featureDisplayName = 'Investigation';
  ENTITY_ROUTE = '';

  updateRoute = '';
  viewRoute = '';
  readonly serviceName = '_investigationS';
  readonly entityIdField = 'incidentInvestigationID';
  readonly dataEntityId = 110;

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
    private _investigationS: InvestigationService,
    private _activeRoute: ActivatedRoute,
    public _PermissionSystemService: PermissionSystemService
  ) {
    this.getIncidentId();
    this.initBreadcrumb();
  }

  // ─────────────────────────────
  // Lifecycle
  // ─────────────────────────────
  ngOnInit(): void {
    this.initializeTranslations();
    this.setupActionItems();
  }
  incidentId!: number;
  getIncidentId() {
    const id = this._activeRoute.parent?.snapshot.paramMap.get('id');
    if (!id) return;
    this.incidentId = +id;
    this.ENTITY_ROUTE = `/gfw-portal/incident/${this.incidentId}/investigations`;
    this.updateRoute = `/gfw-portal/incident/${this.incidentId}/investigations/update`;
    this.viewRoute = `/gfw-portal/incident/${this.incidentId}/investigations`;
    this.columnControl= {
    type: 'route',
    data: this.viewRoute,
  };
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
    const containerKey = 'BREAD_CRUMB_TITLES.INVESTIGATIONS';
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
            'INCIDENT',
            'INCIDENTINVESTIGATIONS',
            'VIEW'
          ),
      },
      {
        label: this.translate.instant(this.labels.delete),
        icon: 'fi fi-rr-trash',
        command: () => this.toggleDeleteModal(true),
        visible: () =>
          this._PermissionSystemService.can(
            'INCIDENT',
            'INCIDENTINVESTIGATIONS',
            'DELETE'
          ),
      },
      {
        label: this.translate.instant(this.labels.update),
        icon: 'fi fi-rr-pencil',
        command: () => this.handleUpdateClick(),
        visible: () =>
          this._PermissionSystemService.can(
            'INCIDENT',
            'INCIDENTINVESTIGATIONS',
            'EDIT'
          ),
      },
    ];
  }

  // ─────────────────────────────
  // Action Handlers
  // ─────────────────────────────
  handleViewClick(): void {
    this.router.navigate([`${this.viewRoute}/${this.selectedRow}`]);

    console.log('Viewing', this.FEATURE_NAME);
  }

  handleUpdateClick(): void {
    this.router.navigate([`${this.updateRoute}/${this.selectedRow}`]);
    console.log('Updating', this.FEATURE_NAME);
  }

  handleAddClick(): void {
    this.router.navigate([
      `/gfw-portal/incident/${this.incidentId}/investigations/add`,
    ]);
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
      !this._PermissionSystemService.can('INCIDENT', 'INCIDENTINVESTIGATIONS', 'DELETE')
    )
      return;
    if (!this.selectedRow) return;
    this.loadingDelete = true;

    (this as any)[this.serviceName]
      .delete(this.selectedRow)
      .pipe(finalize(() => (this.loadingDelete = false)))
      .subscribe({
        next: () => {
          this.getListData();
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

  getListData(payload?: any): void {
    this.loading = true;
    this.tableData = [];

    (this as any)[this.serviceName]
      .findAll(payload)
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

  data_payload: any;
  columnControl: any

  handleDataTable(event: any) {
    this.data_payload = event;
    this.getListData(event);
  }
}
