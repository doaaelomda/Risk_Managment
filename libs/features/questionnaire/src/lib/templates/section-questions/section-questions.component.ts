import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SectionsService } from '../../services/sections.service';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { CardsListComponent } from 'libs/shared/shared-ui/src/lib/cards-list/cards-list.component';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { Button } from 'primeng/button';
import { QuestionsService } from '../../services/questions.service';
import { DialogModule } from 'primeng/dialog';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-section-questions',
  imports: [
    CommonModule,
    CardsListComponent,
    DeleteConfirmPopupComponent,
    Button,
    TranslateModule,
    DialogModule,
    ReactiveFormsModule,
    FormsModule,
    InputNumberComponent,
  ],
  templateUrl: './section-questions.component.html',
  styleUrl: './section-questions.component.scss',
})
export class SectionQuestionsComponent {
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
  readonly serviceName = '_questionsS';
  readonly entityIdField = 'questionnaireTemplateQuestionID';
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
    private _questionsS: QuestionsService,
    private _activatedRoute: ActivatedRoute,
    public _PermissionSystemService:PermissionSystemService
  ) {}

  // ─────────────────────────────
  // Lifecycle
  // ─────────────────────────────
  ngOnInit(): void {
    this.initializeTranslations();
    this.setupActionItems();
    this.getTemplateId();
    this.initUpdateForm();
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
        visible: ()=>this._PermissionSystemService.can('QUESTIONNAIRES' , 'TEMPLATESSECTIONSQUESTIONS' , 'VIEW')
      },
      {
        label: this.translate.instant(this.labels.delete),
        icon: 'fi fi-rr-trash',
        command: () => this.toggleDeleteModal(true),
        visible: ()=>this._PermissionSystemService.can('QUESTIONNAIRES' , 'TEMPLATESSECTIONSQUESTIONS' , 'DELETE')
      },
      {
        label: this.translate.instant(this.labels.update),
        icon: 'fi fi-rr-pencil',
        command: () => this.handleUpdateClick(),
        visible: ()=>this._PermissionSystemService.can('QUESTIONNAIRES' , 'TEMPLATESSECTIONSQUESTIONS' , 'EDIT')
      },
    ];
  }

  // ─────────────────────────────
  // Action Handlers
  // ─────────────────────────────
  handleViewClick(event?: any): void {
    this.router.navigate([
      `/gfw-portal/questionnaire/templates/${this.templateId}/sections/${this.sectionId}/template-questions/${this.selectedRow}`,
    ]);
    console.log('Viewing', this.selectedRow, this.FEATURE_NAME);
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
    
    const canEdit = this._PermissionSystemService.can('QUESTIONNAIRES' , 'TEMPLATESSECTIONSQUESTIONS' , 'EDIT') 
    if(!canEdit)return

    this.isUpdating = true
    this._questionsS.save(
      this.updateQuestionForm.value,
      this.questionnaireTemplateID,
      this.questionnaireTemplateSectionID,
      this.questionnaireTemplateQuestionID
    ).subscribe({
      next:(res) => {
        this.isUpdating = false
        this.messageService.add({severity:'success', detail:'Question updated successfully'})
        this.onUpdateDialogHide()
      },
      error:(err) => {
        this.isUpdating = false
      }
    })
  }
  onUpdateDialogHide() {
    this.showUpdateDialog = false;
    this.questionnaireTemplateID = null;
    this.questionnaireTemplateSectionID = null;
    this.questionnaireTemplateQuestionID = null;
    this.updateQuestionForm.reset()
  }
  questionnaireTemplateSectionID: any = '';
  questionnaireTemplateID: any = '';
  questionnaireTemplateQuestionID: any = '';
  handleUpdateClick(): void {
    console.log('Updating', this.FEATURE_NAME);

    this._questionsS.getById(this.selectedRow).subscribe((res) => {
      console.log(res, 'got data by id');
      this.questionnaireTemplateID = res?.data?.questionnaireTemplateID;
      this.questionnaireTemplateSectionID =
        res?.data?.questionnaireTemplateSectionID;
      this.questionnaireTemplateQuestionID =
        res?.data?.questionnaireTemplateQuestionID;
      this.initUpdateForm(res?.data);
      this.showUpdateDialog = true;
    });
    // this.router.navigate([
    //   `/gfw-portal/questionnaire/templates/${this.templateId}/sections/${this.sectionId}/template-questions/update/${this.selectedRow}`,
    // ]);
  }

  handleAddClick(): void {
    console.log('Adding', this.FEATURE_NAME);
    this.router.navigate([
      `/gfw-portal/questionnaire/templates/${this.templateId}/sections/${this.sectionId}/template-questions/add`,
    ]);
  }

  toggleDeleteModal(visible: boolean): void {
      if(!visible) {this.selectedRow = null}
    this.deleteModalVisible = visible;
  }

  delete(): void {
     if(!this._PermissionSystemService.can('QUESTIONNAIRES' , 'TEMPLATESSECTIONSQUESTIONS' , 'DELETE')) return;
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
      .findAll(this.sectionId)
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

    this.selectedRow = event?.questionnaireTemplateQuestionID;
  }

  templateId: string = '';
  sectionId: string = '';
  getTemplateId() {
    this._activatedRoute.parent?.paramMap.subscribe((res: any) => {
      this.templateId = res.get('templateId');
      this.sectionId = res.get('sectionId');
      console.log(this.templateId, 'templateId');

      this.getListData();
    });
  }
}
