import { Component, forwardRef, Input, input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ControlContainer, FormControl, FormGroupDirective, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { validations } from '../../models/validation.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-ui-dropdown',
  imports: [CommonModule, DropdownModule , ReactiveFormsModule , FormsModule , TranslateModule ],
  templateUrl: './ui-dropdown.component.html',
  styleUrl: './ui-dropdown.component.scss',
  viewProviders: [ {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Dropdown),
    multi: true,
  },{ provide: ControlContainer, useExisting: FormGroupDirective }]

})
export class UiDropdownComponent implements OnChanges {

  currentData = [];
  currentOptionLabel = ''
  currentOptionValue = ''
  currentLabel: string = ''
  currentFormControlName: string = ''
  currentPlaceHolder: string = ''
  currentControl!: FormControl<any>;
  currentValidations: validations[] = []

  
  formControlNameInput = input.required();
  options = input.required();
  optionLabel = input.required();
  optionValue = input.required();
  label = input<string>();
  placeholder = input<string>();
  control = input.required<AbstractControl>()
  validations = input<validations[]>()
  @Input() showClear:boolean = true
  @Input() disabled:boolean=false

  ngOnChanges(changes: SimpleChanges): void {
     if (changes['control'] && changes['control'].currentValue) {
      this.currentControl = changes['control'].currentValue;
      console.log("drop " , this.currentControl);

    }
    if (changes['formControlNameInput'] && changes['formControlNameInput'].currentValue) {
      this.currentFormControlName = changes['formControlNameInput'].currentValue;

    }
    if (changes['validations'] && changes['validations'].currentValue) {
      this.currentValidations = changes['validations'].currentValue;
      console.log("currentValidations" , this.currentValidations);

    }
    if (changes['options'] && changes['options'].currentValue) {
      this.currentData = changes['options'].currentValue;
    }
    if (changes['optionLabel'] && changes['optionLabel'].currentValue) {
      this.currentOptionLabel = changes['optionLabel'].currentValue;
    }
    if (changes['optionValue'] && changes['optionValue'].currentValue) {
      this.currentOptionValue = changes['optionValue'].currentValue;

    }
    if (changes['label'] && changes['label'].currentValue) {
      this.currentLabel = changes['label'].currentValue;
    }
    if (changes['placeholder'] && changes['placeholder'].currentValue) {
      this.currentPlaceHolder = changes['placeholder'].currentValue;
    }


  }

}
