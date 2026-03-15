import { UserCardComponent } from './../../../../../../shared/shared-ui/src/lib/UserCard/UserCard.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import {
  DeleteConfirmPopupComponent,
  EmptyStateComponent,
  LoaderComponent,
  RoleDropdownComponent,
  TextareaUiComponent,
  UserDropdownComponent,
} from '@gfw/shared-ui';
import { GovDocumentsService } from '../../../service/covDocument.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { ComplianceService } from 'libs/features/compliance/src/compliance/compliance.service';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { finalize } from 'rxjs';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'lib-selectors',
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    UiDropdownComponent,
    UserCardComponent,
    DialogModule,
    ReactiveFormsModule,
    ButtonModule,
    TextareaUiComponent,
    RoleDropdownComponent,
    DeleteConfirmPopupComponent,
    EmptyStateComponent,
    LoaderComponent,
    RadioButtonModule,
    UserDropdownComponent,
  ],
  templateUrl: './selectors.component.html',
  styleUrl: './selectors.component.scss',
})
export class SelectorsComponent {
  mainForm!: FormGroup;
  approversForm!: FormGroup;
  reviewersForm!: FormGroup;

  approvers: any[] = [];
  reviewers: any[] = [];
  users: any[] = [];
  roles: any[] = [];

  actionDeleteVisible: boolean = false;
  requiredOptions = [
    { label: 'Yes', id: true },
    { label: 'No', id: false },
  ];

  documentId: any;

  isDeleting: boolean = false;
  constructor(
    private _GovDocumentsService: GovDocumentsService,
    private route: ActivatedRoute,
    private _MessageService: MessageService,
    private _SharedService: SharedService,
    private _ComplianceService: ComplianceService,
    private _DocumentService: RiskService,
    public _PermissionSystemService: PermissionSystemService
  ) {
    this.getUsersLookUp();
    this.getRolesLookUp();
    this.initMainForm();
    this.initApproverForm();
    this.initReviewerForm();

    const documentId = this.route?.snapshot.parent?.paramMap.get('Docid');
    if (!documentId) return;
    this.documentId = +documentId;
    this.getData();
    this.getApprovers(this.documentId);
    this.getReviewers(this.documentId);
  }
  isLoadingData: boolean = false;
  getData() {
    this.isLoadingData = true;
    if (this.documentId) {
      this._DocumentService
        .getOneDoc(this.documentId)
        .pipe(finalize(() => (this.isLoadingData = false)))
        .subscribe((res) => {
          this.currentDocumentData = res?.data
          this.initMainForm(res?.data);
        });
    }
  }
  currentDocumentData:any
  getUsersLookUp() {
    this._SharedService.getUserLookupData().subscribe((res) => {
      console.log(res, 'users here');
      this.users = res?.data;
    });
  }
  getRolesLookUp() {
    this._SharedService.getRoleLookupData().subscribe((res) => {
      this.roles = res?.data;
    });
  }
  initMainForm(data?: any) {
    this.mainForm = new FormGroup({
      ownerRoleID: new FormControl(data?.ownerRoleID, Validators.required),
      coordinatorUserID: new FormControl(
        data?.coordinatorUserID,
        Validators.required
      ),
    });

    console.log(this.mainForm.value, 'form');
  }
  initApproverForm(data?: any) {
    this.approversForm = new FormGroup({
      isRequired: new FormControl(
        data?.isRequired ?? false,
        Validators.required
      ),
      approverUserID: new FormControl(data?.approverUserID ?? null),
      approverRoleID: new FormControl(data?.approverRoleID ?? null),
      govDocumentApproverTypeID: new FormControl(
        data?.govDocumentApproverTypeID ?? 1,
        Validators.required
      ),
    });
  }

