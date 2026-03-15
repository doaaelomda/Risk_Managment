import { ViewModalComponent } from './../../../../risks/src/lib/viewModal/viewModal.component';
import { RiskService } from './../../../../risks/src/services/risk.service';
import { CommentSectionComponent } from './../../../../../shared/shared-ui/src/lib/comment-section/comment-section.component';
import { TagComponent } from './../../../../../shared/shared-ui/src/lib/tag/tag.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SharedUiComponent, AttachUiComponent } from '@gfw/shared-ui';
/* eslint-disable @nx/enforce-module-boundaries */
import { LayoutService } from './../../../../../../apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { AccordionModule } from 'primeng/accordion';
import { DialogModule } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { TasksService } from '../../services/tasks.service';
import { TranslationsService } from 'apps/gfw-portal/src/app/core/services/translate.service';
@Component({
  selector: 'lib-tasks',
  imports: [
    AccordionModule,
    CommonModule,
    SharedUiComponent,
    TranslateModule,
    DialogModule,
    ViewModalComponent,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent {
  constructor(
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _RiskService: RiskService,
    private _sharedService: SharedService,
    private _tasksService: TasksService,
    private _TranslationsService: TranslationsService
  ) {
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
  }
  ngOnInit() {
    this.loadResponseActionData(null);
    this.checkSelectedLang();
    // this.getBusinessTasks();
    this.taskFilterBtns = [
      { name: this._TranslateService.instant('BUTTONS.MY_TASKS'), id: 2 },
      {
        name: this._TranslateService.instant('BUTTONS.TASKS_TO_VERIFY'),
        id: 3,
      },
    ];
    this.items = [
      {
        label: this._TranslateService.instant('Items.View_Task'),
        icon: 'fi fi-rr-eye',
        command: () => {
          const selectedTask = this.tasksData?.filter(
            (task) => task?.businessTaskID == this.entityId
          )[0];

          this.openViewModal(selectedTask);
        },
      },
    ];

  }
  selectedLang: any = 'en';
  fileUsageTypeId=10
  checkSelectedLang() {
    this.selectedLang = this._TranslationsService.getSelectedLanguage();
    console.log(
      this._TranslationsService.getSelectedLanguage(),
      'this._TranslationsService.getSelectedLanguage()'
    );
  }
  getSummary(event?: any) {
    this._tasksService
      .getSummary(
           this.sort_data,
        this.searchTerm,
        event?.currentPage,
        event?.perPage,
        this.current_filters,
        this.entityID,
        1,
        this.currentBussinessTypeId,
        this.task_filter,
        false,
        this.currentSideFilter
      )
      .subscribe((res) => {
        console.log(res, 'here');
        const categories = res?.data;
        categories?.forEach((cat: any) => {
          cat.analysis = this.buildAnalysis(cat.businessTaskActions);
        });

        console.log(categories, 'categories here');
        this.categories = categories;

      });
  }

  getBusinessTasks() {
    this._tasksService.getBusinessTask().subscribe((res) => {
      console.log(res, 'resss');
    });
  }

  getBusinessTasksActions(
    businessTaskTypeID: any,
    BusinessTaskStatusActionID: any,
    forBusinessTaskOwner: boolean,
    forAssignee: boolean,
    forValidator: boolean
  ) {
    this._tasksService
      .getBusinessTasksActions(
        businessTaskTypeID,
        BusinessTaskStatusActionID,
        forBusinessTaskOwner,
        forAssignee,
        forValidator
      )
      .subscribe((res) => {
        console.log(res, 'got actions');
      });
  }

  riskId: any = '';
  riskChildId: any = '';
  task_filter: number = 2;
  taskFilterBtns: any[] = [];
  handleFilterBtnChange(btnId: any) {
    this.task_filter = btnId;
    this.getTasksData(null);
  }
  themeMap: Record<
    string,
    { bg: string; text: string; icon: string; wrapColor: string }
  > = {
    green: {
      bg: '#D1FADF',
      text: '#027A48',
      icon: '#12B76A',
      wrapColor: '#F6FEF9',
    },
    red: {
      bg: '#FEE4E2',
      text: '#B42318',
      icon: '#B42318',
      wrapColor: '#FFFBFA',
    },
    brown: {
      bg: '#FEF0C7',
      text: '#B54708',
      icon: '#B54708',
      wrapColor: '#FFFCF5',
    },
    default: {
      bg: '',
      text: '',
      icon: '',
      wrapColor: '',
    },
  };

  getTheme(theme: string) {
    return this.themeMap[theme] || this.themeMap['default'];
  }
  handleCatClick(catId: any) {
    console.log(catId, 'catId');

    if (this.currentSideFilter == catId) {
      this.currentSideFilter = null;
    } else {
      this.currentSideFilter = catId;
    }

    this.getTasksData(null);
  }

  buildAnalysis(summary: any) {
    if (!summary) return;
    return [
      {
        id: summary?.notStartedId,
        icon: 'fi fi-rr-cross-circle',
        title: this._TranslateService.instant('Summary.NOT_STARTED'),
        value: summary?.notStarted ?? 0,
        color: 'gray',
        bgActiveColor: '#f7f9fc',
      },
      {
        id: summary?.approachingDueId,
        icon: 'fi fi-rr-alarm-clock',
        title: this._TranslateService.instant('Summary.DUE_SOON'),
        value: summary?.approachingDue ?? 0,
        color: 'orange',
        bgActiveColor: '#fcf7e8',
      },
      {
        id: summary?.inProgressId,
        icon: 'fi fi-rr-refresh',
        title: this._TranslateService.instant('Summary.IN_PROGRESS'),
        value: summary?.inProgress ?? 0,
        color: 'blue',
        bgActiveColor: '#eaf5ff',
      },
      {
        id: summary?.completedOverdueId,
        icon: 'fi fi-rr-info',
        title: this._TranslateService.instant('Summary.COMPLETE_OVERDUE'),
        value: summary?.completedOverdue ?? 0,
        color: 'red',
        bgActiveColor: '#fef4f7',
      },
      {
        id: summary?.completedId,
        icon: 'fi fi-rr-check-circle',
        title: this._TranslateService.instant('Summary.COMPLETED'),
        value: summary?.completed ?? 0,
        color: 'green',
        bgActiveColor: '#f6fef9',
      },
      {
        id: summary?.lateId,
        icon: 'fi fi-br-time-delete',
        title: this._TranslateService.instant('Summary.LATE'),
        value: summary?.late ?? 0,
        color: 'red',
        bgActiveColor: '#fef4f7',
      },
    ];
  }

  categories: any[] = [];
  current_tab: any = '1';
  tabs = [
    { name: 'Overview', id: '1', icon: 'fi-rr-apps' },
    { name: 'Attachments', id: '2', icon: 'fi fi-rs-clip-file' },
    { name: 'Comments', id: '3', icon: 'fi fi-rs-comment-alt' },
  ];
  isDescExpanded = false;
  description = '';
  toggleReadMore() {
    this.isDescExpanded = !this.isDescExpanded;
  }
  users: any[] = [];

  handleActiveTab(tab: any) {
    this.current_tab = tab?.id;
  }
  active_cat: any = this.categories[0];

  handleActiveCat(event: number | number[]) {
    console.log('curent index', event);

    if (event != null) {
      const index = Array.isArray(event) ? event[0] : event;
      this.active_cat = this.categories[index];
      this.tasksData = [...this.tasksData];
    } else {
      this.active_cat = this.categories[0];
    }

    this.currentBussinessTypeId = this.active_cat?.id;
    this.currentSideFilter = null;


    this.getTasksData(null);
  }

  // hanled table tasks

  // properties
  selected_profile_column: any;
  items: any[] = [];
  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  tasksData: any[] = [
    {
      id: 1,
      title: 'Second ERP 	',
      progress: '60',
      isActive: true,
      date: new Date(),
      userName: 'Ibrahim Mohamed',
      userRole: 'Admin ',
      image: 'test',
    },
    {
      id: 1,
      title: 'Second ERP 	',
      progress: '60',
      isActive: true,
      date: new Date(),
      userName: 'Ibrahim Mohamed',
      userRole: 'Admin ',
      image: 'test',
    },
    {
      id: 1,
      title: 'Second ERP 	',
      progress: '60',
      isActive: true,
      date: new Date(),
      userName: 'Ibrahim Mohamed',
      userRole: 'Admin ',
      image: 'test',
    },
    {
      id: 1,
      title: 'Second ERP 	',
      progress: '60',
      isActive: true,
      date: new Date(),
      userName: 'Ibrahim Mohamed',
      userRole: 'Admin ',
      image: 'test',
    },
    {
      id: 1,
      title: 'Second ERP 	',
      progress: '60',
      isActive: true,
      date: new Date(),
      userName: 'Ibrahim Mohamed',
      userRole: 'Admin ',
      image: 'test',
    },
    {
      id: 1,
      title: 'Second ERP 	',
      progress: '60',
      isActive: true,
      date: new Date(),
      userName: 'Ibrahim Mohamed',
      userRole: 'Admin ',
      image: 'test',
    },
    {
      id: 1,
      title: 'Second ERP 	',
      progress: '60',
      isActive: true,
      date: new Date(),
      userName: 'Ibrahim Mohamed',
      userRole: 'Admin ',
      image: 'test',
    },
    {
      id: 1,
      title: 'Second ERP 	',
      progress: '60',
      isActive: true,
      date: new Date(),
      userName: 'Ibrahim Mohamed',
      userRole: 'Admin ',
      image: 'test',
    },
    {
      id: 1,
      title: 'Second ERP 	',
      progress: '60',
      isActive: true,
      date: new Date(),
      userName: 'Ibrahim Mohamed',
      userRole: 'Admin ',
      image: 'test',
    },
  ];
  loading: boolean = false;
  profiles: any = [];
  // defultProfile: newProfile = {
  //   profileId: 0,
  //   profileName: 'Defult Profile',
  //   isDefult: true,
  //   columns: [
  //     {
  //       id: 1,
  //       field: 'Task Title',
  //       type: 'text',
  //       dataMap: [
  //         {
  //           key: 'text',
  //           value: 'title',
  //         },
  //       ],
  //       isShown: true,
  //       isResizable: true,
  //       isFixed: false,
  //       isSortable: true,
  //       label: 'Task Title',
  //     },
  //     {
  //       id: 2,
  //       field: 'Progress',
  //       type: 'progress',
  //       dataMap: [
  //         {
  //           key: 'progress',
  //           value: 'progress',
  //         },
  //       ],
  //       isShown: true,
  //       isResizable: true,
  //       isFixed: false,
  //       isSortable: true,
  //       label: 'Progress',
  //     },
  //     {
  //       id: 3,
  //       field: 'Status',
  //       type: 'bool',
  //       dataMap: [
  //         {
  //           key: 'bool',
  //           value: 'isActive',
  //         },
  //       ],
  //       isShown: true,
  //       isResizable: true,
  //       isFixed: false,
  //       isSortable: true,
  //       label: 'Status',
  //     },
  //     {
  //       id: 4,
  //       field: 'Date',
  //       type: 'date',
  //       dataMap: [
  //         {
  //           key: 'date',
  //           value: 'date',
  //         },
  //       ],
  //       isShown: true,
  //       isResizable: true,
  //       isFixed: false,
  //       isSortable: true,
  //       label: 'Date',
  //     },
  //     {
  //       id: 5,
  //       field: 'Responsible Role',
  //       type: 'userCard',
  //       dataMap: [
  //         {
  //           key: 'image',
  //           value: 'image',
  //         },
  //         {
  //           key: 'title',
  //           value: 'userName',
  //         },
  //         {
  //           key: 'description',
  //           value: 'userRole',
  //         },
  //       ],
  //       isShown: true,
  //       isResizable: true,
  //       isFixed: false,
  //       isSortable: true,
  //       label: 'Responsible Role',
  //     },
  //   ],
  // };
  entityID: any = null;
  handleAccordionSelect(category: any) {
    console.log(category, 'category');

    this.entityID = category?.id;
    this.getTasksData(null);


  }
  loadResponseActionData(event?: any) {
    // forkJoin([this._RiskService.getRisksProfile(4)]).subscribe((res: any[]) => {
    //   this.defultProfile = {
    //     profileId: 0,
    //     profileName: 'Defult Profile',
    //     isDefult: false,
    //     columns: res[0]?.data?.columnDefinitions,
    //   };

    //   this.profiles = res[0]?.data?.userColumnProfiles.map(
    //     (profile: newProfile) => {
    //       return {
    //         ...profile,
    //         columns: profile.columns.map((col: any, i) => {
    //           return {
    //             ...col,
    //             displayName: res[0]?.data?.columnDefinitions?.find(
    //               (colD: any) => colD?.id == col?.id
    //             )?.dataMap,
    //             dataMap: res[0]?.data?.columnDefinitions?.find(
    //               (colD: any) => colD?.id == col?.id
    //             )?.dataMap,
    //           };
    //         }),
    //       };
    //     }
    //   );

    //   this.selected_profile_column = res[0]?.data?.selectedProfileIDprisk;

    //   this.loading = false;
    // });
  }

  isDialogVisible: boolean = false;
  risksProfiles: newProfile[] = [];
  singleTaskData: any = '';

  openViewModal(event: any) {
    this.isDialogVisible = event;
    console.log(event, 'test modal');
    const taskId = event?.businessTaskID;
    if (!taskId) return;
    this._tasksService.getTaskById(taskId).subscribe((res: any) => {
      const data = res?.data;
      this.singleTaskData = data;
      console.log('got task', res?.data);
    });
  }
  // methods
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
    this.getTasksData(null);

  }
  current_filters: any = [];
  sort_data: any;
  currentSideFilter: any = null;
  currentBussinessTypeId = null;
  total_items_input: any;
  getTasksData(event?: any) {
    this.tasksData = [];
    this.loading = true;

    this._tasksService
      .getEntitiesSearch(
        this.sort_data,
        this.searchTerm,
        event?.currentPage,
        event?.perPage,
        this.current_filters,
        this.entityID,
        1,
        this.currentBussinessTypeId,
        this.task_filter,
        false,
        this.currentSideFilter
      )
      .subscribe((res: any) => {
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

        this.loading = false;
        this.getSummary(event)
      });
  }
  handleSort(event: any) {
    this.sort_data = event;
    this.getTasksData(event);
  }
  searchTerm: any = '';

  handleSearch(event: any) {
    this.searchTerm = event;
    this.getTasksData(null);
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
}
