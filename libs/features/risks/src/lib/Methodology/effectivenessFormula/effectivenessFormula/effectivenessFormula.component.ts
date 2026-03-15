import { Component, OnDestroy, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { finalize, Subscription } from 'rxjs';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { EffectivenessFormulaService } from 'libs/features/risks/src/services/effectiveness-formula.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-effectiveness-formula',
  imports: [
    CommonModule,
    NewTableComponent,
    ButtonModule,
    TranslateModule,
    DeleteConfirmPopupComponent,
    ReactiveFormsModule,
    DialogModule,
  ],
  templateUrl: './effectivenessFormula.component.html',
  styleUrl: './effectivenessFormula.component.scss',
})
export class EffectivenessFormulaComponent implements OnInit, OnDestroy {
  // ===============================
  // Declarations
  // ===============================
  action_items: any[] = [];

  effectivenessFormulaList: any[] = [];

  isLoading: boolean = false;
  isDeleting: boolean = false;

  deletePopupVisible: boolean = false;

  currentPayload: any;
  currentFormulaId: any;

  methodologyId: any;

  form!: FormGroup;

  columnControl: any = {};

  paginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };

  private subscription: Subscription = new Subscription();

  // ===============================
  // Constructor
  // ===============================
  constructor(
    private translate: TranslateService,
    private EffectivenessFormulaService: EffectivenessFormulaService,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    public _PermissionSystemService:PermissionSystemService
  ) {
    this.methodologyId =
      this.activatedRoute.parent?.snapshot.paramMap.get('id');
    if(this.methodologyId){
    this.columnControl = {
      type: 'route',
      data: `gfw-portal/risks-management/methodolgy/${this.methodologyId}/effectivenessFormula`,
    };
  }
  }

  // ===============================
  // Lifecycle Hooks
  // ===============================
  ngOnInit(): void {
    this.initActionItems();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // ===============================
  // Actions
  // ===============================
  initActionItems(): void {
    this.action_items = [
      {
        label: this.translate.instant('EFFECTIVENESS_FORMULA.VIEW'),
        icon: 'fi fi-rr-eye',
        command: () => this.viewEffectivenessFormula(),
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGYEFFECTIVEFORMULA' , 'VIEW')

      },
      {
        label: this.translate.instant('EFFECTIVENESS_FORMULA.DELETE'),
        icon: 'fi fi-rr-trash',
        command: () => (this.deletePopupVisible = true),
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGYEFFECTIVEFORMULA' , 'DELETE')

      },
      {
        label: this.translate.instant('EFFECTIVENESS_FORMULA.UPDATE'),
        icon: 'fi fi-rr-pencil',
        command: () => this.updateEffectivenessFormula(),
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGYEFFECTIVEFORMULA' , 'EDIT')

      },
    ];
  }

  // ===============================
  // Navigation
  // ===============================
  addNewEffectivenessFormula(): void {
    this.router.navigate([
      `/gfw-portal/risks-management/methodolgy/${this.methodologyId}/addEffectivenessFormula`,
    ]);
  }

  viewEffectivenessFormula(): void {
    this.router.navigate([
      `/gfw-portal/risks-management/methodolgy/${this.methodologyId}/effectivenessFormula/${this.currentFormulaId}`,
    ]);
  }

  updateEffectivenessFormula(): void {
    this.router.navigate([
      `/gfw-portal/risks-management/methodolgy/${this.methodologyId}/updateEffectivenessFormula/${this.currentFormulaId}`,
    ]);
  }

  // ===============================
  // Delete
  // ===============================
  closeDeletePopup(): void {
    this.deletePopupVisible = false;
  }

  deleteEffectivenessFormula(): void {
     if(!this._PermissionSystemService.can('RISKS' , 'METHODOLOGYEFFECTIVEFORMULA' , 'DELETE')) return;

    this.isLoading = true;
    this.isDeleting = true;

    this.subscription = this.EffectivenessFormulaService.delete(
      this.currentFormulaId
    ).subscribe({
      next: () => {
        this.isDeleting = false;
        this.deletePopupVisible = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.translate.instant(
            'effectivenessFormula deleted is successfully'
          ),
        });

        this.getEffectivenessFormulaTable(this.currentPayload);
      },
      error: () => {
        this.isDeleting = false;
        this.isLoading = false;
      },
    });
  }

  // ===============================
  // Table Handling
  // ===============================
  setSelectedRow(rowId: any): void {
    this.currentFormulaId = rowId || 1;
  }

  handleDataTable(payload: any = null): void {
    this.currentPayload = payload;
    this.getEffectivenessFormulaTable(payload);
  }

  getEffectivenessFormulaTable(payload: any): void {
    this.isLoading = true;
    this.effectivenessFormulaList = [];

    this.subscription = this.EffectivenessFormulaService.findAll(
      payload,
      this.methodologyId
    )
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          this.effectivenessFormulaList =
            res?.data?.items || [];

          this.paginationObj = {
            perPage: res?.data?.pageSize,
            currentPage: res?.data?.pageNumber,
            totalItems: res?.data?.totalCount,
            totalPages: res?.data?.totalPages,
          };

          this.sharedService.paginationSubject.next(this.paginationObj);
        },
      });
  }
}
