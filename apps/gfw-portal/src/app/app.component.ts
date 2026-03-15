import { arLang } from './../../public/i18n/ar';
import { enLang } from './../../public/i18n/en';
import { TranslationsService } from './core/services/translate.service';
import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent{
  constructor(private _TranslationsService:TranslationsService){
    this._TranslationsService.loadTranslations(enLang , arLang)
  }
  title = 'gfw-portal';

}
