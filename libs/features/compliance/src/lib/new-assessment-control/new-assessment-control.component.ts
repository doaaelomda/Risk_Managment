import { NewTableComponent } from './../../../../../shared/shared-ui/src/lib/new-table/new-table.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'lib-new-assessment-control',
  imports: [CommonModule , NewTableComponent , TranslateModule],
  templateUrl: './new-assessment-control.component.html',
  styleUrl: './new-assessment-control.component.scss',
})
export class NewAssessmentControlComponent {




  // properties
  load_data:boolean = true;
  data:any[]=[];


  actions:any[]=[]


  columnControl:any = {
    type:'popup',
    data:null
  }
  setActionRow(event:any){
    //
  }
  handleDataTable(event:any =null){
    //
  }

}
