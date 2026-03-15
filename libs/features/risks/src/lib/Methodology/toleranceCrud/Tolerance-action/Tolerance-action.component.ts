import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  DatePackerComponent,
  UserDropdownComponent,
  DropdownCheckboxComponent,
  RoleDropdownComponent,
  CurrencyInputComponent,
  TextareaUiComponent,
} from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { finalize, forkJoin, Observable, switchMap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { Router } from '@angular/router';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { MethodologyToleranceService } from 'libs/features/risks/src/services/methodology-tolerance.service';
import { ColorDropdownComponent } from 'libs/shared/shared-ui/src/lib/color-dropdown/color-dropdown.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-tolerance-action',
   imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    InputTextComponent,
    ButtonModule,
    InputNumberComponent,
    TextareaUiComponent,
    ColorDropdownComponent
  ],
  templateUrl: './Tolerance-action.component.html',
  styleUrl: './Tolerance-action.component.scss',
})
export class ToleranceActionComponent implements OnInit {
  tolerance_form!: FormGroup;
  current_update_id: any;
  isLoading: boolean = false;
  validationsRequired: any[] = [
    { key: 'required', message: 'VALIDATIONS.REQUIRED' },
  ];
  breadCrumb: any;
  constructor(
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _MethodologyToleranceService: MethodologyToleranceService,
    private _MessageService: MessageService,
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _PermissionSystemService:PermissionSystemService
  ) {}

  ngOnInit(): void {
    this.handleRouteParams();
    this.inittoleranceForm();
    this.handleBreadCramb();
  }

  handleBreadCramb() {
    this.breadCrumb = [
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('METHODOLOGY.METHODOLOGYS_LIST'),
        icon: '',
        routerLink: '/gfw-portal/risks-management/methodolgy/list',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.METHODOLOGY'),
        icon: '',
        routerLink: '/gfw-portal/risks-management/methodolgy/list',
      },
      {
        name: this._TranslateService.instant('Tolerance.TABLE_TITLE'),
        icon: '',
        routerLink: `/gfw-portal/risks-management/methodolgy/${this.riskMethodologyID}/tolerance`,
      },
      {
        name: this._TranslateService.instant('Tolerance.ADD_NEW'),
        icon: '',
      },
    ];
    this._LayoutService.breadCrumbLinks.next(this.breadCrumb);
  }
  inittoleranceForm(data?: any) {
    this.tolerance_form = new FormGroup({
      name: new FormControl(data?.name, Validators.required),
      nameAr: new FormControl(data?.nameAr, Validators.required),
      description: new FormControl(data?.description),
      descriptionAr: new FormControl(data?.descriptionAr),
      fromRiskRating: new FormControl(
        data?.fromRiskRating,
        Validators.required
      ),
      toRiskRating: new FormControl(data?.toRiskRating, Validators.required),
      color: new FormControl(data?.color),
      importanceOrder: new FormControl(data?.importanceOrder),
    });
  }

  riskMethodologyID: any;
  private handleRouteParams(): void {
    this.riskMethodologyID = this._ActivatedRoute.snapshot.paramMap.get('id');

    this.current_update_id =
      this._ActivatedRoute.snapshot.paramMap.get('tolerance_id');
    if (this.current_update_id) {
      this._MethodologyToleranceService
        .gettoleranceById(this.current_update_id)
        .subscribe((res: any) => {
          if (res?.data) {
            this.inittoleranceForm(res.data);

            this.breadCrumb = [
              {
                name: '',
                icon: 'fi fi-rs-home',
                routerLink: '/',
              },
              {
                name: this._TranslateService.instant(
                  'METHODOLOGY.METHODOLOGYS_LIST'
                ),
                icon: '',
                routerLink: '/gfw-portal/risks-management/methodolgy/list',
              },
              {
                name: this._TranslateService.instant(
                  'BREAD_CRUMB_TITLES.METHODOLOGY'
                ),
                icon: '',
                routerLink: '/gfw-portal/risks-management/methodolgy/list',
              },
              {
                name: this._TranslateService.instant('Tolerance.TABLE_TITLE'),
                icon: '',
                routerLink: `/gfw-portal/risks-management/methodolgy/${this.riskMethodologyID}/tolerance`,
              },
              {
                name: res?.data?.name,
                icon: '',
              },
            ];
            this._LayoutService.breadCrumbLinks.next(this.breadCrumb);
          }
        });
    }
  }

  submit() {
    const canAdd = this._PermissionSystemService.can('RISKS' , 'METHODOLOGYTOLERANCE' , 'ADD')
    const canEdit = this._PermissionSystemService.can('RISKS' , 'METHODOLOGYTOLERANCE' , 'EDIT')
    if(this.current_update_id && !canEdit)return
    if(!this.current_update_id && !canAdd)return
    if (this.tolerance_form.invalid) {
      this.tolerance_form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const payload = {
      ...this.tolerance_form.value,
      riskMethodologyID: this.riskMethodologyID,
    };
    if (this.current_update_id) payload.risktoleranceID = this.current_update_id;

    const request$ = this.current_update_id
      ? this._MethodologyToleranceService.updatetolerance(payload)
      : this._MethodologyToleranceService.createtolerance(payload);

    request$.pipe(finalize(() => (this.isLoading = false))).subscribe(() => {
      this._MessageService.add({
        severity: 'success',
        summary: 'Success',
        detail: this.current_update_id
          ? this._TranslateService.instant('Tolerance.UPDATE_SUCCESS')
          : this._TranslateService.instant('Tolerance.ADD_SUCCESS'),
      });
      this._Router.navigate([
        `/gfw-portal/risks-management/methodolgy/${this.riskMethodologyID}/tolerance`,
      ]);
    });
  }
}
