import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstanceSectionsService } from '../services/instance-sections.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-instance-section-overview',
  imports: [CommonModule,TranslateModule],
  templateUrl: './instance-section-overview.component.html',
  styleUrl: './instance-section-overview.component.scss',
})
export class InstanceSectionOverviewComponent implements OnInit {
  instanceId: string = '';
  sectionId:string = ''
  loadingData: boolean = false;
  data!: any;
    constructor(private _sectionS:InstanceSectionsService,private _activatedRoute:ActivatedRoute){}
  ngOnInit(){
    this.getSectionId()
  }
  getSectionId() {
    this._activatedRoute.parent?.paramMap.subscribe((res: any) => {
      this.instanceId = res.get('instanceId');
      this.sectionId = res.get('sectionId');
      if(!this.sectionId)return
      this.getSectionById(this.sectionId);
    });
  }
  getSectionById(id: string) {
    this.loadingData = true;
    this._sectionS.getById(id).subscribe((res) => {
      const template_data = res?.data;
      this.data = template_data;
      this.loadingData = false;
    });
  }
}
