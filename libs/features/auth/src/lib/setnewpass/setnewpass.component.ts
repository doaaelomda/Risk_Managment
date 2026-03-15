import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PrimengModule } from '@gfw/primeng';
import { SteperComponent } from 'libs/shared/shared-ui/src/lib/steper/steper.component';
import { InputOtpModule } from "primeng/inputotp";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { passwordValidator } from '../../../../../../apps/gfw-portal/src/app/core/validations/passwordValidation';
import { AuthService } from '../../services/auth.service';
import { finalize, switchMap } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'lib-setnewpass',
  imports: [CommonModule, FormsModule, ReactiveFormsModule,
    RouterLink, PrimengModule, SteperComponent, InputOtpModule],
  templateUrl: './setnewpass.component.html',
  styleUrl: './setnewpass.component.css',
})
export class SetnewpassComponent implements OnInit {
  loginForm!: FormGroup;
  current_user_email!: string
  constructor(private _MessageService: MessageService, private _AuthService: AuthService, private _ActivatedRoute: ActivatedRoute, private _Router: Router) { }
  ngOnInit(): void {
    this.startTimer()
    this.initLoginForm()


    this._ActivatedRoute.queryParamMap.subscribe((res) => {
      const email = res.get('email')
      if (email) {
        this.current_user_email = email
      } else {
        this._Router.navigate(['/auth'])
      }
    })
  }




  OTPCode:string = ''
  initLoginForm() {
    this.loginForm = new FormGroup(
      {
        Password: new FormControl('', [Validators.required, passwordValidator]),
        ConfirmPassword: new FormControl('', [Validators.required]),
      },
      {
        validators: (group: AbstractControl): ValidationErrors | null => {
          const password = group.get('Password')?.value;
          const confirmPassword = group.get('ConfirmPassword')?.value;
          return password === confirmPassword ? null : { passwordsMismatch: true };
        },
      }


    );
  }

  loadReset: boolean = false;

  totalTime: number = 120;
  interval: number = 0;
  canResend: boolean = false;

  minutes: number = 0;
  seconds: number = 0;


  startTimer() {
    this.canResend = false;
    this.totalTime = 120;  // reset to 2 minutes

    this.updateTime(); // set initial minutes & seconds

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

  maskEmail(email: string): string {
    if (!email) return '';

    const [name, domain] = email.split('@');
    if (!domain) return email;
    const visible = name.substring(0, 3);
    const masked = '*'.repeat(Math.max(name.length - 3, 0));
    const domainParts = domain.split('.');
    const domainLast = domainParts[domainParts.length - 1];

    return `${visible}${masked}.${domainLast}`;
  }

  handleResetPassword() {
    if(this.loginForm.invalid || !this.OTPCode.length) return ;
    this.loadReset = true;
    const data = {
      "email": this.current_user_email,
      "code": this.OTPCode,
      "newPassword": this.loginForm.get('Password')?.value
    }


    this._AuthService.resetUserPassword(data).pipe(finalize(() => this.loadReset = false)).subscribe({
      next: () => {
        this._MessageService.add({ severity: 'success', summary: 'Success', detail: "Password Reseted Successfully!" });
        this._Router.navigate(['/auth/passwordreset'])
      }
    })
  }
  resendCode() {





    this._ActivatedRoute.queryParamMap.pipe(
      switchMap((params) => {
        const email = params.get('email') || '';
        return this._AuthService
       .sendResetPasswordCode(email)
      })
    ).subscribe({
      next:()=>{
        this._MessageService.add({severity:'success' , summary:'Success' , detail:"Code Resended Successfully "})
        this.startTimer()
      }
    })

  }
}
