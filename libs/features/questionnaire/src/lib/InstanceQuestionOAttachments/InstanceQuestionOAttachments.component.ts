import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { Subscription, switchMap } from 'rxjs';
import { NewAttachListComponent } from '@gfw/shared-ui';
import { FormsModule } from '@angular/forms';
import { AttachmentsUiComponent } from 'libs/shared/shared-ui/src/lib/attachments-ui/attachments-ui.component';
import { EditAttachmentComponent } from 'libs/shared/shared-ui/src/lib/editAttachment/editAttachment.component';
import { ViewAttachementComponent } from 'libs/shared/shared-ui/src/lib/view-attachement/view-attachement.component';
@Component({
  selector: 'lib-instance-question-oattachments',
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
  templateUrl: './InstanceQuestionOAttachments.component.html',
  styleUrl: './InstanceQuestionOAttachments.component.scss',
})
export class InstanceQuestionOAttachmentsComponent
  implements OnInit, OnDestroy
{
  // Declaration Variables
  questionId: any;
  controlAssessmentID: any;
  files: any[] = [];
  show_add_dailog: boolean = false;
  displayModal: boolean = false;
  selected_file_show: any;
  edit_file_name: boolean = false;
  current_title_update: string = '';
  current_file_update: any;
  loadUpdate: boolean = false;
  loadingState: boolean = false;
  private subscription: Subscription = new Subscription();
  constructor(
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _MessageService: MessageService,
    private _ActivatedRoute: ActivatedRoute,
    private _sharedService: SharedService
  ) {}
  ngOnInit(): void {
    this.getId();
    this.getAttachments();
  }

  // handle Breadcrumb
  getId() {
    this._ActivatedRoute.parent?.paramMap.subscribe((res: any) => {
      this.questionId = res.get('questionId');
    });
  }
  // get Files
  getAttachments() {
    this.loadingState = true;
    if (this.questionId) {
      const sub = this._sharedService
        .getNewAttachment(110, +this.questionId, 110)
        .subscribe({
          next: (res: any) => {
            this.files = res?.data;
            this.loadingState = false;
          },
        });
      this.subscription.add(sub);
    } else {
      const sub = this._ActivatedRoute.parent?.paramMap
        .pipe(
          switchMap(() =>
            this._sharedService.getNewAttachment(110, +this.questionId, 110)
          )
        )
        .subscribe({
          next: (res: any) => {
            this.files = res?.data;
            this.loadingState = false;
          },
        });
      this.subscription.add(sub);
    }
  }
  // add file Method
  handleAdded(event: any) {
    if (event) {
      this.getAttachments();
    }
    this.show_add_dailog = false;
  }

  handleShowAdd(event: boolean) {
    this.show_add_dailog = event;
  }
  // handle Action
  handleActionSingleFile(event: any) {
    switch (event.action) {
      case 'Delete':
        const sub = this._sharedService
          .deleteAttachment(event.file.fileID)
          .subscribe({
            next: () => {
              this._MessageService.add({
                severity: 'success',
                summary: 'Success',
                detail: this._TranslateService.instant(
                  'ATTACHMENT.DeletedSuccessfully'
                ),
              });
              this.getAttachments();
            },
          });
        this.subscription.add(sub);
        break;

      case 'Download':
        const down = this._sharedService
          .downloadAttachment(event.file.fileID)
          .subscribe({
            next: (res: any) => {
              const blob = new Blob([res], {
                type: 'application/octet-stream',
              });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download =
                event.file.fileTitle + '.' + event.file.fileExtension;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            },
          });
        this.subscription.add(down);
        break;

      case 'Show':
        const show = this._sharedService
          .getSingleAttachment(event.file.fileUsageID)
          .subscribe({
            next: (res: any) => {
              this.selected_file_show = res?.data;
              this.displayModal = true;
            },
          });
        this.subscription.add(show);
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
  // handle Update File
  handleUpdateTitle(newTitle: string) {
    if (!this.current_file_update) return;

    this.loadUpdate = true;
    const sub = this._sharedService
      .updateAttachment(this.current_file_update.fileUsageID, newTitle, 110)
      .subscribe({
        next: () => {
          this.loadUpdate = false;
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: this._TranslateService.instant(
              'ATTACHMENT.UpdatedSuccessfully'
            ),
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
    this.subscription.add(sub);
  }
  // handle View Modal
  handleHideView(event: boolean) {
    this.displayModal = event;
  }

  //  OnDestroy
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
