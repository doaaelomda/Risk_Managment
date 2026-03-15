import { AfterViewInit, Component, ElementRef, input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { renderAsync } from 'docx-preview';


@Component({
  selector: 'lib-docs-preview',
  imports: [CommonModule],
  templateUrl: './docs-preview.component.html',
  styleUrl: './docs-preview.component.scss',
})
export class DocsPreviewComponent implements AfterViewInit{
    @ViewChild('container', { static: true }) container!: ElementRef;
  wordSrc = input<any>()
  async ngAfterViewInit() {

    if(this.wordSrc()){

      const response = await fetch(this.wordSrc() ?? '');
      const blob = await response.blob();
      renderAsync(blob, this.container.nativeElement);
    }
  }
}
