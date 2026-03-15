import { OverviewEntry, SharedOverviewComponent } from './../../../../../../shared/shared-ui/src/lib/shared-overview/shared-overview.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { ThreatService } from '../../../services/threat.service';
@Component({
  selector: 'lib-view-threads',
  imports: [CommonModule, SkeletonModule, TranslateModule,SharedOverviewComponent],
  templateUrl: './viewThreads.component.html',
  styleUrl: './viewThreads.component.scss',
})
export class ViewThreadsComponent {
  threatId: any;
  datathreat: any;
  loading: boolean = false;
  entries: OverviewEntry[] = [
  { key: 'name', label: 'THREAT.NAME', type: 'text' },
  { key: 'nameAr', label: 'THREAT.NAME_AR', type: 'text' },
  { key: 'threatCategoryTypeName', label: 'THREAT.CATEGORY', type: 'text' },
  { key: 'threatSourceReferenceTypeName', label: 'THREAT.SOURCE_REFERENCE_TYPE', type: 'text' },
  { key: 'sourceReference', label: 'THREAT.SOURCE_REFERENCE', type: 'text' },
  { key: 'discoveredDate', label: 'THREAT.DISCOVERED_DATE', type: 'date' },
  { key: 'lastSeenDate', label: 'THREAT.LAST_SEEN_DATE', type: 'date' },
  { key: 'dateIdentified', label: 'THREAT.DATE_IDENTIFIED', type: 'date' },
  { key: 'threatTypeName', label: 'THREAT.THREAT_TYPE', type: 'text' },
  { key: 'threatSourceTypeName', label: 'THREAT.THREAT_SOURCE_TYPE', type: 'text' },
  { key: 'threatStatusTypeName', label: 'THREAT.STATUS', type: 'badge' },
  { key: 'threatSeverityTypeName', label: 'THREAT.SEVERITY', type: 'text' },
  { key: 'isActive', label: 'THREAT.IS_ACTIVE', type: 'boolean' },
  { key: 'isGeneral', label: 'THREAT.IS_GENERAL', type: 'boolean' },
  { key: 'description', label: 'THREAT.DESCRIPTION', type: 'description' },
  { key: 'descriptionAr', label: 'THREAT.DESCRIPTION_AR', type: 'description' }
];

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _threatService: ThreatService
  ) {
    this._ActivatedRoute?.parent?.paramMap.subscribe((res) => {
      this.threatId = res.get('id');
      this.loading = true;
      this._threatService.getThreatById(this.threatId).subscribe((res: any) => {
        this.datathreat = res?.data;
        this.loading = false;
        if (this.threatId) {
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
            },
          ]);
        }
      });
    });
  }
}
