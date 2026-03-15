/* eslint-disable @nx/enforce-module-boundaries */
import { Component, effect, input, OnInit, output, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayPanel, OverlayPanelModule } from "primeng/overlaypanel";
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { SharedService } from '../../services/shared.service';
import { HttpClient } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { UserDropdownComponent } from "../user-dropdown/user-dropdown.component";
import { RoleDropdownComponent } from "../role-dropdown/role-dropdown.component";
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from "primeng/dialog";
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { TranslateModule } from '@ngx-translate/core';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'lib-new-table-filter',
  imports: [CommonModule, DropdownModule, TranslateModule, InputNumberModule, CalendarModule, InputTextModule, OverlayPanelModule, FormsModule, ReactiveFormsModule, UserDropdownComponent, RoleDropdownComponent, DialogModule],
  templateUrl: './new-table-filter.component.html',
  styleUrl: './new-table-filter.component.scss',
})
export class NewTableFilterComponent implements OnInit {

  constructor(private _MessageService: MessageService, private _SharedService: SharedService, private _HttpClient: HttpClient) {
    effect(() => {
      if (this.show_overlay()?.isShow) {
        this.op.toggle(this.show_overlay().event)
      }
    })


    effect(() => {
      console.log("Triggred clearFilter", this.clearFilter());

      if (this.clearFilter()) {
        this.cancelAllFilters()
      }
    })


    effect(() => {
      if (this.data_viewid() != this.current_dataviewId) {
        console.log("Triggred filter effect", this.data_viewid());

        this.current_dataviewId = this.data_viewid()
        this.getCurrentDataEntityFilters(this.data_viewid());
      }
    })
  }


  @ViewChild('op') op!: OverlayPanel

  update_filter_flag: boolean = false;

  filter_form!: FormGroup;
  filter_profiles: any[] = []


  show_overlay = input.required<{ isShow: boolean, event: PointerEvent }>()
  data_viewid = input.required<number>()
  clearFilter = input<boolean>(false)
  clearFilterState = signal<boolean>(false)
  ngOnInit(): void {
    this.current_dataviewId = this.data_viewid()
    this.initFilterForm();
    console.log("Triggred filter init", this.data_viewid());
    this.getCurrentDataEntityFilters(this.data_viewid());
  }

  current_dataviewId: any;
  current_data_filter_entity: any[] = []



  filter_visibsle = output<boolean>();


  getCurrentDataEntityFilters(id: number) {
    this._SharedService.getFiltersByDataEntity(id).subscribe((res: any) => {
      this.current_data_filter_entity = res?.filters;
      if (!this.current_data_filter_entity.length) {
        this.filter_visibsle.emit(false)
      } else {
        this.filter_visibsle.emit(true)
      }
      this.filter_profiles = res?.profiles || [];
      this.selected_profile_filter = this.filter_profiles.filter((prof: any) => prof?.profileId == res?.defaultProfileID)[0] || null
      this.handledselectedFilterProfile()
      if (this.filterForm.value) {

        this.filter_emitter.emit({ filter_count: this.filter_count, filters: this.handleFilter(this.filterForm.value) })
      } else {
        this.filter_emitter.emit({ filter_count: this.filter_count, filters: [] })
      }

    })
  }


  handleFilter(event: any[]) {
    const buildFilterPayload = (filter: any) => {
      const base: any = {
        filterID: filter?.filter_type?.filterId,
        filterCode: filter?.filter_type?.fieldName,
        operatorId: filter?.operator?.DataEntityTypeOperatorID,
        operatorCode: filter?.operator?.OperatorCode,
        firstValue: null,
        secondValue: null,
        dateOptionID: null,
      };

      if (filter?.filter_type?.filterType === 'Date') {
        console.log("Filter Date Catched" , filter);

        const dateOptionID = String(filter?.firstValue);
        base.dateOptionID = dateOptionID;

        // Custom date or range (18, 19)
        if (filter?.firstValue == 18 || filter?.firstValue == 19) {
          const value = filter?.secondValue;

          base.firstValue = Array.isArray(value)
            ? moment(new Date(value[0])).format('MM-DD-YYYY')
            : moment(new Date(value)).format('MM-DD-YYYY');

          base.secondValue = Array.isArray(value)
            ? moment(new Date(value[1])).format('MM-DD-YYYY')
            : null;
        }else if (filter?.firstValue == 20 || filter?.firstValue == 21 || filter?.firstValue == 22){
          console.log("Filter Date Catched" , filter);
          base.firstValue = String(filter.secondValue)
        }
      } else {
        // Non-date filters
        base.firstValue = String(filter?.firstValue ?? '');
      }

      return base;
    };

    return (event || []).map(buildFilterPayload);
  }


