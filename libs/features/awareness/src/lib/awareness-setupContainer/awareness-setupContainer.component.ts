import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-awareness-setup-container',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './awareness-setupContainer.component.html',
  styleUrl: './awareness-setupContainer.component.scss',
})
export class AwarenessSetupContainerComponent {
  awarenessId: any;
  constructor(
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _TranslateService: TranslateService,
    public _PermissionSystemService: PermissionSystemService
  ) {
    this._Router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const path = this.lastPathSegment;
        switch (path) {
          case 'overview':
            this.currentStep = 1;
            break;
          case 'aduiance':
            this.currentStep = 2;
            break;
          case 'messages':
            this.currentStep = 3;
            break;
          case 'contentFiles':
            this.currentStep = 4;
            break;
          case 'Quiz':
            this.currentStep = 5;
            break;
          default:
            break;
        }
      });
          this.filterStepsByPermission();

    this._ActivatedRoute.paramMap.subscribe((res) => {
      this.awarenessId = res.get('id');
    });
    this.steps = [
      {
        id: 1,
        name: this._TranslateService.instant('TABS.OVERVIEW'),
        icon: 'fi fi-rr-chart-line-up',
        command: () => {
          this._Router.navigate([
            '/gfw-portal/awareness/compagine-setup',
            this.awarenessId,
            'overview',
          ]);
        },
        visible: () =>
          this._PermissionSystemService.can(
            'AWARNESS',
            'CAMPAIGNSSETUP',
            'VIEW'
          ),
      },
      {
        id: 2,
        name: this._TranslateService.instant('ADUIANCE.TITLE'),
        icon: 'fi fi-rr-target-audience',
        command: () => {
          this._Router.navigate([
            '/gfw-portal/awareness/compagine-setup',
            this.awarenessId,
            'aduiance',
          ]);
        },
        visible: () =>
          this._PermissionSystemService.can(
            'AWARNESS',
            'CAMPAIGNSAUDIENCE',
            'VIEW'
          ),
      },
      {
        id: 3,
        name: this._TranslateService.instant('NOTIFICATION_SETTING.MESSAGES'),
        icon: 'fi fi-rr-messages',
        command: () => {
          //
          this._Router.navigate([
            '/gfw-portal/awareness/compagine-setup',
            this.awarenessId,
            'messages',
          ]);
        },
        visible: () =>
          this._PermissionSystemService.can(
            'AWARNESS',
            'CAMPAIGNSMESSAGE',
            'VIEW'
          ),
      },
      {
        id: 4,
        name: this._TranslateService.instant('ADUIANCE.CONNECTFILE'),
        icon: 'fi fi-rr-script',
        command: () => {
          this._Router.navigate([
            '/gfw-portal/awareness/compagine-setup',
            this.awarenessId,
            'contentFiles',
          ]);
        },
        visible: () =>
          this._PermissionSystemService.can(
            'AWARNESS',
            'CAMPAIGNSFILES',
            'VIEW'
          ),
      },
      {
        id: 5,
        name: this._TranslateService.instant('QUIZ.TITLE'),
        icon: 'fi fi-rr-question-square',
        command: () => {
          this._Router.navigate([
            '/gfw-portal/awareness/compagine-setup',
            this.awarenessId,
            'Quiz',
          ]);
        },
        visible: () =>
          this._PermissionSystemService.can(
            'AWARNESS',
            'CAMPAIGNSQUIZ',
            'VIEW'
          ),
      },
    ];
  }

  get lastPathSegment(): string {
    const segments = this._Router.url.split('/');
    return segments.pop() || '';
  }

  steps: any[] = [];

  currentStep: any = 1;

  filterStepsByPermission() {
    this.steps = this.steps.filter((step) => step.visible());
  }
  getVisibleCount(): number {
  return this.steps.filter(s => s.visible()).length;
}

getVisibleIndices(): number[] {
  return this.steps.map((s, i) => s.visible() ? i : -1).filter(i => i !== -1);
}
}
