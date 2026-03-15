import { Route } from '@angular/router';

export const quizRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('../components/quizzes/quizzes.component').then(
        (c) => c.QuizzesComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('../components/quizzes/quiz/quiz.component').then(
        (c) => c.QuizComponent
      ),
  },
];
