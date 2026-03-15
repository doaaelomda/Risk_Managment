import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  DeleteConfirmPopupComponent,
  TextareaUiComponent,
} from '@gfw/shared-ui';
import { Button } from 'primeng/button';
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
import { MethodologyLevelsService } from '../../../services/methodology-levels.service';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { ControlAssessmentLevelsService } from '../../../services/control-assessment-levels.service';
import { ControlEffectivnessLevelsService } from '../../../services/control-effectivness-levels.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

export interface CrudRouteData {
  featureKey: string;
  featureName: string;
  featureDisplayName: string;

  serviceToken: string;
  baseRoute: string;

  dataEntityId: number;
  entityIdField: string;
  permissions:{module:string;feature:string;action:string;}
  dialogHeader?: {
    add: string;
    update: string;
  };
}

@Component({
  selector: 'lib-generic-crud',
  standalone: true,
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
  templateUrl: './methodology-level.component.html',
  styleUrl: './methodology-level.component.scss',
})
export class MethodologyLevelComponent {
  // ─────────────────────────────
  // State
  // ─────────────────────────────
  loading = true;
  loadingDelete = false;
  deleteModalVisible = false;
  actionDialogVisible = false;

  selectedRow: any = null;
  tableData: any[] = [];
  dataPayload: any;

  parentId!: string | number;
  pagination!: PaginationInterface;

