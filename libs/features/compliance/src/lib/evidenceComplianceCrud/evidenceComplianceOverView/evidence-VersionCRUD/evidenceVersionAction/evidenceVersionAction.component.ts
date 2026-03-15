import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription, finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { DatePackerComponent, NewAttachListComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { ComplianceAssessmntService } from 'libs/features/compliance/src/services/compliance-assessmnt.service';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ViewAttachmentSingleModalComponent } from '../view-attachment-single-modal/view-attachment-single-modal.component';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-evidence-version-action',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    UiDropdownComponent,
    DatePackerComponent,
    ButtonModule,
    DialogModule,
    SkeletonModule,
    RadioButtonModule,
    ViewAttachmentSingleModalComponent,
    InputNumberComponent,
  ],
  templateUrl: './evidenceVersionAction.component.html',
  styleUrls: ['./evidenceVersionAction.component.scss'],
})
export class EvidenceVersionActionComponent implements OnInit, OnDestroy {
  // Declaration Variable
  evidenceVersionForm!: FormGroup;
  isLoading = false;
  validationsRequired = [{ key: 'required', message: 'VALIDATIONS.REQUIRED' }];
  statuses: any[] = [];
  users: any[] = [];
  evidenceVersionId: any;
  dataEnityId: any;
  idResult: any;
  selectedFiles: any[] = [];
  private subscriptions: Subscription = new Subscription();

  constructor(
    private _Router: Router,
    private _ComplianceService: ComplianceAssessmntService,
    private _SharedService: SharedService,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _MessageService: MessageService,
    private _ActivatedRoute: ActivatedRoute,
    private _PermissionSystemService: PermissionSystemService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.updateBreadcrumbs();
    // Subscribe to route params
    const routeSub = this._ActivatedRoute.paramMap.subscribe((params) => {
      this.dataEnityId = params.get('id');
      this.evidenceVersionId = params.get('evidenceVersionId');

      if (this.evidenceVersionId) {
        // Fetch existing evidence version data
        const fetchSub = this._ComplianceService
          .getEvidenceVersionById(this.evidenceVersionId)
          .subscribe((res: any) => {
            this.initializeForm(res?.data);
            this.updateBreadcrumbs(res?.data?.evidenceTypeName);
          });
        this.subscriptions.add(fetchSub);
      }
    });

    this.subscriptions.add(routeSub);

    this.loadLookups();
  }

  // Handle Breadcrumbs
  private updateBreadcrumbs(evidenceTypeName?: string) {
    this._LayoutService.breadCrumbLinks.next([
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      {
        name: this._TranslateService.instant('HEARDE_TABLE.EVIDENCE_VERSION'),
        icon: '',
        routerLink: `/gfw-portal/compliance/evidenceType/${this.dataEnityId}/evidence-Version`,
      },
      {
        name: this.evidenceVersionId
          ? evidenceTypeName
          : this._TranslateService.instant(
              'HEARDE_TABLE.ADD_NEW_EVIDENCE_VERSION'
            ),
        icon: '',
        routerLink: '',
      },
    ]);
  }

  // Handle lookups
  private loadLookups() {
    const statusSub = this._SharedService
      .lookUps([193])
      .subscribe((res: any) => {
        this.statuses = res?.data?.EvidenceTypeVersionStatusType ?? [];
      });

    const usersSub = this._SharedService
      .getUserLookupData()
      .subscribe((res: any) => {
        this.users = res?.data ?? [];
      });

    this.subscriptions.add(statusSub);
    this.subscriptions.add(usersSub);
  }

  // Handle Form
  initializeForm(data?: any) {
    this.evidenceVersionForm = new FormGroup({
      versionNumber: new FormControl(data?.versionNumber, Validators.required),
      expiryDate: new FormControl(
        data?.expiryDate ? moment(data.expiryDate).format('MM-DD-YYYY') : null
      ),
      // evidenceTypeVersionStatusTypeID: new FormControl(
      //   data?.evidenceTypeVersionStatusTypeID,
      //   Validators.required
      // ),
    });
  }

