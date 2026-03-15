import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loggedOutGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  const isBrowser = isPlatformBrowser(platformId);

  if (!isBrowser) return false;

  const userData = JSON.parse(localStorage.getItem('userData')!)
  const loggedOut = !userData?.accessToken;
  console.log('loggedOut: ',loggedOut);
  
  if (!loggedOut) {
    return router.navigate(['/campaigns']);
  }

  return true;
};
