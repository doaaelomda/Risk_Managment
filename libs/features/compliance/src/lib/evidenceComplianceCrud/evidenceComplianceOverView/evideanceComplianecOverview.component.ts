import { SharedTabsComponent } from './../../../../../../shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { ComplianceAssessmntService } from './../../../services/compliance-assessmnt.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  RouterOutlet,
} from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-evideance-complianec-overview',
  imports: [
    CommonModule,
    RouterOutlet,

    SkeletonModule,
    TranslateModule,
    SharedTabsComponent
  ],
  templateUrl: './evideanceComplianecOverview.component.html',
  styleUrl: './evideanceComplianecOverview.component.scss',
})
export class EvideanceComplianecOverviewComponent {
  breadCrumbLinks: any;
  loadDatathreats: boolean = false;
  tabs: any[] = [];
  threatsData: any;
  active_tab = 1;
  threatsId: any;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _TranslateService: TranslateService,
    private ComplianceAssessmntService: ComplianceAssessmntService,
    private _PermissionSystemService:PermissionSystemService
  ) {
    this.tabs = [
           {
        name: this._TranslateService.instant('TABS.evidenceVersion'),
        icon: 'fi fi-rr-code-compare',
        router: 'evidence-Version',
        visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'EVIDENCECOMPLIANCEVERSION' , 'VIEW')

      },
           {
        name: this._TranslateService.instant('TABS.evidenceControl'),
        icon: 'fi fi-rs-settings-sliders',
        router: 'evidence-Control',
        visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'EVIDENCECOMPLIANCECONTROL' , 'VIEW')

      },
    ];
    this._ActivatedRoute.paramMap.subscribe((res) => {
      this.threatsId = res.get('id');
    });
    this.getByIdthreats();
  }

  getByIdthreats() {
    this.loadDatathreats = true;
    this.ComplianceAssessmntService.getEvidenceComplianceById(
      this.threatsId
    ).subscribe((res: any) => {
      this.threatsData = res?.data;
      this.loadDatathreats = false;
    });
  }
}
