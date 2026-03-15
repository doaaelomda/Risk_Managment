import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiComponent } from '@gfw/shared-ui';
import { DeleteConfirmPopupComponent, TextareaUiComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { SwitchUiComponent } from 'libs/shared/shared-ui/src/lib/switch-ui/switch-ui.component';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { finalize, Observable, Subscription } from 'rxjs';
import * as moment from 'moment';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { IndicatorService } from '../../services/indicator.service';
import { DatePackerComponent } from '@gfw/shared-ui';
import { SkeletonModule } from "primeng/skeleton";
import { RiskService } from 'libs/features/risks/src/services/risk.service';
import { InputTextComponent } from "libs/shared/shared-ui/src/lib/input-text/input-text.component";
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'lib-indicator-thresholdbland',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    DialogModule,
    DatePackerComponent,
    InputNumberComponent,
    TextareaUiComponent,
    UiDropdownComponent,
    SwitchUiComponent,
    SkeletonModule,
    InputTextComponent,
    NewTableComponent
],
  templateUrl: './indicator-thresholdbland.component.html',
  styleUrl: './indicator-thresholdbland.component.scss',
})
export class IndicatorThresholdblandComponent implements OnInit {

  // 📌 Observables & Subscriptions
  indicatorDataSub$!: Subscription;
  current_Indicator_data: any;
  actionDeleteVisible = false;
  inputActionVisible = false;
  update_flag = false;
  loadingBtn = false;
  loadDelted = false;
  loadingTableData = false;
  thresholdForm!: FormGroup;
  items: any[] = [];
  pageginationObj: PaginationInterface = {
    perPage: 0,
    currentPage: 0,
    totalItems: 0,
    totalPages: 0
  };
  loadingTable: boolean = true;
  dataTable: any[] = [];
  current_row_selected: any;
  data_payload:any
   columnControl: any = {
    type: 'Popup',
    data: '',
  };
  viewingItem:boolean = false
  viewed_data:any =''
  loadingViewedData:boolean = false
  severityTypes = []
  breadCrumb:any[] = []
  handleViewClick(){
    const indId = this.current_row_selected
    this.loadingViewedData = true
    this._IndicatorService.getIndicatorThresholdByID(indId).subscribe(res => {
      console.log(res,'view data');
      this.loadingViewedData = false
      const data = res?.data
      this.viewed_data = data
    })
    this.viewingItem = true
  }
  getLookUps() {
    this._riskService
      .getRiskActionLookupData([108])
      .subscribe((res) => {
        this.severityTypes = res?.data?.IndicatorThresholdSeverityType
      });

  }
  constructor(
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _IndicatorService: IndicatorService,
    private _SharedService: SharedService,
    private _MessageService: MessageService,
    private _riskService:RiskService,
    public _PermissionSystemService:PermissionSystemService,
    private route:ActivatedRoute
  ) {
    const module = this.route.parent?.snapshot.paramMap.get('module') ?? ''
        this.handleBreadCrumb(module)
    // Breadcrumb setup
 


    this.indicatorDataSub$ = this._IndicatorService.indicarotViwed.subscribe((res) => {
      this.current_Indicator_data = res;
       this.breadCrumb[this.breadCrumb.length - 2].name = res?.code;
    });
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
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      { name: this._TranslateService.instant('INDICATORS.INDICATOR'), icon: '', routerLink: listUrl },
      { name: '-', icon: '' },
      { name: 'Threshold Bands', icon: '', routerLink: '' }
    ];
    this._LayoutService.breadCrumbLinks.next(this.breadCrumb);
  
  
  }
  ngOnInit(): void {
    this.getLookUps()
    this.initForm();
    this.initActions();
  }
  setSelected(event: any) {
    this.current_row_selected = event;
  }
  // 🎯 Initialize Form
  initForm(data?: any): void {
    this.thresholdForm = new FormGroup({
      name:new FormControl(data?.name??null,Validators.required),
      indicatorThresholdSeverityTypeID: new FormControl(data ? data.indicatorThresholdSeverityTypeID : null, Validators.required),
      rangeFrom: new FormControl(data ? data.rangeFrom : null, [Validators.required, Validators.min(0)]),
      rangeTo: new FormControl(data ? data.rangeTo : null, [Validators.required, Validators.min(0)]),
      createBreachOnMatch: new FormControl(data ? data.createBreachOnMatch : false),
      effectiveDateFrom: new FormControl(data ? new Date(data.effectiveDateFrom) : null, Validators.required),
      effectiveDateTo: new FormControl(data ? new Date(data.effectiveDateTo) : null, Validators.required),
      note: new FormControl(data ? data.note : null, Validators.maxLength(500))
    });
  }

  // 🧭 Initialize Action Menu
  initActions(): void {
    this.items = [
      {
        label: this._TranslateService.instant('INDICATORS.VIEW_THRESHOLD'),
        icon: 'fi fi-rr-eye',
        command: () => { this.handleViewClick() },
        visible: ()=>this._PermissionSystemService.can('INDICATORS' , 'INDICATORTHRESHOLD' , 'VIEW')
      },
      {
        label: this._TranslateService.instant('INDICATORS.UPDATE_THRESHOLD'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this.update_flag = true;
          this._IndicatorService.getIndicatorThresholdByID(this.current_row_selected).subscribe((res: any) => {
            this.initForm(res.data);
            this.inputActionVisible = true;
          });
        },
        visible: ()=>this._PermissionSystemService.can('INDICATORS' , 'INDICATORTHRESHOLD' , 'EDIT')
      },
      {
        label: this._TranslateService.instant('INDICATORS.DELETE_THRESHOLD'),
        icon: 'fi fi-rr-trash',
        command: () => (this.actionDeleteVisible = true),
        visible: ()=>this._PermissionSystemService.can('INDICATORS' , 'INDICATORTHRESHOLD' , 'DELETE')
      }
    ];
  }

  // 🗑 Delete
  closeDeleteModal() {
    this.actionDeleteVisible = false;
  }
  handleClosedDelete() {
    this.actionDeleteVisible = false;
  }
  deleteThreshold(): void {
    this.loadDelted = true;
    this._IndicatorService.deleteIndicatorThreshold(this.current_row_selected)
      .pipe(finalize(() => (this.loadDelted = false)))
      .subscribe(() => {
        this._MessageService.add({ severity: 'success', summary: 'Success', detail: 'Threshold deleted successfully' });
        this.handleDataTable(this.data_payload);
        this.actionDeleteVisible = false;
      });
  }
  // 💾 Submit Form
  submit(): void {
        const canAdd = this._PermissionSystemService.can('INDICATORS' , 'INDICATORTHRESHOLD' , 'ADD') 
    const canEdit = this._PermissionSystemService.can('INDICATORS' , 'INDICATORTHRESHOLD' , 'EDIT') 
    if(this.update_flag && !canEdit)return
    if(!this.update_flag && !canAdd)return
    this.loadingBtn = true;

    const req: any = {
      ...this.thresholdForm.value,
      indicatorID: this.current_Indicator_data?.indicatorID,
      effectiveDateFrom: moment(this.thresholdForm.value.effectiveDateFrom).toISOString(),
      effectiveDateTo: moment(this.thresholdForm.value.effectiveDateTo).toISOString()
    };

    if (this.update_flag) req.indicatorThresholdBandID = this.current_row_selected;

    const API$: Observable<any> = this.update_flag
      ? this._IndicatorService.updateIndicatorThreshold(req)
      : this._IndicatorService.addIndicatorThreshold(req);

    API$.pipe(finalize(() => (this.loadingBtn = false))).subscribe(() => {
      this._MessageService.add({
        severity: 'success',
        summary: 'Success',
        detail: this.update_flag ? 'Threshold updated successfully' : 'Threshold added successfully'
      });
      this.initForm();
      this.update_flag = false;
      this.current_row_selected = null;
      this.handleDataTable(this.data_payload);
      this.inputActionVisible = false;
    });
  }
  // Fetch Data
  handleDataTable(event: any) {
    this.data_payload = event;
    this.getData(event);
  }
  getData(payload?: any) {
    this.dataTable = [];
    this.loadingTable = true;
     if (this.current_Indicator_data) {
      this._IndicatorService
        .getIndicatorThresholdList(
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
