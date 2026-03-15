/* eslint-disable @nx/enforce-module-boundaries */

import { TranslationsService } from './../../../../../../apps/gfw-portal/src/app/core/services/translate.service';
import { PrimengModule } from '@gfw/primeng';
import { Component, input, OnChanges, OnDestroy, OnInit, output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { PaginationComponent } from "../pagination/pagination.component";
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { newProfile } from '../../models/newProfiles';
import { EmptyStateComponent } from "../empty-state/empty-state.component";
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { UserDropdownComponent } from "../user-dropdown/user-dropdown.component";
import * as moment from 'moment';
import { RoleDropdownComponent } from "../role-dropdown/role-dropdown.component";
import { Observable } from 'rxjs';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'lib-shared-ui',
  imports: [
    CommonModule,
    PrimengModule,
    FormsModule,
    PaginationComponent,
    DragDropModule,
    CdkDropList,
    CdkDrag,
    ScrollingModule,
    EmptyStateComponent,
    ReactiveFormsModule,
    CalendarModule,
    UserDropdownComponent,
    RoleDropdownComponent,
    RadioButtonModule,
    TranslateModule
  ],
  templateUrl: './shared-ui.component.html',
  styleUrl: './shared-ui.component.css',
})
export class SharedUiComponent implements OnChanges, OnInit , OnDestroy {

     ngOnDestroy(): void {
     this._SharedService.paginationSubject.next({
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1
  }
)



console.log("Component Destroied ");

   }

  isActionShow = input<boolean>()

  isShownAction: boolean = true


  getShownGolumns(): number {
    const shownColumns = this.columns?.filter((col) => col?.isShown)

    return shownColumns?.length
  }

  selected_emiter_checkbox_item = output<any>()


  showPagination = input<boolean>(true)
  isCheckbox = input<boolean>()
  isSingleSelect = input<boolean>()
  selectedItem: any[] = []
  defultProfileDeep: newProfile = {} as newProfile

  // Input properties;
  selected_items = input<any[]>()
  entityID_Name = input<string>();
  view_entityRouter = input<string>();
  dataList = input.required();
  dataViewId = input<number>();
  profilesList = input.required<newProfile[]>();
  loadingState = input.required<boolean>();
  table_name = input.required<string>();
  action_items = input<any[]>()
  selected_profile_column = input<number>()
  defultprofile = input<newProfile>()
  badge_name = input.required<string>();
  total_items_input = input.required<number>();
  filter_id_input = input<number>();
  filter_id: number = 0;
  total_items: number = 0
  loading: boolean = false
  is_ar: boolean = false
  constructor(private _MessageService: MessageService, private _HttpClient: HttpClient, private _Router: Router, private _TranslationsService: TranslationsService, private _SharedService: SharedService) {
    // this._SharedService.paginationSubject.next(this.pageginationObj);
    this._TranslationsService.selected_lan_sub.subscribe((res: string) => {
      if (res == 'ar') {
        this.is_ar = true;
      } else {
        this.is_ar = false
      }
    })

  }


  // Emit selected items to parent
  selected_emiter_checkbox = output<any[]>()
  private _prevSelected: any[] = [];

  private getItemId(item: any): any {
    if (item == null) return null;
    let idKey: any;
    try {
      idKey = typeof (this as any).entityID_Name === 'function' ? (this as any).entityID_Name() : (this as any).entityID_Name;
    } catch {
      idKey = (this as any).entityID_Name;
    }
    if (idKey && item[idKey] !== undefined && item[idKey] !== null) {
      return item[idKey];
    }
    for (const k of ['id', 'Id', 'ID']) {
      if (item[k] !== undefined && item[k] !== null) return item[k];
    }
    return item;
  }

