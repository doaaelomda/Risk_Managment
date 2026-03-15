import { CardsListComponent } from './../../../../../../shared/shared-ui/src/lib/cards-list/cards-list.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import * as moment from 'moment';
import {

  DeleteConfirmPopupComponent,

} from '@gfw/shared-ui';
import { Button } from 'primeng/button';
import {

  FormsModule,
  ReactiveFormsModule,

} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { MethodologyFormulaService } from '../../../services/methodology-formula.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-methodology-formula',
  imports: [
    CommonModule,

    DeleteConfirmPopupComponent,
    Button,
    TranslateModule,

    DialogModule,
    ReactiveFormsModule,
    FormsModule,
    CardsListComponent,
  ],
  templateUrl: './methodology-formula.component.html',
  styleUrl: './methodology-formula.component.scss',
})
export class MethodologyFormulaComponent {
  // ───────────── General State
  loading = false;
  loadingDelete = false;
  deleteModalVisible = false;
  selectedRow: any = null;

  // ───────────── Entity Config
  private readonly FEATURE_KEY = 'METHODOLOGY';
  private readonly FEATURE_NAME = 'FORMULA';
  private readonly featureDisplayName = 'Formula';
  private readonly ENTITY_ROUTE = '/gfw-portal/risks-management/methodolgy';
  readonly serviceName = '_service';
  readonly entityIdField = 'riskMethodologyFormulaID';
  readonly dataEntityId = 90;

  viewRoute = '';
  methodologyId!: string | number;

  // ───────────── Translatable Keys
  labels = {
    view: '',
    delete: '',
    update: '',
    add: '',
    titleDelete: '',
    descDelete: '',
    badge: '',
    table: '',
  };

  // ───────────── Profiles + Table
  selectedProfileId = 0;
  entityProfiles: newProfile[] = [];
  defaultProfile!: newProfile;
  tableData: any[] = [
    {
      id: 1,
      name: 'test',
    },
  ];
  sortState: any = null;
  currentFilters: any[] = [];

