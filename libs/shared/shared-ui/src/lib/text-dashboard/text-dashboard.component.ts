/* eslint-disable @nx/enforce-module-boundaries */
import { TranslationsService } from 'apps/gfw-portal/src/app/core/services/translate.service';
import { Component, input, OnChanges, OnInit, output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from "primeng/dropdown";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DashboardLayoutService } from 'libs/features/dashboard/src/services/dashboard-layout.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from "primeng/dialog";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { FilterDashboardComponent } from "libs/features/dashboard/src/lib/filter-dashboard/filter-dashboard.component";
import { InputTextComponent } from '../input-text/input-text.component';
import { EditorComponent } from '../editor/editor.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { enviroment } from 'apps/gfw-portal/env/dev.env';
import { MessageService } from 'primeng/api';
import { SafeHtmlPipe } from "../../../../../../apps/gfw-portal/src/app/core/pipes/safeHtml.pipe";
@Component({
  selector: 'lib-text-dashboard',
  imports: [CommonModule, EditorComponent, InputTextComponent, FormsModule, DropdownModule, DialogModule, FilterDashboardComponent, ReactiveFormsModule, SafeHtmlPipe],
  templateUrl: './text-dashboard.component.html',
  styleUrl: './text-dashboard.component.scss',
})
export class TextDashboardComponent implements OnChanges , OnInit {


  current_lang:string='';
  ngOnInit(): void {
    this.initTextForm();
    this.current_lang = this._TranslationsService.getSelectedLanguage();
  }


  setting_visible:boolean = false


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chart_config_input']) {
      this.selectedWidth = this.chart_config_input()?.data?.width || this.selectedWidth;

      if (this.chart_config_input()?.data?.settingsResource) {
        this.getSettingData()
      }
    }



    if(changes['formSettingData']){
      console.log("formSettingData" , this.formSettingData());
      this.current_setting_data = this.formSettingData();
    }
  }


    mode = input<string>();

  chart_config_input = input.required<any>()
show_filter:boolean=false;
actionEmitter = output<any>();
settingEmitter = output<any>();

  formSettingData = input<any>();

  getSettingData() {
    this._HttpClient.get(enviroment.DOMAIN_URI + this.chart_config_input()?.data?.settingsResource).subscribe((res: any) => {
      this.current_setting_data = res?.data;
    })
  }

  current_setting_data:any;

  textForm!:FormGroup;

  initTextForm(data?:any){
    this.textForm = new FormGroup({
      title:new FormControl(data ? data?.title : null),
      content:new FormControl(data ? data?.content : null)
    })
  }

    varaibles:any[]=["RISK_COUNT" , "RISK_RATE"]

    widthOptions:any[]=[
    {
      id:1,
      value:.5,
      label:'33%'
    },
    {
            id:2,
      value:.75,
      label:'50%'
    },
    {
            id:3,
      value:1,
      label:'70%'
    },
    {
            id:4,
      value:1.5,
      label:'100%'
    },

  ]


handleAddVar(variable: any) {
  const spanHtml = `<span class="text-primary font-semibold">[#${variable}]</span>`;

  const currentContent = this.textForm.get('content')?.value || '';
  const updatedContent = currentContent + spanHtml;

  this.textForm.get('content')?.setValue(updatedContent);
  this.textForm.updateValueAndValidity();
}
    selectedWidth:any= this.widthOptions[3].value;

  constructor(private _TranslationsService:TranslationsService,private _MessageService:MessageService,private _ActivatedRoute:ActivatedRoute,public dashboardLayoutService: DashboardLayoutService , private _HttpClient:HttpClient) {
    dashboardLayoutService.filter_visible$.subscribe(res => {
      this.filter_visible = res;
    })

       this._ActivatedRoute.parent?.paramMap.subscribe((params) => {
      this.current_report_id = params.get('id')
    })
  }
  filter_visible:boolean =false;


  loading_setting_save:boolean = false

  current_report_id: any
  saveSetting(){
    console.log("textForm" , this.textForm.value);
        this.loading_setting_save = true
    const req = {
      "reportDefinitionId": this.current_report_id,
      "reportPartId": this.chart_config_input()?.data?.id,
      "configJson": {},
        "content": this.textForm.get('content')?.value,
  "title": this.textForm.get('title')?.value
    }
    this.dashboardLayoutService.updateWidgetSetting(req).subscribe({
      next: (res: any) => {

        this.loading_setting_save = false
        this.setting_visible = false
        this._MessageService.add({ severity: 'success', summary: 'Success', detail: 'Widget Setting Saved Successfully' })
      }
    })
  }
}
