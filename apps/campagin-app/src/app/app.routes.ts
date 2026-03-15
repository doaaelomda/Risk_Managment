import { Route } from '@angular/router';
import { quizRoutes } from './routes/quiz.routes';
import { authRoutes } from './routes/auth.routes';
import { loggedOutGuard } from './components/auth/guards/logged-out.guard';
import { loggedInGuard } from './components/auth/guards/logged-in.guard';
export const appRoutes: Route[] = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', children: authRoutes ,canActivate:[loggedOutGuard]},
  { path: 'campaigns', children: quizRoutes,canActivate:[loggedInGuard] },

  {
    path: '**',
    loadComponent: () =>
      import('./components/notfound/notfound.component').then(
        (c) => c.NotfoundComponent
      ),
  },
];
