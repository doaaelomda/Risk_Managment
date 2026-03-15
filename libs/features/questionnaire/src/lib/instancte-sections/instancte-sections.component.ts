import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { InstanceService } from '../services/instance.service';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { finalize, switchMap } from 'rxjs';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { CardsListComponent } from 'libs/shared/shared-ui/src/lib/cards-list/cards-list.component';
import { Button } from 'primeng/button';
import { InstanceSectionsService } from '../services/instance-sections.service';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-instancte-sections',
  imports: [
    CommonModule,
    DeleteConfirmPopupComponent,
    CardsListComponent,
    Button,
    TranslateModule,
  ],
  templateUrl: './instancte-sections.component.html',
  styleUrl: './instancte-sections.component.scss',
})
export class InstancteSectionsComponent {
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
  private readonly FEATURE_KEY = 'SECTIONS';
  private readonly FEATURE_NAME = 'SECTION';
  private readonly featureDisplayName = 'Section';
  private readonly ENTITY_ROUTE = '/gfw-portal/questionnaire';

  readonly updateRoute = '/gfw-portal/questionnaire/templates/update/';
  readonly viewRoute = '';
  readonly serviceName = '_instaceSectionsS';
  readonly entityIdField = 'id';
  readonly dataEntityId = 1;

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
  dataResolver: any;
  finalLinks: any;
  dataBreadCrumb: any;
  riskTitle: any;
  idValue: any;
  containerKey = 'BREAD_CRUMB_TITLES.QUESTIONNAIRE';
  constructor(
    private router: Router,
    private messageService: MessageService,
    private _SharedService: SharedService,
    private translate: TranslateService,
    private layout: LayoutService,
    private _instaceSectionsS: InstanceSectionsService,
    private _activatedRoute: ActivatedRoute,
    private InstanceService: InstanceService,
    public _PermissionSystemService:PermissionSystemService
  ) {}

  // ─────────────────────────────
  // Lifecycle
  // ─────────────────────────────
  ngOnInit(): void {
    this.initializeTranslations();
    this.getinstanceId();
  }

