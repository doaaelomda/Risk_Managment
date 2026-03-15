import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import {
  UserDropdownComponent,
  RoleDropdownComponent,
  TextareaUiComponent,
} from '@gfw/shared-ui';
import { TreeSelectUiComponent } from '../../../../../shared/shared-ui/src/lib/tree-select/tree-select-ui.component';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { IndicatorService } from '../services/indicator.service';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { MessageService } from 'primeng/api';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

// ─── Types ────────────────────────────────────────────────────────────────────

type IndicatorRouting = 'KRI' | 'KPI' | 'KCI' | 'KTI';

interface RoutingConfig {
  routing: IndicatorRouting;
  module: string;
  indicatorTypeID: number;
  indicatorName: string;
  indicatorRoute: string;
  moduleName: string;
  featureName: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ROUTING_CONFIG_MAP: Record<IndicatorRouting, RoutingConfig> = {
  KPI: {
    routing: 'KPI',
    module: 'indicators',
    indicatorTypeID: 1,
    indicatorName: 'INDICATORS.KPI',
    indicatorRoute: '/gfw-portal/indicators/KPI',
    moduleName: 'INDICATORS',
    featureName: 'INDICATORS',
  },
  KRI: {
    routing: 'KRI',
    module: 'risks',
    indicatorTypeID: 2,
    indicatorName: 'INDICATORS.KRI',
    indicatorRoute: '/gfw-portal/risks-management/KRI',
    moduleName: 'RISKS',
    featureName: 'RISKS_INDICATORS',
  },
  KCI: {
    routing: 'KCI',
    module: 'compliance',
    indicatorTypeID: 3,
    indicatorName: 'INDICATORS.KCI',
    indicatorRoute: '/gfw-portal/compliance/KCI',
    moduleName: 'COMPLIANCE',
    featureName: 'KEYCOMPLIANCEINDICATORS',
  },
  KTI: {
    routing: 'KTI',
    module: 'third-party',
    indicatorTypeID: 4,
    indicatorName: 'INDICATORS.KTI',
    indicatorRoute: '/gfw-portal/third-party/KTI',
    moduleName: 'THIRDPARTIES',
    featureName: 'THIRDPARTYINDICATORS',
  },
};

const INDICATOR_TYPE_ID_TO_ROUTING: Record<number, IndicatorRouting> = {
  1: 'KPI',
  2: 'KRI',
  3: 'KCI',
  4: 'KTI',
};

// ─── Component ────────────────────────────────────────────────────────────────

@Component({
  selector: 'lib-indicator-action',
  imports: [
    CommonModule,
    TreeSelectUiComponent,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextComponent,
    UiDropdownComponent,
    InputNumberComponent,
    UserDropdownComponent,
    RoleDropdownComponent,
    ButtonModule,
    TextareaUiComponent,
  ],
  templateUrl: './indicator-action.component.html',
  styleUrl: './indicator-action.component.scss',
})
export class IndicatorActionComponent implements OnInit {
  // ── Form ──────────────────────────────────────────────────────────────────
  indicator_form!: FormGroup;
  isLoading = false;

  // ── State ─────────────────────────────────────────────────────────────────
  current_update_id: string | null = null;
  private currentRoutingConfig: RoutingConfig | null = null;

  // ── Lookup data ───────────────────────────────────────────────────────────
  indicatorTypes: any[] = [];
  indicatorUnitTypes: any[] = [];
  aggregationPeriods: any[] = [];
  calculationDirections: any[] = [];
  evaluationMethods: any[] = [];
  userList: any[] = [];
  roleList: any[] = [];
  organizationalUnits: any[] = [];

  // ─────────────────────────────────────────────────────────────────────────

  constructor(
    private _messageS: MessageService,
    private _router: Router,
    private _indicatorService: IndicatorService,
    private _sharedS: SharedService,
    private _layoutService: LayoutService,
    private _translateService: TranslateService,
    private _activatedRoute: ActivatedRoute,
    private _permissionService: PermissionSystemService
  ) {}

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.initIndicatorForm();
    this.getLookUps();
    this.handleQueryParams();
    this.handleRouteParams();
  }

