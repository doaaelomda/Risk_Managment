import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute,  RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SlaService } from '../../services/sla.service';
import { SharedTabsComponent } from "libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component";

@Component({
  selector: 'lib-sla-view',
  imports: [CommonModule, RouterOutlet,  SharedTabsComponent],
  templateUrl: './sla-view.component.html',
  styleUrl: './sla-view.component.scss',
})
export class SlaViewComponent {

  constructor(
    private _slaS: SlaService,
    private activeRoute: ActivatedRoute,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService
  ) {}
  sla: any = '';
  thirdPartyId: any = '';
  ngOnInit() {
    this.activeRoute.paramMap.subscribe((res) => {
      console.log(res,'params');

      const slaId = res?.get('slaId');
      const thirdPartyId = res?.get('thirdPartyId');
      this.sla = slaId;
      this.thirdPartyId = thirdPartyId;
      if (!slaId) return;
      this.getById(slaId);
    });
    this.handleTabs()
  }
  tabs: any[] = [];
  handleTabs() {
    this.tabs = [
      {
        id: 1,
        name: this._TranslateService.instant('TABS.OVERVIEW'),
        icon: 'fi-rr-apps',
        router: 'overview',
      },
      // {
      //   id: 2,
      //   name: this._TranslateService.instant('TABS.COMMENTS'),
      //   icon: 'fi fi-rr-comment',
      //   router: 'comments',
      // },
      // {
      //   id: 3,
      //   name: this._TranslateService.instant('TABS.ATTACHMENTS'),
      //   icon: 'fi fi-rr-paperclip',
      //   router: 'attachments',
      // },
    ];
  }
contractId:any = ''
  handleBreadCrumb() {
    const breadCrumb:any[] = [
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
    ];

    if (this.thirdPartyId) {
      breadCrumb.push({
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.THIRD_PARTY_LIST'
        ),
        icon: '',
        routerLink: '/gfw-portal/third-party/list',
      });
      breadCrumb.push({
        name: this.contractName,
        icon: '',
        routerLink: `/gfw-portal/third-party/${this.thirdPartyId}/contracts/${this.contractId}/sla`,
      });
    } else {
      breadCrumb.push({
        name: this._TranslateService.instant(
          'THIRD_PARTY.SLA_LIST'
        ),
        icon: '',
        routerLink: `/gfw-portal/third-party/SLA`,
      });
    }
    breadCrumb.push({
      name: this.data?.name || '-',
      icon: '',
    });
    this._LayoutService.breadCrumbLinks.next(breadCrumb);
  }
  data: any;
  contractName:any
  getById(id: any) {
    this._slaS.getSLAById(id).subscribe((res: any) => {
      console.log(res, 'got contract by id');
      this.data = res?.data;
      this.contractId = res?.data?.thirdPartyContractID
      this.contractName = res?.data?.contractName
      this.handleBreadCrumb();
    });
  }


}
