// eslint-disable-next-line @nx/enforce-module-boundaries
import { PermissionGuard } from './../../../../../apps/gfw-portal/src/app/core/guards/permission.guard';
/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from '@angular/router';

export const indicatorsRoutes: Route[] = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path:'dashboard',
    loadComponent:()=> import('../../../dashboard/src/lib/dashboard/dashboard.component').then(c => c.DashboardComponent),
    data:{
      id:7
    }
  },
 {
    path:'master-data',
    // eslint-disable-next-line @nx/enforce-module-boundaries
    loadComponent:()=> import('../../../../shared/shared-ui/src/lib/lookup-ui/lookup-ui.component').then(c => c.LookupUiComponent),
    data:{
      groupID:7,
      listURL:'indicators/KPI',
        permissions: { module: 'INDICATORS', feature: "MASTERDATA",action:'VIEW' }
    },
    canActivate: [PermissionGuard]
  },
  {
    path: 'KPI',
    loadComponent: () =>
      import('./indicators-list/indicators-list.component').then(
        (c) => c.IndicatorsListComponent
      ),
        data: {
          indicatorTypeID:1,
          routing:"KPI",
          permissions: { module: 'INDICATORS', feature: "INDICATORS",action:'VIEW' }

        },

  },
  {
    path: 'add',
    loadComponent: () =>
      import('./indicator-action/indicator-action.component').then(
        (c) => c.IndicatorActionComponent
      ),
  },
  {
    path: 'edit/:id/:routing',
    loadComponent: () =>
      import('./indicator-action/indicator-action.component').then(
        (c) => c.IndicatorActionComponent
      ),
  },
  {
    path: 'view/:id',
    loadComponent: () =>
      import(
        './OverViewMeasurment/indicator-measurment/indicator-measurment.component'
      ).then((c) => c.IndicatorMeasurmentComponent),
  },
  {
    path: 'setup/:module/:id',
    loadComponent: () =>
      import(
        './indicator-view-container/indicator-view-indicator.component'
      ).then((c) => c.IndicatorViewIndicatorComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './indicator-view-container/indicator-overview/indicator-overview.component'
          ).then((c) => c.IndicatorOverviewComponent),
      },
      {
        path: 'inputs',
        loadComponent: () =>
          import(
            './indicator-view-container/indicator-inputs/indicator-inputs.component'
          ).then((c) => c.IndicatorInputsComponent),
      },
      {
        path: 'formula',
        loadComponent: () =>
          import(
            './indicator-view-container/indicator-formula/indicator-formula.component'
          ).then((c) => c.IndicatorFormulaComponent),
      },
      {
        path: 'thresholdbland',
        loadComponent: () =>
          import(
            './indicator-view-container/indicator-thresholdbland/indicator-thresholdbland.component'
          ).then((c) => c.IndicatorThresholdblandComponent),
      },
    ],
  },
  {
    path: ':module/:id',
    loadComponent: () =>
      import('./OverViewMeasurment/OverViewMeasurment.component').then(
        (c) => c.OverViewMeasurmentComponent
      ),

    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import(
            './OverViewMeasurment/ViewMeasurment/ViewMeasurment.component'
          ).then((c) => c.ViewMeasurmentComponent),
      },

      {
        path: 'measurement-list',
        loadComponent: () =>
          import(
            './OverViewMeasurment/indicator-measurment/indicator-measurment.component'
          ).then((c) => c.IndicatorMeasurmentComponent),
      },

      {
        path: 'comments',
        loadComponent: () =>
          import(
            './OverViewMeasurment/commentMeasurment/commnetMeasurmnet.component'
          ).then((c) => c.CommnetMeasurmnetComponent),
      },

      {
        path: 'attachments',
        loadComponent: () =>
          import(
            './OverViewMeasurment/attachmentMeasurment/attachmentMeasurmnet.component'
          ).then((c) => c.AttachmentMeasurmnetComponent),
      },
    ],
  },
];
