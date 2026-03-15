import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { TextareaUiComponent } from '@gfw/shared-ui';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { newProfile } from 'libs/shared/shared-ui/src/models/newProfiles';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import {MothodologyService} from '../../../services/methodology.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextComponent } from "libs/shared/shared-ui/src/lib/input-text/input-text.component";
import { NewTableComponent } from "libs/shared/shared-ui/src/lib/new-table/new-table.component";
import { UiDropdownComponent } from "libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-methodology-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MenuModule,
    DeleteConfirmPopupComponent,
    ButtonModule,
    DialogModule,
    SkeletonModule,
    InputTextComponent,
    TextareaUiComponent,
    ReactiveFormsModule,
    FormsModule,
    NewTableComponent,
    UiDropdownComponent
],
  templateUrl: './methodology-list.component.html',
  styleUrl: './methodology-list.component.scss',
})
export class MethodologyListComponent implements OnInit {
    handleDataTable(event: any) {
    this.data_payload = event;
    this.getListData(event);
  }
    columnControl: any = {
    type: 'route',
    data: '/gfw-portal/risks-management/methodolgy',
  };

  data_payload: any;

  // ─────────────────────────────
  // General State
  // ─────────────────────────────
  loading = true;
  loadingDelete = false;
  deleteModalVisible = false;
  selectedRow: any = null;

  // ─────────────────────────────
  // Entity / Configuration
  // ─────────────────────────────
  private readonly FEATURE_KEY = 'METHODOLOGY';
  private readonly FEATURE_NAME = 'METHODOLOGY';
  private readonly featureDisplayName = 'Methodology';
  private readonly ENTITY_ROUTE = '/gfw-portal/questionnaire';

  readonly updateRoute = '/gfw-portal/risks-management/risk-action';
  readonly viewRoute = `/gfw-portal/risks-management/methodolgy`
  readonly serviceName = 'methodService';
  readonly entityIdField = 'riskMethodologyID';
  readonly dataEntityId = 92;

  // ─────────────────────────────
  // Translatable Keys
  // ─────────────────────────────
  labels = {
    view: '',
    delete: '',
    update: '',
    add: '',
    titleDelete: '',
    descDelete: '',
    badge: '',
    table: '',
  };

  // ─────────────────────────────
  // Profiles + Table
  // ─────────────────────────────
  selectedProfileId = 0;
  entityProfiles: newProfile[] = [];
  defaultProfile!: newProfile;
  tableData: any[] = [];
  sortState: any = null;
  currentFilters: any[] = [];

