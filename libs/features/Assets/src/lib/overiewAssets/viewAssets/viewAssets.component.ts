import { SystemActionsComponent } from 'libs/shared/shared-ui/src/lib/system-actions/system-actions.component';
import { OverviewEntry, SharedOverviewComponent } from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';
import { OwnerUserComponent } from './../../../../../../shared/shared-ui/src/lib/ownerUser/ownerUser.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AssetsService } from '../../../services/assets.service';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'lib-view-assets',
  imports: [
    CommonModule,
    SkeletonModule,
    TranslateModule,
    SystemActionsComponent,
    SharedOverviewComponent,
  ],
  templateUrl: './viewAssets.component.html',
  styleUrl: './viewAssets.component.scss',
})
export class ViewAssetsComponent {
  breadCrumbLinks: any;
  loadDataAssests: boolean = false;
  tabs: any[] = [];
  AssestsData: any;
  active_tab = 1;
  AssestId: any;

  entries: OverviewEntry[] = [
    { key: 'shortName', label: 'LOOKUP.NAME', type: 'text' },
    { key: 'purpose', label: 'ASSET.PURPOSE', type: 'text' },
    { key: 'location', label: 'ASSET.LOCATION', type: 'text' },
    { key: 'acquisitionDate', label: 'ASSET.ACQUISITION_DATE', type: 'date' },
    { key: 'expiryDate', label: 'ASSET.EXPIRY_DATE', type: 'date' },
    {
      key: 'assetCategoryName',
      label: 'ASSET.ASSET_CATEGORY_NAME',
      type: 'text',
    },
    { key: 'assetTypeName', label: 'ASSET.ASSET_TYPE_NAME', type: 'text' },
    {
      key: 'assetCriticalityLevelName',
      label: 'ASSET.ASSET_CRITICALITY_LEVEL_NAME',
      type: 'text',
    },
    {
      key: 'assetStatusTypeName',
      label: 'ASSET.ASSET_STATUS_TYPE_NAME',
      type: 'text',
    },
    { key: 'manufacturer', label: 'ASSET.MANUFACTURER', type: 'text' },
    {
      key: 'assetCriticalityOverallScore',
      label: 'ASSET.ASSET_CRITICALITY_OVERALL_SCORE',
      type: 'number',
    },
    {
      key: 'responsibleUserName',
      label: 'ASSET.RESPONSIBLE_USER_NAME',
      type: 'user',
      id: 'responsibleUserId',
    },
    { key: 'financialValue', label: 'ASSET.FINANCIAL_VALUE', type: 'number' },
    {
      key: 'assetPriorityName',
      label: 'ASSET.ASSET_PRIORITY_NAME',
      type: 'text',
    },
    { key: 'ip', label: 'ASSETS.IP', type: 'text' },
    {
      key: 'availabilityLevelName',
      label: 'ASSETS.AvailabilityLevel',
      type: 'badge',
      colorKey: 'availabilityLevelColor',
    },
    {
      key: 'integrityLevelName',
      label: 'ASSETS.IntegrityLevel',
      type: 'badge',
      colorKey: 'integrityLevelColor',
    },
    {
      key: 'confidentialityLevelName',
      label: 'ASSETS.ConfidentialityLevel',
      type: 'badge',
      colorKey: 'confidentialityLevelColor',
    },

        {
      key: 'ciaLevelName',
      label: 'ASSETS.ciaLevel',
      type: 'badge',
      colorKey: 'ciaLevelColor',
    },
  ];

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _AssetsService: AssetsService
  ) {
    this.breadCrumb = [
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.ASSETS'),
        icon: '',
        routerLink: '/gfw-portal/assets',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.ASSETS_LIST'),
        icon: '',
        routerLink: '/gfw-portal/assets',
      },

      {
        name: '-',
        icon: '',
      },
    ];
    this._LayoutService.breadCrumbLinks.next(this.breadCrumb);
    this._ActivatedRoute?.parent?.paramMap.subscribe((res) => {
      this.AssestId = res.get('id');
    });
    this.getByIdAssestes();
  }
  getByIdAssestes() {
    this.loadDataAssests = true;
    this._AssetsService.getAssetById(this.AssestId).subscribe((res: any) => {
      this.AssestsData = res?.data;
      this.breadCrumb[this.breadCrumb.length - 1].name =
        this.AssestsData?.shortName;
      this.loadDataAssests = false;
    });
  }

  breadCrumb: any[] = [];
}
