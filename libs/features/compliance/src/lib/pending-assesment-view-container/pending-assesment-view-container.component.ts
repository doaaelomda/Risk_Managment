import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingAssessmentViewSideComponent } from './pending-assessment-view-side/pending-assessment-view-side.component';
import { PendingAssessmentViewOutletComponent } from './pending-assessment-view-outlet/pending-assessment-view-outlet.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { RequirmentAssessmentService } from '../../services/requirment-assessment.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'lib-pending-assesment-view-container',
  imports: [
    CommonModule,
    PendingAssessmentViewSideComponent,
    PendingAssessmentViewOutletComponent,
    TranslateModule,
  ],
  templateUrl: './pending-assesment-view-container.component.html',
  styleUrl: './pending-assesment-view-container.component.scss',
})
export class PendingAssesmentViewContainerComponent {
  nodeId: any;
  dataContentArray: any;
  constructor(
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private raService: RequirmentAssessmentService,
    private route:ActivatedRoute,
    private router:Router
  ) {
    this._LayoutService.breadCrumbLinks.next([
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.Compliance'),
        icon: '',
        routerLink: '/gfw-portal/compliance/pending-assessments',
      },
      {
        name: this._TranslateService.instant(
          'BREAD_CRUMB_TITLES.Pending_Assessment'
        ),
        icon: '',
      },
      // {
      //   name: this._TranslateService.instant(
      //     'BREAD_CRUMB_TITLES.Cybersecurity_Governance'
      //   ),
      //   icon: '',
      // },
    ]);
    this.nodeId=this.route.snapshot.queryParamMap.get('control');
  }
  handleNodeClick(data: any) {
    if (data?.data?.govControlID) {
      this.nodeId = data?.data?.govControlID;
    } else {
      this.nodeId = data?.govControlID;
    }
    this.setCurrentControlID(this.nodeId)
    this.raService.activeGovControl.set(data);
    console.log('this.govControlID:', data);
  }

  setCurrentControlID(controlId: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        control: controlId
      },
      queryParamsHandling: 'merge'
    });
  }


  current_assessment_data = signal<any>(null)
  setCurrentAssessmentData(event:any){
    this.current_assessment_data.set(event)
  }
}