  initFilterForm() {
    this.filter_form = new FormGroup({
      filters: new FormArray([
        new FormGroup({
          filter_type: new FormControl(null, [Validators.required]),
        })
      ])
    })




    this.filterForm.valueChanges.subscribe((res) => {
      console.log("filter count", this.filterForm.length);
      this.filter_count = this.filterForm.length
    })

  }



  filter_count = 0

  current_operator_map = new Map()
  all_operators = [
    {
      "DataEntityTypeFilterTypeID": 1,
      "FilterTypeName": "Text",
      "DataEntityTypeOperatorID": 1,
      "OperatorCode": "StartWith",
      "OperatorName": "Start With",
      "OperatorNameAr": "Start With"
    },
    {
      "DataEntityTypeFilterTypeID": 1,
      "FilterTypeName": "Text",
      "DataEntityTypeOperatorID": 2,
      "OperatorCode": "Contain",
      "OperatorName": "Contain",
      "OperatorNameAr": "Contain"
    },
    {
      "DataEntityTypeFilterTypeID": 2,
      "FilterTypeName": "Date",
      "DataEntityTypeOperatorID": 3,
      "OperatorCode": "Before",
      "OperatorName": "Before",
      "OperatorNameAr": "Before"
    },
    {
      "DataEntityTypeFilterTypeID": 2,
      "FilterTypeName": "Date",
      "DataEntityTypeOperatorID": 4,
      "OperatorCode": "After",
      "OperatorName": "After",
      "OperatorNameAr": "After"
    },
    {
      "DataEntityTypeFilterTypeID": 2,
      "FilterTypeName": "Date",
      "DataEntityTypeOperatorID": 5,
      "OperatorCode": "During",
      "OperatorName": "During",
      "OperatorNameAr": "During"
    },
    {
      "DataEntityTypeFilterTypeID": 3,
      "FilterTypeName": "List",
      "DataEntityTypeOperatorID": 6,
      "OperatorCode": "In",
      "OperatorName": "In",
      "OperatorNameAr": "IN"
    },
    {
      "DataEntityTypeFilterTypeID": 3,
      "FilterTypeName": "List",
      "DataEntityTypeOperatorID": 7,
      "OperatorCode": "NotIn",
      "OperatorName": "Not In",
      "OperatorNameAr": "Not In"
    },
    {
      "DataEntityTypeFilterTypeID": 4,
      "FilterTypeName": "User",
      "DataEntityTypeOperatorID": 8,
      "OperatorCode": "In",
      "OperatorName": "In",
      "OperatorNameAr": "IN"
    },
    {
      "DataEntityTypeFilterTypeID": 4,
      "FilterTypeName": "User",
      "DataEntityTypeOperatorID": 9,
      "OperatorCode": "NotIn",
      "OperatorName": "Not In",
      "OperatorNameAr": "Not In"
    },
    {
      "DataEntityTypeFilterTypeID": 5,
      "FilterTypeName": "Role",
      "DataEntityTypeOperatorID": 10,
      "OperatorCode": "In",
      "OperatorName": "In",
      "OperatorNameAr": "IN"
    },
    {
      "DataEntityTypeFilterTypeID": 5,
      "FilterTypeName": "Role",
      "DataEntityTypeOperatorID": 11,
      "OperatorCode": "NotIn",
      "OperatorName": "Not In",
      "OperatorNameAr": "Not In"
    },
    {
      "DataEntityTypeFilterTypeID": 6,
      "FilterTypeName": "Integer Number",
      "DataEntityTypeOperatorID": 12,
      "OperatorCode": "Equal",
      "OperatorName": "Equal",
      "OperatorNameAr": "Equal"
    },
    {
      "DataEntityTypeFilterTypeID": 6,
      "FilterTypeName": "Integer Number",
      "DataEntityTypeOperatorID": 13,
      "OperatorCode": "NotEqual",
      "OperatorName": "Not Equal",
      "OperatorNameAr": "Not Equal"
    },
    {
      "DataEntityTypeFilterTypeID": 6,
      "FilterTypeName": "Integer Number",
      "DataEntityTypeOperatorID": 14,
      "OperatorCode": "Larger Than",
      "OperatorName": "Larger Than",
      "OperatorNameAr": "LargerThan"
    },
    {
      "DataEntityTypeFilterTypeID": 6,
      "FilterTypeName": "Integer Number",
      "DataEntityTypeOperatorID": 15,
      "OperatorCode": "Less Than",
      "OperatorName": "Less Than",
      "OperatorNameAr": "LessThan"
    },
    {
      "DataEntityTypeFilterTypeID": 7,
      "FilterTypeName": "Decimal Number",
      "DataEntityTypeOperatorID": 16,
      "OperatorCode": "IS",
      "OperatorName": "IS",
      "OperatorNameAr": "IS"
    }
  ]

