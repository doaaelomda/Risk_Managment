import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { RiskService } from './../../../../risks/src/services/risk.service';
import { SwitchUiComponent } from './../../../../../shared/shared-ui/src/lib/switch-ui/switch-ui.component';
import { TextareaUiComponent } from './../../../../../shared/shared-ui/src/lib/textarea-ui/textarea-ui.component';
import { UiDropdownComponent } from './../../../../../shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { InputTextComponent } from './../../../../../shared/shared-ui/src/lib/input-text/input-text.component';
import { DeleteConfirmPopupComponent } from './../../../../../shared/shared-ui/src/lib/delete-confirm-popup/delete-confirm-popup.component';
/* eslint-disable @nx/enforce-module-boundaries */
import { LayoutService } from './../../../../../../apps/gfw-portal/src/app/core/services/layout.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { finalize, Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EsclationService } from '../../services/esclation.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-esclation-list',
  imports: [
    CommonModule,
    SwitchUiComponent,
    TextareaUiComponent,
    FormsModule,
    UiDropdownComponent,
    InputTextComponent,
    ReactiveFormsModule,
    DeleteConfirmPopupComponent,
    TranslateModule,
    DialogModule,
    ButtonModule,
    NewTableComponent
  ],
  templateUrl: './esclation-list.component.html',
  styleUrl: './esclation-list.component.scss',
})
export class EsclationListComponent {
  constructor(
    // private _EscalationService: EscalationService,
    private _SharedService: SharedService,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _MessageService: MessageService,
    private _Router: Router,
    private _EsclationService: EsclationService,
    private _riskS:RiskService,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this._LayoutService.breadCrumbLinks.next([
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      {
        name: this._TranslateService.instant('ESCALATION.BREADCRUMB'),
        icon: '',
        routerLink: '/gfw-portal/escalation',
      },
      {
        name: this._TranslateService.instant('ESCALATION.LIST_TITLE'),
        icon: '',
        routerLink: '/gfw-portal/esclation/list',
      },
    ]);
  }

