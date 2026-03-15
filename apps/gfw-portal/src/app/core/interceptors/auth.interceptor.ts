import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = JSON.parse(`${localStorage.getItem('userData')}`)?.accessToken;
    let newReq;

  if (token) {
    newReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(newReq);
  }else{
    return next(req);
  }
};
