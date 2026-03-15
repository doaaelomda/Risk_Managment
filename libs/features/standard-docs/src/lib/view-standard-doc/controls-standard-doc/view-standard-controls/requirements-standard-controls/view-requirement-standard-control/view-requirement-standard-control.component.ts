import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ITabs,
  SharedTabsComponent,
} from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { MenuModule } from 'primeng/menu';
import { finalize } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { StandardDocsRequirementsService } from 'libs/features/covernance/src/service/standard-docs-requirements.service';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SkeletonModule } from "primeng/skeleton";
export interface IControlRequirement {
  governanceStandardControlRequirementID: number;
  governanceStandardControlID: number;
  requirementText: string;
  requirementTextAr: string;
  orderNumber: number;
  externalReference: string;
  governanceStandardControlName: string;
  governanceStandardName: string;
  governanceStandardID: number;
}
@Component({
  selector: 'lib-view-requirement-standard-control',
  imports: [CommonModule, SharedTabsComponent, MenuModule, SkeletonModule],
  templateUrl: './view-requirement-standard-control.component.html',
  styleUrl: './view-requirement-standard-control.component.scss',
})
export class ViewRequirementStandardControlComponent {
  constructor(
    private translateService: TranslateService,
    private requirementsService: StandardDocsRequirementsService,
    private route: ActivatedRoute,
    private layoutService: LayoutService
  ) {


    const id = this.route.snapshot?.paramMap.get('id');
    if (id) this.getData(+id);
  }

  tabs: ITabs[] = [];

  data!: IControlRequirement;
  loading: boolean = false;
  getData(id: number) {
    this.loading = true;
    this.requirementsService.loadingData.set(true);
    this.requirementsService
      .getRequirementControlsById(id)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.requirementsService.loadingData.set(false);
        })
      )
      .subscribe({
        next: (res: unknown) => {
          console.log(res, 'got data');
          if (typeof res === 'object' && res && 'data' in res) {
            this.data = res.data as IControlRequirement;
            this.setBreadCrumb(this.data);
            this.requirementsService.data.set(this.data);
          }
        },
      });
  }

  setBreadCrumb(data: any) {
    const breadCrumb = [
      {
        name: this.translateService.instant(
          'BREAD_CRUMB_TITLES.GOVERNANCE_STANDARDS'
        ),
      },
      {
        name: this.translateService.instant(
          'GOVERNANCE_STANDARDS.DOCUMENTS_LIST'
        ),
        routerLink: '/gfw-portal/library/standard-docs/list',
      },
      {
        name: data?.governanceStandardName || '-',
        routerLink: `/gfw-portal/library/standard-docs/${data?.governanceStandardID}/controls`,
      },
      {
        name: data?.governanceStandardControlName || '-',
        routerLink: `/gfw-portal/library/standard-docs/${data?.governanceStandardID}/controls/${data?.governanceStandardControlID}/requirements`,
      },
      {
        name: data?.requirementText || '-',
      },
    ];
    this.layoutService.breadCrumbLinks.next(breadCrumb);
  }
}
