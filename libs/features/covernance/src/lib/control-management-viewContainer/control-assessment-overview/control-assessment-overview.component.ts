import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoveranceService } from '../../../service/goverance.service';
import { filter, Subscription } from 'rxjs';
import {
  OverviewEntry,
  SharedOverviewComponent,
} from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';
import { ActivatedRoute } from '@angular/router';
import { SystemActionsComponent } from 'libs/shared/shared-ui/src/lib/system-actions/system-actions.component';

@Component({
  selector: 'lib-control-assessment-overview',
  imports: [CommonModule, SharedOverviewComponent, SystemActionsComponent],
  templateUrl: './control-assessment-overview.component.html',
  styleUrl: './control-assessment-overview.component.scss',
})
export class ControlAssessmentOverviewComponent {
  controlId: any = null;
  dataentityTypeId: any = '';
  constructor(
    private service: GoveranceService,
    private route: ActivatedRoute
  ) {
    const type = this.route.parent?.snapshot.paramMap
      .get('type')
      ?.toLowerCase();
    this.controlId = this.route.parent?.snapshot.paramMap.get('id');
    if (!type) return;
    switch (type) {
      case 'compliance':
        this.dataentityTypeId = 11;
        this.setComplianceViewEntries();
        break;
      case 'implementation':
        this.dataentityTypeId = 14;
        this.setImplementationViewEntries();
        break;
      case 'effectiveness':
        this.dataentityTypeId = 13;
        this.setEffectivenessViewEntries();
        break;
      case 'maturity':
        this.dataentityTypeId = 15;
        this.setMaturityViewEntries();
        break;
    }
  }

