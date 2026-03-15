import { TranslationService } from 'apps/campagin-app/src/app/shared/services/translation.service';
import { SharedService } from './../../../../../../shared/shared-ui/src/services/shared.service';
import { GoveranceService } from './../../../service/goverance.service';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { AddControlassessmentComponent } from '../addControlAssessment/addControlassessment.component';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { finalize } from 'rxjs';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { MessageService } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-controlassessment',
  imports: [
    CommonModule,
    TranslateModule,
    SkeletonModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    AddControlassessmentComponent,
    NewTableComponent,
  ],
  templateUrl: './Controlassessment.component.html',
  styleUrl: './Controlassessment.component.scss',
})
export class ControlassessmentComponent {
  Data: any;
  Controls: any[] = [];
  NameEnglish: any[] = [];
  assigneeControlsID: any[] = [];
  public documentRef = document;
    currentLanguage!:string
  constructor(
    private _router: Router,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _sharedService: SharedService,
    private _RiskService: RiskService,
    private _MessageService: MessageService,
    private _ActivatedRoute: ActivatedRoute,
    private GoveranceService: GoveranceService,
    public _PermissionSystemService:PermissionSystemService,
    private translationService:TranslationService
  ) {
    this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },

      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.Governance'),
        icon: '',
        routerLink: '/gfw-portal/governance/control-management/list',
      },
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.Control_Management'
        ),
        icon: '',
        routerLink: '/gfw-portal/governance/control-management/list',
      },

      {
        name: this._TranslateService.instant('TABS.Controlassessment'),
        icon: '',
      },
    ]);
    this.currentLanguage = this.translationService.getSelectedLanguage().trim()

    this._sharedService.getUserLookupData().subscribe((res: any) => {
      this.Controls = res?.data;
    });
    this.getDataControls();
  }
  dataList: any[] = [];

  loading: boolean = false;
  sort_data: any;
  current_payload: any;
  handleDataTable(payload: any) {
    console.log('payload', payload);

    this.current_payload = payload;
    // this.handleSetSelectedType(this.selected_type, true);
        switch (this.selected_type.id) {
      case 1:
        // this.columnId.set(26);
        this.getImplementationControls(this.current_payload);
        break;
      case 2:
        // this.columnId.set(21);
        this.getGovControlCompliance(this.current_payload);
        break;
      case 3:
        // this.columnId.set(25);
        this.getGovControlEffective(this.current_payload);
        break;
      case 4:
        // this.columnId.set(27);
        this.getGovControlMaturity(this.current_payload);
        break;
    }
  }
  columnControl: any = {
    type: 'route',
    data: '',
  };

  id: any;
  viewRoute!: string;
  getDataControls() {
    this.loadingState = true;
    this.id = +this._ActivatedRoute.parent?.snapshot.paramMap.get('id')!;
    if (this.id) {
      this.GoveranceService.getOneGovControl(this.id).subscribe((res) => {
        this.Data = res?.data;
        this.loadingState = false;

        this.GoveranceService.setMatrityTypeId(this.Data?.maturityLevelTypeID);
        this.data_types = [
          {
            id: 2,
            table_name: 'Compliance',
            icon: 'fi fi-br-bank',
            class: 'card-status2',
            class2: 'progress_span3',
            setSelectedRow: 'govControlComplianceAssessmentID',
            filter: 21,
            Data_Progress: this.Data?.complianceStatusTypeName || '-',
            dateAssess: this.Data?.complianceExpiryDate
              ? new Date(this.Data.complianceExpiryDate)
              : null,
            dateNext: this.Data?.complianceNextTestDate
              ? new Date(this.Data.complianceNextTestDate)
              : null,
            statusKey: this._TranslateService.instant(
              'Control_view.COMPLIANCE_STATUS'
            ),
          },
          {
            id: 1,
            table_name: 'Implementation',
            icon: 'fi fi-br-tools',
            class: 'card-status',
            class2: 'progress_span',
            setSelectedRow: 'govControlImplementationAssessmentID',
            filter: 26,
            Data_Progress: this.Data?.implementationStatusTypeName || '-',
            dateAssess: this.Data?.implementationLastUpdated
              ? new Date(this.Data.implementationLastUpdated)
              : null,
            dateNext: this.Data?.implementationNextTestDate
              ? new Date(this.Data.implementationNextTestDate)
              : null,
            statusKey: this._TranslateService.instant(
              'Control_view.Implementation_Status'
            ),
          },

          {
            id: 3,
            table_name: 'Effectiveness',
            icon: 'fi fi-rr-bullseye-arrow',
            class: 'card-status3',
            class2: 'progress_span2',
            setSelectedRow: 'govControlEffectivenessAssessmentID',
            filter: 25,
            Data_Progress: this.Data?.effectivenessStatusTypeName || '-',
            dateAssess: this.Data?.effectivenessLastUpdated
              ? new Date(this.Data.effectivenessLastUpdated)
              : null,
            dateNext: this.Data?.effectivenessNextTestDate
              ? new Date(this.Data.effectivenessNextTestDate)
              : null,
            statusKey: this._TranslateService.instant('Control_view.EFFECTIVE'),
          },
          {
            id: 4,
            table_name: 'Maturity',
            icon: 'fi fi-br-stats',
            class: 'card-status4',
            class2: 'progress_span4',
            setSelectedRow: 'govControlMaturityAssessmentID',
            filter: 27,
            Data_Progress: this.Data?.maturityLevelName || '-',
            dateAssess: this.Data?.maturityAssessmentDate
              ? new Date(this.Data.maturityAssessmentDate)
              : null,
            dateNext: this.Data?.maturityNextTestDate
              ? new Date(this.Data.maturityNextTestDate)
              : null,
            statusKey: this._TranslateService.instant(
              'Control_view.MATURITY_STATUS'
            ),
          },
        ];
      });
    }
  }

  getGovControlCompliance(payload?: any) {
    this.loading = true;

    this.loadingState = true;
    this.dataList = [];
    this.GoveranceService.getComplianceControlsNew({
      GovControlID: this.id,
      ...payload,
    })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: any) => {
          this.dataList = [...(res?.data?.items || [])];
          this.pageginationObj = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this._sharedService.paginationSubject.next(this.pageginationObj);
          this.loading = false;
          this.loadingState = false;
        },

        error: (err: any) => {
          this.loading = false;
        },
      });
  }

  getGovControlEffective(payload?: any) {
    this.loading = true;

    this.loadingState = true;
    this.dataList = [];
    this.GoveranceService.getGovControlEffectiveNew(
 {GovControlID:this.id,...payload}

    )
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: any) => {
          this.dataList = [...(res?.data?.items || [])];
          this.pageginationObj = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this._sharedService.paginationSubject.next(this.pageginationObj);
          this.loading = false;
          this.loadingState = false;
        },

        error: (err: any) => {
          this.loading = false;
        },
      });
  }
  current_filters: any[] = [];
  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };

  risksProfiles: newProfile[] = [];
  defultProfile!: newProfile;

  selectedRowId: any;
  data_sort: any;
  getImplementationControls(payload?: any) {
    this.loading = true;
    this.dataList = [];
    this.loadingState = true;
    this.GoveranceService.getImplementationControlsNew({
      GovControlID: this.id,
      ...payload,
    })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: any) => {
          this.dataList = [...(res?.data?.items || [])];
          this.pageginationObj = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this._sharedService.paginationSubject.next(this.pageginationObj);
          this.loading = false;
          this.loadingState = false;
        },

        error: (err: any) => {
          this.loading = false;
        },
      });
  }

  getGovControlMaturity(payload?: any) {
    this.loading = true;

    this.loadingState = true;
    this.dataList = [];
    this.GoveranceService.getGovControlMaturityNew(

      {GovControlID:this.id,...payload}
    )
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: any) => {
          this.dataList = [...(res?.data?.items || [])];
          this.pageginationObj = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this._sharedService.paginationSubject.next(this.pageginationObj);
          this.loading = false;
          this.loadingState = false;
        },

        error: (err: any) => {
          this.loading = false;
        },
      });
  }

  getPaganation(event: any) {
    switch (this.selected_type.id) {
      case 1:
        this.getImplementationControls(event);
        break;
      case 2:
        this.getGovControlCompliance(event);
        break;
      case 3:
        this.getGovControlEffective(event);
        break;
      case 4:
        this.getGovControlMaturity(event);
        break;
    }
  }
  openViewModal(rowId?: any) {
    switch (this.selected_type.id) {
      case 1:
        this.selectedRowId = rowId.govControlImplementationAssessmentID
          ? rowId.govControlImplementationAssessmentID
          : this.current_row_selected;
        this.viewModal = true;
        break;
      case 2:
        this.selectedRowId = rowId.govControlComplianceAssessmentID
          ? rowId.govControlComplianceAssessmentID
          : this.current_row_selected;
        this.viewModal = true;
        break;

      case 3:
        this.selectedRowId = rowId.govControlEffectivenessAssessmentID
          ? rowId.govControlEffectivenessAssessmentID
          : this.current_row_selected;
        this.viewModal = true;
        break;

      case 4:
        this.selectedRowId = rowId.govControlMaturityAssessmentID
          ? rowId.govControlMaturityAssessmentID
          : this.current_row_selected;
        this.viewModal = true;
        break;
    }
  }

  selected_profile_column: number = 0;
  itemsMenu: any[] = [];
  loadingState: boolean = false;
  profilesList: any = [];
  mode: any = 'add';
  table_name: string = '';
  badge_name: string = '';
  total_items_input: any;
  action_items: any[] = [];
  current_row_selected: any;
  loadDelted: boolean = false;
  actionDeleteVisible: boolean = false;

  handleClosedDelete(event: any) {
    this.actionDeleteVisible = false;
  }

  setSelectedRow(event: any) {
    this.current_row_selected = event;
  }

  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }
  openModal: boolean = false;
  openModalInView: boolean = false;
  ngOnInit(): void {
    this.table_name = this._TranslateService.instant('SETTING.USERLIST');
    this.badge_name = this._TranslateService.instant('SETTING.USERS');
    this.total_items_input = 10;
    this.action_items = [
      {
        label: this._TranslateService.instant('SETTING.VIEW_CONTROL'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this.setViewRoute();
          this._router.navigate([this.viewRoute, this.current_row_selected]);
        },
        visible: ()=>this._PermissionSystemService.can('GOVERNANCE' , 'CONTROLASSESSMENT' , 'VIEW')
      },
      {
        label: 'Update Control',
        icon: 'fi fi-rr-edit',
        command: () => {
          //
          this.mode = 'edit';
          this.newControls();
        },
        visible: ()=>this._PermissionSystemService.can('GOVERNANCE' , 'CONTROLASSESSMENT' , 'EDIT')
      },
      {
        label: this._TranslateService.instant('SETTING.DELETE_CONTROL'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.actionDeleteVisible = true;
        },
        visible: ()=>this._PermissionSystemService.can('GOVERNANCE' , 'CONTROLASSESSMENT' , 'DELETE')
      },
    ];
    this.selected_type = this.data_types[1];
    this.GoveranceService.setSelectedTypeId(this.selected_type?.id);
    this.setViewRoute();
  }

  deleteControls() {
    if(!this._PermissionSystemService.can('GOVERNANCE' , 'CONTROLASSESSMENT' , 'DELETE')) return;
    this.loadingState = true;
    this.loadDelted = true;

    switch (this.selected_type.id) {
      case 1:
        this.GoveranceService.deleteImplementationControls(
          this.current_row_selected
        ).subscribe((res) => {
          this.loadDelted = false;
          this.getImplementationControls(this.current_payload);
          this.actionDeleteVisible = false;
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Implementation Control Deleted Successfully !',
          });
          this.loadingState = false;
        });
        break;
      case 2:
        this.GoveranceService.deleteComplianceControls(
          this.current_row_selected
        ).subscribe((res) => {
          this.loadDelted = false;
          this.getGovControlCompliance(this.current_payload);
          this.actionDeleteVisible = false;
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Compliance Control Deleted Successfully !',
          });
          this.loadingState = false;
        });
        break;

      case 3:
        this.GoveranceService.deleteffectiveControls(
          this.current_row_selected
        ).subscribe((res) => {
          this.loadDelted = false;
          this.getGovControlEffective(this.current_payload);
          this.actionDeleteVisible = false;
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Effective Control Deleted Successfully !',
          });
          this.loadingState = false;
        });
        break;

      case 4:
        this.GoveranceService.deletMaturityControls(
          this.current_row_selected
        ).subscribe((res) => {
          this.loadDelted = false;
          this.getGovControlMaturity(this.current_payload);
          this.actionDeleteVisible = false;
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Maturity Control Deleted Successfully !',
          });
          this.loadingState = false;
        });
        break;
    }
  }
  openModle() {
    this.openModal = true;
  }
  newControls() {
    //  this._router.navigate([`/gfw-portal/governance/control-management/addAssessment`,]);
    this.AddModal = true;
  }
  AddModal: boolean = false;
  viewModal: boolean = false;
  submit() {}

  // start handle new flow

  data_types: any[] = [
    {
      id: 1,
      table_name: 'implementation',
      img: 'images/icons/clock.svg',
      class: 'card-status',
      class2: 'progress_span3',
      Data_Progress: '',
      dateAssess: '',
      dateNext: '',
      column_id: 1,
      setSelectedRow: 'govControlImplementationAssessmentID',
      filter: 26,
    },
    {
      id: 2,
      table_name: 'compliance',
      img: 'images/icons/alert-triangle.svg',
      class: 'card-status2',
      class2: 'progress_span',
      setSelectedRow: 'govControlComplianceAssessmentID',
      filter: 21,
      Data_Progress: '',
      dateAssess: '',
      dateNext: '',
    },
    {
      id: 3,
      table_name: 'effective',
      img: 'images/icons/line-chart-up-01.svg',
      class: 'card-status3',
      class2: 'progress_span2',
      setSelectedRow: 'govControlEffectivenessAssessmentID',
      filter: 25,
      Data_Progress: '',
      dateAssess: '',
      dateNext: '',
    },
    {
      id: 4,
      table_name: 'Maturity',
      img: 'images/icons/rocket-02.svg',
      class: 'card-status4',
      class2: 'progress_span4',
      setSelectedRow: 'govControlMaturityAssessmentID',
      filter: 27,
      Data_Progress: '',
      dateAssess: '',
      dateNext: '',
    },
  ];

  selected_type: any;
  eventFilter: any;
  setViewRoute() {
    const typeName = this.selected_type?.table_name?.toLowerCase();
    this.viewRoute = `/gfw-portal/governance/control-management/${this.id}/assessment/${typeName}`;
    this.columnControl.data = this.viewRoute;
  }
  columnId = signal<number>(21);
  handleSetSelectedType(type: any, refresh: boolean = false) {
    console.log('handleSetSelectedType', type);

    if (this.selected_type?.id === type.id && !refresh) return;

    this.selected_type = type;
    this.GoveranceService.setSelectedTypeId(type.id);
    this.setViewRoute();
    console.log('handleSetSelectedType Before Switch', type);
    switch (type.id) {
      case 1:
        this.columnId.set(26);
        // this.getImplementationControls(this.current_payload);
        break;
      case 2:
        this.columnId.set(21);
        // this.getGovControlCompliance(this.current_payload);
        break;
      case 3:
        this.columnId.set(25);
        // this.getGovControlEffective(this.current_payload);
        break;
      case 4:
        this.columnId.set(27);
        // this.getGovControlMaturity(this.current_payload);
        break;
    }
  }
}
