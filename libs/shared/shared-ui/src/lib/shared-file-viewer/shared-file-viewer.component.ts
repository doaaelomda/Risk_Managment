/* eslint-disable @nx/enforce-module-boundaries */
import { SecureResourcePipe } from 'apps/gfw-portal/src/app/core/pipes/secureResource.pipe';
import { IFile } from './../../../../../../apps/gfw-portal/src/app/core/models/file.interface';
import { Component, Input } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { DocsPreviewComponent } from '../docs-preview/docs-preview.component';
import { PdfPreviewComponent } from '../pdf-preview/pdf-preview.component';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { SecureImgDirective } from "apps/gfw-portal/src/app/core/directives/secure-img.directive";
@Component({
  selector: 'lib-shared-file-viewer',
  imports: [CommonModule, PdfPreviewComponent,
    DocsPreviewComponent, SecureImgDirective , SecureResourcePipe , AsyncPipe],
  templateUrl: './shared-file-viewer.component.html',
  styleUrl: './shared-file-viewer.component.scss',
})
export class SharedFileViewerComponent {
  env:any
  constructor(){
        this.env = enviroment.DOMAIN_URI;

  }
  @Input({required:true}) file!:IFile


}
