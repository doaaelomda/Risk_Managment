import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { EsclationService } from '../../services/esclation.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-esclation-view-container',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './esclation-view-container.component.html',
  styleUrl: './esclation-view-container.component.scss',
})
export class EsclationViewContainerComponent implements OnInit {
  steps: any[] = [];
  current_esclation_id!: string | null;
  currentStep = 1;

  constructor(
    private translateS: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private esclationS: EsclationService,
    private layoutService: LayoutService,
    private _PermissionSystemService:PermissionSystemService
  ) {

    this.layoutService.breadCrumbLinks.next([
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      {
        name: this.translateS.instant('ESCALATION.BREADCRUMB'),
        icon: '',
        routerLink: '/gfw-portal/escalation',
      },
      {
        name: this.translateS.instant('ESCALATION.LIST_TITLE'),
        icon: '',
        routerLink: '/gfw-portal/esclation/list',
      },
      {
        name: this.translateS.instant('ESCLATION.ESCLATION'),
        icon: '',
        routerLink: '',
      },
    ]);
  }

  ngOnInit(): void {
    this.subscribeToRoute();
    this.initSteps();
    this.subscribeToSteps();
    this.subscribeToActiveStep();
  }

  private subscribeToRoute(): void {
    this.activatedRoute.paramMap.subscribe((res) => {
      this.current_esclation_id = res.get('id');
    });
  }

  private subscribeToSteps(): void {
    this.esclationS.steps$.subscribe((steps) => {
      this.steps = steps;
    });
  }

  private subscribeToActiveStep(): void {
    this.esclationS.activeStep.subscribe((step) => {

      setTimeout(() => {
        this.currentStep = step;
      });
    });
  }

  private initSteps(): void {
    this.steps = [
      {
        name: this.translateS.instant('ESCLATION.ESCLATION'),
        id: 1,
        description: '-',
        icon: 'fi fi-rr-light-emergency-on',
        command: () => {
          this.router.navigate([
            `/gfw-portal/esclation/view/${this.current_esclation_id}/overview`,
          ]);
          this.currentStep = 1;
        },
        visible:()=>this._PermissionSystemService.can('ESCLATIONS' , 'ESCLATION' , 'VIEW')
      },
      {
        name: this.translateS.instant('ESCLATION.LEVELS'),
        id: 2,
        description: '-',
        icon: 'fi fi-rr-career-growth',
        command: () => {
          this.router.navigate([
            `/gfw-portal/esclation/view/${this.current_esclation_id}/esclation-levels`,
          ]);
          this.currentStep = 2;
          this.steps[1].description = '-';
        },
        visible:()=>this._PermissionSystemService.can('ESCLATIONS' , 'ESCLATIONLEVELS' , 'VIEW')
      },
      {
        name: this.translateS.instant('ESCLATION.CRITERIA'),
        id: 3,
        description: '-',
        icon: 'fi fi-rr-ballot',
        command: () => {
          // 
        },
        visible:()=>this._PermissionSystemService.can('ESCLATIONS' , 'ESCLATIONCRITERIA' , 'VIEW')
      },
      {
        name: this.translateS.instant('ESCLATION.ESCLATION_TARGET'),
        id: 4,
        description: '-',
        icon: 'fi fi-rr-bullseye-arrow',
        command: () => {
          // 
        },
        visible:()=>this._PermissionSystemService.can('ESCLATIONS' , 'ESCLATIONTARGET' , 'VIEW')
      },
      {
        name: this.translateS.instant('ESCLATION.ESCLATION_NOTFICATION'),
        id: 5,
        description: '-',
        icon: 'fi fi-rr-bell-notification-social-media',
        command: () => {
          // 
        },
        visible:()=>this._PermissionSystemService.can('ESCLATIONS' , 'ESCLATIONNOTIFICATION' , 'VIEW')
      },
    ];

    this.esclationS.setSteps(this.steps);
  }
}
