import { AwarenessService } from './../../../../../../awareness/src/services/awareness.service';
import { CommentSectionComponent } from 'libs/shared/shared-ui/src/lib/comment-section/comment-section.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { ActivatedRoute } from '@angular/router';
import { GoveranceService } from 'libs/features/covernance/src/service/goverance.service';
@Component({
  selector: 'lib-comment-control-requirment',
  imports: [CommonModule, CommentSectionComponent],
  templateUrl: './comment-control-requirment.component.html',
  styleUrl: './comment-control-requirment.component.scss',
})
export class CommentControlRequirmentComponent {
  requirementControl: any;
  controlRequirementData: any;
  loading: boolean = false;
  govControlID: any;
  controlId: any;
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _LayoutService: LayoutService,
    private _TranslateService: TranslateService,
    private _GovernanceService: GoveranceService
  ) {
    this.controlId =
      +this._ActivatedRoute.parent?.snapshot.paramMap.get('controlId')!;
    this.requirementControl =
      +this._ActivatedRoute.parent?.snapshot.paramMap.get('id')!;
    this.govControlID =
      +this._ActivatedRoute.parent?.snapshot.paramMap.get('govControlID')!;
    this.loading = true;
    if (this.requirementControl) {
      this._GovernanceService
        .getRequirementControlsById(this.requirementControl)
        .subscribe({
          next: (res: any) => {
            this.controlRequirementData = res?.data;
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
                name: this.controlRequirementData?.requirementText,
                icon: '',
                routerLink:this.controlId ? `/gfw-portal/compliance/overViewDocument/${this.controlId}/content/${this.govControlID}/RequirementControl/${this.requirementControl}/overview` :`/gfw-portal/governance/control-management/${this.govControlID}/Requirements/${this.requirementControl}/overview`
              },
              {
                name: this._TranslateService.instant('TABS.COMMENTS'),
                icon: '',
              },
            ]);
          },
          error: () => {
            this.controlRequirementData = {};
          },
        });
    }
  }
}
