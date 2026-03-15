import { SharedTabsComponent } from './../../../../../shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { SkeletonModule } from 'primeng/skeleton';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { StandardDocsService } from '../services/standard-docs.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-view-standard-doc',
  imports: [CommonModule, MenuModule,SkeletonModule,SharedTabsComponent],
  templateUrl: './view-standard-doc.component.html',
  styleUrl: './view-standard-doc.component.scss',
})
export class ViewStandardDocComponent {
  constructor(
    private _translateS: TranslateService,
    private _activatedRoute: ActivatedRoute,
    private layout: LayoutService,
    private _standardDocsS: StandardDocsService,
    private _PermissionSystemService:PermissionSystemService
  ) {}

  private initBreadcrumb(): void {
    const containerKey = 'BREAD_CRUMB_TITLES.GOVERNANCE_STANDARDS';
    this.setBreadcrumb(containerKey, [
      { nameKey: containerKey },
      {
        nameKey: 'GOVERNANCE_STANDARDS.DOCUMENTS_LIST',
        routerLink: '/gfw-portal/library/standard-docs/list',
      },
      { nameKey: this.data?.name },
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
    this.getDocId();
  }
  docId: string = '';
  getDocId() {
    this._activatedRoute.paramMap.subscribe((res: any) => {
      this.docId = res.get('id');
      if (!this.docId) return;
      this.getDocById(this.docId);
    });
  }

  loadingData: boolean = false;
  data!: any;
  getDocById(id: string) {
    this.loadingData = true;
    this._standardDocsS.getById(id).subscribe((res) => {
      const doc_data = res?.data;
      this.data = doc_data;
      this._standardDocsS.viewingData.next(this.data)
      this.loadingData = false;
      this.initBreadcrumb();
      console.log(doc_data, 'doc_data');
    });
  }
  ngOnDestroy(){
        this._standardDocsS.viewingData.next(null)
  }
  tabs: any[] = [];
  handleTabs() {
    this.tabs = [

      {
        id: 4,
        name: this._translateS.instant('SETTING.CONTROL_MANAGEMENT_BADGE'),
        icon: 'fi fi-rr-comment',
        router: 'controls',
        visible: ()=>this._PermissionSystemService.can('LIBRARY' , 'STANDARDDOCUMENTS_CONTROLS_REQUIREMENTS' , 'VIEW')
      },
    ];
  }
}
