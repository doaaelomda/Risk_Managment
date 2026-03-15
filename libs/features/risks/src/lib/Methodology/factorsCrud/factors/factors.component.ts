import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { finalize, Observable, Subscription } from 'rxjs';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { DialogModule } from 'primeng/dialog';
import { FactorsService } from 'libs/features/risks/src/services/factor-level.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-factors',
  imports: [
    CommonModule,
    NewTableComponent,
    ButtonModule,
    TranslateModule,
    DeleteConfirmPopupComponent,
    ReactiveFormsModule,
    DialogModule,
  ],
  templateUrl: './factors.component.html',
  styleUrl: './factors.component.scss',
})
export class FactorsComponent implements OnInit, OnDestroy {
  // Declaration Variables
  action_items: any;
  isDeleting: boolean = false;
  actionDeleteVisible: boolean = false;
  factorList: any[] = [];
  isLoading: boolean = false;
  current_payload: any;
  current_Id: any;
  methodolgyId: any;
  editFactor: boolean = false;
  quickAddVisible: boolean = false;
  loadingBtn: boolean = false;
  current_update_id: any;
  form!: FormGroup;
  columnControl: any = {};
  paginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  private subscription: Subscription = new Subscription();
  // Initial Constructor
  constructor(
    private _TranslateService: TranslateService,
    private __FactorService: FactorsService,
    private _SharedService: SharedService,
    private _ActivatedRoute: ActivatedRoute,
    private _MessageService: MessageService,
    private _router: Router,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this.methodolgyId =
      this._ActivatedRoute.parent?.snapshot.paramMap.get('id');
    this.columnControl = {
      type: 'route',
      data: `gfw-portal/risks-management/methodolgy/${this.methodolgyId}/factors`,
    };
  }
  // Methods
  addNewFactor() {
    this._router.navigate([
      `/gfw-portal/risks-management/methodolgy/${this.methodolgyId}/addFactor`,
    ]);
  }
  // method to handle close delete popup
  handleClosedDelete() {
    this.actionDeleteVisible = false;
  }
  deleteFactor() {
     if(!this._PermissionSystemService.can('RISKS' , 'METHODOLOGYFACTORS' , 'DELETE')) return;

    this.isLoading = true;
    this.isDeleting = true;
    this.subscription = this.__FactorService.delete(this.current_Id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.actionDeleteVisible = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'success',
          detail: 'Factor is Deleted Done',
        });
        this.isLoading = false;
        this.getDataTable(this.current_payload);
      },
      error: (err) => {
        this.isDeleting = false;
        this.isLoading = false;
      },
    });
  }

  // handleActionList
  handleActionList() {
    this.action_items = [
      {
        label: this._TranslateService.instant('FACTOR.VIEW_FACTOR'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._router.navigate([
            `/gfw-portal/risks-management/methodolgy/${this.methodolgyId}/factors/${this.current_Id}`,
          ]);
        },
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGYFACTORS' , 'VIEW')

      },
      {
        label: this._TranslateService.instant('FACTOR.DELETE_FACTOR'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.actionDeleteVisible = true;
        },
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGYFACTORS' , 'DELETE')
      },
      {
        label: this._TranslateService.instant('FACTOR.UPDATE_FACTOR'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this._router.navigate([
            `/gfw-portal/risks-management/methodolgy/${this.methodolgyId}/updateFactor/${this.current_Id}`,
          ]);
        },
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGYFACTORS' , 'EDIT')
      },
    ];
  }

  setSelectedRow(event: any) {
    this.current_Id = event;
  }
  // method to get payload and calling data table
  handleDataTable(payload: any = null) {
    this.current_payload = payload;
    this.getDataTable(payload);
  }
  // method to get data table
  getDataTable(payload: any) {
    this.isLoading = true;
    this.factorList = [];
    this.subscription = this.__FactorService
      .findAll(payload, this.methodolgyId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          this.factorList = res?.data?.items;
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

  closeQuickAddModal() {
    this.quickAddVisible = false;
    this.form.reset();
  }
  // get Factor Id
  // Life Cycle Hooks
  ngOnInit(): void {
    this.handleActionList();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
