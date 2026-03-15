/* eslint-disable @nx/enforce-module-boundaries */
import { TranslationService } from './../../../../../../apps/campagin-app/src/app/shared/services/translation.service';
import { Component, effect, ElementRef, input, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from "primeng/accordion";
import { TranslateModule } from '@ngx-translate/core';
import { MethodologyLikehoodsService } from '../../services/methodology-likehoods.service';
import { MethodologyImpactsService } from '../../services/methodology-impacts.service';
import { forkJoin } from 'rxjs';
import { MethodologyLevelsService } from '../../services/methodology-levels.service';
import { CheckboxModule } from "primeng/checkbox";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from "primeng/button";
import { SimpleAssessmentService } from '../../services/simple-assessment.service';
import { MessageService } from 'primeng/api';
import { ListComponent } from '../ass-view-container/control-evaluations/list/list.component';

@Component({
  selector: 'lib-sample-assessment',
  imports: [CommonModule, ListComponent,AccordionModule, FormsModule, ReactiveFormsModule, TranslateModule, CheckboxModule, ButtonModule],
  templateUrl: './sample-assessment.component.html',
  styleUrl: './sample-assessment.component.scss',
})
export class SampleAssessmentComponent {


  @ViewChild('vcr', { read: ViewContainerRef }) vcr!: ViewContainerRef;

  riskData = input.required<any>();
  isAr:boolean = false;
  constructor(
    private _MethodologyLikehoodsService:MethodologyLikehoodsService,
    private _MethodologyImpactsService:MethodologyImpactsService,
    private _MethodologyLevelsService:MethodologyLevelsService,
    private _SimpleAssessmentService:SimpleAssessmentService,
    private _MessageService:MessageService,
    private _TranslationService:TranslationService
  ){

    this.isAr = this._TranslationService.getSelectedLanguage() === 'ar' ? true:false
    effect(()=>{
      if(this.riskData()){
        this.handledAssessmentImpactandLikelhoodByMethodologyId(this.riskData()?.riskMethodologyID)
      }
    })
  }

    assessmentState: any = {
    1: this.createEmptyAssessmentState(), // Inherent
    2: this.createEmptyAssessmentState(), // Residual
    3: this.createEmptyAssessmentState(), // Target
  };

  createEmptyAssessmentState() {
    return {
      impacts: [],
      likelhoods: [],
      levels: [],
      selectedImpact: null,
      selectedLikehood: null,
      riskScore: 0,
      currentLevelIndex: null
    };
  }
handledAssessmentImpactandLikelhoodByMethodologyId(methodologyID: any) {

  forkJoin([
    this._MethodologyLikehoodsService.findAll(
      { pageNumber: 1, dataViewId: 90, pageSize: 100 },
      { riskMethodologyID: methodologyID }
    ),
    this._MethodologyImpactsService.findAll(
      { pageNumber: 1, dataViewId: 90, pageSize: 100 },
      { riskMethodologyID: methodologyID }
    ),
    this._MethodologyLevelsService.findAll(
      { pageNumber: 1, dataViewId: 90, pageSize: 100 },
      { riskMethodologyID: methodologyID }
    )
  ]).subscribe((res: any[]) => {

    const likelhoods = res[0]?.data?.items?.map((el: any) => ({ ...el, selected: false }));
    const impacts = res[1]?.data?.items?.map((el: any) => ({ ...el, selected: false }));
    const levels = res[2]?.data?.items;

    Object.keys(this.assessmentState).forEach(tab => {
      this.assessmentState[+tab] = {
        ...this.createEmptyAssessmentState(),
        likelhoods: structuredClone(likelhoods),
        impacts: structuredClone(impacts),
        levels: structuredClone(levels)
      };
    });

    // 🔥 hydrate from riskData
    const r = this.riskData();

    this.hydrateTabState(
      1,
      r.inherentRiskImpactID,
      r.inherentRiskLikelihoodID,
      r.inherentRiskScore
    );

    this.hydrateTabState(
      2,
      r.residualRiskImpactID,
      r.residualRiskLikelihoodID,
      r.residualRiskScore
    );

    this.hydrateTabState(
      3,
      r.targetRiskImpactID,
      r.targetRiskLikelihoodID,
      r.targetRiskScore
    );
  });
}


setActiveTab(tab: any) {
  this.active_tab_assessment = tab.id;

  // this.vcr?.clear();

  // if (this.active_tab_assessment === 4) {
  //   const compRef = this.vcr.createComponent(ListComponent);
  //   compRef.setInput('isRisk', true);
  // }
}



    assessmentTypesTabs: any[] = [
      {
        id: 1,
        name: "RISK_VIEW.INHERATE_RISK"
      },
      {
        id:4,
        name:"RISK_VIEW.CONROLT_EFFE"
      },
      {
        id: 2,
        name: "RISK_VIEW.RESIDUAL_RISK"
      },
      {
        id: 3,
        name: "RISK_VIEW.TARGET_RISK"
      }
    ]

    active_tab_assessment: any = this.assessmentTypesTabs[0]?.id;

  handleSelectedImpact(impact: any) {
    const state = this.assessmentState[this.active_tab_assessment];

    state.impacts.forEach((el: any) => el.selected = false);
    impact.selected = true;

    state.selectedImpact = impact;
    this.calculateRisk();
  }

  handleSelectedLikelhood(likehood: any) {
    const state = this.assessmentState[this.active_tab_assessment];

    state.likelhoods.forEach((el: any) => el.selected = false);
    likehood.selected = true;

    state.selectedLikehood = likehood;
    this.calculateRisk();
  }

    current_selected_impact:any;
    current_selected_likehood :any;


    riskScore:any = 0;
    currentLevelIndex :any = null;
  calculateRisk() {
    const state = this.assessmentState[this.active_tab_assessment];

    if (!state.selectedImpact || !state.selectedLikehood) return;

    state.riskScore =
      state.selectedImpact.weight *
      state.selectedLikehood.weight;

    this.detectRiskLevelByTab(this.active_tab_assessment);
  }

detectRiskLevelByTab(tab: number) {
  const state = this.assessmentState[tab];
  if (!state || state.riskScore == null) return;

  const index = state.levels.findIndex((level: any) =>
    state.riskScore >= level.fromWeight &&
    state.riskScore <= level.toWeight
  );

  state.currentLevelIndex = index !== -1 ? index : null;
}

  getArrowLeftPercent(): number {
    const state = this.assessmentState[this.active_tab_assessment];

    if (state.currentLevelIndex === null || !state.levels?.length) {
      return 0;
    }

    return ((state.currentLevelIndex + 0.5) / state.levels.length) * 100;
  }


  isLoading:boolean = false;

//   {
//   "riskID": 0,
//   "riskMethodologyRiskAssessemntControlEffectivenessLevelID": 0,
//   "inherentRiskImpactID": 0,
//   "inherentRiskLikelihoodID": 0,
//   "targetRiskImpactID": 0,
//   "targetRiskLikelihoodID": 0,
//   "residualRiskImpactID": 0,
//   "residualRiskLikelihoodID": 0
// }
hydrateTabState(
  tab: number,
  impactId: number | null,
  likelihoodId: number | null,
  riskScore?: number | null
) {
  const state = this.assessmentState[tab];

  if (!state) return;

  // 🔹 select impact
  if (impactId) {
    const impact = state.impacts.find((i: any) => i.riskImpactID === impactId);
    if (impact) {
      impact.selected = true;
      state.selectedImpact = impact;
    }
  }

  // 🔹 select likelihood
  if (likelihoodId) {
    const likelihood = state.likelhoods.find((l: any) => l.riskLikelihoodID === likelihoodId);
    if (likelihood) {
      likelihood.selected = true;
      state.selectedLikehood = likelihood;
    }
  }

  // 🔹 set score (لو جاي من الباك)
  if (riskScore != null) {
    state.riskScore = riskScore;
  } else if (state.selectedImpact && state.selectedLikehood) {
    state.riskScore =
      state.selectedImpact.weight *
      state.selectedLikehood.weight;
  }

  // 🔹 detect level
  this.detectRiskLevelByTab(tab);
}

submit() {
  const inherent = this.assessmentState[1];
  const residual = this.assessmentState[2];
  const target   = this.assessmentState[3];
  console.log("inherent" , inherent);
  console.log("residual" , residual);
  console.log("target" , target);

  const payload = {
    riskID: this.riskData()?.riskID,

    riskMethodologyRiskAssessemntControlEffectivenessLevelID: this.riskMethodologyRiskAssessemntControlEffectivenessLevelID,

    inherentRiskImpactID: inherent.selectedImpact?.riskImpactID ?? null,
    inherentRiskLikelihoodID: inherent.selectedLikehood?.riskLikelihoodID ?? null,

    residualRiskImpactID: residual.selectedImpact?.riskImpactID ?? null,
    residualRiskLikelihoodID: residual.selectedLikehood?.riskLikelihoodID ?? null,

    targetRiskImpactID: target.selectedImpact?.riskImpactID ?? null,
    targetRiskLikelihoodID: target.selectedLikehood?.riskLikelihoodID ?? null
  };

  console.log('Simple Assessment Payload:', payload);

  this.isLoading = true;
  this._SimpleAssessmentService.updateSimpleRiskAssessment(payload).subscribe({
    next: () => {
      this.isLoading = false;
      this._MessageService.add({severity:'success' , summary:'Success' , detail:"Assessment Data Saved Successfully"})
    },
    error: () => {
      this.isLoading = false;
    }
  });
}



isShowSave:boolean = true;

riskMethodologyRiskAssessemntControlEffectivenessLevelID:any;

updated_evaluation_id:any= null;

handledForAction(event:any){
  this.isShowSave = event?.show_save ?? true;
  this.updated_evaluation_id = event?.updated_id ?? null;
  this.riskMethodologyRiskAssessemntControlEffectivenessLevelID = event?.controlEffectivenessLevelID
}

}
