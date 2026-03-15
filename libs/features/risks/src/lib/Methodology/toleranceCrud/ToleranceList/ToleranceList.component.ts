import { TranslateService, TranslateModule } from '@ngx-translate/core';
/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { finalize } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MethodologyToleranceService } from 'libs/features/risks/src/services/methodology-tolerance.service';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-tolerance-list',
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
    NewTableComponent,
  ],
  templateUrl: './ToleranceList.component.html',
  styleUrl: './ToleranceList.component.scss',
})
export class ToleranceListComponent implements OnInit {
  items: any[] = [];
  selected_profile_column: number = 0;
  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  loadingTable: boolean = true;
  actionDeleteVisible: boolean = false;
  loadDeleted: boolean = false;
  dataTable: any[] = [];
  toleranceProfiles: any[] = [];
  defultProfile: any;
  current_row_selected: any;
  sort_data: any;
  current_filters: any;
  riskMethodologyID: any;

  showViewOptionPopup: boolean = false;
  toleranceData: any;
  loading: boolean = false;

  constructor(
    private _MethodologyToleranceService: MethodologyToleranceService,
    private _SharedService: SharedService,
    private _MessageService: MessageService,
    private _TranslateService: TranslateService,
    private activatedRoute: ActivatedRoute,
    private _router: Router,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this.riskMethodologyID =
      this.activatedRoute.parent?.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.items = [
      {
        label: this._TranslateService.instant('Tolerance.VIEW'),
        icon: 'fi fi-rr-eye',
        command: () => this.onViewTolerance(),
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGYTOLERANCE' , 'VIEW')

      },
      {
        label: this._TranslateService.instant('Tolerance.DELETE_TITLE'),
        icon: 'fi fi-rr-trash',
        command: () => this.handleShowDelete(true),
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGYTOLERANCE' , 'DELETE')

      },
      {
        label: this._TranslateService.instant('Tolerance.UPDATE'),
        icon: 'fi fi-rr-pencil',
        command: () =>
          this._router.navigate([
            `/gfw-portal/risks-management/methodolgy/${this.riskMethodologyID}/update-tolerance/${this.current_row_selected}`,
          ]),
          visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGYTOLERANCE' , 'EDIT')

      },
    ];
  }

  handleDataTable(event: any) {
    this.data_payload = event;
    this.getToleranceData(event);
  }

  data_payload: any;

  columnControl: any;

  getToleranceData(payload?: any) {
    this.loadingTable = true;
    this._MethodologyToleranceService
      .gettolerance(payload, this.riskMethodologyID)
      .pipe(finalize(() => (this.loadingTable = false)))
      .subscribe((res: any) => {
        this.dataTable = res?.data?.items;
        this.pageginationObj = {
          perPage: res?.data?.pageSize,
          currentPage: res?.data?.pageNumber,
          totalItems: res?.data?.totalCount,
          totalPages: res?.data?.totalPages,
        };
        this._SharedService.paginationSubject.next(this.pageginationObj);
      });
  }

  handleShowDelete(event: boolean) {
    this.actionDeleteVisible = true;
  }
  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }

  deleteTolerance() {
     if(!this._PermissionSystemService.can('RISKS' , 'METHODOLOGYTOLERANCE' , 'DELETE')) return;

    this.loadDeleted = true;
    this._MethodologyToleranceService
      .deletetolerance(this.current_row_selected)
      .pipe(finalize(() => (this.loadDeleted = false)))
      .subscribe(() => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this._TranslateService.instant('Tolerance.DELETE_SUCCESS'),
        });
        this.actionDeleteVisible = false;
        this.getToleranceData();
      });
  }

  onViewTolerance(event?: any) {
    this.showViewOptionPopup = true;
    this.loading = true;
    this.toleranceData = null;
    this._MethodologyToleranceService
      .gettoleranceById(event?.riskToleranceID || this.current_row_selected)
      .subscribe((res: any) => {
        this.toleranceData = res?.data;
        this.loading = false;
      });
  }

  setSelected(event: any) {
    this.current_row_selected = event;
  }
}
