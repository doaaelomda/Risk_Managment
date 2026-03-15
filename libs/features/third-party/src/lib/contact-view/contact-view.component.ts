import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../services/contact.service';
import {
  ActivatedRoute,

  RouterOutlet,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SharedTabsComponent } from "libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component";
import { ThirdPartyService } from '../../services/third-party.service';

@Component({
  selector: 'lib-contact-view',
  imports: [CommonModule, RouterOutlet, SharedTabsComponent],
  templateUrl: './contact-view.component.html',
  styleUrl: './contact-view.component.scss',
})
export class ContactViewComponent {
  constructor(
    private _contactS: ContactService,
    private activeRoute: ActivatedRoute,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
     private _ThirdPartyService: ThirdPartyService
  ) {}
  contactId: any = '';
  thirdPartyId: any = '';
  ngOnInit() {
    this.activeRoute.paramMap.subscribe((res) => {
      const contactId = res?.get('contactId');
      const thirdPartyId = res?.get('thirdPartyId');
      this.contactId = contactId;
      this.thirdPartyId = thirdPartyId;
      if (!contactId) return;
      this.getById(contactId);
      this.getByIdThirdParty(thirdPartyId)
    });
    this.handleTabs();
  }
  tabs: any[] = [];
  thirdPartyData:any
  loadDataThirdParty:boolean=false
  handleTabs() {
    this.tabs = [
      {
        // id: 1,
        // name: this._TranslateService.instant('TABS.OVERVIEW'),
        // icon: 'fi-rr-apps',
        // router: 'overview',
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

  data: any;
  getById(id: any) {
    this._contactS.getContactById(id).subscribe((res: any) => {
      console.log(res, 'got contact by id');
      this.data = res?.data;
    });
  }

   getByIdThirdParty(thirdPartyId:any) {
    this.loadDataThirdParty = true;
    this._ThirdPartyService.getThirdPartyById(thirdPartyId).subscribe({
      next: (res: any) => {
        this.thirdPartyData = res?.data;
        this.loadDataThirdParty = false;
      },
      error: () => {
        this.loadDataThirdParty = false;
      },
    });
  }
}
