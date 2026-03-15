import { inject } from '@angular/core';
import { CanActivateFn , Router} from '@angular/router';
import { PermissionSystemService } from '../../services/permission.service';
export const authLoginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const permissionService = inject(PermissionSystemService)
  const userData = JSON.parse(`${localStorage.getItem('userData')}`);
  if(!userData){
    return true;
  }else{
    permissionService.setPermissions(userData?.permissions || []);
    router.navigate(['/gfw-portal/risks-management']);

    return false;
  }
};
