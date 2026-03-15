import { Route } from '@angular/router';
import { verfiyRequiredGuard } from '../core/guards/verfiy-required';
import { unVerfiyed } from '../core/guards/unverfiy';

export const appRoutes: Route[] = [
  {
    path:'',
    redirectTo:'verify',
    pathMatch:'full'

  },
  {
    path:'verify',
    loadComponent:() => import('../pages/verify/verify.component').then(c => c.VerifyComponent),
    canActivate:[unVerfiyed]
  },
  {
    path:'welcome',
    loadComponent:()=> import('../pages/welcome-page/welcome-page.component').then(c => c.WelcomePageComponent),
    canActivate:[verfiyRequiredGuard]
  },
  {
    path:'time-out',
    loadComponent:()=> import('../pages/timeout-page/timeout-page.component').then(c => c.TimeoutPageComponent),
    canActivate:[verfiyRequiredGuard]
  },
  {
        path:'thanks',
    loadComponent:()=> import('../pages/thank-you/thank-you.component').then(c => c.ThankYouComponent),
    canActivate:[verfiyRequiredGuard]
  },
  {
    path:'Questionnaire',
    loadComponent:()=> import('../pages/questionnaire-main/questionnaire-main.component').then((c)=> c.QuestionnaireMainComponent),
    canActivate:[verfiyRequiredGuard]
  },
  {
    path:'access-denaid',
    loadComponent:()=> import('../pages/access-deniad/access-denaid.component').then((c)=> c.AccessDenaidComponent),
    canActivate:[unVerfiyed]
  }
];
