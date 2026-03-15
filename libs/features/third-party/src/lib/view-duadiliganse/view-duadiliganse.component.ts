import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DuadiliganseService } from '../../services/duadiliganse.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SharedTabsComponent } from "libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component";

@Component({
  selector: 'lib-view-duadiliganse',
  imports: [CommonModule, RouterOutlet, SharedTabsComponent],
  templateUrl: './view-duadiliganse.component.html',
  styleUrl: './view-duadiliganse.component.scss',
})
export class ViewDuadiliganseComponent {
    constructor(
    private _translateS: TranslateService,
    private _activatedRoute: ActivatedRoute,
    private service: DuadiliganseService,
    private layout:LayoutService
  ) {}

    private initBreadcrumb(): void {
    const containerKey = 'BREAD_CRUMB_TITLES.THIRD_PARTY';
    this.setBreadcrumb(containerKey, [
      { nameKey: containerKey },
      { nameKey: 'DUE_DILIGENCES.DUE_DILIGENCES_LIST',routerLink:`/gfw-portal/third-party/view/${this.data.thirdPartyID}/due-diligence` },
      {nameKey:this.data?.name || '-'}
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
    this.handleTabs();
    this.getSectionId();
  }
  dueDiligenceId: string = '';
  getSectionId() {
    this._activatedRoute.paramMap.subscribe((res: any) => {
      this.dueDiligenceId = res.get('dueDiligenceId');
      if(!this.dueDiligenceId)return
      this.getSectionById(this.dueDiligenceId);
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
      this.initBreadcrumb()
      console.log(template_data, 'tdata');
    });
  }
  ngOnDestroy(){
          this.service.viewedData.next(null)

  }
  tabs: any[] = [];
  handleTabs() {
    this.tabs = [
      {
        id: 1,
        name: this._translateS.instant('TABS.OVERVIEW'),
        icon: 'fi-rr-apps',
        router: 'overview',
      },
      {
        id: 2,
        name: this._translateS.instant('TABS.COMMENTS'),
        icon: 'fi fi-rr-comment',
        router: 'comments',
      },
         {
        id: 3,
        name: this._translateS.instant('TABS.ATTACHMENTS'),
        icon: 'fi fi-rr-paperclip-vertical',
        router: 'attachments',
      },
    ];
  }

}

