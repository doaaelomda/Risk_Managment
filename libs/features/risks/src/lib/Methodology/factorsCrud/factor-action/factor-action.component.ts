import { InputNumberComponent } from './../../../../../../../shared/shared-ui/src/lib/input-number/input-number.component';
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
import { finalize, Observable, Subscription } from 'rxjs';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { TextareaUiComponent } from '@gfw/shared-ui';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { FactorsService } from 'libs/features/risks/src/services/factor-level.service';
import { MothodologyService } from 'libs/features/risks/src/services/methodology.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { DropdownCheckboxComponent } from '@gfw/shared-ui';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-factor-action',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TranslateModule,
    RouterLink,
    InputTextComponent,
    TextareaUiComponent,
    UiDropdownComponent,
    DropdownCheckboxComponent,
    InputNumberComponent
  ],
  templateUrl: './factor-action.component.html',
  styleUrl: './factor-action.component.scss',
})
export class FactorActionComponent implements OnInit, OnDestroy {
  methodolgyId: any;
  factorId: any;
  editFactor = false;
  isLoading = false;

  form!: FormGroup;
  data: any;

  riskFactorUnits: any[] = [];
  calculationTypes: any[] = [];
  dataTypes: any[] = [];

  paginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };

  validationsRequired = [{ key: 'required', message: 'VALIDATIONS.REQUIRED' }];

  private subscription = new Subscription();
  dataFactor: any;
  constructor(
    private factorService: FactorsService,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    private layout: LayoutService,
    private translate: TranslateService,
    private methodologyService: MothodologyService,
    private _PermissionSystemService:PermissionSystemService
  ) {
    this.methodolgyId = this.activatedRoute.snapshot.paramMap.get('id');
    this.factorId = this.activatedRoute.snapshot.paramMap.get('factorId');
  }

  ngOnInit(): void {
    this.getFactorsByMethodologyID()
    this.initForm();
    this.lookups();
    this.getDataById(this.methodolgyId);
    if (this.factorId) {
      this.getFactorById();
    }
  }

  handleAppendToEquation(factor:any){
    this.form.get('equation')?.setValue(`${this.form.get('equation')?.value} ${factor?.factorCode} `);
    this.form.get('equation')?.updateValueAndValidity()
  }

  getFactorsByMethodologyID(){
    this.methodologyService.getFactorsByMethodologyID(this.methodolgyId).subscribe((res:any)=>{
      this.methodologyFactors = res?.data;
      this.factorValidators = this.buildFactorRegex(this.methodologyFactors)

    })
  }

  get selectedFactors():any[]{
    const ids:any[] = this.form.get('dependencyFactorIds')?.value || [];
    return this.methodologyFactors.filter((factor:any)=> ids.includes(factor?.riskFactorID) )
  }

  methodologyFactors:any[]=[]

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.calc_typeSub$ instanceof Subscription) {
      this.calc_typeSub$.unsubscribe();
    }
  }

  // ================= Form =================

  buildFactorRegex(data: { factorCode: string }[]): RegExp {
  const escapeRegex = (str: string) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Factor codes
  const codes = data.map(item => escapeRegex(item.factorCode)).join('|');

  // Number pattern
  const numberPattern = '\\d+(?:\\.\\d+)?';

  // Operand = factor code or number
  const operand = `(?:${codes}|${numberPattern})`;

  // Parenthesized expression: allow spaces inside parentheses
  const parenExpr = `\\(\\s*${operand}(?:\\s*[+\\-*/%]\\s*${operand})*\\s*\\)`;

  // Term can be operand or parenthesized expression
  const term = `(?:${operand}|${parenExpr})`;

  // Full expression: term followed by zero or more (operator + term)
  const pattern = `^\\s*${term}(?:\\s*[+\\-*/%]\\s*${term})*\\s*$`;

  return new RegExp(pattern);
}


  calc_typeSub$!:Subscription|unknown;
 factorValidators: any ;;
  initForm(data?: any): void {
    this.form = new FormGroup({
      factorCode: new FormControl(data?.factorCode),
      name: new FormControl(data?.name, Validators.required),
      nameAr: new FormControl(data?.nameAr),
      description: new FormControl(data?.description),
      descriptionAr: new FormControl(data?.descriptionAr),
      riskFactorUnitID: new FormControl(data?.riskFactorUnitID),
      RiskFactorCalculationTypeID: new FormControl(
        data?.riskFactorCalculationTypeID,
        Validators.required
      ),
      equation: new FormControl(data?.equation || '' ),
      riskFactorDataTypeID: new FormControl(data?.riskFactorDataTypeID),
      rangeFrom: new FormControl(data?.rangeFrom),
      rangeTo: new FormControl(data?.rangeTo),
      riskMethodologyID: new FormControl(
        data?.riskMethodologyID ?? this.methodolgyId
      ),
    });

       if(this.form.get('RiskFactorCalculationTypeID')?.value == 2){
        this.form.setControl('dependencyFactorIds', new FormControl(null , Validators.required));
        this.form.get('equation')?.setValidators(Validators.pattern(this.factorValidators))
      }else{
        this.form.removeControl('dependencyFactorIds')
      }

    this.calc_typeSub$ = this.form.get('RiskFactorCalculationTypeID')?.valueChanges.subscribe((val:any)=>{
      console.log("val change form " , val);

      if(val == 2){
        this.form.setControl('dependencyFactorIds', new FormControl(null , Validators.required));
        this.form.get('equation')?.setValidators(Validators.pattern(this.factorValidators))
      }else{
        this.form.removeControl('dependencyFactorIds')
      }

      this.form.updateValueAndValidity()
    })
    this.form.updateValueAndValidity()
  }

  // ================= Lookups =================
  lookups(): void {
    this.subscription.add(
      this.sharedService.lookUps([230, 231, 232]).subscribe((res: any) => {
        this.riskFactorUnits = res?.data?.RiskFactorUnit || [
          { id: 1, label: 'unit' },
        ];
        this.dataTypes = res?.data?.RiskFactorDataType || [
          { id: 1, label: 'dataTypes' },
        ];
        this.calculationTypes = res?.data?.RiskFactorCalculationType
      })
    );
  }

  // ================= Get Factor =================
  getFactorById(): void {
    this.subscription.add(
      this.factorService.getById(this.factorId).subscribe((res: any) => {
        this.initForm(res?.data);
        this.dataFactor = res?.data;
      })
    );
  }

  // ================= Methodology =================
  getDataById(id: string): void {
    this.subscription.add(
      this.methodologyService.getById(id).subscribe((res: any) => {
        this.data = res?.data;
        this.initBreadcrumb();
      })
    );
  }

  // ================= Breadcrumb =================
  private initBreadcrumb(): void {
    const containerKey = 'BREAD_CRUMB_TITLES.METHODOLOGY';

    if (this.data) {
      this.setBreadcrumb(containerKey, [
        { nameKey: containerKey },
        {
          nameKey: 'METHODOLOGY.METHODOLOGYS_LIST',
          routerLink: '/gfw-portal/risks-management/methodolgy/list',
        },
        {
          nameKey: this.data ? this.data?.name : '-',
          routerLink: `/gfw-portal/risks-management/methodolgy/${this.methodolgyId}/factors`,
        },
        {
          nameKey: this.factorId ? 'FACTOR.EDIT_FACTOR' : 'FACTOR.ADD_FACTOR',
        },
      ]);
    }
  }

  private setBreadcrumb(
    titleKey: string,
    links: { nameKey: string; icon?: string; routerLink?: string }[]
  ): void {
    this.layout.breadCrumbTitle.next(this.translate.instant(titleKey));

    this.layout.breadCrumbLinks.next([
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      ...links.map((link) => ({
        name: this.translate.instant(link.nameKey),
        icon: link.icon ?? '',
        ...(link.routerLink && { routerLink: link.routerLink }),
      })),
    ]);

    this.layout.breadCrumbAction.next(null);
  }

  // ================= Submit =================
  submit(): void {
    const canAdd = this._PermissionSystemService.can('RISKS' , 'METHODOLOGYFACTORS' , 'ADD')
    const canEdit = this._PermissionSystemService.can('RISKS' , 'METHODOLOGYFACTORS' , 'EDIT')
    if(this.factorId && !canEdit)return
    if(!this.factorId && !canAdd)return

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const req = { ...this.form.value , rangeTo:`${this.form.get('rangeTo')?.value}` , rangeFrom:`${this.form.get('rangeFrom')?.value}`   };

    if (this.factorId) {
      req.riskFactorID = this.factorId;
    }

    const api$: Observable<any> = this.factorId
      ? this.factorService.save(req, this.factorId)
      : this.factorService.save(req);

    this.subscription.add(
      api$.pipe(finalize(() => (this.isLoading = false))).subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.factorId
            ? 'Factor Updated Successfully'
            : 'Factor Added Successfully',
        });

        this.router.navigate([
          `/gfw-portal/risks-management/methodolgy/${this.methodolgyId}/factors`,
        ]);
      })
    );
  }




}
