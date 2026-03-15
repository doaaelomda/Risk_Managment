import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  RouterOutlet,
} from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { SharedTabsComponent } from "libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';

@Component({
  selector: 'lib-control-management-view-container',
  imports: [
    CommonModule,
    RouterOutlet,
    TranslateModule,
    SharedTabsComponent
],
  templateUrl: './control-management-viewContainer.component.html',
  styleUrl: './control-management-viewContainer.component.scss',
})
export class ControlManagementViewContainerComponent {
  current_risk_data: any;
  current_riskID: any;
  breadCrumbLinks: any;
  loading_data: boolean = true;
  current_tab_id = 1;
  tabs: any[] = [];

  constructor(
    private _RiskService: RiskService,
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _PermissionSystemService:PermissionSystemService,
    public sharedService:SharedService
  ) {
    this.getDataControls();
    this._LayoutService.breadCrumbTitle.next(
      this._TranslateService.instant('BREAD_CRUMB_TITLES.RISK_MANGEMENT')
    );
    this._LayoutService.breadCrumbAction.next(null);

    // this._LayoutService.breadCrumbLinks.next(this.breadCrumbLinks);

    this.tabs = [

      {
        id: 2,
        name: 'TABS.Controlassessment',
        icon: 'fi fi-rr-clipboard-check',
        router: 'Controlassessment',
        visible: ()=> this._PermissionSystemService.can('GOVERNANCE', 'CONTROLASSESSMENT', 'VIEW')

      },
      {
        id:4,
        name:'TABS.LINKED_MODULES',
        icon:"fi fi-rr-link-alt",
        router:'linkedModules',
          visible: ()=> this._PermissionSystemService.can('GOVERNANCE', 'LINKEDMODULE', 'VIEW')
      },
      //   {
      //   id: 3,
      //   name: 'ControlRequirement.ControlRequirement',
      //   icon: 'fi fi-rs-code-compare',
      //   router: 'Requirements',
      //     visible: ()=> this._PermissionSystemService.can('GOVERNANCE', 'CONTROLREQUIRMENT', 'VIEW')
      // },
    ];
  }
  active_tab = 1;
  id: any;
  getDataControls() {
    this.id = +this._ActivatedRoute.snapshot.paramMap.get('id')!;
    if (this.id) {
      this._RiskService.getOneGovControl(this.id).subscribe((res) => {
        this.current_risk_data = res?.data;
            this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.Governance'),
        icon: '',
        routerLink: '/gfw-portal/governance/control-management/list',
      },
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.Control_Management'
        ),
        icon: '',
        routerLink: '/gfw-portal/governance/control-management/list',
      },
      {
        name: this.current_risk_data?.name,
        icon: '',
      },
    ]);
      });
    }
  }
}
