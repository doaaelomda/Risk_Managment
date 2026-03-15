import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../shared/services/translation.service';
import { Router, RouterLinkWithHref } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLinkWithHref],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(
    private translationService: TranslationService,
    private authService: AuthService,
    private router: Router
  ) {
    const userData = JSON.parse(localStorage.getItem('userData')!)
    this.authService.userData.set(userData)
    const userLanguage: string =
      localStorage.getItem('user-language')?.toUpperCase() || 'EN';

    this.currentLang = userLanguage;
    effect(() => {
      console.log(this.authService.userData(),'this.authService.userData()');
      
      this.loggedIn = this.authService.userData()?.accessToken ? true : false;
    });
  }
  currentLang: string = 'EN';
  toggleLanguages() {
    const currentLang = this.translationService.getSelectedLanguage();

    if (currentLang === 'en') {
      this.translationService.setLanguage('ar');
    } else {
      this.translationService.setLanguage('en');
    }
  }

  loggedIn: boolean = false;
  logOut() {
    this.authService.userData.set({
      accessToken: null,
      expirationTime: null,
      email: null,
      id: null,
    });
    localStorage.removeItem('userData');
    this.router.navigate(['/']);
  }
}
