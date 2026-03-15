import { TranslationService } from 'apps/campagin-app/src/app/shared/services/translation.service';
import { MethodologyLikehoodsService } from './../../../../../features/risks/src/services/methodology-likehoods.service';
import { MethodologyImpactsService } from './../../../../../features/risks/src/services/methodology-impacts.service';
import { MethodologyLevelsService } from 'libs/features/risks/src/services/methodology-levels.service';
import { Component, effect, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'lib-risk-matrex-chart',
  imports: [CommonModule],
  templateUrl: './risk-matrex-chart.component.html',
  styleUrl: './risk-matrex-chart.component.scss',
})
export class RiskMatrexChartComponent {

  methodology_id = input<any>();
  riksData = input<any>();

  constructor(
    private _MethodologyLikehoodsService:MethodologyLikehoodsService,
    private _MethodologyImpactsService:MethodologyImpactsService,
    private _MethodologyLevelsService:MethodologyLevelsService,
    private _TranslationService:TranslationService
  ){
    effect(()=>{
      if(this.methodology_id()){
        this.loadData()
      }
    })


    this.isAr = this._TranslationService.getSelectedLanguage() == 'ar' ? true : false;

  }


  isAr:boolean = false;



  impacts:any[]=[];
  liklehoods:any[]=[];
  levels:any[]=[];

 heatMap: any[] = [];

buildHeatMap() {

  const sortedImpacts = [...this.impacts]
    .sort((a, b) => a.weight - b.weight);

  const sortedLikelihoods = [...this.liklehoods]
    .sort((a, b) => a.weight - b.weight);

  const sortedLevels = [...this.levels]
    .sort((a, b) => a.fromWeight - b.fromWeight);

  const reversedImpacts = [...sortedImpacts].reverse();

  this.heatMap = reversedImpacts.map(impact =>
    sortedLikelihoods.map(likelihood => {

      const score = impact.weight * likelihood.weight;

      const level = sortedLevels.find(l =>
        score >= l.fromWeight && score <= l.toWeight
      );

      const content: string[] = [];

      // 🔵 Inherent
      if (
        this.riksData()?.inherentRiskImpactID === impact.riskImpactID &&
        this.riksData()?.inherentRiskLikelihoodID === likelihood.riskLikelihoodID
      ) {
        content.push('I');
      }

      // 🟠 Residual
      if (
        this.riksData()?.residualRiskImpactID === impact.riskImpactID &&
        this.riksData()?.residualRiskLikelihoodID === likelihood.riskLikelihoodID
      ) {
        content.push('R');
      }

      // 🔴 Target
      if (
        this.riksData()?.targetRiskImpactID === impact.riskImpactID &&
        this.riksData()?.targetRiskLikelihoodID === likelihood.riskLikelihoodID
      ) {
        content.push('T');
      }

      return {
        impactId: impact.riskImpactID,
        likelihoodId: likelihood.riskLikelihoodID,
        levelId: level?.riskLevelID,
        color: level?.color || 'HotPink',
        content
      };
    })
  );

  this.impacts = reversedImpacts;
  this.liklehoods = sortedLikelihoods;


  console.log("heatMap" , this.heatMap);

}



get gridTemplateColumns(): string {
  return `repeat(${this.liklehoods.length}, ${100/this.liklehoods.length}%)`;
}
  loadData(){
    forkJoin([
          this._MethodologyLikehoodsService.findAll(
      { pageNumber: 1, dataViewId: 90, pageSize: 100 },
      { riskMethodologyID: this.methodology_id() }
    ),
    this._MethodologyImpactsService.findAll(
      { pageNumber: 1, dataViewId: 90, pageSize: 100 },
      { riskMethodologyID: this.methodology_id() }
    ),
    this._MethodologyLevelsService.findAll(
      { pageNumber: 1, dataViewId: 90, pageSize: 100 },
      { riskMethodologyID: this.methodology_id() }
    )
    ]).subscribe((res:any[])=>{
      this.liklehoods =res[0]?.data?.items
      this.impacts =res[1]?.data?.items
      this.levels =res[2]?.data?.items;
      this.buildHeatMap()
    })
  }
}
