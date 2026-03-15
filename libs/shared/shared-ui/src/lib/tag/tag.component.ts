import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-tag',
  imports: [CommonModule],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss',
})
export class TagComponent {
  @Input() beforeTag: any = '';
  @Input() tag: number | string = '';
  @Input() hasBullet: boolean = false;
  @Input() icon: string = '';
  @Input() theme: string = '';
  @Input() hasBackGround: boolean = true;
  @Input() hasBorder: boolean = false;
  @Input() iconPos: string = 'right';

  themeMap: Record<string, { bg: string; text: string; icon: string }> = {
    green: {
      bg: '#ECFDF3',
      text: '#027A48',
      icon: '#12B76A',
    },
    red: {
      bg: '#FEF3F2',
      text: '#B42318',
      icon: '#B42318',
    },
    brown: {
      bg: '#FFFAEB',
      text: '#B54708',
      icon: '#B54708',
    },
    gray: {
      bg: '#f2f4f7',
      text: '#475467',
      icon: '#475467',
    },
    orange: {
      bg: '#fef0c7',
      text: '#f79009',
      icon: '#f79009',
    },
    blue: {
      bg: '#d1e9ff',
      text: '#1570ef',
      icon: '#1570ef',
    },
    default: {
      bg: '#F0F9FF',
      text: '#1849AA',
      icon: '#1849AA',
    },
  };

  getTheme(theme: string) {
    return this.themeMap[theme] || this.themeMap['default'];
  }
}
