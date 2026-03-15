import { SystemActionsComponent } from './../../../../../../shared/shared-ui/src/lib/system-actions/system-actions.component';
import { OverviewEntry, SharedOverviewComponent } from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { AwarenessService } from '../../../services/awareness.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'lib-awarness-view',
  imports: [CommonModule,SkeletonModule,TranslateModule,SharedOverviewComponent,SystemActionsComponent],
  templateUrl: './awarness-view.component.html',
  styleUrl: './awarness-view.component.scss',
})
export class AwarnessViewComponent {
  awarenessId: any;
dataAwareness: any;
loading: boolean = false;
safeMessage: SafeHtml =''
entries: OverviewEntry[] = [
  { key: 'name', label: 'AWARENESS.NAME', type: 'text' },
  { key: 'campaignTypeName', label: 'AWARENESS.TYPE', type: 'text' },
  { key: 'campaignStatusName', label: 'AWARENESS.STATUS', type: 'text' },
  { key: 'startDate', label: 'AWARENESS.START_DATE', type: 'date' },
  { key: 'dueDate', label: 'AWARENESS.DUE_DATE', type: 'date' },
  { key: 'graceDays', label: 'AWARENESS.GRACE_DAYS', type: 'number' },
  { key: 'requireQuizPass', label: 'AWARENESS.REQUIRE_QUIZ_PASS', type: 'boolean' },
  { key: 'deliverySubject', label: 'AWARENESS.DELIVERY_SUBJECT', type: 'text' },
  { key: 'deliveryMessage', label: 'AWARENESS.DELIVERY_MESSAGE', type: 'description' }
];

constructor(
  private _ActivatedRoute: ActivatedRoute,
  private _LayoutService: LayoutService,
  private _TranslateService: TranslateService,
  private _AwarenessService: AwarenessService,
  private sanitizer: DomSanitizer
) {
  this._ActivatedRoute.parent?.paramMap.subscribe((res) => {
    this.awarenessId = res.get('id');
    if (this.awarenessId) {
      this.loading = true;
      this._AwarenessService.getCampaignById(this.awarenessId).subscribe((res: any) => {
        this.dataAwareness = res?.data;
        this.loading = false;
                    if (this.dataAwareness?.deliveryMessage) {
              this.safeMessage = this.sanitizer.bypassSecurityTrustHtml(
                this.dataAwareness.deliveryMessage
              );
            }
        this._LayoutService.breadCrumbLinks.next([
          { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
          {
            name: this._TranslateService.instant('AWARENESS.TITLE'),
            icon: '',
            routerLink: '/gfw-portal/awareness/campaign-list',
          },
          { name: this.dataAwareness?.name || '-', icon: '',routerLink:`/gfw-portal/awareness/campaign/${this.awarenessId}` },

        ]);
      });
    }
  });
}
    hasActions:boolean = true;
  onFoundAction(event:boolean){
    this.hasActions = event;
    console.log('hasActions', this.hasActions);
  }
}
