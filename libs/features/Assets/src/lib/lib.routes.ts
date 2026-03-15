// eslint-disable-next-line @nx/enforce-module-boundaries
import { PermissionGuard } from './../../../../../apps/gfw-portal/src/app/core/guards/permission.guard';
import { Route } from '@angular/router';

export const assetsRoutes: Route[] = [
  {
    path: '', redirectTo: 'list', pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => import('./assets-list/assets.component').then(c => c.AssetsComponent)
  },
  {
    path: 'add',
    loadComponent: () => import('./asset-action/asset-action.component').then((c) => c.AssetActionComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./asset-action/asset-action.component').then((c) => c.AssetActionComponent)
  },

  {
    path: 'master-data',
    // eslint-disable-next-line @nx/enforce-module-boundaries
    loadComponent: () => import('../../../../shared/shared-ui/src/lib/lookup-ui/lookup-ui.component').then(c => c.LookupUiComponent),
    data: {
      groupID: 4,
      listURL: 'assets/list',
                       permissions: {
        module: 'ASSETS',
        feature: 'MASTERDATA',
        action: 'VIEW',
      },
    }
          , canActivate: [PermissionGuard],
  },

  {
    path: 'asset/:id',
    loadComponent: () =>
      import('./overiewAssets/OverviewAssets.component').then(
        (m) => m.OverviewAssetsComponent
      ),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {

        path: 'overview',
        loadComponent: () =>
          import('./overiewAssets/viewAssets/viewAssets.component').then(
            (m) => m.ViewAssetsComponent
          ),
      },
      {

        path: 'comments',
        loadComponent: () =>
          import('./overiewAssets/commentAssets/commentsAssets.component').then(
            (m) => m.CommentsAssetsComponent
          ),
      },
      {

        path: 'attachments',
        loadComponent: () =>
          import('./overiewAssets/attachmentAssets/attachmentAssets.component').then(
            (m) => m.AttachmentAssetsComponent
          ),
      },
    ]

  },
  {
    path:'categories',
    loadComponent:()=> import('./asset-categories/asset-categories.component').then(c => c.AssetCategoriesComponent)
  }
]
