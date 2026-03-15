import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lib-comment-general-assessmnet',
  imports: [CommonModule,CommentSectionComponent

  ],
  templateUrl: './commentGeneralAssessmnet.component.html',
  styleUrl: './commentGeneralAssessmnet.component.scss',
})
export class CommentGeneralAssessmnetComponent {
    constructor(private _ActivatedRoute:ActivatedRoute) {
     this._ActivatedRoute?.parent?.paramMap.subscribe((res) => {
      this.riskChildId = res.get('AssId');
    });
  }
  riskId = 1;
  riskChildId: any;

}