  date_filters = [
    { "DataEntityTypeFilterDateOptionID": 1, "Code": "TODAY", "Name": "اليوم", "NameEn": "Today" },
    { "DataEntityTypeFilterDateOptionID": 2, "Code": "YESTERDAY", "Name": "الأمس", "NameEn": "Yesterday" },
    { "DataEntityTypeFilterDateOptionID": 3, "Code": "TOMORROW", "Name": "غدًا", "NameEn": "Tomorrow" },
    { "DataEntityTypeFilterDateOptionID": 4, "Code": "NEXT_7_DAYS", "Name": "الأيام الـ 7 القادمة", "NameEn": "Next 7 Days" },
    { "DataEntityTypeFilterDateOptionID": 5, "Code": "LAST_7_DAYS", "Name": "آخر 7 أيام", "NameEn": "Last 7 Days" },
    { "DataEntityTypeFilterDateOptionID": 6, "Code": "THIS_WEEK", "Name": "هذا الأسبوع", "NameEn": "This Week" },
    { "DataEntityTypeFilterDateOptionID": 7, "Code": "NEXT_WEEK", "Name": "الأسبوع القادم", "NameEn": "Next Week" },
    { "DataEntityTypeFilterDateOptionID": 8, "Code": "LAST_WEEK", "Name": "الأسبوع الماضي", "NameEn": "Last Week" },
    { "DataEntityTypeFilterDateOptionID": 9, "Code": "THIS_MONTH", "Name": "هذا الشهر", "NameEn": "This Month" },
    { "DataEntityTypeFilterDateOptionID": 10, "Code": "NEXT_MONTH", "Name": "الشهر القادم", "NameEn": "Next Month" },
    { "DataEntityTypeFilterDateOptionID": 11, "Code": "LAST_MONTH", "Name": "الشهر الماضي", "NameEn": "Last Month" },
    { "DataEntityTypeFilterDateOptionID": 12, "Code": "THIS_QUARTER", "Name": "الربع الحالي", "NameEn": "This Quarter" },
    { "DataEntityTypeFilterDateOptionID": 13, "Code": "NEXT_QUARTER", "Name": "الربع القادم", "NameEn": "Next Quarter" },
    { "DataEntityTypeFilterDateOptionID": 14, "Code": "LAST_QUARTER", "Name": "الربع السابق", "NameEn": "Last Quarter" },
    { "DataEntityTypeFilterDateOptionID": 15, "Code": "THIS_YEAR", "Name": "السنة الحالية", "NameEn": "This Year" },
    { "DataEntityTypeFilterDateOptionID": 16, "Code": "NEXT_YEAR", "Name": "السنة القادمة", "NameEn": "Next Year" },
    { "DataEntityTypeFilterDateOptionID": 17, "Code": "LAST_YEAR", "Name": "السنة الماضية", "NameEn": "Last Year" },
    { "DataEntityTypeFilterDateOptionID": 18, "Code": "PERIOD", "Name": "الفترة", "NameEn": "PERIOR" },
    { "DataEntityTypeFilterDateOptionID": 19, "Code": "DATE", "Name": "التاريخ", "NameEn": "Date" },
    { "DataEntityTypeFilterDateOptionID": 20, "Code": "BusinessDay", "Name": "ايام عمل ", "NameEn": "Business Day" },
    { "DataEntityTypeFilterDateOptionID": 21, "Code": "Day", "Name": "ايام  ", "NameEn": " Day" },
    { "DataEntityTypeFilterDateOptionID": 22, "Code": "Hour", "Name": "عدد ساعات", "NameEn": "Hours" },
  ]

