import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-timeout-page',
  imports: [CommonModule,TranslateModule],
  templateUrl: './timeout-page.component.html',
  styleUrl: './timeout-page.component.scss',
})
export class TimeoutPageComponent {}
