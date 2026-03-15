import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { DeleteConfirmPopupComponent } from './../../../../../shared/shared-ui/src/lib/delete-confirm-popup/delete-confirm-popup.component';
import { StrategyService } from './../../../services/strategy.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as moment from 'moment';
import { finalize } from 'rxjs';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { LayoutService } from './../../../../../../apps/gfw-portal/src/app/core/services/layout.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { Router } from '@angular/router';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-strategy-plan-list',
  imports: [
    CommonModule,
    DeleteConfirmPopupComponent,
    TranslateModule,
    ButtonModule,
    MenuModule,
    NewTableComponent
  ],
  templateUrl: './strategy-plan-list.component.html',
  styleUrl: './strategy-plan-list.component.scss',
})
export class StrategyPlanListComponent implements OnInit {
  constructor(
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _MessageService: MessageService,
    private _SharedService: SharedService,
    private _StrategyService: StrategyService,
    private _Router: Router,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this._LayoutService.breadCrumbLinks.next([
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      {
        name: this._TranslateService.instant('STRATEGY.STRATEGY'),
        icon: '',
        routerLink: '/gfw-portal/strategy',
      },
      {
        name: this._TranslateService.instant('STRATEGY.STRATEGY_PLANS'),
        icon: '',
        routerLink: '/gfw-portal/strategy/plans',
      },
    ]);

  }
  translateKey = 'PLANS';
  singleTranslateKey = 'PLAN';
  entityID_Name = 'strategicPlanID';
  view_entityRouter = '/gfw-portal/strategy/plan';
  dataViewId = 48;
  filter_id_input = 48;
  dataEntityId = 48;
  total_items_input = 0;
  dataTable!: any[]
  sort_data: any;
  selected_profile_column: any;
  loadingTable = false;
  loadDelete = false;
  items: any[] = [];
  profiles: newProfile[] = [];
  defultProfile!: newProfile;
  current_row_selected: any;
  actionDeleteVisible = false;
  current_filters: any[] = [];
  pageginationObj = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
current_payload:any
handleDataTable(payload:any){
  this.current_payload = payload
  this.getData(payload)
}

  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }

  handleClosedDelete(event: boolean) {
    this.actionDeleteVisible = false;
  }
  handleItems() {
    this.items = [
      {
        label: this._TranslateService.instant(
          'STRATEGY.VIEW_' + this.singleTranslateKey
        ),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._Router.navigateByUrl(
            `/gfw-portal/strategy/plan/${this.current_row_selected}`
          );
        },
        visible: ()=>this._PermissionSystemService.can('STRATEGY' , 'PLAN' , 'VIEW')
      },
      {
        label: this._TranslateService.instant(
          'STRATEGY.UPDATE_' + this.singleTranslateKey
        ),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this._Router.navigateByUrl(
            `/gfw-portal/strategy/edit-plan/${this.current_row_selected}`
          );
        },
        visible: ()=>this._PermissionSystemService.can('STRATEGY' , 'PLAN' , 'EDIT')
      },
      {
        label: this._TranslateService.instant(
          'STRATEGY.DELETE_' + this.singleTranslateKey
        ),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.actionDeleteVisible = true;
        },
        visible: ()=>this._PermissionSystemService.can('STRATEGY' , 'PLAN' , 'DELETE')
      },
    ];
  }
  ngOnInit(): void {
    this.handleItems();
  }




  setSelected(event: any) {
    console.log(event);

    this.current_row_selected = event;
  }

  handleShowDelete(event: boolean) {
    this.actionDeleteVisible = true;
  }
  pagination: any;
  getData(event?: any) {
    // this.dataTable = []
    this.loadingTable = true;
    this._StrategyService
      .getStrategyPlansSearch(
        event
      )
      .pipe(finalize(() => (this.loadingTable = false)))
      .subscribe({
        next: (res: any) => {
          this.dataTable = res?.data?.items;
          this.total_items_input = this.dataTable?.length;
          this.loadingTable = false;
          this.pagination = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this._SharedService.paginationSubject.next(this.pagination);
        },
        error: (err: any) => {
          this.loadingTable = false;
        },
      });
  }


  isDeleteLoading: boolean = false;
  deleteItem() {
    this.isDeleteLoading = true;
    this._StrategyService.deletePlan(this.current_row_selected).subscribe({
      next: (res) => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Plan deleted successfully`,
        });
        this.isDeleteLoading = false;
        this.actionDeleteVisible = false;
        this.getData(this.current_payload);
      },
      error: (err) => {
        this.isDeleteLoading = false;
      },
    });
  }
}
