import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FindingActionComponent } from "libs/shared/shared-ui/src/lib/findind-action/finding-action.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-ongoing-assessment-findings',
  imports: [CommonModule, TranslateModule, FindingActionComponent],
  templateUrl: './ongoing-assessment-findings.component.html',
  styleUrl: './ongoing-assessment-findings.component.scss',
})
export class OngoingAssessmentFindingsComponent {
    constructor(private route:ActivatedRoute, public _PermissionSystemService:PermissionSystemService){
          this.route.parent?.paramMap.subscribe((res)=>{
      this.entityID = res.get('id')
    })
  }



  entityID:any;

}
