import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplianceService } from 'libs/features/compliance/src/compliance/compliance.service';
import { FindingActionComponent } from 'libs/shared/shared-ui/src/lib/findind-action/finding-action.component';
import { TranslateModule } from '@ngx-translate/core';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-pending-assessment-findings',
  imports: [
       CommonModule,
       FindingActionComponent,
       TranslateModule

  ],
  templateUrl: './PendingAssessmentFindings.component.html',
  styleUrl: './PendingAssessmentFindings.component.scss',
})
export class PendingAssessmentFindingsComponent  {
  entityID:any
  constructor(private complianceService:ComplianceService, public _PermissionSystemService:PermissionSystemService) {
       this.complianceService.controlAssessmentID$.subscribe(id=>{
      this.entityID = id;
    })
}
}
