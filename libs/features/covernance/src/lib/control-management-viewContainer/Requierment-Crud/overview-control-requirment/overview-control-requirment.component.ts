import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { SharedTabsComponent } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { GoveranceService } from 'libs/features/covernance/src/service/goverance.service';

@Component({
  selector: 'lib-overview-control-requirment',
  imports: [CommonModule, SharedTabsComponent, RouterOutlet, TranslateModule],
  templateUrl: './overview-control-requirment.component.html',
  styleUrl: './overview-control-requirment.component.scss',
})
export class OverviewControlRequirmentComponent {
  current_data: any;
  controlRequirementData: any;
  breadCrumbLinks: any;
  tabs: any[] = [];
  current_tab_id = 1;
  active_tab = 1;
  id: any;
  requirementControl: any;
  current_riskID: any;
  loading_data: boolean = true;

  constructor(
    private __Service: RiskService,
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _GovernanceService: GoveranceService
  ) {
    this.initializeData();
  }
requireId:any
  private initializeData() {

    this.id = +this._ActivatedRoute.snapshot.paramMap.get('govControlID')!;
    this.requirementControl = +this._ActivatedRoute.snapshot.paramMap.get('id')! ;
    if (this.id && this.requirementControl) {
      this.getRequirmnet();
    }
  }

  private getRequirmnet() {
    this.__Service.getOneGovControl(this.id).subscribe((res) => {
      this.current_data = res?.data;
    });

    this._GovernanceService.getRequirementControlsById(this.requirementControl).subscribe({
      next: (res: any) => {
        this.controlRequirementData = res?.data;
      },
      error: () => {
        this.controlRequirementData = {};
      },
    });
  }
}
