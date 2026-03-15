import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';

@Component({
  selector: 'lib-actvity-comment',
    imports: [CommonModule,CommentSectionComponent ],
  templateUrl: './actvityComment.component.html',
  styleUrl: './actvityComment.component.scss',
})
export class ActvityCommentComponent  {
    constructor(private _ActivatedRoute:ActivatedRoute) {
     this._ActivatedRoute?.parent?.paramMap.subscribe((res) => {

      this.riskChildId = res.get('ActivityId');
    });
  }
  riskId = 1;
  riskChildId: any;

}
