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
import { IncidentService } from 'libs/features/incident/src/services/incident.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-lesson-learn-action',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextComponent,
    UiDropdownComponent,
    ButtonModule,
    TextareaUiComponent,
    TranslateModule,
    RouterLink,
  ],
  templateUrl: './lessonLearn-action.component.html',
  styleUrl: './lessonLearn-action.component.scss',
})
export class LessonLearnActionComponent implements OnInit {
  LessonLearnForm!: FormGroup;
  current_updated_id: any;
  generalId: any;
  isLoading = false;
  usersList: any[] = [];
  lessonsTypes: any[] = [{ id: 1, label: 'lessonTypes' }];
  categoriesList: any[] = [{ id: 1, label: 'categories' }];
  validationsRequired = [{ key: 'required', message: 'VALIDATIONS.REQUIRED' }];
  isActiveArray: any = [
    { id: 1, label: 'Active', value: true },
    { id: 2, label: 'In Active', value: false },
  ];
  constructor(
    private _Router: Router,
    private _MessageService: MessageService,
    private _SharedService: SharedService,
    private _ActivatedRoute: ActivatedRoute,
    private _TranslateService: TranslateService,
    private _IncidentService: IncidentService,
    private _LayoutService: LayoutService,
    private _permissionService: PermissionSystemService
  ) {}

  ngOnInit(): void {
    this.initLessonLearnForm();
    this.loadLookups();
    this._ActivatedRoute.paramMap.subscribe((res: any) => {
      const LessonLearnId = res.get('lessonId');
      this.generalId = res.get('generalId');
      if (this.generalId) {
        this._LayoutService.breadCrumbLinks.next([
          {
            name: '',
            icon: 'fi fi-rs-home',
            routerLink: '/',
          },
          {
            name: this._TranslateService.instant('LessonLearn.LIST_TITLE'),
            icon: '',
            routerLink: `/gfw-portal/incident/viewincident/${this.generalId}/lesson-Learning`,
          },
          {
            name: this.current_updated_id
              ? this._TranslateService.instant('INCIDENT.Update_Incident')
              : this._TranslateService.instant('LessonLearn.ADD_BUTTON'),
            icon: '',
          },
        ]);
      }
      if (LessonLearnId) {
        this.current_updated_id = LessonLearnId;
        this._IncidentService
          .getLessonLearnById(LessonLearnId)
          .subscribe((res: any) => {
            this.initLessonLearnForm(res?.data);
            this._LayoutService.breadCrumbLinks.next([
              {
                name: '',
                icon: 'fi fi-rs-home',
                routerLink: '/',
              },
              {
                name: this._TranslateService.instant('LessonLearn.LIST_TITLE'),
                icon: '',
                routerLink: `/gfw-portal/incident/viewincident/${this.generalId}/lesson-Learning`,
              },
              {
                name: this.current_updated_id
                  ? res?.data?.name || '-'
                  : this._TranslateService.instant('LessonLearn.ADD_BUTTON'),
                icon: '',
              },
            ]);
          });
      }
    });
  }

  initLessonLearnForm(data?: any) {
    this.LessonLearnForm = new FormGroup({
      name: new FormControl(data?.name || null, Validators.required),
      description: new FormControl(data?.description || null),

      lessonsLearnedCategoryID: new FormControl(
        data?.lessonsLearnedCategoryID || null,
        Validators.required
      ),

      lessonsLearnedTypeID: new FormControl(
        data?.lessonsLearnedTypeID || null,
        Validators.required
      ),

      documentedByUserID: new FormControl(
        data?.documentedByUserID || null,
        Validators.required
      ),
      isActive: new FormControl(data?.isActive),
    });
  }

  loadLookups() {
    this._SharedService.lookUps([219, 220]).subscribe((res: any) => {
      this.categoriesList = res?.data?.LessonsLearnedCategory;
      this.lessonsTypes = res?.data?.LessonsLearnedType;
    });

    this._SharedService
      .getUserLookupData()
      .subscribe((res: any) => (this.usersList = res?.data));
  }

  submit() {

    if (this.LessonLearnForm.invalid) {
      this.LessonLearnForm.markAllAsTouched();
      return;
    }
              // ===== Permissions =====
  const hasPermission = this.current_updated_id
    ? this._permissionService.can('INCIDENT' , 'INCIDENTLESSONS', 'EDIT')
    : this._permissionService.can('INCIDENT' , 'INCIDENTLESSONS', 'ADD');

  if (!hasPermission) {
    return;
  }

    this.isLoading = true;
    const req = {
      ...this.LessonLearnForm.value,
      dataEntityID: this.generalId,
      dataEntityTypeID: 92,
    };

    const API$ = this.current_updated_id
      ? this._IncidentService.updateLessonLearn(req, this.current_updated_id)
      : this._IncidentService.addLessonLearn(req);

    API$.pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: () => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.current_updated_id
            ? this._TranslateService.instant('LessonLearn.UPDATE_SUCCESS')
            : this._TranslateService.instant('LessonLearn.ADD_SUCCESS'),
        });
        this._Router.navigate([
          `/gfw-portal/incident/viewincident/${this.generalId}/lesson-Learning`,
        ]);
      },
    });
  }
}
