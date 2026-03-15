import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { VersionReviewsService } from 'libs/features/covernance/src/service/version-reviews.service';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { finalize } from 'rxjs';
import * as moment from 'moment';
import { Button } from 'primeng/button';
import {
  SharedUiComponent,
  DeleteConfirmPopupComponent,
  TextareaUiComponent,
  RoleDropdownComponent,
  UserDropdownComponent,
} from '@gfw/shared-ui';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { RadioOptionComponent } from 'libs/shared/shared-ui/src/lib/RadioOption/RadioOption.component';
import dateHandler from 'libs/shared/utils/dateHandler';
import { NewTableComponent } from "libs/shared/shared-ui/src/lib/new-table/new-table.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-version-review',
  imports: [
    CommonModule,
    Button,
    SharedUiComponent,
    DeleteConfirmPopupComponent,
    TranslateModule,
    DialogModule,
    RadioOptionComponent,
    FormsModule,
    ReactiveFormsModule,
    TextareaUiComponent,
    RoleDropdownComponent,
    UserDropdownComponent,
    NewTableComponent
],
  templateUrl: './version-review.component.html',
  styleUrl: './version-review.component.scss',
})
export class VersionReviewComponent {
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
  private readonly FEATURE_KEY = 'VERSION';
  private readonly FEATURE_NAME = 'REVIEW';
  private readonly featureDisplayName = 'Review';
  private readonly ENTITY_ROUTE = '/gfw-portal/questionnaire';

  readonly updateRoute = '/gfw-portal/risks-management/risk-action';
  viewRoute = '';
  readonly serviceName = '_reviewsService';
  readonly entityIdField = 'govDocumentReviewID';
  readonly dataEntityId = 94;

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
    private _reviewsService: VersionReviewsService,
    private route: ActivatedRoute,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this.getParentId();
  }
  current_payload:any
