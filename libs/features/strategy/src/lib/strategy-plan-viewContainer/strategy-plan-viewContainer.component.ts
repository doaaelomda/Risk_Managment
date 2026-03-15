import { SharedTabsComponent } from './../../../../../shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import {
  filter,
  map,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { StrategyService } from 'libs/features/strategy/services/strategy.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-strategy-plan-view-container',
  imports: [
    CommonModule,
    SkeletonModule,
    RouterOutlet,
    SharedTabsComponent,
    TranslateModule
  ],
  templateUrl: './strategy-plan-viewContainer.component.html',
  styleUrl: './strategy-plan-viewContainer.component.scss',
})
export class StrategyPlanViewContainerComponent implements OnInit {
  constructor(
    private _TranslateService: TranslateService,
    private _activatedR: ActivatedRoute,
    private router: Router,
    private _LayoutService: LayoutService,
    private _strategyS: StrategyService,
    private _PermissionSystemService:PermissionSystemService
  ) {}
  loadData: boolean = false;
  private destroy$ = new Subject<void>();

  tabs: any[] = [];
  headTitle: any = '';
  ngOnInit(): void {
    this.handleTabs();
    this.handleBreadCrumb();
    this._strategyS.headTitle.subscribe((res) => {
      this.headTitle = res;
    });
  }
  data:any

  handleTabs() {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        startWith(null),
        takeUntil(this.destroy$),
        map(() => this.getAllRouteParams(this._activatedR))
      )
      .subscribe((params) => {
        const { planId, focusId, goalId, objectiveId } = params;

        const isInFocus = !!focusId;
        const isInGoals = !!goalId;
        const isInObjective = !!objectiveId;

        let baseRoute = `/gfw-portal/strategy/plan/${planId}`;
        if (isInFocus) baseRoute += `/focus/${focusId}`;
        if (isInGoals) baseRoute += `/goal/${goalId}`;
        if (isInObjective) baseRoute += `/objective/${objectiveId}`;

        const allTabs = [
          {
            id: 1,
            name: this._TranslateService.instant('TABS.OVERVIEW'),
            icon: 'fi-rr-apps',
            router: `${baseRoute}/overview`,
            key: 'overview',
            visible: ()=>this._PermissionSystemService.can('STRATEGY' , 'PLAN' , 'VIEW')
          },
          {
            id: 2,
            name: this._TranslateService.instant('TABS.FOCUS_AREA'),
            icon: 'fi fi-rr-target',
            router: `${baseRoute}/focus`,
            key: 'focus',
            visible: ()=>this._PermissionSystemService.can('STRATEGY' , 'FOCUSAREA' , 'VIEW')
          },
          {
            id: 3,
            name: this._TranslateService.instant('TABS.STRATEGY_GOALS'),
            icon: 'fi fi-sr-bullseye-arrow',
            router: `${baseRoute}/goals`,
            key: 'goals',
            visible: ()=>this._PermissionSystemService.can('STRATEGY' , 'GOALS' , 'VIEW')
          },
          {
            id: 4,
            name: this._TranslateService.instant('TABS.STRATEGY_OBJECTIVES'),
            icon: 'fi fi-rr-bullseye-pointer',
            router: `${baseRoute}/objectives`,
            key: 'objectives',
            visible: ()=>this._PermissionSystemService.can('STRATEGY' , 'OBJECTIVE' , 'VIEW')
          },
        ];
        let filteredTabs = allTabs;

        if (focusId && !goalId && !objectiveId) {
          filteredTabs = allTabs.filter((t) => t.key !== 'focus');
        } else if (goalId && !objectiveId) {
          filteredTabs = allTabs.filter(
            (t) => t.key !== 'goals' && t.key !== 'focus'
          );
        } else if (objectiveId) {
          filteredTabs = allTabs.filter(
            (t) =>
              t.key !== 'objectives' && t.key !== 'focus' && t.key !== 'goals'
          );
        }
        this.tabs = filteredTabs;
        this._strategyS.getPlanById(planId).subscribe((res?:any)=>{
          this.data=res?.data
        })
      });
  }

  getAllRouteParams(route: ActivatedRoute): { [key: string]: any } {
    let params: { [key: string]: any } = {};
    let currentRoute: ActivatedRoute | null = route.root;

    while (currentRoute) {
      params = { ...params, ...currentRoute.snapshot.params };
      currentRoute = currentRoute.firstChild;
    }

    return params;
  }

  handleBreadCrumb() {
    const { planId } = this.getAllRouteParams(this._activatedR);
    this.getDataById(planId);
  }

  getDataById(id: any) {
    this._LayoutService.breadCrumbLinks.next([
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      {
        name: this._TranslateService.instant('STRATEGY.STRATEGY'),
        icon: '',
        routerLink: '/gfw-portal/strategy',
      },
      {
        name: this._TranslateService.instant('STRATEGY.STRATEGY_PLANS'),
        icon: '',
        routerLink: '/gfw-portal/strategy/plans',
      },
    ]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
