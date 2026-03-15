import { EditAttachmentComponent } from './../../../../../../shared/shared-ui/src/lib/editAttachment/editAttachment.component';
import { ViewAttachementComponent } from './../../../../../../shared/shared-ui/src/lib/view-attachement/view-attachement.component';
import { AttachmentsUiComponent } from './../../../../../../shared/shared-ui/src/lib/attachments-ui/attachments-ui.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { switchMap } from 'rxjs';

// Shared Components & Services
import { NewAttachListComponent } from '@gfw/shared-ui';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { enviroment } from 'apps/gfw-portal/env/dev.env';

@Component({
  selector: 'lib-attachment-measurmnet',
  imports: [
    CommonModule,
    TranslateModule,
    InputTextModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    NewAttachListComponent,
    AttachmentsUiComponent,
    ViewAttachementComponent,
    EditAttachmentComponent,
  ],
  templateUrl: './attachmentMeasurmnet.component.html',
  styleUrl: './attachmentMeasurmnet.component.scss',
})
export class AttachmentMeasurmnetComponent implements OnInit {
  /** Declaration Variables*/
  env: string = enviroment.DOMAIN_URI;
  controlAssessmentID: any | null = null;
  attachments: any[] = [];
  show_add_dailog: boolean = false;
  displayModal: boolean = false;
  selected_file_show: any = null;
  edit_file_name: boolean = false;
  current_title_update: string = '';
  current_file_update: any = null;
  loadUpdate: boolean = false;
  loadingState: boolean = false;

  constructor(
    private _MessageService: MessageService,
    private _ActivatedRoute: ActivatedRoute,
    private _sharedService: SharedService,
    private _translateService:TranslateService
  ) {
  }

  // Fetch attachments on component init
  ngOnInit(): void {
     this.handleParams()
    this.getAttachments();
  }
        // Get controlAssessmentID from route params
  handleParams(){
    this._ActivatedRoute?.parent?.paramMap.subscribe((res) => {
      this.controlAssessmentID = res.get('id');
      if (this.controlAssessmentID) {
        this.getAttachments();
      }
    });
  }

  /** Fetch attachments related to the control assessment */
  getAttachments() {
    this.loadingState = true;
    if (this.controlAssessmentID) {
      this._sharedService
        .getNewAttachment(22, +this.controlAssessmentID, 22)
        .subscribe({
          next: (res: any) => {
            this.attachments = res?.data;
            this.loadingState = false;
          },
          error: () => {
            this.loadingState = false;
          },
        });
    }
  }

  /** Handler when a new attachment is added */
  handleAdded(event: any) {
    if (event) this.getAttachments();
    this.show_add_dailog = false;
  }

  /** Open "Add Attachment" dialog */
  handleShowAdd(event: boolean) {
    this.show_add_dailog = event;
  }

  /** Handle actions on a single attachment (Delete, Download, View, Edit) */
  handleActionSingleFile(event: any) {
    switch (event.action) {
      case 'Delete':
        this._sharedService.deleteAttachment(event.file.fileID).subscribe({
          next: () => {
            this._MessageService.add({
              severity: 'success',
              summary: 'Success',
              detail: this._translateService.instant('ATTACHMENT.DeletedSuccessfully'),
            });
            this.getAttachments();
          },
        });
        break;

      case 'Download':
        this._sharedService.downloadAttachment(event.file.fileID).subscribe({
          next: (res: any) => {
            const blob = new Blob([res], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${event.file.fileTitle}.${event.file.fileExtension}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          },
        });
        break;

      case 'Show':
        this._sharedService.getSingleAttachment(event.file.fileUsageID).subscribe({
          next: (res: any) => {
            this.selected_file_show = res?.data;
            this.displayModal = true;
          },
        });
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

  /** Update attachment title */
  handleUpdateTitle(newTitle: string) {
    if (!this.current_file_update) return;

    this.loadUpdate = true;
    this._sharedService
      .updateAttachment(this.current_file_update.fileUsageID, newTitle, 22)
      .subscribe({
        next: () => {
          this.loadUpdate = false;
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: this._translateService.instant('ATTACHMENT.UpdatedSuccessfully'),
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
  }

  /** Close the view attachment modal */
  handleHideView(event: boolean) {
    this.displayModal = event;
  }
}
