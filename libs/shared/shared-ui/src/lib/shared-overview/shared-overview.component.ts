// eslint-disable-next-line @nx/enforce-module-boundaries
import { Nl2BrPipe } from './../../../../../../apps/gfw-portal/src/app/core/pipes/preLine.pipe';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SafeHtmlPipe } from './../../../../../../apps/gfw-portal/src/app/core/pipes/safeHtml.pipe';
/* eslint-disable @nx/enforce-module-boundaries */
import { TruncatePipe } from './../../../../../../apps/gfw-portal/src/app/core/pipes/truncate.pipe';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonModule } from "primeng/skeleton";
import { OwnerUserComponent } from '../ownerUser/ownerUser.component';

export interface OverviewEntry {
  key: string;
  label: string;
  type:
    | 'text'
    | 'date'
    | 'color'
    | 'boolean'
    | 'number'
    | 'user'
    | 'description'
    | 'badge'
    | 'role';
  colorKey?:string;
  role?:string;
  position?:string;
  image?:string;
  true_value?:string;
false_value?:string;
true_color?:string;
false_color?:string;
hasNoBorder?:boolean;
id?:any
}

@Component({
  selector: 'lib-shared-overview',
  standalone: true,
  imports: [CommonModule, TranslateModule, TruncatePipe, SkeletonModule,OwnerUserComponent,SafeHtmlPipe,Nl2BrPipe],
  templateUrl: './shared-overview.component.html',
  styleUrls: ['./shared-overview.component.scss'],
})
export class SharedOverviewComponent {
  @Input({ required: true }) entries: OverviewEntry[] = [];
  @Input({ required: true }) data: any;
  @Input() title: string = 'TABS.OVERVIEW';
  @Input({ required: true }) dataLoading: boolean = false;
  expandedMap: Record<string, boolean> = {};
  perRow: number = 2;
  ngOnInit() {
    this.handlePerRow();
  }



  handlePerRow() {
    let count = 0;
    for (const entry of this.entries) {
      if (entry.type !== 'description') {
        count++;
        if (count > 2) break;
      }
    }
    this.perRow = count > 2 ? 3 : 2;
  }

  toggleExpanded(key: string) {
    this.expandedMap[key] = !this.expandedMap[key];
  }

  isExpanded(key: string): boolean {
    return !!this.expandedMap[key];
  }
}
