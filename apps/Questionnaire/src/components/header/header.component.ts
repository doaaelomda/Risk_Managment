import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationsService } from '../../core/services/translation.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(private TranslationsService: TranslationsService) {
    const userLanguage:string = localStorage.getItem('user-language')?.toUpperCase() || 'EN'

    this.currentLang = userLanguage;
  }
  currentLang: string = 'EN';
  toggleLanguages() {
    const currentLang = this.TranslationsService.getSelectedLanguage();

    if (currentLang === 'en') {
      this.TranslationsService.setLanguage('ar');
    } else {
      this.TranslationsService.setLanguage('en');
    }
  }
}
