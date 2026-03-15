/* eslint-disable @nx/enforce-module-boundaries */
import { TranslationsService } from './../../../../../../apps/gfw-portal/src/app/core/services/translate.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { TasksService } from '../../services/tasks.service';
import * as moment from 'moment';
import { finalize, forkJoin } from 'rxjs';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { ViewModalComponent } from 'libs/features/risks/src/lib/viewModal/viewModal.component';
import { SkeletonModule } from 'primeng/skeleton';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
export interface ISummary {
  id: number;
  icon?: string;
  name: string;
  color: 'gray' | 'warning' | 'primaryColor' | 'error' | 'success' | 'blue';
  totalCount: number;
  active: boolean;
}
@Component({
  selector: 'lib-new-tasks',
  imports: [
    CommonModule,
    ViewModalComponent,
    SkeletonModule,
    NewTableComponent
  ],
  templateUrl: './new-tasks.component.html',
  styleUrl: './new-tasks.component.scss',
})
export class NewTasksComponent implements OnInit {
  constructor(
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _TranslationsService: TranslationsService,
    private _tasksService: TasksService,
    private _RiskService: RiskService,
    private _sharedService: SharedService,
    public _PermissionSystemService:PermissionSystemService,
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.loadResponseActionData(null);
    this.initBreadCrumb();
    this.initTasksTypes();
    this.checkSelectedLang();
  }

  initTasksTypes() {
    this.tasksTypes = [
      { name: this._TranslateService.instant('BUTTONS.MY_TASKS'), id: 2 },
      {
        name: this._TranslateService.instant('BUTTONS.TASKS_TO_VERIFY'),
        id: 3,
      },
    ];
  }

