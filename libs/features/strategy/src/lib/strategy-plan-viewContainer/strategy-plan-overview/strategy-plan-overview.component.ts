import { color } from 'echarts';
import { SystemActionsComponent } from 'libs/shared/shared-ui/src/lib/system-actions/system-actions.component';
import {
  OverviewEntry,
  SharedOverviewComponent,
} from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { StrategyService } from 'libs/features/strategy/services/strategy.service';
import { forkJoin, of } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'lib-strategy-plan-overview',
  imports: [
    CommonModule,
    TranslateModule,
    SkeletonModule,
    SharedOverviewComponent,
    SystemActionsComponent,
  ],
  templateUrl: './strategy-plan-overview.component.html',
  styleUrl: './strategy-plan-overview.component.scss',
})
export class StrategyPlanOverviewComponent {
  constructor(
    private _activatedR: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _StrategyService: StrategyService,
    private router: Router
  ) {
    const url = this.router.url;
    console.log(url, 'url');

    if (!url) return;
    const urlArr = url.split('/');
    const path = urlArr[urlArr.length - 3];
    console.log(path, 'path');
    console.log(urlArr, 'urlArr');

    switch (path) {
      case 'focus':
        {
          this.entries = [
            { key: 'name', label: 'STRATEGY.NAME', type: 'text' },
            { key: 'nameAr', label: 'STRATEGY.NAME_AR', type: 'text' },
            {
              key: 'ownerRoleName',
              label: 'STRATEGY.OWNER_ROLE',
              type: 'role',
              id:'ownerRoleID'
            },
            {
              key: 'ownerRoleUserName',
              label: 'STRATEGY.OWNER_ROLE_USER',
              type: 'user',
            },
              { key: 'startDate', label: 'AWARENESS.START_DATE', type: 'date' },
  { key: 'endDate', label: 'PROJECT.END_DATE', type: 'date' },

            {
              key: 'strategicFocusAreaPriorityLevelTypeName',
              label: 'STRATEGY.PRIORITY',
              type: 'color',
              colorKey: 'strategicFocusAreaPriorityLevelTypeColor',
            },
            {
              key: 'strategicFocusAreaStatusTypeName',
              label: 'STRATEGY.STATUS',
              type: 'color',
              colorKey: 'strategicFocusAreaStatusTypeColor',
            },
            {
              key: 'description',
              label: 'STRATEGY.DESCRIPTION',
              type: 'description',
            },
            {
              key: 'descriptionAr',
              label: 'STRATEGY.DESCRIPTION_AR',
              type: 'description',
            },
          ];
        }
        break;
      case 'goal':
        {
          this.entries = [
            { key: 'name', label: 'STRATEGY.NAME', type: 'text' },
            { key: 'nameAr', label: 'STRATEGY.NAME_AR', type: 'text' },
            {
              key: 'ownerRoleName',
              label: 'STRATEGY.OWNER_ROLE',
              type: 'role',
              id:'ownerRoleID'
            },
            {
              key: 'ownerRoleUserName',
              label: 'STRATEGY.OWNER_ROLE_USER',
              type: 'user',
            },

            {
              key: 'strategicGoalPriorityLevelTypeName',
              label: 'STRATEGY.PRIORITY',
              type: 'color',
              colorKey: 'strategicGoalPriorityLevelTypeColor',
            },
            {
              key: 'strategicGoalStatusTypeName',
              label: 'STRATEGY.STATUS',
              type: 'color',
              colorKey: 'strategicGoalStatusTypeColor',
            },
            {
              key: 'importanceOrder',
              label: 'STRATEGY.IMPORTANCE_ORDER',
              type: 'number',
            },
            {
              key: 'description',
              label: 'STRATEGY.DESCRIPTION',
              type: 'description',
            },
            {
              key: 'descriptionAr',
              label: 'STRATEGY.DESCRIPTION_AR',
              type: 'description',
            },
          ];
        }
        break;
      case 'objective':
        {
          this.entries = [
            { key: 'name', label: 'STRATEGY.NAME', type: 'text' },
            { key: 'nameAr', label: 'STRATEGY.NAME_AR', type: 'text' },
            {
              key: 'ownerRoleName',
              label: 'STRATEGY.OWNER_ROLE',
              type: 'role',
              id:'ownerRoleID'
            },
            {
              key: 'ownerRoleUserName',
              label: 'STRATEGY.OWNER_ROLE_USER',
              type: 'user',
            },
            {
              key: 'organizationalUnitName',
              label: 'STRATEGY.ORGANIZATIONAL_UNIT',
              type: 'text',
            },
            {
              key: 'strategicThemeName',
              label: 'STRATEGY.THEME',
              type: 'text',
            },
            {
              key: 'strategicPerspectiveTypeName',
              label: 'STRATEGY.PERSPECTIVE',
              type: 'text',
            },
            { key: 'strategicPlanName', label: 'STRATEGY.PLAN', type: 'text' },
            {
              key: 'targetValue',
              label: 'STRATEGY.TARGET_VALUE',
              type: 'number',
            },
            {
              key: 'currentValue',
              label: 'STRATEGY.CURRENT_VALUE',
              type: 'number',
            },
            {
              key: 'achievementPercentage',
              label: 'STRATEGY.ACHIEVEMENT_PERCENTAGE',
              type: 'number',
            },
            {
              key: 'strategicObjectivePriorityLevelTypeName',
              label: 'STRATEGY.PRIORITY',
              type: 'color',
              colorKey: 'strategicObjectivePriorityLevelTypeColor',
            },
            {
              key: 'strategicObjectiveStatusTypeName',
              label: 'STRATEGY.STATUS',
              type: 'badge',
              colorKey: 'strategicObjectiveStatusTypeColor',
            },
            {
              key: 'importanceOrder',
              label: 'STRATEGY.IMPORTANCE_ORDER',
              type: 'number',
            },
            { key: 'startDate', label: 'STRATEGY.START_DATE', type: 'date' },
            { key: 'endDate', label: 'STRATEGY.END_DATE', type: 'date' },
            {
              key: 'color',
              label: 'STRATEGY.COLOR',
              type: 'badge',
              colorKey: 'color',
            },
            {
              key: 'description',
              label: 'STRATEGY.DESCRIPTION',
              type: 'description',
            },
            {
              key: 'descriptionAr',
              label: 'STRATEGY.DESCRIPTION_AR',
              type: 'description',
            },
          ];
        }
        break;
      default: {
        this.entries = [
          { key: 'name', label: 'STRATEGY.NAME', type: 'text' },
          { key: 'nameAr', label: 'STRATEGY.NAME_AR', type: 'text' },
          {
            key: 'ownerRoleName',
            label: 'STRATEGY.OWNER_ROLE',
            type: 'role',
            id:'ownerRoleID'
          },
          {
            key: 'strategicPlanPriorityLevelTypeName',
            label: 'STRATEGY.PRIORITY',
            type: 'color',
            colorKey: 'strategicPlanPriorityLevelTypeColor',
          },
          {
            key: 'strategicPlanStatusTypeName',
            label: 'STRATEGY.STATUS',
            type: 'badge',
            colorKey: 'strategicPlanStatusTypeColor',
          },
          {
            key: 'importanceOrder',
            label: 'STRATEGY.IMPORTANCE_ORDER',
            type: 'number',
          },
          { key: 'startDate', label: 'STRATEGY.START_DATE', type: 'date' },
          { key: 'endDate', label: 'STRATEGY.END_DATE', type: 'date' },
          {
            key: 'color',
            label: 'STRATEGY.COLOR',
            type: 'badge',
            colorKey: 'color',
          },
          {
            key: 'description',
            label: 'STRATEGY.DESCRIPTION',
            type: 'description',
          },
          {
            key: 'descriptionAr',
            label: 'STRATEGY.DESCRIPTION_AR',
            type: 'description',
          },
        ];
      }
    }
    console.log(path, 'path');
  }

