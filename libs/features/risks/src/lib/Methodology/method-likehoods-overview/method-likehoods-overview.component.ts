import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MethodologyLikehoodsService } from '../../../services/methodology-likehoods.service';
import { filter, finalize, Subscription } from 'rxjs';
import { OverviewEntry, SharedOverviewComponent } from "libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component";

@Component({
  selector: 'lib-method-likehoods-overview',
  imports: [CommonModule, TranslateModule, SharedOverviewComponent],
  templateUrl: './method-likehoods-overview.component.html',
  styleUrl: './method-likehoods-overview.component.scss',
})
export class MethodLikehoodsOverviewComponent {
  constructor(private service:MethodologyLikehoodsService){}

  loading:boolean = false
  getData(){
    this.loading=true
this.dataSub = this.service.viewedData.pipe(filter((res) => !!res)).subscribe({
  next: (res) => {
    this.data = res;
    this.loading = false;
  },
  error: () => {
    this.loading = false;
  }
});  }
  data!:any
  dataSub!:Subscription
  ngOnInit(){
    this.getData()
  }
  ngOnDestroy(){
    this.dataSub.unsubscribe()
  }

  entries: OverviewEntry[] = [
  {
    key: 'name',
    label: 'CONTENT.NAME',
    type: 'text',
  },
  {
    key: 'nameAr',
    label: 'CONTENT.NAME_AR',
    type: 'text',
  },

  {
    key: 'color',
    label: 'CONTENT.COLOR',
    type: 'color', // shows colored badge
  },
  {
    key: 'weight',
    label: 'CONTENT.WEIGHT',
    type: 'number',
  },
  {
    key: 'riskMethodologyName',
    label: 'BREAD_CRUMB_TITLES.METHODOLOGY',
    type: 'text',
  },
    {
    key: 'description',
    label: 'CONTENT.DESCRIPTION',
    type: 'description',
  },
  {
    key: 'descriptionAr',
    label: 'CONTENT.DESCRIPTION_AR',
    type: 'description',
  },
];

}
