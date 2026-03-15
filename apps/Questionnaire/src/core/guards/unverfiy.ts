import { inject } from '@angular/core';
import { CanActivateFn , Router} from '@angular/router';

export const unVerfiyed: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const userData = localStorage.getItem('accessKey');
  if(!userData){
    return true;
  }else{
    router.navigate(['/welcome'])
    return false;
  }
};
