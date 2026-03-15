import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { TranslateModule } from '@ngx-translate/core';
import { Button } from 'primeng/button';
import { finalize } from 'rxjs';
import { ComplianceEvidanceService } from 'libs/features/compliance/src/services/compliance-evidance.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'lib-link-evidence-table',
  imports: [
    CommonModule,
    DialogModule,
    NewTableComponent,
    TranslateModule,
    Button,
  ],
  templateUrl: './link-evidence-table.component.html',
  styleUrl: './link-evidence-table.component.scss',
})
export class LinkEvidenceTableComponent {
  constructor(
    private evidenceService: ComplianceEvidanceService,
    private messageService: MessageService
  ) {}
  @Output() showDialogEmitter = new EventEmitter<boolean>();
  @Output() saveEvidenceEmitter = new EventEmitter<boolean>();
  @Output() hideEmitter = new EventEmitter<boolean>();
  @Output() handleEvidenceTypesDataEmitter = new EventEmitter<any>();
  @Input({ required: true }) isLinkingEvidence: boolean = false;
  @Input({ required: true }) assessmentItemResultID: any;
  @Input({ required: true }) loadingEvidencesTypes: any;
  @Input({ required: true }) linked_evidancesIDS: any;
  @Input({ required: true }) evidencesTypes: any;
  handleOnShow() {
    this.showDialogEmitter.emit(true);
  }
  evidence_types_current_payload: any;
  handleEvidenceTypesData(payload: any) {
    this.evidence_types_current_payload = payload;
    this.handleEvidenceTypesDataEmitter.emit(payload)
  }
  handleEvidenceTypeSelection(selections: any) {
    this.linked_evidancesIDS = selections;
    console.log(selections, 'selected types here...');
  }

  saving: boolean = false;
  linkEvidence() {
    //
    this.saving = true;
    this.evidenceService
      .linkEvidence({
        linkedIds: this.linked_evidancesIDS,
        id: this.assessmentItemResultID,
      })
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            detail: 'Evidence Types Saved Successfully.',
            summary: 'Success',
          });
          this.isLinkingEvidence = false;
          this.saveEvidenceEmitter.emit(true);
        },
      });
  }
}
