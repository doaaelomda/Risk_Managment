import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lib-comments-duadiliganse',
  imports: [CommonModule, CommentSectionComponent],
  templateUrl: './comments-duadiliganse.component.html',
  styleUrl: './comments-duadiliganse.component.scss',
})
export class CommentsDuadiliganseComponent {
  constructor(private _sharedS: SharedService, private _activatedRoute:ActivatedRoute) {
    const params = this._activatedRoute.parent?.snapshot.params
    console.log(params,'params');
    
    this.DUE_DILIGANCE_ID = +params?.['dueDiligenceId']

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
    if(!this.DUE_DILIGANCE_ID)return
    this._sharedS
      .deleteComment(message.commentID, this.DUE_DILIGANCE_ID)
      .subscribe((res) => {
        console.log('Comment deleted', res);
      });
  }
  DUE_DILIGANCE_ID!: number
  relatedEntityId:number = 6
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
