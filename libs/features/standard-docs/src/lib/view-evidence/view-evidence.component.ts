import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  OverviewEntry,
  SharedOverviewComponent,
} from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';
import { ActivatedRoute } from '@angular/router';
import { EvidenceLibraryService } from '../services/evidence-libraray.service';

@Component({
  selector: 'lib-view-evidence',
  imports: [CommonModule, SharedOverviewComponent],
  templateUrl: './view-evidence.component.html',
  styleUrl: './view-evidence.component.scss',
})
export class ViewEvidenceComponent {
  loadData: boolean = true;
  Data: any;
  entries: OverviewEntry[] = [
    {
      key: 'name',
      label: 'EVIDENCE_COMPLIANCE.NAME',
      type: 'text',
    },
    {
      key: 'taskTitle',
      label: 'EVIDENCE_COMPLIANCE.TASK_TITLE',
      type: 'text',
    },
    {
      key: 'evidenceTypeStatusTypeName',
      label: 'EVIDENCE_COMPLIANCE.EVIDENCE_TYPE_STATUS',
      type: 'text',
    },
    {
      key: 'organizationalUnitName',
      label: 'EVIDENCE_COMPLIANCE.ORGANIZATIONAL_UNIT',
      type: 'text',
    },
    {
      key: 'assigneeRoleName',
      label: 'EVIDENCE_COMPLIANCE.ASSIGNEE_ROLE',
      type: 'text',
    },
    {
      key: 'assigneeUserName',
      label: 'EVIDENCE_COMPLIANCE.ASSIGNEE_USER',
      type: 'user',
      id: 'assigneeUserID',
    },
    {
      key: 'approvalRequired',
      label: 'EVIDENCE_COMPLIANCE.APPROVAL_REQUIRED',
      type: 'boolean',
    },
    {
      key: 'nextUpdateDate',
      label: 'EVIDENCE_COMPLIANCE.NEXT_UPDATE_DATE',
      type: 'date',
    },
    {
      key: 'description',
      label: 'EVIDENCE_COMPLIANCE.DESCRIPTION',
      type: 'description',
    },
    {
      key: 'taskDescription',
      label: 'EVIDENCE_COMPLIANCE.TASK_DESCRIPTION',
      type: 'description',
    },
    {
      key: 'evidenceDescription',
      label: 'EVIDENCE_COMPLIANCE.EVIDENCE_DESCRIPTION',
      type: 'description',
    },
  ];
  id: any;

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private EvidenceLibraryService: EvidenceLibraryService
  ) {
    this._ActivatedRoute?.parent?.paramMap.subscribe((res) => {
      this.id = res.get('id');
    });
    this.getData();
  }

  getData() {
    this.loadData = true;
    this.EvidenceLibraryService.getEvidenceById(this.id).subscribe(
      (res: any) => {
        this.Data = res?.data;
        this.loadData = false;
      }
    );
  }
}
