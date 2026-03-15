import { Component, Input, input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeSelectModule } from 'primeng/treeselect';
import { AbstractControl, ControlContainer, FormControl, FormGroupDirective, FormsModule , NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { validations } from '../../models/validation.model';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'lib-tree-select-ui',
  imports: [CommonModule , TranslateModule,TreeSelectModule,ReactiveFormsModule,FormsModule],
  templateUrl: './tree-select-ui.component.html',
  styleUrl: './tree-select-ui.component.scss',
  viewProviders: [ { provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class TreeSelectUiComponent implements OnChanges{
    currentLabel: string = ''
  currentFormControlName: string = ''
  currentPlaceHolder: string = ''
  currentControl!: FormControl<any>;
  currentValidations: validations[] = []

  ngOnChanges(): void {
    if (this.nodes_input) {
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

  nodes:any[]=[{
    label: 'Documents',
    data: 'Documents Folder',
    children: [
        {
            label: 'Work',
            data: 'Work Folder',
            children: [
                {  label: 'Expenses.doc',  data: 'Expenses Document' },
                {  label: 'Resume.doc',  data: 'Resume Document' }
            ]
        },
        {
            label: 'Home',
            data: 'Home Folder',
            children: [{  label: 'Invoices.txt',  data: 'Invoices for this month' }]
        }
    ]
}]
}
