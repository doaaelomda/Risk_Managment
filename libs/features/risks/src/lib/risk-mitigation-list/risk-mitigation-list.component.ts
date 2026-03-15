/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { MenuModule } from 'primeng/menu';
import { Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { RiskService } from '../../services/risk.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import {  switchMap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-risk-mitigation-list',
  imports: [
    TranslateModule,
    CommonModule,
    MenuModule,
    RouterLink,
    DeleteConfirmPopupComponent,
    ButtonModule,
    NewTableComponent,
  ],
  templateUrl: './risk-mitigation-list.component.html',
  styleUrl: './risk-mitigation-list.component.scss',
})
export class RiskMitigationListComponent implements OnInit {
  constructor(
    private _router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _RiskService: RiskService,
    private _SharedService: SharedService,
    private _TranslateService: TranslateService,
    public _PermissionSystemService: PermissionSystemService
  ) {
    this._ActivatedRoute.parent?.paramMap
      .pipe(
        switchMap((res) => {
          this.current_risk_id = res.get('riskID');
          this.columnControl = {
            type: 'route',
            data: `/gfw-portal/risks-management/${this.current_risk_id}/mitigation-plans`,
          };
          return this._RiskService.getOneRisk(this.current_risk_id);
        })
      )
      .subscribe((res: any) => {
        this.riskTitle = res.data?.riskTitle;

        this._LayoutService.breadCrumbLinks.next([
          {
            name: '',
            icon: 'fi fi-rs-home',
            routerLink: '/',
          },
          {
            name: this._TranslateService.instant(
              'BREAD_CRUMB_TITLES.RISK_MANGEMENT'
            ),
            icon: '',
            routerLink: '/gfw-portal/risks-management/risks-list',
          },
          {
            name: this._TranslateService.instant(
              'BREAD_CRUMB_TITLES.RISK_LIST'
            ),
            icon: '',
            routerLink: '/gfw-portal/risks-management/risks-list',
          },
          {
            name: this.riskTitle || '---',
            icon: '',
            routerLink: `/gfw-portal/risks-management/risk/${this.current_risk_id}/overview`,
          },
          {
            name: this._TranslateService.instant('MIGITATION.Risk_PALN'),
            icon: '',
            routerLink: `/gfw-portal/risks-management/risks/${this.current_risk_id}/mitigation-plans`,
          },
        ]);
        this._LayoutService.breadCrumbAction.next(null);
      });
  }
  columnControl: any;

  riskTitle: string = '';
  ngOnInit(): void {
    this._SharedService.paginationSubject.next(this.pageginationObj);
    // this.getRiksProfiles();
    // this.getRiskData()

    this.items_table = [
      {
        label: this._TranslateService.instant('MIGITATION.VIEW_MITIGATION'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._router.navigate([
            `/gfw-portal/risks-management/${this.current_risk_id}/mitigation-plans/`,
            this.current_row_selected,
            'overview',
          ]);
        },
        visible:()=> this._PermissionSystemService.can('RISKS','TREATMENT','VIEW')
      },
      {
        label: this._TranslateService.instant('MIGITATION.DELETE_MITIGATION'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.actionDeleteVisible = true;
        },
        visible:()=> this._PermissionSystemService.can('RISKS','TREATMENT','DELETE')
      },
      {
        label: this._TranslateService.instant('MIGITATION.UPDATE_MITIGATION'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this._router.navigate([
            `/gfw-portal/risks-management/risk/${this.current_risk_id}/mitigation-action/${this.current_row_selected}`,
          ]);
        },
        visible:()=> this._PermissionSystemService.can('RISKS','TREATMENT','EDIT')
      },
    ];
  }
  current_risk_id: any;
  actionDeleteVisible: boolean = false;
  current_row_selected: any;
  setSelected(event: any) {
    console.log('selected', event);
    this.current_row_selected = event;
  }
  items_table: any[] = [];

  // /gfw-portal/risks-management/risk/${current_risk_id}/mitigation-action
  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };

  migitaion_profile: newProfile[] = [];

  dataTable: any[] = [];

  handleDataTable(event: any) {
    this.data_payload = event;
    this.getRiskMitagationData(event);
  }

  data_payload: any;
  getRiskMitagationData(payload?: any) {
    this.dataTable = [];
    this.loading = true;

    this._RiskService
      .getRiskMitgationSearchNew(payload, this.current_risk_id)
      .subscribe((mitigationRes: any) => {
        this.dataTable = mitigationRes?.data?.items;

        this.pageginationObj = {
          perPage: mitigationRes?.data?.pageSize,
          currentPage: mitigationRes?.data?.pageNumber,
          totalItems: mitigationRes?.data?.totalCount,
          totalPages: mitigationRes?.data?.totalPages,
        };

        this._SharedService.paginationSubject.next(this.pageginationObj);
        this.loading = false;
      });
  }

  loading: boolean = true;

  items: any[] = [
    {
      items: [
        {
          label: 'Quik Add',
          command: () => {
            //
          },
        },
        {
          label: 'Add New Plan',
          command: () => {
            //
          },
        },
      ],
    },
  ];
  loadDelted: boolean = false;
  deleteRiskMitagtion() {
    if(!this._PermissionSystemService.can('RISKS','TREATMENT','DELETE'))return;
    this.loadDelted = true;
    this._RiskService
      .deleteRiskMitgation(this.current_row_selected)
      .subscribe((res) => {
        this.getRiskMitagationData();
        this.actionDeleteVisible = false;
        this.loadDelted = false;
      });
  }

  handleClosedDelete(event: boolean) {
    this.actionDeleteVisible = false;
  }
}
