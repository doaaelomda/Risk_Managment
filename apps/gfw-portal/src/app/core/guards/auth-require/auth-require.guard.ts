import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionSystemService } from '../../services/permission.service';

export const authRequireGuard: CanActivateFn = (route, state) => {
   const router = inject(Router)
  const userData = JSON.parse(`${localStorage.getItem('userData')}`);
  const permissionService = inject(PermissionSystemService)
  if(userData){

    permissionService.setPermissions(userData?.permissions || []);
    return true;
  }else{
    router.navigate(['/auth'])
    return false;
  }
};
