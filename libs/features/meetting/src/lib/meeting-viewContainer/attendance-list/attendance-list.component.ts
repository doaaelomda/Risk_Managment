import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { finalize, Subscription } from 'rxjs';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { RoleDropdownComponent, UserDropdownComponent } from '@gfw/shared-ui';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { AttendanceService } from '../../../services/attendance.service';
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
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-attendance-list',
  standalone: true,
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
    RoleDropdownComponent,
    UserDropdownComponent,
    InputSwitchModule,
    NewTableComponent,
  ],
  templateUrl: './attendance-list.component.html',
  styleUrl: './attendance-list.component.scss',
})
export class AttendanceListComponent implements OnInit {
  constructor(
    private _MessageService: MessageService,
    private _Router: Router,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _activatedR: ActivatedRoute,
    private _attendanceS: AttendanceService,
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

  FEATURE_NAME = 'ATTENDANCE';
  FEATURE_PLURAL_NAME = 'ATTENDANCE';
  FEATURE_LIST_NAME = 'ATTENDANCE_LIST';
  ENTITY_ID_NAME = 'meetingAttendeeID';

  COLUMNS_ID = 125;
  DATA_VIEW_ID = 125;
  FILTERS_ID = 125;
  thirdPartyContactList: any[] = [];
  attendanceStatusList: any[] = [];
  usersList: any[] = [];
  rolesList: any[] = [];
  participantTypeList: any[] = [];
  visible_view: boolean = false;
  data!: any;
  getLookups() {
    this._SharedService.lookUps([156, 139, 138]).subscribe((res) => {
      console.log(res, 'got multi looks');
      this.thirdPartyContactList = res?.data?.ThirdPartyContact;
      this.participantTypeList = res?.data?.MeetingParticipantType;
      this.attendanceStatusList = res?.data?.MeetingAttendanceStatusType;
    });
    this._SharedService.getRoleLookupData().subscribe((res) => {
      console.log(res, 'got roles');
      this.rolesList = res?.data;
    });
    this._SharedService.getUserLookupData().subscribe((res) => {
      console.log(res, 'got users');

      this.usersList = res?.data;
    });
  }

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
        name: this._TranslateService.instant('MEETINGS.' + this.FEATURE_NAME),
        icon: '',
        routerLink: '',
      },
    ];

    this._LayoutService.breadCrumbLinks.next(this.breadCrumb);
    this.meetingDataSub$ = this._meetingS.current_meeting_data.subscribe(
      (res: any) => {
        this.breadCrumb[2].name = res?.name;
        this.breadCrumb[2].routerLink = `/gfw-portal/meetings/view/${res?.meetingID}/overview`;
        this.breadCrumb[3].routerLink = `/gfw-portal/meetings/view/${res?.meetingID}/attendance`;
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
      this.getSummary();
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
        visible: () =>
          this._PermissionSystemService.can(
            'MEETING',
            'MEETINGATTENDANCE',
            'VIEW'
          ),
      },
      {
        label: this._TranslateService.instant(
          'MEETINGS.DELETE_' + this.FEATURE_NAME
        ),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.handleShowDelete(true);
        },
        visible: () =>
          this._PermissionSystemService.can(
            'MEETING',
            'MEETINGATTENDANCE',
            'DELETE'
          ),
      },
      {
        label: this._TranslateService.instant(
          'MEETINGS.UPDATE_' + this.FEATURE_NAME
        ),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this.handleEdit();
        },
        visible: () =>
          this._PermissionSystemService.can(
            'MEETING',
            'MEETINGATTENDANCE',
            'EDIT'
          ),
      },
    ];
    this.initForm();
    this.handleParticipantTypeChange();
  }

  handleParticipantTypeChange() {
    const roleID = this.form.get('roleID');
    const thirdPartyContactID = this.form.get('thirdPartyContactID');
    const userID = this.form.get('userID');
    this.form
      .get('meetingParticipantTypeID')
      ?.valueChanges.subscribe((value) => {
        switch (value) {
          case 1: {
            thirdPartyContactID?.setValue(null);
            roleID?.setValue(null);
            break;
          }
          case 2: {
            thirdPartyContactID?.setValue(null);
            userID?.setValue(null);

            break;
          }
          case 3: {
            roleID?.setValue(null);
            userID?.setValue(null);
            break;
          }
          default: {
            roleID?.setValue(null);
            userID?.setValue(null);
            thirdPartyContactID?.setValue(null);
          }
        }
      });
  }

  getById(id: any) {
    this._attendanceS.getAttendanceById(id).subscribe((res) => {
      this.data = res?.data;
      console.log(this.data, 'data by id');

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
    this._attendanceS
      .getAttendanceById(this.current_row_selected)
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
        this._PermissionSystemService.can(
          'MEETING',
          'MEETINGATTENDANCE',
          'ADD'
        ) ||
          this._PermissionSystemService.can(
            'MEETING',
            'MEETINGATTENDANCE',
            'EDIT'
          ),
      ]
    )
      return;
    this.addLoading = true;
    this.form.get('phone')?.setValue(`${this.form.get('phone')?.value}`);
    this.form.get('mobile')?.setValue(`${this.form.get('mobile')?.value}`);
    this._attendanceS
      .saveAttendance(this.form.value, this.parentId, this.current_row_selected)
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
          this.getData(this.data_payload);
        },
        error: (err) => {
          this.addLoading = false;
        },
      });
  }
  resetForm() {
    this.visible_save_dialog = false;
    this.current_row_selected = null;
    this.initForm();
  }
  form!: FormGroup;
  initForm(data?: any) {
    this.form = new FormGroup({
      meetingParticipantTypeID: new FormControl(
        data?.meetingParticipantTypeID ?? 1,
        Validators.required
      ),
      userID: new FormControl(data?.userID ?? null),
      roleID: new FormControl(data?.roleID ?? null),
      thirdPartyContactID: new FormControl(data?.thirdPartyContactID ?? null),
      isMandatory: new FormControl(data?.isMandatory ?? false),
      meetingAttendanceStatusTypeID: new FormControl(
        data?.meetingAttendanceStatusTypeID ?? null,
        Validators.required
      ),
    });
  }

  getAttendanceHeader(item: any) {
    return item?.meetingParticipantTypeID === 1
      ? item?.userName
      : item?.meetingParticipantTypeID === 2
      ? item?.roleName
      : item?.meetingParticipantTypeID === 3
      ? item?.thirdPartyContactName
      : '-';
  }

  validateSaveBtn() {
    const cannotSave =
      !this.form?.get('userID')?.value &&
      !this.form?.get('roleID')?.value &&
      !this.form?.get('thirdPartyContactID')?.value;
    return cannotSave;
  }
  handleModal(event: any) {
    console.log(event?.meetingID);

    this.getById(event?.meetingID);
  }
  data_payload: any;
  handleDataTable(event: any) {
    this.data_payload = event;
    this.getData(event);
  }
  columnControl: any;
  getData(event?: any) {
    this.dataTable = [];
    this.loadingTable = true;

    this._attendanceS
      .getAttendanceSearch(event, this.parentId)
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
        error: () => (this.loadingTable = false),
      });
  }

  delete() {
    if (
      !this._PermissionSystemService.can(
        'MEETING',
        'MEETINGATTENDANCE',
        'DELETE'
      )
    )
      return;
    this.loadDeleted = true;
    this._attendanceS
      .deleteAttendance(this.current_row_selected)
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
        this.getData(this.data_payload);
        this.handleClosedDelete();
      });
  }

  summary: { id: string; name: string; count: number }[] = [];

  gettingSummary: boolean = false;
  getSummary() {
    this.gettingSummary = true;
    this._attendanceS
      .getSummary(this.parentId)
      .pipe(finalize(() => (this.gettingSummary = false)))
      .subscribe({
        next: (res) => {
          console.log(res, ' got summary ');
          this.summary = res;
        },
      });
  }
}
