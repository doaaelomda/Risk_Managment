import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Router, RouterOutlet } from '@angular/router';
import { IndicatorService } from '../services/indicator.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap, tap } from 'rxjs';
@Component({
  selector: 'lib-indicator-view-indicator',
  imports: [CommonModule,RouterOutlet],
  templateUrl: './indicator-view-indicator.component.html',
  styleUrl: './indicator-view-indicator.component.scss',
})
export class IndicatorViewIndicatorComponent implements OnInit , OnDestroy{


  constructor( private _ActivatedRoute:ActivatedRoute,private _IndicatorService:IndicatorService,private _Router:Router   ,private _translateS:TranslateService){
    const path = this.lastPathSegment

    switch (path) {
      case 'overview':
        this.currentStep = 1
        break;

        case 'inputs':
          this.currentStep = 2

          break;
          case'formula':
          this.currentStep = 3;
          break;
          case'thresholdbland':
          this.currentStep = 4;
          break;

      default:
        break;
    }

  }



  get lastPathSegment(): string {
  const segments = this._Router.url.split('/');
  return segments.pop() || '';
}

  current_Indicator_data:any;

  indicatorSubscription!:Subscription;
  moduleName!:string
  ngOnInit(): void {



    this.indicatorSubscription = this._IndicatorService.indicarotViwed.subscribe((res:any)=>{
      this.current_Indicator_data = res
    })
    this._ActivatedRoute?.paramMap.pipe(
      switchMap(
        (res)=>{
          const id = res.get('id');
          this.moduleName = res.get('module') ?? ''
          this.handleSteps()
          if(!id) return [];
          return this._IndicatorService.getIndicatorById(res.get('id'))
        }
      )
    ).subscribe((res:any)=>{
      this._IndicatorService.setViewIndicator(res?.data)
      this.steps.forEach((step:any)=>{
        step.description = this.current_Indicator_data?.code
      })
    })
  }

  handleSteps(){
       this.steps = [
      {
        name: this._translateS.instant('INDICATORS.OVERVIEW'),
        id: 1,
        description:'-',
        icon: 'fi fi-rr-chart-line-up',
        command: () => {
          //
          this._Router.navigate([`/gfw-portal/indicators/setup/${this.moduleName}/${this.current_Indicator_data?.indicatorID}/overview`])
          this.currentStep = 1
        },
      },
      {
        name: this._translateS.instant('INDICATORS.INDICATOR_INPUTS'),
        id: 2,
        description: '-',
        icon: 'fi fi-rr-tools',
        command: () => {
          //
                    this._Router.navigate([`/gfw-portal/indicators/setup/${this.moduleName}/${this.current_Indicator_data?.indicatorID}/inputs`])
                    this.currentStep = 2

        },
      },
      {
        name: this._translateS.instant('INDICATORS.FORMULA'),
        id: 3,
        description:'-',
        icon: 'fi fi-rr-function',
        command:()=>{
              this._Router.navigate([`/gfw-portal/indicators/setup/${this.moduleName}/${this.current_Indicator_data?.indicatorID}/formula`])
                    this.currentStep = 3
        }
      },
      {
        name: this._translateS.instant('INDICATORS.THRESHOLDS'),
        id: 4,
        description: '-',
        icon: 'fi fi-rr-tools',
        command:()=>{
                     this._Router.navigate([`/gfw-portal/indicators/setup/${this.moduleName}/${this.current_Indicator_data?.indicatorID}/thresholdbland`])
                    this.currentStep = 4
        }
      },
    ];
  }

  steps: any[] = [];

  currentStep:any = 1;



  ngOnDestroy(): void {
    this.indicatorSubscription.unsubscribe()
  }

}
