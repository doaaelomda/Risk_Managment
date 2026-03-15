/* eslint-disable @nx/enforce-module-boundaries */
import { Component, effect, input, output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { ISection } from 'apps/gfw-portal/src/app/core/models/sections.interface';
import { catchError, finalize, of, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MyQuestionnairesService } from '../../services/my-questionnaires.service';
import { SkeletonModule } from 'primeng/skeleton';
@Component({
  selector: 'lib-side-sections-list',
  imports: [CommonModule, ProgressBarModule, TranslateModule, SkeletonModule],
  templateUrl: './side-sections-list.component.html',
  styleUrl: './side-sections-list.component.scss',
})
export class SideSectionsListComponent {
  constructor(
    private _questionnaireS: MyQuestionnairesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    effect(() => {
      const submittions = this._questionnaireS.submittion();
      if (submittions === 0) return;
      this.moveToNextSection();
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.instanceId = +id;
    this.getQuestionSections();
  }
  moveToNextSection() {
    const currentSectionIndex = this.question_sections.findIndex(
      (section) => section.id === this.selected_sec.id
    );
    console.log(
      this.question_sections[currentSectionIndex + 1],
      'this.question_sections[currentSectionIndex + 1]'
    );

    if (!this.question_sections[currentSectionIndex + 1]) {
      setTimeout(
        () =>
          this.router.navigate(['/gfw-portal/questionnaire/my-questionnaires']),
        1000
      );
      return;
    }
    this.handleSectionClick(this.question_sections[currentSectionIndex + 1]);
  }
  ngOnDestroy() {
    this._questionnaireS.submittion.set(0);
  }
  selected_sec!: ISection;
  Selection_Emitter$ = output<ISection>();
  progressInput = input<number>();
  progress: number = 0;
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes, 'changes');

    const progressChange = changes['progressInput'];
    if (progressChange) {
      if (progressChange.currentValue >= 100) {
        this.progress = 100;
        return;
      }
      this.progress = progressChange.currentValue;
    }
  }

  question_sections: ISection[] = [];

  dataSub!: Subscription;
  loadingQuestions: boolean = false;
  handleSectionClick(section: any) {
    console.log(section, 'section');
    this.loadingQuestions = true;
    this._questionnaireS.loadingQuestions.set(this.loadingQuestions);
    this._questionnaireS
      .getSectionQuestions(this.instanceId, section.id)
      .pipe(
        catchError((err) => {
          console.error('Error getting section questions', err);
          return of({ data: [] });
        }),
        finalize(() => {
          this.loadingQuestions = false;
          this._questionnaireS.loadingQuestions.set(this.loadingQuestions);
        })
      )
      .subscribe((res) => {
        if (!res) return;
        this.selected_sec = { ...section, questions: res.data || [] };
        this.Selection_Emitter$.emit(this.selected_sec);

        console.log(this.selected_sec, 'selected sec');
      });
  }
  instanceId!: number;
  loadingSections: boolean = false;
  getQuestionSections() {
    this.loadingSections = true;
    this._questionnaireS
      .getInstanceDetails(this.instanceId)
      .pipe(
        catchError((err) => {
          console.error('Error getting sections', err);
          return of([]);
        }),
        finalize(() => (this.loadingSections = false))
      )
      .subscribe((res) => {
        this.question_sections = res.data || [];
        if (this.question_sections.length) {
          this.handleSectionClick(this.question_sections[0]);
        }
      });
  }
}