  // Handle Save Evideance Version
  submit() {
    const canAdd = this._PermissionSystemService.can(
      'COMPLIANCE',
      'EVIDENCECOMPLIANCEVERSION',
      'ADD'
    );
    const canEdit = this._PermissionSystemService.can(
      'COMPLIANCE',
      'EVIDENCECOMPLIANCEVERSION',
      'EDIT'
    );
    if (this.evidenceVersionId && !canEdit) return;
    if (!this.evidenceVersionId && !canAdd) return;
    if (this.evidenceVersionForm.invalid) {
      this.evidenceVersionForm.markAllAsTouched();
      return;
    }

    const formValue = { ...this.evidenceVersionForm.value };

    const payload: any = {
      ...formValue,
      evidenceTypeID: Number(this.dataEnityId),
      expiryDate: formValue.expiryDate
        ? moment(formValue.expiryDate, 'MM-DD-YYYY').utc(true).toISOString()
        : null,
    };

    if (this.evidenceVersionId) {
      payload.evidenceTypeVersionID = Number(this.evidenceVersionId);
    }

    const request$ = this.evidenceVersionId
      ? this._ComplianceService.updateEvidenceVersion(payload)
      : this._ComplianceService.addEvidenceVersion(payload);

    this.isLoading = true;
    const saveSub = request$
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res: any) => {
        if (res.idResult) {
          this.idResult = res.idResult;
          if (this.selectedFiles.length > 0) {
            this.sendAttachment();
          } else {
            this._MessageService.add({
              severity: 'success',
              summary: 'Success',
              detail: this._TranslateService.instant(
                this.evidenceVersionId
                  ? 'EVIDENCE_VERSION.UPDATE_SUCCESS'
                  : 'EVIDENCE_VERSION.ADD_SUCCESS'
              ),
            });
            this._Router.navigate([
              `/gfw-portal/compliance/evidenceType/${this.dataEnityId}/evidence-Version`,
            ]);
          }
        }
      });

    this.subscriptions.add(saveSub);
  }

  // Handle selected file from modal
  handleFileSelected(file: any) {
    this.selectedFiles.push(file);
  }
  // Handle send one file
  private sendAttachment() {
    const selected = this.selectedFiles[0];
    const formData = new FormData();

    formData.append('File', selected.File);
    formData.append('FileTitle', selected.FileTitle);
    formData.append('DataClassificationID', selected.DataClassificationID);
    // formData.append('FileTypeID', selected.FileTypeID);
    formData.append(
      'IsVisibleInSearch',
      selected.IsVisibleInSearch ? 'true' : 'false'
    );
    formData.append('DataEnityTypeID', '64');
    formData.append('DataEnityID', this.idResult);
    formData.append('fileUsageTypeID', '64');

    const attachSub = this._SharedService
      .saveAttachment(formData)
      .subscribe((res: any) => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this._TranslateService.instant(
            'ATTACHMENT.AddedSuccessfully'
          ),
        });
        if (res?.code === 200) {
          this._Router.navigate([
            `/gfw-portal/compliance/evidenceType/${this.dataEnityId}/evidence-Version`,
          ]);
        }
      });

    this.subscriptions.add(attachSub);
  }
  displayModal:any
  selected_file_show: any;
   handleHideView(event: boolean) {
      this.displayModal = event;
    }

      handleActionSingleFile(event: any) {
    switch (event.action) {
      case 'Show':
        this._SharedService
          .getSingleAttachment(event.file.fileUsageID)
          .subscribe({
            next: (res: any) => {
              this.selected_file_show = res?.data;
              this.displayModal = true;
            },
          });
        break;

      default:
        break;
    }
  }
  // Unsubscribe from all subscriptions to prevent memory leaks
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
