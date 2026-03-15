import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lib-comment-process',
  imports: [CommonModule,CommentSectionComponent],
  templateUrl: './commentProcess.component.html',
  styleUrl: './commentProcess.component.scss',
})
export class CommentProcessComponent {
      constructor(private _ActivatedRoute:ActivatedRoute) {
     this._ActivatedRoute?.parent?.paramMap.subscribe((res) => {
      this.riskChildId = res.get('processId');
    });
  }
  riskId = 1;
  riskChildId: any;

}
