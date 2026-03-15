import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';

@Component({
  selector: 'lib-comment-initiatives',
  imports: [CommonModule,CommentSectionComponent],
  templateUrl: './commentInitiatives.component.html',
  styleUrl: './commentInitiatives.component.scss',
})
export class CommentInitiativesComponent {
   constructor(private _ActivatedRoute:ActivatedRoute) {
     this._ActivatedRoute?.parent?.paramMap.subscribe((res) => {
      this.riskChildId = res.get('id');
    });
  }
  riskId = 1;
  riskChildId: any;
}
