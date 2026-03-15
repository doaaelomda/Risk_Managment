import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FindingActionComponent } from "libs/shared/shared-ui/src/lib/findind-action/finding-action.component";
import { ActivatedRoute } from '@angular/router';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-item-result-finding',
  imports: [CommonModule, FindingActionComponent , TranslateModule],
  templateUrl: './item-result-finding.component.html',
  styleUrl: './item-result-finding.component.scss',
})
export class ItemResultFindingComponent {

      constructor(private route:ActivatedRoute, public _PermissionSystemService:PermissionSystemService){

  }



  entityID = input<any>();
  mode = input<any>();
}
