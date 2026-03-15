import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { Button } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { ClosureService } from '../../../services/closure.service';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';

@Component({
  selector: 'lib-incident-closure',
  imports: [
    CommonModule,
    DeleteConfirmPopupComponent,
    Button,
    TranslateModule,
    NewTableComponent,
  ],
  templateUrl: './incident-closure.component.html',
  styleUrl: './incident-closure.component.scss',
})
export class IncidentClosureComponent {
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
  private readonly FEATURE_KEY = 'INCIDENT';
  private readonly FEATURE_NAME = 'CLOSURE';
  private readonly featureDisplayName = 'Closure';

  updateRoute = '';
  viewRoute = '';
  readonly serviceName = 'closureService';
  readonly entityIdField = 'incidentClosureID';
  readonly dataEntityId = 111;
  readonly filtersId = 1;
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
    private closureService: ClosureService,
    private route: ActivatedRoute,
    public _PermissionSystemService: PermissionSystemService
  ) {
    this.getIncidentId();
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
  incidentId!: number;
  getIncidentId() {
    const id = this.route.snapshot.parent?.paramMap.get('id');
    if (!id) return;
    this.incidentId = +id;
    this.viewRoute = `/gfw-portal/incident/${this.incidentId}/closure`;
    this.updateRoute = `/gfw-portal/incident/${this.incidentId}/closure/update`;
    this.columnControl = {
      type: 'route',
      data: this.viewRoute,
    };
  }
  // ─────────────────────────────
  // Breadcrumb Setup
  // ─────────────────────────────

  // ─────────────────────────────
  // Action Buttons
  // ─────────────────────────────
  private setupActionItems(): void {
    this.actionItems = [
      {
        label: this.translate.instant(this.labels.view),
        icon: 'fi fi-rr-eye',
        command: () => this.handleViewClick(),
        visible: ()=> this._PermissionSystemService.can('INCIDENT' , 'INCIDENTCLOSURE' , 'VIEW')
      },
      {
        label: this.translate.instant(this.labels.delete),
        icon: 'fi fi-rr-trash',
        command: () => this.toggleDeleteModal(true),
        visible: ()=> this._PermissionSystemService.can('INCIDENT' , 'INCIDENTCLOSURE' , 'DELETE')
      },
      {
        label: this.translate.instant(this.labels.update),
        icon: 'fi fi-rr-pencil',
        command: () => this.handleUpdateClick(),
        visible: ()=> this._PermissionSystemService.can('INCIDENT' , 'INCIDENTCLOSURE' , 'EDIT')
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
      `/gfw-portal/incident/${this.incidentId}/closure/add`,
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
    if (!this.selectedRow) return;
    this.loadingDelete = true;

    (this as any)[this.serviceName]
      .delete(this.selectedRow)
      .pipe(finalize(() => (this.loadingDelete = false)))
      .subscribe({
        next: () => {
          this.getListData(this.data_payload);
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
  columnControl: any;

  handleDataTable(event: any) {
    this.data_payload = event;
    this.getListData(event);
  }
}
