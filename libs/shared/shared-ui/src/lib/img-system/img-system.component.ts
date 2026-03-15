/* eslint-disable @nx/enforce-module-boundaries */
import { Component, effect, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgService } from '../../services/img-service.service';
import { SkeletonModule } from 'primeng/skeleton';

import { enviroment } from 'apps/gfw-portal/env/dev.env';
import {SecureImgDirective } from 'apps/gfw-portal/src/app/core/directives/secure-img.directive'
@Component({
  selector: 'lib-img-system',
  imports: [CommonModule,SecureImgDirective,SkeletonModule],
  templateUrl: './img-system.component.html',
  styleUrl: './img-system.component.scss',
})
export class ImgSystemComponent {
  data: any;
  isLoading = false;
  userId = input<any>();

  domain_uri = enviroment.DOMAIN_URI;

  constructor(private imgService: ImgService) {
    effect(() => {
      const id = this.userId();
      if (id) {
        this.getData(id);
      }
    });
  }
  getData(id: number) {
    this.isLoading = true;
    this.data = `${this.domain_uri}uploads/users/${id}.png`;
    this.isLoading = false;
  }
}
