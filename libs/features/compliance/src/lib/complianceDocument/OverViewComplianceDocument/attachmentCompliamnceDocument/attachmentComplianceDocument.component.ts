import { Breadcrumb } from './../../../../../../../../apps/gfw-portal/src/app/core/models/breadcrumb.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { Subscription } from 'rxjs';
import { EditAttachmentComponent } from 'libs/shared/shared-ui/src/lib/editAttachment/editAttachment.component';
import { FormsModule } from '@angular/forms';
import { AttachmentsUiComponent } from 'libs/shared/shared-ui/src/lib/attachments-ui/attachments-ui.component';
import { NewAttachListComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ViewAttachementComponent } from 'libs/shared/shared-ui/src/lib/view-attachement/view-attachement.component';
import { InputTextModule } from 'primeng/inputtext';
import { ComplianceService } from 'libs/features/compliance/src/compliance/compliance.service';

@Component({
  selector: 'app-attachment-compliance-document',
  templateUrl: './attachmentComplianceDocument.component.html',
  styleUrls: ['./attachmentComplianceDocument.component.scss'],
  imports: [
    TranslateModule,
    InputTextModule,
    ViewAttachementComponent,
    CommonModule,
    DialogModule,
    ButtonModule,
    NewAttachListComponent,
    AttachmentsUiComponent,
    FormsModule,
    EditAttachmentComponent,
  ],
})
export class AttachmentComplianceDocumentComponent
  implements OnInit, OnDestroy
{
  // ======= Properties =======
  current_id: any; // Parent entity ID
  attachments: any[] = []; // Attachments list

  // UI state flags
  show_add_dailog = false;
  displayModal = false;
  edit_file_name = false;
  loadUpdate = false;
  loadingState = false;

  // Current selected file for edit/view
  selected_file_show: any;
  current_file_update: any;
  current_title_update = '';

  // Subscriptions
  private subscriptions: Subscription = new Subscription();

  constructor(
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _MessageService: MessageService,
    private _ActivatedRoute: ActivatedRoute,
    private _sharedService: SharedService,
    private ComplianceService: ComplianceService
  ) {}

  // Get parent route param 'id' and load attachments
  geIdFromRouting() {
    const sub = this._ActivatedRoute.parent?.paramMap.subscribe((params) => {
      this.current_id = params.get('id');
      if (this.current_id) {
        this.getAttachments();
        this.ComplianceService.getDocumentCompliance(this.current_id).subscribe(
          (res) => {
            this.getDefaultBreadcrumbs(res?.data);
          }
        );
      }
    });

    if (sub) this.subscriptions.add(sub);
  }

  // ======= Methods =======

  /** Fetch attachments from server */
  getAttachments(): void {
    if (!this.current_id) return;

    this.loadingState = true;

    const sub = this._sharedService
      .getNewAttachment(17, +this.current_id, 17)
      .subscribe({
        next: (res: any) => {
          this.attachments = res?.data;
          this.loadingState = false;
        },
        error: () => {
          this.loadingState = false;
        },
      });

    this.subscriptions.add(sub);
  }

  /** Handle file added */
  handleAdded(event: any): void {
    if (event) this.getAttachments();
    this.show_add_dailog = false;
  }

  /** Toggle Add dialog */
  handleShowAdd(event: boolean): void {
    this.show_add_dailog = event;
  }

  /** Handle actions from single file (Delete, Download, Show, Edit) */
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
        this.edit_file_name = true;
        this.current_title_update = event.file.fileTitle;
        this.current_file_update = event.file;
        break;
      default:
        break;
    }
  }

  /** Delete attachment */
  private deleteAttachment(fileID: number): void {
    const sub = this._sharedService.deleteAttachment(fileID).subscribe({
      next: () => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Attachment Deleted Successfully',
        });
        this.getAttachments();
      },
    });
    this.subscriptions.add(sub);
  }

  /** Download attachment */
  private downloadAttachment(file: any): void {
    const sub = this._sharedService.downloadAttachment(file.fileID).subscribe({
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
    this.subscriptions.add(sub);
  }

  /** Show attachment in modal */
  private showAttachment(fileUsageID: number): void {
    const sub = this._sharedService.getSingleAttachment(fileUsageID).subscribe({
      next: (res: any) => {
        this.selected_file_show = res?.data;
        this.displayModal = true;
      },
    });
    this.subscriptions.add(sub);
  }

  /** Update attachment title */
  handleUpdateTitle(newTitle: string): void {
    if (!this.current_file_update) return;

    this.loadUpdate = true;

    const sub = this._sharedService
      .updateAttachment(this.current_file_update.fileUsageID, newTitle, 17)
      .subscribe({
        next: () => {
          this.loadUpdate = false;
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Attachment Updated Successfully',
          });
          this.edit_file_name = false;
          this.getAttachments();
          this.current_file_update = null;
          this.current_title_update = '';
        },
        error: () => {
          this.loadUpdate = false;
        },
      });

    this.subscriptions.add(sub);
  }

  /** Hide view modal */
  handleHideView(event: boolean): void {
    this.displayModal = event;
  }

  // handle Breadcrumb
  private getDefaultBreadcrumbs(data: any) {
    this._LayoutService.breadCrumbLinks.next([
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.COMPLIANCE_GOVERNANCE'
        ),
        icon: '',
        routerLink: '/gfw-portal/compliance/complianceDocuments',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.DOCUMENTS'),
        icon: '',
        routerLink: '/gfw-portal/compliance/complianceDocuments',
      },
      {
        name: data?.name ?? '-',
        icon: '',
        routerLink: `/gfw-portal/compliance/overViewDocument/${this.current_id}/overview`,
      },
      {
        name: this._TranslateService.instant('TABS.ATTACHMENTS'),
        icon: '',
      },
    ]);
  }
  // ======= Lifecycle =======
  ngOnInit(): void {
    this.geIdFromRouting();
  }

  ngOnDestroy(): void {
    // Unsubscribe all subscriptions
    this.subscriptions.unsubscribe();
  }
}
