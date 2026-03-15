import { ITabs, SharedTabsComponent } from './../../../../../../../../../shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { VersionReviewsService } from 'libs/features/covernance/src/service/version-reviews.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-review-view',
  imports: [CommonModule, RouterOutlet,SharedTabsComponent],
  templateUrl: './review-view.component.html',
  styleUrl: './review-view.component.scss',
})
export class ReviewViewComponent {
      id?: string;
  data!: any;
  loadingData: boolean = false;
  tabs: ITabs[] = [];

  featureKey: string = 'VERSION';
  featureName: string = 'REVIEWS';
  entityRoute: string = '/path/to/entity';
  featureRoute:string = ''
  idParamKey: string = 'id';

  constructor(
    private _translateS: TranslateService,
    private _activatedRoute: ActivatedRoute,
    private layout: LayoutService,
    private service:VersionReviewsService,
    private _PermissionSystemService:PermissionSystemService
  ) {
    this.tabs = [{
      name: this._translateS.instant('TABS.REVIEW_COMMENTS'),
      router: 'review-comments',
      icon: 'fi fi-rr-feedback-alt',
      visible: ()=> this._PermissionSystemService.can('GOVERNANCE', 'COMMENTREVIEWS', 'VIEW')
    }]
  }

  ngOnInit() {
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

      this.entityRoute = `/gfw-portal/governance/viewDocument/${documentId}/versions/${versionId}/reviews`
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
    const containerKey = `TABS.${this.featureKey.toLowerCase()}s`;

    const links: any[] = [
      {nameKey:'BREAD_CRUMB_TITLES.GOVERNANCE_DOCUMENTS_LIST',routerLink:'/gfw-portal/governance/documents'},
      { nameKey: containerKey, routerLink: this.featureRoute },
      { nameKey: `${this.featureKey}.${this.featureName}_LIST`, routerLink: this.entityRoute },
    ];

   links.push({ nameKey: this.data.name  ||this.data.govDocumentVersionName || '-'});

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
        ...(l.routerLink ? { routerLink: l.routerLink } : {})
      }))
    ]);
    this.layout.breadCrumbAction.next(null);
  }

}
