import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { GoveranceService } from '../../../service/goverance.service';
import { SharedTabsComponent } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { Observable } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'lib-control-assessment-view',
  imports: [CommonModule, SharedTabsComponent, RouterOutlet,TranslateModule,SkeletonModule],
  templateUrl: './control-assessment-view.component.html',
  styleUrl: './control-assessment-view.component.scss',
})
export class ControlAssessmentViewComponent {
  id?: string;
  data!: any;
  loadingData: boolean = false;

  featureKey: string = 'CONTROL_ASSESSMENT';
  featureName: string = 'CONTROL';
  entityRoute: string = '/path/to/entity';

  idParamKey: string = 'id';

  constructor(
    private _translateS: TranslateService,
    private _activatedRoute: ActivatedRoute,
    private layout: LayoutService,
    private service: GoveranceService
  ) {}
  ngOnInit() {
    this.initRouteParams();
  }

  ngOnDestroy() {
    this.service?.viewedData?.next(null);
  }

  private initRouteParams() {
    this._activatedRoute.paramMap.subscribe((params) => {
      console.log(params, 'params here');

      this.id = params.get(this.idParamKey) ?? undefined;
      const controlId = params.get('controlId');
      this.entityRoute = `/gfw-portal/governance/control-management/view/${controlId}/Controlassessment`;
      const type = params.get('type');
      if (!type) return;
      if (this.id) {
        this.loadEntityById(+this.id, type);
      }
    });
  }
  private loadEntityById(id: number, type: string) {
    this.loadingData = true;

    this.service.getControlById(id, type).subscribe({
      next: (res: any) => {
        this.data = res?.data ? res.data : res;
        this.service.viewedData?.next(this.data);
        this.initBreadcrumb();
      },
      error: (err: any) => console.error(err),
      complete: () => (this.loadingData = false),
    });
  }

  private initBreadcrumb(): void {
    const containerKey = `BREAD_CRUMB_TITLES.Governance`;
    const links: any[] = [
      {
        nameKey: containerKey,
        routerLink: '/gfw-portal/governance/control-management/list',
      },
      {
        nameKey: `BREAD_CRUMB_TITLES.Control_Management`,
        routerLink: '/gfw-portal/governance/control-management/list',
      },
      {
        nameKey: this.data?.govControlName || '-',
        routerLink: this.entityRoute,
      },
    ];

    this.setBreadcrumb(containerKey, links);
  }

  private setBreadcrumb(
    titleKey: string,
    links: { nameKey: string; icon?: string; routerLink?: string }[]
  ): void {
    this.layout.breadCrumbTitle.next(this._translateS.instant(titleKey));
    this.layout.breadCrumbLinks.next([
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      ...links.map((l) => ({
        name: this._translateS.instant(l.nameKey),
        icon: l.icon ?? '',
        ...(l.routerLink ? { routerLink: l.routerLink } : {}),
      })),
    ]);
    this.layout.breadCrumbAction.next(null);
  }
}
