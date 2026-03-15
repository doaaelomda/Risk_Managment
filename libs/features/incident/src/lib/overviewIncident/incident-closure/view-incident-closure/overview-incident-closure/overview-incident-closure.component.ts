import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, finalize, Subscription } from 'rxjs';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ClosureService } from 'libs/features/incident/src/services/closure.service';
import {
  OverviewEntry,
  SharedOverviewComponent,
} from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';
import { SystemActionsComponent } from 'libs/shared/shared-ui/src/lib/system-actions/system-actions.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lib-overview-incident-closure',
  imports: [CommonModule, SharedOverviewComponent, SystemActionsComponent],
  templateUrl: './overview-incident-closure.component.html',
  styleUrl: './overview-incident-closure.component.scss',
})
export class OverviewIncidentClosureComponent {
  constructor(private service: ClosureService, private route: ActivatedRoute) {
    const id = this.route.snapshot.parent?.paramMap.get('id');
    if (!id) return;
    this.id = +id;
  }
  id!: number;
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
  entries: OverviewEntry[] = [
    {
      key: 'closureDate',
      label: 'INCIDENT.CLOSURE_DATE',
      type: 'date',
    },
    {
      key: 'closureMethod',
      label: 'INCIDENT.CLOSURE_METHOD',
      type: 'text',
    },

    {
      key: 'verificationDate',
      label: 'INCIDENT.VERIFICATION_DATE',
      type: 'date',
    },
    {
      key: 'monitoringPeriod',
      label: 'INCIDENT.MONITORING_PERIOD',
      type: 'number',
    },
    {
      key: 'closureApprovalDate',
      label: 'INCIDENT.CLOSURE_APPROVAL_DATE',
      type: 'date',
    },

    {
      key: 'isRiskReassessed',
      label: 'INCIDENT.RISK_REASSESSED',
      type: 'boolean',
    },
    {
      key: 'timeToDetect',
      label: 'INCIDENT.TIME_TO_DETECT',
      type: 'number',
    },
    {
      key: 'timeToResolve',
      label: 'INCIDENT.TIME_TO_RESOLVE',
      type: 'number',
    },
    {
      key: 'timeToClose',
      label: 'INCIDENT.TIME_TO_CLOSE',
      type: 'number',
    },
    {
      key: 'slaComplianceStatus',
      label: 'INCIDENT.SLA_COMPLIANCE_STATUS',
      type: 'boolean',
    },
    {
      key: 'costOfIncident',
      label: 'INCIDENT.COST_OF_INCIDENT',
      type: 'number',
    },

    {
      key: 'isFinalClosure',
      label: 'INCIDENT.IS_FINAL_CLOSURE',
      type: 'boolean',
    },
    {
      key: 'incidentClosureStatusTypeName',
      label: 'INCIDENT.CLOSURE_STATUS_TYPE_NAME',
      type: 'text',
    },
    {
      key: 'closedByUserName',
      label: 'INCIDENT.CLOSED_BY_USER_NAME',
      type: 'user',
      id:'closedByUserID'
    },
    {
      key: 'resolutionSummary',
      label: 'INCIDENT.RESOLUTION_SUMMARY',
      type: 'description',
    },
    {
      key: 'closureApprovalComment',
      label: 'INCIDENT.CLOSURE_APPROVAL_COMMENT',
      type: 'description',
    },
    {
      key: 'notes',
      label: 'INCIDENT.NOTES',
      type: 'description',
    },
  ];

  data!: any;
  dataSub!: Subscription;
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
