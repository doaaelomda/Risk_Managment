import { TagComponent } from './../../../../../shared/shared-ui/src/lib/tag/tag.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ComplianceAssessmntService } from '../../services/compliance-assessmnt.service';
import { SharedTabsComponent } from "libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component";
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-view-assessment',
  imports: [CommonModule, MenuModule, RouterOutlet, TranslateModule, SharedTabsComponent],
  templateUrl: './view-assessment.component.html',
  styleUrl: './view-assessment.component.scss',
})
export class ViewAssessmentComponent {
  tabs: any[] = [];
  assessmnetId: any;
  dataAssessmnetCompliance: any;
  constructor(
    private _TranslateService: TranslateService,
    private _LayoutService: LayoutService,
    private _activeRouter: ActivatedRoute,
    private ComplianceAssessmntService: ComplianceAssessmntService,
    private _PermissionSystemService:PermissionSystemService
  ) {
    this.tabs = [
      {
        id: 2,
        name: 'RISK_VIEW.CONTROL',
        icon: 'fi fi-rr-sign-in-alt',
        router: 'control',
        visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'ASSSESSMENT_CONTROLS' , 'VIEW')
      },
      {
        id: 5,
        name: 'RISK_VIEW.EVIDENCE_TASK',
        icon: 'fi fi-rs-assessment',
        router: 'evidence-Task',
         visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'ASSESSMENT_EVIDENCETASK' , 'VIEW')
      },
          {
        id: 6,
        name: 'TABS.EVIDENCES',
        icon: 'fi fi-rr-interrogation',
        router: 'evidences',
         visible: ()=> true
      },

      { id: 7, name: 'TABS.FINDINGS', icon:'fi fi-rr-search', router: 'Findings',
         visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'ASSESSMENT_FINDINGS' , 'VIEW')
      },
      { id: 8, name: 'TABS.CORRECTIVE_ACTION',icon:'fi fi-rr-registration-paper', router: 'CorrectiveAction',
         visible: ()=>this._PermissionSystemService.can('COMPLIANCE' , 'ASSESSMENT_CORREECTIVEACTION' , 'VIEW')
       },
    ];

    this._activeRouter?.paramMap.subscribe((params) => {
      this.assessmnetId = params?.get('id');
      this.ComplianceAssessmntService.getAssessmnetById(
        this.assessmnetId
      ).subscribe({
        next: (res) => {
          this.dataAssessmnetCompliance = res?.data;
          //              this._LayoutService.breadCrumbLinks.next([
          //   {
          //     name: '',
          //     icon: 'fi fi-rs-home',
          //     routerLink: '/',
          //   },
          //   {
          //     name: this._TranslateService.instant('BREAD_CRUMB_TITLES.Compliance'),
          //     icon: '',
          //     routerLink: '/gfw-portal/compliance/assessments',
          //   },
          //   {
          //     name: this._TranslateService.instant('TABS.ASSESSMENT'),
          //     icon: '',
          //     routerLink: '/gfw-portal/compliance/assessments',
          //   },
          //     {
          //     name: this.dataAssessmnetCompliance?.name,
          //     icon: '',
          //     routerLink: `/gfw-portal/compliance/assessments/view/${this.assessmnetId}/overview`,
          //   },
          // ]);
        },
      });
    });
  }
}
