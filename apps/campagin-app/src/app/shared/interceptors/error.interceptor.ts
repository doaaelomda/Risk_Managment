import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import toasterHandler from '../utils/toasterHandler';
import { MessageService } from 'primeng/api';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const router = inject(Router);
  return next(req).pipe(
    tap((event: any) => {
      if (event.type === HttpEventType.Response && event.status === 200) {
        // success response
      }
    }),
    catchError((error) => {
      console.log('error interceptor ', error);
      const errors = error?.error?.errors;
      if (errors) {
        const keys = Object.keys(errors);

        for (let i = 0; i < keys.length; i++) {
          toasterHandler(messageService, 'error', errors[keys[i]][0]);
        }
      } else {
        toasterHandler(
          messageService,
          'error',
          error?.error?.error?.errorMessage
        );
      }

      if (error.status == 401) {
        localStorage.clear();
        router.navigate(['/']);
      }

      return throwError(() => error);
    })
  );
};
