import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedTabsComponent } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { FactorsService } from 'libs/features/risks/src/services/factor-level.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lib-factor-level-overview',
  imports: [
    CommonModule,
    SkeletonModule,
    RouterOutlet,
    TranslateModule,
    SharedTabsComponent,
  ],

  templateUrl: './factor-level-overview.component.html',
  styleUrl: './factor-level-overview.component.scss',
})
export class FactorLevelOverviewComponent implements OnInit, OnDestroy {
  // Declaration Variables
  id: any;
  Data: any;
  isLoaded: boolean = false;
  showTabs: boolean = true;
  methodolgyId: any;
  private subscription: Subscription = new Subscription();

  // Declaration Constructor
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private __FactorService: FactorsService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService
  ) {}

  // Get Data
  getData() {
    this._ActivatedRoute.paramMap.subscribe((res: any) => {
      this.id = res.get('id');
      this.methodolgyId = res.get('methodolgyId');
      this.isLoaded = true;
      if (this.id) {
        const sub = this.__FactorService
          .getById(this.id)
          .subscribe((res: any) => {
            this.Data = res?.data;
            this.isLoaded = false;
          });
        this.subscription.add(sub);
      }
    });
  }
  // Life Cycle Hooks
  ngOnInit(): void {
    this.getData();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