  getLightColor(hex: string): string {
    if (!hex) return '#f5f5f5';
    hex = hex.replace('#', '');

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const lightenFactor = 0.95;

    const newR = Math.round(r + (255 - r) * lightenFactor);
    const newG = Math.round(g + (255 - g) * lightenFactor);
    const newB = Math.round(b + (255 - b) * lightenFactor);

    return `rgb(${newR}, ${newG}, ${newB})`;
  }
  entries: OverviewEntry[] = [];
  ngOnInit() {
    this.handleBreadCrumb();
  }
  getAllRouteParams(route: ActivatedRoute): { [key: string]: any } {
    let params: { [key: string]: any } = {};
    let currentRoute: ActivatedRoute | null = route.root;

    while (currentRoute) {
      params = {
        ...params,
        ...currentRoute.snapshot.params,
      };
      currentRoute = currentRoute.firstChild;
    }

    return params;
  }
  handleBreadCrumb() {
    const { planId, focusId, goalId, objectiveId } = this.getAllRouteParams(
      this._activatedR
    );
    this.getDataById(planId, focusId, goalId, objectiveId);
  }

  viewedData: any;
  isLoadingData: boolean = false;
  visibleFields: any;
  PlanStagyId: any;
  getDataById(planId: any, focusId: any, goalId: any, objectiveId: any) {
    const breadCrumb = [
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
    ];

    const plan$ = planId ? this._StrategyService.getPlanById(planId) : of(null);
    const focus$ = focusId
      ? this._StrategyService.getFocusById(focusId)
      : of(null);
    const goal$ = goalId ? this._StrategyService.getGoalById(goalId) : of(null);
    const objective$ = objectiveId
      ? this._StrategyService.getObjectiveById(objectiveId)
      : of(null);

    this.isLoadingData = true;
    this.PlanStagyId = planId;
    forkJoin([plan$, focus$, goal$, objective$]).subscribe(
      ([planRes, focusRes, goalRes, objectRes]) => {
        this.isLoadingData = false;

        if (planRes) {
          const name = planRes?.data?.name;
          breadCrumb.push({
            name: name || this._TranslateService.instant('STRATEGY.PLAN'),
            icon: '',
            routerLink: `/gfw-portal/strategy/plan/${planId}/overview`,
          });
          this.viewedData = planRes?.data;
          this.visibleFields = Object.keys(this.viewedData || {});
        }

        if (focusRes) {
          const name = focusRes?.data?.name;
          breadCrumb.push({
            name: name || this._TranslateService.instant('STRATEGY.FOCUS'),
            icon: '',
            routerLink: `/gfw-portal/strategy/plan/${planId}/focus/${focusId}/overview`,
          });
          this.viewedData = focusRes?.data;
          this.visibleFields = Object.keys(this.viewedData || {});
        }

        if (goalRes) {
          const name = goalRes?.data?.name;
          const url = focusId
            ? `/focus/${focusId}/goal/${goalId}/overview`
            : `/goal/${goalId}/overview`;

          breadCrumb.push({
            name: name || this._TranslateService.instant('STRATEGY.GOAL'),
            icon: '',
            routerLink: `/gfw-portal/strategy/plan/${planId}${url}`,
          });
          this.viewedData = goalRes?.data;
          this.visibleFields = Object.keys(this.viewedData || {});
        }

        if (objectRes) {
          const name = objectRes?.data?.name;

          breadCrumb.push({
            name: name || this._TranslateService.instant('STRATEGY.OBJECTIVE'),
            icon: '',
            routerLink: '',
          });
          this.viewedData = objectRes?.data;
          this.visibleFields = Object.keys(this.viewedData || {});
        }

        const index = breadCrumb?.length - 1;
        const headerTitle = breadCrumb[index]?.name;
        this._StrategyService.headTitle.next(headerTitle);

        this._LayoutService.breadCrumbLinks.next(breadCrumb);
      }
    );
  }
      hasActions:boolean = true;
  onFoundAction(event:boolean){
    this.hasActions = event;
    console.log('hasActions', this.hasActions);
  }
}
