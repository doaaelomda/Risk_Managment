import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedTabsComponent } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { MenuModule } from 'primeng/menu';
import { ControlEvaluationService } from 'libs/features/risks/src/services/control-evaluation.service';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { C } from '@angular/cdk/scrolling-module.d-ud2XrbF8';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';

@Component({
  selector: 'lib-evaluation-view',
  imports: [CommonModule, SharedTabsComponent, MenuModule],
  templateUrl: './evaluation-view.component.html',
  styleUrl: './evaluation-view.component.scss',
})
export class EvaluationViewComponent {
  constructor(
    private evaluationService: ControlEvaluationService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private layoutService: LayoutService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    const riskID = this.route.snapshot.paramMap.get('riskID');
    const assessmentID = this.route.snapshot.paramMap.get('assID');
    
    if (!id) return;
    this.getEvaluationDetails(+id);
    if(!riskID || !assessmentID)return
    this.initBreadCrumb(+assessmentID,+riskID)
  }

  loading: boolean = true;
  data: any;
  getEvaluationDetails(id: number) {
    this.evaluationService.loadingData.set(this.loading);
    this.evaluationService
      .getDetails(id)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.evaluationService.loadingData.set(this.loading);
        })
      )
      .subscribe({
        next: (res: unknown) => {
          if (res && typeof res === 'object' && 'data' in res) {
            this.data = res.data;
            this.evaluationService.viewedData.set(this.data);
          }
        },
      });
  }

  initBreadCrumb(
    riskAssessmentID: number,
    riskID: number,
    evaluationId?: number
  ) {
    const breadCrumb = [
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this.translateService.instant(
          'BREAD_CRUMB_TITLES.RISK_MANGEMENT'
        ),
        routerLink: '/gfw-portal/risks-management/risks-list',
      },
      {
        name: 'Risk List',
        icon: '',
        routerLink: '/gfw-portal/risks-management/risks-list',
      },
      {
        name: this.translateService.instant('EVALUATION.EVALUATIONS_LIST'),
        routerLink: `/gfw-portal/risks-management/risk/${riskID}/assessment/${riskAssessmentID}/control-evaluations`,
      },
      {
        name: this.translateService.instant(
          'EVALUATION.EVALUATION'
        ),
        routerLink: '',
      },
    ];

    this.layoutService.breadCrumbLinks.next(breadCrumb);
  }
}
