import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';

@Component({
  selector: 'lib-control-assessment-comments',
  imports: [CommonModule, CommentSectionComponent],
  templateUrl: './control-assessment-comments.component.html',
  styleUrl: './control-assessment-comments.component.scss',
})
export class ControlAssessmentCommentsComponent {
  constructor(
    private _sharedS: SharedService,
    private _activatedRoute: ActivatedRoute
  ) {
    const id = this._activatedRoute.snapshot.parent?.paramMap.get('id');
    if (!id) return;
    this.FEAT_ID = +id;
  }

  FEAT_ID!: number;
  dataEntityTypeId: number =11;
}
