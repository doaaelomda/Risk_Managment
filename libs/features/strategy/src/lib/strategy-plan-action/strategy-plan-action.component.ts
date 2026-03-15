import { ColorDropdownComponent } from './../../../../../shared/shared-ui/src/lib/color-dropdown/color-dropdown.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { finalize, forkJoin, switchMap } from 'rxjs';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePackerComponent } from '@gfw/shared-ui';
import { StrategyService } from 'libs/features/strategy/services/strategy.service';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { TextareaUiComponent } from '@gfw/shared-ui';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-strategy-plan-action',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    UiDropdownComponent,
    DatePackerComponent,
    InputTextComponent,
    InputNumberComponent,
    ButtonModule,
    TextareaUiComponent,
    ColorDropdownComponent
  ],
  templateUrl: './strategy-plan-action.component.html',
  styleUrl: './strategy-plan-action.component.scss',
})
export class StrategyPlanActionComponent implements OnInit {
  strategyPlanForm!: FormGroup;
  isLoading = false;
  current_update_id: number | null = null;

  // Lookups
  roleList: any[] = [];
  statusList: any[] = [];
  priorityList: any[] = [];

  constructor(
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _MessageService: MessageService,
    private _TranslateService: TranslateService,
    private _StrategyService: StrategyService,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _PermissionSystemService:PermissionSystemService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadLookups();
    this.handleRouteParams();
  }

  private handleRouteParams(): void {
    this._ActivatedRoute.paramMap.subscribe((res) => {
      const id = res?.get('id');
      this._LayoutService.breadCrumbLinks.next([
        { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
        {
          name: this._TranslateService.instant('STRATEGY.STRATEGY'),
          icon: '',
          routerLink: '/gfw-portal/strategy',
        },
        {
          name: this._TranslateService.instant('STRATEGY.STRATEGY_PLANS'),
          icon: '',
          routerLink: '/gfw-portal/strategy/plans',
        },
        {
          name: this._TranslateService.instant(
            id ? 'STRATEGY_PLAN.UPDATE' : 'STRATEGY_PLAN.ADD_NEW'
          ),
          icon: '',
          routerLink: '/gfw-portal/strategy/plans',
        },
      ]);
      if (!id) return;
      this.current_update_id = +id;
      this.getPlanById(this.current_update_id);
    });
  }

  private initForm(data?: any): void {
    this.strategyPlanForm = new FormGroup({
      name: new FormControl(data?.name || '', Validators.required),
      nameAr: new FormControl(data?.nameAr || '', Validators.required),
      description: new FormControl(data?.description || ''),
      descriptionAr: new FormControl(data?.descriptionAr || ''),
      ownerRoleID: new FormControl(
        data?.ownerRoleID || null,
        Validators.required
      ),
      startDate: new FormControl(
        data?.startDate ? moment(data.startDate).format('MM-DD-YYYY') : null,
        Validators.required
      ),
      endDate: new FormControl(
        data?.endDate ? moment(data.endDate).format('MM-DD-YYYY') : null,
        Validators.required
      ),
      color: new FormControl(data?.color ?? null, Validators.required),
      importanceOrder: new FormControl(data?.importanceOrder || 0, [
        Validators.required,
        Validators.min(0),
      ]),
      strategicPlanStatusTypeID: new FormControl(
        data?.strategicPlanStatusTypeID || null,
        Validators.required
      ),
      strategicPlanPriorityLevelTypeID: new FormControl(
        data?.strategicPlanPriorityLevelTypeID || null,
        Validators.required
      ),
    });
  }

  loadLookups() {
    forkJoin([
      this._SharedService.lookUps([168, 126]),
      this._SharedService.getRoleLookupData(),
    ]).subscribe({
      next: (res: any[]) => {
        if (res) {
          this.statusList = res[0]?.data?.StrategicPlanStatusType || [];
          this.priorityList = res[0]?.data?.StrategicPlanPriorityLevelType || [];

          this.roleList = res[1]?.data || [];
        }
      },
    });
  }

  getPlanById(id: any) {
    this._StrategyService.getPlanById(id).subscribe((res: any) => {
      console.log(res, 'got plan');
      this.initForm(res?.data);
    });
  }

  submit(): void {
    const canAdd = this._PermissionSystemService.can('STRATEGY' , 'PLAN' , 'ADD')
    const canEdit = this._PermissionSystemService.can('STRATEGY' , 'PLAN' , 'EDIT')
    if(this.current_update_id && !canEdit)return
    if(!this.current_update_id && !canAdd)return

    if (this.strategyPlanForm.invalid) return;

    this.isLoading = true;

    const payload = {
      ...this.strategyPlanForm.value,
      startDate: this.strategyPlanForm.value.startDate
        ? moment(this.strategyPlanForm.value.startDate, 'MM-DD-YYYY')
            .utc(true)
            .toISOString()
        : null,
      endDate: this.strategyPlanForm.value.endDate
        ? moment(this.strategyPlanForm.value.endDate, 'MM-DD-YYYY')
            .utc(true)
            .toISOString()
        : null,
    };
    const msg = this.current_update_id ? 'updated' : 'created';

    this._StrategyService
      .savePlan(payload, this.current_update_id)
      .subscribe((res) => {
        this.isLoading = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Plan ${msg} successfully`,
        });
        this._Router.navigate(['/gfw-portal/strategy/plans'])
        console.log(res, 'created');
      });
  }
}
