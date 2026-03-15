import { GovDocumentsService } from './../../../../../covernance/src/service/covDocument.service';
import { GoveranceService } from './../../../../../covernance/src/service/goverance.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { AwarenessService } from '../../../services/awareness.service';
import { InputTextModule } from 'primeng/inputtext';
import { ViewAttachementComponent } from 'libs/shared/shared-ui/src/lib/view-attachement/view-attachement.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import {
  DeleteConfirmPopupComponent,
  NewAttachListComponent,
  SharedUiComponent,
} from '@gfw/shared-ui';
import { AttachmentsUiComponent } from 'libs/shared/shared-ui/src/lib/attachments-ui/attachments-ui.component';
import { FormsModule } from '@angular/forms';
import { EditAttachmentComponent } from 'libs/shared/shared-ui/src/lib/editAttachment/editAttachment.component';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { finalize, forkJoin, switchMap } from 'rxjs';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import * as moment from 'moment';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { ComplianceService } from 'libs/features/compliance/src/compliance/compliance.service';

@Component({
  selector: 'lib-compagine-context-file',
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
    SharedUiComponent,
    DeleteConfirmPopupComponent,
  ],
  templateUrl: './compagine-contextFile.component.html',
  styleUrl: './compagine-contextFile.component.scss',
})
export class CompagineContextFileComponent {
  compagnieId: any;
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
  awarenessContentType: any;
  constructor(
    private _AwarenessService: AwarenessService,
    private _MessageService: MessageService,
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _sharedService: SharedService,
    private _riskService: RiskService,
    private govDocumentService: GovDocumentsService
  ) {
    this._ActivatedRoute.parent?.paramMap.subscribe((res) => {
      this.compagnieId = res.get('id');
      if (this.compagnieId) {
        this._AwarenessService
          .getCampaignById(this.compagnieId)
          .subscribe((res: any) => {
            this.awarenessContentType = res?.data?.awarenessContentTypeID;
            console.log(this.awarenessContentType, 'awarenessContentType');
            this._LayoutService.breadCrumbLinks.next([
              { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
              {
                name: this._TranslateService.instant('AWARENESS.TITLE'),
                icon: '',
                routerLink: '/gfw-portal/awareness/campaign-list',
              },
              {
                name: res?.data.name,
                icon: '',
                routerLink: `/gfw-portal/awareness/compagine-setup/${this.compagnieId}/overview`,
              },
              {
                name: this._TranslateService.instant('ADUIANCE.CONNECTFILE'),
                icon: '',
              },
            ]);
            if (this.awarenessContentType == 2) {
              this.getRisksAttachments();
            } else {
              this.loadcolums();
            }
          });
      }
    });
    this.action_items = [
      // {
      //   label: this._TranslateService.instant('SETTING.VIEW_CONTROL'),
      //   icon: 'fi fi-rr-eye',
      //   command: () => {
      //     this._router.navigate([
      //       `/gfw-portal/governance/control-management/view/${this.current_row_selected}`,
      //     ]);
      //   },
      // },
      {
        label: this._TranslateService.instant('SETTING.DELETE_CONTROL'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.actionDeleteVisible = true;
        },
      },
      // {
      //   label: this._TranslateService.instant('SETTING.UPDATE_CONTROL'),
      //   icon: 'fi fi-rr-pencil',
      //   command: () => {
      //     this._router.navigate([
      //       `/gfw-portal/governance/control-management/action/${this.current_row_selected}`,
      //     ]);
      //   },
      // },
    ];
  }

  action_items: any[] = [];
  getRisksAttachments() {
    this.loadingState = true;
    if (this.compagnieId) {
      this._sharedService
        .getNewAttachment(74, +this.compagnieId, 74)
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
            this._sharedService.getNewAttachment(74, +this.compagnieId, 74)
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

  setSelectedRow(event?: any) {
    this.current_row_selected = event?.govDocumentID;
    console.log('role Selected', this.current_row_selected);
    console.log('event', event);
  }
  handleClosedDelete(event: any) {
    this.actionDeleteVisible = false;
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
      .updateAttachment(this.current_file_update.fileUsageID, newTitle, 1)
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

  //  table single select

  handleFilter(event: any[]) {
    const filters = event.map((filter: any) => {
      if (filter?.filter_type?.filterType == 'Date') {
        if (filter?.firstValue != 18 && filter?.firstValue != 19) {
          return {
            filterID: filter?.filter_type?.filterId,
            filterCode: filter?.filter_type?.fieldName,
            operatorId: filter?.operator?.DataEntityTypeOperatorID,
            operatorCode: filter?.operator?.OperatorCode,
            firstValue: null,
            secondValue: null,
            dateOptionID: String(filter?.firstValue),
          };
        } else {
          const secod = filter?.secondValue;

          return {
            filterID: filter?.filter_type?.filterId,
            filterCode: filter?.filter_type?.fieldName,
            operatorId: filter?.operator?.DataEntityTypeOperatorID,
            operatorCode: filter?.operator?.OperatorCode,
            firstValue: Array.isArray(secod)
              ? moment(new Date(secod[0])).format('MM-DD-YYYY')
              : moment(new Date(secod)).format('MM-DD-YYYY'),
            secondValue: Array.isArray(secod)
              ? moment(new Date(secod[1])).format('MM-DD-YYYY')
              : null,
            dateOptionID: String(filter?.firstValue),
          };
        }
      } else {
        return {
          filterID: filter?.filter_type?.filterId,
          filterCode: filter?.filter_type?.fieldName,
          operatorId: filter?.operator?.DataEntityTypeOperatorID,
          operatorCode: filter?.operator?.OperatorCode,
          firstValue: String(filter?.firstValue),
          secondValue: null,
          dateOptionID: null,
        };
      }
    });
    this.current_filters = filters;
    this.getCurrentData();
  }

  sort_data: any;
  dataList: any[] = [];
  currentProfiles: newProfile[] = [];
  defultProfile!: newProfile;
  current_filters: any[] = [];
  selected_profile_column: any;
  loadingTable: boolean = true;

  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  handleSort(event: any) {
    this.sort_data = event;
  }
  ShowConfirm: boolean = false;
  savingDocs: boolean = false;
  saveGovDocs() {
    if(!this.current_row_selected || !this.compagnieId)return
    this.savingDocs = true;
    const payload = { campaignId: this.compagnieId, govDocumentId: this.current_row_selected };
    this._AwarenessService
      .saveDocsContent(payload)
      .pipe(finalize(() => (this.savingDocs = false)))
      .subscribe({
        next: () => {
         this._MessageService.add({detail:'Content updated successfully.', severity:'success',summary:'Success'})
        },
      });
  }
  current_data_view: any;
  loading: any;
  data_sort: any;
  getCurrentData(event?: any) {
    this.loadingState = true;
    this.loading = true;
    this.dataList = [];
    this.govDocumentService
      .getDocumentsSearch(
        this.data_sort,
        event?.currentPage ?? 1,
        event?.perPage ?? 10,
        this.current_filters
      )
      .subscribe((res: any) => {
        this.dataList = res?.data?.items;
        this.pageginationObj = {
          perPage: res?.data?.pageSize,
          currentPage: res?.data?.pageNumber,
          totalItems: res?.data?.totalCount,
          totalPages: res?.data?.totalPages,
        };
        this.loadingState = false;
        this._sharedService.paginationSubject.next(this.pageginationObj);
        this.loading = false;
      });
  }

  profilesList: any;
  actionDeleteVisible: boolean = false;
  current_row_selected: any;
  loadDelted: boolean = false;
  loadcolums() {
    this.loadingState = true;
    forkJoin([this._riskService.getRisksProfile(86)]).subscribe(
      (res: any[]) => {
        this.profilesList = res[0]?.data?.userColumnProfiles.map(
          (profile: newProfile) => {
            return {
              ...profile,
              columns: profile.columns.map((col: any, i) => {
                return {
                  ...col,
                  displayName: res[0]?.data?.columnDefinitions?.find(
                    (colD: any) => colD?.id == col?.id
                  )?.label,
                  dataMap: res[0]?.data?.columnDefinitions?.find(
                    (colD: any) => colD?.id == col?.id
                  )?.dataMap,
                };
              }),
            };
          }
        );
        // this.dataList = res[1]?.data?.items;
        // this.pageginationObj = {
        //   perPage: res[1]?.data?.pageSize,
        //   currentPage: res[1]?.data?.pageNumber,
        //   totalItems: res[1]?.data?.totalCount,
        //   totalPages: res[1]?.data?.totalPages,
        // };
        this.defultProfile = {
          profileId: 0,
          profileName: 'Defult Profile',
          isDefult: false,
          columns: res[0]?.data?.columnDefinitions,
        };

        this._sharedService.paginationSubject.next(this.pageginationObj);
        this.loading = false;
      }
    );
  }

  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }
  deleteControls() {
    this.loadDelted = true;
    this._riskService
      .deleteControl(this.current_row_selected)
      .subscribe((res) => {
        this.loadDelted = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'Login Success',
          detail: 'Delete Controls Successful',
        });
        this.actionDeleteVisible = false;
        this.getCurrentData();
      });
  }
}
