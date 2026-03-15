// eslint-disable-next-line @nx/enforce-module-boundaries
import { PermissionGuard } from './../../../../../apps/gfw-portal/src/app/core/guards/permission.guard';
/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from '@angular/router';

export const bPMRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path:'dashboard',
    loadComponent:()=> import('../../../dashboard/src/lib/dashboard/dashboard.component').then(c => c.DashboardComponent),
    data:{
      id:5
    }
  },
     {
    path:'master-data',
    // eslint-disable-next-line @nx/enforce-module-boundaries
    loadComponent:()=> import('../../../../shared/shared-ui/src/lib/lookup-ui/lookup-ui.component').then(c => c.LookupUiComponent),
    data:{
      groupID:13,
      listURL:'BPM/process-list',
        permissions: { module: 'BPM', feature: "MASTERDATA",action:'VIEW' }
    },
    canActivate: [PermissionGuard]
  },
  {
    path: 'process-list',
    loadComponent: () =>
      import('./process-list/process-list.component').then(
        (c) => c.ProcessListComponent
      ),
  },
  {
    path: 'add-process',
    loadComponent: () =>
      import('./process-action/process-action.component').then(
        (c) => c.ProcessActionComponent
      ),
  },
  {
    path: 'add-process/:processId',
    loadComponent: () =>
      import('./process-action/process-action.component').then(
        (c) => c.ProcessActionComponent
      ),
  },
  {
    path: 'viewProcess/:processId',
    loadComponent: () =>
      import('./overviewProcess/overviewProcess.component').then(
        (c) => c.OverviewProcessComponent
      ),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./overviewProcess/viewProcess/viewProcess.component').then(
            (m) => m.ViewProcessComponent
          ),
      },
      {
        path: 'procedure',
        loadComponent: () =>
          import(
            './overviewProcess/procedureList/procedureList.component'
          ).then((m) => m.ProcedureListComponent),
      },
      {
        path: 'comments',
        loadComponent: () =>
          import(
            './overviewProcess/commentProcess/commentProcess.component'
          ).then((m) => m.CommentProcessComponent),
      },
      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './overviewProcess/attachmentProcess/attachmentProcess.component'
          ).then((m) => m.AttachmentProcessComponent),
      },
    ],
  },


        {
        path: 'add-procedure/:processId',
        loadComponent: () =>
          import(
            './overviewProcess/procedureList/procedureAction/procedureAction.component'
          ).then((m) => m.ProcedureActionComponent),
      },
            {
        path: 'add-procedure/:processId/:procedureId',
        loadComponent: () =>
          import(
            './overviewProcess/procedureList/procedureAction/procedureAction.component'
          ).then((m) => m.ProcedureActionComponent),
      },
      {
        path: 'viewprocedure/:processId/:procedureId',
        loadComponent: () =>
          import(
            './overviewProcess/procedureList/overviewProceduce/overviewProcedure.component'
          ).then((c) => c.OverviewProcedureComponent),
        children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          {
            path: 'overview',
            loadComponent: () =>
              import(
                './overviewProcess/procedureList/overviewProceduce/viewProceduce/viewProcedure.component'
              ).then((m) => m.ViewProcedureComponent),
          },
          {
            path: 'comments',
            loadComponent: () =>
              import(
                './overviewProcess/procedureList/overviewProceduce/commentProceduce/commentProcedure.component'
              ).then((m) => m.CommentProcedureComponent),
          },
          {
            path: 'attachments',
            loadComponent: () =>
              import(
                './overviewProcess/procedureList/overviewProceduce/attachmentProceduce/attachmentProcedure.component'
              ).then((m) => m.AttachmentProcedureComponent),
          },
        ],
      },
];
