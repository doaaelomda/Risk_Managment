import { SafeHtmlPipe } from './../../../../../../../apps/gfw-portal/src/app/core/pipes/safeHtml.pipe';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { finalize, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TextareaUiComponent } from '@gfw/shared-ui';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MeetingsService } from '../../../services/meetings.service';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MinutesService } from '../../../services/minutes.service';
import { AccordionModule } from 'primeng/accordion';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-minutes-list',
  imports: [
    CommonModule,
    TranslateModule,
    MenuModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    DialogModule,
    SkeletonModule,
    ReactiveFormsModule,
    FormsModule,
    UiDropdownComponent,
    InputSwitchModule,
    TextareaUiComponent,
    AccordionModule,
    SafeHtmlPipe,
  ],
  templateUrl: './minutes-list.component.html',
  styleUrl: './minutes-list.component.scss',
})
export class MinutesListComponent {
  constructor(
    private _MessageService: MessageService,
    private _Router: Router,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _activatedR: ActivatedRoute,
    private _minutesS: MinutesService,
    private _meetingS: MeetingsService,
    public _PermissionSystemService: PermissionSystemService
  ) {}

  // --------------------------
  // Attributes
  // --------------------------
  loadDeleted = false;
  items: any[] = [];
  selected_profile_column = 0;
  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  current_filters: any[] = [];
  sort_data: any;
  loadingTable = true;
  dataTable: any[] = [];
  current_row_selected: any;
  actionDeleteVisible = false;
  FEATURE_NAME = 'MINUTE';
  FEATURE_PLURAL_NAME = 'MINUTES';
  FEATURE_LIST_NAME = 'MINUTES_LIST';
  ENTITY_ID_NAME = 'meetingMinuteID';

  COLUMNS_ID = 57;
  DATA_VIEW_ID = 57;
  FILTERS_ID = 57;
  thirdPartyContactList: any[] = [];
  attendanceStatusList: any[] = [];
  usersList: any[] = [];
  rolesList: any[] = [];
  participantTypeList: any[] = [];
  visible_view: boolean = false;
  data!: any;
  agendas: any[] = [];
  getLookups() {
    this._SharedService.lookUps([194]).subscribe((res) => {
      console.log(res, 'got multi looks');
      this.agendas = res?.data?.MeetingAgenda;
    });
  }

  handleEmitSearchTerm(event: any) {}

  // --------------------------
  // Lifecycle
  // --------------------------
  breadCrumb: any;
  meetingDataSub$!: Subscription;

  handleBreadCrumb() {
    this.breadCrumb = [
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.MEETINGS'),
        icon: '',
        routerLink: '/gfw-portal/meetings',
      },
      {
        name: '-',
        icon: '',
      },
      {
        name: this._TranslateService.instant(
          'MEETINGS.' + this.FEATURE_PLURAL_NAME
        ),
        icon: '',
        routerLink: '',
      },
    ];

