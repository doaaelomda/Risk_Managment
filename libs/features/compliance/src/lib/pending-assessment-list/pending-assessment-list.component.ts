// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DeleteConfirmPopupComponent, SharedUiComponent } from '@gfw/shared-ui';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { MessageService } from 'primeng/api';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { finalize, forkJoin } from 'rxjs';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { Router } from '@angular/router';
import { ComplianceAssessmntService } from '../../services/compliance-assessmnt.service';
import { NewTableComponent } from "libs/shared/shared-ui/src/lib/new-table/new-table.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-pending-assessment-list',
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    DeleteConfirmPopupComponent,
    NewTableComponent
],
  templateUrl: './pending-assessment-list.component.html',
  styleUrl: './pending-assessment-list.component.scss',
})
export class PendingAssessmentListComponent implements OnInit {
  actionDeleteVisible: boolean = false;
  isDeleting: boolean = false;
  selected_profile_column: any;
  action_items: any;
  total_items_input: any;
  pendingList: any;
  badge_name: any;
  table_name: any;
  isLoading: boolean = true;
  pendingListProfiles: any;
  selectPendingAssessment: any;
  sort_data: any;
  current_filters: any;

  constructor(
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _MessageService: MessageService,
    private _SharedService: SharedService,
    private _RiskService: RiskService,
    private _router: Router,
    private _ComplianceAssessmntService: ComplianceAssessmntService,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.Compliance'),
        icon: '',
        routerLink: '/gfw-portal/compliance/pending-assessments',
      },
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.Pending_Assessment'
        ),
        icon: '',
      },
        // {
        //   name: this._TranslateService.instant(
        //     'BREAD_CRUMB_TITLES.Cybersecurity_Governance'
        //   ),
        //   icon: '',
        // },
    ]);
  }
  ngOnInit() {


    this.action_items = [
      {
        label: this._TranslateService.instant(
          'ASSESSMENT_RISK.VIEW_ASSESSMENT'
        ),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._router.navigate(['/gfw-portal/compliance/pending-assessments',this.selectPendingAssessment]);
        },
         visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'ONGOINGASSESSMENT' , 'VIEW')
      },
      {
        label: this._TranslateService.instant(
          'ASSESSMENT_RISK.DELETE_ASSESSMENT'
        ),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.actionDeleteVisible = true;
        },
        visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'ONGOINGASSESSMENT' , 'DELETE')
      },
      // {
      //   label: this._TranslateService.instant(
      //     'ASSESSMENT_RISK.UPDATE_ASSESSMENT'
      //   ),
      //   icon: 'fi fi-rr-pencil',
      //   command: () => {
      //     // this._router.navigate(['/gfw-portal/risks-management/risk-action']);
      //   },
      // },
    ];

  }

  handleClosedDelete(event?: any) {
    console.log('delete');
    this.actionDeleteVisible = false;
  }
  deleteAsssessment() {
    console.log('deleted');
    this.isLoading = true;
    this.isDeleting = true;
    this._ComplianceAssessmntService.deleteAssessmnet(
      this.selectPendingAssessment
      ).subscribe((res) => {
        this.isDeleting = false;
        this.getPendingAssessmentList(this.current_payload)
        this.actionDeleteVisible = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Delete Assessmnet Deleted Successfully !',
        });
        this.isLoading = false;
      });
  }
  addNewAssessment(event?: any) {
    console.log('delete');
  }


   handleShowDelete(event: boolean) {
    this.actionDeleteVisible = true;
  }

  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  setSelectedRow(event: any) {
    this.selectPendingAssessment = event;
    console.log('role Selected', event);
  }
  current_payload:any
handleDataTable(payload:any){
  this.current_payload = payload
  this.getPendingAssessmentList(this.current_payload)
}
  getPendingAssessmentList(event?: any) {
    this.isLoading = true;
    this.pendingList = []
    this._ComplianceAssessmntService.getPendingAssessmnet(event).pipe(finalize(()=> this.isLoading = false )).subscribe(
      {
        next:(res: any) => {
      this.pendingList = res?.data?.items;
      this.pageginationObj = {
        perPage: res?.data?.pageSize,
        currentPage: res?.data?.pageNumber,
        totalItems: res?.data?.totalCount,
        totalPages: res?.data?.totalPages
      }
      this._SharedService.paginationSubject.next(this.pageginationObj);
      this.isLoading = false
    },
    error:(err:any)=>{
      this.isLoading = false
    }
      }
    )
  }

}
