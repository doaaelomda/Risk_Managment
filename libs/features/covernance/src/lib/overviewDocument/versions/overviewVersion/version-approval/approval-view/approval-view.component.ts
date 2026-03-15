import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { VersionApprovalService } from 'libs/features/covernance/src/service/version-approval.service';
import { SharedTabsComponent } from "libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component";
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'lib-approval-view',
  imports: [CommonModule, RouterOutlet, SharedTabsComponent,TranslateModule,SkeletonModule],
  templateUrl: './approval-view.component.html',
  styleUrl: './approval-view.component.scss',
})
export class ApprovalViewComponent {
    id?: string;
  data!: any;
  loadingData: boolean = false;
  tabs: any[] = [];

  featureKey: string = 'VERSION';
  featureName: string = 'APPROVAL';
  entityRoute: string = '/path/to/entity';
  featureRoute:string = ''
  idParamKey: string = 'id';

  constructor(
    private _translateS: TranslateService,
    private _activatedRoute: ActivatedRoute,
    private layout: LayoutService,
    private service:VersionApprovalService
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
      const documentId = params.get('Docid')
      const versionId = params.get('versionId')
      this.featureRoute = `/gfw-portal/governance/Document-action/viewDocument/${documentId}/versions`

      this.entityRoute = `/gfw-portal/governance/viewDocument/${documentId}/versions/${versionId}/approval`
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

      if (this.data){this.initBreadcrumb(this.data.govDocumentVersionName);}
    });
  }

  private initBreadcrumb(name?:string): void {
    const containerKey = `TABS.${this.featureKey.toLowerCase()}s`;

    const links: any[] = [
      {nameKey:'BREAD_CRUMB_TITLES.GOVERNANCE_DOCUMENTS_LIST',routerLink:'/gfw-portal/governance/documents'},
      { nameKey: containerKey, routerLink: this.featureRoute },
      { nameKey: `${this.featureKey}.${this.featureName}S_LIST`, routerLink: this.entityRoute },
    ];


   links.push({ nameKey: name});

    this.setBreadcrumb(containerKey, links);
  }

 private setBreadcrumb(
  titleKey: string,
  links: { nameKey?: string; name?: string; icon?: string; routerLink?: string }[]
): void {
  this.layout.breadCrumbTitle.next(this._translateS.instant(titleKey));
  this.layout.breadCrumbLinks.next([
    { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
    ...links.map((l) => ({
      name: l.name ?? (l.nameKey ? this._translateS.instant(l.nameKey) : ''),
      icon: l.icon ?? '',
      ...(l.routerLink ? { routerLink: l.routerLink } : {})
    }))
  ]);

  this.layout.breadCrumbAction.next(null);
}

  private handleTabs() {
    const defaultTabs = [
      { name: 'TABS.OVERVIEW', router: 'overview', icon: 'fi-rr-apps' },
      { name: 'TABS.COMMENTS', router: 'comments', icon: 'fi-rr-comment' },
      { name: 'TABS.ATTACHMENTS', router: 'attachments', icon: 'fi-rr-clip' },
    ];

    this.tabs = defaultTabs.map((tab, index) => ({
      id: index + 1,
      name: this._translateS.instant(tab.name),
      router: tab.router,
      icon: tab.icon
    }));
  }

}
