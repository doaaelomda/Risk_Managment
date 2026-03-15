import {
  ITabs,
  SharedTabsComponent,
} from './../../../../../../shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import {
  ActivatedRoute,
  RouterOutlet,
} from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { MothodologyService } from '../../../services/methodology.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-methodology-view',
  imports: [CommonModule, RouterOutlet, SharedTabsComponent],
  templateUrl: './methodology-view.component.html',
  styleUrl: './methodology-view.component.scss',
})
export class MethodologyViewComponent {
  constructor(
    private _translateS: TranslateService,
    private _activatedRoute: ActivatedRoute,
    private _methodologyS: MothodologyService,
    private layout: LayoutService,
    private _PermissionSystemService:PermissionSystemService
  ) {}

  private initBreadcrumb(): void {
    const containerKey = 'BREAD_CRUMB_TITLES.METHODOLOGY';
    this.setBreadcrumb(containerKey, [
      { nameKey: containerKey },
      {
        nameKey: 'METHODOLOGY.METHODOLOGYS_LIST',
        routerLink: '/gfw-portal/risks-management/methodolgy/list',
      },
      { nameKey: this.data?.name || '-' },
    ]);
  }

  private setBreadcrumb(
    titleKey: string,
    links: { nameKey: string; icon?: string; routerLink?: string }[]
  ): void {
    this.layout.breadCrumbTitle.next(this._translateS.instant(titleKey));
    const translatedLinks = [
      { name: '', icon: 'fi fi-rs-home', routerLink: '/' },
      ...links.map((link) => ({
        name: this._translateS.instant(link.nameKey),
        icon: link.icon ?? '',
        ...(link.routerLink ? { routerLink: link.routerLink } : {}),
      })),
    ];
    this.layout.breadCrumbLinks.next(translatedLinks);
    this.layout.breadCrumbAction.next(null);
  }
  ngOnInit() {
    this.handleTabs();
    this.getById();
  }
  id: string = '';
  getById() {
    this._activatedRoute.paramMap.subscribe((res: any) => {
      this.id = res.get('id');
      if (!this.id) return;
      this.getSectionById(this.id);
    });
  }

  loadingData: boolean = false;
  data!: any;
  getSectionById(id: string) {
    this.loadingData = true;
    this._methodologyS.getById(id).subscribe((res) => {
      const template_data = res?.data;
      this.data = template_data;
      this._methodologyS.viewedData.next(this.data);
      this.loadingData = false;
      this.initBreadcrumb();
      console.log(template_data, 'tdata');
    });
  }
  ngOnDestroy() {
    this._methodologyS.viewedData.next(null);
  }
  tabs: ITabs[] = [];
  handleTabs() {
    this.tabs = [
       {
        name: 'TABS.factor',
        icon: 'fi fi-rr-diagram-project',
        router: 'factors',
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGYFACTORS' , 'VIEW')

      },
      {
        name: 'TABS.LIKEHOODS',
        icon: 'fi-rr-chart-histogram',
        router: 'likehoods',
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGYLIKEHOOD' , 'VIEW')

      },
      {
        name: 'TABS.IMPACTS',
        icon: 'fi-rr-bolt',
        router: 'impacts',
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGYIMPACT' , 'VIEW')

      },
      {
        name: 'TABS.LEVELS',
        icon: 'fi fi-rr-layers',
        router: 'levels',
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGYLEVELS' , 'VIEW')

      },
      {
        name: 'TABS.FORMULA',
        icon: 'fi fi-rr-function',
        router: 'formula',
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'RISKASSESSMENTFORMULA' , 'VIEW')

      },
      {
        name:"Control Assessment  Levels",
        icon:"fi fi-rr-layers",
        router:'assessment-levels',
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGYCONTROLASSESSMENTLEVELS' , 'VIEW')

      },
      {
        name: 'TABS.APPETITE',
        icon: 'fi fi-rr-bullseye-pointer',
        router: 'appetite',
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGYAPPETITE' , 'VIEW')

      },
      {
        name: 'TABS.TOLERANCE',
        icon: 'fi fi-rr-handshake',
        router: 'tolerance',
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGYTOLERANCE' , 'VIEW')

      },
            {
        name: 'TABS.EffectivenessFormula',
        icon: 'fi fi-rr-function',
        router: 'effectivenessFormula',
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGYEFFECTIVEFORMULA' , 'VIEW')

      },
      {
        name:"Control Effectiviness  Levels",
        icon:"fi fi-rr-layers",
        router:'effectiviness-levels',
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'METHODOLOGYCONTROLEFFECTIVENESSLEVELS' , 'VIEW')

      },
    ];
  }
}
