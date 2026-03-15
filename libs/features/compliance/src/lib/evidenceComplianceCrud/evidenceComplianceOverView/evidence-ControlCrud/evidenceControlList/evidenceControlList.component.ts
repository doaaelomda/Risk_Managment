import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { finalize, Subscription } from 'rxjs';

/* Shared UI Components */
import { DeleteConfirmPopupComponent, TextareaUiComponent } from '@gfw/shared-ui';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SharedUiComponent } from '@gfw/shared-ui';
import { ComplianceAssessmntService } from 'libs/features/compliance/src/services/compliance-assessmnt.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-evidence-control-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MenuModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    DialogModule,
    SkeletonModule,
    TextareaUiComponent,
    UiDropdownComponent,
    ReactiveFormsModule,
    NewTableComponent,
  ],
  templateUrl: './evidenceControlList.component.html',
  styleUrls: ['./evidenceControlList.component.scss'],
})
export class EvidenceControlListComponent implements OnInit, OnDestroy {
  // Form
  addEvidenceForm!: FormGroup;

  // Properties
  evidenceId: any;
  items: any[] = [];
  columnControl: any = { type: 'popup', data: '' };
  paginationObj = { perPage: 10, currentPage: 1, totalItems: 0, totalPages: 1 };
  current_filters: any[] = [];
  sort_data: any;
  loadingTable = true;
  dataTable: any[] = [];
  current_row_selected: any;
  actionDeleteVisible = false;
  loadDeleted = false;
  addDialogVisible = false;
  loadingSaveBtn = false;

  // Lookups
  govControls: any;

  // Modals
  showViewModal: boolean = false;
  singleTaskData: any;

  // Selected evidence control for edit/update
  evidenceTypeControlID: any;

  // Payload for data table refresh
  current_evidence_payload: any;

  // Subscriptions
  private subscriptions: Subscription = new Subscription();

  validationsRequired: any[] = [{ key: 'required', message: 'VALIDATIONS.REQUIRED' }];

