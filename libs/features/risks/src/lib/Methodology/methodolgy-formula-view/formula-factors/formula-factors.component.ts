import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsListComponent } from 'libs/shared/shared-ui/src/lib/cards-list/cards-list.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';
import { LinkedModuleSelectedComponent } from 'libs/shared/shared-ui/src/lib/linkedModule-selected/linkedModule-selected.component';
import { FormulaFactorsService } from 'libs/features/risks/src/services/formula-factors.service';
import { MessageService } from 'primeng/api';
import { DeleteConfirmPopupComponent } from "@gfw/shared-ui";
import { finalize } from 'rxjs';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-formula-factors',
  imports: [
    CommonModule,
    CardsListComponent,
    TranslateModule,
    DialogModule,
    ButtonModule,
    LinkedModuleSelectedComponent,
    DeleteConfirmPopupComponent
],
  templateUrl: './formula-factors.component.html',
  styleUrl: './formula-factors.component.scss',
})
export class FormulaFactorsComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private _ActivatedRoute: ActivatedRoute,
    private formulaFactorsService: FormulaFactorsService,
    private messageService:MessageService,
    public _PermissionSystemService:PermissionSystemService
  ) {}
  loading = true;
  loadingDelete = false;
  deleteModalVisible = false;
  selectedRow: any = null;
  actionItems: any[] = [];

  formulaID: any;
  methodologyID: any;

  ngOnInit(): void {

    this.methodologyID =
      this._ActivatedRoute.parent?.snapshot.paramMap.get('id');
    this.formulaID =
      this._ActivatedRoute.parent?.snapshot.paramMap.get('formula_id');
    console.log('methodologyID', this.methodologyID);
    console.log('formulaID', this.formulaID);

    this.initializeTranslations();
     this.setupActionItems()
    this.current_link_module = {
      dataViewId: 129,
      entityID_Name: 'riskFactorID',
      allEntityDataSourceAPI: '/api/RiskMethodology/RiskFactor/Search',
      riskMethodologyID: this.methodologyID,
      formulaId: this.formulaID,
      table_name: 'FACTOR.TABLE_TITLE',
      badge_name: 'FACTOR.BADGE_TITLE',
      updateMapAPI: 'api/RiskMethodology/FormulaFactors',
    };

    this.getList();
  }

  private readonly FEATURE_KEY = 'FORMULA_FACTORS';
  private readonly FEATURE_NAME = 'FACTOR';
  readonly entityIdField = '';
  readonly dataEntityId = 90;

  tableData: any[] = [];
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

  private setupActionItems(): void {
    this.actionItems = [

      {
        label: this.translate.instant(this.labels.delete),
        icon: 'fi fi-rr-trash',
        command: () => {
          this.toggleDeleteModal(true)
        },
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'RISKASSESSMENTFORMULAFACTORS' , 'DELETE')
      },

    ];
  }
  toggleDeleteModal(event:boolean){
    this.deleteModalVisible = event
  }

  setSelected(event: any): void {
    this.selectedRow = event?.riskFactorID;
  }
  columnControl: any = {
    type: 'popup',
    data: null,
  };

  // ==============
  current_link_module: any;
  dataList: any[] = [];
  showLinkTable: boolean = false;
  handleLinkTable(event: boolean) {
    this.showLinkTable = event;
    if (!event) {
      this.getList()
    }
  }
  deleteFactor(){
     if(!this._PermissionSystemService.can('RISKS' , 'RISKASSESSMENTFORMULAFACTORS' , 'DELETE')) return;

    this.loadingDelete = true
    this.formulaFactorsService.delete(this.selectedRow).pipe(finalize(() => this.loadingDelete = false)).subscribe({
      next:()=>{
        this.messageService.add({severity:'success',summary:'Success',detail:'Factor Deleted Successfully.'})
        this.getList()
        this.toggleDeleteModal(false)
      }
    })
  }
  getList() {
    this.loading = true;
    // this.formulaFactorsService
    //   .getList({
    //     search: null,
    //     filters: [],
    //     pageNumber: 1,
    //     pageSize: 10000,
    //     sortDirection: 1,
    //     sortField: null,
    //   }).pipe(finalize(()=> this.loading = false))
    //   .subscribe({
    //     next: (res) => {
    //       if (
    //         res &&
    //         typeof res === 'object' &&
    //         'data' in res &&
    //         res.data &&
    //         typeof res.data === 'object' &&
    //         'items' in res.data
    //       ) {
    //         const data = res.data.items;
    //         this.tableData = data as [];
    //         console.log(res, 'got list...');
    //       }
    //     },
    //   });


    this.formulaFactorsService.getFactorsByFormulaID(this.formulaID).pipe(finalize(()=> this.loading = false)).subscribe((res:any)=>{
      this.tableData = res?.data
    })
  }
}
