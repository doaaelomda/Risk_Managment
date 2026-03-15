import { arLang } from './../../public/i18n/ar';
import { enLang } from './../../public/i18n/en';
import { ToastModule } from 'primeng/toast';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/shared/header/header.component';
import { TranslationService } from './shared/services/translation.service';
import { CommonModule } from '@angular/common';

@Component({
  imports: [RouterModule, HeaderComponent, ToastModule, CommonModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    private translationService: TranslationService,
  ) {
    this.translationService.loadTranslations(enLang, arLang);
    this.language = this.translationService.getSelectedLanguage()
  }
  language!: string;
  title = 'campagin-app';
}
