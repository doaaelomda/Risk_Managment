import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedTabsComponent } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { Subscription } from 'rxjs';
import { EffectivenessFormulaService } from 'libs/features/risks/src/services/effectiveness-formula.service';
import { MethodologyLevelsService } from 'libs/features/risks/src/services/methodology-levels.service';
@Component({
  selector: 'lib-effectiveness-formula-overview',
  imports: [    CommonModule,
    SkeletonModule,
    RouterOutlet,
    TranslateModule,
    SharedTabsComponent,],
  templateUrl: './effectiveness-formula-overview.component.html',
  styleUrl: './effectiveness-formula-overview.component.scss',
})
export class EffectivenessFormulaOverviewComponent implements OnInit, OnDestroy {
  // Declaration Variables
  effectivenessId: any;
  Data: any;
  isLoaded: boolean = false;
  showTabs: boolean = true;
  methodolgyId: any;
  private subscription: Subscription = new Subscription();

  // Declaration Constructor
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _methodologyService: MethodologyLevelsService,
    private EffectivenessFormulaService: EffectivenessFormulaService,
  ) {}

  // Get Data
  getData() {
    this._ActivatedRoute.paramMap.subscribe((res: any) => {
      this.effectivenessId = res.get('effectivenessId');
      this.methodolgyId = res.get('methodolgyId');
      this.isLoaded = true;
      if (this.methodolgyId) {
        const sub = this.EffectivenessFormulaService
          .getById(this.effectivenessId)
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
