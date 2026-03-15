import { CommentSectionComponent } from './../../../../../../shared/shared-ui/src/lib/comment-section/comment-section.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lib-commnet-measurmnet',
  imports: [CommonModule, CommentSectionComponent],
  templateUrl: './commnetMeasurmnet.component.html',
  styleUrl: './commnetMeasurmnet.component.scss',
})
export class CommnetMeasurmnetComponent {
  // Declaration Variables
  relatedColumnId: any;
  constructor(private _ActivatedRoute: ActivatedRoute) {
    this._ActivatedRoute?.parent?.paramMap.subscribe((res) => {
      this.relatedColumnId = res.get('id');
    });
  }
}
