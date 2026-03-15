import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  ActivatedRoute,
  RouterOutlet,
} from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SharedTabsComponent } from "libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-over-view-document',
  imports: [
    CommonModule,
    RouterOutlet,
    SkeletonModule,
    TranslateModule,
    SharedTabsComponent
],
  templateUrl: './overViewDocument.component.html',
  styleUrl: './overViewDocument.component.scss',
})
export class OverViewDocumentComponent {
  tabs: any[] = [];
  active_tab = 1;
  docId: any;
  DocumnetData: any;
  loadDataDocumnet: boolean = false;
  constructor(
    private _TranslateService: TranslateService,
    private _ActivatedRoute: ActivatedRoute,
    private _riskService: RiskService,
    private _LayoutService: LayoutService,
    private _PermissionSystemService:PermissionSystemService
  ) {
    this.tabs = [
      {
        id: 2,
        name: 'TABS.versions',
        icon: 'fi fi-rs-code-compare',
        router: 'versions',
        visible: ()=> this._PermissionSystemService.can('GOVERNANCE', 'VERSION', 'VIEW')
      },
      {
        id: 3,
        name: 'TABS.selectors',
        icon: 'fi fi-rr-users',
        router: 'selectors',
        visible: ()=> this._PermissionSystemService.can('GOVERNANCE', 'GOVDOCUMENTSTACKHOLDERS', 'VIEW')
      }
    ];
    this._ActivatedRoute.paramMap.subscribe((res) => {
      this.docId = res.get('Docid');
      this.getByIdDocumnet();
    });
  }

  getByIdDocumnet() {
    this.loadDataDocumnet = true;
    this._riskService.getOneDoc(this.docId).subscribe((docRes: any) => {
      this.DocumnetData = docRes?.data;
      this.loadDataDocumnet = false;
      this._LayoutService.breadCrumbLinks.next([
        { name: '', icon: 'fi fi-rs-home' },
        {
          name: this._TranslateService.instant('BREAD_CRUMB_TITLES.Governance'),
          icon: '',
          routerLink: '/gfw-portal/governance/documents',
        },
        {
          name: this._TranslateService.instant(
            'BREAD_CRUMB_TITLES.GOVERNANCE_DOCUMENTS_LIST'
          ),
          icon: '',
          routerLink: '/gfw-portal/governance/documents',
        },
        {
          name: this.DocumnetData?.name,
          icon: '',
          routerLink: `/gfw-portal/governance/Document-action/viewDocument/${this.docId}/overview`,
        },
      ]);
    });
  }
}
