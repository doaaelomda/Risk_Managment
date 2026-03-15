import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InvestigationService } from '../../../services/investigation.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  TextareaUiComponent,
  DatePackerComponent,
  UserDropdownComponent,
} from '@gfw/shared-ui';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { Button } from 'primeng/button';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import * as moment from 'moment';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-save-investigation',
  imports: [
    CommonModule,
    TextareaUiComponent,
    RouterLink,
    InputTextComponent,
    Button,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    UiDropdownComponent,
    DatePackerComponent,
    UserDropdownComponent,
    InputSwitchModule,
    InputNumberComponent,
  ],
  templateUrl: './save-investigation.component.html',
  styleUrl: './save-investigation.component.scss',
})
export class SaveInvestigationComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private msg: MessageService,
    private layout: LayoutService,
    private translate: TranslateService,
    private service: InvestigationService,
    private sharedService: SharedService,
    private _permissionService: PermissionSystemService
  ) {
    this.getLookUps();
    this.initBase();
  }

  id!: string | null;
  isSaving = false;
  main_form!: FormGroup;

  FEATURE_KEY = 'INVESTIGATIONS';
  FEATURE_NAME = 'INVESTIGATION';
  featureDisplayName = 'Investigation';
  ID_PARAM = 'investigationId';
  LIST_ROUTE = '';
  incidentId!: number;
  initBase() {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get(this.ID_PARAM);
      const incidentId = params.get('incidentId');
      if (incidentId) {
        this.LIST_ROUTE = `/gfw-portal/incident/viewincident/${incidentId}/investigations`;
        this.incidentId = +incidentId;
      }

      if (this.id) {
        this.loadData(this.id);
      } else {
        this.generateForm();
        this.generateTechnicalForm();
        this.initBreadcrumb();
      }

      this.initSteps();
    });
  }
  steps: any[] = [];
  initSteps() {
    this.steps = [
      {
        name: this.translate.instant('INVESTIGATIONS.MAIN_INFO'),
        id: 1,
        description: '-',
        icon: 'fi fi-rr-chart-line-up',
        disabled: false,
        command: () => {
          this.currentStep = 1;
        },
      },
      {
        name: this.translate.instant('INVESTIGATIONS.TECHNICAL_INFO'),
        id: 2,
        description: '-',
        icon: 'fi fi-rr-tools',
        disabled: !this.id,
        command: () => {
          this.currentStep = 2;
        },
      },
    ];
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
      this.generateTechnicalForm(res?.data);
      this.initBreadcrumb();
    });
  }

  actorTypes: any[] = [];
  statusTypes: any[] = [];
  types: any[] = [];
  users: any[] = [];
  getLookUps() {
    //   IncidentInvestigationStatusType =221,
    // IncidentInvestigationType = 222,
    // IncidentThreatActorType= 223

    this.sharedService.lookUps([221, 222, 223]).subscribe((res) => {
      this.actorTypes = res?.data?.IncidentThreatActorType;
      this.statusTypes = res?.data?.IncidentInvestigationStatusType;
      this.types = res?.data?.IncidentInvestigationType;
    });

    this.sharedService.getUserLookupData().subscribe((res) => {
      this.users = res?.data;
    });
  }

  currentStep: number = 1;

  generateForm(data?: any) {
    this.main_form = new FormGroup({
      name: new FormControl(data?.name ?? null, Validators.required),
      description: new FormControl(data?.description ?? null),
      incidentInvestigationTypeID: new FormControl(
        data?.incidentInvestigationTypeID ?? null,
        Validators.required
      ),
      incidentInvestigationStatusTypeID: new FormControl(
        data?.incidentInvestigationStatusTypeID ?? null,
        Validators.required
      ),
      incidentThreatActorTypeID: new FormControl(
        data?.incidentThreatActorTypeID ?? null,
        Validators.required
      ),
      leadInvestigatorUserID: new FormControl(
        data?.leadInvestigatorUserID ?? null,
        Validators.required
      ),

      startedAt: new FormControl(
        data?.startedAt
          ? moment(new Date(data?.startedAt)).format('MM-DD-YYYY')
          : null,
        Validators.required
      ),
      investigationScope: new FormControl(data?.investigationScope ?? null),
    });
  }
  technical_form!: FormGroup;
  generateTechnicalForm(data?: any) {
    this.technical_form = new FormGroup({
      investigationScope: new FormControl(data?.investigationScope ?? null),
      attackVector: new FormControl(data?.attackVector ?? null),
      detectionSource: new FormControl(data?.detectionSource ?? null),
      ioCs: new FormControl(data?.ioCs ?? null),
      affectedAssets: new FormControl(data?.affectedAssets ?? null),
      containmentActions: new FormControl(data?.containmentActions ?? null),
      eradicationActions: new FormControl(data?.eradicationActions ?? null),
      recoveryActions: new FormControl(data?.recoveryActions ?? null),
      impactAssessment: new FormControl(data?.impactAssessment ?? null),

      dataExposureFlag: new FormControl(data?.dataExposureFlag ?? false),
      reportedToAuthorityFlag: new FormControl(
        data?.reportedToAuthorityFlag ?? false
      ),

      reportReferenceNumber: new FormControl(
        data?.reportReferenceNumber ?? null
      ),
    });
  }

  moveForward() {
    this.steps[1].disabled = false;
    this.currentStep = 2;
  }
  createdInvestigationId!: number;
  saveTechnical() {
    const investigationId = this.id || this.createdInvestigationId;
    if (!investigationId || !this.incidentId) return;
    this.isSaving = true;

    const payload = {
      ...this.technical_form.value,
      incidentID: this.incidentId,
      incidentInvestigationID: investigationId,
      reportReferenceNumber: `${
        this.technical_form.get('reportReferenceNumber')?.value
      }`,
    };
    console.log(payload, 'payload');

    this.service.saveTechnicalInfo(payload).subscribe({
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

  save() {
              // ===== Permissions =====
  const hasPermission = this.id
    ? this._permissionService.can('INCIDENT', 'INVESTIGATIONS', 'EDIT')
    : this._permissionService.can('INCIDENT', 'INVESTIGATIONS', 'ADD');

  if (!hasPermission) {
    return;
  }
    if (this.main_form.invalid) return;
    const formattedDate = moment(
      this.main_form.get('startedAt')?.value,
      'MM-DD-YYYY'
    )
      .utc(true)
      .toISOString();

    this.isSaving = true;
    const payload = {
      ...this.main_form.value,
      incidentID: this.incidentId,
      startedAt: formattedDate,
    };

    this.service.save(payload, this.id).subscribe({
      next: (res) => {
        console.log(res, 'got created');

        this.isSaving = false;
        const msg = this.id ? 'updated' : 'created';
        this.msg.add({
          severity: 'success',
          detail: `${this.featureDisplayName} ${msg} successfully`,
        });
        this.id = res.idResult;
        this.moveForward();
      },
      error: () => (this.isSaving = false),
    });
  }
}
