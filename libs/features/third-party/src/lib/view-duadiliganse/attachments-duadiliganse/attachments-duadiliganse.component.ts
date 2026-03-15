import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { ComplianceService } from 'libs/features/compliance/src/compliance/compliance.service';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { switchMap } from 'rxjs';
import { NewAttachListComponent } from '@gfw/shared-ui';
import { AttachmentsUiComponent } from 'libs/shared/shared-ui/src/lib/attachments-ui/attachments-ui.component';
import { ViewAttachementComponent } from 'libs/shared/shared-ui/src/lib/view-attachement/view-attachement.component';
import { EditAttachmentComponent } from 'libs/shared/shared-ui/src/lib/editAttachment/editAttachment.component';

@Component({
  selector: 'lib-attachments-duadiliganse',
  imports: [
    CommonModule,
    NewAttachListComponent,
    AttachmentsUiComponent,
    ViewAttachementComponent,
    EditAttachmentComponent,
  ],
  templateUrl: './attachments-duadiliganse.component.html',
  styleUrl: './attachments-duadiliganse.component.scss',
})
export class AttachmentsDuadiliganseComponent {
  env: any;
  risks_attachments: any[] = [];
  show_add_dailog: boolean = false;
  displayModal: boolean = false;
  selected_file_show: any;
  edit_file_name: boolean = false;
  current_title_update: string = '';
  current_file_update: any;
  loadUpdate: boolean = false;
  loadingState: boolean = false;
  dataEntityTypeId:number = 78
  FEAT_ID!:number
  fileUsageTypeID:string = '78'

  constructor(
    private _MessageService: MessageService,
    private _sharedService: SharedService,
    private _activatedRoute:ActivatedRoute
  ) {
    this.env = enviroment.DOMAIN_URI;
  }



  ngOnInit(): void {
    const params:any = this._activatedRoute.parent?.snapshot.paramMap
    console.log(params,'params here');

    this.FEAT_ID = params?.params?.dueDiligenceId
    console.log(this.FEAT_ID,'this.FEAT_ID');

    this.getRisksAttachments();
  }

  getRisksAttachments() {
    this.loadingState = true;
    this._sharedService
      .getNewAttachment(this.dataEntityTypeId, this.FEAT_ID, +this.fileUsageTypeID)
      .subscribe({
        next: (res: any) => {
          this.risks_attachments = res?.data;
          this.loadingState = false;
        },
      });
  }

  handleAdded(event: any) {
    if (event) {
      this.getRisksAttachments();
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
            this.getRisksAttachments();
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
      .updateAttachment(this.current_file_update.fileUsageID, newTitle, +this.fileUsageTypeID)
      .subscribe({
        next: () => {
          this.loadUpdate = false;
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Attachment Updated Successfully',
          });
          this.edit_file_name = false;
          this.getRisksAttachments();
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