  filters_list_map = new Map()

  handleSelectFilter(index: number, event: any) {

    const filterGroup = this.filterForm.at(index) as FormGroup;

    if (!filterGroup.contains('operator')) {
      filterGroup.addControl('operator', new FormControl(null, [Validators.required]));
    }
    if (!filterGroup.contains('firstValue')) {
      filterGroup.addControl('firstValue', new FormControl(null, Validators.required));
    } else {
      filterGroup.get('firstValue')?.setValue(null)
    }
    if (!filterGroup.contains('secondValue')) {
      filterGroup.addControl('secondValue', new FormControl(null));
    } else {
      filterGroup.get('secondValue')?.setValue(null)
    }


    const type = event?.value?.filterType

    const current_operator = this.all_operators.filter((op) => op.FilterTypeName.toLocaleLowerCase() == type.toLocaleLowerCase())

    this.current_operator_map.set(index, current_operator)
    filterGroup.get('operator')?.setValue(current_operator[0])
    filterGroup.updateValueAndValidity()
    switch (type) {
      case 'List':
        this.handleDynamicCallingAPIForFilter(event.value, index)
        break;

      case 'Date':
        this.filters_list_map.set(index, this.date_filters)
        break;
      case 'User':
        this._SharedService.getUserLookupData().subscribe((res: any) => {
          this.filters_list_map.set(index, res?.data)
        })
        break;
      case 'Role':
        this._SharedService.getRoleLookupData().subscribe((res: any) => {
          this.filters_list_map.set(index, res)
        })
        break;
      default:
        break;
    }

  }


  selected_profile_filter: any;

  handledselectedFilterProfile() {
    this.initFilterForm()
    this.filterForm.clear()
    const form = this.selected_profile_filter?.filters?.map((filter: any) => {
      return {
        filter_type: this.current_data_filter_entity.filter((fil: any) => { return fil?.filterId == filter?.filterID })[0],
        firstValue: filter?.firstValue,
        operator: this.all_operators.filter((op: any) => { return op?.DataEntityTypeOperatorID == filter?.operatorId })[0],
        secondValue: filter?.secondValue,
        dateOptionID: filter?.dateOptionID
      }
    })

    form?.map((field: any, index: any) => {

      this.current_operator_map.set(index, this.all_operators.filter((op) => op.FilterTypeName.toLocaleLowerCase() == field?.filter_type?.filterType?.toLocaleLowerCase()))

      if (field?.filter_type?.filterType == 'List') {
        this._HttpClient.post(enviroment.DOMAIN_URI + 'api/Lookup/multiWithoutResponse', [Number(field?.filter_type?.lookupSourceID)]).subscribe((res: any) => {
          this.filters_list_map.set(index, res[0])
        })
      }

      if (field?.filter_type?.filterType == 'Date') {
        this.filters_list_map.set(index, this.date_filters)
      }

      if (field?.filter_type?.filterType == 'User') {
        this._SharedService.getUserLookupData().subscribe((res: any) => {
          this.filters_list_map.set(index, res?.data)
        })
      }
      if (field?.filter_type?.filterType == 'Role') {
        this._SharedService.getRoleLookupData().subscribe((res: any) => {
          this.filters_list_map.set(index, res)
        })
      }


      const firstValue = () => {
        if (field?.filter_type?.filterType == 'List') {
          return +field?.firstValue
        } else if (field?.filter_type?.filterType == 'Date') {
          return field?.dateOptionID
        } else if (field?.filter_type?.filterType == 'User') {
          return +field?.firstValue
        } else if (field?.filter_type?.filterType == 'Role') {
          return +field?.firstValue
        }
        else {
          return field?.firstValue
        }
      }


      const secondValue = () => {
        if (field?.filter_type?.filterType == 'Date') {
          if (field?.dateOptionID == 19) {
            return new Date(field?.firstValue)
          } else if (field?.dateOptionID == 18) {
            return [new Date(field?.firstValue), new Date(field?.secondValue)]
          }
           else if (field?.dateOptionID == 20 || field?.dateOptionID == 21 || field?.dateOptionID == 22) {
            return String(field?.secondValue)
          }

        } else {
          return null
        }
      }
      const formP = new FormGroup({
        filter_type: new FormControl(field?.filter_type, [Validators.required]),
        operator: new FormControl(field?.operator, [Validators.required]),
        firstValue: new FormControl(firstValue(), [Validators.required]),
        secondValue: new FormControl(secondValue())
      })

      this.filterForm.push(formP)
    })


    if (this.selected_profile_filter) {
      this._SharedService.updateDefultProfile(this.filter_id, this.selected_profile_filter?.profileId).subscribe({
        next: (res: any) => {
          console.log("res update defult", res);

        }
      })
    }

  }
  filter_id: number = 0

