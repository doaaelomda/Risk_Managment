/* eslint-disable @nx/enforce-module-boundaries */
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { EntityActionComponent } from "libs/shared/shared-ui/src/lib/entity-action/entity-action.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-item-result-evidance-task',
  imports: [CommonModule, EntityActionComponent, TranslateModule],
  templateUrl: './item-result-evidance-task.component.html',
  styleUrl: './item-result-evidance-task.component.scss',
})
export class ItemResultEvidanceTaskComponent {

  constructor(private route: ActivatedRoute, public _PermissionSystemService: PermissionSystemService) {
  }


  entityID = input<any>()
  mode = input<string>()
}
