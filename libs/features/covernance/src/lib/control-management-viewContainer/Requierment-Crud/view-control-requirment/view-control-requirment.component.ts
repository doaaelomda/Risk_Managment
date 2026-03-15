import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  OverviewEntry,
  SharedOverviewComponent,
} from 'libs/shared/shared-ui/src/lib/shared-overview/shared-overview.component';
import { GoveranceService } from 'libs/features/covernance/src/service/goverance.service';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { SystemActionsComponent } from 'libs/shared/shared-ui/src/lib/system-actions/system-actions.component';

@Component({
  selector: 'lib-view-control-requirment',
  imports: [CommonModule, SharedOverviewComponent, SystemActionsComponent],
  templateUrl: './view-control-requirment.component.html',
  styleUrl: './view-control-requirment.component.scss',
})
export class ViewControlRequirmentComponent {
  dataReruirment: any;
  loadDataReruirment: boolean = false;
  requirementControl: any;
  govControlID: any;
  entries: OverviewEntry[] = [];
  entriesData: any;
  controlId: any;
  constructor(
    private _GovernanceService: GoveranceService,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _ActivatedRoute: ActivatedRoute
  ) {
    this.requirementControl =
      +this._ActivatedRoute.parent?.snapshot.paramMap.get('id')!;
    this.controlId =
      +this._ActivatedRoute.parent?.snapshot.paramMap.get('controlId')!;
    this.govControlID =
      +this._ActivatedRoute.parent?.snapshot.paramMap.get('govControlID')!;
    if (this.requirementControl) {
      this.getRequirmentData();
    }
  }
  getRequirmentData() {
    this.loadDataReruirment = true;
    this._GovernanceService
      .getRequirementControlsById(this.requirementControl)
      .subscribe({
        next: (res: any) => {
          this.dataReruirment = res?.data;
          this._LayoutService.breadCrumbLinks.next([
            { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
            {
              name: this._TranslateService.instant(
                'BREAD_CRUMB_TITLES.Governance'
              ),
              icon: '',
              routerLink: this.controlId
                ? `/gfw-portal/compliance/overViewDocument/${this.controlId}/content`
                : '/gfw-portal/governance/control-management/list',
            },
            {
              name: this._TranslateService.instant(
                'BREAD_CRUMB_TITLES.Control_Management'
              ),
              icon: '',
              routerLink: this.controlId
                ? `/gfw-portal/compliance/overViewDocument/${this.controlId}/content`
                : '/gfw-portal/governance/control-management/list',
            },
            {
              name: this._TranslateService.instant(
                'ControlRequirement.ControlRequirement'
              ),
              icon: '',
              routerLink: this.controlId
                ? `/gfw-portal/compliance/overViewDocument/${this.controlId}/content/${this.govControlID}/RequirementControl`
                : `/gfw-portal/governance/control-management/view/${this.govControlID}/Requirements`,
            },
            {
              name: this.dataReruirment?.requirementText,
              icon: '',
            },
          ]);
          this.entriesData = {
            requirementText: this.dataReruirment.requirementText,
            requirementTextAr: this.dataReruirment.requirementTextAr,
            responsibleUserName:
              this.dataReruirment.responsibleUser?.name || '-',
            responsibleRoleName:
              this.dataReruirment.responsibleRole?.roleName || '-',
            orderNumber: this.dataReruirment.orderNumber,
            externalReference: this.dataReruirment.externalReference,
            organizationalUnitName:
              this.dataReruirment.organizationalUnit?.name || '-',
          };

          this.entries = [
            {
              key: 'requirementText',
              label: 'ControlRequirement.TEXT_EN',
              type: 'text',
            },
            {
              key: 'requirementTextAr',
              label: 'ControlRequirement.TEXT_AR',
              type: 'text',
            },
            {
              key: 'responsibleUserName',
              label: 'VERSION.APPROVER_ASSIGNEE',
              type: 'text',
              id:'responsibleUserID'
            },
            {
              key: 'responsibleRoleName',
              label: 'VERSION.ROLE_ASSIGNEE',
              type: 'text',
              id:'responsibleRoleID'
            },
            {
              key: 'orderNumber',
              label: 'ControlRequirement.ORDER_NUMBER',
              type: 'number',
            },
            {
              key: 'externalReference',
              label: 'ControlRequirement.EXTERNAL_REF',
              type: 'text',
            },
            {
              key: 'organizationalUnitName',
              label: 'Control_view.Organizational_Unit',
              type: 'badge',
            },
          ];
          this.loadDataReruirment = false;
        },
        error: () => {
          this.dataReruirment = {};
        },
      });
  }
      hasActions:boolean = true;
  onFoundAction(event:boolean){
    this.hasActions = event;
    console.log('hasActions', this.hasActions);
  }
}