  // ── Routing helpers ───────────────────────────────────────────────────────

  /** Returns config from routing key (KPI / KRI / KCI / KTI) */
  private getConfigByRouting(routing: string): RoutingConfig | null {
    return ROUTING_CONFIG_MAP[routing as IndicatorRouting] ?? null;
  }

  /** Returns config from numeric indicatorTypeID (1-4) */
  private getConfigByTypeId(typeId: number): RoutingConfig | null {
    const key = INDICATOR_TYPE_ID_TO_ROUTING[typeId];
    return key ? ROUTING_CONFIG_MAP[key] : null;
  }

  /** Extracts routing key from the last URL segment */
  private getRoutingFromUrl(): string {
    const parts = this._router.url.split('/');
    return decodeURIComponent(parts[parts.length - 1]).split('?')[0];
  }

  /** Sets breadcrumbs using config + optional indicator name */
  private setBreadcrumb(config: RoutingConfig, indicatorLabel?: string): void {
    this._layoutService.breadCrumbLinks.next([
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      {
        name: this._translateService.instant('INDICATORS.INDICATOR'),
        icon: '',
        routerLink: config.indicatorRoute,
      },
      {
        name:
          indicatorLabel ??
          this._translateService.instant(config.indicatorName),
        icon: '',
      },
    ]);
  }

  /** Navigates after save/close */
  private navigateAfterAction(config: RoutingConfig): void {
    if (this.current_update_id) {
      this._router.navigate(
        [
          `/gfw-portal/indicators/setup/${config.module}/${this.current_update_id}/`,
        ],
        { queryParams: { routing: config.routing } }
      );
    } else {
      this._router.navigate([`/gfw-portal/risks-management/${config.routing}`]);
    }
  }

  // ── Initialisation ────────────────────────────────────────────────────────

  /** Reads queryParams (routing + indicatorTypeID) and sets config + breadcrumb */
  private handleQueryParams(): void {
    this._activatedRoute.queryParams.subscribe((params) => {
      const routing = params['routing'] as IndicatorRouting;
      const typeId = params['indicatorTypeID']
        ? +params['indicatorTypeID']
        : null;

      // Resolve config: prefer explicit routing key, fall back to typeId
      const config =
        (routing ? this.getConfigByRouting(routing) : null) ??
        (typeId ? this.getConfigByTypeId(typeId) : null);

      if (!config) return;

      this.currentRoutingConfig = config;

      // Patch hidden indicatorTypeID into form if not editing
      if (!this.current_update_id) {
        this.indicator_form
          .get('indicatorTypeID')
          ?.setValue(config.indicatorTypeID);
      }

      // Set breadcrumb immediately (will be overridden by handleRouteParams when editing)
      this.setBreadcrumb(config);
    });
  }

  /** Loads existing indicator when an :id param is present */
  private handleRouteParams(): void {
    this._activatedRoute.paramMap
      .pipe(
        filter((params) => !!params.get('id')),
        switchMap((params) => {
          this.current_update_id = params.get('id');

          // Config may come from URL segment (edit mode) or from queryParams already set
          const urlConfig = this.getConfigByRouting(this.getRoutingFromUrl());
          if (urlConfig) this.currentRoutingConfig = urlConfig;

          return this._indicatorService.getIndicatorById(
            this.current_update_id!
          );
        })
      )
      .subscribe((res: any) => {
        this.initIndicatorForm(res?.data);

        if (this.currentRoutingConfig) {
          this.setBreadcrumb(this.currentRoutingConfig, res?.data?.name);
        }
      });
  }

  // ── Lookups ───────────────────────────────────────────────────────────────

