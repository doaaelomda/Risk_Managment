import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { switchMap } from 'rxjs';
import { RiskService } from '../../../services/risk.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'lib-ass-comments',
  imports: [CommonModule, CommentSectionComponent],
  templateUrl: './ass-comments.component.html',
  styleUrl: './ass-comments.component.scss',
})
export class AssCommentsComponent {
  riskChildId: any;
  riskId: any;
  riskTitle: string = '';
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _SharedService: SharedService,
    private _RiskService: RiskService,
    private _TranslateService:TranslateService
  ) {
    this._ActivatedRoute.parent?.paramMap.subscribe((params) => {
      this.riskId = params.get('riskID');
    });
    this._ActivatedRoute.parent?.paramMap
      .pipe(
        switchMap((params) => {
          this.riskChildId = params.get('assID');
          this.riskId = Number(params.get('riskID'));
          console.log(this.riskChildId, ' this.riskChildId');
          return this._RiskService.getOneRiskAssessment(
            this.riskChildId,this.riskId
          );
        })
      )
      .subscribe((res: any) => {
        this.riskTitle = res?.data.riskTitle;

      });


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
  updateMessage(newContent: string, message: any) {
    const updated = { ...message, content: newContent };
    updated.commentId = updated['commentID'];
    this._SharedService
      .updateComment(updated.commentId, updated.commentId, updated.content)
      .subscribe(() => {
        console.log('Comment updated');
      });
  }
  deleteComment(message: any) {
    this._SharedService
      .deleteComment(message.commentID, this.riskId)
      .subscribe((res) => {
        console.log('Comment deleted', res);
      });
  }
}
