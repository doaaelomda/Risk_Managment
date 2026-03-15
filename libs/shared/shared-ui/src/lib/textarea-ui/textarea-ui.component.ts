
import { Component, input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { validations } from '../../models/validation.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-textarea-ui',
  imports: [CommonModule , ReactiveFormsModule , TranslateModule],
  templateUrl: './textarea-ui.component.html',
  styleUrl: './textarea-ui.component.scss',
    viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})
export class TextareaUiComponent implements OnChanges {
    placeholder = input<string>()
  validations = input<validations[]>()
  controlNameInput = input.required<string>()
  currentControl!:AbstractControl;
  currentPlaceHolder:string = ''
  currentValidations:validations[] =[]
  inputLabel = input<string>()
  control = input.required<AbstractControl>()
  isArabicInput:boolean=false
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['controlNameInput']?.currentValue){
      this.controlName = changes['controlNameInput']?.currentValue
      this.isArabicInput = this.controlName.endsWith('AR') || this.controlName.endsWith('Ar')

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
