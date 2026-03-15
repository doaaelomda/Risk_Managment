// eslint-disable-next-line @nx/enforce-module-boundaries
import { PermissionGuard } from './../../../../../apps/gfw-portal/src/app/core/guards/permission.guard';
import { Route } from '@angular/router';

export const meettingRoutes: Route[] = [
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
      groupID: 17,
      listURL: 'gfw-portal/meetings/master-data',
      permissions: { module: 'MEETING', feature: 'MASTERDATA', action: 'VIEW' },
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./meetings-list/meetings-list.component').then(
        (c) => c.MeetingsListComponent
      ),
    data: {
      permissions: { module: 'MEETING', feature: 'MEETING', action: 'VIEW' },
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./meetings-action/meetings-action.component').then(
        (c) => c.MeetingsActionComponent
      ),
    data: {
      permissions: { module: 'MEETING', feature: 'MEETING', action: 'ADD' },
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./meetings-action/meetings-action.component').then(
        (c) => c.MeetingsActionComponent
      ),
    data: {
      permissions: { module: 'MEETING', feature: 'MEETING', action: 'EDIT' },
    },
    canActivate: [PermissionGuard],
  },
  {
    path: 'view/:id',
    loadComponent: () =>
      import('./meeting-viewContainer/meeting-viewContainer.component').then(
        (c) => c.MeetingViewContainerComponent
      ),
    data: {
      permissions: { module: 'MEETING', feature: 'MEETING', action: 'VIEW' },
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
            './meeting-viewContainer/meeting-overview/meeting-overview.component'
          ).then((c) => c.MeetingOverviewComponent),
        data: {
          permissions: {
            module: 'MEETING',
            feature: 'MEETING',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'attendance',
        loadComponent: () =>
          import(
            './meeting-viewContainer/attendance-list/attendance-list.component'
          ).then((c) => c.AttendanceListComponent),
           data: {
          permissions: {
            module: 'MEETING',
            feature: 'MEETINGATTENDANCE',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'agenda',
        loadComponent: () =>
          import(
            './meeting-viewContainer/agenda-list/agenda-list.component'
          ).then((c) => c.AgendaListComponent),
           data: {
          permissions: {
            module: 'MEETING',
            feature: 'MEETINGAGENDA',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'minutes',
        loadComponent: () =>
          import(
            './meeting-viewContainer/minutes-list/minutes-list.component'
          ).then((c) => c.MinutesListComponent),
           data: {
          permissions: {
            module: 'MEETING',
            feature: 'MEETINGMINUTES',
            action: 'VIEW',
          },
        },
        canActivate: [PermissionGuard],
      },
    ],
  },
];