  getLookUps(): void {
    this._sharedS.lookUps([103, 104, 105, 109, 110]).subscribe((res) => {
      this.indicatorTypes = res?.data?.IndicatorType;
      this.indicatorUnitTypes = res?.data?.IndicatorUnitType;
      this.aggregationPeriods = res?.data?.IndicatorAggregationPeriodType;
      this.calculationDirections = res?.data?.IndicatorCalculationDirectionType;
      this.evaluationMethods = res?.data?.IndicatorEvaluationMethodType;
    });

    this._sharedS
      .getUserLookupData()
      .subscribe((res) => (this.userList = res?.data));
    this._sharedS
      .getRoleLookupData()
      .subscribe((res) => (this.roleList = res?.data));
  }

  // ── Tree helpers ──────────────────────────────────────────────────────────

  transformNodes(nodes: any[], parentKey = ''): any[] {
    return (nodes || []).filter(Boolean).map((node, index) => {
      const key = parentKey ? `${parentKey}-${index}` : `${index}`;
      return {
        key,
        id: node.id,
        label: node.label ?? 'N/A',
        children: node.children ? this.transformNodes(node.children, key) : [],
      };
    });
  }

  findNodeById(nodes: any[], id: number): any | null {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children?.length) {
        const found = this.findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  initIndicatorForm(data?: any): void {
    this.indicator_form = new FormGroup({
      code: new FormControl(data?.code, Validators.required),
      name: new FormControl(data?.name, Validators.required),
      description: new FormControl(data?.description ?? ''),
      indicatorTypeID: new FormControl(
        this.currentRoutingConfig?.indicatorTypeID ?? null
      ),
      indicatorUnitTypeID: new FormControl(
        data?.indicatorUnitTypeID,
        Validators.required
      ),
      indicatorAggregationPeriodTypeID: new FormControl(
        data?.indicatorAggregationPeriodTypeID,
        Validators.required
      ),
      indicatorCalculationDirectionTypeID: new FormControl(
        data?.indicatorCalculationDirectionTypeID,
        Validators.required
      ),
      indicatorEvaluationMethodTypeID: new FormControl(
        data?.indicatorEvaluationMethodTypeID,
        Validators.required
      ),
      targetValue: new FormControl(data?.targetValue, Validators.required),
      ownerUserID: new FormControl(data?.ownerUserID, Validators.required),
      ownerRoleID: new FormControl(data?.ownerRoleID, Validators.required),
      organizationalUnitID: new FormControl(null, Validators.required),
    });

    this.loadOrganizationalUnits(data?.organizationalUnitID);
  }

  private loadOrganizationalUnits(selectedId?: number): void {
    this._sharedS.orgainationalUnitLookUp().subscribe({
      next: (res: any) => {
        this.organizationalUnits = Array.isArray(res?.data) ? res.data : [];

        if (selectedId) {
          const selectedNode = this.findNodeById(
            this.organizationalUnits,
            selectedId
          );
          this.indicator_form
            .get('organizationalUnitID')
            ?.setValue(selectedNode);
        }
      },
    });
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  submit(): void {
    const config = this.currentRoutingConfig;
    if (!config) return;

    const canAdd = this._permissionService.can(
      config.moduleName,
      config.featureName,
      'ADD'
    );
    const canEdit = this._permissionService.can(
      config.moduleName,
      config.featureName,
      'EDIT'
    );

    if (this.current_update_id && !canEdit) return;
    if (!this.current_update_id && !canAdd) return;

    if (this.indicator_form.invalid) {
      this.indicator_form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this._indicatorService
      .saveIndicator(this.indicator_form.value, this.current_update_id)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this._messageS.add({
            severity: 'success',
            summary: 'Success',
            detail: `Indicator ${
              this.current_update_id ? 'updated' : 'added'
            } successfully`,
          });
          this.navigateAfterAction(config);
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  closeAddPage(): void {
    const config = this.currentRoutingConfig;
    if (config) this.navigateAfterAction(config);
  }
}
