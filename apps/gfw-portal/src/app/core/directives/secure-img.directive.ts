/* eslint-disable @angular-eslint/directive-selector */
import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Directive({
  selector: 'img[secureSrc]',
  standalone: true
})
export class SecureImgDirective implements OnChanges {

  @Input() secureSrc!: string;

  constructor(
    private el: ElementRef<HTMLImageElement>,
    private http: HttpClient
  ) {}

  ngOnChanges() {

    if (!this.secureSrc) return;

    this.http.get(this.secureSrc, { responseType: 'blob' })
      .subscribe(blob => {

        const objectURL = URL.createObjectURL(blob);

        this.el.nativeElement.src = objectURL;

      });

  }
}
