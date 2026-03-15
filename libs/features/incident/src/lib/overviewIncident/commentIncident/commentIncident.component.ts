import { CommentSectionComponent } from './../../../../../../shared/shared-ui/src/lib/comment-section/comment-section.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { IncidentService } from '../../../services/incident.service';

@Component({
  selector: 'lib-comment-incident',
  imports: [CommonModule,CommentSectionComponent],
  templateUrl: './commentIncident.component.html',
  styleUrl: './commentIncident.component.scss',
})
export class CommentIncidentComponent {
    constructor(private _ActivatedRoute:ActivatedRoute,    private _LayoutService:LayoutService,
        private _TranslateService:TranslateService,private IncidentService:IncidentService
        ) {
     this._ActivatedRoute?.parent?.paramMap.subscribe((res) => {
      this.riskChildId = res.get('id');
      this.IncidentService.getIncidentById(this.riskChildId).subscribe((res: any) => {
  })
    });
  }
  riskId = 1;
  riskChildId: any;


}
