import { SharedDescriptionComponent } from 'libs/shared/shared-ui/src/lib/shared-description/shared-description.component';
/* eslint-disable @nx/enforce-module-boundaries */

import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { RiskService } from '../../services/risk.service';
import { SkeletonModule } from 'primeng/skeleton';
import { switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { OwnerUserComponent } from 'libs/shared/shared-ui/src/lib/ownerUser/ownerUser.component';
import { PrimengModule } from "@gfw/primeng";
import { TranslationsService } from 'apps/gfw-portal/src/app/core/services/translate.service';
import { SystemActionsComponent } from "libs/shared/shared-ui/src/lib/system-actions/system-actions.component";

@Component({
  selector: 'lib-risk-assessment-view',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    SkeletonModule,
    OwnerUserComponent,
    SharedDescriptionComponent,
    PrimengModule,
    SystemActionsComponent
],
  templateUrl: './risk-assessment-view.component.html',
  styleUrl: './risk-assessment-view.component.scss',
  providers: [DatePipe],
})
export class RiskAssessmentViewComponent {
  riskData: any;
  constructor(
    private _RiskService: RiskService,
    private _ActivatedRoute: ActivatedRoute,
    private _TranslationsService:TranslationsService
  ) {}
  is_ar:boolean=false
  ngOnInit(): void {
       this._TranslationsService.selected_lan_sub.subscribe((res: string) => {
      if (res == 'ar') {
        this.is_ar = true;
      } else {
        this.is_ar = false
      }
    })
    this._ActivatedRoute.parent?.paramMap
      .pipe(
        switchMap((params) => {
          this.riskID = Number(params.get('riskID'));
          this.assID = Number(params.get('assID'));
          console.log('riskID:', this.riskID, 'assID:', this.assID);

          return this._RiskService.getOneRiskAssessment(this.assID, this.assID);
        })
      )
      .subscribe((res: any) => {
        console.log('res', res);
        this.riskData = res.data;
      });
  }

  riskItems = [
    { label: 'Risk Impact', level: 'Very High', value: 27 },
    { label: 'Risk Likelihood', level: 'High', value: 27 },
    { label: 'Risk Level', level: 'Medium', value: 27 },
  ];
  QuantitativeItem = [
    { label: 'F001', level: 'Very High', value: 27 },
    { label: 'F002', level: 'High', value: 27 },
  ];

  loadingData: boolean = false;
  assID: any;
  riskID: any;
  approachedId= 3;
  // getRiskData() {
  //   this.loadingData = true;

  //   this._ActivatedRoute.paramMap
  //     .pipe(
  //       switchMap((params) => {

  //         this.riskID = Number(params.get('riskID'));
  //         this.assID = Number(params.get('assID'));
  //         console.log(this.riskID , this.assID);

  //         return this._RiskService.getOneRiskAssessment(this.assID , this.assID)
  //       })
  //     )
  //     .subscribe({
  //       next: (res:any) => {
  //         this.riskData = res.data;
  //         this.loadingData = false;
  //       },
  //       error: (err) => {
  //         console.error('Error:', err);
  //         this.loadingData = false;
  //       }
  //     });
  // }

  progressValues = [
    {
      value: 20,
      // background: 'linear-gradient(270.07deg, #9FCF82 0.08%, #6EA56E 99.96%)',
      background: 'linear-gradient(0deg, #6EA56E, #6EA56E)',
    },
    {
      value: 20,
      // background: 'linear-gradient(270.07deg, #CBD081 0.08%, #9FCF82 99.96%)',
      background: 'rgba(203, 208, 129, 1)',
    },
    {
      value: 20,
      // background:
      //   'linear-gradient(270.07deg, #E9B07A 0.08%, #E3CB83 44.74%, #D4CE82 99.96%)',
      background: 'rgba(233, 176, 122, 1)',
    },
    {
      value: 20,
      background: 'rgba(205, 104, 89, 0.94)',
      // background: 'linear-gradient(270.07deg, #E7A576 0.08%, #DE7B65 99.96%)',
      transform: 'rotate(-179.96deg)',
    },
    {
      value: 20,
      background: 'rgba(205, 104, 89, 1)',
      // background: 'linear-gradient(270.07deg, #DE7B65 0.08%, #CD6859 99.96%)',
      transform: 'rotate(-179.96deg)',
    },
  ];
  // progressValues = [
  //   {
  //     value: 20,
  //     background: 'linear-gradient(270.07deg, #9FCF82 0.08%, #6EA56E 99.96%)',
  //   },
  //   {
  //     value: 20,
  //     background: 'linear-gradient(270.07deg, #CBD081 0.08%, #9FCF82 99.96%)',
  //   },
  //   {
  //     value: 20,
  //     background:
  //       'linear-gradient(270.07deg, #E9B07A 0.08%, #E3CB83 44.74%, #D4CE82 99.96%)',
  //   },
  //   {
  //     value: 20,
  //     background: 'linear-gradient(270.07deg, #E7A576 0.08%, #DE7B65 99.96%)',
  //     transform: 'rotate(-179.96deg)',
  //   },
  //   {
  //     value: 20,
  //     background: 'linear-gradient(270.07deg, #DE7B65 0.08%, #CD6859 99.96%)',
  //     transform: 'rotate(-179.96deg)',
  //   },
  // ];

      hasActions:boolean = true;
  onFoundAction(event:boolean){
    this.hasActions = event;
    console.log('hasActions', this.hasActions);
  }
}
