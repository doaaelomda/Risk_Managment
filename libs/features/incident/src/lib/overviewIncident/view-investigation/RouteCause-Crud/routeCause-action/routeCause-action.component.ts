import { AccordionModule } from 'primeng/accordion';
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
  FormBuilder,
  FormArray,
  AbstractControl,
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
import { IncidentService } from 'libs/features/incident/src/services/incident.service';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'lib-route-cause-action',
  imports: [
    CommonModule,
    FormsModule,
    AccordionModule,
    ReactiveFormsModule,
    InputTextComponent,
    UiDropdownComponent,
    ButtonModule,
    TextareaUiComponent,
    TranslateModule,
    DatePackerComponent,
    TextareaUiComponent,
    InputTextModule,
  ],
  templateUrl: './routeCause-action.component.html',
  styleUrl: './routeCause-action.component.scss',
})
export class RouteCauseActionComponent implements OnInit {
  RouteCauseLearnForm!: FormGroup;
  questionForm!: FormGroup;
  current_updated_id: any;
  generalId: any;
  isLoading = false;
  statusList: any[] = [];
  methodologyList: any[] = [];
  usersList: any[] = [];
  severityList: any[] = [];
  categoriesList: any[] = [];
  validationsRequired = [{ key: 'required', message: 'VALIDATIONS.REQUIRED' }];
  constructor(
    private _Router: Router,
    private _MessageService: MessageService,
    private _SharedService: SharedService,
    private _ActivatedRoute: ActivatedRoute,
    private _TranslateService: TranslateService,
    private _IncidentService: IncidentService,
    private _LayoutService: LayoutService
  ) {}
  incidentId: any;
  dataEntityTypeID: any;
  Routing: any;
  ngOnInit(): void {
    this.loadLookups();
    this.initRouteCauseLearnForm();

    this.incidentId =
      this._ActivatedRoute.parent?.snapshot.queryParams['incidentId'];
    this._ActivatedRoute.paramMap.subscribe((res: any) => {
      const RouteCauseLearnId = res.get('routeCauseId');
      this.generalId = res.get('generalId');
      this.dataEntityTypeID =
        this._ActivatedRoute.parent?.snapshot.queryParams['dataEntityTypeID'];
      this.Routing =
        this._ActivatedRoute.parent?.snapshot.queryParams['Routing'];
      if (this.generalId) {
        this._LayoutService.breadCrumbLinks.next([
          {
            name: '',
            icon: 'fi fi-rs-home',
            routerLink: '/',
          },
          {
            name: this._TranslateService.instant('RooteCause.LIST_TITLE'),
            icon: '',
            routerLink:
              this.Routing === 'Risk'
                ? `/gfw-portal/risks-management/risk/${this.generalId}/routeCause`
                : `/gfw-portal/incident/${this.incidentId}/investigations/${this.generalId}/routeCause`,
          },
          {
            name: this.current_updated_id
              ? this._TranslateService.instant('INCIDENT.Update_Incident')
              : this._TranslateService.instant('RooteCause.ADD_BUTTON'),
            icon: '',
          },
        ]);
      }
      if (RouteCauseLearnId) {
        this.current_updated_id = RouteCauseLearnId;
        this._IncidentService
          .getRouteCauseById(RouteCauseLearnId)
          .subscribe((res: any) => {
            this.initRouteCauseLearnForm(res?.data);
            this._LayoutService.breadCrumbLinks.next([
              {
                name: '',
                icon: 'fi fi-rs-home',
                routerLink: '/',
              },
              {
                name: this._TranslateService.instant('RooteCause.LIST_TITLE'),
                icon: '',
                routerLink:
                  this.Routing === 'Risk'
                    ? `/gfw-portal/risks-management/risk/${this.generalId}/routeCause`
                    : `/gfw-portal/incident/${this.incidentId}/investigations/${this.generalId}/routeCause`,
              },
              {
                name: this.current_updated_id
                  ? res?.data?.name || '-'
                  : this._TranslateService.instant('RooteCause.ADD_BUTTON'),
                icon: '',
              },
            ]);
          });
      }
    });
  }