  initBreadCrumb() {
    this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.MANAGEMENT'),
        icon: '',
        routerLink: '/gfw-portal/management',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.TASKS'),
        icon: '',
        routerLink: '',
      },
    ]);

        this.items = [
      {
        label: this._TranslateService.instant('Items.View_Task'),
        icon: 'fi fi-rr-eye',
        command: () => {
          const event = {
            businessTaskID:this.entityId
          }
          this.openViewModal(event)

        },
        visible:()=> this._PermissionSystemService.can('MANAGEMENT' , 'TASKS' , 'VIEW')
      },
    ];
  }

  selectedLang: string = 'en';
  checkSelectedLang() {
    this.selectedLang = this._TranslationsService.getSelectedLanguage();
  }

  tasksTypes: { name: string; id: number }[] = [];
  currentTaskType: number = 2;
  fileUsageTypeId=10
  tasksCategories: { id: number; name: string; icon: string }[] = [];
  currentTaskCategory!: { id: number; name: string; icon: string };
  currentSummary: any;
  changeTaskCategory(category: { id: number; name: string; icon: string }) {
    this.currentTaskCategory = category;
    // this.getSummary();
    this.getTasksData();
  }


  handledHideEmiter(event: boolean) {
    this.isDialogVisible = false;
    this.singleTaskData = null
  }

  changeTasksType(id: number) {
    this.currentTaskType = id;
    this.getTasksData();
  }
  singleTaskData!: any;
  isDialogVisible: boolean = false;
  openViewModal(event: any) {
    console.log("Opening view modal" , event );

    const taskId = event?.businessTaskID;
    if (!taskId) return;
    this.isDialogVisible = event;
    console.log(event, 'test modal');
    this._tasksService.getTaskById(taskId).subscribe((res: any) => {
      const data = res?.data;
      this.singleTaskData = data;
      console.log('got task', res?.data);
    });

  }

  current_filters: any = [];
  sort_data: any;
  total_items_input: any;
  entityID!: number;
  getTasksData(event?: any) {
    console.log("Event Tasks " , event);

    this.tasksData = [];
    this.loading = true;

    this._tasksService
      .getEntitiesSearch(
        this.sort_data,
        this.searchTerm,
        event?.pageNumber,
        event?.pageSize,
        this.current_filters,
        this.entityID,
        1,
        this.currentTaskCategory.id,
        this.currentTaskType,
        false,
        this.currentSummary?.id
      )
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res: any) => {
        this.getSummary(
          this.sort_data,
          this.searchTerm,
          event?.pageNumber,
          event?.pageSize,
          this.current_filters,
          this.entityID,
          1,
          this.currentTaskCategory.id,
          this.currentTaskType,
          false,
          this.currentSummary?.id
        );
        this.tasksData = res?.data?.items;
        this.pageginationObj = {
          perPage: res?.data?.pageSize,
          currentPage: res?.data?.pageNumber,
          totalItems: res?.data?.totalCount,
          totalPages: res?.data?.totalPages,
        };
        this._sharedService.paginationSubject.next(this.pageginationObj);
        this.total_items_input = this.tasksData?.length;
        console.log(this.total_items_input, 'this.total_items_input');
      });
  }
  getSummaryClasses(
    color: 'gray' | 'warning' | 'primaryColor' | 'error' | 'success' | 'blue'
  ): string[] {
    const bgMap = {
      gray: 'bg-gray-100',
      warning: 'bg-warning-100',
      primaryColor: 'bg-primaryColor-100',
      error: 'bg-error-100',
      success: 'bg-success-100',
      blue: 'bg-blue-100',
    };
    const textMap = {
      gray: 'text-gray-600',
      warning: 'text-warning-600',
      primaryColor: 'text-primaryColor-600',
      error: 'text-error-600',
      success: 'text-success-600',
      blue: 'text-blue-600',
    };
    return [bgMap[color], textMap[color]];
  }

  hoverBgMap: Record<
    'gray' | 'warning' | 'primaryColor' | 'error' | 'success' | 'blue',
    string
  > = {
    gray: 'hover:bg-gray-50',
    warning: 'hover:bg-warning-50',
    primaryColor: 'hover:bg-primaryColor-50',
    error: 'hover:bg-error-50',
    success: 'hover:bg-success-50',
    blue: 'hover:bg-blue-50',
  };

  getTextColor(
    color: 'gray' | 'warning' | 'primaryColor' | 'error' | 'success' | 'blue'
  ): string {
    const textMap = {
      gray: 'text-gray-600',
      warning: 'text-warning-600',
      primaryColor: 'text-primaryColor-600',
      error: 'text-error-600',
      success: 'text-success-600',
      blue: 'text-blue-600',
    };
    return textMap[color];
  }
  loadedSummaries: boolean = false;
  getSummary(
    sort_data: any = null,
    searchTerm: string = '',
    pageNumber: number = 1,
    perPage: number = 10,
    filters: any,
    dataEntityID: any = 0,
    dataEntityTypeID: any = 0,
    BusinessTaskTypeID?: any,
    scopeID: any = 0,
    showDrafts?: any,
    executionStatusTypeID?: any
  ) {
    console.log(executionStatusTypeID,'executionStatusTypeID');

    this._tasksService
      .getSummary(
        sort_data,
        searchTerm,
        pageNumber,
        perPage,
        filters,
        dataEntityID,
        dataEntityTypeID,
        BusinessTaskTypeID,
        scopeID,
        showDrafts,
        executionStatusTypeID
      )
      .pipe(finalize(() => (this.loadedSummaries = true)))
      .subscribe((res) => {
        this.summaries = [
          {
            id: res.data.notStartedId || 1,
            icon: 'fi fi-rr-cross-circle',
            name: this._TranslateService.instant('Summary.NOT_STARTED'),
            color: 'gray',
            totalCount: res.data.notStarted,
            active: false,
          },

          {
            id: res.data.inProgressId || 2,
            icon: 'fi fi-rr-refresh',
            name: this._TranslateService.instant('Summary.IN_PROGRESS'),
            color: 'blue',
            totalCount: res.data.inProgress,
            active: false,
          },
          {
            id: res.data.approachingDueId || 3,
            icon: 'fi fi-rr-alarm-clock',
            name: this._TranslateService.instant('Summary.DUE_SOON'),
            color: 'warning',
            totalCount: res.data.approachingDue,
            active: false,
          },
          {
            id: res.data.completedId || 4,
            icon: 'fi fi-rr-check-circle',
            name: this._TranslateService.instant('Summary.COMPLETED'),
            color: 'success',
            totalCount: res.data.completed,
            active: false,
          },
          {
            id: res.data.completedOverdueId || 5,
            icon: 'fi fi-rr-info',
            name: this._TranslateService.instant('Summary.COMPLETE_OVERDUE'),
            color: 'error',
            totalCount: res.data.completedOverdue,
            active: false,
          },

          {
            id: res.data.lateId || 6,
            icon: 'fi fi-rr-time-delete',
            name: this._TranslateService.instant('Summary.LATE'),
            color: 'error',
            totalCount: res.data.late,
            active: false,
          },
        ];
        console.log(this.summaries, ' summaries ');
        const newActivatedSummary = this.summaries.find(
          (s) => s.id === this.currentSummary?.id
        );
        if (!newActivatedSummary) {
          this.currentSummary = null;
          return;
        }
        newActivatedSummary.active = true;
        this.currentSummary = newActivatedSummary;
      });
    //
  }
  loadingCategories: boolean = false;
  getCategories() {
    this.loadingCategories = true;
    this._tasksService
      .getCategories()
      .pipe(finalize(() => (this.loadingCategories = false)))
      .subscribe((res: any) => {
        this.tasksCategories = res?.data;
        this.currentTaskCategory = this.tasksCategories[0];
        // this.getSummary();
        console.log(res, ' got categories ');
      });
  }
  handleSort(event: any) {
    this.sort_data = event;
    this.getTasksData(event);
  }
  searchTerm: any = '';

  handleSearch(event: any) {
    this.searchTerm = event;
    this.getTasksData();
  }

  show_action: boolean = false;
  entityId: any;
  setSelected(event: any) {
    console.log('selected', event);
    this.entityId = event;
  }

  handleShowDelete(event: boolean) {
    this.show_action = true;
  }

  selected_profile_column: any;
  items: any[] = [];
  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  tasksData: any[] = [];
  loading: boolean = false;
  profiles: any = [];
  defultProfile: newProfile = {
    profileId: 0,
    profileName: 'Defult Profile',
    isDefult: true,
    columns: [],
  };

  loadResponseActionData(event?: any) {
    forkJoin([this._RiskService.getRisksProfile(4)]).subscribe((res: any[]) => {
      this.defultProfile = {
        profileId: 0,
        profileName: 'Defult Profile',
        isDefult: false,
        columns: res[0]?.data?.columnDefinitions,
      };

      this.profiles = res[0]?.data?.userColumnProfiles.map(
        (profile: newProfile) => {
          return {
            ...profile,
            columns: profile.columns.map((col: any, i) => {
              return {
                ...col,
                displayName: res[0]?.data?.columnDefinitions?.find(
                  (colD: any) => colD?.id == col?.id
                )?.dataMap,
                dataMap: res[0]?.data?.columnDefinitions?.find(
                  (colD: any) => colD?.id == col?.id
                )?.dataMap,
              };
            }),
          };
        }
      );

      this.selected_profile_column = res[0]?.data?.selectedProfileIDprisk;
    });
  }

  summaries: ISummary[] = [];

  changeCurrentSummary(summary: ISummary) {
    const sameSummary = this.currentSummary === summary;
    if (sameSummary) {
      this.currentSummary = null;
    } else {
      this.currentSummary = summary;
    }

    this.getTasksData();
    console.log(summary);
  }

   columnControl: any = {
    type: 'modal',
    data: '',
  };
  data_payload: any;
  handleDataTable(event: any) {
    this.data_payload = event;
    this.getTasksData(event);
  }
}