  pagination: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 10,
    totalPages: 1,
  };

  // ─────────────────────────────
  // UI Actions
  // ─────────────────────────────
  actionItems: any[] = [];

  constructor(
    private router: Router,
    private messageService: MessageService,
    private sharedService: SharedService,
    private translate: TranslateService,
    private layout: LayoutService,
    private methodService:MothodologyService, // DO NOT REMOVE !!
    public _PermissionSystemService:PermissionSystemService
  ) {
  }

  // ─────────────────────────────
  // Lifecycle
  // ─────────────────────────────
  ngOnInit(): void {
    this.initializeTranslations();
    this.setupActionItems();
    this.getLookup()
    this.initForm()
    this.initBreadcrumb()
    
  }
  private initBreadcrumb(): void {
    const containerKey = 'BREAD_CRUMB_TITLES.METHODOLOGY';
    this.setBreadcrumb(containerKey, [
      { nameKey: containerKey },
      {
        nameKey: 'METHODOLOGY.METHODOLOGYS_LIST',
        routerLink: '/gfw-portal/risks-management/methodolgy/list',
      },

    ]);
  }

  getLookup(){
    this.sharedService.lookUps([236]).subscribe((res:any) => {
      this.approaches_list = res?.data?.RiskAssessmentApproach
    }
    );
  }
  private setBreadcrumb(
    titleKey: string,
    links: { nameKey: string; icon?: string; routerLink?: string }[]
  ): void {
    this.layout.breadCrumbTitle.next(this.translate.instant(titleKey));
    const translatedLinks = [
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      ...links.map((link) => ({
        name: this.translate.instant(link.nameKey),
        icon: link.icon ?? '',
        ...(link.routerLink ? { routerLink: link.routerLink } : {}),
      })),
    ];
    this.layout.breadCrumbLinks.next(translatedLinks);
    this.layout.breadCrumbAction.next(null);
  }
  // ─────────────────────────────
  // Translations & Labels
  // ─────────────────────────────
  private initializeTranslations(): void {
    const base = this.FEATURE_KEY;
    const name = this.FEATURE_NAME;

    this.labels = {
      view: `${base}.VIEW_${name}`,
      delete: `${base}.DELETE_${name}`,
      update: `${base}.UPDATE_${name}`,
      add: `${base}.ADD_NEW_${name}`,
      titleDelete: `${base}.DELETE_${name}_TITLE`,
      descDelete: `${base}.DELETE_${name}_DESC`,
      badge: `${base}.${name}`,
      table: `${base}.${name}S_LIST`,
    };
  }

  // ─────────────────────────────
  // Breadcrumb Setup
  // ─────────────────────────────


  // ─────────────────────────────
  // Action Buttons
  // ─────────────────────────────
  private setupActionItems(): void {
    this.actionItems = [
      {
        label: this.translate.instant(this.labels.view),
        icon: 'fi fi-rr-eye',
        command: () => this.handleViewClick(),
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGY' , 'VIEW')
      },
      {
        label: this.translate.instant(this.labels.delete),
        icon: 'fi fi-rr-trash',
        command: () => this.toggleDeleteModal(true),
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGY' , 'DELETE')
      },
      {
        label: this.translate.instant(this.labels.update),
        icon: 'fi fi-rr-pencil',
        command: () => this.handleUpdateClick(),
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGY' , 'EDIT')
      },
    ];
  }

  // ─────────────────────────────
  // Action Handlers
  // ─────────────────────────────
  handleViewClick(): void {
    console.log('Viewing', this.FEATURE_NAME);
    this.router.navigate([`/gfw-portal/risks-management/methodolgy/${this.selectedRow}`])
  }

  handleUpdateClick(): void {
    console.log('Updating', this.FEATURE_NAME);
    (this as any)[this.serviceName].getById(this.selectedRow).subscribe((res:any) => {
      this.initForm(res?.data)
      this.getLikelihoodsAndImpactByMethodologyID(res?.data?.riskMethodologyID)
      this.actionDialogVisible = true
    })
  }

  handleAddClick():void {
    console.log('Adding', this.FEATURE_NAME);
    this.actionDialogVisible = true
  }

  toggleDeleteModal(visible: boolean): void {
    console.log('delete modal');
    
      if(!visible) {this.selectedRow = null}
    this.deleteModalVisible = visible;
  }
  form!:FormGroup
  initForm(data?: any) {
  this.form = new FormGroup({
    name: new FormControl(data?.name ?? null, Validators.required),
    nameAr: new FormControl(data?.nameAr ?? null, Validators.required),
    description: new FormControl(data?.description ?? null, Validators.required),
    descriptionAr: new FormControl(data?.descriptionAr ?? null),
    factorImpactID: new FormControl(data?.factorImpactID ?? null),
    factorLikelihoodID: new FormControl(data?.factorLikelihoodID ?? null),
    riskAssessmentApproachID: new FormControl(data?.riskAssessmentApproachID ?? null, Validators.required),
  });
}
riskFactors:any[] = []
getLikelihoodsAndImpactByMethodologyID(id:number){
  this.methodService.getFactorsByMethodologyID(id).subscribe({
    next:(res:any)=> {
      console.log(res,'getFactorsByMethodologyID');
      this.riskFactors = res.data
    }
  })
}

  actionDialogVisible:boolean = false

  approaches_list:any[]=[];

  onDialogClose(){
    this.actionDialogVisible=false
    this.selectedRow = null
    this.form.reset();
  }
  isSaving:boolean = false
  save(){
    const canAdd = this._PermissionSystemService.can('RISKS' , 'METHODOLOGY' , 'ADD')
    const canEdit = this._PermissionSystemService.can('RISKS' , 'METHODOLOGY' , 'EDIT')
    if(this.selectedRow && !canEdit)return
    if(!this.selectedRow && !canAdd)return
    this.isSaving = true
    const msg = this.selectedRow ? 'updated' : 'added';
    (this as any)[this.serviceName].save(this.form.value, this.selectedRow).pipe(finalize(() => this.isSaving = false)).subscribe({
      next:() => {
        this.messageService.add({severity:'success', summary:`${this.featureDisplayName} ${msg} successfully`})
        this.onDialogClose()
        this.getListData()
      }
    })
  }

  delete(): void {
     if(!this._PermissionSystemService.can('RISKS' , 'METHODOLOGY' , 'DELETE')) return;

    if (!this.selectedRow) return;
    this.loadingDelete = true;

    (this as any)[this.serviceName].delete(this.selectedRow).pipe(
      finalize(() => (this.loadingDelete = false))
    ).subscribe({
      next: () => {
        this.getListData();
        this.toggleDeleteModal(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${this.featureDisplayName} deleted successfully!`,
        });
      },
      error: () => (this.loadingDelete = false),
    });
  }




  getListData(payload?: any): void {
    this.loading = true;
    this.tableData = [];

    (this as any)[this.serviceName]
      .findAll(
        payload
      )
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: any) => {
          const d = res?.data;
          this.tableData = d?.items;
         this.pagination = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };
          this.sharedService.paginationSubject.next(this.pagination);
        },
        error: () => (this.loading = false),
      });
  }

  setSelected(event: any): void {
    this.selectedRow = event;
  }
}
