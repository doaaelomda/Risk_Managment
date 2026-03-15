/* eslint-disable @nx/enforce-module-boundaries */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Cards } from '../../models/cards.interface';
@Component({
  selector: 'app-welcome-page',
  imports: [CommonModule, RouterLinkWithHref, TranslateModule],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss',
})
export class WelcomePageComponent {
  constructor(private _translateService: TranslateService) {
    this.cards_section = [
      {
        id: 1,
        icon: 'fi fi-rr-building',
        title: this._translateService.instant(
          'QUESTIONNAIRE_INFO.CONDUCTED_BY'
        ),
        desc: this._translateService.instant('QUESTIONNAIRE_INFO.COMPANY_NAME'),
      },
      {
        id: 2,
        icon: 'fi fi-rr-alarm-clock',
        title: this._translateService.instant(
          'QUESTIONNAIRE_INFO.SUBMISSION_DATE'
        ),
        desc: this._translateService.instant('QUESTIONNAIRE_INFO.DEADLINE'),
      },
      {
        id: 3,
        icon: 'fi fi-rr-bullseye-arrow',
        title: this._translateService.instant(
          'QUESTIONNAIRE_INFO.PURPOSE_TITLE'
        ),
        desc: this._translateService.instant('QUESTIONNAIRE_INFO.PURPOSE_DESC'),
      },
    ];
  }

  cards_section: Cards[] = [];
}
