import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AwarenessService } from 'libs/features/awareness/src/services/awareness.service';
import { SystemActionsComponent } from "libs/shared/shared-ui/src/lib/system-actions/system-actions.component";

@Component({
  selector: 'lib-audience-view',
  imports: [CommonModule, SkeletonModule, TranslateModule, SystemActionsComponent],
  templateUrl: './audience-view.component.html',
  styleUrl: './audience-view.component.scss',
})
export class AudienceViewComponent {
  audienceId: any;
  dataAudience: any;
  loading: boolean = false;
  idAwarness:any
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _AwarenessService: AwarenessService
  ) {
    this._ActivatedRoute.parent?.paramMap.subscribe((res) => {
      this.audienceId = res.get('audienceId');
      this.idAwarness = res.get('id');
      if (this.audienceId) {
        this.loading = true;
        this._AwarenessService
          .getAduianceById(this.audienceId)
          .subscribe((res: any) => {
            this.dataAudience = res?.data;
            this.loading = false;

            this._LayoutService.breadCrumbLinks.next([
              { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
              {
                name: this._TranslateService.instant('AWARENESS.TITLE'),
                icon: '',
                routerLink: '/gfw-portal/awareness/campaign-list',
              },
              {
                name: this._TranslateService.instant('ADUIANCE.TITLE'),
                icon: '',
                routerLink: `/gfw-portal/awareness/compagine-setup/${this.idAwarness}/aduiance`,
              },
              {
                name: this.dataAudience?.campaignName,
                icon: '',
                routerLink: `/gfw-portal/awareness/compagine-setup/${this.idAwarness}/aduiance/${res?.data?.awarenessCampaignAudienceID}/overview`,
              },
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
