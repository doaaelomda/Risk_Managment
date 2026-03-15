/* eslint-disable @nx/enforce-module-boundaries */
import { PermissionSystemService } from './../../../../../../apps/gfw-portal/src/app/core/services/permission.service';
import { Component, effect, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NewTableColumnsComponent } from "../new-table-columns/new-table-columns.component";
import { SharedService } from '../../services/shared.service';
import { Column } from '../../models/columns.model';
import { TableModule } from "primeng/table";
import { TranslationsService } from 'apps/gfw-portal/src/app/core/services/translate.service';
import { EmptyStateComponent } from "../empty-state/empty-state.component";
import { PaginationComponent } from "../pagination/pagination.component";
import { NewTableFilterComponent } from '../new-table-filter/new-table-filter.component';
import { PaginationInterface } from 'apps/gfw-portal/src/app/core/models/pagination';
import { NewTableSortComponent } from '../new-table-sort/new-table-sort.component';
import { MenuModule } from "primeng/menu";
import { Router } from '@angular/router';
import { take } from 'rxjs';
@Component({
  selector: 'lib-new-table',
  imports: [CommonModule, TranslateModule, NewTableSortComponent, NewTableFilterComponent, NewTableColumnsComponent, TableModule, EmptyStateComponent, PaginationComponent, MenuModule],
  templateUrl: './new-table.component.html',
  styleUrl: './new-table.component.scss',
})
export class NewTableComponent implements OnInit, OnDestroy {

  constructor(private _PermissionSystemService: PermissionSystemService, private _Router: Router, private _SharedService: SharedService, private _TranslationsService: TranslationsService) {

    effect(() => {
      if (this.selections_input() ) {
        if(this.table_config()?.type == 'singleSelect' ){
          this.selected_items = this.selections_input();
          console.log("this single Select " , this.selected_items);
          return;
        }
        this.selected_ids = this.selections_input() || [];
        this.selected_items = this.table_data().filter(row =>
          this.selected_ids.includes(row[this.entityID_Name()])
        );
      }
    })
  }





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

  ngOnInit(): void {
    this._TranslationsService.selected_lan_sub.subscribe((res: string) => {
      if (res == 'ar') {
        this.is_ar = true;
      } else {
        this.is_ar = false
      }
    })

    // this._SharedService.paginationSubject.next(this.pageginationObj)
    this._SharedService.paginationSubject.subscribe((res: PaginationInterface) => {
      this.pageginationObj = res;
      this.total_items = res.totalItems
    })
    this.datatable_payload = {
      search: '',
      dataViewId: this.dataViewId(),
      pageNumber: this.pageginationObj.currentPage,
      pageSize: this.pageginationObj.perPage,
      filters: this.filters,
      sortField: this.sort_data?.field || null,
      sortDirection: this.sort_data?.direction || null,
    }
  }

  filiter_visible = signal<boolean>(false);

  handlefilterVisible(event: boolean) {
    this.filiter_visible.set(event)
  }

  payload_emiter = output<any>()
  currentActionRow = output<any>()
  selectionEmitter = output<any>()
  openModal = output<any>()
  handleColumnsDisplay(event: Column[]) {
    console.log("event columns ", event);

    this.columns = event;
    this.resizableRef = {
      isResize:false,
      columns : this.columns
    }
  }



  handleChangePage(event: any) {
    //
    console.log("event page chnage", event);

    this.datatable_payload.pageNumber = event?.currentPage;
    this.datatable_payload.pageSize = event?.perPage;


    this.payload_emiter.emit(this.datatable_payload)

  }


  handleFilterEvent(event: any) {
    this.datatable_payload.pageNumber = 1;
    this.datatable_payload.filters = event?.filters
    this.payload_emiter.emit(this.datatable_payload)
    this.filter_count = event?.filter_count;
    this.clearAllFilter = false;

  }

  is_ar: boolean = false;
  table_title = input.required<string>();
  badge_title = input.required<string>();
  dataViewId = input.required<number>();
  entityID_Name = input.required<string>();
  isShownAction = input.required<boolean>();
  table_data = input.required<any[]>()
  loading = input.required<boolean>();
  columnControl = input.required<{ type: 'route' | 'modal', data?: string }>();
  action_items = input<any[]>()
  columns: Column[] = [];
  current_table_filters: any[] = [];
  selections_input = input<any[] | any>();
  table_actions_permissions = input<{ module: string, feature: string, action: string }>({ module: '', feature: '', action: '' })
  //

  table_config = input<any>()

  selected_items: any[] = [];

  sort_data: any;
  filters: any[] = [];
  cloumns_event!: { isShow: boolean, event: PointerEvent };
  filter_event!: { isShow: boolean, event: PointerEvent };
  sort_event!: { isShow: boolean, event: PointerEvent };

  // Attributes

  pageginationObj: PaginationInterface = {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1
  }

  filter_count: number = 0;
  total_items: number = 10;
  clearAllFilter: boolean = false

  handleColumnsView(event: PointerEvent) {
    //
    this.cloumns_event = { isShow: true, event };
  }
  handleFilterView(event: PointerEvent) {
    //
    this.filter_event = { isShow: true, event };
  }

  selected_ids: any[] = []

  onSelectionChange(selectedRows: any[] | any) {
    console.log("rows ", selectedRows);

    if(this.table_config()?.type == 'singleSelect'){
      this.selectionEmitter.emit(selectedRows[this.entityID_Name()])
      return;
    }

    const selectedIDS = selectedRows.map((r:any) => {return r[this.entityID_Name()]});
    selectedIDS.map((id: any) => {
      if (!this.selected_ids.includes(id)) {
        this.selected_ids.push(id)
      }
    })
    this.selectionEmitter.emit(selectedIDS);
  }

  getValueProperty(type: string, col: any): string {
    const val: any = col?.dataMap?.filter((ele: { key: string, value: string }) => {
      return ele.key == type
    })[0]?.value;



    return type == 'text' ? val?.toString() : val;

  }


  handleColumnClick(row: any, i: any) {

    if (!this._PermissionSystemService.can(this.table_actions_permissions()?.module, this.table_actions_permissions()?.feature, this.table_actions_permissions()?.action)) return;

    if (!this.columnControl()) return;

    switch (this.columnControl()?.type) {
      case ('route'): {
        this._Router.navigate([this.columnControl()?.data, row[`${this.entityID_Name()}`]])

        break;
      }
      case ('modal'): {
        this.openModal.emit(row);
        break;
      }
    }


  }

  datatable_payload: any;


  handleClearFilter(event: PointerEvent) {
    event.stopPropagation();
    this.clearAllFilter = true;
    console.log("Triggred clearAllFilter", this.clearAllFilter);

  }


  selected_sort!: { field: string, direction: number };

  handleSelectedSort(event: any) {

    console.log("payload", this.datatable_payload);

    console.log("sort emited", event);

    this.selected_sort = event;


    this.datatable_payload['sortDirection'] = this.selected_sort.direction;

    this.datatable_payload['sortField'] = this.selected_sort.field;

    this.payload_emiter.emit(this.datatable_payload)

  }

  resizableRef:{ isResize: boolean; columns: Column[]} | undefined;

  handledColumnResizeListner(event: any) {
    console.log("event resize columns", event);
    const element = event.element;
    const fieldIndex = element?.cellIndex;

    const width = element.offsetWidth;




    this.columns[fieldIndex].width = width;



    console.log("columns after resize" , this.columns);

    this.resizableRef = {
      isResize:true,
      columns:this.columns
    }




  }



}
