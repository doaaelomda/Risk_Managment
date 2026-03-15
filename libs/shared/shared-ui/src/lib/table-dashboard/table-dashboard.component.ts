import { RiskService } from './../../../../../features/risks/src/services/risk.service';
/* eslint-disable @nx/enforce-module-boundaries */
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Component,
  input,
  OnChanges,
  output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { FilterDashboardComponent } from 'libs/features/dashboard/src/lib/filter-dashboard/filter-dashboard.component';
import { DropdownModule } from 'primeng/dropdown';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DashboardLayoutService } from 'libs/features/dashboard/src/services/dashboard-layout.service';
import { SharedUiComponent } from '../shared-ui/shared-ui.component';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { newProfile } from '../../models/newProfiles';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { SharedService } from '../../services/shared.service';
import { SharedDashboardTableComponent } from '../shared-dashboard-table/shared-dashboard-table.component';
import { Button } from 'primeng/button';
import { InputTextComponent } from '../input-text/input-text.component';
import { InputNumberComponent } from '../input-number/input-number.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'lib-table-dashboard',
  imports: [
    CommonModule,
    TranslateModule,
    SharedUiComponent,
    TableModule,
    DialogModule,
    FormsModule,
    FilterDashboardComponent,
    DropdownModule,
    SharedDashboardTableComponent,
    Button,
    InputTextComponent,
    ReactiveFormsModule,
    InputNumberComponent,
    InputSwitchModule,
  ],
  templateUrl: './table-dashboard.component.html',
  styleUrl: './table-dashboard.component.scss',
})
export class TableDashboardComponent implements OnChanges {
  mode = input<string>();

  widthOptions: any[] = [
    {
      id: 1,
      value: 0.5,
    },
    {
      id: 2,
      value: 0.75,
    },
    {
      id: 3,
      value: 1,
    },
    {
      id: 4,
      value: 1.5,
    },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chart_config_input']) {
      const changesValue = changes['chart_config_input']?.currentValue;
      console.log(changes['chart_config_input'], 'chart_config_changes');
      const settingsUrl = changesValue.data.settingsResource;
      this.data = changesValue.data;
      this.getTableSettings(settingsUrl);
      this.selectedWidth =
        this.chart_config_input()?.data?.width || this.selectedWidth;

      if (this.chart_config_input()?.data?.dataViewID) {
        this.loadColumnsProfile();
      }
    }
  }

  constructor(
    private _SharedService: SharedService,
    private _HttpClient: HttpClient,
    private _RiskService: RiskService,
    private dashboardLayoutService: DashboardLayoutService,
    private httpClient: HttpClient,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {
    this.initSettingsForm();

    dashboardLayoutService.filter_visible$.subscribe((res) => {
      this.filter_visible = res;
    });
    const id = this.route.snapshot.parent?.paramMap.get('id');
    if (!id) return;
    this.dashboardId = +id;
  }
  filter_visible: boolean = false;
  table_data: any[] = [];

  chart_config_input = input.required<any>();
  show_filter: boolean = false;
  actionEmitter = output<any>();
  selectedWidth: any = this.widthOptions[3].value;

  pageginationObj: PaginationInterface = {
    perPage: 100,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };

  selected_profile_column: any;
  loading: boolean = false;
  profiles: newProfile[] = [];
  defultProfile!: newProfile;

  loadColumnsProfile() {
    this._RiskService
      .getRisksProfile(this.chart_config_input()?.data?.dataViewID)
      .subscribe({
        next: (res: any) => {
          this.defultProfile = {
            profileId: 0,
            profileName: 'Defult Profile',
            isDefult: false,
            columns: res?.data?.columnDefinitions,
          };

          this.profiles = res?.data?.userColumnProfiles.map(
            (profile: newProfile) => {
              return {
                ...profile,
                columns: profile.columns.map((col: any, i) => {
                  return {
                    ...col,
                    displayName: res?.data?.columnDefinitions?.find(
                      (colD: any) => colD?.id == col?.id
                    )?.label,
                    dataMap: res?.data?.columnDefinitions?.find(
                      (colD: any) => colD?.id == col?.id
                    )?.dataMap,
                  };
                }),
              };
            }
          );

          this.selected_profile_column = res?.data?.selectedProfileID;
        },
      });
  }

  handleSort(event: any) {
    //
    this.sort_data = event;
    this.getDataTable();
  }

  handleFilter(event: any) {
    //
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
    this.getDataTable();
  }

  current_filters: any[] = [];
  sort_data: any;
  getDataTable() {
    if(!this.tableSettings)return
    console.log('entered table data...');

    this.table_data = [];
    this.loading = true;
    const req = {
      search: '',
      dataViewId: this.chart_config_input()?.data?.dataViewID,
      pageNumber: 1,
      pageSize:this.tableSettings.pageSize,
      filters: this.current_filters,
      sortField: this.sort_data?.field,
      sortDirection: this.sort_data?.direction,
    };
    this._HttpClient
      .post(
        enviroment.DOMAIN_URI +
          `${this.chart_config_input()?.data?.dataResource}`,
        req
      )
      .subscribe((res: any) => {
        this.table_data = res?.data?.items;
        this.pageginationObj = {
          perPage: res?.data?.pageSize,
          currentPage: res?.data?.pageNumber,
          totalItems: res?.data?.totalCount,
          totalPages: res?.data?.totalPages,
        };
        this._SharedService.paginationSubject.next(this.pageginationObj);
        this.loading = false;
      });
  }
tableSettings:any
  getTableSettings(url: string,getData:boolean=false) {
    if (!url) return;
    url = url.replace('api/', enviroment.API_URL);
    this.httpClient.get(url).subscribe({
      next: (res: any) => {
        console.log(res, 'got table settings');
        this.tableSettings = res.data.settings
        this.initSettingsForm(this.tableSettings);
        if(!getData)return
        this.getDataTable();
      },
    });
  }

  setting_visible: boolean = false;
  setting_form!: FormGroup;
  initSettingsForm(data?: any) {
    this.setting_form = new FormGroup({
      title: new FormControl(data?.title ?? null, Validators.required),
      titleAr: new FormControl(data?.titleAr ?? null),
      pageSize: new FormControl(data?.pageSize ?? 10, [
        Validators.min(1),
        Validators.max(100),
      ]),
      showFilters: new FormControl(data?.showFilters ?? false),
    });
  }
  loadingSave: boolean = false;
  dashboardId: any;
  data: any;
  saveSettings() {
    if (this.setting_form.invalid) return;
    //
    const currentPageSize = this.pageginationObj.perPage;
    const pageSize = this.setting_form.get('pageSize')?.value;

    this.loadingSave = true;
    const payload = {
      reportDefinitionId: this.dashboardId,
      reportPartId: this.data.id,
      configJson: {
        ...this.setting_form.value,
      },
    };

    this.dashboardLayoutService
      .updateWidgetSetting(payload)
      .pipe(finalize(() => (this.loadingSave = false)))
      .subscribe({
        next: (res) => {
          this.setting_visible = false;
          const notSamePageSize = pageSize !== currentPageSize
          if (notSamePageSize) {
            this.getTableSettings(this.data.settingsResource,notSamePageSize);
          }

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Widget Setting Saved Successfully',
          });
        },
      });
  }
}