  // UI & table state
  items: any[] = [];
  selected_profile_column = 0;
  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 0,
  };
  current_filters: any[] = [];
  sort_data: any;
  loadingTable = true;
  dataTable: any[] = [];
  current_row_selected: any;
  actionDeleteVisible = false;
  loadDeleted = false;

  // view modal
  viewModalVisible = false;
  EscalationData: any;
  loadViewData = false;

  // profiles
  escalationProfiles: newProfile[] = [];
  defultProfile!: newProfile;

  escalationSub$!: Subscription;
  esclationTypes = []
  dataEntities = []
  getEsclationTypesLookUp(){
    this._riskS.getRiskActionLookupData([87,113]).subscribe(res => {
      this.dataEntities = res?.data?.DataEntityType
      this.esclationTypes = res?.data?.EscalationType
        console.log(res,'got esclationTypes');
        
    })
  }
  ngOnInit(): void {
    this.getEsclationTypesLookUp()
    this.initEscalationForm();
    this.escalationProfiles = [this.defultProfile];

    this.items = [
      {
        label: this._TranslateService.instant('ESCALATION.VIEW'),
        icon: 'fi fi-rr-eye',
        command: () => {
          this._Router.navigate(['/gfw-portal/esclation/view', this.current_row_selected]);
        },
        visible: ()=>this._PermissionSystemService.can('ESCLATIONS' , 'ESCLATION' , 'VIEW')
      },
      {
        label: this._TranslateService.instant('ESCALATION.DELETE'),
        icon: 'fi fi-rr-trash',
        command: () => this.handleShowDelete(true),
        visible: ()=>this._PermissionSystemService.can('ESCLATIONS' , 'ESCLATION' , 'DELETE')
      },
      
      {
        label: this._TranslateService.instant('ESCALATION.EDIT'),
        icon: 'fi fi-rr-pencil',
        command: () => {
          this.handleEditClick();
        },
        visible: ()=>this._PermissionSystemService.can('ESCLATIONS' , 'ESCLATION' , 'EDIT')
      },
    ];

  }
  handleEditClick() {
    this.showDialog = true;
    this.isEditingEsc = true;
    this._EsclationService
      .getEsclationById(this.current_row_selected)
      .subscribe((res:any) => {
        console.log(res, 'got esclation by id');
        const data = res?.data
        this.initEscalationForm(data)
      });
 
  }


  // selection / handlers
  setSelected(event: any) {
    console.log(event, 'selected esclation');

    this.current_row_selected = event;
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





  // fetch list
  getEscalationsData(event?: any) {
    this.dataTable = [];
    this.loadingTable = true;

    this._EsclationService
      .getEsclationListSearch(
        event
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
        },
        error: () => (this.loadingTable = false),
      });
  }

  // delete
  deleteEscalation() {
     if(!this._PermissionSystemService.can('ESCLATIONS' , 'ESCLATION' , 'DELETE')) return;

    this.loadDeleted = true;
    this._EsclationService
      .deleteEscalation(this.current_row_selected)
      .pipe(finalize(() => (this.loadDeleted = false)))
      .subscribe(() => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this._TranslateService.instant('ESCALATION.DELETED_SUCCESS'),
        });
        this.getEscalationsData(this.current_payload);
        this.handleClosedDelete(false);
      });
  }

  // view
  onViewModalEscalation(event?: any) {
    this.viewModalVisible = true;
    this.loadViewData = true;
    this.EscalationData = null;
    // this._EscalationService.getEscalationById(event?.escalationId).subscribe((res: any) => {
    //   this.EscalationData = res?.data;
    //   this.loadViewData = false;
    // });
  }
  columnControl:any ={
    type:'route',
    data:'/gfw-portal/esclation/view'
  }
  current_payload:any
  handleDataTable(payload:any){
    this.current_payload = payload
    this.getEscalationsData(this.current_payload)
  }

  getByIdEscalation() {
    this.viewModalVisible = true;
    this.loadViewData = true;
    this.EscalationData = null;
    // this._EscalationService.getEscalationById(this.current_row_selected).subscribe((res: any) => {
    //   this.EscalationData = res?.data;
    //   this.loadViewData = false;
    // });
  }

  escalation_form!: FormGroup;
  showDialog = false;
  formMode: 'add' | 'edit' = 'add';
  loadSave = false;

  closeDialog() {
    this.showDialog = false;
    this.escalation_form.reset()
  }

  initEscalationForm(data?: any) {
    this.escalation_form = new FormGroup({
      code: new FormControl(data?.code || '', Validators.required),

      dataEntityTypeID: new FormControl(data?.dataEntityTypeID || null, Validators.required),

      name: new FormControl(data?.name || '', Validators.required),
      nameAr: new FormControl(data?.nameAr || ''),

      description: new FormControl(
        data?.description || '',
        Validators.required
      ),
      descriptionAr: new FormControl(
        data?.descriptionAr || '',
        Validators.required
      ),
   escalationTypeID: new FormControl(data?.escalationTypeID || null, Validators.required),
      active: new FormControl(data?.active ?? true), // default active
    });
  }
  isEditingEsc: boolean = false;
  saveEscalation() {
    const canAdd = this._PermissionSystemService.can('ESCLATIONS' , 'ESCLATION' , 'ADD') 
    const canEdit = this._PermissionSystemService.can('ESCLATIONS' , 'ESCLATION' , 'EDIT') 
    if(this.isEditingEsc && !canEdit)return
    if(!this.isEditingEsc && !canAdd)return
    const msg = this.isEditingEsc ? 'updated' : 'added';
    let data = this.escalation_form.value;
    if (this.isEditingEsc) {
      data = { ...data, escalationDefinationID: this.current_row_selected };
    }
    if (this.escalation_form.invalid) return;

    this.loadSave = true;
    this._EsclationService.saveEsclation(data).pipe(finalize(() => this.loadSave = false)).subscribe({
      next: (res) => {
        this.loadSave = true;
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Esclation ${msg} successfully`,
        });
        this.showDialog = false
        this.getEscalationsData(this.current_payload)
        this.escalation_form.reset()
      },
      error: (err) => {
        this.loadSave = true;
      },
    });
  }
}
