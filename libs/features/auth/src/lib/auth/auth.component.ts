import { PrimengModule } from '@gfw/primeng';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LoginResponse } from '../../modals/loginResponse.interface';
import { LoginRequest } from '../../modals/loginRequest.interface';
@Component({
  selector: 'lib-auth',
  imports: [
    CommonModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    CarouselModule,
    TranslateModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit , OnDestroy {
  loadLogin = signal(false);
   subscription!: Subscription;
  constructor(
    private _AuthService: AuthService,
    private _Router: Router,
    private _MessageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initLoginForm();
  }

  loginForm!: FormGroup;

  initLoginForm() {
    this.loginForm = new FormGroup({
      userEmail: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  handleLogin() {
    this.loadLogin.set(true);
     const payload: LoginRequest = this.loginForm.value;
     this.subscription=this._AuthService.validateUserInfo(payload).subscribe({
      next: (res: LoginResponse) => {
        this.loadLogin.set(false);
        this._AuthService.current_user_id_validate.next(res?.data);
        this._AuthService.email.next(this.loginForm.get('userEmail')?.value);
        this._MessageService.add({
          severity: 'success',
          summary: 'Login Success',
          detail: 'Corrrect Credentails Verfiy OTP Please',
        });
        this._Router.navigate([`/auth/checkMail2fa`], {
          queryParams: {
            email: this.loginForm.get('userEmail')?.value,
          },
        });
      },
      error: () => {
        this.loadLogin.set(false);
      },
    });
  }

   ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
