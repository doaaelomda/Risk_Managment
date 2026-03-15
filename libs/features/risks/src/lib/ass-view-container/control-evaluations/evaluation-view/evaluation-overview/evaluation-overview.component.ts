import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlEvaluationService } from 'libs/features/risks/src/services/control-evaluation.service';
import {
  OverviewEntry,
  SharedOverviewComponent,
} from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';

@Component({
  selector: 'lib-evaluation-overview',
  imports: [CommonModule, SharedOverviewComponent],
  templateUrl: './evaluation-overview.component.html',
  styleUrl: './evaluation-overview.component.scss',
})
export class EvaluationOverviewComponent {
  constructor(private evaluationService: ControlEvaluationService) {
    effect(() => {
      this.data = this.evaluationService.viewedData();
      this.loading = this.evaluationService.loadingData();
    });
  }

  loading: boolean = true;
  data: any;
  entries: OverviewEntry[] = [
  {
    key: 'govControlName',
    label: 'EVALUATION.CONTROL_NAME',
    type: 'text',
  },
  {
    key: 'effectivenessLevelName',
    label: 'EVALUATION.EFFECTIVENESS_LEVEL',
    type: 'badge',
    colorKey: 'riskMethodologyControlEffectivenessLevelTypeID',
  },
  {
    key: 'govControlFunctionTypeName',
    label: 'EVALUATION.CONTROL_FUNCTION',
    type: 'badge',
  },
  {
    key: 'controlEffectivenessScore',
    label: 'EVALUATION.CONTROL_EFFECTIVENESS_SCORE',
    type: 'number',
  },
  {
    key: 'coveragePercentage',
    label: 'EVALUATION.COVERAGE_PERCENTAGE',
    type: 'number',
  },
  {
    key: 'controlWeight',
    label: 'EVALUATION.CONTROL_WEIGHT',
    type: 'number',
  },
  {
    key: 'riskMethodologyControlEffectivenessScore',
    label: 'EVALUATION.METHODOLOGY_EFFECTIVENESS_SCORE',
    type: 'number',
  },
  {
    key: 'evaluatedByUserName',
    label: 'EVALUATION.EVALUATED_BY',
    type: 'user',
    id:'evaluatedByUserID'
  },
  {
    key: 'evaluationDate',
    label: 'EVALUATION.EVALUATION_DATE',
    type: 'date',
  },
  {
    key: 'evaluationRemarks',
    label: 'EVALUATION.REMARKS',
    type: 'description',
  },
];
}
