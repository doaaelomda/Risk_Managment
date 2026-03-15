import { TranslateService } from '@ngx-translate/core';
/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { DashboardLayoutService } from '../../../services/dashboard-layout.service';
import { NewTableComponent } from "libs/shared/shared-ui/src/lib/new-table/new-table.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-general-assessment-list',
  imports: [
    CommonModule,
    TranslateModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    MenuModule,
    NewTableComponent
],
  templateUrl: './general-assessment-list.component.html',
  styleUrl: './general-assessment-list.component.scss',
})
export class GeneralAssessmentListComponent implements OnInit {
  loadDeleted: boolean = false;
  actionDeleteVisible: boolean = false;
  items: any[] = [];
  selected_profile_column: number = 0;
  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  current_filters: any[] = [];
  sort_data: any;
  routesParams: any;
  loadingTable: boolean = true;
  dataTable: any[] = [];
  current_row_selected: any;
  thridId: any;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _MessageService: MessageService,
    private _Router: Router,
    private _TranslateService: TranslateService,
    private _SharedService: SharedService,
    private _dashboardLayoutService: DashboardLayoutService,
    public _PermissionSystemService:PermissionSystemService
  ) {}

  ngOnInit(): void {
    const routeData = this._ActivatedRoute.snapshot.data;
    const param = this._ActivatedRoute.parent?.snapshot.params;
    console.log('routeData', routeData);
    this.routesParams = routeData;
    console.log('routeparam', param);
    this.items = [
      {
        label: this._TranslateService.instant(
          'GENERAL_ASSESSMENT.View_Assessment'
        ),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._Router.navigate([
          `/gfw-portal/third-party/${this.thridId}/overview-assessment`,this.current_row_selected,
          ]);
        },
        visible: ()=>this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYASSESSMENT' , 'VIEW')

      },
      {
        label: this._TranslateService.instant(
          'GENERAL_ASSESSMENT.Delete_Assessment'
        ),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.handleShowDelete(true);
        },
      visible: ()=>this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYASSESSMENT' , 'DELETE')
      },
      {
        label: this._TranslateService.instant(
          'GENERAL_ASSESSMENT.Update_Assessment'
        ),
        icon: 'fi fi-rr-pencil',
        command: () => {
             this._Router.navigate([
            `/gfw-portal/third-party/${this.thridId}/update-assessment`,this.current_row_selected,
          ]);
        },
                visible: ()=>this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYASSESSMENT' , 'EDIT')
      },
    ];
    if (param) {
      this.thridId = param['id'];
       this.columnControl = {
      type: 'route',
      data:  `/gfw-portal/third-party/${this.thridId}/overview-assessment/`,
    };
    }
   
      
  }


  handleShowDelete(event: boolean) {
    this.actionDeleteVisible = true;
  }

  handleClosedDelete(event: boolean) {
    this.actionDeleteVisible = false;
  }


  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }

  setSelected(event: any) {
    this.current_row_selected = event;
  }

    handleDataTable(event: any) {
    this.data_payload = event;
    this.getAssessmentsData(event);
  }

  data_payload: any;


  columnControl: any;




 
  getAssessmentsData(event?: any) {
    this.dataTable = [];
    this.loadingTable = true;
    this._dashboardLayoutService
      .getGeneralAssessmentsList(
        event,
        this.routesParams.dataEntityTypeID,
        this.thridId,
        0
        // this.routesParams.generalAssessmentTypeID,
      )
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
          this.loadingTable = false;
        },
        error: (err: any) => {
          this.loadingTable = false;
        },
      });
  }

  deleteAssessment() {
     if(!this._PermissionSystemService.can('THIRDPARTIES' , 'THIRDPARTYASSESSMENT' , 'DELETE')) return;

    this.loadDeleted = true;
    this._dashboardLayoutService
      .deleteGeneralAssessments(this.current_row_selected)
      .pipe(finalize(() => (this.loadDeleted = false)))
      .subscribe({
        next: (res: any) => {
          this.loadDeleted = false;
          this.closeDeleteModal();
          this.getAssessmentsData();

          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'General Assessment Deleted Successfully ',
          });
        },
        error: (err: any) => {
          this.loadDeleted = false;
        },
      });
  }

  addGeneralAssessment() {
    this._Router.navigate([
      `/gfw-portal/third-party/${this.thridId}/add-assessment`,
    ]);
  }
}
