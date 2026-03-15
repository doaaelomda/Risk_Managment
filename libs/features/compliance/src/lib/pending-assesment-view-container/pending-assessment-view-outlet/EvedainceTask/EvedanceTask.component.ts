
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplianceService } from 'libs/features/compliance/src/compliance/compliance.service';
import { EntityActionComponent } from 'libs/shared/shared-ui/src/lib/entity-action/entity-action.component';
import { TranslateModule } from '@ngx-translate/core';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-evedance-task',
  imports: [   EntityActionComponent,
    CommonModule,TranslateModule],
  templateUrl: './EvedanceTask.component.html',
  styleUrl: './EvedanceTask.component.scss',
})
export class EvedanceTaskComponent  {
  entityID:any
  constructor(private complianceService: ComplianceService, public _PermissionSystemService:PermissionSystemService) {
          this.complianceService.controlAssessmentID$.subscribe(id=>{
      this.entityID = id;
  })
}
}
