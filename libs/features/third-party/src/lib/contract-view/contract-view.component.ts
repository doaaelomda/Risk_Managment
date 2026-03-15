import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  RouterOutlet,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ContractsService } from '../../services/contract.service';
import { SharedTabsComponent } from "libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component";

@Component({
  selector: 'lib-contract-view',
  imports: [CommonModule, RouterOutlet,  SharedTabsComponent],
  templateUrl: './contract-view.component.html',
  styleUrl: './contract-view.component.scss',
})
export class ContractViewComponent {
  constructor(
    private _contractS: ContractsService,
    private activeRoute: ActivatedRoute,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService
  ) {}
  contract: any = '';
  thirdPartyId: any = '';
  ngOnInit() {
    this.activeRoute.paramMap.subscribe((res) => {
      const contractId = res?.get('contractId');
      const thirdPartyId = res?.get('thirdPartyId');
      this.contract = contractId;
      this.thirdPartyId = thirdPartyId;
      if (!contractId) return;
      this.getById(contractId);
    });
    this.handleTabs();
  }
  tabs: any[] = [];
  handleTabs() {
    this.tabs = [
      // {
      //   id: 1,
      //   name: this._TranslateService.instant('TABS.OVERVIEW'),
      //   icon: 'fi-rr-apps',
      //   router: 'overview',
      //   visible : ()=> true
      // },
      {
        id: 2,
        name: this._TranslateService.instant('TABS.SLA'),
        icon: 'fi-rr-apps',
        router: 'sla',
        visible : ()=> true
      },
      // {
      //   id: 3,
      //   name: this._TranslateService.instant('TABS.COMMENTS'),
      //   icon: 'fi fi-rr-comment',
      //   router: 'comments',
      //   visible:()=> true
      // },
      // {
      //   id: 4,
      //   name: this._TranslateService.instant('TABS.ATTACHMENTS'),
      //   icon: 'fi fi-rr-paperclip',
      //   router: 'attachments',
      //   visible:()=> true
      // },
    ];
  }

  handleBreadCrumb() {
    const breadCrumb = [
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
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.CONTRACTS_LIST'
        ),
        icon: '',
        routerLink: `/gfw-portal/third-party/view/${this.thirdPartyId}/contract`,
      });
    } else {
      breadCrumb.push({
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.CONTRACTS_LIST'
        ),
        icon: '',
        routerLink: `/gfw-portal/third-party/contracts`,
      });
    }
    breadCrumb.push({
      name: this.data?.name || '-',
      icon: '',
      routerLink: '',
    });
    this._LayoutService.breadCrumbLinks.next(breadCrumb);
  }
  data: any;
  getById(id: any) {
    this._contractS.getContractById(id).subscribe((res: any) => {
      console.log(res, 'got contract by id');
      this.data = res?.data;
      this.handleBreadCrumb();
    });
  }
}
