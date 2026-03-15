import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { TruncatePipe } from 'apps/gfw-portal/src/app/core/pipes/truncate.pipe';

@Component({
  selector: 'lib-shared-description',
  standalone: true,
  imports: [CommonModule, TranslateModule,TruncatePipe],
  templateUrl: './shared-description.component.html',
  styleUrl: './shared-description.component.scss',
})
export class SharedDescriptionComponent {
  @Input({ required: true }) description: string = '';
  @Input() textColorHex: string = '';

  expanded = false;

  toggleExpanded(): void {
    this.expanded = !this.expanded;
  }
}
