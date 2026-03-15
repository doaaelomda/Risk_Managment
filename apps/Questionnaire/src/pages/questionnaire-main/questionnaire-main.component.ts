import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { BreadCrumbComponent } from '../../components/breadCrumb/breadCrumb.component';
import { SideSectionsListComponent } from '../../components/side-sections-list/side-sections-list.component';
import { Questions0controlComponent } from '../../components/questions-control/questions0control.component';
import { Section } from '../../models/sections.interface';

@Component({
  selector: 'app-questionnaire-main',
  imports: [
    CommonModule,
    HeaderComponent,
    BreadCrumbComponent,
    SideSectionsListComponent,
    Questions0controlComponent,
  ],
  templateUrl: './questionnaire-main.component.html',
  styleUrl: './questionnaire-main.component.scss',
})
export class QuestionnaireMainComponent {
  current_section!: Section;
  setCurrentSection(event: Section) {
    this.current_section = event;
    console.log(this.current_section, 'this.current_section');
  }
  progress: number = 0;
  handleProgressChange($event: number) {
    console.log($event,'event');
    
    this.progress = $event;
  }
}
