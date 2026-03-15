import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { SharedTabsComponent } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { GoveranceService } from 'libs/features/covernance/src/service/goverance.service';
import { RequirmentDocumentService } from 'libs/features/compliance/src/services/requirment-document.service';
import { ComplianceService } from 'libs/features/compliance/src/compliance/compliance.service';

@Component({
  selector: 'lib-overview-container-requirment',
  imports: [CommonModule, SharedTabsComponent, RouterOutlet, TranslateModule],
  templateUrl: './Overview-container-Requirment.component.html',
  styleUrl: './Overview-container-Requirment.component.scss',
})
export class OverviewContainerRequirmentComponent {
  current_data: any;
  controlRequirementData: any;
  breadCrumbLinks: any;
  tabs: any[] = [];
  current_tab_id = 1;
  active_tab = 1;
  govControlID: any;
  id: any;
  current_riskID: any;
  loading_data: boolean = true;
  controlId: any;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private complianceService: ComplianceService,
    private RequirmentDocumentService: RequirmentDocumentService
  ) {
    this.initializeData();
  }
  requireId: any;
  private initializeData() {
    this.govControlID =
      +this._ActivatedRoute.snapshot.paramMap.get('govControlID')!;
    this.controlId = +this._ActivatedRoute.snapshot.paramMap.get('controlId')!;
    this.id = +this._ActivatedRoute.snapshot.paramMap.get('id')!;
    if (this.controlId && this.id) {
      this.getRequirmnet();
    }
  }

  private getRequirmnet() {
    this.complianceService
      .getDocumentCompliance(this.controlId)
      .subscribe((res) => {
        this.current_data = res?.data;
      });

    this.RequirmentDocumentService.getRequirementControlsById(
      this.id
    ).subscribe({
      next: (res: any) => {
        this.controlRequirementData = res?.data;
      },
      error: () => {
        this.controlRequirementData = {};
      },
    });
  }
}
