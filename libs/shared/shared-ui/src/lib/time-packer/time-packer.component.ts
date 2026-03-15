import { Component, input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { AbstractControl, ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { validations } from '../../models/validation.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-time-packer',
  imports: [CommonModule,CalendarModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './time-packer.component.html',
  styleUrl: './time-packer.component.scss',
    viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})
export class TimePackerComponent {
    placeholder = input<string>()
  validations = input<validations[]>()
  controlNameInput = input.required<string>()
  currentControl!:AbstractControl;
  currentPlaceHolder:string = ''
  currentValidations:validations[] =[]
  inputLabel = input<string>()
  control = input.required<AbstractControl>()
  controlName: string = ''
  label: string = ''
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['controlNameInput']?.currentValue) {
      this.controlName = changes['controlNameInput'].currentValue;
    }

    if(changes['placeholder']?.currentValue){
      this.currentPlaceHolder = changes['placeholder']?.currentValue
    }
    if(changes['inputLabel']?.currentValue){
      this.label = changes['inputLabel']?.currentValue
    }


    if(changes['validations']?.currentValue){
      this.currentValidations = changes['validations']?.currentValue
    }

    if (changes['control']?.currentValue) {
      this.currentControl = changes['control'].currentValue;

    }

  }
}