  // ─────────────────────────────
  // Translations & Labels
  // ─────────────────────────────
  private initializeTranslations(): void {
    const base = 'TEMPLATES';
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
  newBreadCrumb: any;
  initialBreadCrumb() {
    this._activatedRoute.data.subscribe((res: any) => {
      if (res['breadCrumbData']) {
        this.dataResolver = res['resolvedHandler'];

        this.newBreadCrumb = [...res['breadCrumbData']];
        this.getData(res['url_entity_id']);
      } else {
        this.dataBreadCrumb = [
          {
            name: this.translate.instant(this.containerKey),
            routerLink: '/gfw-portal/questionnaire/instance',
          },
          {
            name: this.translate.instant('INSTANCES.INSTANCES_LIST'),
            routerLink: '/gfw-portal/questionnaire/instance',
          },
          {
            name: this.data?.name,
            routerLink: `/gfw-portal/questionnaire/instance/${this.instanceId}/overview`,
          },
          {
            name: this.translate.instant('TEMPLATES.SECTIONS_LIST'),
          },
        ];
        this.layout.breadCrumbLinks.next(this.dataBreadCrumb);
      }
    });
  }

  getData(url: any) {
    const paramEntityPath = this.dataResolver?.routerEntity;
    const routerLink = paramEntityPath?.replace(
      '${id}',
      '/' + this.dataResolver?.entityId
    );
    const paramListPath = this.dataResolver?.routerList;
    const routerList = paramListPath?.replace(
      '${id}',
      '/' + this.dataResolver?.entityId
    );

    const paramViewItem = this.dataResolver?.paramViewItem;
    const routerViewItem = paramViewItem?.replace(
      '${id}',
      +this.dataResolver?.entityId
    );

    this._SharedService
      .getEntityByUrl(url + this.dataResolver?.entityId)
      .subscribe((res: any) => {
        this.riskTitle = res?.data?.riskTitle;
        this.newBreadCrumb.splice(2, 0, {
          name: this.riskTitle || res?.data?.legalName,
          routerLink: routerLink,
        });
        this.newBreadCrumb.splice(3, 0, {
          name: 'Questionnaire',
          routerLink: routerList,
        });
        if (this.instanceId) {
          this.newBreadCrumb.splice(4, 0, {
            name: this.data?.name,
            routerLink: `${routerViewItem}/${this.instanceId}/overview`,
          });
        }
        this.layout.breadCrumbLinks.next(this.newBreadCrumb);
      });
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
        visible: ()=>this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYQUESTIONNAIRESECTIONS' , 'VIEW')

      },
      ...(this.dataResolver?.entityId
        ? [
            {
              label: this.translate.instant(this.labels.delete),
              icon: 'fi fi-rr-trash',
              command: () => this.toggleDeleteModal(true),
                      visible: ()=>this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYQUESTIONNAIRESECTIONS' , 'DELETE')

            },
            {
              label: this.translate.instant(this.labels.update),
              icon: 'fi fi-rr-pencil',
              command: () => this.handleUpdateClick(),
                      visible: ()=>this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYQUESTIONNAIRESECTIONS' , 'EDIT')

            },
          ]
        : []),
    ];
  }

  // ─────────────────────────────
  // Action Handlers
  // ─────────────────────────────
  handleViewClick(): void {
    const routeData = this._activatedRoute.snapshot.data['resolvedHandler'];
    let baseUrl =
      routeData?.paramViewItem || '/gfw-portal/questionnaire/instance/';
    if (routeData?.entityId) {
      baseUrl = baseUrl.replace('${id}', routeData.entityId);
    }

    const url = `${baseUrl}${this.instanceId}/sections/${this.selectedRow}`;
    this.router.navigate([url]);
    console.log('Viewing', this.selectedRow, this.FEATURE_NAME, url);
  }

  handleUpdateClick(): void {
    const routeData = this._activatedRoute.snapshot.data['resolvedHandler'];
    let baseUrl =
      routeData?.paramViewItem || '/gfw-portal/questionnaire/instance/';

    if (routeData?.entityId) {
      baseUrl = baseUrl.replace('${id}', routeData.entityId);
    }

    const url = `${baseUrl}${this.instanceId}/sections/update/${this.selectedRow}`;
    this.router.navigate([url]);
    console.log('Updating', this.FEATURE_NAME, url);
  }

  handleAddClick(): void {
    const routeData = this._activatedRoute.snapshot.data['resolvedHandler'];
    let baseUrl =
      routeData?.paramViewItem || '/gfw-portal/questionnaire/instance/';
    if (routeData?.entityId) {
      baseUrl = baseUrl.replace('${id}', routeData.entityId);
    }
    const url = `${baseUrl}${this.instanceId}/sections/add`;
    this.router.navigate([url]);
    console.log('Adding', this.FEATURE_NAME, url);
  }

  toggleDeleteModal(visible: boolean): void {
    if (!visible) {
      this.selectedRow = null;
    }
    this.deleteModalVisible = visible;
  }

  delete(): void {
     if(!this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYQUESTIONNAIRESECTIONS' , 'DELETE')) return;

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

  // ─────────────────────────────
  // Profiles + Table Handling
  // ─────────────────────────────

  getListData(event?: any): void {
    this.loading = true;
    this.tableData = [];

    (this as any)[this.serviceName]
      .findAll(this.instanceId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: any) => {
          const d = res?.data;
          this.tableData = d;
        },
        error: () => (this.loading = false),
      });
  }

  setSelected(event: any): void {
    console.log(event, 'event');

    this.selectedRow = event?.id;
  }

  instanceId: string = '';
  data: any;
  getDataById(id: string) {
    this.InstanceService.getById(id).subscribe((res) => {
      const template_data = res?.data;
      this.data = template_data;
      this.initialBreadCrumb();
      this.setupActionItems();
    });
  }
  getinstanceId() {
    this._activatedRoute.parent?.paramMap.subscribe((res: any) => {
      this.instanceId = res.get('instanceId');
      this.getDataById(this.instanceId);
      this.getListData();
    });
  }

  get viewEntityRouter(): string {
    const routeData = this._activatedRoute.snapshot.data['resolvedHandler'];
    let baseUrl =
      routeData?.paramViewItem || '/gfw-portal/questionnaire/instance/';
    if (routeData?.entityId) {
      baseUrl = baseUrl.replace('${id}', routeData.entityId);
    }
    if (!baseUrl.endsWith('/')) {
      baseUrl += '/';
    }

    return `${baseUrl}${this.instanceId}/sections/`;
  }
}
