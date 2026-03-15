import { Component, HostListener, input, OnChanges, output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'lib-attach-ui',
  imports: [CommonModule, TranslateModule],
  templateUrl: './attach-ui.component.html',
  styleUrl: './attach-ui.component.scss',
})
export class AttachUiComponent implements OnChanges {

  fileEventEmiter = output<File>();

  ngOnChanges(changes: SimpleChanges): void {
    this.ele_input = null;
    console.log("changes['is_disabled_input']?.currentValue" , changes['is_disabled_input']?.currentValue);

    this.is_disabled = changes['is_disabled_input']?.currentValue;
  }



  isLabelVisible = input<boolean>(false)

  ele_input: HTMLInputElement | null = null;
  is_disabled_input = input<boolean>()
  handleOpenUploadWindow() {
    this.ele_input = document.createElement('input');
    this.ele_input.type = 'file';

    this.ele_input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.handleFileSelected(file);
      }
      this.ele_input = null;
    };
    this.ele_input.click()

  }

  is_disabled = false;
    isDragOver = false;

  handleFileSelected(file: File) {
    console.log('Selected file:', file);
    this.ele_input = null;
    this.fileEventEmiter.emit(file);
  }

onDrop(event: DragEvent) {
  if(!this.is_disabled){
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    this.ele_input = null; // Reset input in case it was open
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.handleFileSelected(file);
    }
  }
}

  onDragOver(event: DragEvent) {
    if(this.is_disabled) return;
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    this.isDragOver = false;
    this.ele_input = null;
  }
}
