import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { InvestigationService } from '../../../services/investigation.service';
import { SharedTabsComponent } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-view-investigation',
  imports: [CommonModule, RouterOutlet, SharedTabsComponent],
  templateUrl: './view-investigation.component.html',
  styleUrl: './view-investigation.component.scss',
})
export class ViewInvestigationComponent {
  id?: string;
  data!: any;
  loadingData: boolean = false;
  tabs: any[] = [];

  featureKey: string = 'INVESTIGATIONS';
  featureName: string = 'INVESTIGATION';
  entityRoute: string = '/path/to/entity';

  idParamKey: string = 'investigationId';

  constructor(
    private _translateS: TranslateService,
    private _activatedRoute: ActivatedRoute,
    private layout: LayoutService,
    private service: InvestigationService,
    private _PermissionSystemService: PermissionSystemService
  ) {}

  ngOnInit() {
    this.handleTabs();
    this.initRouteParams();
  }

  ngOnDestroy() {
    this.service?.viewedData?.next(null);
  }

  private initRouteParams() {
    this._activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get(this.idParamKey) ?? undefined;
      const incidentId = params.get('incidentId');
      this.entityRoute = `/gfw-portal/incident/viewincident/${incidentId}/investigations`;
      if (this.id) {
        this.loadEntityById(this.id);
      }
    });
  }

  private loadEntityById(id: string) {
    if (!this.service) return;

    this.loadingData = true;
    this.service.getById(id).subscribe((res: any) => {
      this.data = res?.data;
      this.service.viewedData?.next(this.data);
      this.loadingData = false;
      this.initBreadcrumb();
    });
  }

  private initBreadcrumb(): void {
    const containerKey = `BREAD_CRUMB_TITLES.${this.featureKey}`;
    const links: any[] = [
      { nameKey: containerKey, routerLink: this.entityRoute },
      {
        nameKey: `${this.featureKey}.${this.featureKey}_LIST`,
        routerLink: this.entityRoute,
      },
    ];

    if (this.data?.name) {
      links.push({ nameKey: this.data.name });
    }

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

  private handleTabs() {
    const defaultTabs = [
      {
        name: 'RooteCause.RooteCause',
        router: 'routeCause',
        icon: 'fi-rr-circle',
      },
    ];

    this.tabs = defaultTabs.map((tab, index) => ({
      id: index + 1,
      name: this._translateS.instant(tab.name),
      router: tab.router,
      icon: tab.icon,
      visible: () =>
        this._PermissionSystemService.can(
          'INCIDENT',
          'INCIDENTINVESTIGATIONS_ROOTCAUSE',
          'VIEW'
        ),
    }));
  }
}