  onSelectionChange(selection: any) {
    const newSelection: any[] = Array.isArray(selection) ? selection : [];
    const prevSelection: any[] =
      Array.isArray(this._prevSelected) && this._prevSelected.length
        ? this._prevSelected
        : (Array.isArray(this.selectedItem) && this.selectedItem.length ? this.selectedItem : []);

    if (!prevSelection.length) {
      this.selectedItem = newSelection;
      this._prevSelected = Array.isArray(this.selectedItem) ? [...this.selectedItem] : [];
      this.selected_emiter_checkbox.emit(this.selectedItem);

      // Emit item-specific event for first selection
      if (newSelection.length === 1) {
        this.selected_emiter_checkbox_item.emit({ action: 'checked', item: newSelection[0] });
      } else if (newSelection.length > 1) {
        this.selected_emiter_checkbox_item.emit({ action: 'checked', item: newSelection[0] });
      }

      return;
    }

    const newMap = new Map<any, any>();
    newSelection.forEach(it => newMap.set(this.getItemId(it), it));
    const prevMap = new Map<any, any>();
    prevSelection.forEach(it => prevMap.set(this.getItemId(it), it));

    const newIds = Array.from(newMap.keys()).filter(id => id !== null && id !== undefined);
    const prevIds = Array.from(prevMap.keys()).filter(id => id !== null && id !== undefined);

    const addedIds = newIds.filter(id => !prevMap.has(id));
    const removedIds = prevIds.filter(id => !newMap.has(id));

    // update internal selection and emit full list
    this.selectedItem = newSelection;
    this.selected_emiter_checkbox.emit(this.selectedItem);

    // precise delta detection

     if (addedIds.length === 1 && removedIds.length === 0) {
      // single check
      const addedItem = newMap.get(addedIds[0]);
      this.selected_emiter_checkbox_item.emit({ action: 'checked', item: addedItem });
    } else if (removedIds.length === 1 && addedIds.length === 0) {
      // single uncheck
      const removedItem = prevMap.get(removedIds[0]);
      this.selected_emiter_checkbox_item.emit({ action: 'unchecked', item: removedItem });
    } else if (addedIds.length > 0 && removedIds.length === 0) {
      // multiple additions
      this.selected_emiter_checkbox_item.emit({ action: 'checked', item: newMap.get(addedIds[0]) });
    } else if (removedIds.length > 0 && addedIds.length === 0) {
      // multiple removals
      this.selected_emiter_checkbox_item.emit({ action: 'unchecked', item: prevMap.get(removedIds[0]) });
    } else if (addedIds.length > 0 && removedIds.length > 0) {
      // ambiguous replace-like change: prefer 'unchecked' when removals >= additions
      if (removedIds.length >= addedIds.length) {
        this.selected_emiter_checkbox_item.emit({ action: 'unchecked', item: prevMap.get(removedIds[0]) });
      } else {
        this.selected_emiter_checkbox_item.emit({ action: 'checked', item: newMap.get(addedIds[0]) });
      }
    } else {
      const addedRef = newSelection.find(s => !prevSelection.includes(s));
      const removedRef = prevSelection.find(p => !newSelection.includes(p));
      if (addedRef && !removedRef) {
        this.selected_emiter_checkbox_item.emit({ action: 'checked', item: addedRef });
      } else if (removedRef && !addedRef) {
        this.selected_emiter_checkbox_item.emit({ action: 'unchecked', item: removedRef });
      }
    }

    this._prevSelected = Array.isArray(this.selectedItem) ? [...this.selectedItem] : [];
  }

  handleSortEmiter() {
    console.log("Selected sort", this.selected_sort);

    if (this.selected_sort) {
      this.sortEmiter.emit({ direction: this.selected_sort_direction, field: this.selected_sort })
    }
  }

  selected_sort_direction: number = 1

  selected_sort: any = null;

  sortEmiter = output<any>()


  selected_emiter = output<any>()


  badge_title: string = ''

  table_title: string = ''

  dataFilter: any[] = [
    {
      id: 1,
      filter_name: "status",
      operators: [
        {
          id: 1,
          name: 'is not'
        },
        {
          id: 2,
          name: 'is'
        }
      ],
      sections: [
        {
          id: 1,
          name: 'Active'
        },
        {
          id: 2,
          name: 'inActive'
        }
      ]
    },
  ]


  paginationEvent = output();
  handleChangePage(event: any) {
    this.paginationEvent.emit(event)
  }

  ColumnsFilter: any[] = []
  private ColumnsFilterTemp: any[] = []