  cannotSaveApprover() {
    const type = this.approversForm.get('govDocumentApproverTypeID')?.value;
    const noUserID = !this.approversForm.get('approverUserID')?.value;
    const noRoleID = !this.approversForm.get('approverRoleID')?.value;
    return (type == 1 && noUserID) || (type == 2 && noRoleID);
  }
  cannotSaveReviewer() {
    const type = this.reviewersForm.get('govDocumentReviewerTypeID')?.value;
    const noUserID = !this.reviewersForm.get('reviewerUserID')?.value;
    const noRoleID = !this.reviewersForm.get('reviewerRoleID')?.value;
    return (type == 1 && noUserID) || (type == 2 && noRoleID);
  }
  initReviewerForm(data?: any) {
    this.reviewersForm = new FormGroup({
      scope: new FormControl(data?.scope ?? null),
      reviewerUserID: new FormControl(data?.reviewerUserID ?? null),
      reviewerRoleID: new FormControl(data?.reviewerRoleID ?? null),
      govDocumentReviewerTypeID: new FormControl(
        data?.govDocumentReviewerTypeID ?? 1,
        Validators.required
      ),
    });
  }

  getApprovers(id: any) {
    this._GovDocumentsService.getApprovers(id).subscribe((res: any) => {
      this.approvers = res?.data || [];
    });
  }

  getReviewers(id: any) {
    this._GovDocumentsService.getReviewers(id).subscribe((res: any) => {
      this.reviewers = res?.data || [];
    });
  }

  currentDeleteType: 'Reviewer' | 'Approver' | null = null;
  currentDeleteID: any = null;

  isSavingDocument: boolean = false;
  saveDocument() {
    const canEdit = this._PermissionSystemService.can(
      'GOVERNANCE',
      'GOVDOCUMENTSTACKHOLDERS',
      'EDIT'
    );

    if (!canEdit) return;

    if (this.mainForm.invalid) {
      this.mainForm.markAllAsTouched();
      return;
    }
    this.isSavingDocument = true;
    const payload = { ...this.currentDocumentData,...this.mainForm.value, id: this.documentId };
    this._DocumentService
      .updateDocument(this.documentId, payload)
      .pipe((finalize(() => this.isSavingDocument = false))).subscribe((res: any) => {
        
        this._MessageService.add({
          severity: 'success',
          summary: 'Update Success',
          detail: 'Compliance Document Updated Successfully',
        });
        this.getData();
      });
  }

  selectedItem: any;
  isEditingItem: boolean = false;
  handleUserAction(event: unknown, item: any, type: 'reviewer' | 'approver') {
    console.log({ event, item, type }, 'action clicked');
    this.selectedItem = { type, ...item };
    console.log(this.selectedItem, 'this.selectedItem');

    switch (event) {
      case 'Delete':
        {
          this.actionDeleteVisible = true;
        }
        break;
      case 'Edit':
        {
          this.isEditingItem = true;
          if (type === 'reviewer') {
            this.initReviewerForm(item);
            this.openReviewerModal();
          } else {
            this.initApproverForm(item);
            this.openApproverModal();
          }
        }
        break;
    }
  }

  deleteItem() {
    if (
      !this._PermissionSystemService.can(
        'GOVERNANCE',
        'GOVDOCUMENTSTACKHOLDERS',
        'DELETE'
      )
    )
      return;

    this.isDeleting = true;
    const isReviewer = this.selectedItem.type === 'reviewer';
    const deleteMethod$ = isReviewer
      ? this._GovDocumentsService.deleteReviewer(
          this.selectedItem?.govDocumentReviewerID
        )
      : this._GovDocumentsService.deleteApprover(
          this.selectedItem?.govDocumentApproverID
        );

    deleteMethod$.pipe(finalize(() => (this.isDeleting = false))).subscribe({
      next: () => {
        this._MessageService.add({
          severity: 'success',
          detail: `${
            isReviewer ? 'Reviewer' : 'Approver'
          } Deleted Successfully.`,
        });
        this.onHideDelete();
        isReviewer
          ? this.getReviewers(this.documentId)
          : this.getApprovers(this.documentId);
      },
    });
  }
  onHideDelete() {
    this.actionDeleteVisible = false;
    this.resetData();

    //
  }
  visibleApproverModal: boolean = false;
  visibleReviewerModal: boolean = false;
  openReviewerModal() {
    this.visibleApproverModal = false;
    this.visibleReviewerModal = true;
  }
  openApproverModal() {
    this.visibleApproverModal = true;
    this.visibleReviewerModal = false;
  }

