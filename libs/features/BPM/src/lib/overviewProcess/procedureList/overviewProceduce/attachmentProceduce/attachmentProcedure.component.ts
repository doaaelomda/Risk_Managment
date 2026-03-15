
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import {  FormsModule } from '@angular/forms';
import { NewAttachListComponent } from '@gfw/shared-ui';
import { DialogModule } from 'primeng/dialog';

import { ButtonModule } from 'primeng/button';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { switchMap, tap } from 'rxjs';
import { ComplianceService } from 'libs/features/compliance/src/compliance/compliance.service';
import { EditAttachmentComponent } from 'libs/shared/shared-ui/src/lib/editAttachment/editAttachment.component';
import { AttachmentsUiComponent } from 'libs/shared/shared-ui/src/lib/attachments-ui/attachments-ui.component';
import { ViewAttachementComponent } from 'libs/shared/shared-ui/src/lib/view-attachement/view-attachement.component';
@Component({
  selector: 'lib-attachment-procedure',
          imports: [   TranslateModule,
    InputTextModule,
    ViewAttachementComponent,
    CommonModule,
    DialogModule,
    ButtonModule,
    NewAttachListComponent,
    AttachmentsUiComponent,
    FormsModule,
    EditAttachmentComponent,],
  templateUrl: './attachmentProcedure.component.html',
  styleUrl: './attachmentProcedure.component.scss',
})
export class AttachmentProcedureComponent implements OnInit {
  constructor(private _TranslateService :TranslateService,private _LayoutService: LayoutService,
     private _MessageService: MessageService, private _ActivatedRoute: ActivatedRoute,
     private _riskService: RiskService, private _sharedService: SharedService,private complianceService:ComplianceService) {
    this.env = enviroment.DOMAIN_URI
        this._ActivatedRoute.parent?.paramMap.subscribe((res: any) => {
      this.controlAssessmentID = res.get('procedureId');
      if(this.controlAssessmentID){
        this.getRisksAttachments()
        console.log(this.controlAssessmentID ,'this.controlAssessmentID from service');
      }

    })
  }



    env: any;
  controlAssessmentID: any;
  risks_attachments: any[] = [];
  show_add_dailog: boolean = false;
  displayModal: boolean = false;
  selected_file_show: any;
  edit_file_name: boolean = false;
  current_title_update: string = '';
  current_file_update: any;
  loadUpdate: boolean = false;
  loadingState: boolean = false;
  ngOnInit(): void {

    this.getRisksAttachments()

  }



  getRisksAttachments() {
    this.loadingState = true;
    if (this.controlAssessmentID) {
      this._sharedService
        .getNewAttachment(51, +this.controlAssessmentID,51)
        .subscribe({
          next: (res: any) => {
            this.risks_attachments = res?.data;
            this.loadingState = false;
          },
        });
    } else {
      this._ActivatedRoute.parent?.paramMap
        .pipe(
          switchMap(() =>
            this._sharedService.getNewAttachment(51, +this.controlAssessmentID,51)
          )
        )
        .subscribe({
          next: (res: any) => {
            this.risks_attachments = res?.data;
            this.loadingState = false;
          },
        });
    }
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
      .updateAttachment(this.current_file_update.fileUsageID, newTitle,51)
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
