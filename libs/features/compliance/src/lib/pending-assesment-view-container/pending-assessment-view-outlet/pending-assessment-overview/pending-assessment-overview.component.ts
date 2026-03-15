import { Breadcrumb } from './../../../../../../../../apps/gfw-portal/src/app/core/models/breadcrumb.model';
import { GoveranceService } from 'libs/features/covernance/src/service/goverance.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AccordionModule } from 'primeng/accordion';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ComplianceService } from 'libs/features/compliance/src/compliance/compliance.service';
import { SkeletonModule } from 'primeng/skeleton';
import { finalize, Subscription } from 'rxjs';
import { LoaderComponent } from "@gfw/shared-ui";

@Component({
  selector: 'lib-pending-assessment-overview',
  imports: [CommonModule, TranslateModule, AccordionModule, SkeletonModule, LoaderComponent],
  templateUrl: './pending-assessment-overview.component.html',
  styleUrl: './pending-assessment-overview.component.scss',
})
export class PendingAssessmentOverviewComponent implements OnInit, OnDestroy {
  // Declaration Variables
  statusCards: any;
  current_filters: any;
  data_sort: any;
  selected_type: any;
  getGovControlDataArray: any = {};
  loading: boolean = false;
  dataList: any[] = [];
  id: any;
  private subscription: Subscription = new Subscription();

  // Declaration Constructor
  constructor(
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _complianceService: ComplianceService,
    private GoveranceService: GoveranceService
  ) {
    console.log('hi from pending assessment overview....');
    
  }
  // Handle Breadcrumb
  handleBreadCrumb() {
    this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.Compliance'),
        icon: '',
        routerLink: '//gfw-portal/compliance/pending-assessments',
      },
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.Pending_Assessment'
        ),
        icon: '',
      },
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.Cybersecurity_Governance'
        ),
        icon: '',
      },
    ]);
  }
  // Handle GovControl Data
  getGovControlData() {
    const sub = this._complianceService.GovControlData$.subscribe((res) => {
      console.log("GovControlData$ changed" , res );

      this.getGovControlDataArray = res;
      this.id = this.getGovControlDataArray?.govControlID;
      this.statusCards = [
        {
          id: 1,
          icon: 'fi fi-br-tools',
          key: 'Implementation',
          value: this.getGovControlDataArray?.implementationStatusTypeName,
        },
        {
          id: 2,
          icon: 'fi fi-br-bank',
          key: 'Compliance',
          value: this.getGovControlDataArray?.complianceStatusTypeName,
        },
        {
          id: 3,
          icon: 'fi fi-rr-bullseye-arrow',
          key: 'Effectiveness',
          value: this.getGovControlDataArray?.effectivenessStatusTypeName,
        },
        {
          id: 4,
          icon: 'fi fi-br-stats',
          key: 'Maturity_Level',
          value: this.getGovControlDataArray?.maturityLevelName,
        },
      ];
      // this.selected_type = this.statusCards[0];
      this.handleSetSelectedType(this.statusCards[0])
    });
    this.subscription.add(sub);
  }
  // Handle selectType
  handleSetSelectedType(type: any) {
    // if (this.selected_type?.id === type.id) return;

    this.selected_type = type;
    this.GoveranceService.setSelectedTypeId(type.id);
    switch (type.id) {
      case 1:
        this.getImplementationControls();
        break;
      case 2:
        this.getGovControlCompliance();
        break;
      case 3:
        this.getGovControlEffective();
        break;
      case 4:
        this.getGovControlMaturity();
        break;
    }
  }
  // Handle GovControl Data Implementation
  getImplementationControls(event?: any) {
    this.loading = true;
    this.dataList = [];
    const sub = this.GoveranceService.getImplementationControls(
      this.data_sort,
      event?.currentPage ?? 1,
      event?.perPage ?? 10,
      this.current_filters,
      this.id
    )
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: any) => {
          this.dataList = [...(res?.data?.items || [])];
          this.loading = false;

        },

        error: (err: any) => {
          this.loading = false;
        },
      });
    this.subscription.add(sub);
  }
  // Handle GovControl Data Maturity
  getGovControlMaturity(event?: any) {
    this.loading = true;
    this.dataList = [];
    const sub = this.GoveranceService.getGovControlMaturity(
      this.data_sort,
      event?.currentPage ?? 1,
      event?.perPage ?? 10,
      this.current_filters,
      this.id
    )
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: any) => {
          this.dataList = [...(res?.data?.items || [])];
          this.loading = false;

        },

        error: (err: any) => {
          this.loading = false;
        },
      });
    this.subscription.add(sub);
  }
  // Handle GovControl Data Compliance
  getGovControlCompliance(event?: any) {
    this.loading = true;
    this.dataList = [];

    const sub = this.GoveranceService.getComplianceControls(
      this.data_sort,
      event?.currentPage ?? 1,
      event?.perPage ?? 10,
      this.current_filters,
      this.id
    )
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: any) => {
          this.dataList = [...(res?.data?.items || [])];
          this.loading = false;

        },

        error: (err: any) => {
          this.loading = false;
        },
      });
    this.subscription.add(sub);
  }
  // Handle GovControl Data Effective
  getGovControlEffective(event?: any) {
    this.loading = true;
    this.dataList = [];

    const sub = this.GoveranceService.getGovControlEffective(
      this.data_sort,
      event?.currentPage ?? 1,
      event?.perPage ?? 10,
      this.current_filters,
      this.id
    )
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: any) => {
          this.dataList = [...(res?.data?.items || [])];
          this.loading = false;

        },

        error: (err: any) => {
          this.loading = false;
        },
      });
    this.subscription.add(sub);
  }

  // Life Cycle Hooks
  ngOnInit(): void {
    this.getGovControlData();
    this.handleBreadCrumb();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
