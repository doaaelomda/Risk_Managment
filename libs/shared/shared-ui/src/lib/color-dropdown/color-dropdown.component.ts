import { Component, input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import {
  FormControl,
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-color-dropdown',
  standalone: true,
  imports: [CommonModule, DropdownModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './color-dropdown.component.html',
  styleUrls: ['./color-dropdown.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class ColorDropdownComponent implements OnChanges {
  placeholder = input<string>();
  inputLabel = input<string>();
  controlNameInput = input.required<string>();
  control = input.required<AbstractControl>()

  currentControl!: FormControl;
  currentPlaceholder = '';
  label = '';
  controlName = '';

  colors = [
  'DodgerBlue',
  'SteelBlue',
  'SkyBlue',
  'PowderBlue',
  'DarkGreen',
  'Teal',
  'Green',
  'GreenYellow',
  'Gold',
  'LightYellow',
  'Orange',
  'DarkOrange',
  'Pink',
  'HotPink',
  'MediumPurple',
  'Purple',
  'Tomato',
  'OrangeRed',
  'Red',
  'DarkRed',
  'LightGray',
  'DarkGray',
  'Gray',
  'DimGray'
];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['control']?.currentValue) {
      this.currentControl = changes['control'].currentValue;
    }
    if (changes['placeholder']?.currentValue) {
      this.currentPlaceholder = changes['placeholder'].currentValue;
    }
    if (changes['inputLabel']?.currentValue) {
      this.label = changes['inputLabel'].currentValue;
    }
    if (changes['controlNameInput']?.currentValue) {
      this.controlName = changes['controlNameInput'].currentValue;
    }
  }

  handleSelect(event: any) {
    const selectedColor = event.value;
    if (this.currentControl) {
      this.currentControl.setValue(selectedColor);
      this.currentControl.markAsDirty();
      this.currentControl.markAsTouched();
    }
  }
}
