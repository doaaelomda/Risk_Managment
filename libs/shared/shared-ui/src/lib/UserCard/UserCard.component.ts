import { TranslateModule } from '@ngx-translate/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgSystemComponent } from '../img-system/img-system.component';

@Component({
  selector: 'lib-user-card',
  imports: [CommonModule,TranslateModule,ImgSystemComponent],
  templateUrl: './UserCard.component.html',
  styleUrl: './UserCard.component.scss',
})
export class UserCardComponent {
  @Input() avatar: string = '';
  @Input() name: string = '';
  @Input() role: string = '';
  @Input() scope: string = '';
  @Input() NotRequiredData: string = '';
  @Input() cardWidth: string = '400px';
   @Input() canEdit:boolean=true;
   @Input() canDelete:boolean=true;
  @Output() actionEmitter = new EventEmitter<string>();
  emitAction(action: string) {
  this.actionEmitter.emit(action);

}
}
