import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  RouterOutlet,
} from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslateModule } from '@ngx-translate/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AwarenessService } from 'libs/features/awareness/src/services/awareness.service';
import { SharedTabsComponent } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';

@Component({
  selector: 'lib-audience-over-view',
  imports: [
    CommonModule,
    RouterOutlet,
    SkeletonModule,
    TranslateModule,
    SharedTabsComponent,
  ],
  templateUrl: './audience-overView.component.html',
  styleUrl: './audience-overView.component.scss',
})
export class AudienceOverViewComponent {
  breadCrumbLinks: any;
  loadDataAwarness: boolean = false;
  awarenessData: any;
  AwarrnessId: any;

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _AwarenessService: AwarenessService
  ) {
    this._ActivatedRoute.paramMap.subscribe((params) => {
      this.AwarrnessId = params.get('audienceId');
      if (this.AwarrnessId) {
        this.getByIdAwarrness();
      }
    });
  }

  getByIdAwarrness() {
    this.loadDataAwarness = true;
    this._AwarenessService
      .getAduianceById(this.AwarrnessId)
      .subscribe((res: any) => {
        this.awarenessData = res?.data;
        this.loadDataAwarness = false;
      });
  }
}
