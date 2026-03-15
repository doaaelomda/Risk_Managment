import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VulnerabilityService } from 'libs/features/Vulnerability/src/services/vulnerability.service';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ActivatedRoute } from '@angular/router';
import { ThreatService } from '../../../services/threat.service';

@Component({
  selector: 'lib-comment-threads',
  imports: [CommonModule, CommentSectionComponent],
  templateUrl: './commentThreads.component.html',
  styleUrl: './commentThreads.component.scss',
})
export class CommentThreadsComponent {
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private threats: ThreatService
  ) {
    this._ActivatedRoute?.parent?.paramMap.subscribe((res) => {
      this.riskChildId = res.get('id');
      this.threats.getThreatById(this.riskChildId).subscribe((res: any) => {
        if (this.riskChildId) {
          this._LayoutService.breadCrumbLinks.next([
            {
              name: '',
              icon: 'fi fi-rs-home',
              routerLink: '/',
            },
            {
              name: this._TranslateService.instant('HEARDE_TABLE.THREATS'),
              icon: '',
              routerLink: '/gfw-portal/Threats-management/list',
            },
            {
              name: this._TranslateService.instant(
                'BREAD_CRUMB_TITLES.THREAT_LIST'
              ),
              icon: '',
              routerLink: '/gfw-portal/Threats-management/list',
            },

            {
              name: res?.data?.name || '-',
              icon: '',
              routerLink: `/gfw-portal/Threats-management/${this.riskChildId}/overview`,
            },
            {
              name: this._TranslateService.instant('TABS.COMMENTS'),
              icon: '',
            },
          ]);
        }
      });
    });
  }
  riskId = 1;
  riskChildId: any;
}
