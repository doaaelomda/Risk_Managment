import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DateFormaterPipe } from 'apps/gfw-portal/src/app/core/pipes/dateFormater.pipe';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { RiskService } from '../../services/risk.service';
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { switchMap, tap } from 'rxjs';
import { AvatarModule } from 'primeng/avatar';
import { SharedTabsComponent } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-risk-matigation-over-view',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    ChipModule,
    ProgressBarModule,
    CardModule,
    SkeletonModule,
    AvatarModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    SharedTabsComponent
  ],
  templateUrl: './risk-matigation-over-view.component.html',
  styleUrl: './risk-matigation-over-view.component.css',
})
export class RiskMatigationOverViewComponent implements OnInit {
  Data: any;
  tabs: any;
  constructor(
    private cd: ChangeDetectorRef,
    public formatDate: DateFormaterPipe,
    private _RiskService: RiskService,
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService:TranslateService,
    public _PermissionSystemService:PermissionSystemService
  ) {}

  ngOnInit(): void {
    this.getRiskData();
    this._LayoutService.breadCrumbLinks.next([
      {
    name: '',
    icon: 'fi fi-rs-home',
    routerLink: '/'
  },
  {
    name: this._TranslateService.instant('BREAD_CRUMB_TITLES.RISK_MANGEMENT'),
    icon: '',
    routerLink: '/gfw-portal/risks-management/risks-list'
  },
  {
    name: this._TranslateService.instant('BREAD_CRUMB_TITLES.RISK_LIST'),
    icon: '',
    routerLink: '/gfw-portal/risks-management/risks-list'
  },
      {
        name: this._TranslateService.instant('MIGITATION.Risk_PALN'),
        icon: '',
        routerLink: `/gfw-portal/risks-management/risks/${this.idValue}/mitigation-plans`,
      },
    ]);
    this._LayoutService.breadCrumbAction.next(null);

    this._RiskService.getOneRisk(this.riskID).subscribe((res: any) => {
      this.dataRisk = res?.data;
    });
  }
  dataRisk: any;

  loadingData: boolean = false;

  riskID: any;
  idValue: any;
  getRiskData() {
    this.loadingData = true;
    this._ActivatedRoute.paramMap
      .pipe(
        switchMap((res) => {
          this.idValue = Number(res.get('id'));
          this.riskID = Number(res.get('riskID'));
          return this._RiskService.getOneRiskMitagation(this.idValue);
        })
      )
      .subscribe((res) => {
        this.Data = res.data;
        console.log('Risk Data:', this.Data);
        this.loadingData = false;
      });
    this.tabs =this.tabs = [
      {
        id: 2,
        name: this._TranslateService.instant("TABS.Risk_Response_Actions"),
        icon: 'fi fi-rr-triangle-warning',
        router: 'response-action',
        visible: () => this._PermissionSystemService.can('RISKS','TREATMENT_RESPONSEACTION','VIEW')

      }
    ];
  }
}
