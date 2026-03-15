import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { MethodologyFormulaService } from '../../../services/methodology-formula.service';
import { SharedTabsComponent } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-methodolgy-formula-view',
  imports: [CommonModule, RouterOutlet,SharedTabsComponent],
  templateUrl: './methodolgy-formula-view.component.html',
  styleUrl: './methodolgy-formula-view.component.scss',
})
export class MethodolgyFormulaViewComponent {
        constructor(
    private _translateS: TranslateService,
    private _activatedRoute: ActivatedRoute,
    private service: MethodologyFormulaService,
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
      {
        nameKey: this.data?.riskMethodologyName,
        routerLink: `/gfw-portal/risks-management/methodolgy/${this.data?.riskMethodologyID}`,
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
    this.getFormulaId();
  }
  id: any = '';
  getFormulaId() {
    this._activatedRoute.paramMap.subscribe((res: any) => {
      this.id = res.get('formula_id');

      if (!this.id) return;
      this.getFormulaById(this.id);
    });
  }

  loadingData: boolean = false;
  data!: any;
  getFormulaById(id: string) {
    this.loadingData = true;
    this.service.getById(id).subscribe((res) => {
      const formulaData = res?.data;
      this.data = formulaData;
      this.service.viewedData.next(this.data)
      this.loadingData = false;
      this.initBreadcrumb();
      console.log(formulaData, 'tdata');
    });
  }
  ngOnDestroy(){
    this.service.viewedData.next(null)
  }
  tabs: any[] = [];
  handleTabs() {
    this.tabs = [
      // {
      //   id: 1,
      //   name: this._translateS.instant('TABS.OVERVIEW'),
      //   icon: 'fi-rr-apps',
      //   router: 'overview',
      // },
      {
        id:2,
        name:"Formula Factors",
        icon:'fi fi-rr-diagram-project',
        router:'factors',
        visible: ()=>this._PermissionSystemService.can('RISKS' , 'RISKASSESSMENTFORMULAFACTORS' , 'VIEW')
      }
    ];
}
}
