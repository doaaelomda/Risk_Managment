import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SteperComponent } from 'libs/shared/shared-ui/src/lib/steper/steper.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-emailverfiy2fa',
  imports: [CommonModule, ButtonModule, SteperComponent, RouterLink],
  templateUrl: './emailverfiy2fa.component.html',
  styleUrl: './emailverfiy2fa.component.css',
})
export class Emailverfiy2faComponent {
  stepsLabels = ['Get the Code ', 'Verify ', 'Mission Done '];
  stepslabelspara = [
    ' We’ll send a secure verification code to your email.',
    'Check your inbox, enter the code, and you’re in!,',
    'This keeps your account extra safe',
  ];
}
