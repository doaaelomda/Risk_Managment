import { OngoingAssessmentsEvidencesComponent } from '../../pending-assessment-view-container/ongoing-assessments-evidences/ongoing-assessments-evidences.component';
import {
  Component,
  effect,
  input,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NewOngoingAssessmentOverviewComponent } from '../new-ongoing-asssessment-overview/new-ongoing-assessment-overview.component';
import { ItemResultEvidanceTaskComponent } from './item-result-evidance-task/item-result-evidance-task.component';
import { ItemResultFindingComponent } from './item-result-finding/item-result-finding.component';
import { ItemResultCorrectiveActionComponent } from './item-result-corrective-action/item-result-corrective-action.component';
@Component({
  selector: 'lib-assessment-item-result-view',
  imports: [CommonModule, TranslateModule],
  templateUrl: './assessment-item-result-view.component.html',
  styleUrl: './assessment-item-result-view.component.scss',
})
export class AssessmentItemResultViewComponent implements AfterViewInit {
  constructor(private router: Router, private route: ActivatedRoute) {
    effect(() => {
      if(this.assessmentItemResultID() && this.node_data()){
        console.log("Node data " , this.node_data());

        this.current_selected_tab = this.tabs[0].id;
        this.vcr?.clear();
        const comp = this.vcr?.createComponent(
          NewOngoingAssessmentOverviewComponent
        );
        comp?.setInput('assessmentItemResultID', this.assessmentItemResultID());
        comp?.setInput('mode',this.mode())
        // comp?.setInput('profileId', this.node_data()?.complianceAssessmentItemResultStatusTypeProfileID);
      }
    });
  }

  node_data = input<any>(null);
  mode = input<string>('');
   assessmentItemResultID= input<any>(null);

  @ViewChild('tabContent', { read: ViewContainerRef }) vcr!: ViewContainerRef;

  ngAfterViewInit(): void {
    if (this.assessmentItemResultID()) {
      const comp = this.vcr.createComponent(
        NewOngoingAssessmentOverviewComponent
      );
   comp?.setInput('assessmentItemResultID', this.assessmentItemResultID());
   comp?.setInput('mode',this.mode())
      // comp.setInput('profileId', this.node_data()?.complianceAssessmentItemResultStatusTypeProfileID);
    }
  }

  tabs: any[] = [
    {
      id: 1,
      name: 'TABS.OVERVIEW',
      icon: 'fi-rr-apps',
      setActive: (id: any) => {
        this.current_selected_tab = id;
        this.vcr.clear();
        const comp = this.vcr.createComponent(
          NewOngoingAssessmentOverviewComponent
        );
        comp.setInput('assessmentItemResultID', this.assessmentItemResultID());
        comp.setInput('mode',this.mode())
        // comp.setInput('profileId', this.node_data()?.complianceAssessmentItemResultStatusTypeProfileID);
      },
    },
    {
      id: 2,
      name: 'ON_GOING_ASSESSMENTS.EVIDENCE_TASKS',
      icon: '',
      setActive: (id: any) => {
        this.current_selected_tab = id;
        this.vcr.clear();
        const comp = this.vcr.createComponent(
          ItemResultEvidanceTaskComponent
        );
        comp.setInput('entityID', this.assessmentItemResultID());
        comp.setInput('mode',this.mode())
      },
    },
    {
      id: 5,
      name: 'ON_GOING_ASSESSMENTS.EVIDENCES',
      icon: '',
      setActive: (id: any) => {
        this.current_selected_tab = id;
        this.vcr.clear();
        const comp = this.vcr.createComponent(
          OngoingAssessmentsEvidencesComponent
        );
        comp.setInput('assessmentItemResultID', this.assessmentItemResultID());
        comp.setInput('mode',this.mode())
      },
    },
    {
      id: 3,
      name: 'ON_GOING_ASSESSMENTS.FINDINGS',
      icon: '',
      setActive: (id: any) => {
        this.current_selected_tab = id;
        this.vcr.clear();
        const comp = this.vcr.createComponent(
          ItemResultFindingComponent
        );
        comp.setInput('entityID', this.assessmentItemResultID());
        comp.setInput('mode',this.mode())
      },
    },
    {
      id: 4,
      name: 'ON_GOING_ASSESSMENTS.CORRECTIVE_ACTIONS',
      icon: '',
      setActive: (id: any) => {
        this.current_selected_tab = id;
        this.vcr.clear();
        const comp = this.vcr.createComponent(
          ItemResultCorrectiveActionComponent
        );
        comp.setInput('entityID', this.assessmentItemResultID());
        comp.setInput('mode',this.mode())
      },
    },
  ];

  current_selected_tab: any = null;
}
