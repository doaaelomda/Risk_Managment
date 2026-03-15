import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { ComplianceAssessmntService } from '../../services/compliance-assessmnt.service';
import { finalize } from 'rxjs';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-compliance',
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    DeleteConfirmPopupComponent,
    NewTableComponent,
  ],
  templateUrl: './assessments-list.component.html',
  styleUrl: './assessments-list.component.scss',
})
export class AssessmentsListComponent implements OnInit {
   //  Initialize properties
  actionDeleteVisible: boolean = false;
  isDeleting: boolean = false;
  action_items: any;
  assessmentList: any[] = [];
  isLoading: boolean = true;
  current_control_assessment_payload: any;
  select_Assessment_Id: any;
  columnControl: any = {
    type: 'route',
    data: `gfw-portal/compliance/assessments/view/`,
  };
   paginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  // Constructor
  constructor(
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _MessageService: MessageService,
    private _SharedService: SharedService,
    private _router: Router,
    private _ComplianceAssessmntService: ComplianceAssessmntService,
    public _PermissionSystemService:PermissionSystemService
  ) {
  }
  ngOnInit() {
    this.handleBreadcrumb()
    this.handleActionList()
  }
  // handle BreadCamb
  handleBreadcrumb(){
  this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.Compliance'),
        icon: '',
        routerLink: '/gfw-portal/compliance/assessments',
      },
      {
        name: this._TranslateService.instant('TABS.ASSESSMENT'),
        icon: '',
      },
    ]);
  }
  // handleActionList
  handleActionList(){
        this.action_items = [
      {
        label: this._TranslateService.instant(
          'ASSESSMENT_RISK.VIEW_ASSESSMENT'
        ),
        icon: 'fi fi-rr-eye',
        command: () => {
           this._router.navigate(['gfw-portal/compliance/assessments/view', this.select_Assessment_Id]);
        },
        visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'ASSESSMENT' , 'VIEW')
      },
      {
        label: this._TranslateService.instant(
          'ASSESSMENT_RISK.DELETE_ASSESSMENT'
        ),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.actionDeleteVisible = true;
        },
        visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'ASSESSMENT' , 'DELETE')
      },
      {
        label: this._TranslateService.instant(
          'ASSESSMENT_RISK.UPDATE_ASSESSMENT'
        ),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this._router.navigate([
            'gfw-portal/compliance/assessments/update',
            this.select_Assessment_Id,
          ]);
        },
        visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'ASSESSMENT' , 'EDIT')
      },
    ];
  }
  // method to handle close delete popup
  handleClosedDelete() {
    this.actionDeleteVisible = false;
  }
  // method to delete assessment
  deleteAssessment() {
    console.log('deleted');
    this.isLoading = true;
    this.isDeleting = true;
    this._ComplianceAssessmntService
      .deleteAssessmnet(this.select_Assessment_Id)
      .subscribe((res) => {
        this.isDeleting = false;
        this.actionDeleteVisible = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Delete Assessmnet Deleted Successfully !',
        });
        this.isLoading = false;
        this.handleDataTable(this.current_control_assessment_payload)
      });
  }
  // method to add assessment
  addNewassessment() {
    this._router.navigate(['gfw-portal/compliance/assessments/add']);
  }
  // method to handle show delete popup
  handleShowDelete() {
    this.actionDeleteVisible = true;
  }
  // method to set selected row
  setSelectedRow(event: any) {
    this.select_Assessment_Id = event;
  }
 // method to get payload and calling data table
  handleDataTable(payload: any = null) {
    this.current_control_assessment_payload = payload;
    this.getDataTable(payload);
  }
  // method to get data table
  getDataTable(payload: any) {
    this.isLoading = true;
    this.assessmentList = [];
    this._ComplianceAssessmntService
      .getAssessmnet(payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          this.assessmentList = res?.data?.items;
          this.paginationObj = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this._SharedService.paginationSubject.next(this.paginationObj);
        },
      });
  }
}
