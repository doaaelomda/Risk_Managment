import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { InstanceQuestionsService } from '../services/instance-questions.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { SharedTabsComponent } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'lib-view-instance-question',
  imports: [CommonModule, SkeletonModule, RouterOutlet,SharedTabsComponent],
  templateUrl: './view-instance-question.component.html',
  styleUrl: './view-instance-question.component.scss',
})
export class ViewInstanceQuestionComponent {
  constructor(
    private _translateS: TranslateService,
    private _activatedRoute: ActivatedRoute,
    private _questionsS: InstanceQuestionsService,
    private layout: LayoutService
  ) {
    const permissions = this._activatedRoute.snapshot.data['permissions']
    this.moduleName = permissions?.module
    this.featureName = permissions?.feature
  }

  moduleName!:string
  featureName!:string

  private initBreadcrumb(): void {
    const containerKey = 'BREAD_CRUMB_TITLES.QUESTIONNAIRE';
    this.setBreadcrumb(containerKey, [
      { nameKey: containerKey },
      {
        nameKey: 'TEMPLATES.TEMPLATES_LIST',
        routerLink: '/gfw-portal/questionnaire/instance',
      },
      {
        nameKey: this.data?.questionnaireInstanceName || '-',
        routerLink: `/gfw-portal/questionnaire/instance/${this.data?.questionnaireInstanceID}`,
      },
      {
        nameKey: this.data?.questionnaireInstanceSectionName || '-',
        routerLink: `/gfw-portal/questionnaire/instance/${this.data?.questionnaireInstanceID}/sections/${this.data?.questionnaireInstanceSectionID}`,
      },
      {nameKey:this.data?.questionnaireQuestionText || '-'}
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
    this.getQuestionId();
  }
  templateId: string = '';
  sectionId: string = '';
  questionId: string = '';
  getQuestionId() {
    this._activatedRoute.paramMap.subscribe((res: any) => {
      this.templateId = res.get('templateId');
      this.sectionId = res.get('sectionId');
      this.questionId = res.get('questionId');
      if (!this.questionId) return;
      this.getQuestionById(this.questionId);
    });
  }

  loadingData: boolean = false;
  data!: any;
  getQuestionById(id: string) {
    this.loadingData = true;
    this._questionsS.getById(id).subscribe((res) => {
      const template_data = res?.data;
      this.data = template_data;
      this._questionsS.viewedData.next(this.data)
      this.loadingData = false;
      this.initBreadcrumb()
      console.log(template_data, 'tdata');
    });
  }

  ngOnDestroy(){
    this._questionsS.viewedData.next(null)
  }
  tabs: any[] = [];
  handleTabs() {
    this.tabs = [
      {
        id: 1,
        name: this._translateS.instant('TABS.OVERVIEW'),
        icon: 'fi-rr-apps',
        router: 'overview',
      },
    ];
  }
}