  handleDynamicCallingAPIForFilter(filter: any, i: any) {
    this._HttpClient.post(enviroment.DOMAIN_URI + 'api/Lookup/multiWithoutResponse', [Number(filter?.lookupSourceID)]).subscribe((res: any) => {
      this.filters_list_map.set(i, res[0])
    })

  }



  get filterForm(): FormArray {
    return this.filter_form.get('filters') as FormArray
  }


  addNewFilter() {
    if (this.filterForm.invalid) {
      return
    }
    this.filterForm.push(new FormGroup({
      filter_type: new FormControl(null, [Validators.required]),
    }))
  }

  removeFromArray(index: number) {
    this.filterForm.removeAt(index);

    const newOperatorMap = new Map();
    const newFiltersListMap = new Map();

    this.filterForm.controls.forEach((_, i) => {
      if (this.current_operator_map.has(i >= index ? i + 1 : i)) {
        newOperatorMap.set(i, this.current_operator_map.get(i >= index ? i + 1 : i));
      }
      if (this.filters_list_map.has(i >= index ? i + 1 : i)) {
        newFiltersListMap.set(i, this.filters_list_map.get(i >= index ? i + 1 : i));
      }
    });

    this.current_operator_map = newOperatorMap;
    this.filters_list_map = newFiltersListMap;
  }


  filter_emitter = output<any>()

  handleApplyFilter(op: any) {
    op?.toggle(0)

    if (this.filter_form.invalid || this.filterForm.controls.length) {

      this.filter_emitter.emit({ filter_count: this.filter_count, filters: this.handleFilter(this.filterForm.value) })
    }
  }

  showProfileNameFilter: boolean = false;

  profile_name_filter: string = ''

  handleApplySaveFilter(op: any) {
    this.update_filter_flag = false;
    this.showProfileNameFilter = true;
    op?.toggle(0)
  }




  handleApplyUpdateFilter(op: any) {
    this.profile_name_filter = this.selected_profile_filter?.profileName
    this.update_filter_flag = true
    this.showProfileNameFilter = true;
    op?.toggle(0)
  }

  load_save_filter: boolean = false;



  handledDeleteFilterProfile() {
    this._SharedService.deleteDefultProfile(this.filter_id, this.selected_profile_filter?.profileId).subscribe({
      next: (res) => {
        this.selected_profile_filter = null;
        this.getCurrentDataEntityFilters(this.data_viewid())
        this.initFilterForm()
        this.filterForm.clear()
        this.filter_emitter.emit({ filter_count: this.filter_count, filters: [] })
      }
    })
  }



