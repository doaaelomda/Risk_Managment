import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { finalize, switchMap, take } from 'rxjs';
import { ComplianceService } from '../../compliance/compliance.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { ComplianceAssessmntService } from '../../services/compliance-assessmnt.service';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-assessment-control',
  imports: [
    CommonModule,
    TranslateModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    SkeletonModule,
    DialogModule,
    ReactiveFormsModule,
    NewTableComponent,
  ],
  templateUrl: './assessment-control.component.html',
  styleUrl: './assessment-control.component.scss',
})
export class AssessmentControlComponent implements OnInit {
  //  Initialize properties
  actionDeleteVisible: boolean = false;
  isLoaderDeleting: boolean = false;
  isLoading: boolean = true;
  addModal: boolean = false;
  viewModal: boolean = false;
  loadingSaveControl: boolean = false;
  govControlID: string = '';
  selectcontrolcontrol: string = '';
  action_items: any;
  controlList: any[] = [];
  Data: any;
  complianceID: any;
  dataAssessment: any;
  current_control_assessment_payload: any;
  covControlList: any[] = [];
  isloadingGov: boolean = true;
  current_cov_control_payload: any;
  selected_control_assessment: any[] = [];
  paginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  columnControl: any = {
    type: 'popup',
    data: null,
  };
  // Constructor
  constructor(
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _MessageService: MessageService,
    private _SharedService: SharedService,
    private _complianceService: ComplianceService,
    private _router: Router,
    private _ActiveRouter: ActivatedRoute,
    private _ComplianceService: ComplianceAssessmntService,
    public _PermissionSystemService:PermissionSystemService
  ) {}
  // Lifecycle hooks
  ngOnInit() {
    this.handelBreadcrumb();
    this.handleActionItems();
  }
  // handle breadcrumb in Compliance Assessment Control
  handelBreadcrumb() {
    this._ActiveRouter.parent?.paramMap
      .pipe(
        take(1),
        switchMap((params: any) => {
          this.complianceID = params.get('id');
          return this._ComplianceService.getAssessmnetById(this.complianceID);
        })
      )
      .subscribe({
        next: (res) => {
          this.dataAssessment = res?.data;

          this._LayoutService.breadCrumbLinks.next([
            {
              name: '',
              icon: 'fi fi-rs-home',
              routerLink: '/',
            },
            {
              name: this._TranslateService.instant(
                'BREAD_CRUMB_TITLES.Compliance'
              ),
              icon: '',
              routerLink: '/gfw-portal/compliance/assessments',
            },
            {
              name: this._TranslateService.instant('TABS.ASSESSMENT'),
              icon: '',
              routerLink: '/gfw-portal/compliance/assessments',
            },
            {
              name: this.dataAssessment?.name || '-',
              icon: '',
              routerLink: `/gfw-portal/compliance/assessments/view/${this.complianceID}/overview`,
            },
            {
              name: this._TranslateService.instant('HEARDE_TABLE.CONTROL'),
              icon: '',
            },
          ]);

          // this.getSelectedControlsIDS();
        },

      });
  }
  // method to handle close delete popup
  handleClosedDelete() {
    this.actionDeleteVisible = false;
  }
  // method to delete assessment control
  deleteAssessment() {
        const canDelete = this._PermissionSystemService.can('COMPLIANCE' , 'ASSSESSMENT_CONTROLS' , 'DELETE')
    if(!canDelete) return;

    this.isLoading = true;
    this.isLoaderDeleting = true;
    this._complianceService
      .deleteControlAssessmentComplianceASS(this.selectcontrolcontrol)
      .subscribe({
        next: () => {
          this.isLoaderDeleting = false;
          this.actionDeleteVisible = false;
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: this._TranslateService.instant('SETTING.DELETE_SUCCESS'),
          });
          this.isLoading = false;
          this.handleDataTable(this.current_control_assessment_payload);
        },
        error: () => {
          this.isLoaderDeleting = false;
          this.isLoading = false;
        },
      });
  }
  // method to set selected row
  setSelectedRow(event: any) {
    this.selectcontrolcontrol = event;
  }
  // method to open add control modal
  quickAdd() {
    this.addModal = true;
  }
  // method to handle modal close
  onModalClose() {
    this.getDataTable(this.current_control_assessment_payload);
    // this.getSelectedControlsIDS()
  }
  // method to open view control modal
  viewDataInModal() {
    this.viewModal = true;
    this.isLoading = true;
    this._complianceService
      .getByIdControlAssessmentByComplianceASS(this.selectcontrolcontrol)
      .pipe(take(1))
      .subscribe({
        next: (res: any) => {
          this.Data = res?.data;
        },
        error: () => {
          this.Data = null;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }
  // method to handle data table
  handleDataTable(payload: any = null) {
    this.current_control_assessment_payload = payload;
    this.getDataTable(payload);
  }
  // method to get data table
  getDataTable(payload: any) {
    this.isLoading = true;
    this.controlList = [];
    this._complianceService
      .getControlsByComplianceId(payload, this.complianceID)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          this.controlList = res?.data?.items;
          this.paginationObj = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this._SharedService.paginationSubject.next(this.paginationObj);
        },
        error: (err: any) => {},
      });
  }
  // method to get payload and calling data table
  handleDataTableGov(payload: any) {
    this.current_cov_control_payload = payload;
    this.getDataGovControls(payload);
  }
  // method to get data Gov Control
  getDataGovControls(payload: any) {
    this.isloadingGov = true;
    this.covControlList = [];

    this._ComplianceService
      .getControlsGovSearchNew(payload)
      .subscribe((res: any) => {
        this.isloadingGov = false;
        this.covControlList = res?.data?.items;
        this.paginationObj = {
          perPage: res?.data?.pageSize,
          currentPage: res?.data?.pageNumber,
          totalItems: res?.data?.totalCount,
          totalPages: res?.data?.totalPages,
        };
        this._SharedService.paginationSubject.next(this.paginationObj);
      });
  }
  // method to save Control Assessment
  saveControlAssessment() {
    const canAdd = this._PermissionSystemService.can('COMPLIANCE' , 'ASSSESSMENT_CONTROLS' , 'ADD')
    if(!canAdd) return;
    this.loadingSaveControl = true;
    // const ids = this.selected_control_assessment.map((con: any) => {
    //   return con?.govControlID;
    // });
    this._ComplianceService
      .createControlAssessment(this.current_selected_controls_ids, this.complianceID)
      .pipe(finalize(() => (this.loadingSaveControl = false)))
      .subscribe((res: any) => {
        this.addModal = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Controls Added Successfully !',
        });
      });
  }
  // method to selection row in control assessment
  current_selected_controls_ids:any[]=[]
  handleSetSelection(event: any[]) {
    console.log("event selected" , event);
    this.current_selected_controls_ids = event;
  }
  // handle dropdown action
  handleActionItems() {
    this.action_items = [
      {
        label: this._TranslateService.instant('SETTING.VIEW_CONTROL'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this.viewDataInModal();
        },
        visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'ASSSESSMENT_CONTROLS' , 'VIEW')
      },
      {
        label: this._TranslateService.instant('SETTING.DELETE_CONTROL'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.actionDeleteVisible = true;
        },
          visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'ASSSESSMENT_CONTROLS' , 'DELETE')
      },
    ];
  }





  getSelectedControlsIDS(){
    this._ComplianceService.getSelectedControlsIDS(this.complianceID).subscribe((res:any)=>{
      this.selected_control_assessment = res?.data || []
    })
  }
}
