import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslationsService } from '../services/translate.service';

export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  const translationService = inject(TranslationsService);
  const lang = translationService.getSelectedLanguage();

  const newReq = req.clone({
    setHeaders: {
      'Accept-Language': lang
    }
  });


  return next(newReq);
};




