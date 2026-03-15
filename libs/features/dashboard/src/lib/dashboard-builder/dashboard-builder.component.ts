import { CustomComplianceChartByOUComponent } from './../../../../../shared/shared-ui/src/lib/custom-compliance-chart-ByOU/custom-compliance-chart-ByOU.component';
import { ChartKRIComponent } from './../../../../../shared/shared-ui/src/lib/chart-KRI/chart-KRI.component';
import { ComplianceAssessmentChartComponent } from './../../../../../shared/shared-ui/src/lib/compliance-assessment-chart/compliance-assessment-chart.component';
import { ComplianceStatusChartComponent } from './../../../../../shared/shared-ui/src/lib/compliance-status-chart/compliance-status-chart.component';
import { TextDashboardComponent } from './../../../../../shared/shared-ui/src/lib/text-dashboard/text-dashboard.component';
import { ListDashboardComponent } from './../../../../../shared/shared-ui/src/lib/list-dashboard/list-dashboard.component';
import { TableDashboardComponent } from './../../../../../shared/shared-ui/src/lib/table-dashboard/table-dashboard.component';
import { LineChartComponent } from './../../../../../shared/shared-ui/src/lib/line-chart/line-chart.component';
import { DounghnutChartComponent } from './../../../../../shared/shared-ui/src/lib/dounghnut-chart/dounghnut-chart.component';
import { CardsTabsComponent } from './../../../../../shared/shared-ui/src/lib/cards-tabs-widget-dashboard/cards-tabs.component';
import { Component, input, OnChanges, OnInit, output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartBarComponent } from "@gfw/shared-ui";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SplitterModule } from 'primeng/splitter';
import { DashboardLayoutService } from '../../services/dashboard-layout.service';
import { MessageService } from 'primeng/api';
import { DialogModule } from "primeng/dialog";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextComponent } from "libs/shared/shared-ui/src/lib/input-text/input-text.component";
import { EditorComponent } from "libs/shared/shared-ui/src/lib/editor/editor.component";
import { AssessmentsDetailsComponent } from "libs/features/compliance/src/lib/assessments-details/assessments-details.component";

@Component({
  selector: 'lib-dashboard-builder',
  imports: [CommonModule, ChartKRIComponent, ComplianceAssessmentChartComponent, ComplianceStatusChartComponent, ReactiveFormsModule, CustomComplianceChartByOUComponent, FormsModule, SplitterModule, TextDashboardComponent, ListDashboardComponent, DragDropModule, TableDashboardComponent, LineChartComponent, CardsTabsComponent, ChartBarComponent, DounghnutChartComponent, DialogModule, InputTextComponent, EditorComponent, AssessmentsDetailsComponent],
  templateUrl: './dashboard-builder.component.html',
  styleUrl: './dashboard-builder.component.scss',
})
export class DashboardBuilderComponent implements OnChanges , OnInit {



  ngOnInit(): void {
    this.initTextForm()
  }

  constructor( private _MessageService:MessageService,private _DashboardLayoutService:DashboardLayoutService){}

  dashboard_config = input.required<any>();
  mode = input<any>();
  current_report_id = input<any>()

  dashboard_config_emitter = output<any>()

  drop(event: any) {
    const parts = this.dashboard_data?.dashboard_Widgets;
    const prevIndex = event.previousIndex;
    const currIndex = event.currentIndex;
    const moved = parts.splice(prevIndex, 1)[0];
    parts.splice(currIndex, 0, moved);
    console.log("data " , this.dashboard_data);
    this.dashboard_config_emitter.emit(this.dashboard_data)
  }

  getWidthClass(width: number): string {
  switch (width) {
    case 0.5:
      return 'w-33';
    case 0.75:
      return 'w-50';
    case 1:
      return 'w-66';
    case 1.5:
      return 'w-100';
    default:
      return 'w-100';
  }
}
  dashboard_data: any;

