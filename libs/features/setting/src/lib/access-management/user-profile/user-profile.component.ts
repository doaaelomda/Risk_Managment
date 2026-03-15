/* eslint-disable @nx/enforce-module-boundaries */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { UserProfileService } from '../../../services/user-profile.service';
import { finalize } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import {SecureImgDirective} from 'apps/gfw-portal/src/app/core/directives/secure-img.directive'
export interface IUser {
  id: number;
  name: string;
  nameAr: string;
  organizationalUnitName: string;
  discraption: string | null;
  isActive: boolean;
  position: string;
  positionAr: string;
  image: string | null;
  language: 'en' | 'ar';
}
@Component({
  selector: 'lib-user-profile',
  imports: [
    CommonModule,
    ButtonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    SkeletonModule,
    SecureImgDirective
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  constructor(
    private translateService: TranslateService,
    private userProfileService: UserProfileService,
    private messageService: MessageService
  ) {

    this.getUserData();
    // this.previewUrl = this.data.image;

    this.env = enviroment.DOMAIN_URI
  }

  env:any;
  data!: IUser;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  selectedFile!: File | null;
  previewUrl: string | null = null;
  fileError: string | null = null;
  MAX_FILE_SIZE = 5 * 1024 * 1024;
  handleFileUpload() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    this.processFile(input.files[0]);
  }
  isDragging: boolean = false;
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (!event.dataTransfer?.files?.length) return;

    const file = event.dataTransfer.files[0];
    this.processFile(file);
  }

  private processFile(file: File): void {
    this.fileError = null;

    if (file.size > this.MAX_FILE_SIZE) {
      this.fileError = this.translateService.instant('UPLOAD.MAX_SIZE_ERROR');
      this.selectedFile = null;
      this.previewUrl = this.data.image;
      this.fileInput.nativeElement.value = '';
      return;
    }

    this.selectedFile = file;

    console.log('Selected File:', file);

    if (this.previewUrl && this.previewUrl !== this.data.image) {
      URL.revokeObjectURL(this.previewUrl);
    }

    this.current_user_img = URL.createObjectURL(file);
  }
  loadingData: boolean = true;
  getUserData() {
    this.userProfileService
      .getUserData()
      .pipe(finalize(() => (this.loadingData = false)))
      .subscribe({
        next: (res: unknown) => {
          this.data = res as IUser;
              this.getUserImage();

        },
      });
  }
  uploadingImage: boolean = false;
  uploadImage(image: File) {
    this.uploadingImage = true;
    this.userProfileService
      .updateUserImage(image)
      .pipe(finalize(() => (this.uploadingImage = false)))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            detail: 'Image updated successfully.',
            summary: 'Success',
          });
          this.selectedFile = null;
          this.getUserImage();
        },
      });
  }
  handleUploadImage() {
    if (!this.selectedFile) return;
    this.uploadImage(this.selectedFile);
  }
  loadingImage: boolean = true;

  current_user_img:string=''
  getUserImage() {
    this.loadingImage = true
    this.current_user_img = 'http://yahyathafer-001-site1.qtempurl.com'+ `/uploads/users/${this.data.id}.png`;
    this.loadingImage = false;
  }
}
