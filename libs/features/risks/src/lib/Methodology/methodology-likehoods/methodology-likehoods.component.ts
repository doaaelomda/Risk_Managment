import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import {
  DeleteConfirmPopupComponent,
  TextareaUiComponent,
} from '@gfw/shared-ui';
import { Button } from 'primeng/button';
import { MethodologyLikehoodsService } from '../../../services/methodology-likehoods.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { DialogModule } from 'primeng/dialog';
import { ColorDropdownComponent } from 'libs/shared/shared-ui/src/lib/color-dropdown/color-dropdown.component';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-methodology-likehoods',
  imports: [
    CommonModule,
    DeleteConfirmPopupComponent,
    Button,
    TranslateModule,
    TextareaUiComponent,
    InputTextComponent,
    InputNumberComponent,
    DialogModule,
    ReactiveFormsModule,
    FormsModule,
    ColorDropdownComponent,
    NewTableComponent,
  ],
  templateUrl: './methodology-likehoods.component.html',
  styleUrl: './methodology-likehoods.component.scss',
})
export class MethodologyLikehoodsComponent {
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
  private readonly FEATURE_KEY = 'METHODOLOGY';
  private readonly FEATURE_NAME = 'LIKEHOOD';
  private readonly featureDisplayName = 'Likehood';
  private readonly ENTITY_ROUTE = '/gfw-portal/risks-management/methodolgy';

  readonly updateRoute = '/gfw-portal/risks-management/risk-action';
  methodologyId!: string | number;
  viewRoute = '';
  readonly serviceName = '_service';
  readonly entityIdField = 'riskLikelihoodID';
  readonly dataEntityId = 90;

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
  handleDataTable(event: any) {
    this.data_payload = event;
    this.getListData(event);
  }

  data_payload: any;

  columnControl: any;
  constructor(
    private router: Router,
    private messageService: MessageService,
    private sharedService: SharedService,
    private translate: TranslateService,
    private _service: MethodologyLikehoodsService,
    private activatedRoute: ActivatedRoute,
    public _PermissionSystemService:PermissionSystemService
  ) {}

  // ─────────────────────────────
  // Lifecycle
  // ─────────────────────────────
  ngOnInit(): void {
    this.initializeTranslations();
    this.setupActionItems();
    this.getParentId();
    this.initForm();
  }
  getParentId() {
    const id = this.activatedRoute.parent?.snapshot.paramMap.get('id');
    if (!id) return;
    this.methodologyId = id;
    this.viewRoute = `/gfw-portal/risks-management/methodolgy/${this.methodologyId}/likehoods`;
    this.columnControl = {
      type: 'route',
      data: `/gfw-portal/risks-management/methodolgy/${this.methodologyId}/likehoods`,
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

  // ─────────────────────────────
  // Action Buttons
  // ─────────────────────────────
  private setupActionItems(): void {
    this.actionItems = [
      {
        label: this.translate.instant(this.labels.view),
        icon: 'fi fi-rr-eye',
        command: () => this.handleViewClick(),
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGYLIKEHOOD' , 'VIEW')

      },
      {
        label: this.translate.instant(this.labels.delete),
        icon: 'fi fi-rr-trash',
        command: () => this.toggleDeleteModal(true),
          visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGYLIKEHOOD' , 'DELETE')
      },
      {
        label: this.translate.instant(this.labels.update),
        icon: 'fi fi-rr-pencil',
        command: () => this.handleUpdateClick(),
          visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGYLIKEHOOD' , 'EDIT')
      },
    ];
  }

  // ─────────────────────────────
  // Action Handlers
  // ─────────────────────────────
  actionDialogVisible: boolean = false;
  handleViewClick(): void {
    console.log('Viewing', this.FEATURE_NAME);
    this.router.navigate([
      `/gfw-portal/risks-management/methodolgy/${this.methodologyId}/likehoods/${this.selectedRow}`,
    ]);
  }

  handleUpdateClick(): void {
    console.log('Updating', this.FEATURE_NAME);
    (this as any)[this.serviceName]
      .getById(this.selectedRow)
      .subscribe((res: any) => {
        this.initForm(res?.data);
        this.actionDialogVisible = true;
      });
  }

  form!: FormGroup;
  initForm(data?: any) {
    this.form = new FormGroup({
      name: new FormControl(data?.name ?? null, Validators.required),
      nameAr: new FormControl(data?.nameAr ?? null, Validators.required),
      description: new FormControl(
        data?.description ?? null,
        Validators.required
      ),
      descriptionAr: new FormControl(
        data?.descriptionAr ?? null,
        Validators.required
      ),
      weight: new FormControl(data?.weight ?? null, Validators.required),
      color: new FormControl(data?.color ?? null, Validators.required),
        from: new FormControl(data?.from ?? null, Validators.required),
      to: new FormControl(data?.to ?? null, Validators.required),
    });
  }

  isSaving: boolean = false;
  save() {
    const canAdd = this._PermissionSystemService.can('RISKS' , 'METHODOLOGYLIKEHOOD' , 'ADD')
    const canEdit = this._PermissionSystemService.can('RISKS' , 'METHODOLOGYLIKEHOOD' , 'EDIT')
    if(this.selectedRow && !canEdit)return
    if(!this.selectedRow && !canAdd)return
    this.isSaving = true;
    const msg = this.selectedRow ? 'updated' : 'added';
    const payload: any = {
      ...this.form.value,
      riskMethodologyID: this.methodologyId,
    };

    (this as any)[this.serviceName]
      .save(payload, this.selectedRow)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: `${this.featureDisplayName} ${msg} successfully`,
          });
          this.onDialogClose();
          this.getListData();
        },
      });
  }

  onDialogClose() {
    this.actionDialogVisible = false;
    this.selectedRow = null;
    this.form.reset();
  }

  handleAddClick(): void {
    console.log('Adding', this.FEATURE_NAME);
    this.actionDialogVisible = true;
  }

  toggleDeleteModal(visible: boolean): void {
    if (!visible) {
      this.selectedRow = null;
    }
    this.deleteModalVisible = visible;
    if (!visible) this.selectedRow = null;
  }

  delete(): void {
     if(!this._PermissionSystemService.can('RISKS' , 'METHODOLOGYLIKEHOOD' , 'DELETE')) return;

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
      .findAll(payload, { riskMethodologyID: this.methodologyId })
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
