import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';

import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { ComplianceAssessmntService } from './../../../../services/compliance-assessmnt.service';
import { NewAttachListComponent } from '@gfw/shared-ui';
import { AttachmentsUiComponent } from 'libs/shared/shared-ui/src/lib/attachments-ui/attachments-ui.component';
import { ViewAttachementComponent } from 'libs/shared/shared-ui/src/lib/view-attachement/view-attachement.component';
import { EditAttachmentComponent } from 'libs/shared/shared-ui/src/lib/editAttachment/editAttachment.component';

@Component({
  selector: 'lib-evidance-compliance-attachment',
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    InputTextModule,
    DialogModule,
    ButtonModule,
    NewAttachListComponent,
    AttachmentsUiComponent,
    ViewAttachementComponent,
    EditAttachmentComponent,
  ],
  templateUrl: './evidanceComplianceAttachment.component.html',
  styleUrl: './evidanceComplianceAttachment.component.scss',
})
export class EvidanceComplianceAttachmentComponent implements OnInit, OnDestroy {
  // Environment
  env = 'https://example.com'; // Replace with actual env if needed

  // Main properties
  controlAssessmentID: any;
  attachments: any[] = [];
  show_add_dailog = false;
  displayModal = false;
  selected_file_show: any;
  edit_file_name = false;
  current_title_update = '';
  current_file_update: any;
  loadUpdate = false;
  loadingState = false;

  // Manage subscriptions
  private subscriptions: Subscription = new Subscription();

  constructor(
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _MessageService: MessageService,
    private _ActivatedRoute: ActivatedRoute,
    private _sharedService: SharedService,
    private _ComplianceAssessmntService: ComplianceAssessmntService
  ) {}

  ngOnInit(): void {
    this.initializeControlAssessmentID();
    this.getAttachments();
  }

  /** Initialize controlAssessmentID from route params */
  initializeControlAssessmentID(): void {
    const routeSub = this._ActivatedRoute.parent?.paramMap.subscribe((res) => {
      this.controlAssessmentID = res.get('id');
      if (this.controlAssessmentID) {
        this.setBreadcrumbs();
      }
    });
    this.subscriptions.add(routeSub);
  }

  /** Set breadcrumbs for the page */
  setBreadcrumbs(): void {
    const breadSub = this._ComplianceAssessmntService
      .getEvidenceComplianceById(this.controlAssessmentID)
      .subscribe((res: any) => {
        const evidenceName = res?.data?.name || '-';
        this._LayoutService.breadCrumbLinks.next([
         { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
           {
              name: this._TranslateService.instant('BREAD_CRUMB_TITLES.EVIDENCE_COMPLIANCE_LIST'),
              icon: '',
              routerLink: '/gfw-portal/compliance/evidenceType',
            },
            { name: evidenceName, icon: '', routerLink: `/gfw-portal/compliance/evidenceType/${this.controlAssessmentID}` },
          {
            name: this._TranslateService.instant('TABS.ATTACHMENTS'),
            icon: '',
          },
        ]);
      });
    this.subscriptions.add(breadSub);
  }

  /** Fetch all attachments for the current control assessment */
  getAttachments(): void {
    if (!this.controlAssessmentID) return;

    this.loadingState = true;
    const attachSub = this._sharedService
      .getNewAttachment(55, +this.controlAssessmentID, 55)
      .subscribe({
        next: (res: any) => {
          this.attachments = res?.data ?? [];
          this.loadingState = false;
        },
        error: () => (this.loadingState = false),
      });
    this.subscriptions.add(attachSub);
  }

  /** Handle adding a new attachment */
  handleAdded(event: any): void {
    if (event) this.getAttachments();
    this.show_add_dailog = false;
  }

  /** Show/hide add attachment dialog */
  handleShowAdd(event: boolean): void {
    this.show_add_dailog = event;
  }

  /** Handle action buttons on single attachment (Delete, Download, Show, Edit) */
  handleActionSingleFile(event: any): void {
    switch (event.action) {
      case 'Delete':
        this.deleteAttachment(event.file.fileID);
        break;

      case 'Download':
        this.downloadAttachment(event.file);
        break;

      case 'Show':
        this.showAttachment(event.file.fileUsageID);
        break;

      case 'Edit':
        this.editAttachment(event.file);
        break;
    }
  }

  /** Delete attachment */
  private deleteAttachment(fileID: any): void {
    const deleteSub = this._sharedService.deleteAttachment(fileID).subscribe({
      next: () => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this._TranslateService.instant('ATTACHMENT.DeletedSuccessfully'),
        });
        this.getAttachments();
      },
    });
    this.subscriptions.add(deleteSub);
  }

  /** Download attachment */
  private downloadAttachment(file: any): void {
    const downloadSub = this._sharedService.downloadAttachment(file.fileID).subscribe({
      next: (res: any) => {
        const blob = new Blob([res], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${file.fileTitle}.${file.fileExtension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
    });
    this.subscriptions.add(downloadSub);
  }

  /** Show attachment in modal */
  private showAttachment(fileUsageID: any): void {
    const showSub = this._sharedService.getSingleAttachment(fileUsageID).subscribe({
      next: (res: any) => {
        this.selected_file_show = res?.data;
        this.displayModal = true;
      },
    });
    this.subscriptions.add(showSub);
  }

  /** Edit attachment */
  private editAttachment(file: any): void {
    this.edit_file_name = true;
    this.current_title_update = file.fileTitle;
    this.current_file_update = file;
  }

  /** Update attachment title */
  handleUpdateTitle(newTitle: string): void {
    if (!this.current_file_update) return;

    this.loadUpdate = true;
    const updateSub = this._sharedService
      .updateAttachment(this.current_file_update.fileUsageID, newTitle, 55)
      .subscribe({
        next: () => {
          this.loadUpdate = false;
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: this._TranslateService.instant('ATTACHMENT.UpdatedSuccessfully'),
          });
          this.edit_file_name = false;
          this.current_file_update = null;
          this.current_title_update = '';
          this.getAttachments();
        },
        error: () => (this.loadUpdate = false),
      });
    this.subscriptions.add(updateSub);
  }

  /** Hide the attachment view modal */
  handleHideView(event: boolean): void {
    this.displayModal = event;
  }

  /** Clean up all subscriptions to prevent memory leaks */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
