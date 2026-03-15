import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
export interface Locale {
  lang: string;
  data: object;
}

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private langIds: string[] = [];
  private selectedLanguage!: string;
  selected_lan_sub: BehaviorSubject<string> = new BehaviorSubject<string>('en');
  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.translate.addLangs(['en', 'ar']);

    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('user-language');
      if (savedLang) {
        this.selectedLanguage = savedLang;
        this.translate.use(savedLang);
        this.selected_lan_sub.next(savedLang);
      }
    }
  }

  public loadTranslations(...args: Locale[]): void {
    const locales = [...args];

    locales.forEach((locale) => {
      this.translate.setTranslation(locale.lang, locale.data, true);
      this.langIds.push(locale.lang);
    });
    this.translate.addLangs(this.langIds);
  }

  public setLanguage(lang: string) {
    if (this.langIds.includes(lang)) {
      this.translate.use(lang);
      localStorage.setItem('user-language', lang);
      this.selectedLanguage = lang;

      window.location.reload();
    }
  }

  public getSelectedLanguage(): string {
    return (
      localStorage.getItem('user-language') || this.translate.getDefaultLang()
    );
  }

  public isLang(lang: string): boolean {
    this.selectedLanguage = this.getSelectedLanguage();
    if (this.selectedLanguage === lang) {
      return true;
    } else {
      return false;
    }
  }
}