  resetData() {
    this.selectedItem = null;
    this.visibleApproverModal = false;
    this.visibleReviewerModal = false;
    this.actionDeleteVisible = false;
    this.isEditingItem = false;
    this.initApproverForm()
    this.initReviewerForm()
  }

  types: any[] = [
    {
      id: 1,
      label: 'User',
      value: 1,
      img: 'images/icons/approvalUser.svg',
    },
    {
      id: 2,
      label: 'Role',
      value: 2,
      img: 'images/icons/userApproval.svg',
    },
  ];
  setType(value: number, type: 'approver' | 'reviewer') {
    if (type === 'approver') {
      this.approversForm.get('govDocumentApproverTypeID')?.setValue(value);
    } else if (type === 'reviewer') {
      this.approversForm.get('govDocumentReviewerTypeID')?.setValue(value);
    }
  }
  isSavingItem: boolean = false;
  saveApprover() {
    const canAdd = this._PermissionSystemService.can(
      'GOVERNANCE',
      'GOVDOCUMENTSTACKHOLDERS',
      'ADD'
    );
    const canEdit = this._PermissionSystemService.can(
      'GOVERNANCE',
      'GOVDOCUMENTSTACKHOLDERS',
      'EDIT'
    );
    if (this.selectedItem?.govDocumentApproverID && !canEdit) return;
    if (!this.selectedItem?.govDocumentApproverID && !canAdd) return;
    if (this.approversForm.invalid || this.cannotSaveApprover()) return;
        const type = this.approversForm.get('govDocumentApproverTypeID')?.value;
    const userID = this.approversForm.get('approverUserID');
    const roleID = this.approversForm.get('approverRoleID');
    if(type == 1){
      roleID?.setValue(null)
    }else {
      userID?.setValue(null)
    }
    this.isSavingItem = true;
    this._GovDocumentsService
      .saveApprover(
        { ...this.approversForm.value, govDocumentID: this.documentId },
        this.selectedItem?.govDocumentApproverID
      )
      .pipe(finalize(() => (this.isSavingItem = false)))
      .subscribe({
        next: () => {
          this._MessageService.add({
            severity: 'success',
            detail: 'Approver Saved Successfully.',
          });
          this.getApprovers(this.documentId);
          this.visibleApproverModal = false;
        },
      });
  }
  saveReviewer() {
    const canAdd = this._PermissionSystemService.can(
      'GOVERNANCE',
      'GOVDOCUMENTSTACKHOLDERS',
      'ADD'
    );
    const canEdit = this._PermissionSystemService.can(
      'GOVERNANCE',
      'GOVDOCUMENTSTACKHOLDERS',
      'EDIT'
    );
    if (this.selectedItem?.govDocumentReviewerID && !canEdit) return;
    if (!this.selectedItem?.govDocumentReviewerID && !canAdd) return;

    if (this.reviewersForm.invalid || this.cannotSaveReviewer()) return;
        const type = this.reviewersForm.get('govDocumentReviewerTypeID')?.value;
    const userID = this.reviewersForm.get('reviewerUserID');
    const roleID = this.reviewersForm.get('reviewerRoleID');
    if(type ==1 ){
      roleID?.setValue(null)
    }else {
      userID?.setValue(null)
    }
    this.isSavingItem = true;
    this._GovDocumentsService
      .saveReviewer(
        { ...this.reviewersForm.value, govDocumentID: this.documentId },
        this.selectedItem?.govDocumentReviewerID
      )
      .pipe(finalize(() => (this.isSavingItem = false)))
      .subscribe({
        next: () => {
          this._MessageService.add({
            severity: 'success',
            detail: 'Reviewer Saved Successfully.',
          });
          this.getReviewers(this.documentId);
          this.visibleReviewerModal = false;
        },
      });
  }
}
