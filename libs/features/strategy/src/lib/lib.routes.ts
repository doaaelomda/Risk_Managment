// eslint-disable-next-line @nx/enforce-module-boundaries
import { PermissionGuard } from './../../../../../apps/gfw-portal/src/app/core/guards/permission.guard';
import { Route } from '@angular/router';

export const strategyRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'plans',
    pathMatch: 'full',
  },
  {
    path: 'master-data',
    // eslint-disable-next-line @nx/enforce-module-boundaries
    loadComponent: () =>
      // eslint-disable-next-line @nx/enforce-module-boundaries
      import(
        '../../../../shared/shared-ui/src/lib/lookup-ui/lookup-ui.component'
      ).then((c) => c.LookupUiComponent),
    data: {
      groupID: 10,
      listURL: 'strategy/plans',
      permissions: { module: 'STRATEGY', feature: 'MASTERDATA', action: 'VIEW' },
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'plans',
    loadComponent: () =>
      import('./strategy-plan-list/strategy-plan-list.component').then(
        (m) => m.StrategyPlanListComponent
      ),
    data: {
      permissions: { module: 'STRATEGY', feature: 'PLAN', action: 'VIEW' },
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'add-plan',
    loadComponent: () =>
      import('./strategy-plan-action/strategy-plan-action.component').then(
        (m) => m.StrategyPlanActionComponent
      ),
    data: {
      permissions: { module: 'STRATEGY', feature: 'PLAN', action: 'ADD' },
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'edit-plan/:id',
    loadComponent: () =>
      import('./strategy-plan-action/strategy-plan-action.component').then(
        (m) => m.StrategyPlanActionComponent
      ),
  },
  {
    path: 'plan/:planId',
    loadComponent: () =>
      import(
        './strategy-plan-viewContainer/strategy-plan-viewContainer.component'
      ).then((m) => m.StrategyPlanViewContainerComponent),
    data: {
      permissions: { module: 'STRATEGY', feature: 'PLAN', action: 'VIEW' },
    },
    canActivate: [PermissionGuard],
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './strategy-plan-viewContainer/strategy-plan-overview/strategy-plan-overview.component'
          ).then((m) => m.StrategyPlanOverviewComponent),
      },

      {
        path: 'focus',
        loadComponent: () =>
          import('./strategy-focus-area/strategy-focus-area.component').then(
            (m) => m.StrategyFocusAreaComponent
          ),
        data: {
          permissions: {
            module: 'STRATEGY',
            feature: 'FOCUSAREA',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },

      {
        path: 'focus/:focusId',
        data: {
          permissions: { module: 'STRATEGY', feature: 'FOCUS', action: 'VIEW' },
        },
        canActivate: [PermissionGuard],
        children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          {
            path: 'overview',
            loadComponent: () =>
              import(
                './strategy-plan-viewContainer/strategy-plan-overview/strategy-plan-overview.component'
              ).then((m) => m.StrategyPlanOverviewComponent),
          },
          {
            path: 'goals',
            loadComponent: () =>
              import('./strategy-goals/strategy-goals.component').then(
                (m) => m.StrategyGoalsComponent
              ),
            data: {
              permissions: {
                module: 'STRATEGY',
                feature: 'GOALS',
                action: 'VIEW',
              },
            },
            canActivate: [PermissionGuard],
          },
          {
            path: 'goal/:goalId',
            data: {
              permissions: {
                module: 'STRATEGY',
                feature: 'GOALS',
                action: 'VIEW',
              },
            },
            canActivate: [PermissionGuard],
            children: [
              { path: '', redirectTo: 'overview', pathMatch: 'full' },
              {
                path: 'overview',
                loadComponent: () =>
                  import(
                    './strategy-plan-viewContainer/strategy-plan-overview/strategy-plan-overview.component'
                  ).then((m) => m.StrategyPlanOverviewComponent),
              },
              {
                path: 'objectives',
                loadComponent: () =>
                  import(
                    './strategy-objective/strategy-objective.component'
                  ).then((m) => m.StrategyObjectiveComponent),
                data: {
                  permissions: {
                    module: 'STRATEGY',
                    feature: 'OBJECTVIE',
                    action: 'VIEW',
                  },
                },
                canActivate: [PermissionGuard],
              },
              {
                path: 'objective/:objectiveId',
                loadComponent: () =>
                  import(
                    './strategy-plan-viewContainer/strategy-plan-overview/strategy-plan-overview.component'
                  ).then((m) => m.StrategyPlanOverviewComponent),
                data: {
                  permissions: {
                    module: 'STRATEGY',
                    feature: 'OBJECTIVE',
                    action: 'VIEW',
                  },
                },
                canActivate: [PermissionGuard],
                children: [
                  { path: '', redirectTo: 'overview', pathMatch: 'full' },
                  {
                    path: 'overview',
                    loadComponent: () =>
                      import(
                        './strategy-plan-viewContainer/strategy-plan-overview/strategy-plan-overview.component'
                      ).then((m) => m.StrategyPlanOverviewComponent),
                  },
                ],
              },
            ],
          },
          {
            path: 'objectives',
            loadComponent: () =>
              import('./strategy-objective/strategy-objective.component').then(
                (m) => m.StrategyObjectiveComponent
              ),
            data: {
              permissions: {
                module: 'STRATEGY',
                feature: 'OBJECTIVE',
                action: 'VIEW',
              },
            },
            canActivate: [PermissionGuard],
          },
          {
            path: 'objective/:objectiveId',
            loadComponent: () =>
              import(
                './strategy-plan-viewContainer/strategy-plan-overview/strategy-plan-overview.component'
              ).then((m) => m.StrategyPlanOverviewComponent),
            children: [
              { path: '', redirectTo: 'overview', pathMatch: 'full' },
              {
                path: 'overview',
                loadComponent: () =>
                  import(
                    './strategy-plan-viewContainer/strategy-plan-overview/strategy-plan-overview.component'
                  ).then((m) => m.StrategyPlanOverviewComponent),
              },
            ],
          },
        ],
      },

      {
        path: 'goals',
        loadComponent: () =>
          import('./strategy-goals/strategy-goals.component').then(
            (m) => m.StrategyGoalsComponent
          ),
        data: {
          permissions: { module: 'STRATEGY', feature: 'GOALS', action: 'VIEW' },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'goal/:goalId',
        data: {
          permissions: { module: 'STRATEGY', feature: 'GOALS', action: 'VIEW' },
        },
        canActivate: [PermissionGuard],
        children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          {
            path: 'overview',
            loadComponent: () =>
              import(
                './strategy-plan-viewContainer/strategy-plan-overview/strategy-plan-overview.component'
              ).then((m) => m.StrategyPlanOverviewComponent),
          },
          {
            path: 'objectives',
            loadComponent: () =>
              import('./strategy-objective/strategy-objective.component').then(
                (m) => m.StrategyObjectiveComponent
              ),
            data: {
              permissions: {
                module: 'STRATEGY',
                feature: 'OBJECTIVE',
                action: 'VIEW',
              },
            },
            canActivate: [PermissionGuard],
          },
          {
            path: 'objective/:objectiveId',
            loadComponent: () =>
              import(
                './strategy-plan-viewContainer/strategy-plan-overview/strategy-plan-overview.component'
              ).then((m) => m.StrategyPlanOverviewComponent),
            data: {
              permissions: {
                module: 'STRATEGY',
                feature: 'OBJECTIVE',
                action: 'VIEW',
              },
            },
            canActivate: [PermissionGuard],
            children: [
              { path: '', redirectTo: 'overview', pathMatch: 'full' },
              {
                path: 'overview',
                loadComponent: () =>
                  import(
                    './strategy-plan-viewContainer/strategy-plan-overview/strategy-plan-overview.component'
                  ).then((m) => m.StrategyPlanOverviewComponent),
              },
            ],
          },
        ],
      },

      {
        path: 'objectives',
        loadComponent: () =>
          import('./strategy-objective/strategy-objective.component').then(
            (m) => m.StrategyObjectiveComponent
          ),
        data: {
          permissions: {
            module: 'STRATEGY',
            feature: 'OBJECTIVE',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'objective/:objectiveId',
        data: {
          permissions: {
            module: 'STRATEGY',
            feature: 'OBJECTIVE',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
        children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          {
            path: 'overview',
            loadComponent: () =>
              import(
                './strategy-plan-viewContainer/strategy-plan-overview/strategy-plan-overview.component'
              ).then((m) => m.StrategyPlanOverviewComponent),
          },
        ],
      },
    ],
  },
];
