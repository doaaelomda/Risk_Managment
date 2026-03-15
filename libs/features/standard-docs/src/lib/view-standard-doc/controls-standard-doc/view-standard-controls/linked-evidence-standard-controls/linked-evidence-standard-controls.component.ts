import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsService } from '../../../../services/controls-service.service';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';

@Component({
  selector: 'lib-linked-evidence-standard-controls',
  imports: [
    CommonModule,
    NewTableComponent,
    TranslateModule,
    DialogModule,
    Button,
  ],
  templateUrl: './linked-evidence-standard-controls.component.html',
  styleUrl: './linked-evidence-standard-controls.component.scss',
})
export class LinkedEvidenceStandardControlsComponent {
  constructor(
    private controlsService: ControlsService,
    public _PermissionSystemService: PermissionSystemService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private translateService: TranslateService,
    private sharedService: SharedService
  ) {
    this.handleEvidenceTableItems();
    const id = this.route.parent?.snapshot.paramMap.get('id');
    this.control_id = id ? +id : null;
  }
  control_id: number | null;
  evidence_table_items: any[] = [];
  actionDeleteVisible: boolean = false;
  handleEvidenceTableItems() {
    this.evidence_table_items = [
      {
        label: this.translateService.instant(
          'ControlRequirement.VIEW_EVIDENCE'
        ),
        icon: 'fi fi-rr-eye',
        command: () => {
          //
        },
        visible: () =>
          this._PermissionSystemService.can(
            'LIBRARY',
            'STANDARDDOCUMENTS_CONTROLSLINKEDEVIDENCE',
            'VIEW'
          ),
      },
    ];
  }
  selected_linked_evidence: number | null = null;
  setSelectedLinkedEvidence(event: number) {
    this.selected_linked_evidence = event;
    console.log(event, 'selected here');
  }
  evidence_payload: unknown;
  handleEvidenceDataTable(event: unknown) {
    this.evidence_payload = event;
    this.getLinkedEvidenceList(event);
  }
  loadingEvidence: boolean = true;
  evidenceList: unknown[] = [];
  pageginationObj: any;
  onModalClose() {
    console.log('testing hide...');

    this.getLinkedEvidenceList(this.evidence_payload);
  }
  getLinkedEvidenceList(payload: any) {
    this.evidenceList = [];
    this.loadingEvidence = true;
    this.controlsService
      .getLinkedEvidenceList({...payload,governanceStandardControlID:this.control_id})
      .pipe(finalize(() => (this.loadingEvidence = false)))
      .subscribe({
        next: (res: unknown) => {
          if (
            res &&
            typeof res === 'object' &&
            'data' in res &&
            res.data &&
            typeof res.data === 'object' &&
            'items' in res.data
          ) {
            const data = res.data.items;
            if (
              'pageSize' in res.data &&
              'pageNumber' in res.data &&
              'totalCount' in res.data &&
              'totalPages' in res.data
            ) {
              this.pageginationObj = {
                perPage: res?.data?.pageSize,
                currentPage: res?.data?.pageNumber,
                totalItems: res?.data?.totalCount,
                totalPages: res?.data?.totalPages,
              };
              this.sharedService.paginationSubject.next(this.pageginationObj);
            }
            this.evidenceList = data as [];
          }
          console.log(res, 'got evidence list ');
        },
      });
  }

  isAddingEvidence: boolean = false;

  loadingTemplateList: boolean = true;
  selected_linked_template_ids: number[] = [];
  setSelectedLinkedTemplate(event: number[]) {
    this.selected_linked_template_ids = event;
    console.log(event, 'selected here');
  }
  template_payload: unknown;
  handleTemplateDataTable(event: unknown) {
    this.template_payload = event;
    this.getTemplateEvidenceTypeList(event);
  }
  templateList: unknown[] = [];

  getTemplateEvidenceTypeList(payload: unknown) {
    this.templateList = [];
    this.loadingTemplateList = true;
    this.controlsService
      .getTemplateEvidenceTypeList(payload)
      .pipe(finalize(() => (this.loadingTemplateList = false)))
      .subscribe({
        next: (res: unknown) => {
          if (
            res &&
            typeof res === 'object' &&
            'data' in res &&
            res.data &&
            typeof res.data === 'object' &&
            'items' in res.data
          ) {
            const data = res.data.items;
            if (
              'pageSize' in res.data &&
              'pageNumber' in res.data &&
              'totalCount' in res.data &&
              'totalPages' in res.data
            ) {
              this.pageginationObj = {
                perPage: res?.data?.pageSize,
                currentPage: res?.data?.pageNumber,
                totalItems: res?.data?.totalCount,
                totalPages: res?.data?.totalPages,
              };
              this.sharedService.paginationSubject.next(this.pageginationObj);
            }

            this.templateList = data as [];
          }
          console.log(res, 'got template list (popup)');
        },
      });
  }

  savingEvidence: boolean = false;
  saveTemplateEvidenceType() {
    if (!this.control_id) return;
     const canAdd = this._PermissionSystemService.can('LIBRARY' , 'STANDARDDOCUMENTS_CONTROLSLINKEDEVIDENCE' , 'ADD') 
     if(!canAdd)return
    this.savingEvidence = true;
    const payload = {
      id: this.control_id,
      linkedIds: this.selected_linked_template_ids,
    };
    this.controlsService
      .saveTemplateEvidenceType(payload)
      .pipe(finalize(() => (this.savingEvidence = false)))
      .subscribe({
        next: (res: unknown) => {
          this.isAddingEvidence = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Evidence Added Successfully !',
          });
          console.log('saved: ', payload);
        },
      });
  }

  selected_ids: any[] = [];

  getSelectedIDS() {
    // this._ComplianceService.getSelectedControlsIDS(this.complianceID).subscribe((res:any)=>{
    //   this.selected_ids = res?.data || []
    // })
  }

  modalColumnControl: any = {
    type: 'popup',
    data: null,
  };
}
