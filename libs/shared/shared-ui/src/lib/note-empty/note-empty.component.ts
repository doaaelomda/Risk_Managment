import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'lib-note-empty',
  imports: [CommonModule,TranslateModule,ButtonModule],
  templateUrl: './note-empty.component.html',
  styleUrl: './note-empty.component.scss',
})
export class NoteEmptyComponent {
  handleAddMessage(){
    console.log("add message");

  }
}
