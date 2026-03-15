import { Component, input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { validations } from '../../models/validation.model';
import { InputNumberModule } from 'primeng/inputnumber';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-currency-input',
  imports: [CommonModule, InputNumberModule,ReactiveFormsModule , TranslateModule],
  templateUrl: './currency-input.component.html',
  styleUrl: './currency-input.component.scss',
    viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})
export class CurrencyInputComponent {
    placeholder = input<string>()
  validations = input<validations[]>()
  controlNameInput = input.required<string>()
  currentControl!:AbstractControl;
  currentPlaceHolder:string = ''
  currentValidations:validations[] =[]
  inputLabel = input<string>()
  control = input.required<AbstractControl>()
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['controlNameInput']?.currentValue){
      this.controlName = changes['controlNameInput']?.currentValue
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


    if(changes['control']?.currentValue){
      this.currentControl = changes['control']?.currentValue;
    }


  }


  controlName:string=''

  label:string=''
}
