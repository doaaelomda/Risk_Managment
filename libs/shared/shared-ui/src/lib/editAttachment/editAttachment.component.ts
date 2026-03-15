import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-edit-attachment',
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule,TranslateModule],
  templateUrl: './editAttachment.component.html',
  styleUrl: './editAttachment.component.scss',
})
export class EditAttachmentComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Input() title: string = '';
  @Input() loading: boolean = false;

  @Output() save = new EventEmitter<string>();
  @Output() cancel_Modal = new EventEmitter<void>();

  internalTitle: string = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['title'] && changes['title'].currentValue !== undefined) {
      this.internalTitle = changes['title'].currentValue;
    }
  }

  onSave() {
    this.save.emit(this.internalTitle);
  }

  onCancel() {
    this.cancel_Modal.emit();
  }
}
