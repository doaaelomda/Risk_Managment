import { AbstractControl, ControlContainer, FormControl, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { Component, input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { validations } from '../../models/validation.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-input-text',
  imports: [CommonModule , InputTextModule,ReactiveFormsModule , TranslateModule],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})
export class InputTextComponent implements OnChanges {
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
