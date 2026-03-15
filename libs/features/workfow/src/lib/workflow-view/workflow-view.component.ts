import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { WorkflowService } from '../../services/workflow.service';
import { TranslateService } from '@ngx-translate/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
@Component({
  selector: 'lib-workflow-view',
  imports: [CommonModule, RouterOutlet, MenuModule],
  templateUrl: './workflow-view.component.html',
  styleUrl: './workflow-view.component.scss',
})
export class WorkflowViewComponent {
  constructor(
    private _WorkflowService: WorkflowService,
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _translateS:TranslateService,
    private _PermissionSystemService:PermissionSystemService
  ) {
    this._ActivatedRoute.paramMap.subscribe((res) => {
      this.current_workflow_id = res?.get('id');
    });

    this._WorkflowService.dynamic_steps_subject.subscribe((res: any) => {
      if (res) {
        this.currentStep = res?.step;
        if (res?.steper?.length) {
           this.steps[0].description = res?.steper[0]?.description ?? '-';
          this.steps[1].description = res?.steper[1]?.description ?? '-';
          this.steps[2].description = res?.steper[2]?.description ?? '-';
          // this.steps[0].command = res?.steper[0]?.command;
          this.steps[1].command = res?.steper[1]?.command;
          this.steps[2].command = res?.steper[2]?.command;
        }
      }
    });

    this.steps = [
      {
        name: this._translateS.instant('WORKFLOW_STEPS.STEPPER.WORKFLOW'),
        id: 1,
        description:'-',
        icon: 'fi fi-rr-department-structure',
        command: () => {
          //
          this._Router.navigate([
            `/gfw-portal/setting/workflow/${this.current_workflow_id}/info`,
          ]);
          this.currentStep = 1;
        },
        visible: ()=> this._PermissionSystemService.can('WORKFLOW', 'WORKFLOW', 'VIEW')
      },
      {
        name: this._translateS.instant('WORKFLOW_STEPS.STEPPER.DEFINE_STEPS'),
        id: 2,
        description: '-',
        // icon: 'fi fi-rr-supply-chain-steps',
        imgActive:'images/icons/supply-chain-steps.svg',
        imgNoActive:'images/icons/chain-steps_nonActive.svg',
        command: () => {
          //
          this._Router.navigate([
            `/gfw-portal/setting/workflow/${this.current_workflow_id}/steps`,
          ]);
          this.currentStep = 2;
          this.steps[1].description = '-';
        },
        visible: ()=> this._PermissionSystemService.can('WORKFLOW', 'STEPS', 'VIEW')
      },
      {
        name: this._translateS.instant('WORKFLOW_STEPS.STEPPER.SET_DECISIONS'),
        id: 3,
        description:'-',
        icon: 'fi fi-rr-condition-alt',
        // visible: ()=> this._PermissionSystemService.can('WORKFLOW', 'SETDECISIONS', 'VIEW')
         visible: ()=>true
      },
      {
        name: this._translateS.instant('WORKFLOW_STEPS.STEPPER.DEFINE_ACTIONS'),
        id: 4,
        description: '-',
        icon: 'fi fi-rr-tools',
        // visible: ()=> this._PermissionSystemService.can('WORKFLOW','DEFINEACTIONS', 'VIEW')
        visible: ()=>true
      },

    ];
  }

  current_workflow_id: any;
  steps: any = [];

  currentStep = 1;
}
