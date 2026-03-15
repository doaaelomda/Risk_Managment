import { CommentSectionComponent } from './../../../../../../shared/shared-ui/src/lib/comment-section/comment-section.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-comment-notifiaction',
  imports: [CommonModule,CommentSectionComponent],
  templateUrl: './comment-notifiaction.component.html',
  styleUrl: './comment-notifiaction.component.scss',
})
export class CommentNotifiactionComponent {
    riskChildId:any= 22;
}
