// eslint-disable-next-line @nx/enforce-module-boundaries
import { PermissionGuard } from './../../../../../apps/gfw-portal/src/app/core/guards/permission.guard';
import { Route } from '@angular/router';

export const esclationRoutes: Route[] = [
  { path: '',redirectTo:"list" , pathMatch:'full'},
  {
    path:'list',
    loadComponent:()=> import('./esclation-list/esclation-list.component').then(c => c.EsclationListComponent)
  },
   {
    path:'master-data',
    // eslint-disable-next-line @nx/enforce-module-boundaries
    loadComponent:()=> import('../../../../shared/shared-ui/src/lib/lookup-ui/lookup-ui.component').then(c => c.LookupUiComponent),
    data:{
      groupID:8,
      listURL:'esclation/list'
    }
  },
  {
    path:'view/:id',
    loadComponent:()=> import('./esclattion-view-container/esclation-view-container.component').then(c=>c.EsclationViewContainerComponent),
    children:[
      {
        path:'',redirectTo:'overview',
        pathMatch:'full'
      },
      {
        path:'overview',
        loadComponent:()=>import('./esclattion-view-container/esclation-view/esclation-view.component').then(c => c.EsclationViewComponent),
        data:{
          permissions: { module: 'ESCLATIONS', feature: "ESCLATION", action: "VIEW" }
        },
        canActivate: [PermissionGuard]
      },
      {
        path:'esclation-levels',
        loadComponent:()=> import('./esclattion-view-container/esclation-levels/esclation-levels.component').then(c => c.EsclationLevelsComponent),
                data:{
          permissions: { module: 'ESCLATIONS', feature: "ESCLATIONLEVELS", action: "VIEW" }
        },
        canActivate: [PermissionGuard]
      },
      
        {
        path:'esclation-criteria/:levelId',
        loadComponent:()=> import('./esclattion-view-container/level-criteria/level-criteria.component').then(c => c.LevelCriteriaComponent),
                data:{
          permissions: { module: 'ESCLATIONS', feature: "ESCLATIONCRITERIA", action: "VIEW" }
        },
        canActivate: [PermissionGuard]
      },
      {
        path:'esclation-target/:levelId',
        loadComponent:()=> import('./esclattion-view-container/level-esclation-target/level-esclation-target.component').then(c => c.LevelEsclationTargetComponent),
                   data:{
          permissions: { module: 'ESCLATIONS', feature: "ESCLATIONTARGET", action: "VIEW" }
        },
        canActivate: [PermissionGuard]
      },
         {
        path:'esclation-notfications/:levelId',
        loadComponent:()=> import('./esclattion-view-container/level-esclation-notification/level-esclation-notification.component').then(c => c.LevelEsclationNotificationComponent),
                        data:{
          permissions: { module: 'ESCLATIONS', feature: "ESCLATIONNOTIFICATION", action: "VIEW" }
        },
        canActivate: [PermissionGuard]
      }
    ]
  }
];