  loading: boolean = false;
  getData() {
    this.loading = true;
    this.dataSub = this.service.viewedData
      .pipe(filter((res) => !!res))
      .subscribe({
        next: (res: any) => {
          console.log('viewedData:', res);

          this.data = res?.data ? res.data : res;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }
  entries: OverviewEntry[] = [];
  data!: any;
  dataSub!: Subscription;
  setComplianceViewEntries() {
    const overviewEntries: OverviewEntry[] = [
      {
        key: 'govControlName',
        label: 'CONTROL_ASSESSMENT.GOV_CONTROL_NAME',
        type: 'text',
      },
      {
        key: 'controlComplianceStatusTypeName',
        label: 'CONTROL_ASSESSMENT.CONTROL_COMPLIANCE_STATUS_TYPE_NAME',
        type: 'badge',
        colorKey: 'controlComplianceStatusTypeColor',
      },
      {
        key: 'govControlAssessmentPhaseTypeName',
        label: 'CONTROL_ASSESSMENT.GOV_CONTROL_ASSESSMENT_PHASE_TYPE_NAME',
        type: 'text',
      },
      {
        key: 'govControlAssessmentWorkflowStageName',
        label: 'CONTROL_ASSESSMENT.GOV_CONTROL_ASSESSMENT_WORKFLOW_STAGE_NAME',
        type: 'text',
      },
      {
        key: 'assessmentDate',
        label: 'CONTROL_ASSESSMENT.ASSESSMENT_DATE',
        type: 'date',
      },

      {
        key: 'assessedByTitle',
        label: 'CONTROL_ASSESSMENT.ASSESSED_BY',
        type: 'user',
        // position: 'assessedByPosition',
        image: 'assessedByImage',
      },

      {
        key: 'evidenceReviewerUserTitle',
        label: 'CONTROL_ASSESSMENT.EVIDENCE_REVIEWER_USER',
        type: 'user',
        // position: 'evidenceReviewerUserPosition',
        image: 'evidenceReviewerUserImage',
      },
      {
        key: 'evidenceReviewDate',
        label: 'CONTROL_ASSESSMENT.EVIDENCE_REVIEW_DATE',
        type: 'date',
      },

      {
        key: 'risks',
        label: 'CONTROL_ASSESSMENT.RISKS',
        type: 'description',
      },
      {
        key: 'findings',
        label: 'CONTROL_ASSESSMENT.FINDINGS',
        type: 'description',
      },
      {
        key: 'recommendations',
        label: 'CONTROL_ASSESSMENT.RECOMMENDATIONS',
        type: 'description',
      },
      {
        key: 'assessedByDescription',
        label: 'CONTROL_ASSESSMENT.ASSESSED_BY_DESCRIPTION',
        type: 'description',
      },
      {
        key: 'evidenceReviewerUserDescription',
        label: 'CONTROL_ASSESSMENT.EVIDENCE_REVIEWER_USER_DESCRIPTION',
        type: 'description',
      },
    ];

    this.entries = overviewEntries;
  }

  setImplementationViewEntries() {
    const overviewEntries: OverviewEntry[] = [
      {
        key: 'govControlName',
        label: 'CONTROL_ASSESSMENT.GOV_CONTROL_NAME',
        type: 'text',
      },
      {
        key: 'govControlImplementationStatusTypeName',
        label: 'CONTROL_ASSESSMENT.GOV_CONTROL_IMPLEMENTATION_STATUS_TYPE_NAME',
        type: 'badge',
        colorKey: 'govControlImplementationStatusTypeColor',
      },
            {
        key: 'govControlAssessmentPhaseTypeName',
        label: 'CONTROL_ASSESSMENT.GOV_CONTROL_ASSESSMENT_PHASE_TYPE_NAME',
        type: 'text',
      },
      {
        key: 'govControlAssessmentWorkflowStageName',
        label: 'CONTROL_ASSESSMENT.GOV_CONTROL_ASSESSMENT_WORKFLOW_STAGE_NAME',
        type: 'text',
      },
      {
        key: 'assessmentDate',
        label: 'CONTROL_ASSESSMENT.ASSESSMENT_DATE',
        type: 'date',
      },
      {
        key: 'assessedByTitle',
        label: 'CONTROL_ASSESSMENT.ASSESSED_BY',
        type: 'user',
        // position: 'assessedByPosition',
        image: 'assessedByImage',
      },
      {
        key: 'evidenceReviewerUserTitle',
        label: 'CONTROL_ASSESSMENT.EVIDENCE_REVIEWER_USER',
        type: 'user',
        // position: 'evidenceReviewerUserPosition',
        image: 'evidenceReviewerUserImage',
      },
      {
        key: 'evidenceReviewDate',
        label: 'CONTROL_ASSESSMENT.EVIDENCE_REVIEW_DATE',
        type: 'date',
      },
      // description fields at the end
      {
        key: 'risks',
        label: 'CONTROL_ASSESSMENT.RISKS',
        type: 'description',
      },
      {
        key: 'findings',
        label: 'CONTROL_ASSESSMENT.FINDINGS',
        type: 'description',
      },
      {
        key: 'recommendations',
        label: 'CONTROL_ASSESSMENT.RECOMMENDATIONS',
        type: 'description',
      },
      {
        key: 'assessedByDescription',
        label: 'CONTROL_ASSESSMENT.ASSESSED_BY_DESCRIPTION',
        type: 'description',
      },
      {
        key: 'evidenceReviewerUserDescription',
        label: 'CONTROL_ASSESSMENT.EVIDENCE_REVIEWER_USER_DESCRIPTION',
        type: 'description',
      },
    ];

    this.entries = overviewEntries;
  }

  setEffectivenessViewEntries() {
    const overviewEntries: OverviewEntry[] = [
      {
        key: 'govControlName',
        label: 'CONTROL_ASSESSMENT.GOV_CONTROL_NAME',
        type: 'text',
      },
      {
        key: 'govControlEffectivenessStatusTypeName',
        label: 'CONTROL_ASSESSMENT.GOV_CONTROL_EFFECTIVENESS_STATUS_TYPE_NAME',
        type: 'badge',
        colorKey: 'govControlEffectivenessStatusTypeColor',
      },
      {
        key: 'govControlAssessmentPhaseTypeName',
        label: 'CONTROL_ASSESSMENT.GOV_CONTROL_ASSESSMENT_PHASE_TYPE_NAME',
        type: 'text',
      },
      {
        key: 'govControlAssessmentWorkflowStageName',
        label: 'CONTROL_ASSESSMENT.GOV_CONTROL_ASSESSMENT_WORKFLOW_STAGE_NAME',
        type: 'text',
      },
      {
        key: 'assessmentDate',
        label: 'CONTROL_ASSESSMENT.ASSESSMENT_DATE',
        type: 'date',
      },

      {
        key: 'assessedByName',
        label: 'CONTROL_ASSESSMENT.ASSESSED_BY',
        type: 'user',
        // position: 'assessedByPosition',
        image: 'assessedByImage',
      },

      {
        key: 'evidenceReviewerUserTitle',
        label: 'CONTROL_ASSESSMENT.EVIDENCE_REVIEWER_USER',
        type: 'user',
        // position: 'evidenceReviewerUserPosition',
        image: 'evidenceReviewerUserImage',
      },
      {
        key: 'evidenceReviewDate',
        label: 'CONTROL_ASSESSMENT.EVIDENCE_REVIEW_DATE',
        type: 'date',
      },

      {
        key: 'risks',
        label: 'CONTROL_ASSESSMENT.RISKS',
        type: 'description',
      },
      {
        key: 'findings',
        label: 'CONTROL_ASSESSMENT.FINDINGS',
        type: 'description',
      },
      {
        key: 'recommendations',
        label: 'CONTROL_ASSESSMENT.RECOMMENDATIONS',
        type: 'description',
      },
      {
        key: 'assessedByDescription',
        label: 'CONTROL_ASSESSMENT.ASSESSED_BY_DESCRIPTION',
        type: 'description',
      },
      {
        key: 'evidenceReviewerUserDescription',
        label: 'CONTROL_ASSESSMENT.EVIDENCE_REVIEWER_USER_DESCRIPTION',
        type: 'description',
      },
    ];

    this.entries = overviewEntries;
  }

  setMaturityViewEntries() {
    const overviewEntries: OverviewEntry[] = [
      {
        key: 'govControlName',
        label: 'CONTROL_ASSESSMENT.GOV_CONTROL_NAME',
        type: 'text',
      },
      {
        key: 'govControlMaturityLevelName',
        label: 'CONTROL_ASSESSMENT.GOV_CONTROL_MATURITY_LEVEL_NAME',
        type: 'badge',
        colorKey: 'govControlMaturityLevelColor',
      },

      {
        key: 'govControlAssessmentPhaseTypeName',
        label: 'CONTROL_ASSESSMENT.GOV_CONTROL_ASSESSMENT_PHASE_TYPE_NAME',
        type: 'text',
      },
      {
        key: 'govControlAssessmentWorkflowStageName',
        label: 'CONTROL_ASSESSMENT.GOV_CONTROL_ASSESSMENT_WORKFLOW_STAGE_NAME',
        type: 'text',
      },
      {
        key: 'assessmentDate',
        label: 'CONTROL_ASSESSMENT.ASSESSMENT_DATE',
        type: 'date',
      },

      {
        key: 'assessedByTitle',
        label: 'CONTROL_ASSESSMENT.ASSESSED_BY',
        type: 'user',
        // position: 'assessedByPosition',
        image: 'assessedByImage',
      },

      {
        key: 'evidenceReviewerUserTitle',
        label: 'CONTROL_ASSESSMENT.EVIDENCE_REVIEWER_USER',
        type: 'user',
        // position: 'evidenceReviewerUserPosition',
        image: 'evidenceReviewerUserImage',
      },
      {
        key: 'evidenceReviewDate',
        label: 'CONTROL_ASSESSMENT.EVIDENCE_REVIEW_DATE',
        type: 'date',
      },

      {
        key: 'risks',
        label: 'CONTROL_ASSESSMENT.RISKS',
        type: 'description',
      },
      {
        key: 'findings',
        label: 'CONTROL_ASSESSMENT.FINDINGS',
        type: 'description',
      },
      {
        key: 'recommendations',
        label: 'CONTROL_ASSESSMENT.RECOMMENDATIONS',
        type: 'description',
      },
      {
        key: 'assessedByDescription',
        label: 'CONTROL_ASSESSMENT.ASSESSED_BY_DESCRIPTION',
        type: 'description',
      },
      {
        key: 'evidenceReviewerUserDescription',
        label: 'CONTROL_ASSESSMENT.EVIDENCE_REVIEWER_USER_DESCRIPTION',
        type: 'description',
      },
    ];

    this.entries = overviewEntries;
  }

  ngOnInit() {
    this.getData();
  }
  ngOnDestroy() {
    this.dataSub.unsubscribe();
  }
      hasActions:boolean = true;
  onFoundAction(event:boolean){
    this.hasActions = event;
    console.log('hasActions', this.hasActions);
  }
}
