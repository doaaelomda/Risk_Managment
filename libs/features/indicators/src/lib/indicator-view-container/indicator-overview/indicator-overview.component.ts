/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslateModule } from '@ngx-translate/core';
import { IndicatorService } from '../../services/indicator.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { DeleteConfirmPopupComponent } from "@gfw/shared-ui";
import { Button } from "primeng/button";
import { ActivatedRoute, Router } from '@angular/router';
import { OverlayPanelModule } from "primeng/overlaypanel";
import { MessageService } from 'primeng/api';
@Component({
  selector: 'lib-indicator-overview',
  imports: [CommonModule, SkeletonModule, TranslateModule, DeleteConfirmPopupComponent, Button, OverlayPanelModule],
  templateUrl: './indicator-overview.component.html',
  styleUrl: './indicator-overview.component.scss',
})
export class IndicatorOverviewComponent implements OnInit, OnDestroy {
  constructor(
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _IndicatorService: IndicatorService,
    private _router:Router,
    private _activatedRoute:ActivatedRoute,
    private messageService:MessageService,
    private route:ActivatedRoute
  ) {
            const module = this.route.parent?.snapshot.paramMap.get('module') ?? ''
        this.handleBreadCrumb(module)
  }

  actions: any[] = [];

  breadCrumb: any[] = [];
  indicatorSubscription$!: Subscription;
  actionDeleteVisible:boolean = false
      handleShowDelete(event: boolean) {
    this.actionDeleteVisible = true;
  }
    handleClosedDelete(event: boolean) {
    this.actionDeleteVisible = false;
  }
   closeDeleteModal() {
    this.actionDeleteVisible = false;
  }
    loadDelted: boolean = false;
    deleteIndicator() {
      const listRoute = '/gfw-portal/indicators/KPI'
    this.loadDelted = true;
      this._IndicatorService.deleteIndicator(this.indicatorId).subscribe({
        next:(res) =>{
          this.loadDelted= false
          this.messageService.add({severity:'success',detail:'indicator deleted successfully'})
          this._router.navigate([listRoute])
      },
      error:(err) => {
        this.loadDelted= false
          this.messageService.add({severity:'danger',detail:'failed to delete indicator'})
      }
      })
  }
  indicatorId:any = ''
  ngOnInit(): void {

    this._activatedRoute.parent?.paramMap.subscribe(res => {
      console.log(res,'params');

     this.indicatorId = res?.get('id')

    })
    this.actions = [
      {
        label: this._TranslateService.instant('INDICATORS.UPDATE_INDICATORL'),
        icon: 'fi fi-rr-pencil',
 command: () => {
  const routing = this._activatedRoute.snapshot.queryParams['routing'] || 'KPI';

  this._router.navigate(['/gfw-portal/indicators/edit', this.indicatorId, routing]);
}
      },
            {
        label: this._TranslateService.instant('INDICATORS.DELETE_INDICATOR'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.handleShowDelete(true);
        },
      },
    ];



  
    this.indicatorSubscription$ =
      this._IndicatorService.indicarotViwed.subscribe((res: any) => {
        console.log(res,'ss');

        this.current_indicator_data = res;
        this.breadCrumb[this.breadCrumb.length - 2].name = res?.code;
        this.breadCrumb[this.breadCrumb.length - 2].routerLink = `/gfw-portal/indicators/setup/${res?.indicatorID}`;
        this.isLoading = false;
      });
  }

  
  isLoading: boolean = true;

  current_indicator_data: any;

  ngOnDestroy(): void {
    this.indicatorSubscription$.unsubscribe();
  }


       handleBreadCrumb(module: string) {
    let listUrl = '/gfw-portal/indicators/KPI'
    switch(module){
      case 'risks':{
        listUrl = '/gfw-portal/risks-management/KRI'
      }break;
      case 'compliance':{
        listUrl = '/gfw-portal/compliance/KCI'
      }break;
      case 'thirdparties':{
        listUrl = '/gfw-portal/third-party/KTI'
      }break;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      default:'/gfw-portal/indicators/KPI'
    }
    this.breadCrumb = [
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('INDICATORS.INDICATOR'),
        icon: '',
        routerLink: listUrl,
      },
      {
        name: '-',
        icon: '',
      },
      {
        name: this._TranslateService.instant('INDICATORS.OVERVIEW'),
        icon: '',
        link: '',
      },
    ];
   
    this._LayoutService.breadCrumbLinks.next(this.breadCrumb);
  
  
  }
}
