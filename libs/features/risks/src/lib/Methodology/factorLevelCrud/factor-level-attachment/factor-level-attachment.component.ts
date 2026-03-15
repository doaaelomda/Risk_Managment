import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { Subscription, switchMap, tap } from 'rxjs';
import { ComplianceService } from 'libs/features/compliance/src/compliance/compliance.service';
import { ViewAttachementComponent } from 'libs/shared/shared-ui/src/lib/view-attachement/view-attachement.component';
import { NewAttachListComponent } from '@gfw/shared-ui';
import { AttachmentsUiComponent } from 'libs/shared/shared-ui/src/lib/attachments-ui/attachments-ui.component';
import { EditAttachmentComponent } from 'libs/shared/shared-ui/src/lib/editAttachment/editAttachment.component';
import { RequirmentDocumentService } from 'libs/features/compliance/src/services/requirment-document.service';
import { FactorsService } from 'libs/features/risks/src/services/factor-level.service';
import { MothodologyService } from 'libs/features/risks/src/services/methodology.service';
@Component({
  selector: 'lib-factor-level-attachment',
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
  templateUrl: './factor-level-attachment.component.html',
  styleUrl: './factor-level-attachment.component.scss',
})
export class FactorLevelAttachmentComponent implements OnInit, OnDestroy {
  // Declaration Variables
  env: any;
  id: any;
  methodolgyId: any;
  files: any[] = [];
  show_add_dailog: boolean = false;
  displayModal: boolean = false;
  selected_file_show: any;
  edit_file_name: boolean = false;
  current_title_update: string = '';
  current_file_update: any;
  loadUpdate: boolean = false;
  loadingState: boolean = false;
  Data: any;
  private subscription: Subscription = new Subscription();
  factorLevelId: any;
  constructor(
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _MessageService: MessageService,
    private _ActivatedRoute: ActivatedRoute,
    private _sharedService: SharedService,
    private __FactorService: FactorsService,
    private _methodologyS: MothodologyService
  ) {}

  handleBreadCrumb() {
    this._ActivatedRoute?.parent?.paramMap.subscribe((res: any) => {
      this.id = res.get('id');
      this.factorLevelId = res.get('factorLevelId');
      this.methodolgyId = res.get('methodolgyId');
      if (this.id) {
        const sub = this.__FactorService
          .getById(this.id)
          .subscribe((res: any) => {
            this.Data = res?.data;
            this.getDataMethodology();
          });
        this.subscription.add(sub);
      }
    });
  }

  // get Data Methodology

  getDataMethodology() {
    this._methodologyS.getById(this.methodolgyId).subscribe((res: any) => {
      this._LayoutService.breadCrumbLinks.next([
        {
          name: '',
          icon: 'fi fi-rs-home',
          routerLink: '/',
        },
        {
          name: this._TranslateService.instant(
            'BREAD_CRUMB_TITLES.METHODOLOGY'
          ),
          icon: '',
          routerLink: '/gfw-portal/risks-management/methodolgy/list',
        },
        {
          name: this._TranslateService.instant('METHODOLOGY.METHODOLOGYS_LIST'),
          icon: '',
          routerLink: '/gfw-portal/risks-management/methodolgy/list',
        },
        {
          name: res?.data?.name || '-',
          routerLink: `/gfw-portal/risks-management/methodolgy/${this.methodolgyId}/overview`,
        },

        {
          name: this._TranslateService.instant('FACTOR_LEVEL.TABLE_TITLE'),
          routerLink: `/gfw-portal/risks-management/methodolgy/${this.methodolgyId}/factors/${this.id}/factorsLevel`,
        },

        {
          name: this.Data?.name || '-',
          icon: '',
          routerLink: `/gfw-portal/risks-management/methodolgy/${this.methodolgyId}/factors/${this.id}/factorsLevel/${this,this.factorLevelId}`,
        },
        {
          name: this._TranslateService.instant('TABS.ATTACHMENTS'),
          icon: '',
        },
      ]);
    });
  }
  handleHideView(event: boolean) {
    this.displayModal = event;
  }
  getFiles() {
    this.loadingState = true;
    if (this.id) {
      this.subscription = this._sharedService
        .getNewAttachment(103, +this.factorLevelId, 100)
        .subscribe({
          next: (res: any) => {
            this.files = res?.data;
            this.loadingState = false;
          },
        });
    } else {
      this._ActivatedRoute.parent?.paramMap
        .pipe(
          switchMap(() =>
            this._sharedService.getNewAttachment(103, +this.factorLevelId, 100)
          )
        )
        .subscribe({
          next: (res: any) => {
            this.files = res?.data;
            this.loadingState = false;
          },
        });
    }
  }

  handleAdded(event: any) {
    if (event) {
      this.getFiles();
    }
    this.show_add_dailog = false;
  }

  handleShowAdd(event: boolean) {
    this.show_add_dailog = event;
  }

  handleActionSingleFile(event: any) {
    switch (event.action) {
      case 'Delete':
        this.subscription = this._sharedService
          .deleteAttachment(event.file.fileID)
          .subscribe({
            next: () => {
              this._MessageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Attachment Deleted Successfully',
              });
              this.getFiles();
            },
          });
        break;

      case 'Download':
        this.subscription = this._sharedService
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
        break;

      case 'Show':
        this.subscription = this._sharedService
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
    this.subscription = this._sharedService
      .updateAttachment(this.current_file_update.fileUsageID, newTitle, 100)
      .subscribe({
        next: () => {
          this.loadUpdate = false;
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Attachment Updated Successfully',
          });
          this.edit_file_name = false;
          this.getFiles();
          this.current_file_update = null;
          this.current_title_update = '';
        },
        error: () => {
          this.loadUpdate = false;
        },
      });
  }

  ngOnInit(): void {
    this.handleBreadCrumb();
    this.getFiles();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
