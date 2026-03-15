import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { finalize } from 'rxjs';
import { Button } from 'primeng/button';
import {  DeleteConfirmPopupComponent, UserDropdownComponent, RoleDropdownComponent, DatePackerComponent, TextareaUiComponent, SwitchUiComponent } from '@gfw/shared-ui';

import { VersionApprovalService } from 'libs/features/covernance/src/service/version-approval.service';
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
  selector: 'lib-version-approval',
  imports: [
    CommonModule,
    Button,
    DeleteConfirmPopupComponent,
    TranslateModule,
    DialogModule,
    RadioOptionComponent,
    ReactiveFormsModule,
    FormsModule,
    UserDropdownComponent,
    RoleDropdownComponent,
    SwitchUiComponent,
    NewTableComponent
],
  templateUrl: './version-approval.component.html',
  styleUrl: './version-approval.component.scss',
})
export class VersionApprovalComponent {
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
  private readonly FEATURE_NAME = 'APPROVAL';
  private readonly featureDisplayName = 'Approval';
  private readonly ENTITY_ROUTE = '/gfw-portal/questionnaire';

  readonly updateRoute = '/gfw-portal/risks-management/risk-action';
  viewRoute = '';
  readonly serviceName = '_approvalService';
  readonly entityIdField = 'govDocumentApprovalID';
  readonly dataEntityId = 96;

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
    private _approvalService: VersionApprovalService,
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
    this.initForm();
    this.getRolesLookUp();
    this.getUsersLookUp();
    this.getReviewStatuses();
    this.initializeTranslations();
    this.setupActionItems();

  }
  parentId!: number;
  getParentId() {
    const id = this.route.parent?.snapshot.paramMap.get('versionId');
    const documentId = this.route.parent?.snapshot.paramMap.get('Docid');
    if (!id) return;
    this.viewRoute = `/gfw-portal/governance/viewDocument/${documentId}/versions/${id}/approval`;
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
        visible: ()=>this._PermissionSystemService.can('GOVERNANCE' , 'APPROVAL' , 'VIEW')
      },
      {
        label: this.translate.instant(this.labels.delete),
        icon: 'fi fi-rr-trash',
        command: () => this.toggleDeleteModal(true),
            visible: ()=>this._PermissionSystemService.can('GOVERNANCE' , 'APPROVAL' , 'DELETE')
      },
      {
        label: this.translate.instant(this.labels.update),
        icon: 'fi fi-rr-pencil',
        command: () => this.handleUpdateClick(),
            visible: ()=>this._PermissionSystemService.can('GOVERNANCE' , 'APPROVAL' , 'EDIT')
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
    this._approvalService.getById(this.selectedRow).subscribe((res) => {
      this.initForm(res.data);
      this.visible_dialog = true;
    });
  }

  handleAddClick(): void {
    this.visible_dialog = true;

    console.log('Adding', this.FEATURE_NAME);
  }

  toggleDeleteModal(visible: boolean): void {
    if(!visible) {this.selectedRow = null}
    this.deleteModalVisible = visible;
  }

  delete(): void {
     if(!this._PermissionSystemService.can('GOVERNANCE' , 'APPROVAL' , 'DELETE')) return;

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
          this.closeDialog();
        },
        error: () => (this.loadingDelete = false),
      });
  }



  getListData(event?: any): void {
    this.loading = true;
    this.tableData = [];

    (this as any)[this.serviceName]
      .findAll(

        { govDocumentVersionID: this.parentId, ...event }
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
    this.sharedService.lookUps([210]).subscribe((res) => {
      this.approvalStatuses = res.data.GovDocumentApprovalStatusTypes;
    });
  }

  approvalStatuses: any[] = [];
  roles: any[] = [];
  users: any[] = [];
  visible_dialog: boolean = false;
  closeDialog() {
    this.visible_dialog = false;
    this.selectedRow = null;
    this.form.reset();
  }

  resetFields() {
    this.form.get('scope')?.reset();
    this.form.get('assigneeUserID')?.reset();
    this.form.get('assigneeRoleID')?.reset();
    this.form.get('approverUserID')?.reset();
  }

  handleAssigneRole() {
    this.selectedAssigne = 'role';
    this.resetFields();
    this.form.get('govDocumentApprovalAssigneeTypeID')?.setValue(2);
  }

  handleAssigneUser() {
    this.selectedAssigne = 'user';
    this.resetFields();
    this.form.get('govDocumentApprovalAssigneeTypeID')?.setValue(1);
  }

  handleApprovalUser() {
    this.selectedAssigne = 'approver';
    this.resetFields();
    this.form.get('govDocumentApprovalAssigneeTypeID')?.setValue(3);
  }
  isLoading: boolean = false;
  submit() {
    const canAdd = this._PermissionSystemService.can('GOVERNANCE' , 'APPROVAL' , 'ADD')
    const canEdit = this._PermissionSystemService.can('GOVERNANCE' , 'APPROVAL' , 'EDIT')
    if(this.selectedRow && !canEdit)return
    if(!this.selectedRow && !canAdd)return
    console.log(this.form, 'this.form');

    if (this.cannotSave()) return;

    this.isLoading = true;
    const approvalRequestDate = dateHandler(
      this.form.get('approvalRequestDate')?.value
    );
    const approvalDueDate = dateHandler(
      this.form.get('approvalDueDate')?.value
    );
    const approvalDate = dateHandler(this.form.get('approvalDate')?.value);
    const payload = {
      ...this.form.value,
      govDocumentVersionID: this.parentId,
    };

    console.log("Aprroval payload " , payload);

    this._approvalService
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
  selectedAssigne: any = 'user';
  form!: FormGroup;
  cannotSave() {
    return (
      this.form.invalid ||
      (!this.form.get('assigneeUserID')?.value &&
        !this.form.get('assigneeRoleID')?.value &&
        !this.form.get('approverUserID')?.value)
    );
  }
  initForm(data?: any) {
    this.form = new FormGroup({
      assigneeUserID: new FormControl(data?.assigneeUserID ?? null),
      assigneeRoleID: new FormControl(data?.assigneeRoleID ?? null),
      approverUserID: new FormControl(data?.approverUserID ?? null),

      govDocumentApprovalAssigneeTypeID: new FormControl(
        data?.govDocumentApprovalAssigneeTypeID ? data?.govDocumentApprovalAssigneeTypeID : 1
      ),

      isApprovalRequired: new FormControl(false )




    });
  }
}
