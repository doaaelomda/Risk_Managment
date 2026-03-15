import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionsService } from '../../services/sections.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-section-overview',
  imports: [CommonModule,TranslateModule],
  templateUrl: './section-overview.component.html',
  styleUrl: './section-overview.component.scss',
})
export class SectionOverviewComponent {

  constructor(private _sectionS:SectionsService,private _activatedRoute:ActivatedRoute){}
  ngOnInit(){
    this.getSectionId()
  }
  templateId: string = '';
  sectionId:string = ''
  getSectionId() {
    this._activatedRoute.parent?.paramMap.subscribe((res: any) => {
      this.templateId = res.get('templateId');
      this.sectionId = res.get('sectionId');
      if(!this.sectionId)return 
      this.getSectionById(this.sectionId);
    });
  }

  loadingData: boolean = false;
  data!: any;
  getSectionById(id: string) {
    this.loadingData = true;
    this._sectionS.getById(id).subscribe((res) => {
      const template_data = res?.data;
      this.data = template_data;
      this.loadingData = false;
      console.log(template_data, 'tdata');
    });
  }
}
