/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  input,
  OnChanges,
  OnInit,
  output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { PdfPreviewComponent } from '../pdf-preview/pdf-preview.component';
import { DocsPreviewComponent } from '../docs-preview/docs-preview.component';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { ImgSystemComponent } from '../img-system/img-system.component';

@Component({
  selector: 'lib-view-attachement',
  imports: [
    CommonModule,
    DialogModule,
    TranslateModule,
    PdfPreviewComponent,
    DocsPreviewComponent,
    ButtonModule,
    ImgSystemComponent
  ],
  templateUrl: './view-attachement.component.html',
  styleUrl: './view-attachement.component.scss',
})
export class ViewAttachementComponent implements OnInit, OnChanges {
  modelVisibleEmiter = output<boolean>();
  selected_file_Input$ = input<any>();
  modelVisible = input<boolean>();
  displayModal: boolean = false;
  selected_file_show: any;
  env: any;
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

  ngOnInit(): void {
    this.env = enviroment.DOMAIN_URI;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selected_file_Input$']?.currentValue) {
      this.selected_file_show = changes['selected_file_Input$']?.currentValue;
    }

    this.displayModal = changes['modelVisible']?.currentValue;
  }

  getIcon(type: string) {
    return (
      this.iconMap[type?.replace('.', '').toLowerCase()] ||
      'images/iconFile.png'
    );
  }
}
