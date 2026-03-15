import { TimeFormatterPipe } from './../../../../../../../apps/gfw-portal/src/app/core/pipes/time-formatter.pipe';
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
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { MeetingsService } from '../../../services/meetings.service';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { AgendaService } from '../../../services/agenda.service';
import { AccordionModule } from 'primeng/accordion';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-agenda-list',
  imports: [
    CommonModule,
    TranslateModule,
    MenuModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    DialogModule,
    SkeletonModule,
    InputTextComponent,
    ReactiveFormsModule,
    FormsModule,
    UiDropdownComponent,
    InputSwitchModule,
    InputNumberComponent,
    TextareaUiComponent,
    AccordionModule,
  ],
  templateUrl: './agenda-list.component.html',
  styleUrl: './agenda-list.component.scss',
})
export class AgendaListComponent {
  constructor(
    private _MessageService: MessageService,
    private _Router: Router,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _activatedR: ActivatedRoute,
    private _agentaS: AgendaService,
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
  FEATURE_NAME = 'AGENDA';
  FEATURE_PLURAL_NAME = 'AGENDA';
  FEATURE_LIST_NAME = 'AGENDA_LIST';
  ENTITY_ID_NAME = 'meetingAgendaID';

  COLUMNS_ID = 56;
  DATA_VIEW_ID = 56;
  FILTERS_ID = 56;

  presenters: any[] = [];

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
        this.breadCrumb[3].routerLink = `/gfw-portal/meetings/view/${res?.meetingID}/agenda`;
      }
    );
  }
  ngOnDestroy(): void {
    this.meetingDataSub$.unsubscribe();
  }
  parentId!: any;
  ngOnInit(): void {
    this.handleBreadCrumb();
    this._activatedR.parent?.paramMap.subscribe((res) => {
      console.log(res, 'params');
      this.parentId = Number(res?.get('id'));

      this._agentaS.getAttendeeNames(this.parentId).subscribe((res) => {
        this.presenters = res?.data;
        this.presenters = this.presenters.map((o) => ({
          ...o,
          displayName: o.userName || o.thirdPartyContactName || o.roleName,
        }));
      });
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

  handleActionClick(event: Event, action: 'edit' | 'delete', agenda: any) {
    event.stopPropagation();
    this.setSelected(agenda.meetingAgendaID);
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

  handleEdit() {
    this._agentaS.getAgendaById(this.current_row_selected).subscribe((res) => {
      const AgendaData = res?.data;
      this.initForm(AgendaData);
      this.visible_save_dialog = true;
    });
  }
  visible_save_dialog: boolean = false;
  addLoading: boolean = false;
  add() {
     if (
      this.form.invalid && [
        this._PermissionSystemService.can('MEETING', 'MEETINGAGENDA', 'ADD') ||
          this._PermissionSystemService.can(
            'MEETING',
            'MEETINGAGENDA',
            'EDIT'
          ),
      ]
    )
      return;
    this.addLoading = true;
    this.form.get('phone')?.setValue(`${this.form.get('phone')?.value}`);
    this.form.get('mobile')?.setValue(`${this.form.get('mobile')?.value}`);
    this._agentaS
      .saveAgenda(this.form.value, this.parentId, this.current_row_selected)
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
          this.current_row_selected = null;
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
      name: new FormControl(data?.name ?? null, Validators.required),
      meetingAttendeeID: new FormControl(data?.meetingAttendeeID ?? null),
      expectedDurationMinutes: new FormControl(
        data?.expectedDurationMinutes ?? null,
        [Validators.required, Validators.min(1)]
      ),
      notes: new FormControl(data?.notes ?? null),
    });
  }

  data!: any;
  visible_view: boolean = false;
  getById(id: any) {
    this._agentaS.getAgendaById(id).subscribe((res) => {
      this.data = res?.data;
      this.visible_view = true;
    });
  }
  getData(event?: any) {
    this.dataTable = [];
    this.loadingTable = true;

    this._agentaS
      .getAgendaSearch(
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
          this.getSummary();
          this._SharedService.paginationSubject.next(this.pageginationObj);
        },
        error: () => (this.loadingTable = false),
      });
  }

  delete() {
    if (
      !this._PermissionSystemService.can('MEETING', 'MEETINGAGENDA', 'DELETE')
    )
      return;
    this.loadDeleted = true;
    this._agentaS
      .deleteAgenda(this.current_row_selected)
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
        this.getData();
        this.handleClosedDelete();
      });
  }

  summary: { id: number; name: string; count: number|string }[] = [];
  gettingSummary: boolean = false;
  getSummary() {
    this.summary = []
    const totalItems = {
      id: 1,
      name: this._TranslateService.instant('MEETINGS.AGENDA_ITEMS'),
      count: this.dataTable.length,
    };
    const totalMinutes = this.dataTable.reduce(
      (prev, current) => prev + current.expectedDurationMinutes,
      0
    );
    const timeFormatterPipe = new TimeFormatterPipe();

    const totalEstTime = {
      id: 2,
      name: this._TranslateService.instant('MEETINGS.TOTAL_EST_TIME'),
      count: timeFormatterPipe.transform(totalMinutes,'minutes','hh:mm'),
    };
    this.summary.push(totalItems,totalEstTime)
  }
  activeAgendaIndex: number = 0;
  setActiveAgenda(activeIndex: any) {
    this.activeAgendaIndex = activeIndex;
    console.log(activeIndex, 'agenda changed');
  }
}