  ngOnChanges(changes: SimpleChanges): void {
    this.dashboard_data = this.dashboard_config();

    if(this.dashboard_data?.dashboard_Title === 'Compliance Dashboard'){
      this.dashboard_data.dashboard_Widgets?.push(
        {
          id:100,
          name:"Compliance Status Chart",
          type:'custom-compliance',
          width:0.75,
          dataViewID:101,
          description: "Risk By Response Type"
        }
      )
      this.dashboard_data.dashboard_Widgets?.push(
        {
          id:100,
          name:"Compliance Status Chart",
          type:'custom-compliance-assessment',
          width:0.75,
          dataViewID:101,
          description: "Risk By Response Type"
        }
      )
    }

  }

  handleWidgetEvents(event: any) {
    console.log(event);

    const parts: any[] = this.dashboard_data?.dashboard_Widgets;
    const currentIndex = parts.findIndex((part: any) => part?.id == event.widget.id)
    switch (event.event) {
      case 'switch':
        if (event.value == 'up') {
          if (currentIndex) {
            [parts[currentIndex - 1], parts[currentIndex]] = [parts[currentIndex], parts[currentIndex - 1]];
          }
        }else if (event.value == 'down') {
          [parts[currentIndex + 1], parts[currentIndex]] = [parts[currentIndex], parts[currentIndex + 1]];

        }
        break;

        case 'resize':

          if(event.value){
            parts[currentIndex].inner_width = event.value;
            parts[currentIndex].width = event.value;
          }

        break;
        case 'delete':
          if(event?.value){
            console.log("delete " , event.value);

            this._DashboardLayoutService.deleteWidget(event?.value?.id , this.current_report_id()).subscribe({
              next:(res)=>{

                const removerIndex = this.dashboard_data?.dashboard_Widgets?.findIndex((el:any)=> el?.id == event?.value?.id )
                this.dashboard_data?.dashboard_Widgets?.splice(removerIndex , 1)

                this.dashboard_data = {
                  dashboard_Title:this.dashboard_data?.dashboard_Title,
                  dashboard_Widgets:this.dashboard_data?.dashboard_Widgets

                }
                this._MessageService.add({severity:'success' , summary:"Success" , detail:"Widget Deleted Successfully"})
              }
            })
          }
          break;


      default:
        break;
    }






    this.dashboard_config_emitter.emit(this.dashboard_data)




  }


  setting_visible:boolean = false;


  textForm!:FormGroup;

  initTextForm(data?:any){
    this.textForm = new FormGroup({
      title:new FormControl(data ? data?.title : null),
      content:new FormControl(data ? data?.content : null),
      titleAr:new FormControl(data ? data?.settings?.titleAr : null),
      contentAr:new FormControl(data ? data?.settings?.contentAr : null)
    })




  }



  handleSettingText(event:any){
    console.log("event_text" , event);

    this.current_text_setting_data = event
    this.setting_visible = event?.visible;
    this.initTextForm(event?.data)
  }

  current_text_setting_data:any;

  loading_setting_save:boolean = false

  saveSetting(){
    console.log("textForm" , this.textForm.value);
        this.loading_setting_save = true
    const req = {
      "reportDefinitionId": this.current_text_setting_data?.reportDefinitionId,
      "reportPartId": this.current_text_setting_data?.reportPartId,
      "configJson": {
         "contentAr": this.textForm.get('contentAr')?.value,
  "titleAr": this.textForm.get('titleAr')?.value
      },
        "content": this.textForm.get('content')?.value,
  "title": this.textForm.get('title')?.value,

    }
    this._DashboardLayoutService.updateWidgetSetting(req).subscribe({
      next: (res: any) => {

        this.loading_setting_save = false
        this.setting_visible = false
        this._MessageService.add({ severity: 'success', summary: 'Success', detail: 'Widget Setting Saved Successfully' })
      }
    })
  }

}

