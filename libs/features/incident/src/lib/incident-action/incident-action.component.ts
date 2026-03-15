import { validations } from 'libs/shared/shared-ui/src/models/validation.model';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { DatePackerComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { TextareaUiComponent } from '@gfw/shared-ui';
import { CurrencyInputComponent } from '@gfw/shared-ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize, forkJoin, switchMap } from 'rxjs';
import { RoleDropdownComponent } from '@gfw/shared-ui';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { IncidentService } from '../../services/incident.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-incident-action',
  imports: [
    CommonModule,
    FormsModule,
    CurrencyInputComponent,
    ReactiveFormsModule,
    InputTextComponent,
    UiDropdownComponent,
    DatePackerComponent,
    ButtonModule,
    TextareaUiComponent,
    TranslateModule,
    RouterLink,
  ],
  templateUrl: './incident-action.component.html',
  styleUrl: './incident-action.component.scss',
})
export class IncidentActionComponent implements OnInit {
  constructor(
    private _Router: Router,
    private _MessageService: MessageService,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _ActivatedRoute: ActivatedRoute,
    private _IncidentService: IncidentService,
    private _TranslateService: TranslateService,
    private _permissionService:PermissionSystemService
  ) {
    this.breadCrumb = [
      this._LayoutService.breadCrumbLinks.next([
        {
          name: '',
          icon: 'fi fi-rs-home',
          routerLink: '/',
        },
        {
          name: this._TranslateService.instant('INCIDENT.incident'),
          icon: '',
          routerLink: '/gfw-portal/incident/list',
        },
        {
          name: this._TranslateService.instant('INCIDENT.LIST_TITLE'),
          icon: '',
          routerLink: '/gfw-portal/incident/list',
        },
        {
          name: this._TranslateService.instant('INCIDENT.ADD_BUTTON'),
          icon: '',
        },
      ]),
    ];
  }
  incidentForm!: FormGroup;
  current_updated_id: any;
  initiatives: any[] = [];
  managerRoles: any[] = [];
  statusTypes: any[] = [];
  priorityLevels: any[] = [];
  updateFlag = false;
  ngOnInit(): void {
    this.initIncidentForm();
    this.loadLookups();
    this._ActivatedRoute.paramMap.subscribe((res: any) => {
      const id = res.get('id');

      if (id) {
        this.updateFlag = true;
        this.current_updated_id = id;

        this._IncidentService.getIncidentById(id).subscribe((res: any) => {
          this.initIncidentForm(res?.data);

          this.breadCrumb = [
            this._LayoutService.breadCrumbLinks.next([
              {
                name: '',
                icon: 'fi fi-rs-home',
                routerLink: '/',
              },
              {
                name: this._TranslateService.instant('INCIDENT.incident'),
                icon: '',
                routerLink: '/gfw-portal/incident/list',
              },
              {
                name: this._TranslateService.instant('INCIDENT.LIST_TITLE'),
                icon: '',
                routerLink: '/gfw-portal/incident/list',
              },
              {
                name: res?.data?.name || '-',
                icon: '',
              },
            ]),
          ];
        });
      } else {
        this.updateFlag = false;
        this.initIncidentForm();
      }
    });
  }

  breadCrumb: any;
  incidentTypes: any;
  severityLevels: any;
  sourceTypes: any;
  confidentailArray = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  nameVaildation: validations[] = [
    { key: 'required', message: 'VALIDATIONS.NAME' },
  ];
  initIncidentForm(data?: any) {
    this.incidentForm = new FormGroup({
      name: new FormControl(data?.name, [Validators.required]),
      incidentTypeID: new FormControl(data?.incidentTypeID  ,[Validators.required]),
      incidentStatusTypeID: new FormControl(data?.incidentStatusTypeID  ,[Validators.required]),
      incidentPriorityLevelTypeID: new FormControl(
        data?.incidentPriorityLevelTypeID ,
        [Validators.required]
      ),
      incidentSeverityLevelTypeID: new FormControl(
        data?.incidentSeverityLevelTypeID ,
        [Validators.required]
      ),
      incidentSourceTypeID: new FormControl(data?.incidentSourceTypeID ),
      occurredAt: new FormControl(
        data?.occurredAt
          ? moment(new Date(data?.occurredAt)).format('MM-DD-YYYY')
          : null
      ),
      reportedAt: new FormControl(
        data?.reportedAt
          ? moment(new Date(data?.reportedAt)).format('MM-DD-YYYY')
          : null,[Validators.required]
      ),
      location: new FormControl(data?.location),
      description: new FormControl(data?.description),
      isConfidential: new FormControl(data?.isConfidential,[Validators.required]),
      estimatedFinancialImpact: new FormControl(data?.estimatedFinancialImpact),
      referenceCode: new FormControl(data?.referenceCode),
    });
  }

   loadLookups() {
    forkJoin([
      this._SharedService.lookUps([141,142,143,144,145,146,147,148]),
      this._SharedService.getRoleLookupData(),
    ]).subscribe({
      next: (res: any[]) => {
        if (res) {
          this.severityLevels = res[0]?.data?.IncidentSeverityLevelType || [];
          this.priorityLevels = res[0]?.data?.IncidentPriorityLevelType || [];
          this.incidentTypes = res[0]?.data?.IncidentType || [];
          this.statusTypes=res[0]?.data?.IncidentStatusType
          this.sourceTypes=res[0]?.data?.IncidentSourceType
        }
      },
    });
  }


  isLoading: boolean = false;
  validationsRequired: any[] = [
    { key: 'required', message: 'VALIDATIONS.REQUIRED' },
  ];

  submit() {
              // ===== Permissions =====
  const hasPermission = this.current_updated_id
    ? this._permissionService.can('INCIDENT' , 'INCIDENT', 'EDIT')
    : this._permissionService.can('INCIDENT' , 'INCIDENT', 'ADD');

  if (!hasPermission) {
    return;
  }
     if (this.incidentForm.invalid) {
      this.incidentForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const req = {
      ...this.incidentForm.value,
      occurredAt: moment(
        this.incidentForm.get('occurredAt')?.value,
        'MM-DD-YYYY'
      )
        .utc(true)
        .toISOString(),
      reportedAt: moment(
        this.incidentForm.get('reportedAt')?.value,
        'MM-DD-YYYY'
      )
        .utc(true)
        .toISOString(),
    };

    if (this.current_updated_id) {
      req['incidentID'] = this.current_updated_id;
    }

    const API$ = this.current_updated_id
      ? this._IncidentService.updateIncident(req)
      : this._IncidentService.addNewIncident(req);

    API$.pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((res: any) => {
      this._MessageService.add({
        severity: 'success',
        summary: 'Success',
        detail: this.current_updated_id
          ? 'Incident Updated Successfully'
          : 'Incident Added Successfully ',
      });
      this._Router.navigate(['/gfw-portal/incident/list']);
    });
  }
}
