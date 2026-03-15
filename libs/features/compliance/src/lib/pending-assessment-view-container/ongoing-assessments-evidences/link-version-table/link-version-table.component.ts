import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { ComplianceEvidanceService } from 'libs/features/compliance/src/services/compliance-evidance.service';
import { MessageService } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ComplianceAssessmntService } from 'libs/features/compliance/src/services/compliance-assessmnt.service';
import { Button } from 'primeng/button';
import { finalize } from 'rxjs';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';

@Component({
  selector: 'lib-link-version-table',
  imports: [
    CommonModule,
    DialogModule,
    NewTableComponent,
    Button,
    TranslateModule,
  ],
  templateUrl: './link-version-table.component.html',
  styleUrl: './link-version-table.component.scss',
})
export class LinkVersionTableComponent {
  constructor(
    private evidenceService: ComplianceEvidanceService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private complianceAssessmentService: ComplianceAssessmntService,
    private sharedService: SharedService,
  ) {}
  @Input({ required: true }) isLinkingVersion: boolean = false;
  @Input({ required: true }) assessmentItemResultID: any;
  @Input({ required: true }) evidenceId!: number;
  @Input({ required: true }) current_selected_evidance_version_data: any;
  @Output() linkVersionEmitter = new EventEmitter();
  @Output() hideDialogEmitter = new EventEmitter();
  @Output() currentEvidenceVersionIdEmitter = new EventEmitter();

  // Set selected row from table
  setSelectedVersionRow(event: any) {
    this.current_version_row_selected = event;
  }

  // Handle data table refresh
  handleVersionsDataTable(payload: any = null) {
    this.current_versions_payload = payload;
    this.getVersionsData(payload);
  }

  // Get data table from API
  getVersionsData(payload: any) {
    // if (!this.evidenceId || !payload) return;
    this.versionsData = [];
    this.loadingVersionsTable = true;
    this.complianceAssessmentService
      .getEvidenceVersionSearch(payload, +this.evidenceId)
      .pipe(finalize(() => (this.loadingVersionsTable = false)))
      .subscribe({
        next: (res: any) => {
          this.versionsData = res?.data?.items;
          this.paginationObj = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this.sharedService.paginationSubject.next(this.paginationObj);
          this.linkVersionEmitter.emit(true);
        },
      });
  }

  loadingVersionsTable = true;
  versionsData: any[] = [];
  paginationObj = { perPage: 10, currentPage: 1, totalItems: 0, totalPages: 1 };
  current_filters: any[] = [];
  sort_data: any;

  current_version_row_selected: any;
  actionDeleteVisible = false;
  loadDeleted = false;
  current_versions_payload: any;
  items: any[] = [];
  columnControl: any = { type: 'popup', data: '' };
  current_selected_evidance_version_id: any = null;

  
  handleSelectedEvidanceVersion(event: any) {
    console.log('selected version id ', event);
    this.current_selected_evidance_version_id = event;
    this.currentEvidenceVersionIdEmitter.emit(event)
  }

  handleDataTableVersions(payload: any) {
    //

    console.log('payload', payload);

    this.getVersionsData(payload);
  }
  savingVersionLinked: boolean = false;

  linkEvidanceVersion() {
    this.savingVersionLinked = true;
    const payload = {
      id: this.assessmentItemResultID,
      linkedIds: [this.current_selected_evidance_version_id],
      evidenceTypeID: this.evidenceId,
    };
    this.evidenceService.linkEvidanceVersion(payload).subscribe({
      next: (res: any) => {
        this.savingVersionLinked = false;
        this.isLinkingVersion = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.translateService.instant(
            'Evidence Version Linked Successfully.'
          ),
        });
        this.linkVersionEmitter.emit(true);
      },
      error: (err: any) => {
        this.savingVersionLinked = false;
      },
    });
  }
}
