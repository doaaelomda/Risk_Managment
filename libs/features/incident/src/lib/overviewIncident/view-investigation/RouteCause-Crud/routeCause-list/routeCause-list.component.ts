import { TranslateService } from '@ngx-translate/core';
/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiComponent, DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import * as moment from 'moment';
import { ButtonModule } from 'primeng/button';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { Router } from '@angular/router';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { MenuModule } from 'primeng/menu';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { IncidentService } from 'libs/features/incident/src/services/incident.service';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'lib-route-cause-list',
  imports: [
    CommonModule,
    TranslateModule,
    SharedUiComponent,
    DeleteConfirmPopupComponent,
    ButtonModule,
    MenuModule,
    SkeletonModule,
    DialogModule,
  ],
  templateUrl: './routeCause-list.component.html',
  styleUrl: './routeCause-list.component.scss',
})
export class RouteCauseListComponent implements OnInit {
  loadDeleted: boolean = false;
  actionDeleteVisible: boolean = false;
  items: any[] = [];
  selected_profile_column: number = 0;
  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  current_filters: any[] = [];
  sort_data: any;
  routesParams: any;
  loadingTable: boolean = true;
  dataTable: any[] = [];
  current_row_selected: any;
  RouteCauseLearnProfiles: newProfile[] = [];
  defultProfile!: newProfile;
  investigationId: any;

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _MessageService: MessageService,
    private _Router: Router,
    private _TranslateService: TranslateService,
    private _SharedService: SharedService,
    private _IncidentService: IncidentService
  ) {}
  incidentId: any;
  ngOnInit(): void {
    const routeData = this._ActivatedRoute.snapshot.data;
    const param = this._ActivatedRoute.parent?.snapshot.params;

    this.routesParams = routeData;
    if (param) {
      this.incidentId =
        this._ActivatedRoute.parent?.snapshot.paramMap.get('incidentId');
      this.investigationId =
  this._ActivatedRoute.parent?.snapshot.paramMap.get('investigationId') ||
  this._ActivatedRoute.parent?.snapshot.paramMap.get('riskID');

    }

    this.items = [
      {
        label: this._TranslateService.instant(
          'RooteCause.View_RouteCauseLearn'
        ),
        icon: 'fi fi-rr-eye',
        command: () => {
          this.onViewRouteCauses();
        },
      },
      {
        label: this._TranslateService.instant(
          'RooteCause.Delete_RouteCauseLearn'
        ),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.handleShowDelete(true);
        },
      },
      {
        label: this._TranslateService.instant(
          'RooteCause.Update_RouteCauseLearn'
        ),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this._Router.navigate(
            [
              `/gfw-portal/incident/${this.investigationId}/update-routeCause`,
              this.current_row_selected,

            ],
            {
            queryParams:{
              Routing:this.routesParams.RouteCauseLearn
            }
          }
          );
        },
      },
    ];

    this.loadRouteCauseLearnColumns();
  }

  loadRouteCauseLearnColumns() {
    this._SharedService.getDataEntityColumns(108).subscribe((res: any) => {
      this.defultProfile = {
        profileId: 0,
        profileName: 'Default Profile',
        isDefult: false,
        columns: res?.data?.columnDefinitions,
      };

      this.RouteCauseLearnProfiles = res?.data?.userColumnProfiles.map(
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
  }

  handleShowDelete(event: boolean) {
    this.actionDeleteVisible = true;
  }

  handleClosedDelete(event: boolean) {
    this.actionDeleteVisible = false;
  }

  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }

  setSelected(event: any) {
    this.current_row_selected = event;
  }

  handleSort(event: any) {
    this.sort_data = event;
    this.getActivitiesData();
  }

  handleFilter(event: any[]) {
    const filters = event.map((filter: any) => {
      if (filter?.filter_type?.filterType == 'Date') {
        if (filter?.firstValue != 18 && filter?.firstValue != 19) {
          return {
            filterID: filter?.filter_type?.filterId,
            filterCode: filter?.filter_type?.fieldName,
            operatorId: filter?.operator?.DataEntityTypeOperatorID,
            operatorCode: filter?.operator?.OperatorCode,
            firstValue: null,
            secondValue: null,
            dateOptionID: String(filter?.firstValue),
          };
        } else {
          const secod = filter?.secondValue;
          return {
            filterID: filter?.filter_type?.filterId,
            filterCode: filter?.filter_type?.fieldName,
            operatorId: filter?.operator?.DataEntityTypeOperatorID,
            operatorCode: filter?.operator?.OperatorCode,
            firstValue: Array.isArray(secod)
              ? moment(new Date(secod[0])).format('MM-DD-YYYY')
              : moment(new Date(secod)).format('MM-DD-YYYY'),
            secondValue: Array.isArray(secod)
              ? moment(new Date(secod[1])).format('MM-DD-YYYY')
              : null,
            dateOptionID: String(filter?.firstValue),
          };
        }
      } else {
        return {
          filterID: filter?.filter_type?.filterId,
          filterCode: filter?.filter_type?.fieldName,
          operatorId: filter?.operator?.DataEntityTypeOperatorID,
          operatorCode: filter?.operator?.OperatorCode,
          firstValue: String(filter?.firstValue),
          secondValue: null,
          dateOptionID: null,
        };
      }
    });

    this.current_filters = filters;
    this.getActivitiesData(null);
  }

  getActivitiesData(event?: any) {
    this.dataTable = [];
    this.loadingTable = true;
    this._IncidentService
      .getRouteCauseList(
        this.sort_data,
        event?.currentPage ?? 1,
        event?.perPage ?? 10,
        this.current_filters,
        this.investigationId,
        this.routesParams.dataEntityTypeID
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

  deleteRouteCauseLearn() {
    this.loadDeleted = true;
    this._IncidentService
      .deleteRouteCause(this.current_row_selected)
      .pipe(finalize(() => (this.loadDeleted = false)))
      .subscribe({
        next: () => {
          this.closeDeleteModal();
          this.getActivitiesData();

          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'RooteCause Deleted Successfully',
          });
        },
        error: () => {
          this.loadDeleted = false;
        },
      });
  }

  addRouteCauseLearn() {
    this._Router.navigate(
      [`/gfw-portal/incident/${this.investigationId}/add-routeCause`],
      {
        queryParams: { incidentId: this.incidentId,dataEntityTypeID:this.routesParams.dataEntityTypeID,Routing:this.routesParams.RouteCauseLearn },
      }
    );
  }
  showViewOptionPopup: boolean = false;
  loading: boolean = false;
  RouteCausesData: any;
  onViewRouteCauses(event?: any) {
    this.showViewOptionPopup = true;
    this.loading = true;
    this.RouteCausesData = null;
    this._IncidentService
      .getRouteCauseById(event?.rootCauseID || this.current_row_selected)
      .subscribe((res: any) => {
        this.RouteCausesData = res?.data;
        this.loading = false;
      });
  }
}
