import { SharedTabsComponent } from './../../../../../shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,

  RouterOutlet,
} from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { ThirdPartyService } from '../../services/third-party.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-third-party-view-container',
  imports: [
    CommonModule,
    RouterOutlet,
    SkeletonModule,
    TranslateModule,
    SharedTabsComponent
  ],
  templateUrl: './third-party-viewContainer.component.html',
  styleUrl: './third-party-viewContainer.component.scss',
})
export class ThirdPartyViewContainerComponent {
  loadDataThirdParty: boolean = false;
  tabs: any[] = [];
  thirdPartyData: any;
  active_tab = 1;
  thirdPartyId: any;

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _ThirdPartyService: ThirdPartyService,
    private _PermissionSystemService:PermissionSystemService
  ) {
    const breadCrumb = [
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.THIRD_PARTY'),
        icon: '',
        routerLink: '/gfw-portal/third-party',
      },
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.THIRD_PARTY_LIST'
        ),
        icon: '',
        routerLink: '/gfw-portal/third-party/list',
      },
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.VIEW_THIRD_PARTY'
        ),
        icon: '',
      },
    ];
    this.breadCrumb = breadCrumb;
    this._LayoutService.breadCrumbLinks.next(this.breadCrumb);

    // Define Tabs
    this.tabs = [
      {
        id: 2,
        name: this._TranslateService.instant('TABS.CONTACT'),
        icon: 'fi fi-rr-paperclip',
        router: 'contact',
        visible: ()=> this._PermissionSystemService.can('THIRDPARTIES', 'THIRDPARTYCONTACT', 'VIEW')

      },
      {
        id: 3,
        name: this._TranslateService.instant('TABS.CONTRACT'),
        icon: 'fi fi-rr-paperclip',
        router: 'contract',
         visible: ()=> this._PermissionSystemService.can('THIRDPARTIES', 'THIRDPARTYCONTRACT', 'VIEW')
      },
      {
        id: 6,
        name: this._TranslateService.instant('DUE_DILIGENCES.DUE_DILIGENCE'),
        icon: '',
        router: 'due-diligence',
         visible: ()=> this._PermissionSystemService.can('THIRDPARTIES', 'THIRDPARTYDUEDILIGENCE', 'VIEW')
      },
      {
        id: 7,
        name: this._TranslateService.instant('TABS.ASSESSMENT'),
        icon: '',
        router: 'assessment',
         visible: ()=> this._PermissionSystemService.can('THIRDPARTIES', 'THIRDPARTYASSESSMENT', 'VIEW')
      },
      {
        id: 8,
        name: this._TranslateService.instant('TABS.Activity'),
        icon: '',
        router: 'Activity',
         visible: ()=> this._PermissionSystemService.can('THIRDPARTIES', 'THIRDPARTYACTIVITY', 'VIEW')
      },
      {
        id: 9,
        name: this._TranslateService.instant('TABS.Exceptions'),
        icon: '',
        router: 'Exceptions',
         visible: ()=> this._PermissionSystemService.can('THIRDPARTIES', 'THIRDPARTYEXCEPTIONS', 'VIEW')
      },
           {
        id: 10,
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.QUESTIONNAIRE'),
        icon: '',
        router: 'questionnaire/list',
         visible: ()=> this._PermissionSystemService.can('THIRDPARTIES', 'THIRDPARTYQUESTIONNAIRE', 'VIEW')
      },
    ];

    // Get ID from route
    this._ActivatedRoute.paramMap.subscribe((res) => {
      this.thirdPartyId = res.get('id');
    });

    this.getByIdThirdParty();
  }
  breadCrumb: any[] = [];

  getByIdThirdParty() {
    this.loadDataThirdParty = true;
    this._ThirdPartyService.getThirdPartyById(this.thirdPartyId).subscribe({
      next: (res: any) => {
        this.thirdPartyData = res?.data;
        this.loadDataThirdParty = false;
        this.breadCrumb[3].name = res?.data?.legalName;
      },
      error: () => {
        this.loadDataThirdParty = false;
      },
    });
  }
}
