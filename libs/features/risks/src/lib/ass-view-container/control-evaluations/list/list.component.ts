import { Component, effect, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { NewTableComponent } from 'libs/shared/shared-ui/src/lib/new-table/new-table.component';
import { DeleteConfirmPopupComponent } from '@gfw/shared-ui';
import { Button } from 'primeng/button';
import { finalize } from 'rxjs';
import { ControlEvaluationService } from 'libs/features/risks/src/services/control-evaluation.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { EvaluationActionComponent } from "../evaluation-action/evaluation-action.component";
import { UiDropdownComponent } from "libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component";
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RiskService } from 'libs/features/risks/src/services/risk.service';
@Component({
  selector: 'lib-list',
  imports: [
    CommonModule,
    NewTableComponent,
    DeleteConfirmPopupComponent,
    Button,
    TranslateModule,
    EvaluationActionComponent,
    UiDropdownComponent,
    ReactiveFormsModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {


  isRisk = input<boolean>(false)

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
  private readonly FEATURE_KEY = 'EVALUATION';
  private readonly FEATURE_NAME = 'EVALUATION';
  private readonly featureDisplayName = 'Evaluation';
  ENTITY_ROUTE = '';

  updateRoute = '';
  viewRoute = '';
  readonly serviceName = 'evaluationService';
  readonly entityIdField = 'riskAssessmentControlEvaluationID';
  readonly dataEntityId = 131;
  readonly filtersId = 131;
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
  EffectivenessLevel: any[] = [];
  getLookup() {
    this.sharedService.lookUps([240]).subscribe((res: any) => {
      this.EffectivenessLevel = res?.data?.RiskMethodologyRiskAssessemntControlEffectivenessLevel
    })
  }
  current_assessment_id: any = null;
  current_risk_id: any = null;
  constructor(
    private router: Router,
    private messageService: MessageService,
    private sharedService: SharedService,
    private translate: TranslateService,
    private layout: LayoutService,
    private route: ActivatedRoute,
    private evaluationService: ControlEvaluationService,
    private _RiskService: RiskService,
    public _PermissionSystemService: PermissionSystemService
  ) {

    effect(() => {
      if (this.isRisk()) {
        this.initeffectivinessForm();
        this.getLookup();

        this._RiskService.getOneRisk(this.current_risk_id).subscribe((res: any) => {
          this.initeffectivinessForm(res?.data)
        })

      }
    })
    this.initBreadcrumb();
    console.log(
      this.route.parent?.snapshot.paramMap,
      'this.route.snapshot.paramMap'
    );
    const assessmentId = this.route.parent?.snapshot.paramMap.get('assID');
    this.current_assessment_id = assessmentId;
    this.current_risk_id = this.route.parent?.snapshot.paramMap.get('riskID');
    this.columnControl = {
      type: 'route',
      data: `/gfw-portal/risks-management/risk/${this.current_risk_id}/assessment/${assessmentId}/control-evaluations`,
    };
    (this.ENTITY_ROUTE = `/gfw-portal/risks-management/risk/${this.current_risk_id}/assessment/${assessmentId}/control-evaluations`),
      (this.updateRoute = `/gfw-portal/risks-management/risk/${this.current_risk_id}/assessment/${assessmentId}/control-evaluations/action`);
    (this.viewRoute = `/gfw-portal/risks-management/risk/${this.current_risk_id}/assessment/${assessmentId}/control-evaluations`);
  }

  columnControl: any;
  payload: any;
  handleDataTable(event: any) {
    this.payload = event;
    this.getListData(event);
  }
  // ─────────────────────────────
  // Lifecycle
  // ─────────────────────────────
  ngOnInit(): void {
    this.initializeTranslations();
    this.setupActionItems();
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
  private initBreadcrumb(): void {
    return
    const containerKey = 'BREAD_CRUMB_TITLES.QUESTIONNAIRE';
    this.setBreadcrumb(containerKey, [
      { nameKey: containerKey, routerLink: this.ENTITY_ROUTE },
      { nameKey: `${this.FEATURE_KEY}.${this.FEATURE_NAME}S_LIST` },
    ]);
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
  // Action Buttons
  // ─────────────────────────────
  private setupActionItems(): void {
    this.actionItems = [
      {
        label: this.translate.instant(this.labels.view),
        icon: 'fi fi-rr-eye',
        command: () => this.handleViewClick(),
        visible: () => this._PermissionSystemService.can('RISKS', 'RISKASSESSMENTCONTROLEVALUATION', 'VIEW')
      },
      {
        label: this.translate.instant(this.labels.delete),
        icon: 'fi fi-rr-trash',
        command: () => this.toggleDeleteModal(true),
        visible: () => this._PermissionSystemService.can('RISKS', 'RISKASSESSMENTCONTROLEVALUATION', 'DELETE')
      },
      {
        label: this.translate.instant(this.labels.update),
        icon: 'fi fi-rr-pencil',
        command: () => {

          if (this.isRisk()) {
            console.log("selectedRow" , this.selectedRow);

            this.custom_updated = this.selectedRow;
            this.dataRiskEmiter.emit({ show_save: false, controlEffectivenessLevelID: this.effectivinessForm.get('controlEffectivenessLevelID')?.value })

            this.isListMode = false;
            return;
          }
          this.handleUpdateClick()
        },
        visible: () => this._PermissionSystemService.can('RISKS', 'RISKASSESSMENTCONTROLEVALUATION', 'EDIT')
      },
    ];
  }

  custom_updated:any= null;

  // ─────────────────────────────
  // Action Handlers
  // ─────────────────────────────
  handleViewClick(): void {
    this.router.navigateByUrl(`${this.viewRoute}/${this.selectedRow}`);

    console.log('Viewing', this.FEATURE_NAME);
  }

  handleUpdateClick(): void {

    this.router.navigateByUrl(`${this.updateRoute}/${this.selectedRow}`);
    console.log('Updating', this.FEATURE_NAME);
  }

  isListMode: boolean = true;

  dataRiskEmiter = output<{ show_save: boolean, controlEffectivenessLevelID: any, isUpdate?: boolean, updated_id?: any }>()

  handleAddClick(): void {
    if (this.isRisk()) {
      this.isListMode = false;
      this.dataRiskEmiter.emit({ show_save: false, controlEffectivenessLevelID: this.effectivinessForm.get('controlEffectivenessLevelID')?.value })
      return;
    }
    this.router.navigateByUrl(`${this.updateRoute}`);
  }

  toggleDeleteModal(visible: boolean): void {
    if (!visible) {
      this.selectedRow = null;
    }
    this.deleteModalVisible = visible;
  }

  delete(): void {
    if (!this._PermissionSystemService.can('RISKS', 'RISKASSESSMENTCONTROLEVALUATION', 'DELETE')) return;
    if (!this.selectedRow) return;
    this.loadingDelete = true;

    (this as any)[this.serviceName]
      .delete(this.selectedRow)
      .pipe(finalize(() => (this.loadingDelete = false)))
      .subscribe({
        next: () => {
          this.getListData({});
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

  getListData(event?: any): void {
    this.loading = true;
    this.tableData = [];
    event['riskAssessmentID'] = this.current_assessment_id ? Number(this.current_assessment_id) : null;
    event['riskID'] = Number(this.current_risk_id) ?? null;
    (this as any)[this.serviceName]
      .getList(event)
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
    console.log("event ", event);

    this.selectedRow = event;
  }



  effectivinessForm!: FormGroup;
  initeffectivinessForm(data?: any) {
    this.effectivinessForm = new FormGroup({
      controlEffectivenessLevelID: new FormControl(data?.riskMethodologyRiskAssessemntControlEffectivenessLevelID ?? null)
    })


    this.effectivinessForm.get('controlEffectivenessLevelID')?.valueChanges.subscribe((val: any) => {
      this.dataRiskEmiter.emit({ show_save: true, controlEffectivenessLevelID: this.effectivinessForm.get('controlEffectivenessLevelID')?.value })

    })
  }


  handleEvaluationActionEmiterData(event: any) {
    this.isListMode = event?.show_list;
    this.custom_updated = null
    this.dataRiskEmiter.emit({ show_save: true, controlEffectivenessLevelID: this.effectivinessForm.get('controlEffectivenessLevelID')?.value })

  }
}
