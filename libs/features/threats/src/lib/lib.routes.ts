// eslint-disable-next-line @nx/enforce-module-boundaries
import { PermissionGuard } from './../../../../../apps/gfw-portal/src/app/core/guards/permission.guard';
import { Route } from '@angular/router';

export const threatsRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'list',
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
      groupID: 15,
      listURL: 'Threats-management/list',
      permissions: { module: 'THREATS', feature: 'MASTERDATA', action: 'VIEW' },
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./threadList/threadList.component').then(
        (c) => c.ThreadListComponent
      ),
    data: {
      permissions: { module: 'THREATS', feature: 'THREATS', action: 'VIEW' },
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'add',

    loadComponent: () =>
      import('./threadsAction/threadAction.component').then(
        (c) => c.ThreadActionComponent
      ),
    data: {
      permissions: { module: 'THREATS', feature: 'THREATS', action: 'ADD' },
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'update-threat/:id',

    loadComponent: () =>
      import('./threadsAction/threadAction.component').then(
        (c) => c.ThreadActionComponent
      ),
    data: {
      permissions: { module: 'THREATS', feature: 'THREATS', action: 'EDIT' },
    },
    canActivate: [PermissionGuard],
  },

  {
    path: ':id',
    loadComponent: () =>
      import('./overviewThreads/overviewThreads.component').then(
        (c) => c.OverviewThreadsComponent
      ),
    data: {
      permissions: { module: 'THREATS', feature: 'THREATS', action: 'VIEW' },
    },
    canActivate: [PermissionGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./overviewThreads/viewThreads/viewThreads.component').then(
            (c) => c.ViewThreadsComponent
          ),
        data: {
          permissions: {
            module: 'THREATS',
            feature: 'THREATS',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './overviewThreads/commentThreads/commentThreads.component'
          ).then((c) => c.CommentThreadsComponent),
        data: {
          permissions: {
            module: 'THREATS',
            feature: 'THREATS_COMMENT',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './overviewThreads/attachmentThreads/attachmentThreads.component'
          ).then((c) => c.AttachmentThreadsComponent),
        data: {
          permissions: {
            module: 'THREATS',
            feature: 'THREATS_ATTACHMENT',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
    ],
  },
];
