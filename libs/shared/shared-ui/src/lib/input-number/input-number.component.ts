import { Component, Input, input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { validations } from '../../models/validation.model';
import { TranslateModule } from '@ngx-translate/core';
import { InputNumberModule } from 'primeng/inputnumber';
import { MenuModule } from "primeng/menu";

@Component({
  selector: 'lib-input-number',
  imports: [CommonModule, InputNumberModule, ReactiveFormsModule, TranslateModule, MenuModule],
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})
export class InputNumberComponent {
   placeholder = input<string>()
  validations = input<validations[]>()
  controlNameInput = input.required<string>()
  currentControl!:AbstractControl;
  currentPlaceHolder:string = ''
  currentValidations:validations[] =[]
  inputLabel = input<string>()
  @Input() maxLength:number|null = null
  @Input()toolTip:string|null = null;
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
