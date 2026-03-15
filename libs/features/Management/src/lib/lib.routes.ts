// eslint-disable-next-line @nx/enforce-module-boundaries
import { PermissionGuard } from './../../../../../apps/gfw-portal/src/app/core/guards/permission.guard';
/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from '@angular/router';

export const managementRoutes: Route[] = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('../../../dashboard/src/lib/dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
    data: {
      id: 4,
    },
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./new-tasks/new-tasks.component').then(
        (c) => c.NewTasksComponent
      ),
    data: {
      permissions: { module: 'MANAGEMENT', feature: 'TASKS', action: 'VIEW' },
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'org-units',
    loadComponent: () =>
      import('./orgs-units/orgs-units.component').then(
        (c) => c.OrgsUnitsComponent
      ),
    data: {
      permissions: {
        module: 'ORGINAIZATION',
        feature: 'ORGINAIZATION',
        action: 'VIEW',
      },
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./projects-list/projects-list.component').then(
        (c) => c.ProjectsListComponent
      ),
    data: {
      permissions: {
        module: 'MANAGEMENT',
        feature: 'PROJECTS',
        action: 'VIEW',
      },
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'add-project',
    loadComponent: () =>
      import('./projects-action/projects-action.component').then(
        (c) => c.ProjectsActionComponent
      ),
    data: {
      permissions: { module: 'MANAGEMENT', feature: 'PROJECTS', action: 'ADD' },
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'edit-project/:id',
    loadComponent: () =>
      import('./projects-action/projects-action.component').then(
        (c) => c.ProjectsActionComponent
      ),
    data: {
      permissions: {
        module: 'MANAGEMENT',
        feature: 'PROJECTS',
        action: 'EDIT',
      },
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'initiatives',
    loadComponent: () =>
      import('./Initiatives-list/Initiatives-list.component').then(
        (c) => c.InitiativesListComponent
      ),
    data: {
      permissions: {
        module: 'MANAGEMENT',
        feature: 'INITIATIVE',
        action: 'VIEW',
      },
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'add-initiative',
    loadComponent: () =>
      import('./Initiatives-action/Initiatives-action.component').then(
        (c) => c.InitiativesActionComponent
      ),
    data: {
      permissions: {
        module: 'MANAGEMENT',
        feature: 'INITIATIVE',
        action: 'ADD',
      },
    },
    canActivate: [PermissionGuard],
  },

  {
    path: 'initiative/:id',
    loadComponent: () =>
      import(
        './Initiatives-list/overviewInitiatives/overViewInitiatives.component'
      ).then((c) => c.OverViewInitiativesComponent),
    data: {
      permissions: {
        module: 'MANAGEMENT',
        feature: 'INITIATIVE',
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
            './Initiatives-list/overviewInitiatives/viewInitiatives/ViewInitiatives.component'
          ).then((m) => m.ViewInitiativesComponent),
        data: {
          permissions: {
            module: 'MANAGEMENT',
            feature: 'INITIATIVE',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './Initiatives-list/overviewInitiatives/commentInitiatives/commentInitiatives.component'
          ).then((m) => m.CommentInitiativesComponent),
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './Initiatives-list/overviewInitiatives/attachmentInitiatives/attachmentInitiatives.component'
          ).then((m) => m.AttachmentInitiativesComponent),
      },
    ],
  },

  {
    path: 'add-initiative/:initiativeId',
    loadComponent: () =>
      import('./Initiatives-action/Initiatives-action.component').then(
        (c) => c.InitiativesActionComponent
      ),
    data: {
      permissions: {
        module: 'MANAGEMENT',
        feature: 'INITIATIVE',
        action: 'EDIT',
      },
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'project/:id',
    loadComponent: () =>
      import('./projects-list/overiewAssets/Overviewprojects.component').then(
        (c) => c.OverviewprojectsComponent
      ),
    data: {
      permissions: {
        module: 'MANAGEMENT',
        feature: 'PROJECTS',
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
            './projects-list/overiewAssets/viewprojects/viewprojects.component'
          ).then((m) => m.ViewprojectsComponent),
        data: {
          permissions: {
            module: 'MANAGEMENT',
            feature: 'PROJECTS',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './projects-list/overiewAssets/commentsprojects/commentsprojects.component'
          ).then((m) => m.CommentsprojectsComponent),
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './projects-list/overiewAssets/attachmentproject/attachmentproject.component'
          ).then((m) => m.AttachmentprojectsComponent),
      },
    ],
  },
];
