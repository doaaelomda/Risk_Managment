import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { SharedTabsComponent } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { of, switchMap, tap } from 'rxjs';
import { EvidenceLibraryService } from '../services/evidence-libraray.service';

@Component({
  selector: 'lib-overview-evidence',
  imports: [CommonModule, RouterOutlet, SharedTabsComponent, SkeletonModule],
  templateUrl: './overview-evidence.component.html',
  styleUrl: './overview-evidence.component.scss',
})
export class OverviewEvidenceComponent {
  data: any;
  loading_data: boolean = true;
  breadCrumbLinks: any;
  id: any;
  constructor(
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _ActivatedRoute: ActivatedRoute,
    private EvidenceLibraryService: EvidenceLibraryService
  ) {
    this.getData();
  }

  handleBreadCrumb(name?: any) {
    this.breadCrumbLinks = [
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('HEARDE_TABLE.EVIDENCE_LIBRARY'),
        icon: '',
        routerLink: '/gfw-portal/library/evidence-library',
      },
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.EVIDENCE_LIBRARY_LIST'
        ),
        icon: '',
        routerLink: '/gfw-portal/library/evidence-library',
      },
      {
        name: `${name}`,
        icon: '',
      },
    ];
    this._LayoutService.breadCrumbLinks.next(this.breadCrumbLinks);
  }

  getData() {
    this._ActivatedRoute.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');
        if (id) {
          this.id = Number(id);
          this.EvidenceLibraryService.getEvidenceById(id).subscribe({
            next: (res: any) => {
              if (res?.data) {
                this.data = res.data;
                this.handleBreadCrumb(this.data?.name);
                this.loading_data = false;
              }
            },
            error: (err) => {
              console.error('Error fetching evidence data:', err);
            },
          });
        }
      },
      error: (err) => {
        console.error('Error fetching route params:', err);
      },
    });
  }
}