  pagination: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 10,
    totalPages: 1,
  };

  // ───────────── UI Actions
  actionItems: any[] = [];

  constructor(
    private router: Router,
    private messageService: MessageService,
    private sharedService: SharedService,
    private translate: TranslateService,
    private layout: LayoutService,
    private activatedRoute: ActivatedRoute,
    private _service: MethodologyFormulaService,
    public _PermissionSystemService:PermissionSystemService
  ) {}

  // ───────────── Lifecycle
  ngOnInit(): void {
    this.initializeTranslations();
    this.setupActionItems();
    this.loadEntityProfiles();
    this.getParentId();
  }

  getParentId() {
    const id = this.activatedRoute.parent?.snapshot.paramMap.get('id');
    if (!id) return;
    this.methodologyId = id;
    this.getListData();
    this.viewRoute = `/gfw-portal/risks-management/methodolgy/${this.methodologyId}/formula`;
  }

  // ───────────── Translations
  private initializeTranslations(): void {
    const base = this.FEATURE_KEY;
    const name = this.FEATURE_NAME;

    this.labels = {
      view: `${base}.VIEW_${name}`,
      delete: `${base}.DELETE_${name}`,
      update: `${base}.UPDATE_${name}`,
      add: `${base}.ADD_NEW_${name}`,
      titleDelete: `${base}.DELETE_${name}_TITLE`,
      descDelete: `${base}.DELETE_${name}_DESC`,
      badge: `${base}.${name}`,
      table: `${base}.${name}S_LIST`,
    };
  }

  // ───────────── Action Buttons
  private setupActionItems(): void {
    this.actionItems = [
      {
        label: this.translate.instant(this.labels.view),
        icon: 'fi fi-rr-eye',
        command: () => this.handleViewClick(),
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'RISKASSESSMENTFORMULA' , 'VIEW')

      },
      {
        label: this.translate.instant(this.labels.delete),
        icon: 'fi fi-rr-trash',
        command: () => this.toggleDeleteModal(true),
            visible: ()=>this._PermissionSystemService.can('RISKS' , 'RISKASSESSMENTFORMULA' , 'DELETE')
      },
      {
        label: this.translate.instant(this.labels.update),
        icon: 'fi fi-rr-pencil',
        command: () => this.handleUpdateClick(),
            visible: ()=>this._PermissionSystemService.can('RISKS' , 'RISKASSESSMENTFORMULA' , 'EDIT')
      },
    ];
  }

  // ───────────── Handlers
  actionDialogVisible = false;

  handleViewClick(): void {
    this.router.navigate([`${this.viewRoute}/${this.selectedRow}`]);
  }

  handleUpdateClick(): void {
    this.router.navigate([
      `/gfw-portal/risks-management/methodolgy/${this.methodologyId}/update/${this.selectedRow}`,
    ]);
  }

  handleAddClick(): void {
    this.router.navigate([
      `/gfw-portal/risks-management/methodolgy/${this.methodologyId}/add-formula`,
    ]);
  }

  toggleDeleteModal(visible: boolean): void {
      if(!visible) {this.selectedRow = null}
    this.deleteModalVisible = visible;
  }

  delete(): void {
     if(!this._PermissionSystemService.can('RISKS' , 'RISKASSESSMENTFORMULA' , 'DELETE')) return;

    if (!this.selectedRow) return;
    this.loadingDelete = true;

    (this as any)[this.serviceName]
      .delete(this.selectedRow)
      .pipe(finalize(() => (this.loadingDelete = false)))
      .subscribe({
        next: () => {
          this.getListData();
          this.toggleDeleteModal(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `${this.featureDisplayName} deleted successfully!`,
          });
        },
      });
  }

  // ───────────── Table + Filters
  loadEntityProfiles(): void {
    // this.sharedService
    //   .getDataEntityColumns(this.dataEntityId)
    //   .subscribe((res: any) => {
    //     const data = res?.data;

    //     this.defaultProfile = {
    //       profileId: 0,
    //       profileName: 'Default Profile',
    //       isDefult: false,
    //       columns: data?.columnDefinitions,
    //     };

    //     this.entityProfiles = data?.userColumnProfiles.map((profile: newProfile) => ({
    //       ...profile,
    //       columns: profile.columns.map((col: any) => {
    //         const def = data?.columnDefinitions?.find((d: any) => d?.id === col?.id);
    //         return {
    //           ...col,
    //           displayName: def?.label,
    //           dataMap: def?.dataMap,
    //         };
    //       }),
    //     }));

    //     this.selectedProfileId = data?.selectedProfileID;
    //   });

    this.defaultProfile = {
      profileId: 0,
      profileName: 'Defult Profile',
      isDefult: true,
      columns: [
        {
          id: 1,
          label: 'Name',
          filed: 'Name',
          type: 'text',
          isShown: true,
          isResizable: true,
          isFixed: false,
          isSortable: true,
          dataMap: [
            {
              key: 'text',
              value: 'name',
            },
          ],
        },
      ],
    };

    this.entityProfiles = [this.defaultProfile];
  }

  handleSort(event: any): void {
    this.sortState = event;
    // this.getListData(event);
  }

  handleFilter(event: any[]): void {
    this.currentFilters = event.map((f) => this.buildFilter(f));
    // this.getListData();
  }

  private buildFilter(filter: any) {
    const isDate = filter?.filter_type?.filterType === 'Date';
    const base = {
      filterID: filter?.filter_type?.filterId,
      filterCode: filter?.filter_type?.fieldName,
      operatorId: filter?.operator?.DataEntityTypeOperatorID,
      operatorCode: filter?.operator?.OperatorCode,
    };

    if (!isDate)
      return {
        ...base,
        firstValue: String(filter?.firstValue),
        secondValue: null,
        dateOptionID: null,
      };

    if (![18, 19].includes(filter?.firstValue))
      return {
        ...base,
        firstValue: null,
        secondValue: null,
        dateOptionID: String(filter?.firstValue),
      };

    const val = filter?.secondValue;
    const [start, end] = Array.isArray(val) ? [val[0], val[1]] : [val, null];
    return {
      ...base,
      firstValue: moment(new Date(start)).format('MM-DD-YYYY'),
      secondValue: end ? moment(new Date(end)).format('MM-DD-YYYY') : null,
      dateOptionID: String(filter?.firstValue),
    };
  }

  getListData(event?: any): void {
    this.loading = true;
    this.tableData = [];

    (this as any)[this.serviceName]
      .findAll(this.methodologyId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: any) => {
          const d = res?.data;
          this.tableData = d;
        },
      });
  }

  setSelected(event: any): void {
    this.selectedRow = event?.riskMethodologyFormulaID;
  }
}
