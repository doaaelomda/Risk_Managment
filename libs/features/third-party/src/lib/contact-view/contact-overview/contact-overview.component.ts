import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../../services/contact.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { OverviewEntry, SharedOverviewComponent } from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'lib-contact-overview',
  imports: [CommonModule, TranslateModule, SharedOverviewComponent],
  templateUrl: './contact-overview.component.html',
  styleUrl: './contact-overview.component.scss',
})
export class ContactOverviewComponent {
    constructor(
    private _contactS: ContactService,
    private activeRoute: ActivatedRoute,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService
  ) {}
  contactId: any = '';
  thirdPartyId: any = '';
  entries: OverviewEntry[] = [
  { key: 'name', label: 'CONTENT.NAME', type: 'text' },
  { key: 'thirdPartyName', label: 'THIRD_PARTY.THIRD_PARTY_NAME', type: 'text' },
  { key: 'jobTitle', label: 'THIRD_PARTY.JOB_TITLE', type: 'text' },
  { key: 'email', label: 'THIRD_PARTY.EMAIL', type: 'text' },
  { key: 'phone', label: 'THIRD_PARTY.PHONE', type: 'text' },
  { key: 'mobile', label: 'THIRD_PARTY.MOBILE', type: 'text' },
  { key: 'isPrimary', label: 'THIRD_PARTY.IS_PRIMARY', type: 'boolean' },

  { key: 'notes', label: 'THIRD_PARTY.NOTES', type: 'description' }
];

  ngOnInit() {
    this.activeRoute.parent?.paramMap.subscribe((res) => {
      const contactId = res?.get('contactId');
      const thirdPartyId = res?.get('thirdPartyId');
      this.contactId = contactId;
      this.thirdPartyId = thirdPartyId;
      if (!contactId) return;
      this.getById(contactId);
    });
  }


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
        name: 'contacts',
        icon: '',
        routerLink: `/gfw-portal/third-party/view/${this.thirdPartyId}/contact`,
      });
    } else {
      breadCrumb.push({
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.CONTACTS_LIST'
        ),
        icon: '',
        routerLink: `/gfw-portal/third-party/contacts`,
      });
    }
    breadCrumb.push({
      name: this.data?.name,
      icon: ''
    });
    this._LayoutService.breadCrumbLinks.next(breadCrumb);
  }
  data: any;
  loading:boolean = false
  getById(id: any) {
    this.loading  = true
    this._contactS.getContactById(id).pipe(finalize(() => this.loading = false)).subscribe((res: any) => {
      console.log(res, 'got contact by id');
      this.data = res?.data;
      this.handleBreadCrumb();
    });
  }
}
