import { CanActivateFn } from "@angular/router";
import { PermissionSystemService } from "../services/permission.service";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
export const PermissionGuard: CanActivateFn = (route, state) => {
  const _PermissionSystemService = inject(PermissionSystemService)
  const _Router = inject(Router)
  const routePermissions: any = route.data?.["permissions"]


  return _PermissionSystemService.can(routePermissions?.module , routePermissions?.feature , routePermissions?.action) ? true : _Router.navigate(['/access-deniad'])
}
