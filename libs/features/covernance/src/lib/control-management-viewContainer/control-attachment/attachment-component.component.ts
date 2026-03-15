import { EditAttachmentComponent } from './../../../../../../shared/shared-ui/src/lib/editAttachment/editAttachment.component';
import { AttachmentsUiComponent } from './../../../../../../shared/shared-ui/src/lib/attachments-ui/attachments-ui.component';
import { switchMap, tap } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { ViewAttachementComponent } from 'libs/shared/shared-ui/src/lib/view-attachement/view-attachement.component';
import { NewAttachListComponent } from '@gfw/shared-ui';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'lib-attachment-component',
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
  templateUrl: './attachment-component.component.html',
  styleUrl: './attachment-component.component.scss',
})
export class AttachmentComponentComponent implements OnInit {
  constructor(
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _MessageService: MessageService,
    private _ActivatedRoute: ActivatedRoute,
    private _service: RiskService,
    private _sharedService: SharedService
  ) {
    this.env = enviroment.DOMAIN_URI;
  }

  env: any;
  cusrrentId: any;
  array_attachments: any[] = [];
  show_add_dailog: boolean = false;
  displayModal: boolean = false;
  selected_file_show: any;
  edit_file_name: boolean = false;
  current_title_update: string = '';
  current_file_update: any;
  loadUpdate: boolean = false;
  loadingState: boolean = false;
  ngOnInit(): void {

    this._ActivatedRoute.parent?.paramMap.subscribe((params) => {
      this.cusrrentId = params.get('id');
      if (this.cusrrentId) {
        this.getAttachments();
      }
    });
  }

  Title: string = '';
  getAttachments() {
    this.loadingState = true;
    if (this.cusrrentId) {
      this._sharedService.getNewAttachment(10, +this.cusrrentId, 10).subscribe({
        next: (res: any) => {
          console.log('resAttachement', res);

          this.array_attachments = res?.data;
          this.loadingState = false;
          this._ActivatedRoute.parent?.paramMap
            .pipe(
              switchMap((params) => {
                return this._service.getOneRisk(this.cusrrentId);
              })
            )
            .subscribe((res) => {
              this.Title = res.data?.riskTitle;

              this._LayoutService.breadCrumbLinks.next([
                {
                  name: '',
                  icon: 'fi fi-rs-home',
                  routerLink: '/',
                },
                {
                  name: this._TranslateService.instant(
                    'BREAD_CRUMB_TITLES.Governance'
                  ),
                  icon: '',
                  routerLink: '/gfw-portal/governance/control-management/list',
                },
                {
                  name: this._TranslateService.instant(
                    'BREAD_CRUMB_TITLES.Control_Management'
                  ),
                  icon: '',
                  routerLink: '/gfw-portal/governance/control-management/list',
                },
                {
                  name: this._TranslateService.instant('TABS.ATTACHMENTS'),
                  icon: '',
                },
              ]);
              this._LayoutService.breadCrumbAction.next(null);
            });
        },
        error: (err: any) => {},
      });
    } else {
      this._ActivatedRoute.parent?.paramMap
        .pipe(
          switchMap(() =>
            this._sharedService.getNewAttachment(10, +this.cusrrentId, 10)
          )
        )
        .subscribe({
          next: (res: any) => {
            this.array_attachments = res?.data;
            this.loadingState = false;
          },
        });
    }
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
      .updateAttachment(this.current_file_update.fileUsageID, newTitle, 10)
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
