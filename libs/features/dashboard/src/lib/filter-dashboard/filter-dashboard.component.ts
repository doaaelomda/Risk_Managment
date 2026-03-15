import { DashboardLayoutService } from './../../services/dashboard-layout.service';
import { Component, input, OnChanges, OnInit, output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { UserDropdownComponent } from 'libs/shared/shared-ui/src/lib/user-dropdown/user-dropdown.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RoleDropdownComponent } from 'libs/shared/shared-ui/src/lib/role-dropdown/role-dropdown.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SharedService } from 'libs/shared/shared-ui/src/services/shared.service';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'lib-filter-dashboard',
  imports: [CommonModule, DialogModule, InputTextModule, CalendarModule, DropdownModule, FormsModule, ReactiveFormsModule, UserDropdownComponent, RoleDropdownComponent],
  templateUrl: './filter-dashboard.component.html',
  styleUrl: './filter-dashboard.component.scss',
})
export class FilterDashboardComponent implements OnInit, OnChanges {

  constructor(private _MessageService: MessageService, private _HttpClient: HttpClient, private _SharedService: SharedService, private _DashboardLayoutService: DashboardLayoutService) {
    this._DashboardLayoutService.filter_visible$.subscribe(res => {
      this.visible = res;
    })

    this.initFilterForm()
  }



