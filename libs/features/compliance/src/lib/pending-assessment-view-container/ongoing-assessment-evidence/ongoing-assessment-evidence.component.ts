import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntityActionComponent } from "libs/shared/shared-ui/src/lib/entity-action/entity-action.component";
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-ongoing-assessment-evidence',
  imports: [CommonModule, EntityActionComponent,TranslateModule],
  templateUrl: './ongoing-assessment-evidence.component.html',
  styleUrl: './ongoing-assessment-evidence.component.scss',
})
export class OngoingAssessmentEvidenceComponent {
  constructor(private route:ActivatedRoute, public _PermissionSystemService:PermissionSystemService){
    this.route.parent?.paramMap.subscribe((res)=>{
      this.entityID = res.get('id')
    })
  }


  entityID:any;

}