    this._LayoutService.breadCrumbLinks.next(this.breadCrumb);
    this.meetingDataSub$ = this._meetingS.current_meeting_data.subscribe(
      (res: any) => {
        this.breadCrumb[2].name = res?.name;
        this.breadCrumb[2].routerLink = `/gfw-portal/meetings/view/${res?.meetingID}/overview`;
        this.breadCrumb[3].routerLink = `/gfw-portal/meetings/view/${res?.meetingID}/minutes`;
      }
    );
  }
  ngOnDestroy(): void {
    this.meetingDataSub$.unsubscribe();
  }
  parentId!: any;
  ngOnInit(): void {
    this.getLookups();
    this.handleBreadCrumb();
    this._activatedR.parent?.paramMap.subscribe((res) => {
      console.log(res, 'params');
      this.parentId = Number(res?.get('id'));
      this.getData(null);
    });
    this.items = [
      {
        label: this._TranslateService.instant(
          'MEETINGS.VIEW_' + this.FEATURE_NAME
        ),
        icon: 'fi fi-rr-eye',
        command: () => {
          this.getById(this.current_row_selected);
        },
      },
      {
        label: this._TranslateService.instant(
          'MEETINGS.DELETE_' + this.FEATURE_NAME
        ),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.handleShowDelete(true);
        },
      },
      {
        label: this._TranslateService.instant(
          'MEETINGS.UPDATE_' + this.FEATURE_NAME
        ),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this.handleEdit();
        },
      },
    ];

    this.initForm();
  }

  getById(id: any) {
    this._minutesS.getMinutesById(id).subscribe((res) => {
      this.data = res?.data;
      this.visible_view = true;
    });
  }

  // --------------------------
  // Methods
  // --------------------------

  handleClosedDelete(event?: any) {
    this.actionDeleteVisible = false;
  }

  handleShowDelete(event: boolean) {
    this.actionDeleteVisible = true;
  }

  setSelected(event: any) {
    this.current_row_selected = event;
  }
  handleEdit() {
    this._minutesS
      .getMinutesById(this.current_row_selected)
      .subscribe((res) => {
        const attendanceData = res?.data;
        this.initForm(attendanceData);
        this.visible_save_dialog = true;
      });
  }
  visible_save_dialog: boolean = false;
  addLoading: boolean = false;
  add() {
    if (
      this.form.invalid && [
        this._PermissionSystemService.can('MEETING', 'MEETINGMINUTES', 'ADD') ||
          this._PermissionSystemService.can(
            'MEETING',
            'MEETINGMINUTES',
            'EDIT'
          ),
      ]
    )
      return;
    this.addLoading = true;
    this.form.get('phone')?.setValue(`${this.form.get('phone')?.value}`);
    this.form.get('mobile')?.setValue(`${this.form.get('mobile')?.value}`);
    this._minutesS
      .saveMinutes(this.form.value, this.parentId, this.current_row_selected)
      .subscribe({
        next: (res) => {
          this.addLoading = false;
          console.log(res, 'saved');
          const msg = this.current_row_selected ? 'updated' : 'saved';
          const title_case_feature_name = this.FEATURE_NAME.toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          this._MessageService.add({
            severity: 'success',
            detail: `${title_case_feature_name} ${msg} successfully`,
          });
          this.resetForm();
          this.getData();
        },
        error: (err) => {
          this.addLoading = false;
        },
      });
  }
  resetForm() {
    this.visible_save_dialog = false;
    this.current_row_selected = null;
    this.form.reset();
  }
  form!: FormGroup;
  initForm(data?: any) {
    this.form = new FormGroup({
      meetingAgendaID: new FormControl(
        data?.meetingAgendaID ?? null,
        Validators.required
      ),
      summary: new FormControl(data?.summary ?? null, Validators.required),
      decisions: new FormControl(data?.decisions ?? null, Validators.required),
    });
  }

  getData(event?: any) {
    this.dataTable = [];
    this.loadingTable = true;

    this._minutesS
      .getMinutesSearch(
        this.sort_data,
        event?.currentPage ?? 1,
        event?.perPage ?? 10,
        this.current_filters,
        this.parentId
      )
      .pipe(finalize(() => (this.loadingTable = false)))
      .subscribe({
        next: (res: any) => {
          this.dataTable = res?.data;
          this.pageginationObj = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this._SharedService.paginationSubject.next(this.pageginationObj);
        },
        error: () => (this.loadingTable = false),
      });
  }

  delete() {
    if (
      !this._PermissionSystemService.can('MEETING', 'MEETINGMINUTES', 'DELETE')
    )
      return;
    this.loadDeleted = true;
    this._minutesS
      .deleteMinutes(this.current_row_selected)
      .pipe(finalize(() => (this.loadDeleted = false)))
      .subscribe(() => {
        const title_case_feature_name = this.FEATURE_NAME.toLowerCase()
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: title_case_feature_name + ' deleted successfully',
        });
        this.resetForm();
        this.getData();
        this.handleClosedDelete();
      });
  }

  activeMinuteIndex: number = 0;
  setActiveMinute(activeIndex: any) {
    this.activeMinuteIndex = activeIndex;
    console.log(activeIndex, 'agenda changed');
  }
  handleActionClick(event: Event, action: 'edit' | 'delete', agenda: any) {
    event.stopPropagation();
    this.setSelected(agenda.meetingMinuteID);
    switch (action) {
      case 'edit': {
        this.handleEdit();
        break;
      }

      case 'delete': {
        this.handleShowDelete(true);
        break;
      }
    }
  }
}
