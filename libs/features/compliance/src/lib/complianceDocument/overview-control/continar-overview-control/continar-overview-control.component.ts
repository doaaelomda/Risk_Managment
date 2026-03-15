/* eslint-disable @nx/enforce-module-boundaries */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  RouterOutlet,
} from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ComplianceService } from 'libs/features/compliance/src/compliance/compliance.service';
import { SkeletonModule } from 'primeng/skeleton';
import { SharedTabsComponent } from "libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-continar-overview-control',
  imports: [
    CommonModule,
    RouterOutlet,
    TranslateModule,
    SkeletonModule,
    SharedTabsComponent
],
  templateUrl: './continar-overview-control.component.html',
  styleUrl: './continar-overview-control.component.scss',
})
export class ContinarOverviewControlComponent {
  tabs: any[] = [];
  active_tab = 1;
  controlId: any;
  data: any;
  loading: boolean = false;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _TranslateService: TranslateService,
    private complianceService: ComplianceService,
    private _PermissionSystemService:PermissionSystemService
  ) {
    this.tabs = [
      {
        name: this._TranslateService.instant('TABS.LINKED_EVIDANCES'),
        icon: 'fi fi-rr-link-alt',
        router: 'linked-evidances',
        visible: ()=>true
      },

      {
        name: this._TranslateService.instant('TABS.REQUIREMENT_CONTROL'),
        icon: 'fi fi-rs-code-compare',
        router: 'RequirementControl',
        visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'COMPLIANCEDOCUMENTCONTENT_REQUIREMENTCONTROL' , 'VIEW')
      },
    ];
    this.getDataControls();
  }
  getDataControls() {
    this.loading = true;
    this.controlId =this._ActivatedRoute.snapshot.paramMap.get('controlId')
    if (this.controlId) {
      this.complianceService.getDocumentCompliance(this.controlId).subscribe((res) => {
        this.loading = false;
        this.data = res?.data;
      });
    }
  }
}
