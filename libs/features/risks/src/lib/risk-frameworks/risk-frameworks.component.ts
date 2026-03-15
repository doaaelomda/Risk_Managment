import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import * as moment from 'moment';
import { finalize, forkJoin } from 'rxjs';
import { RiskService } from '../../services/risk.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SharedUiComponent } from '@gfw/shared-ui';
@Component({
  selector: 'lib-risk-frameworks',
  imports: [CommonModule, AccordionModule, SharedUiComponent, TranslateModule],
  templateUrl: './risk-frameworks.component.html',
  styleUrl: './risk-frameworks.component.scss',
})
export class RiskFrameworksComponent {
  constructor(
    private _RiskService: RiskService,
    private _SharedService: SharedService,
    private _TranslateService: TranslateService,
    private _router: Router
  ) {}
  viewText = 'Items.View_Risk';
  deleteText = 'Items.Delete_Risk';
  updateText = 'Items.Update_Risk';
  viewUrl = '/gfw-portal/risks-management/risk';
  updateUrl = '/gfw-portal/risks-management/risk-action';
  profilesId: any = 1;
  ngOnInit() {
    this.setActionItems();
    this.loadFrameWorks();
  }
  setActionItems() {
    this.items = [
      {
        label: this._TranslateService.instant(this.viewText),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._router.navigate([this.viewUrl, this.current_row_selected]);
        },
      },
      {
        label: this._TranslateService.instant(this.deleteText),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.actionDeleteVisible = true;
        },
      },
      {
        label: this._TranslateService.instant(this.updateText),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this._router.navigate([this.updateUrl, this.current_row_selected]);
        },
      },
    ];
  }
  actionDeleteVisible: boolean = false;
  items: any[] = [];
  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  frameWorksProfiles: newProfile[] = [];
  defultProfile!: newProfile;
  current_filters: any = [];
  sort_data: any;
  dataList: any = [];
  isGettingData: boolean = false;
  selected_profile_column: number = 0;
  current_row_selected: any = '';
  setSelected(event: any) {
    this.current_row_selected = event;
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
    this.getFrameWorkData(null, this.currentApiUrl);
  }
  currentApiUrl = '';
  handleShowDelete(event: boolean) {
    console.log('delte emited', event);

    this.actionDeleteVisible = true;
  }
  handleSort(event: any) {
    this.sort_data = event;
    this.isGettingData = true;
    this.dataList = [];
    this._RiskService
      .getRiskSearch(
        this.sort_data,
        event?.currentPage ?? 1,
        event?.perPage ?? 10,
        this.current_filters
      )
      .pipe(finalize(() => (this.isGettingData = false)))
      .subscribe((res: any) => {
        this.dataList = res?.data?.items;
        this.pageginationObj = {
          perPage: res?.data?.pageSize,
          currentPage: res?.data?.pageNumber,
          totalItems: res?.data?.totalCount,
          totalPages: res?.data?.totalPages,
        };
        this._SharedService.paginationSubject.next(this.pageginationObj);
        this.isGettingData = false;
      });
  }
  getFrameWorkData(event?: any, url?: any) {
    if (!url) return;
    this.dataList = [];
    this.isGettingData = true;
    this._RiskService
      .getFrameWorkLists(
        url,
        this.sort_data,
        event?.currentPage ?? 1,
        event?.perPage ?? 10,
        this.current_filters
      )
      .pipe(finalize(() => (this.isGettingData = false)))
      .subscribe({
        next: (res: any) => {
          this.dataList = res?.data?.items;
          this.pageginationObj = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this._SharedService.paginationSubject.next(this.pageginationObj);
          this.isGettingData = false;
        },
        error: (err: any) => {
          this.isGettingData = false;
        },
      });
  }

  loadFrameWorks() {
    forkJoin([this._RiskService.getRisksProfile(this.profilesId)]).subscribe(
      (res: any[]) => {
        this.defultProfile = {
          profileId: 0,
          profileName: 'Defult Profile',
          isDefult: false,
          columns: res[0]?.data?.columnDefinitions,
        };

        this.frameWorksProfiles = res[0]?.data?.userColumnProfiles.map(
          (profile: newProfile) => {
            return {
              ...profile,
              columns: profile.columns.map((col: any, i) => {
                return {
                  ...col,
                  displayName: res[0]?.data?.columnDefinitions?.find(
                    (colD: any) => colD?.id == col?.id
                  )?.label,
                  dataMap: res[0]?.data?.columnDefinitions?.find(
                    (colD: any) => colD?.id == col?.id
                  )?.dataMap,
                };
              }),
            };
          }
        );

        this.selected_profile_column = res[0]?.data?.selectedProfileID;
      }
    );
  }
  activeIndex: number | null = null;
  toggleTab(tab: any) {
    setTimeout(() => {
      tab.isExpanded = !tab?.isExpanded;
    });
  }
  lists: any[] = [
    {
      id: 1,
      title: 'Availability Level',
      icon: 'fi fi-rr-cloud-share',
      table_setting: {
        apiUrl: 'Risks/Search',
        filter_id: 1,
        dataViewId: 5,
        profilesId: 1,
        badge_name: 'HEARDE_TABLE.Risk',
        table_name: 'BREAD_CRUMB_TITLES.RISK_LIST',
        btn_name: 'HEARDE_TABLE.Add_New_Level_Risk',
        entityID_Name: 'riskID',
        view_entityRouter: '/gfw-portal/risks-management/risk',
        viewText: 'Items.View_Risk',
        deleteText: 'Items.Delete_Risk',
        updateText: 'Items.Update_Risk',
        viewUrl: '/gfw-portal/risks-management/risk',
        updateUrl: '/gfw-portal/risks-management/risk-action',
      },
    },

    {
      id: 2,
      title: 'View Risk Framework',
      icon: 'fi fi-rr-department-structure',
      table_setting: {
        apiUrl: 'Roles/Search',
        filter_id: 5,
        dataViewId: 7,
        profilesId: 7,
        badge_name: 'SETTING.ROLES',
        table_name: 'SETTING.ROLE_LIST',
        btn_name: 'HEARDE_TABLE.Add_New_Level_Risk',
        entityID_Name: 'roleId',
        view_entityRouter:
          '/gfw-portal/setting/access-management/roles&permssions',
        viewText: 'SETTING.VIEW_ROLE',
        deleteText: 'SETTING.DELETE_ROLE',
        updateText: 'SETTING.UPDATE_ROLE',
        viewUrl: '/gfw-portal/setting/access-management/roles&permssions',
        updateUrl:
          '/gfw-portal/setting/access-management/roles&permssions/updaterole',
      },
    },
  ];

  handleAccordionChange(accordion: any, index: number, isOpen: boolean) {
    this.activeIndex = index;
    this.toggleTab(accordion);
    if (!isOpen) return;

    const settings = accordion?.table_setting;
    this.currentApiUrl = settings?.apiUrl;
    this.viewText = settings?.viewText;
    this.deleteText = settings?.deleteText;
    this.updateText = settings?.updateText;
    this.viewUrl = settings?.viewUrl;
    this.updateUrl = settings?.updateUrl;
    this.profilesId = settings?.profilesId;
    this.setActionItems();
    this.loadFrameWorks();
    this.getFrameWorkData(null, this.currentApiUrl);
    console.log(accordion, 'accordion data here');
  }
}
