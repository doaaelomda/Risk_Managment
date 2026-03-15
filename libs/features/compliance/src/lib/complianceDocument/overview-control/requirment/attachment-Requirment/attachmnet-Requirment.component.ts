import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormsModule,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { switchMap, tap } from 'rxjs';
import { ComplianceService } from 'libs/features/compliance/src/compliance/compliance.service';
import { ViewAttachementComponent } from 'libs/shared/shared-ui/src/lib/view-attachement/view-attachement.component';
import { NewAttachListComponent } from '@gfw/shared-ui';
import { AttachmentsUiComponent } from 'libs/shared/shared-ui/src/lib/attachments-ui/attachments-ui.component';
import { EditAttachmentComponent } from 'libs/shared/shared-ui/src/lib/editAttachment/editAttachment.component';
import { GoveranceService } from 'libs/features/covernance/src/service/goverance.service';
import { RequirmentDocumentService } from 'libs/features/compliance/src/services/requirment-document.service';
@Component({
  selector: 'lib-attachmnet-requirment',
  imports: [    TranslateModule,
    InputTextModule,
    ViewAttachementComponent,
    CommonModule,
    DialogModule,
    ButtonModule,
    NewAttachListComponent,
    AttachmentsUiComponent,
    FormsModule,
    EditAttachmentComponent,],
  templateUrl: './attachmnet-Requirment.component.html',
  styleUrl: './attachmnet-Requirment.component.scss',
})
export class AttachmnetRequirmentComponent implements OnInit {
  dataAwareness: any;
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
  controlRequirementData: any;
  controlId:any
  govControlID:any
  constructor(
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _MessageService: MessageService,
    private _ActivatedRoute: ActivatedRoute,
    private RequirmentDocumentService: RequirmentDocumentService,
    private _sharedService: SharedService,
    private complianceService: ComplianceService,
    private _GovernanceService: GoveranceService
  ) {
    this.env = enviroment.DOMAIN_URI;
        this.id = +this._ActivatedRoute.parent?.snapshot.paramMap.get('id')!;
    this.controlId =
      +this._ActivatedRoute.parent?.snapshot.paramMap.get('controlId')!;
       this.govControlID =
      +this._ActivatedRoute.parent?.snapshot.paramMap.get('govControlID')!;
    if (this.id) {
      this.getData();
      this.handleBreadCrumb()
    }
  }
  Data:any
  id:any
  getData() {
    this.RequirmentDocumentService.getRequirementControlsById(
      this.id
    ).subscribe((res) => {
      this.Data = res?.data;
    });
  }
  handleBreadCrumb() {
    if (this.controlId) {
      this.getData();
      this.complianceService
        .getDocumentCompliance(this.controlId)
        .subscribe((res: any) => {
          if (res?.data) {
            this._LayoutService.breadCrumbLinks.next([
              {
                name: this._TranslateService.instant(
                  'BREAD_CRUMB_TITLES.COMPLIANCE_GOVERNANCE'
                ),
                icon: '',
                routerLink: `/gfw-portal/compliance/complianceDocuments`,
              },
              {
                name: this._TranslateService.instant(
                  'BREAD_CRUMB_TITLES.DOCUMENTS'
                ),
                icon: '',
                routerLink: `/gfw-portal/compliance/complianceDocuments`,
              },
              {
                name: res?.data?.name ? res?.data?.name : '-',
                icon: '',
                routerLink: `/gfw-portal/compliance/overViewDocument/${this.controlId}/overview`,
              },
              {
                name: this._TranslateService.instant(
                  'BREAD_CRUMB_TITLES.CONTROL_REQUIREMENTS'
                ),
                icon: '',
                routerLink: `/gfw-portal/compliance/overViewDocument/${this.controlId}/content/${this.govControlID}/RequirementControl`,
              },
              {
                name: this.Data?.requirementText ? this.Data?.requirementText : '-',
                routerLink: `/gfw-portal/compliance/overViewDocument/${this.controlId}/content/${this.govControlID}/RequirementControl/${this.id}`,
              },
              {
                name:this._TranslateService.instant(
                  'TABS.ATTACHMENTS'
                ),
              }
            ]);
          }
        });
    }
  }
  handleHideView(event: boolean) {
    this.displayModal = event;
  }
  ngOnInit(): void {
    this.getRisksAttachments();
  }

  getRisksAttachments() {
    this.loadingState = true;
    if (this.id) {
      this._sharedService
        .getNewAttachment(96, +this.id, 95)
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
            this._sharedService.getNewAttachment(
              96,
              +this.id,
              95
            )
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
      .updateAttachment(this.current_file_update.fileUsageID, newTitle, 95)
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
}
