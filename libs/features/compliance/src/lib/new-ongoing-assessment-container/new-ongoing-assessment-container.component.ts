import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingAssessmentViewSideComponent } from '../pending-assesment-view-container/pending-assessment-view-side/pending-assessment-view-side.component';
import { AssessmentItemResultViewComponent } from './assessment-item-result-view/assessment-item-result-view.component';
import { AccordionModule } from 'primeng/accordion';
import { ITabs } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'lib-new-ongoing-assessment-container',
  imports: [
    CommonModule,
    PendingAssessmentViewSideComponent,
    AssessmentItemResultViewComponent,
    AccordionModule,
  ],
  templateUrl: './new-ongoing-assessment-container.component.html',
  styleUrl: './new-ongoing-assessment-container.component.scss',
})
export class NewOngoingAssessmentContainerComponent {
  constructor(private route: ActivatedRoute, private router: Router) {
    this.mode = this.route.snapshot.data['mode'] ?? 'full-access'
  }
  setCurrentAssessmentData(event: any) {
    //

    console.log('setCurrentAssessmentData', event);
  }
  mode:string = 'full-access'
  assessmentItemResultID: any[] = [];


  current_node_data:any;
  handleNodeClick(event: any) {

    this.current_node_data = event.data;
        this.assessmentItemResultID = event.data.assessmentResults;
        this.activeIndex = this.assessmentItemResultID.length -1
  }

  activeIndex!: number;
  handleActiveTab(index: number | number[]) {
    //
  }
}
