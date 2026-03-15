/* eslint-disable @nx/enforce-module-boundaries */
import { Component, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from "primeng/accordion";
import { SharedUiComponent } from "../shared-ui/shared-ui.component";
import * as moment from 'moment';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { newProfile } from '../../models/newProfiles';
import { ActivatedRoute } from '@angular/router';
import { LinkedModuleService } from '../../services/linkedModule.service';
import { SharedService } from '../../services/shared.service';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { LinkedModuleSelectedComponent } from '../linkedModule-selected/linkedModule-selected.component';
@Component({
  selector: 'lib-shared-linked-module',
  imports: [CommonModule, LinkedModuleSelectedComponent,TranslateModule,AccordionModule, SharedUiComponent],
  templateUrl: './shared-linkedModule.component.html',
  styleUrl: './shared-linkedModule.component.scss',
})
export class SharedLinkedModuleComponent implements OnInit {
  constructor(private _HttpClient:HttpClient,private _SharedService:SharedService,private _ActivatedRoute:ActivatedRoute , private _LinkedModuleService:LinkedModuleService){
    //
  }
  ngOnInit(): void {
    if(this._ActivatedRoute.snapshot.data['groupId']){
      this.current_group_id = this._ActivatedRoute.snapshot.data['groupId'];
      const keys:string[] = this._ActivatedRoute.snapshot.parent?.paramMap.keys || []
      this.current_entity_id = this._ActivatedRoute.snapshot.parent?.paramMap.get(keys[keys.length - 1])
      console.log("current_entity_id", this.current_entity_id);
    }else{
      this.current_group_id = this.group_id()
      this.current_entity_id = this.entity_id()
    }

    this.getLinkedModulesGroup()
  }

  group_id = input<any>()
  entity_id = input<any>()

  current_entity_id:any;

  getLinkedModulesGroup(){
    this._LinkedModuleService.linkedMapByGroupId(this.current_group_id).subscribe((res:any)=>{
      this.groupData = res?.data
      this.listsDefinations = res?.data?.definitions.map((el:any)=>{
        return{
          ...el,
          isExpand:false
        }
      })
    })
  }


  loadingTable:boolean = false;
  current_group_id:any;
  groupData:any;
  listsDefinations: any[] = [];
  activeIndex:any = null;
    selected_profile_column: number = 0;
  current_row_selected: any = '';
  sort_data:any;
  dataList:any[]=[];
  currentProfiles: newProfile[] = [];
  defultProfile!: newProfile;
  current_filters:any[]=[];
  current_link_module:any;
  getCurrentData(event?:any){
    //
    this.dataList = [];
    this.loadingTable = true
       const req = {
      search: '',
      dataViewId: 1,
      pageNumber: event?.currentPage ?? 1,
      pageSize: event?.perPage ?? 10,
      filters: this.current_filters,
      sortField: this.sort_data?.field,
      sortDirection: this.sort_data?.direction,
        "mapDefinitionId": this.current_link_module?.id,
  "sourceEntityId": this.current_entity_id
    };

    this._HttpClient.post(enviroment.DOMAIN_URI + this.current_link_module?.linkedEntityDataSourceAPI?.substring(1) , req).subscribe((res:any)=>{
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
  handleShowDelete(event:any){
    //
  }
  handleAccordionChange(accordion: any, index: number, isOpen: boolean) {
    //
    this.sort_data = null
    if(isOpen){

      this.current_link_module = accordion
      console.log("accordion" , accordion);

      this.activeIndex = index;
      this.loadCloumns(accordion?.dataViewId)
    }else{
      this.current_link_module = null;
      this.activeIndex = null
    }
  }
  isGettingData:any;

    handleSort(event: any) {
    this.sort_data = event;
    this.getCurrentData()
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
    pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  };
  setSelected(event: any) {
    this.current_row_selected = event;
  }

  loadCloumns(dataViewId:any) {
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


  showLinkTable:boolean = false;
  handleLinkTable(event:boolean){
    this.showLinkTable = event;
    if(!event){
      this.handleFilter([])
    }
  }
}
