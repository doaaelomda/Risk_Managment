import { PdfPreviewComponent } from './../../../../../../../libs/shared/shared-ui/src/lib/pdf-preview/pdf-preview.component';
import { DocsPreviewComponent } from './../../../../../../../libs/shared/shared-ui/src/lib/docs-preview/docs-preview.component';
import { IFile } from '../../../types/file.interface';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { enviroment } from '../../../../../env/dev.env';

@Component({
  selector: 'lib-shared-file-viewer',
  imports: [CommonModule, PdfPreviewComponent, DocsPreviewComponent],
  templateUrl: './shared-file-viewer.component.html',
  styleUrl: './shared-file-viewer.component.scss',
})
export class SharedFileViewerComponent {
  env: any;
  constructor() {
    this.env = enviroment.DOMAIN_URI;
  }
  @Input() file!: IFile
}
