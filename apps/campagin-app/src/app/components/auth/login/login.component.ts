import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { finalize } from 'rxjs';
import toasterHandler from '../../../shared/utils/toasterHandler';
import { MessageService } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    TranslateModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  loginForm: FormGroup = new FormGroup({
    userEmail: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    rememberMe: new FormControl(false),
  });

  isLogging: boolean = false;
  login() {
    const { userEmail, password } = this.loginForm.value;
    if (!userEmail || !password) return;
    this.isLogging = true;
    this.authService
      .validate({ userEmail, password })
      .pipe(finalize(() => (this.isLogging = false)))
      .subscribe({
        next: (res) => {
          const userId = res.data;
          const userData = this.authService.userData()
          this.authService.userData.set({...userData, email:userEmail})
          this.router.navigate(['/auth/verify'], {
            queryParams: { user: userId },
          });
        },
        error: (err) => {
          const errMessage = err.error.errors.Error[0];

          toasterHandler(this.messageService, 'error', errMessage);
        },
      });

    //
  }
  forgotPassword() {
    console.log('forgotPassword');
    //
  }
}
