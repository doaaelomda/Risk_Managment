import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';

@Component({
  selector: 'lib-comment-procedure',
  imports: [CommonModule,CommentSectionComponent],
  templateUrl: './commentProcedure.component.html',
  styleUrl: './commentProcedure.component.scss',
})
export class CommentProcedureComponent {
      constructor(private _ActivatedRoute:ActivatedRoute) {
    this._ActivatedRoute.parent?.paramMap.subscribe((res: any) => {
      this.riskChildId = res.get('procedureId');
    });
  }
  riskId = 1;
  riskChildId: any;

}
