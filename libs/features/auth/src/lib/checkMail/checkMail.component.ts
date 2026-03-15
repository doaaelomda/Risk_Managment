import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PrimengModule } from '@gfw/primeng';
import { SteperComponent } from 'libs/shared/shared-ui/src/lib/steper/steper.component';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { InputOtpModule } from 'primeng/inputotp';

@Component({
  selector: 'lib-check-mail',
  imports: [CommonModule,FormsModule , ReactiveFormsModule,
  RouterLink,PrimengModule,SteperComponent,InputOtpModule
],
  templateUrl: './checkMail.component.html',
  styleUrl: './checkMail.component.css',
})
export class CheckMailComponent implements OnInit , OnDestroy {
    loginForm!: FormGroup;
    constructor(private _MessageService:MessageService,private _Router: Router, private _ActivatedRoute: ActivatedRoute , private _AuthService:AuthService) { }
current_user_email:any
ngOnInit(): void {
      this.initLoginForm()
      this._ActivatedRoute.queryParamMap.subscribe((res)=>{
      if(res.get('email')){
        this.current_user_email = res.get('email')
        this.startTimer()
      }else{
        this._Router.navigate(['/auth'])
      }
    })
  }
  initLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
    });
}



handlRouting(){
  this._Router.navigate(['/auth/setnewpass'],{
    queryParams:{
      email:this.current_user_email
    }
  })
}

  totalTime: number = 120;
  interval: any;
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


  resendCode(){
    this._AuthService.sendResetPasswordCode(this.current_user_email).subscribe({
      next:(res)=>{
        this._MessageService.add({severity:'success' , summary:'Success' , detail:"Code Resended Successfully Via Email "})
        this.startTimer()
      }
    })
  }


  ngOnDestroy(): void {
    clearInterval(this.interval)
  }
  onOtpInput(value: any) {
  localStorage.setItem('otp_code', value);
}
}
