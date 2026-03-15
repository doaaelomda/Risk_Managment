import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'lib-file-card',
  imports: [CommonModule],
  templateUrl: './file-card.component.html',
  styleUrl: './file-card.component.scss',
})
export class FileCardComponent implements OnChanges {

  constructor(private _sharedServices: SharedService) {}

  @Input() file: any;
  @Output() action_emitter = new EventEmitter<{ action: string, file: any }>();
  dataFile:any
  ngOnChanges(changes: SimpleChanges) {
    if (changes['file'] && this.file) {
      this.getFile();
    }
  }

  handleAction(action: string) {
    this.action_emitter.emit({ action, file: this.file });
  }

  getFile() {
    this._sharedServices.getAttachmentById(this.file).subscribe((res: any) => {
      this.dataFile=res?.data
    });
  }
  iconMap: any = {
  pdf: 'images/Gradient - Full Width Label.svg',
  docx: 'images/wordfile.png',
  doc: 'images/wordfile.png',
  link: 'images/link-03.svg',
  xlsx: 'images/excelfile.png',
  xls: 'images/excelfile.png',
  png: 'images/png_images.png',
  jpeg: 'images/png_images.png',
  svg: 'images/svgFile.png',
  gif: 'images/gif.png',
  jpg: 'images/jpg.png',
};

get iconSrc() {
  const ext = this.dataFile?.fileExtension?.replace('.', '').toLowerCase();
  return this.iconMap[ext] || 'images/iconFile.png';
}

}
