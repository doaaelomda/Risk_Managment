import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntityActionComponent } from "libs/shared/shared-ui/src/lib/entity-action/entity-action.component";
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-ongoing-assessment-corrective-action',
  imports: [CommonModule, EntityActionComponent,TranslateModule],
  templateUrl: './ongoing-assessment-corrective-action.component.html',
  styleUrl: './ongoing-assessment-corrective-action.component.scss',
})
export class OngoingAssessmentCorrectiveActionComponent {
    constructor(private route:ActivatedRoute){
          this.route.parent?.paramMap.subscribe((res)=>{
      this.entityID = res.get('id')
    })

  }


  entityID:any;
}
