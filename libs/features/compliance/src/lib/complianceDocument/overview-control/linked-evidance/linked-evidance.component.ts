import { ComplianceAssessmntService } from 'libs/features/compliance/src/services/compliance-assessmnt.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { finalize, switchMap, take } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { ComplianceEvidanceService } from 'libs/features/compliance/src/services/compliance-evidance.service';


@Component({
  selector: 'lib-linked-evidance',
  imports: [
    CommonModule,
    TranslateModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    SkeletonModule,
    DialogModule,
    ReactiveFormsModule,
    NewTableComponent,
  ],
  templateUrl: './linked-evidance.component.html',
  styleUrl: './linked-evidance.component.scss',
})
export class LinkedEvidanceComponent implements OnInit {
  //  Initialize properties
  actionDeleteVisible: boolean = false;
  isLoaderDeleting: boolean = false;
  isLoading: boolean = true;
  addModal: boolean = false;
  viewModal: boolean = false;
  loadingSaveEvidance: boolean = false;
  govControlID: string = '';
  selectComplianceEvidence: string = '';
  action_items: any;
  complianceEvidenceList: any[] = [];
  Data: any;
  complianceID: any;
  dataAssessment: any;
  current_compliance_evidence_payload: any;
  evidenceComplianceList: any[] = [];
  loadinEvidanceTable: boolean = true;
  current_evidence_compliance_payload: any;
  selected_compliance_evidence: any[] = [];
  paginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  columnControl: any = {
    type: 'popup',
    data: null,
  };
  // Constructor
  constructor(
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _MessageService: MessageService,
    private _SharedService: SharedService,
    private _router: Router,
    private _ActiveRouter: ActivatedRoute,
    public _PermissionSystemService:PermissionSystemService,
    private _ComplianceEvidanceService: ComplianceEvidanceService,
    private _ComplianceService: ComplianceAssessmntService
  ) {}
  // Lifecycle hooks
  ngOnInit() {
    this.currentComplianceDocumentElementID = this._ActiveRouter.parent?.snapshot.paramMap.get('id');
    this.handleActionItems();
  }


  currentComplianceDocumentElementID:any;

  // method to handle close delete popup
  handleClosedDelete() {
    this.actionDeleteVisible = false;
  }
  // method to delete compliance evidence
  deleteComplianceEvidence() {
        const canDelete = this._PermissionSystemService.can('COMPLIANCE' , 'ASSSESSMENT_CONTROLS' , 'DELETE')
    if(!canDelete) return;

    this.isLoading = true;
    this.isLoaderDeleting = true;
    // Implementation for deleting compliance evidence
    // this._ComplianceService
    //   .deleteEvidenceControl(this.selectComplianceEvidence)
    //   .subscribe({
    //     next: () => {
    //       this.isLoaderDeleting = false;
    //       this.actionDeleteVisible = false;
    //       this._MessageService.add({
    //         severity: 'success',
    //         summary: 'Success',
    //         detail: this._TranslateService.instant('SETTING.DELETE_SUCCESS'),
    //       });
    //       this.isLoading = false;
    //       this.handleComplianceEvidenceTable(this.current_compliance_evidence_payload);
    //     },
    //     error: () => {
    //       this.isLoaderDeleting = false;
    //       this.isLoading = false;
    //     },
    //   });
  }
  // method to set selected row
  setSelectedComplianceEvidence(event: any) {
    console.log("setSelectedComplianceEvidence", event);

    this.selectComplianceEvidence = event;
  }
  // method to open add control modal
  quickAdd() {
    this.addModal = true;
  }
  // method to handle modal close
  onModalClose() {
    this.getComplianceLinkedEvidenceTable(this.current_compliance_evidence_payload);
    // this.getSelectedComplianceEvidenceIDS()
  }
  // method to open view compliance evidence modal
  viewComplianceEvidenceInModal() {
    this.viewModal = true;
    this.isLoading = true;
    // Implementation for viewing compliance evidence
    // this._ComplianceService
    //   .getEvidenceControlById(this.selectComplianceEvidence)
    //   .pipe(take(1))
    //   .subscribe({
    //     next: (res: any) => {
    //       this.Data = res?.data;
    //     },
    //     error: () => {
    //       this.Data = null;
    //     },
    //     complete: () => {
    //       this.isLoading = false;
    //     },
    //   });
  }
  // method to handle data table
  handleComplianceLinkedEvidenceTable(payload: any = null) {
    this.current_compliance_evidence_payload = payload;
    this.getComplianceLinkedEvidenceTable(payload);
  }
  // method to get compliance evidence table
  getComplianceLinkedEvidenceTable(payload: any) {
    this.complianceEvidenceList =[];
    this.isLoading = true;

      payload.complianceDocumentElementID = +this.currentComplianceDocumentElementID;
    this._ComplianceEvidanceService.getComplianceContentElementLinkedEvidances(payload).subscribe((res:any)=>{
      this.isLoading = false;
      this.complianceEvidenceList = res?.data?.items || [];
             this.paginationObj = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this._SharedService.paginationSubject.next(this.paginationObj);
    })

  }


  saveComplianceEvidence() {
    const canAdd = this._PermissionSystemService.can('COMPLIANCE' , 'ASSSESSMENT_CONTROLS' , 'ADD')
    if(!canAdd) return;
    this.loadingSaveEvidance = true;
    // Implementation for saving compliance evidence
    const payload = {
  "id": this.currentComplianceDocumentElementID,
  "linkedIds": this.current_selected_compliance_evidence_ids
}
    this._ComplianceEvidanceService
      .savedLinkedEvidancesComplianceDocumentElement(payload)
      .pipe(finalize(() => (this.loadingSaveEvidance = false)))
      .subscribe((res: any) => {
        this.addModal = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Evidence Linked Successfully !',
        });
      });
  }
  // method to selection row in compliance evidence
  current_selected_compliance_evidence_ids:any[]=[]
  handleSetSelection(event: any[]) {
    console.log("event selected" , event);
    this.current_selected_compliance_evidence_ids = event;
  }
  // handle dropdown action
  handleActionItems() {
    this.action_items = [
      {
        label: this._TranslateService.instant('SETTING.VIEW_CONTROL'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this.viewComplianceEvidenceInModal();
        },
        visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'ASSSESSMENT_CONTROLS' , 'VIEW')
      },
    ];
  }




  handleEvidenceComplianceTable(payload: any) {
        this.loadinEvidanceTable = true;
    this.evidenceComplianceList = [];
      this._ComplianceService
      .getEvidenceComplianceSearch(payload)
      .pipe(finalize(() => (this.loadinEvidanceTable = false)))
      .subscribe({
        next: (res: any) => {
          this.evidenceComplianceList = res?.data?.items;
          this.paginationObj = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this._SharedService.paginationSubject.next(this.paginationObj);
        },
      });
  }

  getSelectedComplianceEvidenceIDS(){
    // Implementation for getting selected compliance evidence IDs
    // this._ComplianceService.getSelectedControlsIDS(this.complianceID).subscribe((res:any)=>{
    //   this.selected_compliance_evidence = res?.data || []
    // })
  }
}
