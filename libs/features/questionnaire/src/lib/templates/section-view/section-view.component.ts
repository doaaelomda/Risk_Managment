import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { SectionsService } from '../../services/sections.service';
import { SkeletonModule } from "primeng/skeleton";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SharedTabsComponent } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-section-view',
  imports: [CommonModule, SkeletonModule,RouterOutlet,TranslateModule,SharedTabsComponent],
  templateUrl: './section-view.component.html',
  styleUrl: './section-view.component.scss',
})
export class SectionViewComponent {
  constructor(
    private _translateS: TranslateService,
    private _activatedRoute: ActivatedRoute,
    private _sectionS: SectionsService,
    private layout:LayoutService,
    private _PermissionSystemService:PermissionSystemService
  ) {}

    private initBreadcrumb(): void {
    const containerKey = 'BREAD_CRUMB_TITLES.QUESTIONNAIRE';
    this.setBreadcrumb(containerKey, [
      { nameKey: containerKey },
      { nameKey: 'TEMPLATES.TEMPLATES_LIST',routerLink:'/gfw-portal/questionnaire/templates' },
      { nameKey: this.data?.questionnaireTemplateName, routerLink:`/gfw-portal/questionnaire/templates/${this.data?.questionnaireTemplateID}` },
      {nameKey:this.data?.name}
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
    this.getSectionId();
  }
  templateId: string = '';
  sectionId:string = ''
  getSectionId() {
    this._activatedRoute.paramMap.subscribe((res: any) => {
      this.templateId = res.get('templateId');
      this.sectionId = res.get('sectionId');
      if(!this.sectionId)return 
      this.getSectionById(this.sectionId);
    });
  }

  loadingData: boolean = false;
  data!: any;
  getSectionById(id: string) {
    this.loadingData = true;
    this._sectionS.getById(id).subscribe((res) => {
      const template_data = res?.data;
      this.data = template_data;
      this.loadingData = false;
      this.initBreadcrumb()
      console.log(template_data, 'tdata');
    });
  }
  tabs: any[] = [];
  handleTabs() {
    this.tabs = [
      {
        id: 2,
        name: this._translateS.instant('TEMPLATES.QUESTIONS_LIST'),
        icon: 'fi fi-rr-comment',
        router: 'questions',
        visible: ()=> this._PermissionSystemService.can('QUESTIONNAIRES', 'TEMPLATESSECTIONSQUESTIONS', 'VIEW')
      },
    ];
  }
}
