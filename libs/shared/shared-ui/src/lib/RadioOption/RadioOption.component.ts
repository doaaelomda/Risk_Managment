import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-radio-option',
  standalone: true,
  imports: [CommonModule, TranslateModule, RadioButtonModule, FormsModule],
  templateUrl: './RadioOption.component.html',
  styleUrls: ['./RadioOption.component.scss'],
})
export class RadioOptionComponent {
  @Input() label!: string;
  @Input() value!: string;
  @Input() name!: string;
  @Input() image!: string;
  @Input() inputId!: string;
  @Input() disabled: boolean = false;
  @Input() model: any;
  @Output() modelChange = new EventEmitter<any>();
  @Output() clicked = new EventEmitter<void>();

  handleClick() {
    this.modelChange.emit(this.value);
    this.clicked.emit();
  }
}
