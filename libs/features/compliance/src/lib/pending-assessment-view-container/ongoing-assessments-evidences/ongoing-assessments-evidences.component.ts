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
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { LinkEvidenceTableComponent } from './link-evidence-table/link-evidence-table.component';
import { ViewAttachmentSingleModalComponent } from '../../evidenceComplianceCrud/evidenceComplianceOverView/evidence-VersionCRUD/view-attachment-single-modal/view-attachment-single-modal.component';
import { LinkVersionTableComponent } from "./link-version-table/link-version-table.component";
@Component({
  selector: 'lib-ongoing-assessments-evidences',
  imports: [
    CommonModule,
    EmptyStateComponent,
    TranslateModule,
    DialogModule,
    Button,
    SkeletonModule,
    AccordionModule,
    SharedOverviewComponent,
    DatePackerComponent,
    InputNumberComponent,
    ReactiveFormsModule,
    LinkEvidenceTableComponent,
    ViewAttachmentSingleModalComponent,
    SharedFileViewerComponent,
    LinkVersionTableComponent
],
  templateUrl: './ongoing-assessments-evidences.component.html',
  styleUrl: './ongoing-assessments-evidences.component.scss',
})
export class OngoingAssessmentsEvidencesComponent {
  constructor(
    private evidenceService: ComplianceEvidanceService,
    public _PermissionSystemService: PermissionSystemService,
    private messageService: MessageService,
    private router: Router,
    private complianceAssessmentService: ComplianceAssessmntService,
    private translateService: TranslateService,
    private sharedService: SharedService
  ) {

    this.initializeForm();
  }
  statuses: any[] = [];
  ngOnInit() {
    this.getLinkedEvidences();
  }
  assessmentItemResultID = input<number>();
  mode = input<string>();

  evidence_types_current_payload: any;
  handleEvidenceTypesData(payload: any) {
    this.evidence_types_current_payload = payload;
  }
  selected_types: any[] = [];
  handleEvidenceTypeSelection(selections: any) {
    this.selected_types = selections;
    console.log(selections, 'selected types here...');
  }

  loadingEvidencesTypes: boolean = true;
  evidencesTypes: any[] = [];
  paginationObj: any;
  getEvidencesTypes(payload: any) {
    this.loadingEvidencesTypes = true;
    this.evidencesTypes = [];
    this.evidenceService
      .getEvidencesTypes({
        ...payload,
      })
      .pipe(finalize(() => (this.loadingEvidencesTypes = false)))
      .subscribe({
        next: (res: any) => {
          this.evidencesTypes = res.data.items ?? [];
          this.paginationObj = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this.sharedService.paginationSubject.next(this.paginationObj);
          console.log(res, 'got evidences types');
        },
      });
  }
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

  isLinkingVersion: boolean = false;

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

  evidenceVersionForm!: FormGroup;
  selectedFiles: any[] = [];
  idResult: any;
  initializeForm(data?: any) {
    this.evidenceVersionForm = new FormGroup({
      versionNumber: new FormControl(data?.versionNumber, Validators.required),
      expiryDate: new FormControl(
        data?.expiryDate ? moment(data.expiryDate).format('MM-DD-YYYY') : null
      ),
    });
  }

  loadingSaveNewVersion: boolean = false;
  isAddingNewVersion: boolean = false;
  submit() {
    if (this.evidenceVersionForm.invalid) {
      this.evidenceVersionForm.markAllAsTouched();
      return;
    }

    const formValue = { ...this.evidenceVersionForm.value };

    const payload: any = {
      ...formValue,
      evidenceTypeID: +this.evidenceId,
      expiryDate: formValue.expiryDate
        ? moment(formValue.expiryDate, 'MM-DD-YYYY').utc(true).toISOString()
        : null,
    };

    this.loadingSaveNewVersion = true;
    this.complianceAssessmentService
      .addEvidenceVersion(payload)
      .subscribe((res: any) => {
        if (res.idResult) {
          this.idResult = res.idResult;
          if (this.selectedFiles.length > 0) {
            this.sendAttachment();
            this.current_selected_evidance_version_id = res.idResult;
            this.linkEvidanceVersion()
          } else {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: this.translateService.instant(
                'EVIDENCE_VERSION.ADD_SUCCESS'
              ),
            });
            this.isAddingNewVersion = false;
          }
        }
      });
  }
  handleFileSelected(file: any) {
    this.selectedFiles.push(file);
  }
  sendAttachment() {
    const selected = this.selectedFiles[0];
    const formData = new FormData();

    formData.append('File', selected.File);
    formData.append('FileTitle', selected.FileTitle);
    formData.append('DataClassificationID', selected.DataClassificationID);
    // formData.append('FileTypeID', selected.FileTypeID);
    formData.append(
      'IsVisibleInSearch',
      selected.IsVisibleInSearch ? 'true' : 'false'
    );
     if (selected.add_type === 'file') {

       formData.append('FileOrLink', 'true');
     }else{
      formData.append('FileOrLink', 'true');
     }
    formData.append('DataEnityTypeID', '64');
    formData.append('DataEnityID', this.idResult);
    formData.append('fileUsageTypeID', '64');

    const attachSub = this.sharedService
      .saveAttachment(formData)
      .subscribe((res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.translateService.instant('ATTACHMENT.AddedSuccessfully'),
        });
        this.isAddingNewVersion = false;
      });
  }

  onShowEvidenceTableDialog(event: any) {
    if (!event) return;
    this.getEvidencesTypes(this.evidence_types_current_payload);
    this.getSelectedEvidenceTypes();
  }

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

    linkEvidanceVersion() {
    const payload = {
      id: this.assessmentItemResultID(),
      linkedIds: [this.current_selected_evidance_version_id],
      evidenceTypeID: this.evidenceId,
    };
    this.evidenceService.linkEvidanceVersion(payload).pipe(finalize(()=> this.loadingSaveNewVersion = false)).subscribe({
      next: (res: any) => {
         this.onLinkEvidenceVersions();
      },
      error: (err: any) => {
        this.savingVersionLinked = false;
      },
    });
  }



  deleteLinkedEvidanceType(EvidanceTypeId:any){
    this.evidenceService.deleteLinkedEvidanceType(this.assessmentItemResultID() , EvidanceTypeId).subscribe((res:any)=>{
      this.messageService.add({
        severity:'success' ,
        summary:'Success' ,
        detail:'Evidance Type Deleted Successfully !'
      })

      this.getLinkedEvidences()
    })
  }



  deletelinkedversion(){
    this.evidenceService.deleteLinkedVersion(this.assessmentItemResultID() , this.evidenceId , this.current_selected_evidance_version_id).subscribe((res)=>{
            this.messageService.add({
        severity:'success' ,
        summary:'Success' ,
        detail:'Evidance Version Deleted Successfully !'
      })

      this.getLinkedEvidancesVersions()
    })
  }
}
