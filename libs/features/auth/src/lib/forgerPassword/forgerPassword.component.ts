import { SteperComponent } from './../../../../../shared/shared-ui/src/lib/steper/steper.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PrimengModule } from '@gfw/primeng';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

@Component({
  selector: 'lib-forger-password',
  imports: [
    CommonModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    SteperComponent,
    RouterLink,
  ],
  templateUrl: './forgerPassword.component.html',
  styleUrl: './forgerPassword.component.css',
})
export class ForgerPasswordComponent implements OnInit {
  Form!: FormGroup;
  loadSend: boolean = false;
  constructor(
    private _MessageService: MessageService,
    private _Router: Router,
    private _AuthService: AuthService
  ) { }
  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.Form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }
  sendmail() {
    this.loadSend = true;
    this._AuthService
      .sendResetPasswordCode(this.Form.get('email')?.value)
      .pipe(finalize(() => (this.loadSend = false)))
      .subscribe({
        next: () => {
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Verification Code Sended To Your Email Check IT!',
          });
          this._Router.navigate([`/auth/setnewpass`], {
            queryParams: {
              email: this.Form.get('email')?.value,
            },
          });
        },
      });
  }
}
