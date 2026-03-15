import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute,  RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TemplatesService } from '../../services/templates-service.service';
import { SkeletonModule } from "primeng/skeleton";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
import { SharedTabsComponent } from 'libs/shared/shared-ui/src/lib/shared-tabs/shared-tabs.component';

@Component({
  selector: 'lib-template-view',
  imports: [CommonModule, RouterOutlet, SkeletonModule,TranslateModule,SharedTabsComponent],
  templateUrl: './template-view.component.html',
  styleUrl: './template-view.component.scss',
})
export class TemplateViewComponent {
  constructor(
    private _translateS: TranslateService,
    private _templateS: TemplatesService,
    private _activatedRoute:ActivatedRoute,
    private layout:LayoutService,
    private _PermissionSystemService:PermissionSystemService

  ) {}

  private initBreadcrumb(): void {
    const containerKey = 'BREAD_CRUMB_TITLES.QUESTIONNAIRE';
    this.setBreadcrumb(containerKey, [
      { nameKey: containerKey },
      { nameKey: 'TEMPLATES.TEMPLATES_LIST',routerLink:'/gfw-portal/questionnaire/templates' },
      { nameKey: this.data?.name },
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



    ngOnInit(){
      this.handleTabs()
    this.getTemplateId()
    
  }
  templateId:string = ''
 getTemplateId() {
    this._activatedRoute.paramMap.subscribe(
      (res: any) => {
        this.templateId = res.get('templateId')
        if(!this.templateId)return
        this.getTemplateById(this.templateId)
      }
    );
  }

  loadingData:boolean = false
  data!:any
  getTemplateById(id: string) {
    this.loadingData = true
    this._templateS.getById(id).subscribe((res) => {
      const template_data = res?.data;
      this.data = template_data
      this.loadingData = false
      this.initBreadcrumb()
      console.log(template_data, 'tdata');
    });
  }
  tabs: any[] = [];
  handleTabs() {
    this.tabs = [

      {
        id: 2,
        name: this._translateS.instant('TEMPLATES.SECTIONS_LIST'),
        icon: 'fi fi-rr-comment',
        router: 'sections',
        visible: ()=> this._PermissionSystemService.can('QUESTIONNAIRES', 'TEMPLATESSECTIONS', 'VIEW')
      },
    ];
  }
}
