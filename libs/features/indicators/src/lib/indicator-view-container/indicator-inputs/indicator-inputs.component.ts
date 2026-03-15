import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DeleteConfirmPopupComponent,
  TextareaUiComponent,
  DatePackerComponent,
} from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { IndicatorService } from '../../services/indicator.service';
import { finalize, Observable, Subscription } from 'rxjs';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import * as moment from 'moment';
import { DialogModule } from 'primeng/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SkeletonModule } from 'primeng/skeleton';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'lib-indicator-inputs',
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    NewTableComponent,
    ReactiveFormsModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    DialogModule,
    InputTextComponent,
    TextareaUiComponent,
    SkeletonModule,
    DatePackerComponent,
  ],
  templateUrl: './indicator-inputs.component.html',
  styleUrl: './indicator-inputs.component.scss',
})
export class IndicatorInputsComponent implements OnInit {
  current_Indicator_data: any;
  indicatorDataSub$!: Subscription;
  breadCrumb: any[] = [];
  viewingItem: boolean = false;
  viewed_data: any = '';
  loadingViewedData: boolean = false;
  items: any[] = [];
  actionDeleteVisible: boolean = false;
  selected_profile_column: number = 0;
  pageginationObj: PaginationInterface = {
    perPage: 0,
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  };
  columnControl: any = {
    type: 'Popup',
    data: '',
  };
  data_payload: any;
  current_filters: any[] = [];
  sort_data: any;
  loadingTable: boolean = true;
  dataTable: any[] = [];
  current_row_selected: any;
  loadDelted: boolean = false;
  update_flag: boolean = false;
  inputActionVisible: boolean = false;
  loadingBtn: boolean = false;
  inputForm!: FormGroup;
  constructor(
    private _LayoutService: LayoutService,
    private _MessageService: MessageService,
    private _TranslateService: TranslateService,
    private _IndicatorService: IndicatorService,
    private _SharedService: SharedService,
    public _PermissionSystemService:PermissionSystemService,
    private route:ActivatedRoute
  ) {
        const module = this.route.parent?.snapshot.paramMap.get('module') ?? ''
        this.handleBreadCrumb(module)


  
    this.indicatorDataSub$ = this._IndicatorService.indicarotViwed.subscribe(
      (res) => {
        this.current_Indicator_data = res;
        this.breadCrumb[this.breadCrumb.length - 2].name = res?.code;
      }
    );
  }
     handleBreadCrumb(module: string) {
    let listUrl = '/gfw-portal/indicators/KPI'
    switch(module){
      case 'risks':{
        listUrl = '/gfw-portal/risks-management/KRI'
      }break;
      case 'compliance':{
        listUrl = '/gfw-portal/compliance/KCI'
      }break;
      case 'thirdparties':{
        listUrl = '/gfw-portal/third-party/KTI'
      }break;
      default:'/gfw-portal/indicators/KPI'
    }
      this.breadCrumb = [
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('INDICATORS.INDICATOR'),
        icon: '',
        routerLink: listUrl,
      },
      {
        name: '-',
        icon: '',
      },
      {
        name: 'Inputs',
        icon: '',
        link: '',
      },
    ];
    this._LayoutService.breadCrumbLinks.next(this.breadCrumb);
  
  
  }
  handleViewClick() {
    const indId = this.current_row_selected;
    console.log(this.current_row_selected, 'indId');
    this.loadingViewedData = true;
    this._IndicatorService.getIndicatorInputByID(indId).subscribe((res) => {
      this.loadingViewedData = false;
      const data = res?.data;
      this.viewed_data = data;
    });
    this.viewingItem = true;
  }
  ngOnInit(): void {
    this.initForm();
    this.items = [
      {
        label: this._TranslateService.instant('INDICATORS.VIEW_INPUT'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this.handleViewClick();
          //
        },
        visible: ()=>this._PermissionSystemService.can('INDICATORS' , 'INDICATORINPUTS' , 'VIEW')
      },
      {
        label: this._TranslateService.instant('INDICATORS.DELETE_INPUT'),
        icon: 'fi fi-rr-trash',
        command: () => {
          //
          this.actionDeleteVisible = true;
        },
        visible: ()=>this._PermissionSystemService.can('INDICATORS' , 'INDICATORINPUTS' , 'DELETE')
      },
      {
        label: this._TranslateService.instant('INDICATORS.UPDATE_INPUT'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          //
          this.update_flag = true;

          this._IndicatorService
            .getIndicatorInputByID(this.current_row_selected)
            .subscribe((res: any) => {
              this.initForm(res?.data);
              this.inputActionVisible = true;
            });
        },
        visible: ()=>this._PermissionSystemService.can('INDICATORS' , 'INDICATORINPUTS' , 'EDIT')
      },
    ];

  }
  setSelected(event: any) {
    this.current_row_selected = event;
  }
  handleClosedDelete() {
    this.actionDeleteVisible = false;
  }
  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }
  deleteIndicatorInput() {
    this.loadDelted = true;
    this._IndicatorService
      .deleteIndicatorInput(this.current_row_selected)
      .pipe(finalize(() => (this.loadDelted = false)))
      .subscribe((res: any) => {
        this.closeDeleteModal();
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Indicator Input Deleted Successfully',
        });
        this.handleDataTable(this.data_payload);
      });
  }
  initForm(data?: any): void {
    this.inputForm = new FormGroup({
      code: new FormControl(data ? data?.code : null, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      name: new FormControl(data ? data?.name : null, [
        Validators.required,
        Validators.maxLength(100),
      ]),
      description: new FormControl(data ? data?.description : null, [
        Validators.maxLength(500),
      ]),
      effectiveDateFrom: new FormControl(
        data ? new Date(data?.effectiveDateFrom) : null,
        [Validators.required]
      ),
      effectiveDateTo: new FormControl(
        data ? new Date(data?.effectiveDateTo) : null,
        [Validators.required]
      ),
    });
  }
  submit() {
                const canAdd = this._PermissionSystemService.can('INDICATORS' , 'INDICATORINPUTS' , 'ADD') 
    const canEdit = this._PermissionSystemService.can('INDICATORS' , 'INDICATORINPUTS' , 'EDIT') 
    if(this.update_flag && !canEdit)return
    if(!this.update_flag && !canAdd)return
    this.loadingBtn = true;

    const req: any = {
      ...this.inputForm.value,
      indicatorID: this.current_Indicator_data?.indicatorID,
      effectiveDateFrom: moment(this.inputForm.value.effectiveDateFrom).format(
        'YYYY-MM-DD'
      ),
      effectiveDateTo: moment(this.inputForm.value.effectiveDateTo).format(
        'YYYY-MM-DD'
      ),
    };

    if (this.update_flag) {
      req.indicatorInputTypeID = this.current_row_selected;
    }

    const API$: Observable<any> = this.update_flag
      ? this._IndicatorService.updateIndicatorInput(req)
      : this._IndicatorService.addIndicatorInput(req);

    API$.pipe(finalize(() => (this.loadingBtn = false))).subscribe(
      (res: any) => {
        this.loadingBtn = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.update_flag
            ? 'Input Updated Successfully'
            : 'Input Added Successfully',
        });
        this.initForm();
        this.update_flag = false;
        this.current_row_selected = null;
        this.handleDataTable(this.data_payload);
        this.inputActionVisible = false;
      }
    );
  }
  handleDataTable(event: any) {
    this.data_payload = event;
    this.getData(event);
  }
  getData(payload?: any) {
    this.dataTable = [];
    this.loadingTable = true;
    if (this.current_Indicator_data) {
      this._IndicatorService
        .getIndicatorsInputsList(
          payload,
          this.current_Indicator_data?.indicatorID
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
  }
}