  // ─────────────────────────────
  // Config (from route)
  // ─────────────────────────────
  config!: CrudRouteData;

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
  // Services map
  // ─────────────────────────────
  private servicesMap: Record<string, any>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private sharedService: SharedService,
    private translate: TranslateService,
    private methodologyLevelsService: MethodologyLevelsService,
    private controlAssessmentLevelsService: ControlAssessmentLevelsService,
    private controlEffectivnessLevelsService: ControlEffectivnessLevelsService,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this.servicesMap = {
      methodologyLevelsService: this.methodologyLevelsService,
      controlAssessmentLevelsService: this.controlAssessmentLevelsService,
      controlEffectivnessLevelsService: this.controlEffectivnessLevelsService,
    };
  }

  get service() {
    return this.servicesMap[this.config.serviceToken];
  }

  // ─────────────────────────────
  // Lifecycle
  // ─────────────────────────────
  ngOnInit(): void {
    this.initForm();
    this.config = this.route.snapshot.data as CrudRouteData;
    this.getParentId();
    this.initTranslations();
    this.setupActionItems();
  }

  // ─────────────────────────────
  // Parent ID
  // ─────────────────────────────
  // private resolveParentId(): void {
  //   const param = this.config.parentIdParam ?? 'id';
  //   const id = this.route.parent?.snapshot.paramMap.get(param);
  //   if (!id) return;
  //   this.parentId = id;
  // }
  onDialogClose() {
    this.actionDialogVisible = false;
    this.selectedRow = null;
    this.form.reset();
  }

  viewRoute: string = '';
  columnControl: any;
  getParentId() {
    const id = this.route.parent?.snapshot.paramMap.get('id');
    if (!id) return;
    this.parentId = id;
    this.viewRoute = `/gfw-portal/risks-management/methodolgy/${this.parentId}/levels`;
    this.columnControl = {
      type: 'route',
      data: `/gfw-portal/risks-management/methodolgy/${this.parentId}/levels`,
    };
  }
  // ─────────────────────────────
  // Translations
  // ─────────────────────────────
  private initTranslations(): void {
    const base = this.config.featureKey;
    const name = this.config.featureName;

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
  // Table
  // ─────────────────────────────
  handleDataTable(event: any): void {
    this.dataPayload = event;
    this.getListData(event);
  }

  actionItems: any[] = [];
  private setupActionItems(): void {
    this.actionItems = [
      {
        label: this.translate.instant(this.labels.view),
        icon: 'fi fi-rr-eye',
        command: () => this.handleViewClick(),
        visible: ()=>this._PermissionSystemService.can(this.config.permissions.module , this.config.permissions.feature , 'VIEW')

      },
      {
        label: this.translate.instant(this.labels.delete),
        icon: 'fi fi-rr-trash',
        command: () => this.toggleDeleteModal(true),
        visible: ()=>this._PermissionSystemService.can(this.config.permissions.module , this.config.permissions.feature , 'DELETE')

      },
      {
        label: this.translate.instant(this.labels.update),
        icon: 'fi fi-rr-pencil',
        command: () => this.handleUpdateClick(),
        visible: ()=>this._PermissionSystemService.can(this.config.permissions.module , this.config.permissions.feature , 'EDIT')

      },
    ];
  }
  getListData(event?: any): void {
    this.loading = true;
    this.tableData = [];
    this.service
      .findAll(event, { riskMethodologyID: this.parentId })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res: any) => {
        const d = res?.data;
        this.tableData = d?.items ?? [];
        this.pagination = {
          perPage: d?.pageSize,
          currentPage: d?.pageNumber,
          totalItems: d?.totalCount,
          totalPages: d?.totalPages,
        };
        this.sharedService.paginationSubject.next(this.pagination);
      });
  }

  setSelected(id: any): void {
    this.selectedRow = id;
  }

  // ─────────────────────────────
  // Navigation
  // ─────────────────────────────
  handleViewClick(): void {
    this.router.navigate([
      `${this.config.baseRoute}/${this.parentId}/levels/${this.selectedRow}`,
    ]);
  }

  // ─────────────────────────────
  // Form
  // ─────────────────────────────
  form!: FormGroup;

  initForm(data?: any): void {
    this.form = new FormGroup({
      name: new FormControl(data?.name, Validators.required),
      nameAr: new FormControl(data?.nameAr, Validators.required),
      description: new FormControl(data?.description, Validators.required),
      descriptionAr: new FormControl(data?.descriptionAr, Validators.required),
      fromWeight: new FormControl(data?.fromWeight, Validators.required),
      toWeight: new FormControl(data?.toWeight, Validators.required),
      levelWeight: new FormControl(data?.levelWeight, Validators.required),
      color: new FormControl(data?.color, Validators.required),
    });
  }

  handleAddClick(): void {
    this.selectedRow = null;
    this.initForm();
    this.actionDialogVisible = true;
  }

  handleUpdateClick(): void {
    this.service.getById(this.selectedRow).subscribe((res: any) => {
      this.initForm(res?.data);
      this.actionDialogVisible = true;
    });
  }

  isSaving: boolean = false;
  save(): void {
    const canAdd = this._PermissionSystemService.can(this.config.permissions.module , this.config.permissions.feature , 'ADD')
    const canEdit = this._PermissionSystemService.can(this.config.permissions.module , this.config.permissions.feature , 'EDIT')
  ;
  if(this.selectedRow && !canEdit)return
    if(!this.selectedRow && !canAdd)return
    const payload = {
      ...this.form.value,
      riskMethodologyID: this.parentId,
    };
    this.isSaving = true;
    this.service
      .save(payload, this.selectedRow)
      .pipe(
        finalize(() => {
          this.actionDialogVisible = false;
          this.isSaving = false;
        })
      )
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: `${this.config.featureDisplayName} saved successfully`,
        });
        this.getListData(this.dataPayload);
      });
  }

  // ─────────────────────────────
  // Delete
  // ─────────────────────────────
  toggleDeleteModal(value: boolean): void {
    this.deleteModalVisible = value;
    if (!value) this.selectedRow = null;
  }

  delete(): void {
     if(!this._PermissionSystemService.can(this.config.permissions.module , this.config.permissions.feature , 'DELETE')) return;

    this.loadingDelete = true;
    this.service
      .delete(this.selectedRow)
      .pipe(finalize(() => (this.loadingDelete = false)))
      .subscribe(() => {
        this.toggleDeleteModal(false);
        this.getListData(this.dataPayload);
        this.messageService.add({
          severity: 'success',
          summary: `${this.config.featureDisplayName} deleted successfully`,
        });
      });
  }
}
