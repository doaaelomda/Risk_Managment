import { ToastModule } from 'primeng/toast';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TranslationsService } from '../core/services/translation.service';
import { arLang } from '../../public/i18n/ar';
import { enLang } from '../../public/i18n/en';
import { NgClass } from '@angular/common';
@Component({
  imports: [RouterModule, RouterOutlet, NgClass,ToastModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private _TranslationsService: TranslationsService
  ) {
    this._TranslationsService.loadTranslations(enLang, arLang);
    this.currentLang = localStorage.getItem('user-language') || 'en';
  }
  currentLang: string = 'en';

  title = 'Questionnaire';
}
