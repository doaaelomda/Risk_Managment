import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
/* eslint-disable @nx/enforce-module-boundaries */
import { LayoutService } from './../../../../../../apps/gfw-portal/src/app/core/services/layout.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { AssetsService } from '../../services/assets.service';
import { finalize } from 'rxjs';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-assets',
  imports: [
    CommonModule,
    TranslateModule,
    MenuModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    DialogModule,
    SkeletonModule,
    NewTableComponent
  ],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.scss',
})
export class AssetsComponent implements OnInit {
  constructor(
    private _MessageService: MessageService,
    private _Router: Router,
    private _AssetsService: AssetsService,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.ASSETS'),
        icon: '',
        routerLink: '/gfw-portal/assets',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.ASSETS_LIST'),
        icon: '',
        routerLink: '/gfw-portal/assets/list',
      },
    ]);
  }

  handleClosedDelete(event: boolean) {
    this.actionDeleteVisible = false;
  }

  ngOnInit(): void {
    this.items = [
      {
        label: this._TranslateService.instant('ASSETS.VIEW_ASSET'),
        icon: 'fi fi-rr-eye',
        command: () => {
          // this.getByIdAssestes();
          this._Router.navigate(['/gfw-portal/assets/' + this.current_row_selected]);
        },
        visible: ()=> this._PermissionSystemService.can('ASSETS' , 'ASSETS' , 'VIEW')
      },
      {
        label: this._TranslateService.instant('ASSETS.DELETE_ASSET'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.handleShowDelete(true);
        },
        visible: ()=> this._PermissionSystemService.can('ASSETS' , 'ASSETS' , 'DELETE')
      },
      {
        label: this._TranslateService.instant('ASSETS.UPDATE_ASSET'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this._Router.navigate([
            '/gfw-portal/assets/edit',
            this.current_row_selected,
          ]);
        },
        visible: ()=> this._PermissionSystemService.can('ASSETS' , 'ASSETS' , 'EDIT')
      },
    ];
  }
  // attributes
  loadDelted: boolean = false;
  items: any[] = [];
  selected_profile_column: number = 0;
  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  ViewControlModal: boolean = false;
  current_filters: any[] = [];
  sort_data: any;
  loadingTable: boolean = true;
  dataTable: any[] = [];
  current_row_selected: any;
  actionDeleteVisible: boolean = false;
  AssestsData: any;
  assetsProfiles: newProfile[] = [];
  defultProfile!: newProfile;
  //  methods

  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }
  loadDataAssests: boolean = false;
  getByIdAssestes() {
    this.ViewControlModal = true;
    this.loadDataAssests = true;
    this.AssestsData = null;
    this._AssetsService
      .getAssetById(this.current_row_selected)
      .subscribe((res: any) => {
        this.AssestsData = res?.data;
        this.loadDataAssests = false;
      });

  }
  onViewModalAssets(event?: any) {
    this.loadDataAssests = true;
    this.ViewControlModal = true;
    this.AssestsData = null;
    this._AssetsService.getAssetById(event?.assetId).subscribe((res: any) => {
      this.AssestsData = res?.data;
      this.loadDataAssests = false;
    });

  }
  handleShowDelete(event: boolean) {
    this.actionDeleteVisible = true;
  }
  setSelected(event: any) {
    this.current_row_selected = event;
  }
  deleteAsset() {
    if(!this._PermissionSystemService.can('ASSETS' , 'ASSETS' , 'DELETE')) return;
    this.loadDelted = true;
    this._AssetsService
      .deleteAsset(this.current_row_selected)
      .pipe(finalize(() => (this.loadDelted = false)))
      .subscribe((res) => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Asset Deleted Successfully',
        });
        this.getAssetsData(this.data_payload);
        this.handleClosedDelete(false);
      });
  }

    columnControl: any = {
    type: 'route',
    data: '/gfw-portal/assets/asset',
  };

  handleDataTable(event: any) {
    this.data_payload = event;
    this.getAssetsData(event);
  }

  getAssetsData(payload?: any) {
       this.dataTable = [];
    this.loadingTable = true;
    this._AssetsService
      .getAssetsSearch(
        payload
      )
      .pipe(finalize(() => (this.loadingTable = false)))
      .subscribe({
        next: (res: any) => {
          this.dataTable = res?.data?.items;
          this.pageginationObj = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this._SharedService.paginationSubject.next(this.pageginationObj);
          this.loadingTable = false;
        },
        error: (err: any) => {
          this.loadingTable = false;
        },
      });
  }

  data_payload: any;
}
