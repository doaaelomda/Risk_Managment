/* eslint-disable @nx/enforce-module-boundaries */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule } from '@ngx-translate/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { TranslationsService } from 'apps/gfw-portal/src/app/core/services/translate.service';
import { SafeHtmlPipe } from "../../../../../../../apps/gfw-portal/src/app/core/pipes/safeHtml.pipe";

@Component({
  selector: 'lib-shared-workflow-view',
  imports: [CommonModule, DialogModule, TranslateModule, SafeHtmlPipe],
  templateUrl: './shared-workflow-view.component.html',
  styleUrl: './shared-workflow-view.component.scss',
})
export class SharedWorkflowViewComponent {
  constructor(private _TranslationsService: TranslationsService) {}
  @Input() title = '';
  @Input() desc = '';
  @Input() spanCols = '4'
  @Input() view_data: any[] = [];
  @Input() isViewing: boolean = false;
  @Output() isViewingChange = new EventEmitter<boolean>();

  updateTruncatedValue(item: any) {
    const value = item?.value || '';
    const plainText = value.replace(/<[^>]+>/g, '');
    return plainText.length > 100 ? plainText.slice(0, 100) + '...' : plainText;
  }
  toggleReadMore(item: any) {
    item.isDescExpanded = !item.isDescExpanded;
  }

  selectedLang = '';
  ngOnInit() {
    this.selectedLang = this._TranslationsService.getSelectedLanguage();
  }
}