  initRouteCauseLearnForm(data?: any) {
    this.RouteCauseLearnForm = new FormGroup({
      rootCauseCategoryID: new FormControl(
        data?.rootCauseCategoryID || null,
        Validators.required
      ),
      name: new FormControl(data?.name || null, Validators.required),
      description: new FormControl(data?.description || null),
      rootCauseMethodologyID: new FormControl(
        data?.rootCauseMethodologyID || null,
        Validators.required
      ),
      detectionDate: new FormControl(
        data?.detectionDate
          ? moment(new Date(data.detectionDate)).format('MM-DD-YYYY')
          : null
      ),
      identifiedByUserID: new FormControl(data?.identifiedByUserID || null),
      rootCauseSeverityLevelID: new FormControl(
        data?.rootCauseSeverityLevelID || null
      ),
      recommendation: new FormControl(data?.recommendation || null),
      rootCauseStatusTypeID: new FormControl(
        data?.rootCauseStatusTypeID || null
      ),

      target: new FormArray([], Validators.maxLength(5)),
    });

    const targetArray = this.RouteCauseLearnForm.get('target') as FormArray;

    if (data?.whyList && data.whyList.length) {
      data.whyList.forEach((item: any) => {
        targetArray.push(
          new FormGroup({
            whyQuestion: new FormControl(item.question, Validators.required),
            whyAnswer: new FormControl(item.answer, Validators.required),
            whyNote: new FormControl(item.note, Validators.required),
          })
        );
      });
    } else {
      targetArray.push(
        new FormGroup({
          whyQuestion: new FormControl(null, Validators.required),
          whyAnswer: new FormControl(null, Validators.required),
          whyNote: new FormControl(null, Validators.required),
        })
      );
    }
  }

  trackByIndex(index: number, item: AbstractControl) {
    return index;
  }

  get target() {
    return this.RouteCauseLearnForm?.get('target') as FormArray;
  }

  pushNewQuestion() {
    if (this.target.length < 5) {
      this.target.push(
        new FormGroup({
          whyQuestion: new FormControl(null, Validators.required),
          whyAnswer: new FormControl(null, Validators.required),
          whyNote: new FormControl(null, Validators.required),
        })
      );
    }
  }

  removeQuestion(index: number) {
    if (this.target.length > 1) {
      this.target.removeAt(index);
    }
  }

  loadLookups() {
    this._SharedService.lookUps([215, 216, 217, 218]).subscribe((res: any) => {
      this.severityList = res?.data?.RootCauseSeverityLevelType;
      this.methodologyList = res?.data?.RootCauseMethodology;
      this.categoriesList = res?.data?.RootCauseCategory;
      this.statusList = res?.data?.RootCauseVerificationStatusType;
    });

    this._SharedService
      .getUserLookupData()
      .subscribe((res: any) => (this.usersList = res?.data));
  }

  submit() {
    if (this.target.length < 5) {
      this._MessageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'You must add 5 Why questions',
      });
      return;
    }

    if (this.RouteCauseLearnForm.invalid) {
      this.RouteCauseLearnForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const req = {
      ...this.RouteCauseLearnForm.value,
      detectionDate: moment(
        this.RouteCauseLearnForm.get('detectionDate')?.value,
        'MM-DD-YYYY'
      )
        .utc(true)
        .toISOString(),
      dataEntityID: this.generalId,
      dataEntityTypeID: this.dataEntityTypeID,
    };

    const API$ = this.current_updated_id
      ? this._IncidentService.updateRouteCause(req, this.current_updated_id)
      : this._IncidentService.addRouteCause(req);

    API$.pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: () => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.current_updated_id
            ? this._TranslateService.instant('MESSAGES.UPDATE_SUCCESS')
            : this._TranslateService.instant('MESSAGES.ADD_SUCCESS'),
        });
        this.Routing === 'Risk'
          ? this._Router.navigate([
              `/gfw-portal/risks-management/risk/${this.generalId}/routeCause`,
            ])
          : this._Router.navigate([
              `/gfw-portal/incident/${this.incidentId}/investigations/${this.generalId}/routeCause`,
            ]);
      },
    });
  }
  closePage() {
    this.Routing === 'Risk'
      ? this._Router.navigate([
          `/gfw-portal/risks-management/risk/${this.generalId}/routeCause`,
        ])
      : this._Router.navigate([
          `/gfw-portal/incident/${this.incidentId}/investigations/${this.generalId}/routeCause`,
        ]);
  }
}
