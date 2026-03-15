import { Component, effect, input, output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayPanel, OverlayPanelModule } from "primeng/overlaypanel";
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'lib-new-table-sort',
  imports: [CommonModule, InputTextModule ,TranslateModule,RadioButtonModule,OverlayPanelModule , FormsModule],
  templateUrl: './new-table-sort.component.html',
  styleUrl: './new-table-sort.component.scss',
})
export class NewTableSortComponent {


  constructor(){
    effect(()=>{
      if(this.show_overlay()?.isShow){
        this.sortable.toggle(this.show_overlay().event)
      }
    })

    effect(()=>{
      if(this.columnsInput()?.length){

      this.ColumnsFilter = this.columnsInput().filter((col: any) => col?.isSortable).map((col: any) => { return { ...col, isChecked: false } })
      this.ColumnsFilterTemp = this.columnsInput().filter((col: any) => col?.isSortable).map((col: any) => { return { ...col, isChecked: false } })
      }
    })
  }


  @ViewChild('sortable') sortable !: OverlayPanel

  searchTermSort:string = '';

  columnsInput = input.required<any[]>()
  show_overlay = input.required<{isShow:boolean , event:PointerEvent}>()

  sortEmiter =output<any>()

  handleSearchColumnsFilter(){
    //
    this.ColumnsFilter = this.ColumnsFilterTemp?.filter((col: { id: number, label: string }) => {
      return col.label.toLocaleLowerCase().includes(this.searchTermSort.toLocaleLowerCase())
    })
  }


  handleSortEmiter(){
    //
      this.sortEmiter.emit({
          direction: this.selected_sort_direction,
          field: this.selected_sort
        })
  }

  ColumnsFilter:any[]=[]
  ColumnsFilterTemp:any[]=[]

  selected_sort:any;
  selected_sort_direction:number =1

  fixPosition(panel: any) {
  const el = panel.container as HTMLElement;
  if (el) {
    el.style.left = '770px';
  }
}
}
