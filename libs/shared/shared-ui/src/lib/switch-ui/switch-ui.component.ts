import { Component, input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AbstractControl, ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { validations } from '../../models/validation.model';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'lib-switch-ui',
  imports: [CommonModule , InputSwitchModule , ReactiveFormsModule,TranslateModule],
  templateUrl: './switch-ui.component.html',
  styleUrl: './switch-ui.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})
export class SwitchUiComponent implements OnChanges {
  validations = input<validations[]>()
  controlNameInput = input.required<string>()
  currentControl!:AbstractControl;
  control = input.required<AbstractControl>()
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['controlNameInput']?.currentValue){
      this.controlName = changes['controlNameInput']?.currentValue
    }









    if(changes['control']?.currentValue){
      this.currentControl = changes['control']?.currentValue;
    }


  }


  controlName:string=''

  label:string=''
}
