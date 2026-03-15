import { RiskService } from './../../../../risks/src/services/risk.service';
import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { finalize, Subscription } from 'rxjs';
import { Button } from 'primeng/button';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { InstanceService } from '../services/instance.service';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-instance-list',
  imports: [
    CommonModule,
    Button,
    DeleteConfirmPopupComponent,
    TranslateModule,
    NewTableComponent,
  ],
  templateUrl: './instance-list.component.html',
  styleUrl: './instance-list.component.scss',
})
export class InstanceListComponent implements OnDestroy {
  // ─────────────────────────────
  // General State
  // ─────────────────────────────
  loading = true;
  loadingDelete = false;
  deleteModalVisible = false;
  selectedRow: any = null;
  tablePayload: any;
  // ─────────────────────────────
  // Entity / Configuration
  // ─────────────────────────────
  private readonly FEATURE_KEY = 'INSTANCES';
  private readonly FEATURE_NAME = 'INSTANCE';
  private readonly featureDisplayName = 'Instance';
  private readonly ENTITY_ROUTE = '/gfw-portal/questionnaire';
  readonly updateRoute = '/gfw-portal/risks-management/risk-action';
  viewRoute: any;
  readonly serviceName = '_instanceS';
  readonly entityIdField = 'questionnaireInstanceID';
  readonly dataEntityId = 74;
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
  tableData: any[] = [];
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
  moduleName!:string
  featureName!:string
  constructor(
    private router: Router,
    private messageService: MessageService,
    private sharedService: SharedService,
    private translate: TranslateService,
    private layout: LayoutService,
    private _instanceS: InstanceService,
    private ActivatedRoute: ActivatedRoute,
    private _RiskService: RiskService,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this.initBreadcrumb();
    const routeData = this.ActivatedRoute.snapshot.data
    this.moduleName = routeData['permissions'].module
    this.featureName = routeData['permissions'].feature
    
  }

