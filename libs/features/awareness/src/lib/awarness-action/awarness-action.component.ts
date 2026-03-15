import { InputUrlComponent } from './../../../../../shared/shared-ui/src/lib/input-url/input-url.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { finalize, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';

import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';

// Shared UI Components
import { InputTextComponent } from 'libs/shared/shared-ui/src/lib/input-text/input-text.component';
import { UiDropdownComponent } from 'libs/shared/shared-ui/src/lib/ui-dropdown/ui-dropdown.component';
import { DatePackerComponent } from '@gfw/shared-ui';
import { ButtonModule } from 'primeng/button';
import { InputNumberComponent } from 'libs/shared/shared-ui/src/lib/input-number/input-number.component';
import { AwarenessService } from '../../services/awareness.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-awarness-action',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    InputTextComponent,
    UiDropdownComponent,
    ButtonModule,
    InputNumberComponent,
    DatePackerComponent,
    InputUrlComponent,
  ],
  templateUrl: './awarness-action.component.html',
  styleUrl: './awarness-action.component.scss',
})
export class AwarnessActionComponent implements OnInit {
  campaign_form!: FormGroup;
  current_update_id: any;
  isLoading = false;

  validationsRequired = [{ key: 'required', message: 'VALIDATIONS.REQUIRED' }];

  campaignTypes: any[] = [];
  statusTypes: any[] = [];
  contentTypes: any[] = [];

  breadCrumb: any[] = [];
  govDocuemnt: any[] = [];
  booleanOptions = [
    { id: true, label: 'Yes' },
    { id: false, label: 'No' },
  ];

  constructor(
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _AwarenessService: AwarenessService,
    private _TranslateService: TranslateService,
    private _SharedService: SharedService,
    private _LayoutService: LayoutService,
    private _MessageService: MessageService,
    private _permissionService: PermissionSystemService
  ) {}

  ngOnInit(): void {
    this.breadCrumb = [
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      {
        name: this._TranslateService.instant('AWARENESS.TITLE'),
        icon: '',
        routerLink: '/gfw-portal/awareness/campaign-list',
      },
      { name: '-', icon: '' },
    ];

    this._LayoutService.breadCrumbLinks.next(this.breadCrumb);
    this.loadLookups();
    this.initForm();
    this.handleRouteParams();
  }

  loadLookups() {
    this._SharedService.lookUps([133, 134, 202, 26]).subscribe((res: any) => {
      this.campaignTypes = res?.data?.AwarenessCampaignType;
      this.statusTypes = res?.data?.AwarenessCampaignStatusType;
      this.contentTypes = res?.data?.AwarenessContentType;
      this.govDocuemnt = res?.data?.GovDocument;
    });
  }

  private handleRouteParams(): void {
    this._ActivatedRoute.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (!id) {
            this.breadCrumb[this.breadCrumb.length - 1].name =
              this._TranslateService.instant('AWARENESS.ADD_CAMPAIGN');
            return of(null);
          }
          this.current_update_id = id;
          return this._AwarenessService.getCampaignById(id).pipe(
            map((res: any) => {
              if (res?.data) {
                this.breadCrumb[this.breadCrumb.length - 1].name =
                  res.data.name;
                return res.data;
              }
              return null;
            })
          );
        })
      )
      .subscribe((res) => {
        if (res) this.initForm(res);
      });
  }

  initForm(data?: any) {
    this.campaign_form = new FormGroup({
      name: new FormControl(data?.name, [Validators.required]),
      awarenessCampaignTypeID: new FormControl(data?.awarenessCampaignTypeID, [
        Validators.required,
      ]),
      awarenessCampaignStatusTypeID: new FormControl(
        data?.awarenessCampaignStatusTypeID,
        [Validators.required]
      ),
      awarenessContentTypeID: new FormControl(data?.awarenessContentTypeID, [
        Validators.required,
      ]),
      externalUrl: new FormControl(data?.externalUrl),
      govDocuemntID: new FormControl(data?.govDocuemntID),
      startDate: new FormControl(
        data?.startDate
          ? moment(new Date(data?.startDate)).format('MM-DD-YYYY')
          : null,
        [Validators.required]
      ),
      dueDate: new FormControl(
        data?.dueDate
          ? moment(new Date(data?.dueDate)).format('MM-DD-YYYY')
          : null
      ),
      graceDays: new FormControl(data?.graceDays),
      requireQuizPass: new FormControl(data?.requireQuizPass, [
        Validators.required,
      ]),
      minScoreToPass: new FormControl(data?.minScoreToPass),
      maxReminders: new FormControl(data?.maxReminders, [Validators.required]),
      reminderIntervalDays: new FormControl(data?.reminderIntervalDays, [
        Validators.required,
      ]),
      deliveryMessage: new FormControl(data?.deliveryMessage),
      deliverySubject: new FormControl(data?.deliverySubject),
    });
  }

  submit() {
    if (
      !this._permissionService.can('AWARNESS', 'CAMPAIGNS', 'ADD') ||
      !this._permissionService.can('AWARNESS', 'CAMPAIGNS', 'EDIT')
    )
      return;

    if (this.campaign_form.invalid) {
      this.campaign_form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const req = { ...this.campaign_form.value };

    ['startDate', 'dueDate'].forEach((key) => {
      if (req[key]) {
        req[key] = moment(req[key], 'MM-DD-YYYY').utc(true).toISOString();
      }
    });
    if (this.current_update_id)
      req.awarenessCampaignID = this.current_update_id;

    const request$ = this.current_update_id
      ? this._AwarenessService.updateCampaign(req)
      : this._AwarenessService.addCampaign(req);

    request$.pipe(finalize(() => (this.isLoading = false))).subscribe(() => {
      this._MessageService.add({
        severity: 'success',
        summary: 'Success',
        detail: this.current_update_id
          ? this._TranslateService.instant('AWARENESS.UPDATED_SUCCESS')
          : this._TranslateService.instant('AWARENESS.ADDED_SUCCESS'),
      });
      this._Router.navigate(['/gfw-portal/awareness/campaign-list']);
    });
  }
}
