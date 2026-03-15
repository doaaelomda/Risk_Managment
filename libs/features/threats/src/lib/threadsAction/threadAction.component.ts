import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { finalize, forkJoin, Observable, of, switchMap } from 'rxjs';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';

import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ThreatService } from '../../services/threat.service';

// Shared UI Components
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { DatePackerComponent, TextareaUiComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-threat-action',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    InputTextComponent,
    UiDropdownComponent,
    DatePackerComponent,
    ButtonModule,
    TextareaUiComponent
  ],
  templateUrl: './threadAction.component.html',
  styleUrl: './threadAction.component.scss',
})
export class ThreadActionComponent implements OnInit {

  threat_form!: FormGroup;
  current_update_id: any;
  isLoading = false;

  validationsRequired: any[] = [
    { key: 'required', message: 'VALIDATIONS.REQUIRED' },
  ];

  // lookup data
  severities: any[] = [];
  statuses: any[] = [];
  sources: any[] = [];
  categories: any[] = [];
  threatTypes: any[] = [];
  threatSources:any[]=[]

  breadCrumb: any[] = [];
  ThreatId: any;

  constructor(
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _ThreatService: ThreatService,
    private _TranslateService: TranslateService,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _MessageService: MessageService,
    private _PermissionSystemService:PermissionSystemService
  ) {}

  ngOnInit(): void {
    this.breadCrumb = [
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
            {
        name: this._TranslateService.instant('HEARDE_TABLE.THREATS'),
        icon: '',
        routerLink: '/gfw-portal/Threats-management/list',
      },
      { name: this._TranslateService.instant('BREAD_CRUMB_TITLES.THREAT_LIST'), icon: '', routerLink: '/gfw-portal/Threats-management/list' },
      { name: '-', icon: '', routerLink: '' }
    ];

    this._LayoutService.breadCrumbLinks.next(this.breadCrumb);
    this.loadLookups();
    this.initThreatForm();
    this.handleRouteParams();
  }

  loadLookups() {
    forkJoin([
      this._SharedService.lookUps([182,183,184,51,52,203]) // example IDs for threat lookups
    ]).subscribe((res: any[]) => {
      const data = res[0]?.data;
          this.severities = data?.ThreatSeverityType || [];
      this.statuses = data?.ThreatStatusType || [];
      this.sources = data?.ThreatSourceReferenceType || [];
      this.threatSources = data?.ThreatSourceType;
      this.categories = data?.ThreatCategoryType || [];
      this.threatTypes = data?.ThreatType || [];
    });
  }

  private handleRouteParams(): void {
    this._ActivatedRoute.paramMap
      .pipe(
        switchMap((params: any) => {
          const id = params.get('id');
          if (!id) {
            this.breadCrumb[this.breadCrumb.length - 1].name = this._TranslateService.instant('THREAT.ADD_THREAT');
            return of(null);
          }
          this.current_update_id = id;
          return this._ThreatService.getThreatById(id);
        })
      )
      .subscribe((res: any) => {
        if (res?.data) {
            this.breadCrumb[this.breadCrumb.length - 1].name = res?.data?.name
          this.initThreatForm(res.data);
        }
      });
  }

  initThreatForm(data?: any) {
    this.threat_form = new FormGroup({
      name: new FormControl(data?.name, Validators.required),
      nameAr: new FormControl(data?.nameAr),
      description: new FormControl(data?.description),
      descriptionAr: new FormControl(data?.descriptionAr),
      threatCategoryTypeID: new FormControl(data?.threatCategoryTypeID, Validators.required),
      threatSourceReferenceTypeID: new FormControl(data?.threatSourceReferenceTypeID),
      sourceReference: new FormControl(data?.sourceReference),
      discoveredDate: new FormControl(data?.discoveredDate ? moment(data?.discoveredDate).format('MM-DD-YYYY') : null),
      lastSeenDate: new FormControl(data?.lastSeenDate ? moment(data?.lastSeenDate).format('MM-DD-YYYY') : null),
      threatTypeID: new FormControl(data?.threatTypeID),
      threatSourceTypeID: new FormControl(data?.threatSourceTypeID),
      threatStatusTypeID: new FormControl(data?.threatStatusTypeID),
      threatSeverityTypeID: new FormControl(data?.threatSeverityTypeID),
      isActive: new FormControl(data?.isActive, Validators.required),
      isGeneral: new FormControl(data?.isGeneral, Validators.required),
      dateIdentified: new FormControl(data?.dateIdentified ? moment(data?.dateIdentified).format('MM-DD-YYYY') : null)
    });
  }

  submit() {

          const hasPermission = this.current_update_id
    ? this._PermissionSystemService.can('THREATS' ,'THREATS', 'EDIT')
    : this._PermissionSystemService.can('THREATS' ,'THREATS', 'ADD');

  if (!hasPermission) {
    return;
  }
    if (this.threat_form.invalid ) {
      this.threat_form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const req = {
      ...this.threat_form.value,
      discoveredDate: moment(this.threat_form.get('discoveredDate')?.value, 'MM-DD-YYYY').utc(true).toISOString(),
      lastSeenDate: moment(this.threat_form.get('lastSeenDate')?.value, 'MM-DD-YYYY').utc(true).toISOString(),
      dateIdentified: moment(this.threat_form.get('dateIdentified')?.value, 'MM-DD-YYYY').utc(true).toISOString()
    };

    if (this.current_update_id) req.threatID = this.current_update_id;

    const request$: Observable<any> = this.current_update_id
      ? this._ThreatService.updateThreat(req)
      : this._ThreatService.addThreat(req);

    request$.pipe(finalize(() => (this.isLoading = false))).subscribe(() => {
      this._MessageService.add({
        severity: 'success',
        summary: 'Success',
        detail: this.current_update_id
          ? this._TranslateService.instant('THREAT.UPDATED_SUCCESS')
          : this._TranslateService.instant('THREAT.ADDED_SUCCESS')
      });
      this._Router.navigate(['/gfw-portal/Threats-management/list']);
    });
  }
}
