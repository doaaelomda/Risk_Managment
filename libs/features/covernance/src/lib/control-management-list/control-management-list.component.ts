import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { MessageService } from 'primeng/api';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { ComplianceAssessmntService } from 'libs/features/compliance/src/services/compliance-assessmnt.service';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';

@Component({
  selector: 'lib-control-management-list',
  imports: [
    CommonModule,
    TranslateModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    NewTableComponent,
  ],
  templateUrl: './control-management-list.component.html',
  styleUrl: './control-management-list.component.scss',
})
export class ControlManagementListComponent {
  Controls: any[] = [];
  NameEnglish: any[] = [];
  assigneeControlsID: any[] = [];
  constructor(
    private _router: Router,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _sharedService: SharedService,
    private _riskService: RiskService,
    private _MessageService: MessageService,
    public _PermissionSystemService:PermissionSystemService,
    private complianceAssessmentService:ComplianceAssessmntService
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
    ]);
    this._sharedService.getUserLookupData().subscribe((res: any) => {
      this.Controls = res?.data;
    });
  }
  columnControl: any = {
    type: 'route',
    data: '/gfw-portal/governance/control-management/view/',
  };
  current_payload: any;
  handleDataTable(event: any) {
    this.current_payload = event;
    this.getDataList(this.current_payload);
  }

  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  dataList: any[] = [];

  itemsMenu: any[] = [];
  loadingState: boolean = false;
  total_items_input: any;
  action_items: any[] = [];
  current_row_selected: any;
  loadDelted: boolean = false;
  actionDeleteVisible: boolean = false;

  handleClosedDelete(event: any) {
    this.actionDeleteVisible = false;
  }

  deleteRole() {}

  setSelectedRow(event?: any) {
    this.current_row_selected = event;
    console.log('role Selected', this.current_row_selected);
  }

  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }
  openModal: boolean = false;
  ngOnInit(): void {
    this.total_items_input = 10;
    this.action_items = [
      {
        label: this._TranslateService.instant('SETTING.VIEW_CONTROL'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._router.navigate([
            `/gfw-portal/governance/control-management/view/${this.current_row_selected}`,
          ]);
        },
       visible: ()=>this._PermissionSystemService.can('GOVERNANCE' , 'CONTROL' , 'VIEW')
      },
      {
        label: this._TranslateService.instant('SETTING.DELETE_CONTROL'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.actionDeleteVisible = true;
        },
        visible: ()=>this._PermissionSystemService.can('GOVERNANCE' , 'CONTROL' , 'DELETE')
      },
      {
        label: this._TranslateService.instant('SETTING.UPDATE_CONTROL'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          // this._router.navigate([
          //   `/gfw-portal/governance/control-management/update-control/${this.current_row_selected}`,
          // ]);
          this._router.navigate([
            `/gfw-portal/governance/control-management/action/${this.current_row_selected}`,
          ]);
        },
        visible: ()=>this._PermissionSystemService.can('GOVERNANCE' , 'CONTROL' , 'EDIT')
      },
    ];
  }

  deleteControls() {
     if(!this._PermissionSystemService.can('GOVERNANCE' , 'CONTROL' , 'DELETE')) return;
    this.loadDelted=true
    this._riskService.deleteControl(this.current_row_selected).subscribe(res=>{
      this.loadDelted=false
      this._MessageService.add({severity:'success', summary: 'Login Success', detail: 'Delete Controls Successful'});
      this.actionDeleteVisible=false;
      this.data_payload.pageNumber = 1;
      this.getDataList(this.data_payload)

    })
}

  openModle() {
    this.openModal = true;
  }
  newControls() {
    this._router.navigate([`/gfw-portal/governance/control-management/action`]);
    // this._router.navigate([`/gfw-portal/governance/control-management/new-add-control`]);
  }

  getDataList(event?: any) {
    console.log("evevnt payload" , event);

    this.loadingState = true
    this.loading = true;
    this.dataList = [];
    this._riskService
      .getControlsGovSearchNew(
        event
      )
      .subscribe((res: any) => {
        this.dataList = res?.data?.items;
        this.pageginationObj = {
          perPage: res?.data?.pageSize,
          currentPage: res?.data?.pageNumber,
          totalItems: res?.data?.totalCount,
          totalPages: res?.data?.totalPages,
        };
        this.loadingState = false
        this._sharedService.paginationSubject.next(this.pageginationObj);
        this.loading = false;
      });
  }
  loading: boolean = false;
  submit() {}

  data_payload: any;
}
