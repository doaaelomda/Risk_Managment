import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedTabsComponent } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { FactorsService } from 'libs/features/risks/src/services/factor-level.service';
import { Subscription } from 'rxjs';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-factor-over-view',
  imports: [ CommonModule,
    SkeletonModule,
    RouterOutlet,
    TranslateModule,
    SharedTabsComponent,],
  templateUrl: './factor-over-view.component.html',
  styleUrl: './factor-over-view.component.scss',
})
export class FactorOverViewComponent implements OnInit, OnDestroy {
  // Declaration Variables
  id: any;
  Data: any;
  isLoaded: boolean = false;
  showTabs: boolean = true;
  tabs:any[]=[]
  methodolgyId: any;
  private subscription: Subscription = new Subscription();

  // Declaration Constructor
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private __FactorService: FactorsService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _PermissionSystemService:PermissionSystemService
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
        this.tabs = [
      {
        id: 2,
        name: 'FACTOR_LEVEL.TABLE_TITLE',
        icon: 'fi fi-rr-sign-in-alt',
        router: 'factorsLevel',
        visible: ()=> this._PermissionSystemService.can('RISKS', 'METHODOLOGYFACTORLEVELS', 'VIEW')
      },]
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
