import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
export interface Locale {
  lang: string;
  data: object;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationsService {
  private langIds: any = [];
  private selectedLanguage!: string;
  selected_lan_sub :BehaviorSubject<string> = new BehaviorSubject<string>('en')
  constructor(private router:Router,private translate: TranslateService , @Inject(PLATFORM_ID) private platformId: object) {
    // get web client default language
    const defaultLang ='en'

    // add new langIds to the list
    this.translate.addLangs(['en', 'ar']);


    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('user-language');
      if (savedLang) {
        this.selectedLanguage = savedLang;
        this.translate.use(savedLang); // Switch to the saved language
        this.selected_lan_sub.next(savedLang);
      }
    }


  }

  public loadTranslations(...args: Locale[]): void {
    const locales = [...args];

    locales.forEach((locale) => {
      // use setTranslation() with the third argument set to true
      // to append translations instead of replacing them
      this.translate.setTranslation(locale.lang, locale.data, true);
      this.langIds.push(locale.lang);
    });

    // add new languages to the list
    this.translate.addLangs(this.langIds);
  }

public setLanguage(lang: string) {
    if (this.langIds.includes(lang)) {
      this.translate.use(lang); // Switch to the specified language
      localStorage.setItem('user-language', lang);
      this.selectedLanguage = lang;

      window.location.reload(); // Reload the page to apply the new language

    }
  }

  public getSelectedLanguage(): string {
    return (
      localStorage.getItem('user-language') || this.translate.getDefaultLang()
    );
  }

  public isLang(lang:string): boolean {
    this.selectedLanguage = this.getSelectedLanguage();
    if (this.selectedLanguage === lang) {
      return true;
    } else {
      return false;
    }
  }
}
