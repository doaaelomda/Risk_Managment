import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { ContractsService } from '../../../services/contract.service';
import { OverviewEntry, SharedOverviewComponent } from "libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component";
import { finalize } from 'rxjs';

@Component({
  selector: 'lib-contract-overview',
  imports: [CommonModule, TranslateModule, SharedOverviewComponent],
  templateUrl: './contract-overview.component.html',
  styleUrl: './contract-overview.component.scss',
})
export class ContractOverviewComponent {
      constructor(
    private _contractS: ContractsService,
    private activeRoute: ActivatedRoute,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService
  ) {}
  contract: any = '';
  thirdPartyId: any = '';
  ngOnInit() {
    this.activeRoute.parent?.paramMap.subscribe((res) => {
      const contractId = res?.get('contractId');
      const thirdPartyId = res?.get('thirdPartyId');
      this.contract = contractId;
      this.thirdPartyId = thirdPartyId;
      if (!contractId) return;
      this.getById(contractId);
    });

  }

entries: OverviewEntry[] = [
  { key: 'name', label: 'CONTENT.NAME', type: 'text' },
  { key: 'thirdPartyName', label: 'THIRD_PARTY.THIRD_PARTY_NAME', type: 'text' },
  { key: 'engagementName', label: 'THIRD_PARTY.ENGAGEMENT_NAME', type: 'text' },
  { key: 'contractNumber', label: 'THIRD_PARTY.CONTRACT_NUMBER', type: 'text' },
  { key: 'startDate', label: 'THIRD_PARTY.START_DATE', type: 'date' },
  { key: 'endDate', label: 'THIRD_PARTY.END_DATE', type: 'date' },
  { key: 'autoRenewal', label: 'THIRD_PARTY.AUTO_RENEWAL', type: 'boolean' },
  { key: 'terminationNoticeDays', label: 'THIRD_PARTY.TERMINATION_NOTICE_DAYS', type: 'text' },
  { key: 'contractValue', label: 'THIRD_PARTY.CONTRACT_VALUE', type: 'text' },
  { key: 'statusTypeName', label: 'THIRD_PARTY.STATUS', type: 'text' },

  { key: 'notes', label: 'THIRD_PARTY.NOTES', type: 'description' }
];


  data: any;
  loading:boolean = false
  getById(id: any) {
    this.loading = true
    this._contractS.getContractById(id).pipe(finalize(() => this.loading = false)).subscribe((res: any) => {
      console.log(res, 'got contract by id');
      this.data = res?.data;
    });
  }
}
