import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';

@Component({
  selector: 'lib-comment-document',
  imports: [CommonModule,CommentSectionComponent],
  templateUrl: './commentDocument.component.html',
  styleUrl: './commentDocument.component.scss',
})
export class CommentDocumentComponent {
  riskId = 1;
  riskChildId: any;

  constructor(
    private _ActivatedRoute: ActivatedRoute,
  ) {
      this._ActivatedRoute?.parent?.paramMap.subscribe((params) => {
      this.riskChildId = params.get('Docid');
    });
  }


}
