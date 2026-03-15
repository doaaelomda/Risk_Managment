/* eslint-disable @nx/enforce-module-boundaries */
import { Component, EventEmitter, Input, input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from "primeng/dialog";
import { SharedUiComponent } from '../shared-ui/shared-ui.component';
import { newProfile } from '../../models/newProfiles';
import * as moment from 'moment';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { SharedService } from '../../services/shared.service';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
@Component({
  selector: 'lib-linked-module-selected',
  imports: [CommonModule, DialogModule, TranslateModule, SharedUiComponent, ButtonModule],
  templateUrl: './linkedModule-selected.component.html',
  styleUrl: './linkedModule-selected.component.scss',
})
export class LinkedModuleSelectedComponent implements OnChanges {

  constructor(private _MessageService: MessageService, private _HttpClient: HttpClient, private _SharedService: SharedService) { }

  @Input() current_data_view: any;

  @Input() show_linked = false;
  @Input() checked_selected_items: any[] = [];
  @Output() show_linkedChange = new EventEmitter<boolean>();

  current_entity_id = input();


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['current_data_view'].currentValue) {
      this.loadCloumns(this.current_data_view?.dataViewId)
    }

    // initialize baseline of originally checked ids when parent passes checked_selected_items
    if (changes['checked_selected_items']?.currentValue) {
      const arr = changes['checked_selected_items']?.currentValue ?? [];
      const getIdInit = (it: any) => {
        if (!it) return it;
        const idKey = this.current_data_view?.entityID_Name;
        if (idKey && it[idKey] !== undefined && it[idKey] !== null) return it[idKey];
        for (const k of ['id', 'Id', 'ID']) {
          if (it[k] !== undefined && it[k] !== null) return it[k];
        }
        return it;
      };
      this.initialSelectedIds = new Set(arr.map((i: any) => getIdInit(i)).filter((id: any) => id !== undefined && id !== null));
    }

  }


  handleCheckedChangesEvent(event: any) {
    console.log("event checkbox ", event);
    // this.handleCheckedEventItemChange(event)
  }

  ShowConfirm: boolean = false;

  addedSelectionItems: any[] = []
  removedSelectionItems: any[] = []

  initialSelectedIds: Set<any> = new Set();
  handleCheckedEventItemChange(item: any) {
    console.log("handleCheckedEventItemChange ", item);

    const getId = (it: any) => {
      if (!it) return it;
      const idKey = this.current_data_view?.entityID_Name;
      if (idKey && it[idKey] !== undefined && it[idKey] !== null) return it[idKey];
      for (const k of ['id', 'Id', 'ID']) {
        if (it[k] !== undefined && it[k] !== null) return it[k];
      }
      return it;
    };

    const incoming = item?.item;
    const id = getId(incoming);

    if (id === undefined || id === null) return;

    if (item?.action === 'checked') {
      // cancel pending removal if present
      const remIdx = this.removedSelectionItems.findIndex(r => getId(r) === id);
      if (remIdx > -1) this.removedSelectionItems.splice(remIdx, 1);

      // if originally selected -> ensure no net change (remove from added if exists)
      if (this.initialSelectedIds && this.initialSelectedIds.has(id)) {
        const addIdx = this.addedSelectionItems.findIndex(a => getId(a) === id);
        if (addIdx > -1) this.addedSelectionItems.splice(addIdx, 1);
      } else {
        // new selection -> add if not already present
        const existsInAdded = this.addedSelectionItems.some(a => getId(a) === id);
        if (!existsInAdded) this.addedSelectionItems.push(incoming);
      }
    } else {
      // unchecked
      // if it was newly added in this session -> cancel the add
      const addIdx = this.addedSelectionItems.findIndex(a => getId(a) === id);
      if (addIdx > -1) {
        this.addedSelectionItems.splice(addIdx, 1);
      } else {
        // if it was originally selected -> mark for removal
        if (this.initialSelectedIds && this.initialSelectedIds.has(id)) {
          const existsInRemoved = this.removedSelectionItems.some(r => getId(r) === id);
          if (!existsInRemoved) this.removedSelectionItems.push(incoming);
        }
        // else: not original and not added -> no-op
      }
    }

    // cleanup: ensure no id exists in both lists
    const addedIds = new Set(this.addedSelectionItems.map(a => getId(a)));
    this.removedSelectionItems = this.removedSelectionItems.filter(r => !addedIds.has(getId(r)));

    console.log('addedSelectionItems', this.addedSelectionItems);
    console.log('removedSelectionItems', this.removedSelectionItems);
  }

  sort_data: any;
  dataList: any[] = [];
  currentProfiles: newProfile[] = [];
  defultProfile!: newProfile;
  current_filters: any[] = [];
  selected_profile_column: any;
  loadingTable: boolean = true;
  onModalClose() {
    this.show_linked = false;
    this.show_linkedChange.emit(false);
  }


  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };

  getCurrentData(event?: any) {
    //
    this.dataList = [];
    this.loadingTable = true
    const req:any = {
      search: '',
      dataViewId: 1,
      pageNumber: event?.currentPage ?? 1,
      pageSize: event?.perPage ?? 10,
      filters: this.current_filters,
      sortField: this.sort_data?.field,
      sortDirection: this.sort_data?.direction,
    };

    if(this.current_data_view?.riskMethodologyID){
      req['riskMethodologyID'] = this.current_data_view?.riskMethodologyID
    }
    this._HttpClient.post(enviroment.DOMAIN_URI + this.current_data_view?.allEntityDataSourceAPI?.substring(1), req).subscribe((res: any) => {
      this.dataList = res?.data?.items;
      this.pageginationObj = {
        perPage: res?.data?.pageSize,
        currentPage: res?.data?.pageNumber,
        totalItems: res?.data?.totalCount,
        totalPages: res?.data?.totalPages,
      };
      this._SharedService.paginationSubject.next(this.pageginationObj);
      this.loadingTable = false;
    })

  }

  handleSort(event: any) {
    this.sort_data = event;
  }

  handleFilter(event: any[]) {
    const filters = event.map((filter: any) => {
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
    this.current_filters = filters;
    this.getCurrentData()
  }

  loadCloumns(dataViewId: any) {
    this._SharedService.getDataEntityColumns(dataViewId).subscribe((res: any) => {
      this.defultProfile = {
        profileId: 0,
        profileName: 'Defult Profile',
        isDefult: false,
        columns: res?.data?.columnDefinitions,
      };

      this.currentProfiles = res?.data?.userColumnProfiles.map(
        (profile: newProfile) => {
          return {
            ...profile,
            columns: profile.columns.map((col: any, i) => {
              return {
                ...col,
                displayName: res?.data?.columnDefinitions?.find(
                  (colD: any) => colD?.id == col?.id
                )?.label,
                dataMap: res?.data?.columnDefinitions?.find(
                  (colD: any) => colD?.id == col?.id
                )?.dataMap,
              };
            }),
          };
        }
      );

      this.selected_profile_column = res?.data?.selectedProfileID;
    });
  }

  loadingBtn: boolean = false;
  submitSaveEffectedItems() {
    this.loadingBtn = true;
    console.log("data virw ", this.current_data_view);
    let req:any;
    if(this.current_data_view?.riskMethodologyID){
      req ={
        dto:{
          riskMethodologyFormulaID:this.current_data_view?.formulaId,
          addLinkedIds: this.addedSelectionItems.map((item: any) => item[this.current_data_view?.entityID_Name]),
          removeLinkedIds: this.removedSelectionItems.map((item: any) => item[this.current_data_view?.entityID_Name])
        }
      }
    }else{

      req = {
       // "sourceDataEntityID": this.current_data_view?.sourceEntityTypeID,
       "sourceDataEntityID": Number(this.current_entity_id()),
       // sourceEntityId:this.current_entity_id(),
       isDirect: true,
       "mapDefinitionID": this.current_data_view?.id,
       "addLinkedIds": this.addedSelectionItems.map((item: any) => item[this.current_data_view?.entityID_Name]),
       "removeLinkedIds": this.removedSelectionItems.map((item: any) => item[this.current_data_view?.entityID_Name])
     }
    }




    this._HttpClient.post(enviroment.DOMAIN_URI + `${this.current_data_view?.updateMapAPI}`, req).pipe(finalize(()=> this.loadingBtn = false)).subscribe({
      next: (res: any) => {
        this.loadingBtn = false;
        this.ShowConfirm = false;
        this._MessageService.add({ severity: 'success', summary: 'Success', detail: 'Items Linked Successfully !' })
        this.addedSelectionItems = []
        this.removedSelectionItems = [];
        this.show_linked = false;
      }
    })

  }


}
