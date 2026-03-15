import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ITabs,
  SharedTabsComponent,
} from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { TranslateService } from '@ngx-translate/core';
import { MenuModule } from 'primeng/menu';
import { ControlsService } from '../../../services/controls-service.service';
import { ActivatedRoute } from '@angular/router';
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { finalize } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
export interface IControl {
  governanceStandardControlID: number;
  governanceStandardControlCode: string;
  name: string;
  nameAr: string;
  objective: string;
  objectiveAr: string;
  notes: string;
  guides: string;
  guidesAr: string;
  governanceStandardID: number;
  governanceStandardName: string;
  parentID: number;
  parentName: string;
  shortName: string;
  shortNameAr: string;
  description: string;
  descriptionAr: string;
  parentCode: string;
  orderNumber: number;
  complianceDocumentElementTypeID: number;
  complianceDocumentElementTypeName: string;
  complianceDocumentElementTypeColor: string;
}
@Component({
  selector: 'lib-view-standard-controls',
  imports: [CommonModule, SharedTabsComponent, MenuModule, SkeletonModule],
  templateUrl: './view-standard-controls.component.html',
  styleUrl: './view-standard-controls.component.scss',
})
export class ViewStandardControlsComponent {
  constructor(
    private translateService: TranslateService,
    private controlsService: ControlsService,
    private route: ActivatedRoute,
    private layoutService: LayoutService,
    private _PermissionSystemService:PermissionSystemService
  ) {
    this.tabs = [
      {
        name: this.translateService.instant(
          'ControlRequirement.ControlRequirement'
        ),
        router: 'requirements',
        icon: 'fi fi-rs-code-compare',
        visible: ()=>this._PermissionSystemService.can('LIBRARY' , 'STANDARDDOCUMENTS_CONTROLS_REQUIREMENTS' , 'VIEW')

      },
           {
        name: this.translateService.instant(
          'ControlRequirement.LINKED_EVIDENCE'
        ),
        router: 'linked-evidence',
        icon: 'fi fi-rr-assessment',
        visible: ()=>this._PermissionSystemService.can('LIBRARY' , 'STANDARDDOCUMENTS_CONTROLSLINKEDEVIDENCE' , 'VIEW')

      },
    ];

    const id = this.route.snapshot?.paramMap.get('id');
    if (id) this.getData(+id);
  }

  tabs: ITabs[] = [];

  data!: IControl;
  loading: boolean = false;
  getData(id: number) {
    this.loading = true;
    this.controlsService.loadingData.set(true);
    this.controlsService
      .getControlById(id)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.controlsService.loadingData.set(false);
        })
      )
      .subscribe({
        next: (res: unknown) => {
          console.log(res, 'got data');
          if (typeof res === 'object' && res && 'data' in res) {
            this.data = res.data as IControl;
            this.setBreadCrumb(this.data);
            this.controlsService.data.set(this.data);
          }
        },
      });
  }

  setBreadCrumb(data: IControl) {
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
        name: data?.name || '-',
      },
    ];
    this.layoutService.breadCrumbLinks.next(breadCrumb);
  }
}
