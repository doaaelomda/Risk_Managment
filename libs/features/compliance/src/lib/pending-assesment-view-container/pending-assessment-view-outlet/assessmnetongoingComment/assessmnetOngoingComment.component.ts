import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';
import { ComplianceService } from 'libs/features/compliance/src/compliance/compliance.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';

@Component({
  selector: 'lib-assessmnet-ongoing-comment',
  imports: [CommonModule, CommentSectionComponent],
  templateUrl: './assessmnetOngoingComment.component.html',
  styleUrl: './assessmnetOngoingComment.component.scss',
})
export class AssessmnetOngoingCommentComponent {
  constructor(
    private complianceService: ComplianceService,
    private _SharedService: SharedService
  ) {
    this.complianceService.controlAssessmentID$.subscribe((id) => {
      this.riskChildId = id;
    });
  }
  riskId = 1;
  riskChildId: any;
}
