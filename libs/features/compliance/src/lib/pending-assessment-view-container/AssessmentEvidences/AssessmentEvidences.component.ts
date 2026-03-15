import { SharedFileViewerComponent } from './../../../../../../shared/shared-ui/src/lib/shared-file-viewer/shared-file-viewer.component';
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  EmptyStateComponent,
  DeleteConfirmPopupComponent,
  DatePackerComponent,
} from '@gfw/shared-ui';
import { ComplianceEvidanceService } from '../../../services/compliance-evidance.service';
import { finalize, of, switchMap } from 'rxjs';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { Router, RouterLink } from '@angular/router';
import { ComplianceAssessmntService } from '../../../services/compliance-assessmnt.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { Button } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { AccordionModule } from 'primeng/accordion';
import {
  OverviewEntry,
  SharedOverviewComponent,
} from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';


@Component({
  selector: 'lib-assessment-evidences',
  imports: [    CommonModule,
    EmptyStateComponent,
    TranslateModule,
    DialogModule,
    SkeletonModule,
    AccordionModule,
    SharedOverviewComponent,
    SharedFileViewerComponent,
    ],
  templateUrl: './AssessmentEvidences.component.html',
  styleUrl: './AssessmentEvidences.component.scss',
})
export class AssessmentEvidencesComponent {
  constructor(
    private evidenceService: ComplianceEvidanceService,
    public _PermissionSystemService: PermissionSystemService,
    private messageService: MessageService,
    private router: Router,
    private complianceAssessmentService: ComplianceAssessmntService,
    private translateService: TranslateService,
    private sharedService: SharedService
  ) {

  }
  statuses: any[] = [];
  ngOnInit() {
    this.getLinkedEvidences();
  }
  assessmentItemResultID = input<number>(3350);


  linkedEvidences: any[] = [];
  loadingLinkedEvidences: boolean = true;

  linked_evidancesIDS: any[] = [];
  activeEvidenceIndex!: number;
  getLinkedEvidences() {
    this.loadingLinkedEvidences = true;
    this.evidenceService
      .getLinkedEvidences(this.assessmentItemResultID())
      .pipe(finalize(() => (this.loadingLinkedEvidences = false)))
      .subscribe({
        next: (res: any) => {
          console.log(res, 'got linked evidences');
          this.linked_evidancesIDS = res?.data?.map((item: any) => item?.id);
          this.linkedEvidences = res?.data ?? [];

          if (this.evidenceId) {
            this.setActiveEvidence(this.evidenceId);
          } else {
            this.setLastIndexAsActive();
          }
        },
      });
  }

  setLastIndexAsActive() {
    const lastEvidenceIndex =
      this.linkedEvidences?.length > 0 ? this.linkedEvidences?.length - 1 : 0;
    this.activeEvidenceIndex = lastEvidenceIndex;
  }

  setActiveEvidence(evidenceId: number) {
    if (!evidenceId) return;
    this.evidenceId = evidenceId;
    this.activeEvidenceIndex = this.linkedEvidences.findIndex(
      (val: any) => val.id === evidenceId
    );
    console.log(this.activeEvidenceIndex, 'this.activeEvidenceIndex');

    // this.getVersionsData(this.current_versions_payload);
    this.getLinkedEvidancesVersions();
  }
  isLinkingEvidence: boolean = false;

  getSelectedEvidenceTypes() {
    console.log('getting selected evidence types...');
  }

  evidenceId: any;

  showViewModal = false;
  singleTaskData: any;

  selectedAccordionChange(event: any, evidenceId: number) {
    console.log(event);
    if (!event) return;
    this.setActiveEvidence(evidenceId);
  }

  // table VersionsFor links


  current_selected_evidance_version_id: any = null;

  current_selected_evidance_version_data: any = null;
  handleSelectedEvidanceVersion(event: any) {
    console.log('selected version id ', event);
    this.current_selected_evidance_version_id = event;
  }

  savingVersionLinked: boolean = false;

  onLinkEvidenceVersions() {
    this.getLinkedEvidancesVersions();
  }
  viewEntries: OverviewEntry[] = [
    {
      key: 'evidenceTypeVersionStatusTypeName',
      label: 'MODAL_VIEW.STATUS',
      colorKey: 'evidenceTypeVersionStatusTypeColor',
      type: 'badge',
    },
    {
      key: 'versionNumber',
      label: 'EVIDENCE_VERSION.VERSION_NUMBER',
      type: 'text',
    },
    {
      key: 'expiryDate',
      label: 'EVIDENCE_VERSION.EXPIRY_DATE',
      type: 'date',
    },
  ];
  loadingSelectedVersionData: boolean = true;
  getLinkedEvidancesVersions() {
    this.loadingSelectedVersionData = true;

    this.evidenceService
      .getLinkedEvidencesVersions(this.assessmentItemResultID(),+this.evidenceId)
      .pipe(
        switchMap((res: any) => {
          const versions = res?.data ?? [];

          if (versions.length > 0) {
            this.current_selected_evidance_version_id = versions[0];

            return this.evidenceService.getEvidanceVersionData(
              this.current_selected_evidance_version_id
            );
          }

          this.current_selected_evidance_version_id = 0;
          return of([]);
        }),
        finalize(() => {
          this.loadingSelectedVersionData = false;

        })
      )
      .subscribe({
        next:(result) => {
        this.current_selected_evidance_version_data = result?.data ?? null;
        this.getCurrentEvidanceVersionDataFile(
          this.current_selected_evidance_version_id
        );
      },
      error: (err) => {
        this.current_selected_evidance_version_data = null;
      }
      });
  }

  getCurrentEvidanceVersionData(id: any) {
    this.loadingSelectedVersionData = true;
    this.evidenceService
      .getEvidanceVersionData(id)
      .pipe(finalize(() => (this.loadingSelectedVersionData = false)))
      .subscribe((res: any) => {
        this.current_selected_evidance_version_data = res?.data;
      });
  }

  idResult: any;






  onSaveEvidenceLink(event: any) {
    if (!event) return;
    this.getLinkedEvidences();
  }

  onEvidenceTableHide(event: any) {
    this.isLinkingEvidence = event;
  }

  current_selected_evidance_version_data_file: any;

  getCurrentEvidanceVersionDataFile(id: any) {
    this.sharedService.getNewAttachment(64, id, 64).subscribe((res: any) => {
      this.current_selected_evidance_version_data_file = res?.data[0];
    });
  }
}
