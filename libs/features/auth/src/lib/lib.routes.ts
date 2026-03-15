import { Route } from '@angular/router';
export const authRoutes: Route[] = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {path:'login' , loadComponent:()=> import('./auth/auth.component').then(m=> m.AuthComponent)},
 {
    path: 'forgetpassword',
    loadComponent: () =>
      import('./forgerPassword/forgerPassword.component').then(
        (m) => m.ForgerPasswordComponent
      ),
  },

  {
    path: 'checkmail',
    loadComponent: () =>
      import('./checkMail/checkMail.component').then(
        (m) => m.CheckMailComponent
      ),
  }
  ,
   {
    path: 'setnewpass',
    loadComponent: () =>
      import('./setnewpass/setnewpass.component').then(
        (m) => m.SetnewpassComponent
      ),
  }

  ,
   {
    path: 'passwordreset',
    loadComponent: () =>
      import('./passwordreset/passwordreset.component').then(
        (m) => m.PasswordresetComponent
      ),
  }
  ,
   {
    path: 'checkMail2fa',
    loadComponent: () =>
      import('./check2FA/check2FA.component').then(
        (m) => m.Check2FAComponent
      ),
  }
    ,
   {
    path: 'code2fa',
    loadComponent: () =>
      import('./code2FA/code2FA.component').then(
        (m) => m.Code2FAComponent
      ),
  }
   ,
   {
    path: 'very2fa',
    loadComponent: () =>
      import('./emailverfiy2fa/emailverfiy2fa.component').then(
        (m) => m.Emailverfiy2faComponent
      ),
  }

];
