import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lib-instance-question-comments',
  imports: [CommonModule, CommentSectionComponent],
  templateUrl: './InstanceQuestionComments.component.html',
  styleUrl: './InstanceQuestionComments.component.scss',
})
export class InstanceQuestionCommentsComponent {
  questionId: any;

  constructor(private _activatedRoute: ActivatedRoute) {
    this._activatedRoute.parent?.paramMap.subscribe((res: any) => {
      this.questionId = res.get('questionId');
    });
  }
}
