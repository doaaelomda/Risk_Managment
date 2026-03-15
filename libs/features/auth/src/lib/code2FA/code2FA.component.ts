import { PermissionSystemService } from './../../../../../../apps/gfw-portal/src/app/core/services/permission.service';
import { SteperComponent } from 'libs/shared/shared-ui/src/lib/steper/steper.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { InputOtpModule } from 'primeng/inputotp';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { switchMap } from 'rxjs';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'lib-code2-fa',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    SteperComponent,
    InputOtpModule,
    ButtonModule,
  ],
  templateUrl: './code2FA.component.html',
  styleUrl: './code2FA.component.css',
})
export class Code2FAComponent implements OnInit {
  value: string = '';
  Form!: FormGroup;
  current_user_id: string = '';
  current_user_email: string = '';
  loading: boolean = false;
  totalTime: number = 120;
  interval: any;
  canResend: boolean = false;
  minutes: number = 0;
  seconds: number = 0;
  stepsLabels = ['Get the Code ', 'Verify ', 'Mission Done '];
  stepslabelspara = [
    ' We’ll send a secure verification code to your email.',
    'Check your inbox, enter the code, and you’re in!,',
    'This keeps your account extra safe',
  ];
  constructor(
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _AuthService: AuthService,
    private _MessageService:MessageService,
    private _PermissionSystemService:PermissionSystemService
  ) {
    this._AuthService.current_user_id_validate.subscribe((res) => {
      if (res) {
        this.current_user_id = res;
      } else {
        this._Router.navigate(['/auth']);
      }
    });
  }
  ngOnInit(): void {
    this._ActivatedRoute.queryParamMap.subscribe((res) => {
      const email=res.get('email')
      if (email) {
        this.current_user_email =email;
        // this.startTimer();
      } else {
        this._Router.navigate(['/auth']);
      }
    });
  }

  maskEmail(email: string): string {
    if (!email) return '';

    const [name, domain] = email.split('@');
    if (!domain) return email;
    const visible = name.substring(0, 3);
    const masked = '*'.repeat(Math.max(name.length - 3, 0));

    return `${visible}${masked}@${domain}`;
  }
  isCodeComplete(): boolean {
    return this.value?.toString().length === 4;
  }

  handleVerfiy() {
    this.loading = true;

    const req = {
      userId: +this.current_user_id || 6,
      otp: this.value,
    };
    this._AuthService.login(req).subscribe({
      next: (res) => {
        console.log('res', res);
        localStorage.setItem('userData', JSON.stringify(res?.data));
        this._PermissionSystemService.setPermissions(res?.data?.permissions || []);
        this.loading = false;
        this._Router.navigate(['/auth/very2fa']);
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }
  ResendCode() {
    this._ActivatedRoute.queryParamMap.subscribe((params) => {
      const email = params.get('email');
      if (email) {
        this._Router.navigate(['/auth/checkMail2fa'], {
          queryParams: { email },
        });
        // this.startTimer();
      }
    });
  }
  startTimer() {
    this.canResend = false;
    this.totalTime = 120;
    this.updateTime();
    this.interval = setInterval(() => {
      if (this.totalTime > 0) {
        this.totalTime--;
        this.updateTime();
      } else {
        this.canResend = true;
        clearInterval(this.interval);
      }
    }, 1000);
  }

  updateTime() {
    this.minutes = Math.floor(this.totalTime / 60);
    this.seconds = this.totalTime % 60;
  }
}
