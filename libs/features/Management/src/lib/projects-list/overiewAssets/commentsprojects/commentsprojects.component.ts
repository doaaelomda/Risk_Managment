// eslint-disable-next-line @nx/enforce-module-boundaries
import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lib-comments-projects',
  imports: [CommonModule,CommentSectionComponent],
  templateUrl: './commentsprojects.component.html',
  styleUrl: './commentsprojects.component.scss',
})
export class CommentsprojectsComponent {
  constructor(private _ActivatedRoute:ActivatedRoute) {
     this._ActivatedRoute?.parent?.paramMap.subscribe((res) => {
      this.riskChildId = res.get('id');
    });
  }
  riskId = 1;
  riskChildId: any;
}

