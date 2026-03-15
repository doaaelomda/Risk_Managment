// eslint-disable-next-line @nx/enforce-module-boundaries
import { ISection } from './../../../../../../../apps/gfw-portal/src/app/core/models/sections.interface';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideSectionsListComponent } from '../side-sections-list/side-sections-list.component';
import { Questions0controlComponent } from '../questions-control/questions0control.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LayoutService } from 'apps/gfw-portal/src/app/core/services/layout.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'lib-questionnaire-main',
  imports: [
    CommonModule,
    SideSectionsListComponent,
    Questions0controlComponent
  ],
  templateUrl: './questionnaire-main.component.html',
  styleUrl: './questionnaire-main.component.scss',
  standalone:true,
})
export class QuestionnaireMainComponent {
  constructor(private layoutService:LayoutService,private translateService:TranslateService){
    this.setBreadCrumb()
  }
  current_section!: ISection;
  setCurrentSection(event: ISection) {
    this.current_section = event;
    console.log(this.current_section, 'this.current_section');
  }
  progress: number = 0;
  handleProgressChange($event: number) {
    console.log($event,'event');
    
    this.progress = $event;
  }
    setBreadCrumb() {
    const breadCrumb = [
      {
        name: '',
        icon: 'fi fi-rs-home',
        routerLink: '/',
      },
      {
        name: this.translateService.instant('BREAD_CRUMB_TITLES.QUESTIONNAIRE'),
        icon: '',
        routerLink: '/gfw-portal/questionnaire/my-questionnaires',
      },
      {
        name: this.translateService.instant('MY_QUESTIONNAIRES.TABLE_TITLE'),
        icon: '',
      },
    ];
    this.layoutService.breadCrumbLinks.next(breadCrumb);
  }
}
