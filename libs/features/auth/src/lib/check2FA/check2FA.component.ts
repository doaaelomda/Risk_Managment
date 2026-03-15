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
import { PrimengModule } from '@gfw/primeng';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SteperComponent } from 'libs/shared/shared-ui/src/lib/steper/steper.component';
@Component({
  selector: 'lib-check2-fa',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    PrimengModule,
    SteperComponent,
  ],
  templateUrl: './check2FA.component.html',
  styleUrl: './check2FA.component.css',
})
export class Check2FAComponent implements OnInit {
  Form!: FormGroup;
  current_user_id: string = '';
  current_user_email: string = '';
  email: string = '';
  stepsLabels = ['Get the Code ', 'Verify ', 'Mission Done '];
  stepslabelspara = [
    ' We’ll send a secure verification code to your email.',
    'Check your inbox, enter the code, and you’re in!,',
    'This keeps your account extra safe',
  ];
  constructor(
    private _AuthService: AuthService,
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute
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
      const email = res.get('email');
      if (email) {
        this.current_user_email = email;
      } else {
        this._Router.navigate(['/auth']);
      }
    });
    this.initialForm();
    this._AuthService.email.subscribe((res) => {
      this.email = res;
    });
  }
  initialForm() {
    this.Form = new FormGroup({
      email: new FormControl('', [Validators.required]),
    });
  }
  handleRouting() {
    localStorage.setItem('userEmail', this.current_user_email);
    this._Router.navigate(['/auth/code2fa'], {
      queryParams: {
        email: this.current_user_email,
      },
    });
  }
}
