import { EntityActionComponent } from './../../../../../shared/shared-ui/src/lib/entity-action/entity-action.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-response-action',
  imports: [
    CommonModule,
    EntityActionComponent,TranslateModule
  ],
  templateUrl: './response-action.component.html',
  styleUrl: './response-action.component.scss',
})
export class ResponseActionComponent {
  entityID:any
  constructor(private ActivatedRoute: ActivatedRoute) {
      this.ActivatedRoute.parent?.paramMap.subscribe((params) => {
      this.entityID = params.get('id');
  })
}
}
