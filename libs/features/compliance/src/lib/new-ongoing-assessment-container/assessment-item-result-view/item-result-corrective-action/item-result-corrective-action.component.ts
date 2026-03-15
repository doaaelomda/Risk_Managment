import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EntityActionComponent } from "libs/shared/shared-ui/src/lib/entity-action/entity-action.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-item-result-corrective-action',
  imports: [CommonModule, EntityActionComponent , TranslateModule],
  templateUrl: './item-result-corrective-action.component.html',
  styleUrl: './item-result-corrective-action.component.scss',
})
export class ItemResultCorrectiveActionComponent {
      constructor(private route:ActivatedRoute){


  }


  entityID = input<any>()
  mode = input<string>()
}
