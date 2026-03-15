import { Component, input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import {
  ReactiveFormsModule,
  AbstractControl,
  ControlContainer,
  FormGroupDirective,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-input-url',
  imports: [CommonModule, InputTextModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './input-url.component.html',
  styleUrl: './input-url.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class InputUrlComponent implements OnChanges {
  placeholder = input<string>();
  inputLabel = input<string>();
  controlNameInput = input.required<string>();
  control = input.required<AbstractControl>();

  currentControl!: AbstractControl;
  currentPlaceHolder = '';
  currentLabel = '';
  controlName = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['placeholder']?.currentValue) {
      this.currentPlaceHolder = changes['placeholder'].currentValue;
    }
    if (changes['control']?.currentValue) {
      this.currentControl = changes['control'].currentValue;
    }
    if (changes['controlNameInput']?.currentValue) {
      this.controlName = changes['controlNameInput'].currentValue;
    }
    if (changes['inputLabel']?.currentValue) {
      this.currentLabel = changes['inputLabel'].currentValue;
    }
  }

  
}
