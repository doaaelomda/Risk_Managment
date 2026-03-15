import { OverviewEntry } from './../../../../../../shared/shared-ui/src/lib/shared-overview/shared-overview.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesService } from '../../services/templates-service.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedOverviewComponent } from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';

@Component({
  selector: 'lib-template-overview',
  imports: [CommonModule,TranslateModule,SharedOverviewComponent],
  templateUrl: './template-overview.component.html',
  styleUrl: './template-overview.component.scss',
})
export class TemplateOverviewComponent {
    constructor(private _templateS:TemplatesService,private _activatedRoute:ActivatedRoute){}
  ngOnInit(){
    this.getTemplateId()
  }
  templateId: string = '';
  templateEntries:OverviewEntry[] = [
  { key: 'name', label: 'TEMPLATES.NAME', type: 'text' },
  { key: 'nameAr', label: 'TEMPLATES.NAME_AR', type: 'text' },
  { key: 'description', label: 'TEMPLATES.DESCRIPTION', type: 'description' },
  { key: 'descriptionAr', label: 'TEMPLATES.DESCRIPTION_AR', type: 'description' },

  ]
  getTemplateId() {
    this._activatedRoute.parent?.paramMap.subscribe((res: any) => {
      this.templateId = res.get('templateId');
      if(!this.templateId)return
      this.getTemplateById(this.templateId);
    });
  }

  loadingData: boolean = false;
  data!: any;
  getTemplateById(id: string) {
    this.loadingData = true;
    this._templateS.getById(id).subscribe((res) => {
      const template_data = res?.data;
      this.data = template_data;
      this.loadingData = false;
      console.log(template_data, 'tdata');
    });
  }

}