  data_viewId = input<any>()
  reportId = input<any>()
  current_filters = input<any[]>()
  filter_profiles: any[] = [];
  selected_profile_filter: any;
  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data_viewId']?.currentValue && changes['reportId']?.currentValue) {
      this.getFiltersWidget(this.data_viewId(), this.reportId())
    }

    if (changes['current_filters']?.currentValue) {
      if (!changes['current_filters']?.currentValue?.length) {
        this.initFilterForm();
        this.selected_profile_filter = null
      }
    }
  }




  getFiltersWidget(data_viewId: any, reportId: any) {
    this._HttpClient.get(enviroment.API_URL + `DataEntity/data-view/${data_viewId}/filters/${reportId}`).subscribe((res: any) => {
      console.log("filter widgets", res);
      this.current_data_filter_entity = res?.filters;
      this.filter_profiles = res?.profiles;
      this.selected_profile_filter = this.filter_profiles?.filter((prof: any) => prof?.profileId == res?.defaultProfileID)[0]
      this.handledselectedFilterProfile();
      if (this.filterForm.value) {
    const filters = this.filterForm.value.map((filter: any) => {
      if (filter?.filter_type?.filterType == 'Date') {
        if (filter?.firstValue != 18 && filter?.firstValue != 19) {
          return {
            "filterID": filter?.filter_type?.filterId,
            "filterCode": filter?.filter_type?.fieldName,
            "operatorId": filter?.operator?.DataEntityTypeOperatorID,
            "operatorCode": filter?.operator?.OperatorCode,
            "firstValue": null,
            "secondValue": null,
            "dateOptionID": String(filter?.firstValue)
          }
        } else {
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



    this.filter_emiter.emit(filters);
      } else {
        this.filter_emiter.emit([])
      }

    })
  }


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

      // field?.filter_type?.filterType == 'List'  ? +field?.firstValue : field?.filter_type?.filterType == 'Date' ? field?.dateOptionID : field?.firstValue

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
      this.updateDefultProfile(this.selected_profile_filter?.profileId)
    }

  }

  closeFilter() {
    this._DashboardLayoutService.filter_visible$.next(false);
  }

  visible: boolean = false

  handleHide() {
    this._DashboardLayoutService.filter_visible$.next(false);
  }

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
        // this.handleDynamicCallingAPIForFilter(event.value, index)
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


  filter_form!: FormGroup;

  initFilterForm() {
    this.filter_form = new FormGroup({
      filters: new FormArray([
        new FormGroup({
          filter_type: new FormControl(null, [Validators.required]),
        })
      ])
    })





  }


  handleUpdateFilterProfile() {
    this.update_filter_flag = true;
    this.showProfileNameFilter = true;
    this.profile_name_filter = this.selected_profile_filter?.profileName
  }
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


  get filterForm(): FormArray {
    return this.filter_form.get('filters') as FormArray
  }

  current_data_filter_entity: any[] = []

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


  addNewFilter() {
    if (this.filterForm.invalid) {
      return
    }
    this.filterForm.push(new FormGroup({
      filter_type: new FormControl(null, [Validators.required]),
    }))
  }

  showProfileNameFilter: boolean = false

  profile_name_filter: any;
  filter_emiter = output<any>()
  update_filter_flag: boolean = false;
  load_save_filter: boolean = false
  handleApplyFilter() {
    const filters = this.filterForm.value.map((filter: any) => {
      if (filter?.filter_type?.filterType == 'Date') {
        if (filter?.firstValue != 18 && filter?.firstValue != 19) {
          return {
            "filterID": filter?.filter_type?.filterId,
            "filterCode": filter?.filter_type?.fieldName,
            "operatorId": filter?.operator?.DataEntityTypeOperatorID,
            "operatorCode": filter?.operator?.OperatorCode,
            "firstValue": null,
            "secondValue": null,
            "dateOptionID": String(filter?.firstValue)
          }
        } else {
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



    this.filter_emiter.emit(filters);
    this.closeFilter()
  }


  handleSaveProfileFilter() {
    this.load_save_filter = true
    const filters = this.filterForm.value.map((filter: any) => {
      if (filter?.filter_type?.filterType == 'Date') {
        if (filter?.firstValue != 18 && filter?.firstValue != 19) {
          return {
            "filterID": filter?.filter_type?.filterId,
            "filterCode": filter?.filter_type?.fieldName,
            "operatorId": filter?.operator?.DataEntityTypeOperatorID,
            "operatorCode": filter?.operator?.OperatorCode,
            "firstValue": null,
            "secondValue": null,
            "dateOptionID": String(filter?.firstValue)
          }
        } else {
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
    if(!this.update_filter_flag){

      this._DashboardLayoutService.saveReportWidgetFilter(this.data_viewId(), this.reportId(), this.profile_name_filter, filters).subscribe({
        next: (res: any) => {
          this._DashboardLayoutService.updateDefultProfile(this.data_viewId() , res?.profileId,this.reportId()).subscribe((res: any) => {
            this._MessageService.add({ severity: "success", summary: "Success", detail: "Widget Filter Saved Successfully " })
            this.getFiltersWidget(this.data_viewId(), this.reportId())
            this.load_save_filter = false
            this.showProfileNameFilter = false;

          })

        }
      })
    }else{

      const  req = {
  "profileID": this.selected_profile_filter?.profileId,
  "dataViewID": this.data_viewId(),
  "profileName": this.profile_name_filter,
  "filters": filters
}
      this._DashboardLayoutService.updateWidgetFilterProfile(this.data_viewId() , this.selected_profile_filter?.profileId,req).subscribe((res:any)=>{
           this._MessageService.add({ severity: "success", summary: "Success", detail: "Widget Filter Updated Successfully " })
            this.getFiltersWidget(this.data_viewId(), this.reportId())
            this.load_save_filter = false
            this.showProfileNameFilter = false;

      })
    }
  }


  handleDeleteFilter(){
    if(this.selected_profile_filter){
      this._DashboardLayoutService.deleteWidgetFilterProfile(this.data_viewId() , this.selected_profile_filter?.profileId).subscribe((res:any)=>{
        this.selected_profile_filter = null;
        this.getFiltersWidget(this.data_viewId() , this.reportId())
        this.initFilterForm()

      })
    }
  }


  updateDefultProfile(data: any) {
    this._DashboardLayoutService.updateDefultProfile(this.data_viewId(),  data , this.reportId()).subscribe((res: any) => {
      // this._MessageService.add({ severity: "success", summary: "Success", detail: "Widget Filter Saved Successfully " })
    })
  }
}
