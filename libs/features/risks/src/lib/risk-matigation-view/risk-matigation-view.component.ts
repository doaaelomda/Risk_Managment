import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DateFormaterPipe } from 'apps/gfw-portal/src/app/core/pipes/dateFormater.pipe';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { RiskService } from '../../services/risk.service';
import { ActivatedRoute } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { switchMap, tap } from 'rxjs';
import { AvatarModule } from 'primeng/avatar';
import { OwnerUserComponent } from 'libs/shared/shared-ui/src/lib/ownerUser/ownerUser.component';
import { SystemActionsComponent } from "libs/shared/shared-ui/src/lib/system-actions/system-actions.component";
@Component({
  selector: 'lib-risk-matigation-view',
  imports: [CommonModule,
    TranslateModule,
    ButtonModule,
    ChipModule,
    ProgressBarModule,
    CardModule,
    SkeletonModule, AvatarModule, OwnerUserComponent, SystemActionsComponent],
  templateUrl: './risk-matigation-view.component.html',
  styleUrl: './risk-matigation-view.component.css'
})
export class RiskMatigationViewComponent {

  constructor(    private cd: ChangeDetectorRef,
    public formatDate: DateFormaterPipe,
    private _RiskService: RiskService,
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService:LayoutService,
    private _TranslateService:TranslateService){

  }
  planId:any
  riskCode:any
  riskTitle:any
  isArabic:any
  ngOnInit(): void {
  this.loadingData = true;
 this.isArabic = this._TranslateService.currentLang === 'ar';
    this._TranslateService.onLangChange.subscribe(lang => {
      this.isArabic = lang.lang === 'ar';
    });
  this._ActivatedRoute.parent?.paramMap
    .pipe(
      tap((params) => {
        this.idValue = Number(params.get('riskID'));
        this.planId = Number(params.get('id'));
      }),
      switchMap(() => this._RiskService.getOneRiskMitagation(this.planId))
    )
    .subscribe((res) => {
      this.Data = res.data;
      console.log("this.riskCode:", this.riskCode);
      this.loadingData = false;
      this.riskCode=res?.data?.name
      this._RiskService.getOneRisk(this.idValue).subscribe(resulat=>{
        this.riskTitle=resulat?.data.riskTitle
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
          name: this.riskTitle || '---',
          icon: '',
          routerLink:`/gfw-portal/risks-management/risk/${this.idValue}/overview`
          },
        {
          name: 'Mitigation Plans',
          icon: '',
          routerLink: `/gfw-portal/risks-management/risk/${this.idValue}/mitigation-plans`,
        },
        {
          name: `${this.riskCode || '--'}`,
          icon: '',
        },
      ]);
      })
      this._LayoutService.breadCrumbAction.next(null);
    });

}





  loadingData:boolean = false;
   Data: any;

  idValue:any
  getRiskData(){
    this.loadingData = true;
        this._ActivatedRoute.parent?.paramMap.pipe(
      tap((res) => this.idValue= res.get('riskID')),
      switchMap((res) =>
        this._RiskService.getOneRiskMitagation(Number(res.get('id')))
      ),
    ).subscribe((res)=>{
      this.Data = res.data;
      console.log("Risk Data:", this.Data);
      this.loadingData = false;
    })
  }

      hasActions:boolean = true;
  onFoundAction(event:boolean){
    this.hasActions = event;
    console.log('hasActions', this.hasActions);
  }

}
