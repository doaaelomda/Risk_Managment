import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { InvestigationService } from 'libs/features/incident/src/services/investigation.service';
import { filter, finalize, Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { OverviewEntry, SharedOverviewComponent } from "libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component";
import { SystemActionsComponent } from "libs/shared/shared-ui/src/lib/system-actions/system-actions.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lib-overview-invest',
  imports: [CommonModule, TranslateModule, SharedOverviewComponent, SystemActionsComponent],
  templateUrl: './overview-invest.component.html',
  styleUrl: './overview-invest.component.scss',
})
export class OverviewInvestComponent {
      constructor(private service:InvestigationService,private route:ActivatedRoute){
        const id = this.route.snapshot.parent?.paramMap.get('investigationId')
        if(!id)return
        this.id = +id

      }
      id!:number
entries: OverviewEntry[] = [
  { key: 'name', label: 'LOOKUP.NAME', type: 'text' },
  { key: 'investigationTypeName', label: 'INVESTIGATIONS.TYPE', type: 'text' },
  { key: 'investigationStatusTypeName', label: 'INVESTIGATIONS.STATUS_TYPE', type: 'text' },
  { key: 'threatActorTypeName', label: 'INVESTIGATIONS.THREAD_ACTOR_TYPE', type: 'text' },
  { key: 'leadInvestigatorName', label: 'INVESTIGATIONS.LEAD_USER', type: 'user',id:'leadInvestigatorUserID' },
  { key: 'startedAt', label: 'INVESTIGATIONS.STARTED_AT', type: 'date' },
  { key: 'completedAt', label: 'INVESTIGATIONS.COMPLETED_AT', type: 'date' },
  { key: 'investigationScope', label: 'INVESTIGATIONS.SCOPE', type: 'text' },
  { key: 'attackVector', label: 'INVESTIGATIONS.ATTACK_VECTOR', type: 'text' },
  { key: 'detectionSource', label: 'INVESTIGATIONS.DETECTION_SOURCE', type: 'text' },
  { key: 'ioCs', label: 'INVESTIGATIONS.IOCS', type: 'text' },
  { key: 'affectedAssets', label: 'INVESTIGATIONS.AFFECTED_ASSETS', type: 'text' },
  { key: 'containmentActions', label: 'INVESTIGATIONS.CONTAINMENT_ACTIONS', type: 'text' },
  { key: 'eradicationActions', label: 'INVESTIGATIONS.ERADICATION_ACTIONS', type: 'text' },
  { key: 'recoveryActions', label: 'INVESTIGATIONS.RECOVERY_ACTIONS', type: 'text' },
  { key: 'impactAssessment', label: 'INVESTIGATIONS.IMPACT_ASSESSMENT', type: 'text' },
  { key: 'dataExposureFlag', label: 'INVESTIGATIONS.DATA_EXPOSURE_FLAG', type: 'text' },
  { key: 'reportedToAuthorityFlag', label: 'INVESTIGATIONS.REPORTED_TO_AUTHORITY_FLAG', type: 'text' },
  { key: 'reportReferenceNumber', label: 'INVESTIGATIONS.REPORT_REFERENCE_NUMBER', type: 'text' },
  { key: 'description', label: 'LOOKUP.DESCRIPTION', type: 'description' }
];

    loading:boolean = false
    getData(){
      this.loading = true
this.dataSub = this.service.viewedData.pipe(filter((res) => !!res)).subscribe({
  next: (res) => {
    this.data = res;
    this.loading = false;
  },
  error: () => {
    this.loading = false;
  }
});    }
    data!:any
    dataSub!:Subscription
    ngOnInit(){
      this.getData()
    }
    ngOnDestroy(){
      this.dataSub.unsubscribe()
    }

        hasActions:boolean = true;
  onFoundAction(event:boolean){
    this.hasActions = event;
    console.log('hasActions', this.hasActions);
  }
}
