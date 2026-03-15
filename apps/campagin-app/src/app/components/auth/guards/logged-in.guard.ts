import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loggedInGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const isBrowser = isPlatformBrowser(platformId);

  if (!isBrowser) return false;
  const userData = JSON.parse(localStorage.getItem('userData')!)
  const loggedIn = userData?.accessToken;
    console.log('loggedIn: ',loggedIn);

  if (!loggedIn) {
    router.navigate(['/auth']);
  }
  return true;
};
