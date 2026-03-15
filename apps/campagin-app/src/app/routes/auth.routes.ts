import { Route } from '@angular/router';

export const authRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../components/auth/login/login.component').then(
        (c) => c.LoginComponent
      ),
  },
  {
    path: 'verify',
    loadComponent: () =>
      import('../components/auth/verify/verify.component').then(
        (c) => c.VerifyComponent
      ),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import(
        '../components/auth/forgot-password/forgot-password.component'
      ).then((c) => c.ForgotPasswordComponent),
  },
];
