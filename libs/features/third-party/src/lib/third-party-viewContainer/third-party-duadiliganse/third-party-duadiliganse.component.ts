import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DuadiliganseService } from '../../../services/duadiliganse.service';
import {  DeleteConfirmPopupComponent } from "@gfw/shared-ui";
import { Button } from "primeng/button";
import { NewTableComponent } from "libs/shared/shared-ui/src/lib/new-table/new-table.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-third-party-duadiliganse',
  imports: [CommonModule, DeleteConfirmPopupComponent, Button, TranslateModule, NewTableComponent],
  templateUrl: './third-party-duadiliganse.component.html',
  styleUrl: './third-party-duadiliganse.component.scss',
})
export class ThirdPartyDuadiliganseComponent {
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
  private readonly FEATURE_KEY = 'DUE_DILIGENCES';
  private readonly FEATURE_NAME = 'DUE_DILIGENCE';
  private readonly featureDisplayName = 'Due Diligence';
  private readonly ENTITY_ROUTE = '/gfw-portal/questionnaire';

  readonly updateRoute = '/gfw-portal/risks-management/risk-action';
   viewRoute = '';
  readonly serviceName = '_duadiliService';
  readonly entityIdField = 'thirdPartyDueDiligenceID';
  readonly dataEntityId = 88;
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
    private _duadiliService:DuadiliganseService, // DO NOT REMOVE!!
    private activatedRoute:ActivatedRoute,
    public _PermissionSystemService:PermissionSystemService
  ) {
  }

  // ─────────────────────────────
  // Lifecycle
  // ─────────────────────────────
  ngOnInit(): void {
    this.initializeTranslations();
    this.setupActionItems();

    this.getThirdPartyId()
  }
  tpId:any = ''
  getThirdPartyId(){
    this.activatedRoute.parent?.paramMap.subscribe(res => {
      this.tpId = res?.get('id')
      console.log(res);

      this.viewRoute = `/gfw-portal/third-party/view/${this.tpId}/due-diligence`
         this.columnControl = {
      type: 'route',
      data: `/gfw-portal/third-party/view/${this.tpId}/due-diligence`,
    };
    })
  }
    handleDataTable(event: any) {
    this.data_payload = event;
    this.getListData(event);
  }

  data_payload: any;


  columnControl: any;






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
  // private initBreadcrumb(): void {

  //   const containerKey = 'BREAD_CRUMB_TITLES.QUESTIONNAIRE';
  //   this.setBreadcrumb(containerKey, [
  //     { nameKey: containerKey, routerLink: this.ENTITY_ROUTE },
  //     { nameKey: `${this.FEATURE_KEY}.${this.FEATURE_NAME}S_LIST` },
  //   ]);
  // }

  // private setBreadcrumb(
  //   titleKey: string,
  //   links: { nameKey: string; icon?: string; routerLink?: string }[]
  // ): void {
  //   this.layout.breadCrumbTitle.next(this.translate.instant(titleKey));
  //   const translatedLinks = [
  //     { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
  //     ...links.map((link) => ({
  //       name: this.translate.instant(link.nameKey),
  //       icon: link.icon ?? '',
  //       ...(link.routerLink ? { routerLink: link.routerLink } : {}),
  //     })),
  //   ];
  //   this.layout.breadCrumbLinks.next(translatedLinks);
  //   this.layout.breadCrumbAction.next(null);
  // }

  // ─────────────────────────────
  // Action Buttons
  // ─────────────────────────────
  private setupActionItems(): void {
    this.actionItems = [
      {
        label: this.translate.instant(this.labels.view),
        icon: 'fi fi-rr-eye',
        command: () => this.handleViewClick(),
        visible: ()=>this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYDUEDILIGENCE' , 'VIEW')

      },
      {
        label: this.translate.instant(this.labels.delete),
        icon: 'fi fi-rr-trash',
        command: () => this.toggleDeleteModal(true),
           visible: ()=>this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYDUEDILIGENCE' , 'DELETE')
      },
      {
        label: this.translate.instant(this.labels.update),
        icon: 'fi fi-rr-pencil',
        command: () => this.handleUpdateClick(),
           visible: ()=>this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYDUEDILIGENCE' , 'EDIT')
      },
    ];
  }

  // ─────────────────────────────
  // Action Handlers
  // ─────────────────────────────
  handleViewClick(): void {
 this.router.navigate([`/gfw-portal/third-party/view/${this.tpId}/due-diligence/${this.selectedRow}`])  }

  handleUpdateClick(): void {
    this.router.navigate([`/gfw-portal/third-party/view/${this.tpId}/due-diligence/update/${this.selectedRow}`])
    console.log('Updating', this.FEATURE_NAME);
  }


  handleAddClick():void {
    this.router.navigate([`/gfw-portal/third-party/view/${this.tpId}/due-diligence/add`])
    console.log('Adding', this.FEATURE_NAME);
  }

  toggleDeleteModal(visible: boolean): void {
      if(!visible) {this.selectedRow = null}
    this.deleteModalVisible = visible;
  }

  delete(): void {
     if(!this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYDUEDILIGENCE' , 'DELETE')) return;

    if (!this.selectedRow) return;
    this.loadingDelete = true;

    (this as any)[this.serviceName].delete(this.selectedRow).pipe(
      finalize(() => (this.loadingDelete = false))
    ).subscribe({
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


  getListData(event?: any): void {
    this.loading = true;
    this.tableData = [];
    event.thirdPartyID = this.tpId;
    (this as any)[this.serviceName]
      .findAll(
        event
      )
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
