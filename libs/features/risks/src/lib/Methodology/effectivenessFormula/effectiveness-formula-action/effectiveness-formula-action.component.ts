import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize, Subscription } from 'rxjs';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { TextareaUiComponent } from '@gfw/shared-ui';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { MothodologyService } from 'libs/features/risks/src/services/methodology.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { EffectivenessFormulaService } from 'libs/features/risks/src/services/effectiveness-formula.service';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-effectiveness-formula-action',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TranslateModule,
    RouterLink,
    InputTextComponent,
    TextareaUiComponent,
    UiDropdownComponent,
    InputNumberComponent,
  ],
  templateUrl: './effectiveness-formula-action.component.html',
  styleUrl: './effectiveness-formula-action.component.scss',
})
export class EffectivenessFormulaActionComponent implements OnInit, OnDestroy {
  methodologyId: any;
  effectivenessId: any;

  isLoading = false;
  form!: FormGroup;

  capBehaviorTypes: any[] = [];
  validationsRequired = [{ key: 'required', message: 'VALIDATIONS.REQUIRED' }];

  private subscription = new Subscription();
  methodologyData: any;
  isActiveArray: any[] = [];
  constructor(
    private formulaService: EffectivenessFormulaService,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    private layout: LayoutService,
    private translate: TranslateService,
    private methodologyService: MothodologyService,
    private _PermissionSystemService:PermissionSystemService
  ) {
    this.methodologyId = this.activatedRoute.snapshot.paramMap.get('id');
    this.effectivenessId = this.activatedRoute.snapshot.paramMap.get('effectivenessId');
  }

  ngOnInit(): void {
    this.initForm();
    this.loadLookups();
    this.getMethodologyById();

    if (this.effectivenessId) {
      this.getFormulaById();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // ================= Form =================
  initForm(data?: any): void {
    this.form = new FormGroup({
      name: new FormControl(data?.name, Validators.required),
      nameAr: new FormControl(data?.nameAr),

      individualControlEffectivenessFormula: new FormControl(
        data?.individualControlEffectivenessFormula,
        Validators.required
      ),
      combinedControlEffectivenessFormula: new FormControl(
        data?.combinedControlEffectivenessFormula,
        Validators.required
      ),
      finalControlEffectivenessFormula: new FormControl(
        data?.finalControlEffectivenessFormula,
        Validators.required
      ),

      minCap: new FormControl(data?.minCap),
      maxCap: new FormControl(data?.maxCap),

      controlEffectivenessFormulaCapBehaviorTypeID: new FormControl(
        data?.controlEffectivenessFormulaCapBehaviorTypeID
      ),

      capJustification: new FormControl(data?.capJustification),
      description: new FormControl(data?.description),
      descriptionAr: new FormControl(data?.descriptionAr),

      riskMethodologyID: new FormControl(
        data?.riskMethodologyID ?? this.methodologyId
      ),

      isActive: new FormControl(data?.isActive ?? null, Validators.required),
    });
  }

  // ================= Lookups =================
  loadLookups(): void {
    this.subscription.add(
      this.sharedService.lookUps([235]).subscribe((res: any) => {
        this.capBehaviorTypes =
          res?.data?.ControlEffectivenessFormulaCapBehaviorType || [];
      })
    );
    this.isActiveArray = [
      {
        id: 1,
        value: true,
        label: this.translate.instant('NOTIFICATION_SETTING.ACTIVE'),
      },
      {
        id: 2,
        value: false,
        label: this.translate.instant('NOTIFICATION_SETTING.INACTIVE'),
      },
    ];
  }

  // ================= Get By Id =================
  getFormulaById(): void {
    this.subscription.add(
      this.formulaService.getById(this.effectivenessId).subscribe((res: any) => {
        this.initForm(res?.data);
      })
    );
  }

  // ================= Methodology =================
  getMethodologyById(): void {
    this.subscription.add(
      this.methodologyService
        .getById(this.methodologyId)
        .subscribe((res: any) => {
          this.methodologyData = res?.data;
          this.initBreadcrumb();
        })
    );
  }

  // ================= Breadcrumb =================
  private initBreadcrumb(): void {
    const titleKey = 'EFFECTIVENESS_FORMULA.TITLE';

    this.layout.breadCrumbTitle.next(this.translate.instant(titleKey));

    this.layout.breadCrumbLinks.next([
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      {
        name: this.translate.instant('BREAD_CRUMB_TITLES.METHODOLOGY'),
        routerLink: '/gfw-portal/risks-management/methodolgy/list',
      },
      {
        name: this.translate.instant('METHODOLOGY.METHODOLOGYS_LIST'),
        routerLink: '/gfw-portal/risks-management/methodolgy/list',
      },
      {
        name: this.methodologyData?.name,
        routerLink: `/gfw-portal/risks-management/methodolgy/${this.methodologyId}/overview`,
      },

      {
        name: this.translate.instant('EFFECTIVENESS_FORMULA.TABLE_TITLE'),
        routerLink: `/gfw-portal/risks-management/methodolgy/${this.methodologyId}/effectivenessFormula`,
      },
      {
        name: this.translate.instant(
          this.effectivenessId
            ? 'EFFECTIVENESS_FORMULA.EDIT'
            : 'EFFECTIVENESS_FORMULA.ADD'
        ),
      },
    ]);
  }

  // ================= Submit =================
  submit(): void {
    const canAdd = this._PermissionSystemService.can('RISKS' , 'METHODOLOGYEFFECTIVEFORMULA' , 'ADD')
    const canEdit = this._PermissionSystemService.can('RISKS' , 'METHODOLOGYEFFECTIVEFORMULA' , 'EDIT')
    if(this.effectivenessId && !canEdit)return
    if(!this.effectivenessId && !canAdd)return
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const req = { ...this.form.value };

    if (this.effectivenessId) {
      req.riskMethodologyControlEffectivenessFormulaID = this.effectivenessId;
    }

    const api$ = this.effectivenessId
      ? this.formulaService.save(req, this.effectivenessId)
      : this.formulaService.save(req);

    this.subscription.add(
      api$.pipe(finalize(() => (this.isLoading = false))).subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.translate.instant(
            this.effectivenessId
              ? 'EFFECTIVENESS_FORMULA.UPDATED'
              : 'EFFECTIVENESS_FORMULA.CREATED'
          ),
        });

        this.router.navigate([
          `/gfw-portal/risks-management/methodolgy/${this.methodologyId}/effectivenessFormula`,
        ]);
      })
    );
  }
}
