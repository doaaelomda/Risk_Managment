import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  DeleteConfirmPopupComponent,
  TextareaUiComponent,
} from '@gfw/shared-ui';
import { FactorsService } from 'libs/features/risks/src/services/factor-level.service';
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
import { DialogModule } from 'primeng/dialog';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { MothodologyService } from 'libs/features/risks/src/services/methodology.service';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { ColorDropdownComponent } from 'libs/shared/shared-ui/src/lib/color-dropdown/color-dropdown.component';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-factor-level',
  imports: [
    CommonModule,
    NewTableComponent,
    ButtonModule,
    TranslateModule,
    DeleteConfirmPopupComponent,
    ReactiveFormsModule,
    DialogModule,
    InputNumberComponent,
    ColorDropdownComponent,
    InputTextComponent,
    TextareaUiComponent,
  ],
  templateUrl: './factorLevel.component.html',
  styleUrl: './factorLevel.component.scss',
})
export class FactorLevelComponent implements OnInit, OnDestroy {
  // Declaration Variables
  action_items: any;
  isDeleting: boolean = false;
  actionDeleteVisible: boolean = false;
  factorLevelList: any[] = [];
  isLoading: boolean = false;
  current_payload: any;
  current_Id: any;
  methodolgyId: any;
  riskFactorID: any;
  editFactorLevel: boolean = false;
  quickAddVisible: boolean = false;
  loadingBtn: boolean = false;
  riskFactorLevelID: any;
  form!: FormGroup;
  columnControl: any = {};
  paginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  validationsRequired = [{ key: 'required', message: 'VALIDATIONS.REQUIRED' }];
  private subscription: Subscription = new Subscription();
  // Initial Constructor
  constructor(
    private _TranslateService: TranslateService,
    private FactorService: FactorsService,
    private _SharedService: SharedService,
    private _ActivatedRoute: ActivatedRoute,
    private _MessageService: MessageService,
    private _router: Router,
    private _LayoutService: LayoutService,
    private _methodologyS: MothodologyService,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this.methodolgyId =
      this._ActivatedRoute.parent?.snapshot.paramMap.get('methodolgyId');
    this.riskFactorID =
      this._ActivatedRoute.parent?.snapshot.paramMap.get('id');
    this.columnControl = {
      type: 'route',
      data: `gfw-portal/risks-management/methodolgy/${this.methodolgyId}/factors/${this.riskFactorID}/factorsLevel`,
    };
  }
  // Methods
  addNewFactorLevel() {
    this.quickAddVisible = true;
  }
  // method to handle close delete popup
  handleClosedDelete() {
    this.actionDeleteVisible = false;
  }
  deleteFactorLevel() {
     if(!this._PermissionSystemService.can('RISKS' , 'METHODOLOGYFACTORLEVELS' , 'DELETE')) return;
    this.isLoading = true;
    this.isDeleting = true;
    this.subscription = this.FactorService.deleteFactorLevel(
      this.current_Id
    ).subscribe({
      next: () => {
        this.isDeleting = false;
        this.actionDeleteVisible = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'success',
          detail: 'Factor Level is Deleted Done',
        });
        this.isLoading = false;
        this.handleDataTable(this.current_payload);
      },
      error: (err) => {
        this.isDeleting = false;
        this.isLoading = false;
      },
    });
  }

  // Set Bread Crumb
  Data: any;
  handleBreadCrumb() {
    this._ActivatedRoute?.parent?.paramMap.subscribe((res: any) => {
      this.riskFactorID = res.get('id');
      if (this.riskFactorID) {
        const sub = this.FactorService.getById(this.riskFactorID).subscribe(
          (res: any) => {
            this.Data = res?.data;
            this.getDataMethodology();
          }
        );
        this.subscription.add(sub);
      }
    });
  }
  // get Data Methodolgy
  getDataMethodology() {
    this._methodologyS.getById(this.methodolgyId).subscribe((res: any) => {
      this._LayoutService.breadCrumbLinks.next([
        {
          name: '',
          icon: 'fi fi-rs-home',
          routerLink: '/',
        },
        {
          name: this._TranslateService.instant(
            'BREAD_CRUMB_TITLES.METHODOLOGY'
          ),
          icon: '',
          routerLink: '/gfw-portal/risks-management/methodolgy/list',
        },
        {
          name: this._TranslateService.instant('METHODOLOGY.METHODOLOGYS_LIST'),
          icon: '',
          routerLink: '/gfw-portal/risks-management/methodolgy/list',
        },
        {
          name: res?.data?.name || '-',
          routerLink: `/gfw-portal/risks-management/methodolgy/${this.methodolgyId}/factors`,
        },

        {
          name: this._TranslateService.instant('FACTOR.TABLE_TITLE'),
          routerLink: `/gfw-portal/risks-management/methodolgy/${this.methodolgyId}/factors`,
        },

        {
          name: this.Data?.name || '-',
          icon: '',
          routerLink: `/gfw-portal/risks-management/methodolgy/${this.methodolgyId}/factors/${this.riskFactorID}/overview`,
        },
        {
          name: this._TranslateService.instant('TABS.factorLevel'),
          icon: '',
        },
      ]);
    });
  }
  // Initial Form
  initForm(data?: any) {
    this.form = new FormGroup({
      weight: new FormControl(data?.weight, Validators.required),
      minValue: new FormControl(data?.minValue, Validators.required),
      maxValue: new FormControl(data?.maxValue, Validators.required),
      color: new FormControl(data?.color),
      name: new FormControl(data?.name, Validators.required),
      nameAr: new FormControl(data?.nameAr, Validators.required),
      description: new FormControl(data?.description, Validators.required),
      descriptionAr: new FormControl(data?.descriptionAr, Validators.required),
    });
  }

  // handleActionList
  handleActionList() {
    this.action_items = [
      {
        label: this._TranslateService.instant('FACTOR_LEVEL.VIEW_FACTOR'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._router.navigate([
            `/gfw-portal/risks-management/methodolgy/${this.methodolgyId}/factors/${this.riskFactorID}/factorsLevel/${this.current_Id}`,
          ]);
        },
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGYFACTORLEVELS' , 'VIEW')
      },
      {
        label: this._TranslateService.instant('FACTOR_LEVEL.DELETE_FACTOR'),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.actionDeleteVisible = true;
        },
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGYFACTORLEVELS' , 'DELETE')
      },
      {
        label: this._TranslateService.instant('FACTOR_LEVEL.UPDATE_FACTOR'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this.quickAddVisible = true;
          this.editFactorLevel = true;
          this.getFactorById();
        },
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGYFACTORLEVELS' , 'EDIT')
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
    this.factorLevelList = [];
    this.subscription = this.FactorService.findAllFactorLevel(
      payload,
      this.methodolgyId,
      this.riskFactorID
    )
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          this.factorLevelList = res?.data?.items;
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
  getFactorById() {
    this.subscription = this.FactorService.getByIdFactorLevel(
      this.current_Id
    ).subscribe((res: any) => {
      this.initForm(res?.data);
      this.riskFactorLevelID = res?.data?.riskFactorLevelID;
    });
  }
  submit() {
    const canAdd = this._PermissionSystemService.can('RISKS' , 'METHODOLOGYFACTORLEVELS' , 'ADD')
    const canEdit = this._PermissionSystemService.can('RISKS' , 'METHODOLOGYFACTORLEVELS' , 'EDIT')
    if(this.riskFactorLevelID && !canEdit)return
    if(!this.riskFactorLevelID && !canAdd)return
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const req = { ...this.form.value, riskFactorID: this.riskFactorID };

    if (this.riskFactorLevelID) {
      req.riskFactorLevelID = this.riskFactorLevelID;
    }

    const APT$: Observable<any> = this.riskFactorLevelID
      ? this.FactorService.saveFactorLevel(req, this.riskFactorLevelID)
      : this.FactorService.saveFactorLevel(req);

    this.subscription = APT$.pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((res: any) => {
      this._MessageService.add({
        severity: 'success',
        summary: 'Success',
        detail: this.riskFactorLevelID
          ? 'Factor Level Updated Successfully'
          : 'Factor Level Added Successfully ',
      });
      this.quickAddVisible = false;
      this.getDataTable(this.current_payload);
    });
  }
  // Life Cycle Hooks
  ngOnInit(): void {
    this.handleActionList();
    this.initForm();
    this.handleBreadCrumb();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
