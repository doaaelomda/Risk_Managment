import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute,  RouterOutlet } from '@angular/router';
import { MethodologyImpactsService } from '../../../services/methodology-impacts.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SharedTabsComponent } from "libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component";

@Component({
  selector: 'lib-method-impacts-view',
  imports: [CommonModule, RouterOutlet, SharedTabsComponent],
  templateUrl: './method-impacts-view.component.html',
  styleUrl: './method-impacts-view.component.scss',
})
export class MethodImpactsViewComponent {
    constructor(
    private _translateS: TranslateService,
    private _activatedRoute: ActivatedRoute,
    private service: MethodologyImpactsService,
    private layout: LayoutService
  ) {}

  private initBreadcrumb(): void {
    const containerKey = 'BREAD_CRUMB_TITLES.METHODOLOGY';
    this.setBreadcrumb(containerKey, [
      { nameKey: containerKey },
      {
        nameKey: 'METHODOLOGY.METHODOLOGYS_LIST',
        routerLink: '/gfw-portal/risks-management/methodolgy/list',
      },
      {
        nameKey: this.data?.riskMethodologyName,
        routerLink: `/gfw-portal/risks-management/methodolgy/${this.data?.riskMethodologyID}`,
      },
      { nameKey: this.data?.name || '-' },
    ]);
  }

  private setBreadcrumb(
    titleKey: string,
    links: { nameKey: string; icon?: string; routerLink?: string }[]
  ): void {
    this.layout.breadCrumbTitle.next(this._translateS.instant(titleKey));
    const translatedLinks = [
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      ...links.map((link) => ({
        name: this._translateS.instant(link.nameKey),
        icon: link.icon ?? '',
        ...(link.routerLink ? { routerLink: link.routerLink } : {}),
      })),
    ];
    this.layout.breadCrumbLinks.next(translatedLinks);
    this.layout.breadCrumbAction.next(null);
  }
  ngOnInit() {
    this.getSectionId();
  }
  id: any = '';
  getSectionId() {
    this._activatedRoute.paramMap.subscribe((res: any) => {
      this.id = res.get('id');

      if (!this.id) return;
      this.getSectionById(this.id);
    });
  }

  loadingData: boolean = false;
  data!: any;
  getSectionById(id: string) {
    this.loadingData = true;
    this.service.getById(id).subscribe((res) => {
      const template_data = res?.data;
      this.data = template_data;
      this.service.viewedData.next(this.data)
      this.loadingData = false;
      this.initBreadcrumb();
      console.log(template_data, 'tdata');
    });
  }
  ngOnDestroy(){
    this.service.viewedData.next(null)
  }

}
