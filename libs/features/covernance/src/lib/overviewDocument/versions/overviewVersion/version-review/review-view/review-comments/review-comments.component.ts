import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { CommentSectionComponent } from "libs/shared/shared-ui/src/lib/comment-section/comment-section.component";

@Component({
  selector: 'lib-review-comments',
  imports: [CommonModule, CommentSectionComponent],
  templateUrl: './review-comments.component.html',
  styleUrl: './review-comments.component.scss',
})
export class ReviewCommentsComponent {
  constructor(
    private _sharedS: SharedService,
    private _activatedRoute: ActivatedRoute
  ) {
    const id = this._activatedRoute.parent?.snapshot.paramMap.get('id');
    if (!id) return;
    this.FEAT_ID = +id;
  }

  items: any[] = [
    {
      label: 'Delete comment',
      icon: 'fi fi-rr-trash',
      command: () => {},
    },
    {
      label: 'Update comment',
      icon: 'fi fi-rr-pencil',
      command: () => {},
    },
  ];
  deleteComment(message: any) {
    if (!this.FEAT_ID) return;
    this._sharedS
      .deleteComment(message.commentID, this.FEAT_ID)
      .subscribe((res) => {
        console.log('Comment deleted', res);
      });
  }
  FEAT_ID!: number;
  relatedEntityId: number = 84;

  updateMessage(newContent: string, message: any) {
    const updated = { ...message, content: newContent };
    updated.commentId = updated['commentID'];
    this._sharedS
      .updateComment(updated.commentId, updated.commentId, updated.content)
      .subscribe(() => {
        console.log('Comment updated');
      });
  }
}
