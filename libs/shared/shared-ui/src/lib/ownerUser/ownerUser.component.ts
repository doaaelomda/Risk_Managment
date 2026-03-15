import { CommonModule } from '@angular/common';
import { Component, input, Input } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslateModule } from '@ngx-translate/core';
import { ImgSystemComponent } from '../img-system/img-system.component';

@Component({
  selector: 'lib-owner-user',
  standalone: true,
  imports: [CommonModule, SkeletonModule, TranslateModule, ImgSystemComponent],
  templateUrl: './ownerUser.component.html',
  styleUrls: ['./ownerUser.component.scss'],
})
export class OwnerUserComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() image?: string;
  @Input() roleOrUser?: string;
  @Input() loading: boolean = false;
  @Input() postionOwner?:string
  @Input() hasBorder:boolean = true
  userId = input<string>();
  isRole(): boolean {
    return !!this.roleOrUser && this.roleOrUser.toLowerCase().includes('role');
  }

  getDisplayImage(): string {
    return this.image || 'images/Avatar2.svg';
  }

  getDisplayText(): string {
    return this.postionOwner && this.postionOwner.trim() !== '' ? this.postionOwner : '-';
  }
}
