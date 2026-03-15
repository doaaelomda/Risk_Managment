import dateHandler from '../../../../../../../shared/utils/dateHandler';
/* eslint-disable @nx/enforce-module-boundaries */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClosureService } from 'libs/features/incident/src/services/closure.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import {
  TextareaUiComponent,
  DatePackerComponent,
  UserDropdownComponent,
} from '@gfw/shared-ui';
import { Button } from 'primeng/button';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';

@Component({
  selector: 'lib-save-incident-closure',
  imports: [
    CommonModule,
    InputNumberModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    InputTextComponent,
    TextareaUiComponent,
    DatePackerComponent,
    Button,
    RouterLink,
    UiDropdownComponent,
    UserDropdownComponent,
    InputSwitchModule,
    InputNumberComponent,
  ],
  templateUrl: './save-incident-closure.component.html',
  styleUrl: './save-incident-closure.component.scss',
})
export class SaveIncidentClosureComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private msg: MessageService,
    private layout: LayoutService,
    private translate: TranslateService,
    private service: ClosureService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.initBase();
    this.getLookUps();
  }

  id!: string | null;
  isSaving = false;
  form!: FormGroup;

  FEATURE_KEY = 'INCIDENT';
  FEATURE_NAME = 'CLOSURE';
  featureDisplayName = 'Closure';
  ID_PARAM = 'id';
  LIST_ROUTE = '';
  incidentId!: number;
  initBase() {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get(this.ID_PARAM);
      const incidentId = params.get('incidentId');
      if (!incidentId) return;
      this.incidentId = +incidentId;
      this.LIST_ROUTE = `/gfw-portal/incident/viewincident/${this.incidentId}/closure`;
      if (this.id) {
        this.loadData(this.id);
      } else {
        this.generateForm();
        this.initBreadcrumb();
      }
    });
  }

  private initBreadcrumb(): void {
    const links = [
      { nameKey: `BREAD_CRUMB_TITLES.${this.FEATURE_KEY}` },
      {
        nameKey: `${this.FEATURE_KEY}.${this.FEATURE_KEY}_LIST`,
        routerLink: this.LIST_ROUTE,
      },
      {
        nameKey: this.id
          ? `${this.FEATURE_KEY}.UPDATE_${this.FEATURE_NAME}`
          : `${this.FEATURE_KEY}.ADD_NEW_${this.FEATURE_NAME}`,
      },
    ];
    this.layout.breadCrumbTitle.next(
      this.translate.instant(`BREAD_CRUMB_TITLES.${this.FEATURE_KEY}`)
    );
    this.layout.breadCrumbLinks.next([
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      ...links.map((l) => ({
        name: this.translate.instant(l.nameKey),
        ...(l.routerLink ? { routerLink: l.routerLink } : {}),
      })),
    ]);
    this.layout.breadCrumbAction.next(null);
  }

  private loadData(id: string) {
    this.service.getById(id).subscribe((res: any) => {
      this.generateForm(res?.data);
      this.initBreadcrumb();
    });
  }
  riskLevelOptions: any[] = [];
  userList: any[] = [];
  closureStatusOptions: any[] = [];
  solutionEffectivenessOptions: any[] = [];
  residualImpactOptions: any[] = [];

  getLookUps() {
    this.sharedService.getUserLookupData().subscribe(res => {
      this.userList = res.data
    })
    this.sharedService.lookUps([224, 225, 226, 227]).subscribe((res) => {
      const {
        IncidentClosureStatusType,
        IncidentSolutionEffectivenessEvaluation,
        IncidentReoccurrenceRiskLevelType,
        IncidentResidualImpactLevelType,
      } = res?.data;

      this.riskLevelOptions = IncidentReoccurrenceRiskLevelType;
      this.closureStatusOptions = IncidentClosureStatusType;
      this.solutionEffectivenessOptions =
        IncidentSolutionEffectivenessEvaluation;
      this.residualImpactOptions = IncidentResidualImpactLevelType;
    });
  }

  generateForm(data?: any) {
    this.form = new FormGroup({
      closedByUserID: new FormControl(data?.closedByUserID ?? null,Validators.required),

      closureMethod: new FormControl(
        data?.closureMethod ?? null,
        Validators.required
      ),

      incidentClosureStatusTypeID: new FormControl(
        data?.incidentClosureStatusTypeID ?? null,
        Validators.required
      ),

      resolutionSummary: new FormControl(
        data?.resolutionSummary ?? null,
        Validators.required
      ),

      incidentSolutionEffectivenessEvaluationID: new FormControl(
        data?.incidentSolutionEffectivenessEvaluationID ?? null
      ),

      incidentReoccurrenceRiskLevelTypeID: new FormControl(
        data?.incidentReoccurrenceRiskLevelTypeID ?? null
      ),

      monitoringPeriod: new FormControl(data?.monitoringPeriod ?? null),

      closureApprovalComment: new FormControl(
        data?.closureApprovalComment ?? null
      ),

      isRiskReassessed: new FormControl(data?.isRiskReassessed ?? false),

      timeToDetect: new FormControl(data?.timeToDetect ?? null),
      timeToResolve: new FormControl(data?.timeToResolve ?? null),
      timeToClose: new FormControl(data?.timeToClose ?? null),

      slaComplianceStatus: new FormControl(data?.slaComplianceStatus ?? false),

      costOfIncident: new FormControl(data?.costOfIncident ?? null),

      incidentResidualImpactLevelTypeID: new FormControl(
        data?.incidentResidualImpactLevelTypeID ?? null
      ),

      notes: new FormControl(data?.notes ?? null),

      isFinalClosure: new FormControl(data?.isFinalClosure ?? false),

      closureDate: new FormControl(
        data?.closureDate ? new Date(data?.closureDate) : null,
        Validators.required
      ),
      verificationDate: new FormControl(
        data?.verificationDate ? new Date(data?.verificationDate) : null
      ),
      closureApprovalDate: new FormControl(
        data?.closureApprovalDate ? new Date(data?.closureApprovalDate) : null
      ),
    });
  }

  save() {
    if (this.form.invalid) return;
    const closureDate = this.form.get('closureDate')?.value;
    const verificationDate = this.form.get('verificationDate')?.value;
    const closureApprovalDate = this.form.get('closureApprovalDate')?.value;
    this.isSaving = true;
    const payload = {
      ...this.form.value,
      incidentID: this.incidentId,
      closureDate: dateHandler(closureDate),
      verificationDate: dateHandler(verificationDate),
      closureApprovalDate: dateHandler(closureApprovalDate),
    };

    this.service.save(payload, this.id).subscribe({
      next: () => {
        this.isSaving = false;
        const msg = this.id ? 'updated' : 'created';
        this.msg.add({
          severity: 'success',
          detail: `${this.featureDisplayName} ${msg} successfully`,
        });
        this.router.navigate([this.LIST_ROUTE]);
      },
      error: () => (this.isSaving = false),
    });
  }
}
