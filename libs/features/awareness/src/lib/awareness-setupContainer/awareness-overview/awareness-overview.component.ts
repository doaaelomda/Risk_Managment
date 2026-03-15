import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { AwarenessService } from '../../../services/awareness.service';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-awareness-overview',
  imports: [CommonModule, SkeletonModule, TranslateModule, OverlayPanelModule],
  templateUrl: './awareness-overview.component.html',
  styleUrl: './awareness-overview.component.scss',
})
export class AwarenessOverviewComponent {
  awarenessId: any;
  dataAwareness: any;
  loading: boolean = false;
  tabs: any;
  actions: any;
  safeMessage: SafeHtml = '';
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _AwarenessService: AwarenessService,
    private _router: Router,
    private sanitizer: DomSanitizer,
    public _PermissionSystemService:PermissionSystemService

  ) {
    this._ActivatedRoute.parent?.paramMap.subscribe((res) => {
      this.awarenessId = res.get('id');
      if (this.awarenessId) {
        this.loading = true;
        this._AwarenessService
          .getCampaignById(this.awarenessId)
          .subscribe((res: any) => {
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
              {
                name: this.dataAwareness?.name || '-',
                icon: '',
                routerLink: `/gfw-portal/awareness/compagine-setup/${this.awarenessId}/overview`,
              },
              {
                name: this._TranslateService.instant(
                  'AWARENESS.compaginesetup'
                ),
                icon: '',
              },
            ]);
          });
      }
      this.tabs = [
        (this.actions = [
          {
            label: this._TranslateService.instant('AWARENESS.UPDATE_CAMPAIGN'),
            icon: 'fi fi-rr-pencil',
            command: () => {
              this._router.navigate([
                `/gfw-portal/awareness/update-campaign/${this.awarenessId}`,
              ]);
            },
            visible: ()=> this._PermissionSystemService.can('AWARNESS' , 'CAMPAIGNS' , 'EDIT')

          },
        ]),
      ];
    });
  }
}
