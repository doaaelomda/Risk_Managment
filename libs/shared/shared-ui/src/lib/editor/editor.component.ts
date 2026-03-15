import { Component, Input, input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorModule } from 'primeng/editor';
import Quill from 'quill';

import {
  AbstractControl,
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { validations } from '../../models/validation.model';
@Component({
  selector: 'lib-editor',
  imports: [CommonModule, ReactiveFormsModule, EditorModule, TranslateModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class EditorComponent implements OnChanges {
  @Input() placeholder!:string
  controlNameInput = input.required<string>();
  currentControl!: AbstractControl;
  height=input<string>()
  control = input.required<AbstractControl>();
  controlName: string = '';
  currentValidations: validations[] = [];
  validations = input<validations[]>();
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['controlNameInput']?.currentValue) {
      this.controlName = changes['controlNameInput']?.currentValue;
    }

    if (changes['control']?.currentValue) {
      this.currentControl = changes['control']?.currentValue;
    }
    if (changes['validations']?.currentValue) {
      this.currentValidations = changes['validations']?.currentValue;
    }
  }

  editorModules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ['clean'],
        ['link', 'image'],
      ],
    },
  };

  quillInstance: any;

  onEditorCreated(event: any) {
    this.quillInstance = event?.editor;
  }

  customImageHandler() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      console.log('file uploaded ', file);

      if (file && this.quillInstance) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const range = this.quillInstance?.getSelection(true);
          this.quillInstance.insertEmbed(range.index, 'image', e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
  }


}
