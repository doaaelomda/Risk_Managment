import { InputOtpModule } from 'primeng/inputotp';
import { Component, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import toasterHandler from '../../../shared/utils/toasterHandler';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-verify',
  imports: [CommonModule, TranslateModule, InputOtpModule, FormsModule, Button],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.scss',
})
export class VerifyComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    effect(() => {
      if (!this.authService.userData().email) {
        this.router.navigate(['/auth']);
      }
      this.email = this.authService.userData().email || '';
    });
    this.getUserId();
    this.language = localStorage.getItem('user-language') || 'en';
  }

  language: string = 'en';
  email: string = '';
  userId!: number;
  otp!: string;
  getUserId() {
    const id = this.route.snapshot.queryParamMap.get('user');
    if (!id) return;
    this.userId = +id;
  }
  ngOnInit() {
    this.initSteps();
  }
  initSteps() {
    this.steps = [
      {
        id: 1,
        title: this.translateService.instant('AUTH.GET_THE_CODE'),
        description: this.translateService.instant('AUTH.SECURE_CODE_DESC'),
      },
      {
        id: 2,
        title: this.translateService.instant('AUTH.VERIFY'),
        description: this.translateService.instant('AUTH.CHECK_INBOX_DESC'),
      },
      {
        id: 3,
        title: this.translateService.instant('AUTH.MISSION_DONE'),
        description: this.translateService.instant('AUTH.EXTRA_SAFE_DESC'),
      },
    ];
  }
  steps: { id: number; title: string; description: string }[] = [];
  activeStep: number = 1;
  verifing: boolean = false;
  verify() {
    this.verifing = true;
    if (!this.userId || !this.otp || !this.email) return;
    const paylod: { userId: number; otp: string } = {
      userId: this.userId,
      otp: this.otp,
    };
    this.authService
      .login(paylod)
      .pipe(finalize(() => (this.verifing = false)))
      .subscribe({
        next: (res) => {
          const { accessToken, expirationTime } = res.data;
          toasterHandler(
            this.messageService,
            'success',
            'Logged in successfully.'
          );

          const userData = {
            accessToken,
            expirationTime,
            email: this.email,
            id: this.userId,
          };
          this.authService.userData.set(userData);
          localStorage.setItem('userData', JSON.stringify(userData));
          this.setActiveStep(3);
        },
        error: (err) => {
          console.log(err, 'error verifing...');

          toasterHandler(
            this.messageService,
            'error',
            'The code you entered is incorrect. Please check it and try again.'
          );
        },
      });
  }
  setActiveStep(step: number) {
    this.activeStep = step;
  }
  backToLogin() {
    this.router.navigate(['/auth']);
  }
  continue() {
    this.router.navigate(['/campaigns']);
  }
}