  handleSelectedColumnProfile(event: any) {
    console.log("event selec6ted ", event.value);
    this.columns = event.value.columns
    if (event?.value?.profileId == 0) {
      this.edit_column_flag = false
    } else {
      this.edit_column_flag = true;
    }


    this.profiles[0] = JSON.parse(JSON.stringify(this.defultProfileDeep ?? {} as newProfile))
  }



  edit_column_flag: boolean = false
  handledToggleStatusColumnProfile() {
    if (this.edit_column_flag) {
      this.profile_name = this.selectedProfile?.profileName
    } else {
      this.profile_name = ''
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.data = []



    if (changes['selected_items']?.currentValue) {
      const incoming = changes['selected_items']?.currentValue;
      if (Array.isArray(incoming) && incoming.length && this.data && this.data.length) {
        const isIdArray = typeof incoming[0] !== 'object';
        this.selectedItem = isIdArray
          ? this.data.filter((d: any) => {
            const entityIdName = this.entityID_Name();
            return entityIdName ? incoming.includes(d[entityIdName]) : false;
          })
          : incoming;
      } else {
        this.selectedItem = incoming ?? [];
      }
      this._prevSelected = Array.isArray(this.selectedItem) ? [...this.selectedItem] : [];
    }
    if (changes['isActionShow']?.currentValue !== null && changes['isActionShow']?.currentValue !== undefined) {
      console.log("isActionShow", changes['isActionShow']?.currentValue);

      this.isShownAction = changes['isActionShow']?.currentValue
    }
    if (changes['profilesList']?.currentValue) {
      this.profiles = [this.defultprofile(), ...changes['profilesList'].currentValue]
      this.defultProfileDeep = JSON.parse(JSON.stringify(this.defultprofile() ?? {} as newProfile))
      const isSelected = this.profiles.find((prof: any) => prof?.profileId == this.selected_profile_column())

      if (isSelected && isSelected?.profileId != 0) {
        this.selectedProfile = isSelected
        this.columns = this.selectedProfile?.columns
        this.edit_column_flag = true
      } else {
        this.selectedProfile = this.profiles[0]
        this.columns = this.selectedProfile?.columns;
        console.log("columns defult", this.columns);

        this.edit_column_flag = false
      }

      this.ColumnsFilter = this.selectedProfile?.columns?.filter((col: any) => col?.isSortable).map((col: any) => { return { ...col, isChecked: false } })
      this.ColumnsFilterTemp = this.selectedProfile?.columns?.filter((col: any) => col?.isSortable).map((col: any) => { return { ...col, isChecked: false } })

    }



    if (changes['badge_name']?.currentValue) {
      this.badge_title = changes['badge_name']?.currentValue
    }
    if (changes['filter_id_input']?.currentValue) {
      this.filter_id = changes['filter_id_input']?.currentValue
      this.getCurrentDataEntityFilters(this.filter_id);
    }
    if (changes['total_items_input']?.currentValue != null) {
      this.total_items = changes['total_items_input']?.currentValue
    }
    if (changes['badge_name']?.currentValue) {
      this.badge_title = changes['badge_name']?.currentValue
    }
    if (changes['table_name']?.currentValue) {
      this.table_title = changes['table_name']?.currentValue
    }
    if (changes['action_items']?.currentValue) {
      this.items[0].items = changes['action_items']?.currentValue
    }
    if (changes['loadingState']) {
      this.loading = changes['loadingState'].currentValue
    }

    if (changes['dataList']?.currentValue) {
      this.data = changes['dataList']?.currentValue ?? [];
      if (Array.isArray(this._prevSelected) && this._prevSelected.length) {
        const idKey = this.entityID_Name ? this.entityID_Name() : undefined;
        if (idKey) {
          this._prevSelected = this._prevSelected
            .map(p => this.data.find((d: any) => d[idKey] === p[idKey]))
            .filter(Boolean);
        } else {
          this._prevSelected = this._prevSelected.filter(p => this.data.includes(p));
        }
      }
    }


  }

  ngOnInit(): void {
    this.initFilterForm()
  }


  current_data_filter_entity: any[] = []

  getCurrentDataEntityFilters(id: number) {
    this._SharedService.getFiltersByDataEntity(id).subscribe((res: any) => {
      this.current_data_filter_entity = res?.filters;
      this.filter_profiles = res?.profiles || [];
      this.selected_profile_filter = this.filter_profiles.filter((prof: any) => prof?.profileId == res?.defaultProfileID)[0] || null
      this.handledselectedFilterProfile()
      if (this.filterForm.value) {

        this.filter_emitter.emit(this.filterForm.value)
      } else {
        this.filter_emitter.emit([])
      }

    })
  }


  getValueProperty(type: string, col: any): string {
    return col?.dataMap?.filter((ele: { key: string, value: string }) => {
      return ele.key == type
    })[0]?.value;

  }

  visible: boolean = false


  data: any[] = []


  columns: any[] = [];




  showProfileName: boolean = false

  profiles: any[] = [
  ]


  selectedProfile!: newProfile;




  filter_form!: FormGroup;

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
    { "DataEntityTypeFilterDateOptionID": 19, "Code": "DATE", "Name": "التاريخ", "NameEn": "Date" }
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


  filter_emitter = output<any[]>()

  handleApplyFilter(op: any) {
    op?.toggle(0)

    if (this.filter_form.invalid || this.filterForm.controls.length) {

      this.filter_emitter.emit(this.filterForm.value)
    }
  }

  showProfileNameFilter: boolean = false;

  profile_name_filter: string = ''

  handleApplySaveFilter(op: any) {
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

  update_filter_flag: boolean = false;
  handleSaveProfileFilter() {
    this.load_save_filter = true;
    const req = {
      "profileID": this.selected_profile_filter?.profileId,
      dataViewID: this.filter_id,
      profileName: this.profile_name_filter,
      filters: this.filterForm.value?.map((filter: any) => {
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
    }


    if (this.update_filter_flag) {
      this._SharedService.updateFilterProfile(req, this.filter_id, this.selected_profile_filter?.profileId).subscribe({
        next: (res: any) => {
          this.load_save_filter = false;
          this.showProfileNameFilter = false
          this._MessageService.add({ severity: 'success', summary: 'filter profile Updated successfully' })
          this.getCurrentDataEntityFilters(this.filter_id)
          this.filter_emitter.emit(this.filterForm.value)

        },
        error: (err) => {
          this.load_save_filter = false;
        }
      })
    } else {
      this._SharedService.saveFilterProfile(req, this.filter_id).subscribe({
        next: (res: any) => {
          this._SharedService.updateDefultProfile(this.filter_id, res?.profileId).subscribe((res) => {
            this.load_save_filter = false;
            this.showProfileNameFilter = false
            this._MessageService.add({ severity: 'success', summary: 'filter profile saved successfully' })
            this.getCurrentDataEntityFilters(this.filter_id)
            this.filter_emitter.emit(this.filterForm.value)

          })
        },
        error: (err) => {
          this.load_save_filter = false;
        }
      })
    }
  }


  handledDeleteFilterProfile() {
    this._SharedService.deleteDefultProfile(this.filter_id, this.selected_profile_filter?.profileId).subscribe({
      next: (res) => {
        this.selected_profile_filter = null;
        this.getCurrentDataEntityFilters(this.filter_id)
        this.initFilterForm()
        this.filterForm.clear()
        this.filter_emitter.emit([])
      }
    })
  }

  cancelAllFilters(op: any) {
    op?.toggle(0);
    this.filter_emitter.emit([]);
    this.selected_profile_filter = null;
    this.filter_count = 0
    this.initFilterForm()
  }

  filter_profiles: any[] = []



  handleDeleteColumnProfile() {
    this._SharedService.deleteProfileColumns(this.selectedProfile?.profileId).subscribe((res) => {
      const i = this.profiles.findIndex((prof: any) => prof?.profileId == this.selectedProfile?.profileId)
      this.profiles.splice(i, 1)
      this.selectedProfile = this.profiles[0]
      this.columns = this.selectedProfile.columns
      this.edit_column_flag = false
    })
  }
  handleColumnClick(row: any, i: any) {
    const route = this.view_entityRouter();
    if (route === 'viewModal=true') {
      this.openModal.emit(row);
    }
    else {
      this._Router.navigate([this.view_entityRouter(), row[`${this.entityID_Name()}`]])
    }

  }

  handledRestColumns() {
    this.selectedProfile = this.profiles[0]
    this.columns = this.selectedProfile.columns
    this.edit_column_flag = false
  }

  loadSaveProfileColumn: boolean = false
  handleSaveProfile() {
    this.loadSaveProfileColumn = true
    const req: any = {
      dataViewID: this.dataViewId(),
      profileName: this.profile_name,
      columns: this.selectedProfile.columns.map((col: any) => {
        return {
          "id": col.id,
          "isFixed": col.isFixed,
          "isShown": col.isShown,
          "isSortable": col.isSortable,
          "isResizable": col.isResizable,
          "filed": col.filed
        }
      })
    }

    if (this.edit_column_flag) {
      req.columnProfileID = this.selectedProfile.profileId;
      delete req.dataViewID
    }

    const API_CALL$: Observable<any> = this.edit_column_flag ? this._SharedService.updateProfileColumns(req) : this._SharedService.addNewProfileColumns(req)

    API_CALL$.subscribe((res) => {
      this.profiles[0] = this.defultProfileDeep
      this.selected_emiter.emit(true)
      this.loadSaveProfileColumn = false
      this.showProfileName = false
      this._MessageService.add({ severity: 'success', summary: 'Success', detail: this.edit_column_flag ? 'Column Profile Updated Successfully' : 'Column Profile Added Successfully' })
      const new_profile = {
        profileId: this.edit_column_flag ? Number(this.selectedProfile.profileId) : Number(this.profiles[this.profiles.length - 1].profileId + 14),
        profileName: this.profile_name,
        isDefult: false,
        columns: this.selectedProfile.columns
      }


      if (this.edit_column_flag) {
        const current_index = this.profiles.findIndex((prof: any) => prof.profileId == this.selectedProfile.profileId)

        this.profiles[current_index] = new_profile;
        this.selectedProfile = new_profile
      } else {
        this.profiles.push(new_profile)
        this.selectedProfile = new_profile
        this.edit_column_flag = true
      }
    })


  }

  profile_name: string = ''
  showDeleteEvent = output<boolean>()
  openModal = output<boolean>()
  drop(event: CdkDragDrop<any[]>) {
    const prev = this.columns[event.previousIndex];
    const curr = this.columns[event.currentIndex];

    if (prev.isFixed || curr.isFixed) {
      return;
    }

    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }




  selected_row: any;

  items = [
    {
      items: []
    }
  ];
  showPin: boolean = true;

  handleFixedColumn(col: any) {




    if (col.isFixed) {
      col.isFixed = false;
      col.isResizable = true;
      const fixed = this.columns.filter((c: any) => c.isFixed);
      if (fixed.length < 2) {
        this.showPin = true;
        return;
      }
    } else {

      col.isFixed = true;
      col.isResizable = false;
      const fixed = this.columns.filter((c: any) => c.isFixed);
      if (fixed.length == 2) {
        this.showPin = false;
        return;
      }

    }



  }

  shouldDisableSwitch(col: any): boolean {
    if (col.isFixed) return true;

    const activeCount = this.columns.filter(c => c.isShown && !c.isFixed).length;
    if (col.isShown && activeCount <= 3) {
      return true;
    }

    return false;
  }

  searchTermSort: string = ''

  handleSearchColumnsFilter() {
    this.ColumnsFilter = this.ColumnsFilterTemp?.filter((col: { id: number, label: string }) => {
      return col.label.toLocaleLowerCase().includes(this.searchTermSort.toLocaleLowerCase())
    })
  }


  isAllColumnsChecked: boolean = false;
  handleChangeCheckAllColumns() {
    if (this.isAllColumnsChecked) {
      this.columns.map((col: any) => {
        col.isShown = true
      })
    } else {
      this.columns.map((col: any , i:number) => {
        if(i > 2){

          col.isShown = false
        }else{
          col.isShown = true
        }
      })
    }
  }
}
