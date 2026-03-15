import { Component, Input, input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeSelectModule } from 'primeng/treeselect';
import { AbstractControl, ControlContainer, FormControl, FormGroupDirective, FormsModule , NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { validations } from '../../models/validation.model';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'lib-tree-multiselect',
    imports: [CommonModule , TranslateModule,TreeSelectModule,ReactiveFormsModule,FormsModule],
  templateUrl: './treeMultiselect.component.html',
  styleUrl: './treeMultiselect.component.css',
   viewProviders: [ { provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class TreeMultiselectComponent {  currentLabel: string = ''
  currentFormControlName: string = ''
  currentPlaceHolder: string = ''
  currentControl!: FormControl<any>;
  currentValidations: validations[] = []
   @Input() multiChoose: boolean = true;

  ngOnChanges(): void {
    if (this.nodes_input) {
      console.log("nodes" , this.nodes_input());

      this.nodes = this.nodes_input();
    }
    if (this.label) {
      this.currentLabel = this.label();
    }
    if (this.placeholder) {
      this.currentPlaceHolder = this.placeholder();
    }
    if (this.control) {
      this.currentControl = this.control();
    }

    this.currentControl.valueChanges.subscribe((val: any) => {
      console.log("val" , val);
    });



    if (this.formControlNameInput) {
      this.currentFormControlName = this.formControlNameInput();
    }
    if (this.validations) {
      this.currentValidations = this.validations();
    }

  }
  nodes_input = input.required<any[]>();
    label = input<string |any>();
  placeholder = input<string |any>();
  control = input.required<AbstractControl |any>()
  validations = input<validations[] |any>()
  formControlNameInput = input.required<string | any>();

  nodes:any[] = [];
}