handleDataTable(payload:any){
  this.current_payload = payload
  this.getListData(this.current_payload)
}
  // ─────────────────────────────
  // Lifecycle
  // ─────────────────────────────
  ngOnInit(): void {
    this.getRolesLookUp();
    this.getUsersLookUp();
    this.getReviewStatuses();
    this.initializeTranslations();
    this.setupActionItems();

    this.initForm();
  }
  parentId!: number;
  columnControl:any
  getParentId() {
    const id = this.route.parent?.snapshot.paramMap.get('versionId');
    const documentId = this.route.parent?.snapshot.paramMap.get('Docid');
    if (!id) return;
    this.viewRoute = `/gfw-portal/governance/viewDocument/${documentId}/versions/${id}/reviews`;
    this.columnControl = {
      type:'route',
      data:this.viewRoute
    }
    this.parentId = +id;
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
  // Action Buttons
  // ─────────────────────────────
  private setupActionItems(): void {
    this.actionItems = [
      {
        label: this.translate.instant(this.labels.view),
        icon: 'fi fi-rr-eye',
        command: () => this.handleViewClick(),
        visible: ()=>this._PermissionSystemService.can('GOVERNANCE' , 'REVIEWS' , 'VIEW')
      },
      {
        label: this.translate.instant(this.labels.delete),
        icon: 'fi fi-rr-trash',
        command: () => this.toggleDeleteModal(true),
           visible: ()=>this._PermissionSystemService.can('GOVERNANCE' , 'REVIEWS' , 'DELETE')
      },
      {
        label: this.translate.instant(this.labels.update),
        icon: 'fi fi-rr-pencil',
        command: () => this.handleUpdateClick(),
           visible: ()=>this._PermissionSystemService.can('GOVERNANCE' , 'REVIEWS' , 'EDIT')
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
    this.getById();
    console.log('Updating', this.FEATURE_NAME);
  }

  getById() {
    this._reviewsService.getById(this.selectedRow).subscribe((res) => {
      this.initForm(res.data);
      this.visible_dialog = true;
    });
  }

  handleAddClick(): void {
    this.visible_dialog = true;
  }

  toggleDeleteModal(visible: boolean): void {
      if(!visible) {this.selectedRow = null}
    this.deleteModalVisible = visible;
  }

  delete(): void {
     if(!this._PermissionSystemService.can('GOVERNANCE' , 'REVIEWS' , 'DELETE')) return;

    if (!this.selectedRow) return;
    this.loadingDelete = true;

    (this as any)[this.serviceName]
      .delete(this.selectedRow)
      .pipe(finalize(() => (this.loadingDelete = false)))
      .subscribe({
        next: () => {
          this.getListData(this.current_payload);
          this.toggleDeleteModal(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `${this.featureDisplayName} deleted successfully!`,
          });
           this.closeDialog()
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
      .findAll(
   
        { govDocumentVersionID: this.parentId,...event }
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

  getRolesLookUp() {
    this.sharedService.getRoleLookupData().subscribe((res) => {
      this.roles = res?.data;
    });
  }

  getUsersLookUp() {
    this.sharedService.getUserLookupData().subscribe((res) => {
      console.log(res, 'users here');
      this.users = res?.data;
    });
  }

  getReviewStatuses() {
    this.sharedService.lookUps([211]).subscribe((res) => {
      this.reviewStatuses = res.data.GovDocumentReviewStatusType;
    });
  }

  reviewStatuses: any[] = [];
  roles: any[] = [];
  users: any[] = [];
  visible_dialog: boolean = false;
  closeDialog() {
    this.visible_dialog = false;
    this.selectedRow = null;
    this.form.reset();
  }
  handleReviewerRole() {
    this.selectedReviewer = 'role';
    this.form.get('scope')?.reset();
    this.form.get('reviewerUserID')?.reset();
    this.form.get('reviewerRoleID')?.reset();
    this.form.get('govDocumentReviewReviewerTypeID')?.setValue(2);
  }
  handleReviewerUser() {
    this.selectedReviewer = 'user';
    this.form.get('scope')?.reset();
    this.form.get('reviewerUserID')?.reset();
    this.form.get('reviewerRoleID')?.reset();
    this.form.get('govDocumentReviewReviewerTypeID')?.setValue(1);
  }
  isLoading: boolean = false;
  submit() {
    const canAdd = this._PermissionSystemService.can('GOVERNANCE' , 'REVIEWS' , 'ADD')
    const canEdit = this._PermissionSystemService.can('GOVERNANCE' , 'REVIEWS' , 'EDIT')
    if(this.selectedRow && !canEdit)return
    if(!this.selectedRow && !canAdd)return
    console.log(this.form, 'this.form');

    if (this.cannotSave()) return;

    const reviewStartDate = dateHandler(
      this.form.get('reviewStartDate')?.value
    );
    const reviewDueDate = dateHandler(this.form.get('reviewDueDate')?.value);
    const reviewCompletionDate = dateHandler(
      this.form.get('reviewCompletionDate')?.value
    );

    this.isLoading = true;
    const payload = {
      ...this.form.value,
      govDocumentVersionID: this.parentId,
    };
    this._reviewsService
      .save(payload, this.selectedRow)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${this.featureDisplayName} ${'added'} Successfully.`,
        });
        this.visible_dialog = false;
        this.getListData(this.current_payload);
      });
  }
  selectedReviewer: any = 'user';
  form!: FormGroup;
  cannotSave(){
   return this.form.invalid || (!this.form.get('reviewerUserID')?.value && !this.form.get('reviewerRoleID')?.value)
  }
  initForm(data?: any) {
    this.form = new FormGroup({
      // govDocumentVersionID: new FormControl(data?.govDocumentVersionID ?? null, Validators.required),
      scope: new FormControl(data?.scope ?? null),
      govDocumentReviewReviewerTypeID: new FormControl(
        data?.govDocumentReviewReviewerTypeID ?data?.govDocumentReviewReviewerTypeID : 1,
      ),
      reviewerUserID: new FormControl(data?.reviewerUserID ?? null),
      reviewerRoleID: new FormControl(data?.reviewerRoleID ?? null),

    });
  }
}
