import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-passwordreset',
  imports: [CommonModule,ButtonModule,RouterLink],
  templateUrl: './passwordreset.component.html',
  styleUrl: './passwordreset.component.css',
})
export class PasswordresetComponent {}
