import { Component, input, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ComplianceService } from '../../../compliance/compliance.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-pending-assessment-view-outlet',
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './pending-assessment-view-outlet.component.html',
  styleUrls: ['./pending-assessment-view-outlet.component.scss'],
})
export class PendingAssessmentViewOutletComponent implements OnChanges {
  @Input() nodeId: any;
  active_tab = 1;
  dataContentArray: any = {};
  tabs: any[] = [];
currentComplianceAssessment = input<any>()
  constructor(
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _complianceService: ComplianceService,
    private _PermissionSystemService:PermissionSystemService
  ) {
    this._LayoutService.breadCrumbLinks.next([
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.Compliance'),
        icon: '',
        routerLink: '//gfw-portal/compliance/pending-assessments',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.Pending_Assessment'),
        icon: '',
      },
      {
        name: this._TranslateService.instant('BREAD_CRUMB_TITLES.Cybersecurity_Governance'),
        icon: '',
      },
    ]);

    this.tabs = [
      { id: 1, name: this._TranslateService.instant('TABS.OVERVIEW'), router: 'overview',
        visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'ONGOINGASSSESSMENT_CONTROLS' , 'VIEW')

       },
      { id: 2, name: this._TranslateService.instant('TABS.EVIDENCES'), router: 'Evidences',
         visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'ONGOINGASSSESSMENT_CONTROLSEVIDENCES' , 'VIEW')
       },
      { id: 3, name: this._TranslateService.instant('TABS.EVIDENCE_TASK'), router: 'EvidenceTask',
                 visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'ONGOINGASSSESSMENT_CONTROLS_EVIDENCETASK' , 'VIEW')

       },
      { id: 4, name: this._TranslateService.instant('TABS.FINDINGS'), router: 'Findings',
        visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'ONGOINGASSSESSMENT_CONTROLS_FINDINGS' , 'VIEW')
       },
      { id: 5, name: this._TranslateService.instant('TABS.ASSESSMENT'), router: 'Assessment',
        visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'ONGOINGASSSESSMENT_CONTROLSASSESSMENT' , 'VIEW')
       },
      { id: 6, name: this._TranslateService.instant('TABS.CORRECTIVE_ACTION'), router: 'CorrectiveAction',
         visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'ONGOINGASSSESSMENT_CONTROLS_CORRECTIVEACTION' , 'VIEW')
       },
      { id: 7, name: this._TranslateService.instant('TABS.REQUIREMENT_CONTROL'), router: 'RequirementControl',
           visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'ONGOINGASSSESSMENT_CONTROLS_REQUIREMENTCONTROL' , 'VIEW') && this.currentComplianceAssessment()?.incluceRequirementAssessment
       },
      {
            name: this._TranslateService.instant('TABS.procedure'),
            router: 'procedure',
            icon: '',
                    visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'ONGOINGASSSESSMENT_CONTROLSPROCEDURE' , 'VIEW') && this.currentComplianceAssessment()?.incluceProcedureAssessment

          },
      { id: 8, name: this._TranslateService.instant('TABS.COMMENTS'), router: 'Comments',
              visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'ONGOINGASSSESSMENT_CONTROLS_COMMENTS' , 'VIEW')
       },
    ];
    this.getDataOfGovControl();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['nodeId'] && this.nodeId ) {
      this.getDataOfGovControl();
    }
  }

  getDataOfGovControl() {
    console.log('getDataOfGovControl from parent to child');
    if( this.nodeId ){
    this._complianceService.getOneGovControl(this.nodeId).subscribe((res) => {
      this.dataContentArray = res?.data;
      this._complianceService.setGovControlData(this.dataContentArray);

    });
  }
  }
}