  handleSaveProfileFilter() {
    this.load_save_filter = true;
    const req = {
      "profileID": this.selected_profile_filter?.profileId,
      dataViewID: this.data_viewid(),
      profileName: this.profile_name_filter,
      filters: this.filterForm.value?.map((filter: any) => {
        if (filter?.filter_type?.filterType == 'Date') {
          if(filter?.firstValue == 18 && filter?.firstValue == 19){
            const secod = filter?.secondValue

            return {
              "filterID": filter?.filter_type?.filterId,
              "filterCode": filter?.filter_type?.fieldName,
              "operatorId": filter?.operator?.DataEntityTypeOperatorID,
              "operatorCode": filter?.operator?.OperatorCode,
              "firstValue": Array.isArray(secod) ? moment(new Date(secod[0])).format('MM-DD-YYYY') : moment(new Date(secod)).format('MM-DD-YYYY'),
              "secondValue": Array.isArray(secod) ? moment(new Date(secod[1])).format('MM-DD-YYYY') : null,
              "dateOptionID": String(filter?.firstValue)
            }
          }else if(filter?.firstValue == 20 ||filter?.firstValue == 21 || filter?.firstValue == 22){
            console.log("filter custom" , filter);

              return {
              "filterID": filter?.filter_type?.filterId,
              "filterCode": filter?.filter_type?.fieldName,
              "operatorId": filter?.operator?.DataEntityTypeOperatorID,
              "operatorCode": filter?.operator?.OperatorCode,
              "firstValue": String(filter?.secondValue) ,
              "secondValue": null,
              "dateOptionID": String(filter?.firstValue)
            }
          }else{
              return {
              "filterID": filter?.filter_type?.filterId,
              "filterCode": filter?.filter_type?.fieldName,
              "operatorId": filter?.operator?.DataEntityTypeOperatorID,
              "operatorCode": filter?.operator?.OperatorCode,
              "firstValue": null,
              "secondValue": null,
              "dateOptionID": String(filter?.firstValue)
            }
          }
        } else {
          return {
            "filterID": filter?.filter_type?.filterId,
            "filterCode": filter?.filter_type?.fieldName,
            "operatorId": filter?.operator?.DataEntityTypeOperatorID,
            "operatorCode": filter?.operator?.OperatorCode,
            "firstValue": String(filter?.firstValue),
            "secondValue": null,
            "dateOptionID": null
          }
        }
      })
    }


    if (this.update_filter_flag) {
      this._SharedService.updateFilterProfile(req, this.data_viewid(), this.selected_profile_filter?.profileId).subscribe({
        next: (res: any) => {
          this.load_save_filter = false;
          this.showProfileNameFilter = false
          this._MessageService.add({ severity: 'success', summary: 'filter profile Updated successfully' })
          this.getCurrentDataEntityFilters(this.data_viewid())
          this.filter_emitter.emit({ filter_count: this.filter_count, filters: this.handleFilter(this.filterForm.value) })

        },
        error: (err) => {
          this.load_save_filter = false;
        }
      })
    } else {
      this._SharedService.saveFilterProfile(req, this.data_viewid()).subscribe({
        next: (res: any) => {
          this._SharedService.updateDefultProfile(this.data_viewid(), res?.profileId).subscribe((res) => {
            this.load_save_filter = false;
            this.showProfileNameFilter = false
            this._MessageService.add({ severity: 'success', summary: 'filter profile saved successfully' })
            this.getCurrentDataEntityFilters(this.data_viewid())
            this.filter_emitter.emit({ filter_count: this.filter_count, filters: this.handleFilter(this.filterForm.value) })

          })
        },
        error: (err) => {
          this.load_save_filter = false;
        }
      })
    }
  }

  cancelAllFilters(op: any = null) {
    if (op) {
      op?.toggle(0);
    }
    this.selected_profile_filter = null;
    this.filter_count = 0
    this.filter_emitter.emit({ filter_count: this.filter_count, filters: [] });
    this.initFilterForm();
    this.clearFilterState.set(false);
          this._SharedService.updateDefultProfile(this.filter_id, null).subscribe({
        next: (res: any) => {
          console.log("res update defult", res);
        }
      })
  }
}
