import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EsclationService } from '../../../services/esclation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, concatMap, finalize, tap } from 'rxjs';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { UserDropdownComponent } from 'libs/shared/shared-ui/src/lib/user-dropdown/user-dropdown.component';
import { RoleDropdownComponent } from 'libs/shared/shared-ui/src/lib/role-dropdown/role-dropdown.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { InputTextModule } from 'primeng/inputtext';
import { LoaderComponent } from 'libs/shared/shared-ui/src/lib/loader/loader.component';
import { InputNumberModule } from 'primeng/inputnumber';
import * as moment from 'moment';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-level-criteria',
  imports: [
    CommonModule,
    DropdownModule,
    ReactiveFormsModule,
    FormsModule,
    CalendarModule,
    UserDropdownComponent,
    RoleDropdownComponent,
    TranslateModule,
    InputTextModule,
    LoaderComponent,
    InputNumberModule,
  ],
  templateUrl: './level-criteria.component.html',
  styleUrl: './level-criteria.component.scss',
})
export class LevelCriteriaComponent {
  constructor(
    private _esclationS: EsclationService,
    private _router: Router,
    private _SharedService: SharedService,
    private _activatedR: ActivatedRoute,
    private _HttpClient: HttpClient,
    private _messageS: MessageService,
    private _translateS: TranslateService,
    private _LayoutService: LayoutService,
    public _PermissionSystemService: PermissionSystemService
  ) {
    this.initFilterForm();
  }
  current_dataEntityTypeID: any;
  ngOnInit() {
    this._esclationS.steps$.subscribe((steps) => {
      console.log('Steps updated:', steps);
    });
    this.handleSteps();
  }
  levelId: any;
  handleSteps() {
    combineLatest([
      this._activatedR.paramMap,
      this._activatedR.parent?.paramMap || [],
    ]).subscribe(([childParams, parentParams]) => {
      const id = parentParams?.get('id');
      this._LayoutService.breadCrumbLinks.next([
        { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
        {
          name: this._translateS.instant('ESCALATION.BREADCRUMB'),
          icon: '',
          routerLink: '/gfw-portal/escalation',
        },
        {
          name: this._translateS.instant('ESCALATION.LIST_TITLE'),
          icon: '',
          routerLink: '/gfw-portal/esclation/list',
        },
        {
          name: this._translateS.instant('ESCLATION.ESCLATION'),
          icon: '',
          routerLink: `/gfw-portal/esclation/view/${id}/overview`,
        },
        {
          name: this._translateS.instant('ESCLATION.CRITERIA'),
          icon: '',
          routerLink: '',
        },
      ]);
      const levelId = childParams?.get('levelId');
      this.levelId = levelId;
      this._esclationS.getEsclationById(id).subscribe((res: any) => {
        console.log('getEsclationById', res);
        this.current_dataEntityTypeID = res?.data?.dataEntityTypeID;
        this.getCriteria();
      });
      this._esclationS.activeStep.next(3);
      this._esclationS.updateStep(3, {
        command: () => {
          this._router.navigate([
            `/gfw-portal/esclation/view/${id}/esclation-target/${levelId}`,
          ]);
        },
      });
      this._esclationS.updateStep(4, {
        command: () => {
          this._router.navigate([
            `/gfw-portal/esclation/view/${id}/esclation-notfications/${levelId}`,
          ]);
        },
      });
    });
  }

  addNewFilter() {
    if (
      !this._PermissionSystemService.can(
        'ESCLATIONS',
        'ESCLATIONCRITERIA',
        'ADD'
      )
    )
      return;

    if (this.filterForm.invalid) {
      return;
    }
    this.filterForm.push(
      new FormGroup({
        filter_type: new FormControl(null, [Validators.required]),
      })
    );
  }

  removeFromArray(index: number) {
    if (
      !this._PermissionSystemService.can(
        'ESCLATIONS',
        'ESCLATIONCRITERIA',
        'DELETE'
      )
    )
      return;

    this.filterForm.removeAt(index);

    const newOperatorMap = new Map();
    const newFiltersListMap = new Map();

    this.filterForm.controls.forEach((_, i) => {
      if (this.current_operator_map.has(i >= index ? i + 1 : i)) {
        newOperatorMap.set(
          i,
          this.current_operator_map.get(i >= index ? i + 1 : i)
        );
      }
      if (this.filters_list_map.has(i >= index ? i + 1 : i)) {
        newFiltersListMap.set(
          i,
          this.filters_list_map.get(i >= index ? i + 1 : i)
        );
      }
    });

    this.current_operator_map = newOperatorMap;
    this.filters_list_map = newFiltersListMap;
  }
  handleDynamicCallingAPIForFilter(filter: any, i: any) {
    this._HttpClient
      .post(enviroment.DOMAIN_URI + 'api/Lookup/multiWithoutResponse', [
        Number(filter?.lookupSourceID),
      ])
      .subscribe((res: any) => {
        this.filters_list_map.set(i, res[0]);
      });
  }
  handleSelectFilter(index: number, event: any) {
    const filterGroup = this.filterForm.at(index) as FormGroup;

    if (!filterGroup.contains('operator')) {
      filterGroup.addControl(
        'operator',
        new FormControl(null, [Validators.required])
      );
    }
    if (!filterGroup.contains('firstValue')) {
      filterGroup.addControl(
        'firstValue',
        new FormControl(null, Validators.required)
      );
    } else {
      filterGroup.get('firstValue')?.setValue(null);
    }
    if (!filterGroup.contains('secondValue')) {
      filterGroup.addControl('secondValue', new FormControl(null));
    } else {
      filterGroup.get('secondValue')?.setValue(null);
    }

    const type = event?.value?.filterType;

    const current_operator = this.all_operators.filter(
      (op) => op.FilterTypeName.toLocaleLowerCase() == type.toLocaleLowerCase()
    );

    this.current_operator_map.set(index, current_operator);
    filterGroup.get('operator')?.setValue(current_operator[0]);
    filterGroup.updateValueAndValidity();
    switch (type) {
      case 'List':
        this.handleDynamicCallingAPIForFilter(event.value, index);
        break;

      case 'Date':
        this.filters_list_map.set(index, this.date_filters);
        break;
      case 'User':
        this._SharedService.getUserLookupData().subscribe((res: any) => {
          this.filters_list_map.set(index, res?.data);
        });
        break;
      case 'Role':
        this._SharedService.getRoleLookupData().subscribe((res: any) => {
          this.filters_list_map.set(index, res?.data);
        });
        break;
      default:
        break;
    }
  }

  filter_form!: FormGroup;
  handledselectedFilterProfile(data: any) {
    console.log(data, 'data here');

    const form = data?.map((filter: any) => {
      return {
        filter_type: this.current_data_filter_entity.filter((fil: any) => {
          return fil?.filterId == filter?.dataEntityTypeFilterID;
        })[0],
        firstValue: filter?.firstValue,
        operator: this.all_operators.filter((op: any) => {
          return (
            op?.DataEntityTypeOperatorID ==
            filter?.dataEntityTypeFilterOperatorID
          );
        })[0],
        secondValue: filter?.secondValue,
        dateOptionID: filter?.dataEntityTypeFilterDateOptionID,
      };
    });

    console.log('Form ', form);

    form?.map((field: any, index: any) => {
      this.current_operator_map.set(
        index,
        this.all_operators.filter(
          (op) =>
            op.FilterTypeName.toLocaleLowerCase() ==
            field?.filter_type?.filterType?.toLocaleLowerCase()
        )
      );

      if (field?.filter_type?.filterType == 'List') {
        this._HttpClient
          .post(enviroment.DOMAIN_URI + 'api/Lookup/multiWithoutResponse', [
            Number(field?.filter_type?.lookupSourceID),
          ])
          .subscribe((res: any) => {
            this.filters_list_map.set(index, res[0]);
          });
      }

      if (field?.filter_type?.filterType == 'Date') {
        this.filters_list_map.set(index, this.date_filters);
      }

      if (field?.filter_type?.filterType == 'User') {
        this._SharedService.getUserLookupData().subscribe((res: any) => {
          this.filters_list_map.set(index, res?.data);
        });
      }
      if (field?.filter_type?.filterType == 'Role') {
        this._SharedService.getRoleLookupData().subscribe((res: any) => {
          this.filters_list_map.set(index, res);
        });
      }

      // field?.filter_type?.filterType == 'List'  ? +field?.firstValue : field?.filter_type?.filterType == 'Date' ? field?.dateOptionID : field?.firstValue

      const firstValue = () => {
        if (field?.filter_type?.filterType == 'List') {
          return +field?.firstValue;
        } else if (field?.filter_type?.filterType == 'Date') {
          return +field?.dateOptionID;
        } else if (field?.filter_type?.filterType == 'User') {
          return +field?.firstValue;
        } else if (field?.filter_type?.filterType == 'Role') {
          return +field?.firstValue;
        } else {
          return field?.firstValue;
        }
      };

      const secondValue = () => {
        if (field?.filter_type?.filterType == 'Date') {
          if (field?.dateOptionID == 19) {
            return new Date(field?.firstValue);
          } else if (field?.dateOptionID == 18) {
            return [new Date(field?.firstValue), new Date(field?.secondValue)];
          }
        } else {
          return null;
        }
      };
      const formP = new FormGroup({
        filter_type: new FormControl(field?.filter_type, [Validators.required]),
        operator: new FormControl(field?.operator, [Validators.required]),
        firstValue: new FormControl(firstValue(), [Validators.required]),
        secondValue: new FormControl(secondValue()),
      });

      this.filterForm.push(formP);
    });
  }
  initFilterForm() {
    this.filter_form = new FormGroup({
      filters: new FormArray([]),
    });
  }
  current_operator_map = new Map();
  all_operators = [
    {
      DataEntityTypeFilterTypeID: 1,
      FilterTypeName: 'Text',
      DataEntityTypeOperatorID: 1,
      OperatorCode: 'StartWith',
      OperatorName: 'Start With',
      OperatorNameAr: 'Start With',
    },
    {
      DataEntityTypeFilterTypeID: 1,
      FilterTypeName: 'Text',
      DataEntityTypeOperatorID: 2,
      OperatorCode: 'Contain',
      OperatorName: 'Contain',
      OperatorNameAr: 'Contain',
    },
    {
      DataEntityTypeFilterTypeID: 2,
      FilterTypeName: 'Date',
      DataEntityTypeOperatorID: 3,
      OperatorCode: 'Before',
      OperatorName: 'Before',
      OperatorNameAr: 'Before',
    },
    {
      DataEntityTypeFilterTypeID: 2,
      FilterTypeName: 'Date',
      DataEntityTypeOperatorID: 4,
      OperatorCode: 'After',
      OperatorName: 'After',
      OperatorNameAr: 'After',
    },
    {
      DataEntityTypeFilterTypeID: 2,
      FilterTypeName: 'Date',
      DataEntityTypeOperatorID: 5,
      OperatorCode: 'During',
      OperatorName: 'During',
      OperatorNameAr: 'During',
    },
    {
      DataEntityTypeFilterTypeID: 3,
      FilterTypeName: 'List',
      DataEntityTypeOperatorID: 6,
      OperatorCode: 'In',
      OperatorName: 'In',
      OperatorNameAr: 'IN',
    },
    {
      DataEntityTypeFilterTypeID: 3,
      FilterTypeName: 'List',
      DataEntityTypeOperatorID: 7,
      OperatorCode: 'NotIn',
      OperatorName: 'Not In',
      OperatorNameAr: 'Not In',
    },
    {
      DataEntityTypeFilterTypeID: 4,
      FilterTypeName: 'User',
      DataEntityTypeOperatorID: 8,
      OperatorCode: 'In',
      OperatorName: 'In',
      OperatorNameAr: 'IN',
    },
    {
      DataEntityTypeFilterTypeID: 4,
      FilterTypeName: 'User',
      DataEntityTypeOperatorID: 9,
      OperatorCode: 'NotIn',
      OperatorName: 'Not In',
      OperatorNameAr: 'Not In',
    },
    {
      DataEntityTypeFilterTypeID: 5,
      FilterTypeName: 'Role',
      DataEntityTypeOperatorID: 10,
      OperatorCode: 'In',
      OperatorName: 'In',
      OperatorNameAr: 'IN',
    },
    {
      DataEntityTypeFilterTypeID: 5,
      FilterTypeName: 'Role',
      DataEntityTypeOperatorID: 11,
      OperatorCode: 'NotIn',
      OperatorName: 'Not In',
      OperatorNameAr: 'Not In',
    },
    {
      DataEntityTypeFilterTypeID: 6,
      FilterTypeName: 'Integer Number',
      DataEntityTypeOperatorID: 12,
      OperatorCode: 'Equal',
      OperatorName: 'Equal',
      OperatorNameAr: 'Equal',
    },
    {
      DataEntityTypeFilterTypeID: 6,
      FilterTypeName: 'Integer Number',
      DataEntityTypeOperatorID: 13,
      OperatorCode: 'NotEqual',
      OperatorName: 'Not Equal',
      OperatorNameAr: 'Not Equal',
    },
    {
      DataEntityTypeFilterTypeID: 6,
      FilterTypeName: 'Integer Number',
      DataEntityTypeOperatorID: 14,
      OperatorCode: 'Larger Than',
      OperatorName: 'Larger Than',
      OperatorNameAr: 'LargerThan',
    },
    {
      DataEntityTypeFilterTypeID: 6,
      FilterTypeName: 'Integer Number',
      DataEntityTypeOperatorID: 15,
      OperatorCode: 'Less Than',
      OperatorName: 'Less Than',
      OperatorNameAr: 'LessThan',
    },
    {
      DataEntityTypeFilterTypeID: 7,
      FilterTypeName: 'Decimal Number',
      DataEntityTypeOperatorID: 16,
      OperatorCode: 'IS',
      OperatorName: 'IS',
      OperatorNameAr: 'IS',
    },
  ];

  date_filters = [
    {
      DataEntityTypeFilterDateOptionID: 1,
      Code: 'TODAY',
      Name: 'اليوم',
      NameEn: 'Today',
    },
    {
      DataEntityTypeFilterDateOptionID: 2,
      Code: 'YESTERDAY',
      Name: 'الأمس',
      NameEn: 'Yesterday',
    },
    {
      DataEntityTypeFilterDateOptionID: 3,
      Code: 'TOMORROW',
      Name: 'غدًا',
      NameEn: 'Tomorrow',
    },
    {
      DataEntityTypeFilterDateOptionID: 4,
      Code: 'NEXT_7_DAYS',
      Name: 'الأيام الـ 7 القادمة',
      NameEn: 'Next 7 Days',
    },
    {
      DataEntityTypeFilterDateOptionID: 5,
      Code: 'LAST_7_DAYS',
      Name: 'آخر 7 أيام',
      NameEn: 'Last 7 Days',
    },
    {
      DataEntityTypeFilterDateOptionID: 6,
      Code: 'THIS_WEEK',
      Name: 'هذا الأسبوع',
      NameEn: 'This Week',
    },
    {
      DataEntityTypeFilterDateOptionID: 7,
      Code: 'NEXT_WEEK',
      Name: 'الأسبوع القادم',
      NameEn: 'Next Week',
    },
    {
      DataEntityTypeFilterDateOptionID: 8,
      Code: 'LAST_WEEK',
      Name: 'الأسبوع الماضي',
      NameEn: 'Last Week',
    },
    {
      DataEntityTypeFilterDateOptionID: 9,
      Code: 'THIS_MONTH',
      Name: 'هذا الشهر',
      NameEn: 'This Month',
    },
    {
      DataEntityTypeFilterDateOptionID: 10,
      Code: 'NEXT_MONTH',
      Name: 'الشهر القادم',
      NameEn: 'Next Month',
    },
    {
      DataEntityTypeFilterDateOptionID: 11,
      Code: 'LAST_MONTH',
      Name: 'الشهر الماضي',
      NameEn: 'Last Month',
    },
    {
      DataEntityTypeFilterDateOptionID: 12,
      Code: 'THIS_QUARTER',
      Name: 'الربع الحالي',
      NameEn: 'This Quarter',
    },
    {
      DataEntityTypeFilterDateOptionID: 13,
      Code: 'NEXT_QUARTER',
      Name: 'الربع القادم',
      NameEn: 'Next Quarter',
    },
    {
      DataEntityTypeFilterDateOptionID: 14,
      Code: 'LAST_QUARTER',
      Name: 'الربع السابق',
      NameEn: 'Last Quarter',
    },
    {
      DataEntityTypeFilterDateOptionID: 15,
      Code: 'THIS_YEAR',
      Name: 'السنة الحالية',
      NameEn: 'This Year',
    },
    {
      DataEntityTypeFilterDateOptionID: 16,
      Code: 'NEXT_YEAR',
      Name: 'السنة القادمة',
      NameEn: 'Next Year',
    },
    {
      DataEntityTypeFilterDateOptionID: 17,
      Code: 'LAST_YEAR',
      Name: 'السنة الماضية',
      NameEn: 'Last Year',
    },
    {
      DataEntityTypeFilterDateOptionID: 18,
      Code: 'PERIOD',
      Name: 'الفترة',
      NameEn: 'PERIOR',
    },
    {
      DataEntityTypeFilterDateOptionID: 19,
      Code: 'DATE',
      Name: 'التاريخ',
      NameEn: 'Date',
    },
  ];

  filters_list_map = new Map();

  get filterForm(): FormArray {
    return this.filter_form.get('filters') as FormArray;
  }

  current_data_filter_entity: any[] = [];

  getCriteriaSelections(dataEntityTypeId: any) {
    if (this.current_data_filter_entity?.length) return;
    return this._esclationS.getCriteriaSelections(dataEntityTypeId).pipe(
      tap((res: any) => {
        console.log('filter widgets', res);
        this.current_data_filter_entity = res?.filters;
      })
    );
  }

  isSavingCriteria: boolean = false;
  save() {
    const canAdd = this._PermissionSystemService.can(
      'ESCLATIONS',
      'ESCLATIONCRITERIA',
      'ADD'
    );
    const canEdit = this._PermissionSystemService.can(
      'ESCLATIONS',
      'ESCLATIONCRITERIA',
      'EDIT'
    );
    if (!canAdd && !canEdit) return;
    this.isSavingCriteria = true;
    const filters = this.filterForm.value?.map((filter: any) => {
      if (filter?.filter_type?.filterType == 'Date') {
        if (filter?.firstValue != 18 && filter?.firstValue != 19) {
          return {
            filterID: filter?.filter_type?.filterId,
            filterCode: filter?.filter_type?.fieldName,
            operatorId: filter?.operator?.DataEntityTypeOperatorID,
            operatorCode: filter?.operator?.OperatorCode,
            firstValue: null,
            secondValue: null,
            dateOptionID: String(filter?.firstValue),
          };
        } else {
          const secod = filter?.secondValue;

          return {
            filterID: filter?.filter_type?.filterId,
            filterCode: filter?.filter_type?.fieldName,
            operatorId: filter?.operator?.DataEntityTypeOperatorID,
            operatorCode: filter?.operator?.OperatorCode,
            firstValue: Array.isArray(secod)
              ? moment(new Date(secod[0])).format('MM-DD-YYYY')
              : moment(new Date(secod)).format('MM-DD-YYYY'),
            secondValue: Array.isArray(secod)
              ? moment(new Date(secod[1])).format('MM-DD-YYYY')
              : null,
            dateOptionID: String(filter?.firstValue),
          };
        }
      } else {
        return {
          filterID: filter?.filter_type?.filterId,
          filterCode: filter?.filter_type?.fieldName,
          operatorId: filter?.operator?.DataEntityTypeOperatorID,
          operatorCode: filter?.operator?.OperatorCode,
          firstValue: String(filter?.firstValue),
          secondValue: null,
          dateOptionID: null,
        };
      }
    });
    this._esclationS.saveCriteria(filters, this.levelId).subscribe((res) => {
      this.isSavingCriteria = false;
      this._messageS.add({
        severity: 'success',
        detail: 'Criteria updated successfully',
      });
      this.getCriteria();
      console.log(res, 'saved c');
    });
    console.log(this.filterForm.value);
  }
  loading: boolean = true;
  getCriteria() {
    this.getCriteriaSelections(this.current_dataEntityTypeID)
      ?.pipe(concatMap(() => this._esclationS.getCriteria(this.levelId)))
      .subscribe({
        next: (res: any) => {
          console.log(res, 'got c');
          const data = res?.data;
          this.handledselectedFilterProfile(data);
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        },
      });
  }

  handleCancel() {}
}
