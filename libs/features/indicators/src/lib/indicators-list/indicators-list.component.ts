import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { LayoutService } from './../../../../../../apps/gfw-portal/src/app/core/services/layout.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { IndicatorService } from '../services/indicator.service';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-indicators-list',
  imports: [
    CommonModule,
    TranslateModule,
    MenuModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    NewTableComponent,
  ],
  templateUrl: './indicators-list.component.html',
  styleUrls: ['./indicators-list.component.scss'],
})
export class IndicatorsListComponent {

  // Properties

  routesParams: any;
  indicatorName: any;
  indicatorTypeID: any;
  data_payload: any;
  columnControl:any = { type: 'route' };
  loadDeleted: boolean = false;
  items: any[] = [];
  paginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  current_filters: any[] = []; // Current applied filters
  sort_data: any; // Current sort data
  loadingTable: boolean = true; // Loading state for table
  dataTable: any[] = []; // Table data
  current_row_selected: any; // Selected row id
  actionDeleteVisible: boolean = false; // Delete modal visibility


  // Constructor

  constructor(
    private _MessageService: MessageService,
    private _Router: Router,
    private _IndicatorService: IndicatorService,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _ActivatedRoute: ActivatedRoute,
    public _PermissionSystemService:PermissionSystemService
  ) {
    // Get route snapshot data
    const routeData = this._ActivatedRoute.snapshot.data;
    const permissionsObj = routeData['permissions']
    this.moduleName = permissionsObj?.module
    this.featureName = permissionsObj?.feature
    this.columnControl.data = this.moduleName ? `/gfw-portal/indicators/${this.moduleName.toLowerCase()}/` : '/gfw-portal/indicators'
    console.log(permissionsObj,'permissionsObj');
    const param = this._ActivatedRoute.parent?.snapshot.params;
    this.routesParams = routeData;

    // Set indicator name and breadcrumb based on route
    if (param) {
      this.indicatorName = this._TranslateService.instant('INDICATORS.INDICATOR');
      let indicatorRoute = `/gfw-portal/indicators/${routeData['routing']}/`;

      switch (routeData['routing']) {
        case 'KRI':
          this.indicatorName = this._TranslateService.instant('INDICATORS.KRI');
          indicatorRoute = `/gfw-portal/risks-management/KRI`;
          break;
        case 'KPI':
          this.indicatorName = this._TranslateService.instant('INDICATORS.KPI');
          indicatorRoute = `/gfw-portal/indicators/KPI`;
          break;
        case 'KCI':
          this.indicatorName = this._TranslateService.instant('INDICATORS.KCI');
          indicatorRoute = `/gfw-portal/compliance/KCI`;
          break;
        case 'KTI':
          this.indicatorName = this._TranslateService.instant('INDICATORS.KTI');
          indicatorRoute = `/gfw-portal/third-party/KTI`;
          break;
      }

      // Set breadcrumb links
      this._LayoutService.breadCrumbLinks.next([
        { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
        { name: this._TranslateService.instant('INDICATORS.INDICATOR'), icon: '', routerLink: indicatorRoute },
        { name: this.indicatorName, icon: '' },
      ]);
    }

    // Get query param for indicatorTypeID
    this._ActivatedRoute.queryParams.subscribe((params) => {
      this.indicatorTypeID = { indicatorTypeID: +params['indicatorTypeID'] };
    });

    

    
  }
  moduleName!:string
  featureName!:string


  // Lifecycle hooks

  ngOnInit(): void {
    // Initialize context menu items
    this.items = [
      {
        label: this._TranslateService.instant('INDICATORS.VIEW_INDICATOR'),
        icon: 'fi fi-rr-eye',
        command: () => {
          const url = this.moduleName ? `/gfw-portal/indicators/${this.moduleName.toLowerCase()}/` : '/gfw-portal/indicators'
          this._Router.navigate([url, this.current_row_selected]);
        },
        visible: ()=>this._PermissionSystemService.can(this.moduleName , this.featureName , 'VIEW')

      },
      {
        label: this._TranslateService.instant('INDICATORS.SETUP_INDICATOR'),
        icon: 'fi fi-rr-settings',
        command: () => {
          const urlParts = this._Router.url.split('/');
          const routing = urlParts[urlParts.length - 1];
                const url = this.moduleName ? `/gfw-portal/indicators/setup/${this.moduleName.toLowerCase()}/` : '/gfw-portal/indicators/setup'
          this._Router.navigate([url, this.current_row_selected], { queryParams: { routing } });
        },
        visible: ()=>this._PermissionSystemService.can(this.moduleName , this.featureName , 'EDIT')
      },
      {
        label: this._TranslateService.instant('INDICATORS.DELETE_INDICATOR'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.handleShowDelete(true);
        },
        visible: ()=>this._PermissionSystemService.can(this.moduleName , this.featureName , 'DELETE')
      },
    ];
  }


  // Table Actions

  handleDataTable(event: any) {
    console.log("table event" , event);

    this.data_payload = event;
    this.getIndicatorsDate(event);
  }

  setSelected(event: any) {
    this.current_row_selected = event;
  }


  // Delete Actions

  handleShowDelete(event: boolean) {
    this.actionDeleteVisible = true;
  }

  handleClosedDelete(event: boolean) {
    this.actionDeleteVisible = false;
  }

  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }

  deleteIndicator() {
    if(!this._PermissionSystemService.can(this.moduleName , this.featureName , 'DELETE'))return
    const indId = this.current_row_selected;
    this.loadDeleted = true;

    this._IndicatorService.deleteIndicator(indId).subscribe({
      next: () => {
        this.loadDeleted = false;
        this._MessageService.add({ severity: 'success', detail: 'Indicator deleted successfully' });
        this.closeDeleteModal();
        this.getIndicatorsDate();
      },
      error: () => {
        this.loadDeleted = false;
        this._MessageService.add({ severity: 'danger', detail: 'Failed to delete indicator' });
      },
    });
  }


  // API Calls

  getIndicatorsDate(event?: any) {
    this.dataTable = [];
    this.loadingTable = true;

    this._IndicatorService
      .getIndicatorsListNew(
        event,
        this.indicatorTypeID?.indicatorTypeID || this.routesParams?.indicatorTypeID
      )
      .pipe(finalize(() => (this.loadingTable = false)))
      .subscribe({
        next: (res: any) => {
          this.dataTable = res?.data?.items;
          this.paginationObj = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this._SharedService.paginationSubject.next(this.paginationObj);
          this.loadingTable = false;
        },
        error: () => {
          this.loadingTable = false;
        },
      });
  }
}
