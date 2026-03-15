import { EntityActionComponent } from './../../../../../../shared/shared-ui/src/lib/entity-action/entity-action.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'lib-incident-action',
  standalone: true,
  imports: [CommonModule, EntityActionComponent,TranslateModule],
  templateUrl: './incident-action.component.html',
  styleUrl: './incident-action.component.scss',
})
export class IncidentActionComponent {
  dataEntityID: any;
  constructor(private ActivatedRoute: ActivatedRoute) {
    this.ActivatedRoute.parent?.paramMap.subscribe((params) => {
      this.dataEntityID = params.get('id');
    });
  }
}
