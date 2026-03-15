import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLinkWithHref } from "@angular/router";

@Component({
  selector: 'app-notfound',
  imports: [CommonModule, TranslateModule, RouterLinkWithHref],
  templateUrl: './notfound.component.html',
  styleUrl: './notfound.component.scss',
})
export class NotfoundComponent {}
