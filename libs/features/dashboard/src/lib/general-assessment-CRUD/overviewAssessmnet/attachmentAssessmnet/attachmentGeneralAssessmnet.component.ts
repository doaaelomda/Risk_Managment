import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { NewAttachListComponent } from '@gfw/shared-ui';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { AttachmentsUiComponent } from 'libs/shared/shared-ui/src/lib/attachments-ui/attachments-ui.component';
import { ViewAttachementComponent } from 'libs/shared/shared-ui/src/lib/view-attachement/view-attachement.component';
import { EditAttachmentComponent } from 'libs/shared/shared-ui/src/lib/editAttachment/editAttachment.component';

@Component({
  selector: 'lib-attachment-general-assessmnet',
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
  templateUrl: './attachmentGeneralAssessmnet.component.html',
  styleUrl: './attachmentGeneralAssessmnet.component.scss',
})
export class AttachmentGeneralAssessmnetComponent implements OnInit {
  env: any;
  attachments: any[] = [];
  show_add_dailog: boolean = false;
  displayModal: boolean = false;
  selected_file_show: any;
  edit_file_name: boolean = false;
  current_title_update: string = '';
  current_file_update: any;
  loadUpdate: boolean = false;
  loadingState: boolean = false;
  dataEntityTypeId: number = 39;
  FEAT_ID!: number;
  fileGroupType: string = '39';

  constructor(
    private _MessageService: MessageService,
    private _sharedService: SharedService,
    private _activatedRoute: ActivatedRoute
  ) {
    const id = this._activatedRoute.snapshot.parent?.paramMap.get('AssId');
    if (!id) return;
    this.FEAT_ID = +id;
  }

  ngOnInit(): void {
    this.getAttachments();
  }

  getAttachments() {
    this.loadingState = true;
    this._sharedService
      .getNewAttachment(this.dataEntityTypeId, this.FEAT_ID,+this.fileGroupType)
      .subscribe({
        next: (res: any) => {
          this.attachments = res?.data;
          this.loadingState = false;
        },
      });
  }

  handleAdded(event: any) {
    if (event) {
      this.getAttachments();
    }
    this.show_add_dailog = false;
  }

  handleShowAdd(event: boolean) {
    this.show_add_dailog = event;
  }

  handleActionSingleFile(event: any) {
    switch (event.action) {
      case 'Delete':
        this._sharedService.deleteAttachment(event.file.fileID).subscribe({
          next: () => {
            this._MessageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Attachment Deleted Successfully',
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
            a.download = event.file.fileTitle + '.' + event.file.fileExtension;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          },
        });
        break;

      case 'Show':
        this._sharedService
          .getSingleAttachment(event.file.fileUsageID)
          .subscribe({
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

  handleUpdateTitle(newTitle: string) {
    if (!this.current_file_update) return;

    this.loadUpdate = true;
    this._sharedService
      .updateAttachment(this.current_file_update.fileUsageID, newTitle)
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
  }

  handleHideView(event: boolean) {
    this.displayModal = event;
  }
}
