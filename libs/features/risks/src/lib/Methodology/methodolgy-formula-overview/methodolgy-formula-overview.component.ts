import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MethodologyFormulaService } from '../../../services/methodology-formula.service';
import { filter, finalize, Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { OverviewEntry, SharedOverviewComponent } from "libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component";

@Component({
  selector: 'lib-methodolgy-formula-overview',
  imports: [CommonModule, TranslateModule, SharedOverviewComponent],
  templateUrl: './methodolgy-formula-overview.component.html',
  styleUrl: './methodolgy-formula-overview.component.scss',
})
export class MethodolgyFormulaOverviewComponent {
  constructor(private service: MethodologyFormulaService) {}
  loading:boolean = false
  getData() {
    this.loading = true
 this.dataSub = this.service.viewedData.pipe(filter((res) => !!res)).subscribe({
  next: (res) => {
    this.data = res;
    this.loading = false;
  },
  error: () => {
    this.loading = false;
  }
});
  }
  data!: any;
  dataSub!: Subscription;
  ngOnInit() {
    this.getData();
  }
  ngOnDestroy() {
    this.dataSub.unsubscribe();
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
    key: 'riskMethodologyName',
    label: 'BREAD_CRUMB_TITLES.METHODOLOGY',
    type: 'text',
  },

  {
    key: 'riskAssessmentTypeName',
    label: 'FORMULA.RISK_ASSESSMENT',
    type: 'text',
  },
  {
    key: 'riskCategoryName',
    label: 'FORMULA.RISK_CATEGORY',
    type: 'text',
  },
    {
    key: 'formulaExpression',
    label: 'METHODOLOGY.FORMULA_EXPRESSION',
    type: 'description',
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
