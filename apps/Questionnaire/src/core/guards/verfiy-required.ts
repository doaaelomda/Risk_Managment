import { inject } from '@angular/core';
import { CanActivateFn , Router} from '@angular/router';

export const verfiyRequiredGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const accessKey = localStorage.getItem('accessKey');
  if(accessKey){
    return true;
  }else{
    router.navigate(['/access-denaid'])
    return false;
  }
};