  constructor(
    private _MessageService: MessageService,
    private _Router: Router,
    private _ComplianceService: ComplianceAssessmntService,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _ActivatedRoute: ActivatedRoute,
    public _PermissionSystemService:PermissionSystemService
  ) {
    // Get evidenceId from parent route and set breadcrumbs
    const routeSub = this._ActivatedRoute?.parent?.paramMap.subscribe((params) => {
      this.evidenceId = params.get('id');
      const sub = this._ComplianceService.getEvidenceComplianceById(this.evidenceId)
        .subscribe((res: any) => {
          const evidenceName = res?.data?.name || '-';
          this._LayoutService.breadCrumbLinks.next([
            { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
           {
              name: this._TranslateService.instant('BREAD_CRUMB_TITLES.EVIDENCE_COMPLIANCE_LIST'),
              icon: '',
              routerLink: '/gfw-portal/compliance/evidenceType',
            },
            { name: evidenceName, icon: '', routerLink: `/gfw-portal/compliance/evidenceType/${this.evidenceId}` },
            { name: this._TranslateService.instant('BREAD_CRUMB_TITLES.EVIDENCE_CONTROL_LIST'), icon: ''},
          ]);
        });
      this.subscriptions.add(sub);
    });
    this.subscriptions.add(routeSub);
  }

  ngOnInit(): void {
    this.initForm();

    // Action items for table row menu
    this.items = [
      {
        label: this._TranslateService.instant('EVIDENCE_CONTROL.VIEW'),
        icon: 'fi fi-rr-eye',
        command: () => this.openViewModal(),
        visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'EVIDENCECOMPLIANCECONTROL' , 'VIEW')

      },
      {
        label: this._TranslateService.instant('EVIDENCE_CONTROL.DELETE'),
        icon: 'fi fi-rr-trash',
        command: () => this.handleShowDelete(true),
        visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'EVIDENCECOMPLIANCECONTROL' , 'DELETE')
      },
      {
        label: this._TranslateService.instant('EVIDENCE_CONTROL.UPDATE'),
        icon: 'fi fi-rr-pencil',
        command: () => this.openEditModal(),
        visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'EVIDENCECOMPLIANCECONTROL' , 'EDIT')
      },
    ];

    this.loadLookups();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Prevent memory leaks
  }

  /** Initialize the form */
  initForm(data?: any) {
    this.addEvidenceForm = new FormGroup({
      purpose: new FormControl(data?.purpose, Validators.required),
      govControlID: new FormControl(data?.govControlID, Validators.required),
    });
  }

  /** Load dropdown lookups */
  private loadLookups() {
    const sub = this._SharedService.lookUps([28]).subscribe((res: any) => {
      this.govControls = res?.data?.GovControl;
    });
    this.subscriptions.add(sub);
  }

  /** Open Add modal */
  openAddModal() {
    this.addDialogVisible = true;
    this.evidenceTypeControlID = null;
    this.addEvidenceForm.reset();
  }

  /** Close Add/Edit modal */
  closeAddDialog() {
    this.addDialogVisible = false;
    this.addEvidenceForm.reset();
  }

  /** Open Edit modal */
  private openEditModal() {
    this.addDialogVisible = true;
    const sub = this._ComplianceService.getEvidenceControlById(this.current_row_selected)
      .subscribe((res: any) => {
        this.evidenceTypeControlID = res?.data?.evidenceTypeControlID;
        this.initForm(res?.data);
      });
    this.subscriptions.add(sub);
  }

  /** Show Delete modal */
  handleShowDelete(_: boolean) {
    this.actionDeleteVisible = true;
  }

  /** Hide Delete modal */
  handleClosedDelete() {
    this.actionDeleteVisible = false;
  }

  /** Delete Evidence Control */
  deleteEvidenceControl() {
     if(!this._PermissionSystemService.can('COMPLIANCE' , 'EVIDENCECOMPLIANCECONTROL' , 'DELETE')) return;

    this.loadDeleted = true;
    const sub = this._ComplianceService.deleteEvidenceControl(this.current_row_selected)
      .pipe(finalize(() => (this.loadDeleted = false)))
      .subscribe(() => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this._TranslateService.instant('EVIDENCE_CONTROL.DELETE_SUCCESS'),
        });
        this.getDataTable(this.current_evidence_payload);
        this.handleClosedDelete();
      });
    this.subscriptions.add(sub);
  }

  /** Open View modal */
  openViewModal() {
    this.showViewModal = true;
    const sub = this._ComplianceService.getEvidenceControlById(this.current_row_selected)
      .subscribe((res: any) => {
        this.singleTaskData = res?.data;
      });
    this.subscriptions.add(sub);
  }

  /** Close View modal */
  onModalClose() {
    this.showViewModal = false;
  }

  /** Save or Update Evidence Control */
  saveEvidenceControl() {
    const canAdd = this._PermissionSystemService.can('COMPLIANCE' , 'EVIDENCECOMPLIANCECONTROL' , 'ADD')
    const canEdit = this._PermissionSystemService.can('COMPLIANCE' , 'EVIDENCECOMPLIANCECONTROL' , 'EDIT')
    if(this.evidenceTypeControlID && !canEdit)return
    if(!this.evidenceTypeControlID && !canAdd)return
    if (this.addEvidenceForm.invalid) {
      this.addEvidenceForm.markAllAsTouched();
      return;
    }

    this.loadingSaveBtn = true;
    const formValue = { ...this.addEvidenceForm.value, evidenceTypeID: this.evidenceId };
    const payload = this.evidenceTypeControlID ? { ...formValue, evidenceTypeControlID: this.evidenceTypeControlID } : formValue;

    const request$ = this.evidenceTypeControlID
      ? this._ComplianceService.updateEvidenceControl(payload)
      : this._ComplianceService.addEvidenceControl(payload);

    const sub = request$.pipe(finalize(() => (this.loadingSaveBtn = false)))
      .subscribe(() => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this._TranslateService.instant(
            this.evidenceTypeControlID ? 'EVIDENCE_CONTROL.UPDATED_SUCCESS' : 'EVIDENCE_CONTROL.ADDED_SUCCESS'
          ),
        });
        this.getDataTable(this.current_evidence_payload);
        this.closeAddDialog();
      });
    this.subscriptions.add(sub);
  }

  /** Set selected row */
  setSelected(event: any) {
    this.current_row_selected = event;
  }

  /** Refresh data table */
  handleDataTable(payload: any = null) {
    this.current_evidence_payload = payload;
    this.getDataTable(payload);
  }

  /** Get data table from API */
  getDataTable(payload: any) {
    this.loadingTable = true;
    this.dataTable = [];
    const sub = this._ComplianceService.getEvidenceControlSearch(payload, +this.evidenceId)
      .pipe(finalize(() => (this.loadingTable = false)))
      .subscribe((res: any) => {
        this.dataTable = res?.data?.items;
        this.paginationObj = {
          perPage: res?.data?.pageSize,
          currentPage: res?.data?.pageNumber,
          totalItems: res?.data?.totalCount,
          totalPages: res?.data?.totalPages,
        };
        this._SharedService.paginationSubject.next(this.paginationObj);
      });
    this.subscriptions.add(sub);
  }
}