  // ─────────────────────────────
  // Lifecycle
  // ─────────────────────────────
  ngOnInit(): void {
    this.initializeTranslations();
    this.setupActionItems();
    this.viewEntity();
  }
  viewEntity() {
    if (!this.dataResolver?.entityId) {
      this.viewRoute = {
        type: 'route',
        data: '/gfw-portal/questionnaire/instance',
      };
      return;
    } else {
      const routeData = this.ActivatedRoute.snapshot.data;
      const viewPath = routeData['paramView'];
      const instanceSegment = this.selectedRow ? `/${this.selectedRow}` : '';

      const finalPath = viewPath.replace('${id}', this.dataResolver.entityId);

      this.viewRoute = {
        type: 'route',
        data: finalPath,
      };
    }
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
  finalLinks: any;
  dataResolver: any;
  private initBreadcrumb(): void {
    this.ActivatedRoute.data.subscribe((res) => {
      const resolvedHandler = res['resolvedHandler'];
      this.dataResolver = resolvedHandler;

      const paramEntityPath =
        resolvedHandler?.paramList || '/gfw-portal/questionnaire/instance';

      const routerLink = paramEntityPath.replace(
        '${id}',
        '/' + this.dataResolver?.entityId
      );

      const breadcrumb = resolvedHandler?.current_breadCrumb;
      const containerKey = 'BREAD_CRUMB_TITLES.QUESTIONNAIRE';
      const newLinks = [
        {
          nameKey: containerKey,
          routerLink,
        },
        { nameKey: `${this.FEATURE_KEY}.${this.FEATURE_NAME}S_LIST` },
      ];

      const shouldMerge = !!breadcrumb;

      if (this.dataResolver?.entityId) {
        this.viewEntity();
      }

      this.setBreadcrumb(breadcrumb ?? '', newLinks, shouldMerge);
    });
  }

  private setBreadcrumb(
    titleKey: string,
    links: {
      nameKey?: string;
      name?: string;
      icon?: string;
      routerLink?: string;
    }[],
    merge: boolean = false
  ): void {
    this.layout.breadCrumbTitle.next(titleKey);

    this.finalLinks = links.map((link) => ({
      name:
        link.name ?? (link.nameKey ? this.translate.instant(link.nameKey) : ''),
      icon: link.icon ?? '',
      ...(link.routerLink ? { routerLink: link.routerLink } : {}),
    }));

    if (merge) {
      const currentLinks = this.layout.breadCrumbLinks.getValue() || [];
      this.finalLinks = [...currentLinks, ...this.finalLinks].filter(
        (link, index, self) =>
          self.findIndex((l) => l.name === link.name) === index
      );
    }

    this.layout.breadCrumbLinks.next(this.finalLinks);
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
        visible: ()=>this._PermissionSystemService.can(this.moduleName , this.featureName , 'VIEW')

      },
      ...(this.dataResolver?.entityId
        ? [
            {
              label: this.translate.instant(this.labels.delete),
              icon: 'fi fi-rr-trash',
              command: () => this.toggleDeleteModal(true),
               visible: ()=>this._PermissionSystemService.can(this.moduleName , this.featureName , 'DELETE')
            },
            {
              label: this.translate.instant(this.labels.update),
              icon: 'fi fi-rr-pencil',
              command: () => this.handleUpdateClick(),
               visible: ()=>this._PermissionSystemService.can(this.moduleName , this.featureName , 'EDIT')
            },
          ]
        : []),
    ];
  }

  // ─────────────────────────────
  // Action Handlers
  // ─────────────────────────────
  baseUrl = '/gfw-portal/questionnaire/instance';
  handleViewClick(): void {
    const routeData = this.ActivatedRoute.snapshot.data;
    const viewPath = routeData['paramView'];

    if (!viewPath) {
      this.router.navigate([`${this.baseUrl}/${this.selectedRow}`]);
    } else {
      const basePath = viewPath.replace('${id}', this.dataResolver.entityId);
      const finalPath = `${basePath}/${this.selectedRow}`;
      this.router.navigate([finalPath]);
    }
  }

  handleUpdateClick(): void {
    const routeData = this.ActivatedRoute.snapshot.data;
    const actionPath = routeData['paramAction'];

    if (!actionPath) {
      this.router.navigate([`${this.baseUrl}/update/${this.selectedRow}`]);
    } else {
      const basePath = actionPath.replace('${id}', this.dataResolver.entityId);
      const finalPath = `${basePath}/${this.selectedRow}`;
      this.router.navigate([finalPath]);
    }
  }

  handleAddClick(): void {
    const routeData = this.ActivatedRoute.snapshot.data;
    const actionPath = routeData['paramAction'];
    if (!actionPath) {
      this.router.navigate([`${this.baseUrl}/add`]);
    } else {
      const finalPath = actionPath.replace('${id}', this.dataResolver.entityId);
      this.router.navigate([finalPath]);
    }
  }

  toggleDeleteModal(visible: boolean): void {
    if (!visible) {
      this.selectedRow = null;
    }
    this.deleteModalVisible = visible;
  }

  delete(): void {
     if(!this._PermissionSystemService.can(this.moduleName , this.featureName , 'DELETE')) return;

    if (!this.selectedRow) return;
    this.loadingDelete = true;

    const deleteSub = (this as any)[this.serviceName]
      .delete(this.selectedRow)
      .pipe(finalize(() => (this.loadingDelete = false)))
      .subscribe({
        next: () => {
          this.getData(this.tablePayload);
          this.toggleDeleteModal(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail:
              `${this.featureDisplayName}` +
              this.translate.instant('ATTACHMENT.deleted_successfully'),
          });
          this.deleteModalVisible = false;
        },
        error: () => (this.loadingDelete = false),
      });
    this.subscription.add(deleteSub);
  }

  setSelected(event: any): void {
    this.selectedRow = event;
  }

  // ====================== Table Handling ======================
  /** Fetch table data from API */
  getData(payload?: any): void {
    this.loading = true;
    this.tableData = [];
    const sub = this._instanceS
      .findAll(
        payload,
        this.dataResolver?.entityId,
        this.dataResolver?.dataEntityTypeId
      )
      .pipe(finalize(() => (this.loading = false)))
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
    this.subscription.add(sub);
  }

  /** Handle table events (filter, sort, pagination) */
  handleDataTable(event: any): void {
    this.tablePayload = event;
    this.getData(event);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
