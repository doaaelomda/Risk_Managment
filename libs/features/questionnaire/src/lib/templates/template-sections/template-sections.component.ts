import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SectionsService } from '../../services/sections.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { MessageService } from 'primeng/api';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { finalize } from 'rxjs';
import * as moment from 'moment';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { Button } from 'primeng/button';
import { CardsListComponent } from 'libs/shared/shared-ui/src/lib/cards-list/cards-list.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-template-sections',
  imports: [
    CommonModule,
    DeleteConfirmPopupComponent,
    TranslateModule,
    Button,
    CardsListComponent,
  ],
  templateUrl: './template-sections.component.html',
  styleUrl: './template-sections.component.scss',
})
export class TemplateSectionsComponent {
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
  readonly serviceName = '_sectionsS';
  readonly entityIdField = 'questionnaireTemplateSectionID';
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

  constructor(
    private router: Router,
    private messageService: MessageService,
    private sharedService: SharedService,
    private translate: TranslateService,
    private layout: LayoutService,
    private _sectionsS: SectionsService,
    private _activatedRoute: ActivatedRoute,
    public _PermissionSystemService:PermissionSystemService
  ) {

  }

  // ─────────────────────────────
  // Lifecycle
  // ─────────────────────────────
  ngOnInit(): void {
    this.initializeTranslations();
    this.setupActionItems();
    this.getTemplateId();
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


  // ─────────────────────────────
  // Action Buttons
  // ─────────────────────────────
  private setupActionItems(): void {
    this.actionItems = [
      {
        label: this.translate.instant(this.labels.view),
        icon: 'fi fi-rr-eye',
        command: () => this.handleViewClick(),
        visible: ()=>this._PermissionSystemService.can('QUESTIONNAIRES' , 'TEMPLATESSECTIONS' , 'VIEW')

      },
      {
        label: this.translate.instant(this.labels.delete),
        icon: 'fi fi-rr-trash',
        command: () => this.toggleDeleteModal(true),
        visible: ()=>this._PermissionSystemService.can('QUESTIONNAIRES' , 'TEMPLATESSECTIONS' , 'DELETE')

      },
      {
        label: this.translate.instant(this.labels.update),
        icon: 'fi fi-rr-pencil',
        command: () => this.handleUpdateClick(),
        visible: ()=>this._PermissionSystemService.can('QUESTIONNAIRES' , 'TEMPLATESSECTIONS' , 'EDIT')

      },
    ];
  }

  // ─────────────────────────────
  // Action Handlers
  // ─────────────────────────────
  handleViewClick(event?: any): void {
    this.router.navigate([
      `/gfw-portal/questionnaire/templates/${this.templateId}/sections/${this.selectedRow}`,
    ]);
    console.log('Viewing', this.selectedRow, this.FEATURE_NAME);
  }

  handleUpdateClick(): void {
    console.log('Updating', this.FEATURE_NAME);
    this.router.navigate([
      `/gfw-portal/questionnaire/templates/${this.templateId}/sections/update/${this.selectedRow}`,
    ]);
  }

  handleAddClick(): void {
    console.log('Adding', this.FEATURE_NAME);
    this.router.navigate([
      `/gfw-portal/questionnaire/templates/${this.templateId}/sections/add`,
    ]);
  }

  toggleDeleteModal(visible: boolean): void {
      if(!visible) {this.selectedRow = null}
    this.deleteModalVisible = visible;
  }

  delete(): void {
     if(!this._PermissionSystemService.can('QUESTIONNAIRES' , 'TEMPLATESSECTIONS' , 'DELETE')) return;
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
      .findAll(this.templateId)
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

    this.selectedRow = event?.questionnaireTemplateSectionID;
  }

  templateId: string = '';
  getTemplateId() {
    this._activatedRoute.parent?.paramMap.subscribe((res: any) => {
      this.templateId = res.get('templateId');
      console.log(this.templateId,'templateId');
      
      this.getListData();
    });
  }
}
