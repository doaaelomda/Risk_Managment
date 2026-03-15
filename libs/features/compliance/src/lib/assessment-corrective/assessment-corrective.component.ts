import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ComplianceService } from '../../compliance/compliance.service';
import { EntityActionComponent } from 'libs/shared/shared-ui/src/lib/entity-action/entity-action.component';
import { TranslateModule } from '@ngx-translate/core';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-assessment-corrective',
  imports: [
    CommonModule,
    EntityActionComponent,TranslateModule
],
  templateUrl: './assessment-corrective.component.html',
  styleUrl: './assessment-corrective.component.scss',
})
export class AssessmentCorrectiveComponent {
  entityID:any
  constructor(private complianceService:ComplianceService,public _PermissionSystemService:PermissionSystemService) {
        this.complianceService.controlAssessmentID$.subscribe(id=>{
      this.entityID = id;
  })
}
}
