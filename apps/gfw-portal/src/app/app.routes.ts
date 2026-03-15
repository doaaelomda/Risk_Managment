/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from '@angular/router';
import { IndexComponentComponent } from './IndexComponent/IndexComponent.component';
import { authRequireGuard } from './core/guards/auth-require/auth-require.guard';
import { authLoginGuard } from './core/guards/auth-login/auth-login.guard';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren:()=> import('@gwf/auth').then(m=> m.authRoutes),
    canActivate:[authLoginGuard]
  },
  {
    path: 'gfw-portal',
    component: IndexComponentComponent,
    // eslint-disable-next-line @nx/enforce-module-boundaries
    loadChildren:()=> import('@gfw/dashboard').then(m=> m.dashboardRoutes),
    canActivate:[authRequireGuard]
  },
  {
    path:'access-deniad',
    loadComponent:()=> import('../../../../libs/shared/shared-ui/src/lib/access-deniad/access-deniad.component').then(c => c.AccessDeniadComponent)
  }
];
