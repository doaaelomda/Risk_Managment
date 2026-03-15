import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { InstanceQuestionsService } from '../services/instance-questions.service';
import { Button } from 'primeng/button';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { CardsListComponent } from 'libs/shared/shared-ui/src/lib/cards-list/cards-list.component';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { DialogModule } from 'primeng/dialog';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-instance-questions',
  imports: [
    CommonModule,
    Button,
    DeleteConfirmPopupComponent,
    CardsListComponent,
    InputNumberComponent,
    DialogModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './instance-questions.component.html',
  styleUrl: './instance-questions.component.scss',
})
export class InstanceQuestionsComponent {
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
  private readonly FEATURE_KEY = 'QUESTIONS';
  private readonly FEATURE_NAME = 'QUESTION';
  private readonly featureDisplayName = 'Question';
  private readonly ENTITY_ROUTE = '/gfw-portal/questionnaire';

  readonly updateRoute = '/gfw-portal/questionnaire/templates/update/';
  readonly viewRoute = '';
  readonly serviceName = '_instanceQuesionsS';
  readonly entityIdField = 'questionnaireInstanceQuestionID';
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
    private _instanceQuesionsS: InstanceQuestionsService,
    private _activatedRoute: ActivatedRoute,
    public _PermissionSystemService:PermissionSystemService
  ) {
    const permissions = this._activatedRoute.snapshot.data['permissions']
    this.moduleName = permissions?.module
    this.featureName = permissions?.feature
  }

  moduleName!:string;
  featureName!:string;

  // ─────────────────────────────
  // Lifecycle
  // ─────────────────────────────
  ngOnInit(): void {
    this.initializeTranslations();
    this.getTemplateId();
    this.initUpdateForm();
    this.handleRoutingBreadCrumb();
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
  handleViewClick(): void {
    const url = `${this.buildBaseUrl()}questions/${this.selectedRow}`;
    this.router.navigate([url]);

    console.log('Viewing', this.selectedRow, this.FEATURE_NAME, url);
  }

  showUpdateDialog: boolean = false;
  updateQuestionForm!: FormGroup;
  initUpdateForm(data?: any) {
    this.updateQuestionForm = new FormGroup({
      displayOrder: new FormControl(data?.displayOrder ?? null),
      weight: new FormControl(data?.weight ?? null),
      questionnaireQuestionID: new FormControl(
        data?.questionnaireQuestionID ?? null
      ),
    });
  }
  isUpdating: boolean = false;
  update() {
    const canAdd = this._PermissionSystemService.can(this.moduleName , this.featureName , 'ADD')
    const canEdit = this._PermissionSystemService.can(this.moduleName , this.featureName , 'EDIT')
    if(this.selectedRow && !canEdit)return
    if(!this.selectedRow && !canAdd)return
    this.isUpdating = true;
    this._instanceQuesionsS
      .save(
        this.updateQuestionForm.value,
        this.questionnaireInstanceID,
        this.questionnaireInstanceSectionID,
        this.selectedRow,
        this.dataResolver?.entityId,
        this.dataResolver?.dataEntityTypeId
      )
      .subscribe({
        next: (res) => {
          this.isUpdating = false;
          this.messageService.add({
            severity: 'success',
            detail: 'Question updated successfully',
          });
          this.onUpdateDialogHide();
        },
        error: (err) => {
          this.isUpdating = false;
        },
      });
  }
  onUpdateDialogHide() {
    this.showUpdateDialog = false;
    this.questionnaireInstanceQuestionID = null;
    this.questionnaireInstanceID = null;
    this.questionnaireInstanceSectionID = null;
    this.selectedRow = null;
    this.updateQuestionForm.reset();
  }
  questionnaireInstanceID: any = '';
  questionnaireInstanceQuestionID: any = '';
  questionnaireInstanceSectionID: any = '';
  handleUpdateClick(): void {
    console.log('Updating', this.FEATURE_NAME);
    console.log(this.selectedRow, 'this.selectedRow');

    this._instanceQuesionsS.getById(this.selectedRow).subscribe((res) => {
      console.log(res, 'got data by id');
      this.questionnaireInstanceQuestionID =
        res?.data?.questionnaireInstanceQuestionID;
      this.questionnaireInstanceID = res?.data?.questionnaireInstanceID;
      this.questionnaireInstanceSectionID =
        res?.data?.questionnaireInstanceSectionID;
      this.initUpdateForm(res?.data);
      this.showUpdateDialog = true;
    });
    // this.router.navigate([
    //   `/gfw-portal/questionnaire/templates/${this.templateId}/sections/${this.sectionId}/template-questions/update/${this.selectedRow}`,
    // ]);
  }
  dataResolver: any;
  handleRoutingBreadCrumb() {
    this._activatedRoute.data.subscribe((res: any) => {
      if (res['resolvedHandler']) {
        this.dataResolver = res['resolvedHandler'];
      }
    });
    this.setupActionItems();
  }
  // /gfw-portal/risks-management/risk/1/questionnaire/instance/13/sections/50/questions
  handleAddClick(): void {
    const url = `${this.buildBaseUrl()}questions/add`;
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
     if(!this._PermissionSystemService.can(this.moduleName , this.featureName , 'DELETE')) return;

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
      .findAll(this.instanceId, this.sectionId)
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
    this.selectedRow = event?.questionId;
  }

  instanceId: string = '';
  sectionId: string = '';
  riskId: any;
  getTemplateId() {
    this._activatedRoute.parent?.paramMap.subscribe((res: any) => {
      console.log(res, 'query');

      this.instanceId = res.get('instanceId');
      this.sectionId = res.get('sectionId');
      this.riskId = res.get('riskID');

      this.getListData();
    });
  }

  private buildBaseUrl(): string {
    const routeData = this._activatedRoute.snapshot.data['resolvedHandler'];

    let baseUrl =
      routeData?.paramViewItem || '/gfw-portal/questionnaire/instance';

    if (routeData?.entityId) {
      baseUrl = baseUrl.replace('${id}', routeData.entityId);
    }

    if (!baseUrl.endsWith('/')) {
      baseUrl += '/';
    }

    return `${baseUrl}${this.instanceId}/sections/${this.sectionId}/`;
  }
  get viewEntityRouter(): string {
    return `${this.buildBaseUrl()}questions/`;
  }
}
