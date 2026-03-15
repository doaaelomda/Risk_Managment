import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-checkbox-option',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './CheckBoxOption.component.html',
  styleUrls: ['./CheckBoxOption.component.scss'],
})
export class CheckboxOptionComponent {
  @Input() label!: string;
  @Input() image!: string;
  @Input() value!: string;
  @Input() model: any | null = null;
  @Output() modelChange = new EventEmitter<string>();

  handleClick() {
    this.modelChange.emit(this.value);
  }

  get checked(): boolean {
    return this.model === this.value;
  }
}
