import {
  OverviewEntry,
  SharedOverviewComponent,
} from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ThirdPartyService } from '../../../services/third-party.service';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-thirdparty-overview',
  imports: [
    CommonModule,
    SkeletonModule,
    TranslateModule,
    SharedOverviewComponent,
  ],
  templateUrl: './thirdparty-overview.component.html',
  styleUrl: './thirdparty-overview.component.scss',
})
export class ThirdpartyOverviewComponent implements OnInit {
  constructor(
    private _activatedR: ActivatedRoute,
    private _thirdPartyS: ThirdPartyService
  ) {}

  entries: OverviewEntry[] = [
    { key: 'name', label: 'THIRD_PARTY.NAME', type: 'text' },
    { key: 'nameAr', label: 'THIRD_PARTY.NAME_AR', type: 'text' },
    {
      key: 'categoryTypeName',
      label: 'THIRD_PARTY.CATEGORY',
      type: 'badge',
      colorKey: 'categoryTypeColor',
    },
    {
      key: 'criticalityLevelName',
      label: 'THIRD_PARTY.CRITICALITY',
      type: 'badge',
      colorKey: 'criticalityLevelName',
    },
    {
      key: 'statusTypeName',
      label: 'THIRD_PARTY.STATUS',
      type: 'badge',
      colorKey: 'statusTypeColor',
    },

    {
      key: 'registrationNumber',
      label: 'THIRD_PARTY.REGISTRATION_NUMBER',
      type: 'text',
    },
    { key: 'primaryEmail', label: 'THIRD_PARTY.PRIMARY_EMAIL', type: 'text' },
    { key: 'primaryPhone', label: 'THIRD_PARTY.PRIMARY_PHONE', type: 'text' },
    { key: 'website', label: 'THIRD_PARTY.WEBSITE', type: 'text' },
    { key: 'countryName', label: 'THIRD_PARTY.COUNTRY', type: 'text' },
    { key: 'city', label: 'THIRD_PARTY.CITY', type: 'text' },
    { key: 'addressLine1', label: 'THIRD_PARTY.ADDRESS', type: 'text' },
    { key: 'stateProvince', label: 'THIRD_PARTY.STATEPROVINCE', type: 'text' },

    { key: 'postalCode', label: 'THIRD_PARTY.POSTAL_CODE', type: 'text' },

    {
      key: 'description',
      label: 'THIRD_PARTY.DESCRIPTION',
      type: 'description',
    },
    {
      key: 'descriptionAr',
      label: 'THIRD_PARTY.DESCRIPTION_AR',
      type: 'description',
    },
    { key: 'notes', label: 'THIRD_PARTY.NOTES', type: 'description' },
  ];

  current_third_party_data!: any;
  ngOnInit() {
    this._activatedR.parent?.paramMap.subscribe((res) => {
      const thirdPartyId = res?.get('id');
      if (!thirdPartyId) return;
      this.getById(thirdPartyId);
    });
  }
  isLoading: boolean = false;
  getById(id: string | number) {
    this.isLoading = true;
    this._thirdPartyS.getThirdPartyById(id).subscribe((res) => {
      this.current_third_party_data = res?.data;
      this.isLoading = false;
    });
  }
}
