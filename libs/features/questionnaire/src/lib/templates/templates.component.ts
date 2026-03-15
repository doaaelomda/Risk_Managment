import { LayoutService } from './../../../../../../apps/gfw-portal/src/app/core/services/layout.service';
import { DeleteConfirmPopupComponent } from './../../../../../shared/shared-ui/src/lib/delete-confirm-popup/delete-confirm-popup.component';
import { SharedService } from './../../../../../shared/shared-ui/src/services/shared.service';
import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { finalize, Subscription } from 'rxjs';
import { Button } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { TemplatesService } from '../services/templates-service.service';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-templates',
  imports: [
    CommonModule,
    TranslateModule,
    Button,
    DeleteConfirmPopupComponent,
    NewTableComponent
  ],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss',
})
export class TemplatesComponent implements OnDestroy {
  // ─────────────────────────────
  // General State
  // ─────────────────────────────
  loading = true;
  loadingDelete = false;
  deleteModalVisible = false;
  selectedRow: any = null;
  tablePayload:any
  // ─────────────────────────────
  // Entity / Configuration
  // ─────────────────────────────
  private readonly FEATURE_KEY = 'TEMPLATES';
  private readonly FEATURE_NAME = 'TEMPLATE';
  private readonly featureDisplayName = 'Template';
  private readonly ENTITY_ROUTE = '/gfw-portal/questionnaire';

  readonly updateRoute = '/gfw-portal/questionnaire/templates/update/';
  readonly viewRoute = '';
  readonly serviceName = '_templatesS';
  readonly entityIdField = 'questionnaireTemplateID';
  readonly dataEntityId = 79;
  columnControl: any = {
    type: 'route',
    data: '/gfw-portal/questionnaire/templates/',
  };
  private subscription: Subscription = new Subscription();
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
    private _templatesS: TemplatesService,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this.initBreadcrumb();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
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
    const containerKey = 'BREAD_CRUMB_TITLES.QUESTIONNAIRE';
    this.setBreadcrumb(containerKey, [
      { nameKey: containerKey },
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
        visible: ()=>this._PermissionSystemService.can('QUESTIONNAIRES' , 'TEMPLATES' , 'VIEW')
      },
      {
        label: this.translate.instant(this.labels.delete),
        icon: 'fi fi-rr-trash',
        command: () => this.toggleDeleteModal(true),
        visible: ()=>this._PermissionSystemService.can('QUESTIONNAIRES' , 'TEMPLATES' , 'DELETE')
      },
      {
        label: this.translate.instant(this.labels.update),
        icon: 'fi fi-rr-pencil',
        command: () => this.handleUpdateClick(),
        visible: ()=>this._PermissionSystemService.can('QUESTIONNAIRES' , 'TEMPLATES' , 'EDIT')
      },
    ];
  }

  // ─────────────────────────────
  // Action Handlers
  // ─────────────────────────────
  handleViewClick(event?: any): void {
    const id = event
      ? event[this.entityIdField]
      : this.selectedRow;
    this.router.navigate(['/gfw-portal/questionnaire/templates/' + id]);
  }

  handleUpdateClick(): void {
    this.router.navigate([
      '/gfw-portal/questionnaire/templates/update/' + this.selectedRow,
    ]);
  }

  handleAddClick(): void {
    this.router.navigate(['/gfw-portal/questionnaire/templates/add']);
  }

  toggleDeleteModal(visible: boolean): void {
      if(!visible) {this.selectedRow = null}
    this.deleteModalVisible = visible;
  }

  delete(): void {
     if(!this._PermissionSystemService.can('QUESTIONNAIRES' , 'TEMPLATES' , 'DELETE')) return;
    if (!this.selectedRow) return;
    this.loadingDelete = true;

    const sub=(this as any)[this.serviceName]
      .delete(this.selectedRow)
      .pipe(finalize(() => (this.loadingDelete = false)))
      .subscribe({
        next: () => {
          this.getData();
          this.toggleDeleteModal(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `${this.featureDisplayName} deleted successfully!`,
          });
        },
        error: () => (this.loadingDelete = false),
      });
      this.subscription.add(sub)
  }

  setSelected(event: any): void {
    this.selectedRow = event;
  }

    // ====================== Table Handling ======================
  /** Fetch table data from API */
  getData(payload?: any): void {
    this.loading = true;
    this.tableData = [];

    const sub=this._templatesS
      .findAll(payload)
      .pipe(
        finalize(() => (this.loading = false))
      )
      .subscribe({

        next: (res: any) => {
          this.tableData = res?.data?.items ?? [];
          this.pagination = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this.sharedService.paginationSubject.next(this.pagination);
        },
      });
      this.subscription.add(sub)
  }

  /** Handle table events (filter, sort, pagination) */
  handleDataTable(event: any): void {
    this.tablePayload = event;
    this.getData(event);
  }
}
