import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
@Component({
  selector: 'lib-pdf-preview',
  imports: [CommonModule,PdfViewerModule],
  templateUrl: './pdf-preview.component.html',
  styleUrl: './pdf-preview.component.scss',
})
export class PdfPreviewComponent {
    pdfSrc = input<any>();

}
