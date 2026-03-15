import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import {
  ActivatedRoute,
  RouterOutlet,
} from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { GovDocumentsService } from 'libs/features/covernance/src/service/covDocument.service';
import { SharedTabsComponent } from "libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-overview-version',
  imports: [
    CommonModule,
    RouterOutlet,
    SkeletonModule,
    TranslateModule,
    SharedTabsComponent
],
  templateUrl: './overviewVersion.component.html',
  styleUrl: './overviewVersion.component.scss',
})
export class OverviewVersionComponent {
  tabs: any[] = [];
  active_tab = 1;
  docId: any;
  versionId:any
  DocumnetData: any;
  loadDataDocumnet: boolean = false;
  versionData:any
  constructor(
    private _TranslateService: TranslateService,
    private _ActivatedRoute: ActivatedRoute,
    private _riskService: RiskService,
    private _LayoutService: LayoutService,
    private _GovDocumentsService:GovDocumentsService,
    private _PermissionSystemService:PermissionSystemService
  ) {
    this.tabs = [
      {
        id: 2,
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.CONTENT'),
        icon: 'fi fi-rs-code-compare',
        router: 'content',
        visible: ()=> this._PermissionSystemService.can('GOVERNANCE', 'VERSIONCONTENT', 'VIEW')
      },
      {
        id: 3,
        name: this._TranslateService.instant('TABS.REVIEWS'),
        icon: 'fi fi-rr-feedback',
        router: 'reviews',
          visible: ()=> this._PermissionSystemService.can('GOVERNANCE', 'REVIEWS', 'VIEW')
      },
      {
        id: 6,
        name: this._TranslateService.instant('TABS.APPROVAL'),
        icon: 'fi fi-rr-registration-paper',
        router: 'approval',
          visible: ()=> this._PermissionSystemService.can('GOVERNANCE', 'APPROVAL', 'VIEW')
      },
      {
        id: 6,
        name: this._TranslateService.instant('TABS.VERSION_COMMENTS'),
        icon: 'fi fi-rs-code-compare',
        router: 'version-comments',
          visible: ()=> this._PermissionSystemService.can('GOVERNANCE', 'VERSION_REVIEWCOMMENTS', 'VIEW')
      },

    ];
    this._ActivatedRoute.paramMap.subscribe((res) => {
      this.docId = res.get('Docid');
      this.versionId=res?.get('versionId')
      this.getByIdDocumnet();
      this.getDocumentVersionById()
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
          name: this._TranslateService.instant(
            'TABS.versions'
          ),
          icon: '',
          routerLink: `/gfw-portal/governance/Document-action/viewDocument/${this.docId}/versions`,
        },
        {
          name: this.DocumnetData?.name,
          icon: '',
          routerLink: `/gfw-portal/governance/viewDocument/${this.docId}/versions/${this.versionId}`,
        },
      ]);
    });
  }
    getDocumentVersionById(){
    this._GovDocumentsService.getByIdVersion(this.versionId).subscribe((res:any)=>{
      this._GovDocumentsService.currentContentTypes.set(res.data.govDocumentContentTypes)
      this.versionData=res?.data
    })
  }
}
