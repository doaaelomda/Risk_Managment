import { NewTableComponent } from './../../../../../shared/shared-ui/src/lib/new-table/new-table.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import * as moment from 'moment';

// Shared imports
import { SharedUiComponent } from '@gfw/shared-ui';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';

// PrimeNG
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';

// Models
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';

// Service for Awareness list
import { AwarenessService } from '../../services/awareness.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-awareness-list',
  standalone: true,
  imports: [
    CommonModule,
    SharedUiComponent,
    TranslateModule,
    MenuModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    NewTableComponent
  ],
  templateUrl: './awareness-list.component.html',
  styleUrl: './awareness-list.component.scss',
})
export class AwarenessListComponent implements OnInit {
  // 🔹 Attributes
  routesParams: any;
  awarenessTitle: string = '';
  items: any[] = [];
  selected_profile_column = 0;
  defultProfile!: newProfile;
  awarenessColumns: newProfile[] = [];

  current_row_selected: any;
  actionDeleteVisible = false;
  loadingTable = true;
  loadDelted = false;

  dataTable: any[] = [];
  current_filters: any[] = [];
  sort_data: any;

  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };

  constructor(
    private _MessageService: MessageService,
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _SharedService: SharedService,
    private _TranslateService: TranslateService,
    private _AwarenessService: AwarenessService,
    public _PermissionSystemService:PermissionSystemService
  ) {
    const routeData = this._ActivatedRoute.snapshot.data;
    this.routesParams = routeData;

    this.awarenessTitle = this._TranslateService.instant('AWARENESS.TITLE');

    this._LayoutService.breadCrumbLinks.next([
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      {
        name: this._TranslateService.instant('AWARENESS.TITLE'),
        icon: '',
        routerLink: '/gfw-portal/awareness',
      },
      { name: this.awarenessTitle, icon: '' },
    ]);
  }

  ngOnInit(): void {
    this.items = [
      {
        label: this._TranslateService.instant('AWARENESS.VIEW'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._Router.navigate([
            '/gfw-portal/awareness/campaign',
            this.current_row_selected,
          ]);
        },
        visible: ()=> this._PermissionSystemService.can('AWARNESS' , 'CAMPAIGNS' , 'VIEW')
      },
      {
        label: this._TranslateService.instant('AWARENESS.compaginesetup'),
        icon: 'fi fi-rr-settings',
        command: () => {
          this._Router.navigate([
            '/gfw-portal/awareness/compagine-setup',
            this.current_row_selected,
          ]);
        },
        visible: ()=> this._PermissionSystemService.can('AWARNESS' , 'CAMPAIGNS' , 'SETUP')
      },
      {
        label: this._TranslateService.instant('AWARENESS.DELETE'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.handleShowDelete(true);
        },
        visible: ()=> this._PermissionSystemService.can('AWARNESS' , 'CAMPAIGNS' , 'DELETE')
      },
    ];

    this.loadAwarenessColumns();
  }

  // 🔹 Load columns
  loadAwarenessColumns() {
    this._SharedService.getDataEntityColumns(47).subscribe((res: any) => {
      this.defultProfile = {
        profileId: 0,
        profileName: 'Default Profile',
        isDefult: false,
        columns: res?.data?.columnDefinitions,
      };

      this.awarenessColumns = res?.data?.userColumnProfiles.map(
        (profile: newProfile) => ({
          ...profile,
          columns: profile.columns.map((col: any) => ({
            ...col,
            displayName: res?.data?.columnDefinitions?.find(
              (colD: any) => colD?.id == col?.id
            )?.label,
            dataMap: res?.data?.columnDefinitions?.find(
              (colD: any) => colD?.id == col?.id
            )?.dataMap,
          })),
        })
      );

      this.selected_profile_column = res?.data?.selectedProfileID;
    });

      // this.defultProfile = {
      //   profileId: 0,
      //   profileName: 'Default Profile',
      //   isDefult: false,
      //   columns: [
      //     {
      //       id: 1,
      //       label:'Compaigne Name',
      //       field: 'Compaigne Name',
      //       type: 'text',
      //       dataMap: [
      //         {
      //           key:'text',
      //           value:'name'
      //         }
      //       ],
      //       isShown: true,
      //       isResizable: true,
      //       isFixed: true,
      //     }
      //   ]
      // };

      // this.awarenessColumns = [this.defultProfile]

  }

  // 🔹 Pagination
  getAwarenessList(event?: any) {
    this.dataTable = [];
    this.loadingTable = true;
    this._AwarenessService
      .getAwarenessList(
        this.sort_data,
        event?.currentPage ?? 1,
        event?.perPage ?? 10,
        this.current_filters
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
        },
        error: () => {
          this.loadingTable = false;
        },
      });
  }

  // 🔹 Delete
  handleShowDelete(event: boolean) {
    this.actionDeleteVisible = event;
  }

  handleClosedDelete(event: boolean) {
    this.actionDeleteVisible = false;
  }

  setSelected(event: any) {
    this.current_row_selected = event;
  }

  deleteAwareness() {
    const awarenessId = this.current_row_selected;
    this.loadDelted = true;
    this._AwarenessService.deleteAwareness(awarenessId).subscribe({
      next: () => {
        this.loadDelted = false;
        this._MessageService.add({
          severity: 'success',
          detail: 'Awareness deleted successfully',
        });
        this.actionDeleteVisible = false;
        this.getAwarenessList(this.data_payload);
      },
      error: () => {
        this.loadDelted = false;
        this._MessageService.add({
          severity: 'error',
          detail: 'Failed to delete awareness',
        });
      },
    });
  }

data_payload:any

      columnControl: any = {
    type: 'route',
    data: '/gfw-portal/awareness/campaign',
  };

  handleDataTable(event: any) {
    this.data_payload = event;
    this.getAwarenessList(event);
  }


}
