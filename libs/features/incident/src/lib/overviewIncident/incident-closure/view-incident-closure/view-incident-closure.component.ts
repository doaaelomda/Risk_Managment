import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ITabs,
  SharedTabsComponent,
} from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { MenuModule } from 'primeng/menu';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClosureService } from 'libs/features/incident/src/services/closure.service';
import { IncidentService } from 'libs/features/incident/src/services/incident.service';

@Component({
  selector: 'lib-view-incident-closure',
  imports: [CommonModule, SharedTabsComponent, MenuModule,TranslateModule],
  templateUrl: './view-incident-closure.component.html',
  styleUrl: './view-incident-closure.component.scss',
})
export class ViewIncidentClosureComponent {
  id?: string;
  data!: any;
  loadingData: boolean = false;

  featureKey: string = 'INCIDENT';
  featureName: string = 'ENTITY';
  entityRoute: string = '/path/to/entity';

  idParamKey: string = 'id';
  incidentData:any
  constructor(
    private _translateS: TranslateService,
    private _activatedRoute: ActivatedRoute,
    private layout: LayoutService,
    private service: ClosureService,
    private _incidentService: IncidentService
  ) {}

  ngOnInit() {
    this.initRouteParams();
  }

  ngOnDestroy() {
    this.service?.viewedData?.next(null);
  }

  private initRouteParams() {
    this._activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get(this.idParamKey) ?? undefined;

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
      this.getByIdincidenttes(res?.data?.incidentID);
      this.service.viewedData?.next(this.data);
      this.loadingData = false;
      this.initBreadcrumb();
    });
  }

   getByIdincidenttes(incidentID?:any) {
    this._incidentService
      .getIncidentById(incidentID)
      .subscribe((res: any) => {
        this.incidentData = res?.data;
      });
  }

  private initBreadcrumb(): void {
    const containerKey = `INCIDENT.incident`;
    const links: any[] = [
      { nameKey: containerKey, routerLink: this.entityRoute },
      { nameKey: 'INCIDENT.LIST_TITLE', routerLink: this.entityRoute },
      {
        nameKey: 'INCIDENT.CLOSURES_LIST',
        routerLink: `/gfw-portal/incident/viewincident/${this.data?.incidentID}/closure`,
      },
    ];

    links.push({ nameKey: this.data?.resolutionSummary || '-' });

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
