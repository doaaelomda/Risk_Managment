import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-bread-crumb',
  imports: [CommonModule,TranslateModule],
  templateUrl: './breadCrumb.component.html',
  styleUrl: './breadCrumb.component.scss',
})
export class BreadCrumbComponent {}
